import geminiService from '../geminiService.js';
import openRouterService from './OpenRouterService.js';
import ollamaService from './OllamaService.js';

/**
 * Intelligent AI Router
 * 3-Tier system: Gemini (free) → Ollama (free) → OpenRouter (paid)
 * Ensures zero downtime with automatic failover
 */
class IntelligentAIRouter {
    constructor() {
        // Provider health tracking (circuit breaker pattern)
        this.providerHealth = new Map([
            ['gemini', { healthy: true, failures: 0, lastCheck: Date.now() }],
            ['ollama', { healthy: true, failures: 0, lastCheck: Date.now() }],
            ['openrouter', { healthy: true, failures: 0, lastCheck: Date.now() }]
        ]);

        // Gemini rate limit tracking
        this.geminiRequests = {
            perMinute: [],
            perDay: []
        };

        // Circuit breaker configuration
        this.CIRCUIT_BREAKER = {
            failureThreshold: 3, // Open circuit after 3 failures
            resetTimeout: 60000 // Reset after 1 minute
        };

        // Gemini free tier limits
        this.GEMINI_LIMITS = {
            perMinute: 15,
            perDay: 1500
        };

        // Cost tracking
        this.costTracker = {
            gemini: { requests: 0, cost: 0 },
            ollama: { requests: 0, cost: 0 },
            openrouter: { requests: 0, cost: 0 }
        };
    }

    /**
     * Main entry point - guarantees a response
     * Tries providers in order: Gemini → Ollama → OpenRouter
     * @param {string} prompt - User prompt
     * @param {object} config - Configuration options
     * @returns {Promise<object>} AI response with provider info
     */
    async generateContent(prompt, config = {}) {
        const providers = this.getProviderPriority();

        let lastError = null;
        let attemptedProviders = [];

        for (const provider of providers) {
            try {
                console.log(`[AI Router] Attempting provider: ${provider}`);
                attemptedProviders.push(provider);

                const result = await this.executeWithProvider(provider, prompt, config);

                // Success! Mark provider as healthy
                this.markHealthy(provider);

                // Track usage
                this.trackUsage(provider, result.cost || 0);

                return {
                    ...result,
                    provider,
                    fallbackUsed: provider !== providers[0],
                    attemptedProviders
                };

            } catch (error) {
                console.error(`[AI Router] ${provider} failed:`, error.message);
                lastError = error;

                // Mark provider as unhealthy
                this.markUnhealthy(provider);

                // Continue to next provider
                continue;
            }
        }

        // All providers failed - this should be extremely rare
        throw new Error(`All AI providers failed. Attempted: ${attemptedProviders.join(', ')}. Last error: ${lastError?.message}`);
    }

    /**
     * Generate structured JSON output
     * @param {string} prompt - User prompt
     * @param {object} schema - JSON schema
     * @param {object} config - Configuration options
     * @returns {Promise<object>} Parsed JSON response
     */
    async generateStructuredContent(prompt, schema, config = {}) {
        const providers = this.getProviderPriority();

        for (const provider of providers) {
            try {
                console.log(`[AI Router] Attempting structured generation with: ${provider}`);

                let result;
                switch (provider) {
                    case 'gemini':
                        if (!this.canUseGemini()) continue;
                        this.trackGeminiRequest();
                        result = await geminiService.generateStructuredContent(
                            'gemini-2.0-flash-exp',
                            prompt,
                            schema
                        );
                        break;

                    case 'ollama':
                        if (!(await ollamaService.isAvailable())) continue;
                        result = await ollamaService.generateStructuredContent(
                            config.model || 'llama3',
                            prompt,
                            schema
                        );
                        break;

                    case 'openrouter':
                        result = await openRouterService.generateStructuredContent(
                            config.model || 'anthropic/claude-3-haiku',
                            prompt,
                            schema
                        );
                        break;
                }

                this.markHealthy(provider);
                this.trackUsage(provider, result.cost || 0);

                return result;

            } catch (error) {
                console.error(`[AI Router] ${provider} structured generation failed:`, error.message);
                this.markUnhealthy(provider);
                continue;
            }
        }

        throw new Error('All providers failed for structured generation');
    }

    /**
     * Get provider priority based on health and availability
     * Priority: Gemini (free) → Ollama (free) → OpenRouter (paid)
     * @returns {Array<string>} Ordered list of providers to try
     */
    getProviderPriority() {
        const priority = [];

        // Tier 1: Try Gemini first if under rate limit and healthy
        if (this.canUseGemini() && this.isHealthy('gemini')) {
            priority.push('gemini');
        }

        // Tier 2: Ollama as free backup (if healthy)
        if (this.isHealthy('ollama')) {
            priority.push('ollama');
        }

        // Tier 3: OpenRouter as paid fallback (always try if others fail)
        if (this.isHealthy('openrouter') && process.env.OPENROUTER_API_KEY) {
            priority.push('openrouter');
        }

        // Fallback: Add Gemini even if rate limited (might work)
        if (!priority.includes('gemini') && this.isHealthy('gemini')) {
            priority.push('gemini');
        }

        return priority;
    }

