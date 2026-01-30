import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export const initSentry = (app) => {
    const dsn = process.env.SENTRY_DSN;

    if (!dsn) {
        console.warn('⚠️ SENTRY_DSN not found. Error tracking disabled.');
        return;
    }

    Sentry.init({
        dsn: dsn,
        integrations: [
            nodeProfilingIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        environment: process.env.NODE_ENV || 'development',
        debug: process.env.NODE_ENV !== 'production',
    });

    // In v10+, the request handler is automatically integrated if we use the Express middleware correctly
    // However, we can use the manual setup if needed. 
    // For modern Sentry, we often call setupExpressErrorHandler later.

    console.log('✅ Sentry initialized in', process.env.NODE_ENV || 'development', 'mode');
};

/**
 * Error handler must be after controllers but before other error middleware
 */
export const sentryErrorHandler = (app) => {
    Sentry.setupExpressErrorHandler(app);
};
