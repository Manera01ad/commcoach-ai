import express from 'express';
import PaymentService from '../services/PaymentService.js';
import StripeService from '../services/StripeService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create checkout (auto-selects gateway)
router.post('/create-checkout', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const userIp = req.ip || req.headers['x-forwarded-for'];

        // Default to Stripe if IP lookup fails or sets to localhost
        // in production we would use a geo-ip service here
        const result = await PaymentService.createFounderCheckout(userId, userIp);
        res.json(result);
    } catch (error) {
        console.error('Error creating checkout:', error);
        res.status(500).json({ error: 'Failed to create checkout' });
    }
});

// Verify Razorpay payment
router.post('/verify-razorpay', authenticateToken, async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;
        const userId = req.user.id;

        const verified = await PaymentService.verifyPayment('razorpay', {
            orderId,
            paymentId,
            signature
        });

        if (verified.success) {
            const membership = await PaymentService.createFounderMembership(
                userId,
                { amount: 40000, paymentId },
                'razorpay'
            );
            res.json(membership);
        } else {
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment', details: error.message });
    }
});

// Verify Stripe payment
router.post('/verify-stripe', authenticateToken, async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        const verified = await PaymentService.verifyPayment('stripe', { sessionId });

        if (verified.success) {
            const session = await StripeService.getSession(sessionId);
            const membership = await PaymentService.createFounderMembership(
                userId,
                { amount: session.amount_total / 100, paymentId: session.payment_intent },
                'stripe'
            );
            res.json(membership);
        } else {
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

export default router;
