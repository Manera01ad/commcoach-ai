/**
 * Dual Payment Gateway Service
 * Intelligently routes payments between Razorpay and Stripe
 */

import RazorpayService from './RazorpayService.js';
import StripeService from './StripeService.js';
import { supabase } from '../config/supabase.js';

class PaymentService {
    /**
     * Detect user location from IP
     */
    async getUserLocation(ip) {
        try {
            // Development/Localhost fallback
            if (ip === '::1' || ip === '127.0.0.1' || !ip) {
                return { country: 'US', currency: 'USD', timezone: 'UTC' };
            }

            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            if (!response.ok) throw new Error('IP API failed');
            const data = await response.json();
            return {
                country: data.country_code || 'US',
                currency: data.currency || 'USD',
                timezone: data.timezone || 'UTC'
            };
        } catch (error) {
            console.error('Error detecting location:', error);
            return { country: 'US', currency: 'USD', timezone: 'UTC' };
        }
    }

    /**
     * Select appropriate payment gateway based on country and key availability
     */
    selectGateway(country) {
        const stripeReady = !!process.env.STRIPE_SECRET_KEY;
        const razorpayReady = !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;

        // Case 1: Manual Override / Solo Gateway
        if (!stripeReady && razorpayReady) {
            return {
                gateway: 'razorpay',
                reason: 'Razorpay is the only active gateway'
            };
        }

        if (stripeReady && !razorpayReady) {
            return {
                gateway: 'stripe',
                reason: 'Stripe is the only active gateway'
            };
        }

        // Case 2: Geographic Routing (Both available)
        const razorpayCountries = ['IN', 'BD', 'LK', 'NP', 'PK'];
        if (razorpayCountries.includes(country)) {
            return {
                gateway: 'razorpay',
                reason: 'Geographic preference (South Asia)'
            };
        }

        return {
            gateway: 'stripe',
            reason: 'Geographic preference (Global)'
        };
    }

    /**
     * Get pricing based on country
     */
    getPricing(country) {
        const pricing = {
            // India - INR pricing
            IN: { amount: 40000, currency: 'INR', display: '₹40,000' },

            // USA - USD pricing
            US: { amount: 500, currency: 'USD', display: '$500' },

            // UK - GBP pricing
            GB: { amount: 395, currency: 'GBP', display: '£395' },

            // Europe - EUR pricing (EU countries)
            DE: { amount: 465, currency: 'EUR', display: '€465' },
            FR: { amount: 465, currency: 'EUR', display: '€465' },
            IT: { amount: 465, currency: 'EUR', display: '€465' },
            ES: { amount: 465, currency: 'EUR', display: '€465' },

            // Default - USD
            default: { amount: 500, currency: 'USD', display: '$500' }
        };

        return pricing[country] || pricing.default;
    }

    /**
     * Create Founder's Circle checkout
     */
    async createFounderCheckout(userId, userIp) {
        try {
            // Detect location
            const location = await this.getUserLocation(userIp);

            // Select gateway
            const { gateway, reason } = this.selectGateway(location.country);

            // Get pricing
            const pricing = this.getPricing(location.country);

            // Create checkout based on gateway
            let checkout;
            if (gateway === 'razorpay') {
                checkout = await RazorpayService.createFounderOrder(userId, pricing.amount, pricing.currency);
            } else {
                checkout = await StripeService.createFounderCheckout(userId, pricing.amount, pricing.currency);
            }

            return {
                success: true,
                gateway,
                pricing,
                checkout,
                location
            };
        } catch (error) {
            console.error('[PaymentService] Error creating checkout:', error);
            throw error;
        }
    }

    /**
     * Verify payment after completion
     */
    async verifyPayment(gateway, paymentData) {
        try {
            let verified = false;

            if (gateway === 'razorpay') {
                verified = RazorpayService.verifyPayment(
                    paymentData.orderId,
                    paymentData.paymentId,
                    paymentData.signature
                );
            } else if (gateway === 'stripe') {
                verified = await StripeService.verifyPayment(paymentData.sessionId);
            }

            if (!verified) {
                throw new Error('Payment verification failed');
            }

            return { success: true, verified: true };
        } catch (error) {
            console.error('[PaymentService] Error verifying payment:', error);
            throw error;
        }
    }

    /**
     * Create founder membership after successful payment
     */
    async createFounderMembership(userId, paymentData, gateway) {
        try {
            // Generate unique referral code
            const { data: codeData, error: codeError } = await supabase
                .rpc('generate_referral_code');

            if (codeError) throw codeError;

            const referralCode = codeData;

            // Create founder membership
            const { data, error } = await supabase
                .from('founder_memberships')
                .insert({
                    user_id: userId,
                    membership_type: 'paid',
                    amount_paid: paymentData.amount,
                    stripe_payment_id: gateway === 'stripe' ? paymentData.paymentId : null,
                    referral_code: referralCode,
                    status: 'active'
                })
                .select()
                .single();

            if (error) throw error;

            // Update user's subscription tier to 'pro' or 'founder' if we had that tier
            await supabase
                .from('profiles')
                .update({ subscription_tier: 'pro' }) // Founder implies at least Pro
                .eq('id', userId);

            return {
                success: true,
                membership: data,
                referralCode
            };
        } catch (error) {
            console.error('[PaymentService] Error creating membership:', error);
            throw error;
        }
    }

    /**
     * Get founder stats for a user
     */
    async getFounderStats(userId) {
        try {
            const { data, error } = await supabase
                .rpc('get_founder_stats', { p_user_id: userId });

            if (error) {
                // If the user is not a founder, the RPC might return an error or null
                if (error.message.includes('Not a founder')) {
                    return { isFounder: false };
                }
                throw error;
            }

            return {
                success: true,
                isFounder: true,
                ...data
            };
        } catch (error) {
            console.error('[PaymentService] Error getting founder stats:', error);
            return { isFounder: false, error: error.message };
        }
    }
}

export default new PaymentService();
