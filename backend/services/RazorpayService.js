/**
 * Razorpay Service
 * Handles Razorpay payment processing
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';

class RazorpayService {
    constructor() {
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
            this.razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            });
        } else {
            console.warn('⚠️ RAZORPAY keys are missing. Razorpay functionality will be disabled.');
        }
    }

    /**
     * Create order for Founder's Circle
     */
    async createFounderOrder(userId, amount = 40000, currency = 'INR') {
        try {
            const options = {
                amount: amount * 100, // Convert to subunit
                currency: currency,
                receipt: `founder_${userId}_${Date.now()}`,
                notes: {
                    userId,
                    type: 'founder_membership',
                    product: 'CommCoach AI Founders Circle'
                }
            };

            const order = await this.razorpay.orders.create(options);

            return {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID
            };
        } catch (error) {
            console.error('[RazorpayService] Error creating order:', error);
            throw error;
        }
    }

    /**
     * Verify payment signature
     */
    verifyPayment(orderId, paymentId, signature) {
        try {
            const text = `${orderId}|${paymentId}`;
            const generated = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(text)
                .digest('hex');

            return generated === signature;
        } catch (error) {
            console.error('[RazorpayService] Error verifying payment:', error);
            return false;
        }
    }

    /**
     * Get payment details
     */
    async getPayment(paymentId) {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            return payment;
        } catch (error) {
            console.error('[RazorpayService] Error fetching payment:', error);
            throw error;
        }
    }

    /**
     * Create refund
     */
    async createRefund(paymentId, amount) {
        try {
            const refund = await this.razorpay.payments.refund(paymentId, {
                amount: amount * 100,
                speed: 'normal'
            });
            return refund;
        } catch (error) {
            console.error('[RazorpayService] Error creating refund:', error);
            throw error;
        }
    }
}

export default new RazorpayService();
