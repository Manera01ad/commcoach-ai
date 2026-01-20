/**
 * Stripe Service
 * Handles Stripe payment processing
 */

import Stripe from 'stripe';

class StripeService {
    constructor() {
        if (process.env.STRIPE_SECRET_KEY) {
            this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        } else {
            console.warn('⚠️ STRIPE_SECRET_KEY is missing. Stripe functionality will be disabled.');
        }
    }

    /**
     * Create checkout session for Founder's Circle
     */
    async createFounderCheckout(userId, amount, currency = 'USD') {
        try {
            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: currency.toLowerCase(),
                            product_data: {
                                name: "CommCoach AI - Founder's Circle",
                                description: 'Lifetime access + 20% referral commission',
                                images: ['https://your-domain.com/founder-badge.png']
                            },
                            unit_amount: amount * 100 // Convert to cents
                        },
                        quantity: 1
                    }
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/founder/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/founder/cancel`,
                client_reference_id: userId,
                metadata: {
                    userId,
                    type: 'founder_membership',
                    product: 'CommCoach AI Founders Circle'
                }
            });

            return {
                sessionId: session.id,
                url: session.url
            };
        } catch (error) {
            console.error('[StripeService] Error creating checkout:', error);
            throw error;
        }
    }

    /**
     * Verify payment session
     */
    async verifyPayment(sessionId) {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            return session.payment_status === 'paid';
        } catch (error) {
            console.error('[StripeService] Error verifying payment:', error);
            return false;
        }
    }

    /**
     * Get payment session details
     */
    async getSession(sessionId) {
        try {
            const session = await this.stripe.checkout.sessions.retrieve(sessionId);
            return session;
        } catch (error) {
            console.error('[StripeService] Error fetching session:', error);
            throw error;
        }
    }

    /**
     * Create refund
     */
    async createRefund(paymentIntentId, amount) {
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount * 100
            });
            return refund;
        } catch (error) {
            console.error('[StripeService] Error creating refund:', error);
            throw error;
        }
    }

    /**
     * Handle webhook events
     */
    async handleWebhook(payload, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );

            return event;
        } catch (error) {
            console.error('[StripeService] Webhook error:', error);
            throw error;
        }
    }
}

export default new StripeService();