    /**
     * Execute request with specific provider
     * @param {string} provider - Provider name
     * @param {string} prompt - User prompt
     * @param {object} config - Configuration
     * @returns {Promise<object>} Provider response
     */
    async executeWithProvider(provider, prompt, config) {
        switch (provider) {
            case 'gemini':
                this.trackGeminiRequest();
                return await geminiService.generateContent(
                    'gemini-2.0-flash-exp',
                    prompt,
                    config
                );

            case 'ollama':
                // Check if Ollama is available before attempting
                if (!(await ollamaService.isAvailable())) {
                    throw new Error('Ollama is not available');
                }
                return await ollamaService.generateContent(
                    config.model || 'llama3',
                    prompt,
                    config
                );

            case 'openrouter':
                return await openRouterService.generateContent(
                    config.model || 'anthropic/claude-3-haiku', // Default to cheapest
                    prompt,
                    config
                );

            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    /**
     * Check if Gemini is under rate limit
     * @returns {boolean} True if Gemini can be used
     */
    canUseGemini() {
        const now = Date.now();
        const oneMinuteAgo = now - 60 * 1000;
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        // Clean old entries
        this.geminiRequests.perMinute = this.geminiRequests.perMinute
            .filter(t => t > oneMinuteAgo);
        this.geminiRequests.perDay = this.geminiRequests.perDay
            .filter(t => t > oneDayAgo);

        // Check limits
        return this.geminiRequests.perMinute.length < this.GEMINI_LIMITS.perMinute &&
            this.geminiRequests.perDay.length < this.GEMINI_LIMITS.perDay;
    }

    /**
     * Track Gemini request for rate limiting
     */
    trackGeminiRequest() {
        const now = Date.now();
        this.geminiRequests.perMinute.push(now);
        this.geminiRequests.perDay.push(now);
    }

    /**
     * Check if provider is healthy (circuit breaker pattern)
     * @param {string} provider - Provider name
     * @returns {boolean} True if healthy
     */
    isHealthy(provider) {
        const health = this.providerHealth.get(provider);
        if (!health) return false;

        // If circuit is open (too many failures), check if timeout has passed
        if (!health.healthy) {
            const timeSinceLastCheck = Date.now() - health.lastCheck;
            if (timeSinceLastCheck > this.CIRCUIT_BREAKER.resetTimeout) {
                // Reset circuit breaker
                console.log(`[AI Router] Resetting circuit breaker for ${provider}`);
                health.healthy = true;
                health.failures = 0;
                health.lastCheck = Date.now();
            }
        }

        return health.healthy;
    }

    /**
     * Mark provider as healthy after successful request
     * @param {string} provider - Provider name
     */
    markHealthy(provider) {
        const health = this.providerHealth.get(provider);
        if (health) {
            health.healthy = true;
            health.failures = 0;
            health.lastCheck = Date.now();
        }
    }

    /**
     * Mark provider as unhealthy after failed request
     * @param {string} provider - Provider name
     */
    markUnhealthy(provider) {
        const health = this.providerHealth.get(provider);
        if (health) {
            health.failures++;
            health.lastCheck = Date.now();

            // Open circuit breaker if too many failures
            if (health.failures >= this.CIRCUIT_BREAKER.failureThreshold) {
                health.healthy = false;
                console.warn(`[AI Router] Circuit breaker opened for ${provider} after ${health.failures} failures`);
            }
        }
    }

    /**
     * Track usage and cost
     * @param {string} provider - Provider name
     * @param {number} cost - Cost in USD
     */
    trackUsage(provider, cost) {
        if (this.costTracker[provider]) {
            this.costTracker[provider].requests++;
            this.costTracker[provider].cost += cost;
        }
    }

    /**
     * Get router status for monitoring
     * @returns {object} Router status
     */
    getStatus() {
        return {
            providers: Object.fromEntries(this.providerHealth),
            geminiUsage: {
                perMinute: this.geminiRequests.perMinute.length,
                perDay: this.geminiRequests.perDay.length,
                limits: this.GEMINI_LIMITS,
                canUse: this.canUseGemini()
            },
            priority: this.getProviderPriority(),
            costs: this.costTracker
        };
    }

    /**
     * Reset all tracking (useful for testing)
     */
    reset() {
        this.geminiRequests = { perMinute: [], perDay: [] };
        this.costTracker = {
            gemini: { requests: 0, cost: 0 },
            ollama: { requests: 0, cost: 0 },
            openrouter: { requests: 0, cost: 0 }
        };

        // Reset health status
        for (const [provider, health] of this.providerHealth) {
            health.healthy = true;
            health.failures = 0;
            health.lastCheck = Date.now();
        }
    }
}

export default new IntelligentAIRouter();
