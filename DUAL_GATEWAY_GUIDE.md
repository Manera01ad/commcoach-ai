# 🚀 DUAL GATEWAY IMPLEMENTATION GUIDE

**Complete step-by-step plan for Razorpay + Stripe integration**

---

## 📅 **TIMELINE: 2 DAYS**

### **Day 1: Backend Setup**
### **Day 2: Frontend Integration & Testing**

---

## **DAY 1: BACKEND SETUP**

### **Morning: Account Setup (1 hour)**

#### **Step 1: Razorpay Account (30 min)**
1. Go to https://razorpay.com
2. Click "Sign Up"
3. Fill business details:
   - Business Name: CommCoach AI
   - Business Type: Startup/SaaS
   - Email: your@email.com
4. Complete KYC:
   - Upload Aadhaar
   - Upload PAN
   - Bank account details
5. Get Test API Keys:
   - Dashboard → Settings → API Keys
   - Copy Key ID and Secret

#### **Step 2: Stripe Account (30 min)**
1. Go to https://stripe.com
2. Click "Start now"
3. Fill business details:
   - Business Name: CommCoach AI
   - Country: India
   - Business Type: SaaS
4. Get Test API Keys:
   - Dashboard → Developers → API Keys
   - Copy Publishable and Secret keys

---

### **Afternoon: Backend Integration (4 hours)**

#### **Step 3: Install Dependencies (5 min)**

```bash
cd backend
npm install razorpay stripe
```

#### **Step 4: Environment Variables (5 min)**

Update `.env`:

```bash
# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### **Step 5: Backend Services (Already Created!)**

Files created:
- ✅ `backend/services/PaymentService.js`
- ✅ `backend/services/RazorpayService.js`
- ✅ `backend/services/StripeService.js`

#### **Step 6: API Routes (30 min)**

Create `backend/routes/founders.js`:

```javascript
import express from 'express';
import PaymentService from '../services/PaymentService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create checkout (auto-selects gateway)
router.post('/create-checkout', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const userIp = req.ip || req.headers['x-forwarded-for'];
    
    const result = await PaymentService.createFounderCheckout(userId, userIp);
    res.json(result);
  } catch (error) {
    console.error('Error creating checkout:', error);
    res.status(500).json({ error: 'Failed to create checkout' });
  }
});

// Verify Razorpay payment
router.post('/verify-razorpay', authenticate, async (req, res) => {
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
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Verify Stripe payment
router.post('/verify-stripe', authenticate, async (req, res) => {
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
```

#### **Step 7: Update server.js (5 min)**

Add to `backend/server.js`:

```javascript
import foundersRoutes from './routes/founders.js';

// Mount routes
app.use('/api/founders', foundersRoutes);
```

#### **Step 8: Test Backend (30 min)**

```bash
# Start server
npm run dev

# Test endpoint
curl http://localhost:3001/api/founders/create-checkout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## **DAY 2: FRONTEND INTEGRATION**

### **Morning: Frontend Components (3 hours)**

#### **Step 9: Install Stripe.js (5 min)**

```bash
cd frontend
npm install @stripe/stripe-js
```

#### **Step 10: Add Razorpay Script (2 min)**

Update `frontend/index.html`:

```html
<head>
  <!-- Razorpay Checkout -->
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
```

#### **Step 11: Create FoundersLanding Component**

Already created! Just need to update with dual gateway support.

---

### **Afternoon: Testing & Deployment (3 hours)**

#### **Step 12: Test Razorpay (30 min)**

Test cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

#### **Step 13: Test Stripe (30 min)**

Test cards:
- Card: 4242 4242 4242 4242
- CVV: Any 3 digits
- Expiry: Any future date

#### **Step 14: Deploy (1 hour)**

```bash
# Commit changes
git add .
git commit -m "Dual gateway integration complete"
git push origin main

# Railway auto-deploys backend
# Vercel auto-deploys frontend
```

---

## 📊 **TESTING CHECKLIST:**

### **Razorpay Testing:**
- [ ] Indian user sees Razorpay checkout
- [ ] Payment completes successfully
- [ ] Webhook receives confirmation
- [ ] Membership created in database
- [ ] Referral code generated

### **Stripe Testing:**
- [ ] International user sees Stripe checkout
- [ ] Payment completes successfully
- [ ] Redirect to success page
- [ ] Membership created in database
- [ ] Referral code generated

### **Smart Routing:**
- [ ] VPN to India → Razorpay
- [ ] VPN to USA → Stripe
- [ ] Correct currency displayed
- [ ] Correct pricing shown

---

## 🎯 **SUCCESS CRITERIA:**

- ✅ Both gateways working
- ✅ Smart routing functional
- ✅ Payments verified
- ✅ Memberships created
- ✅ Referral codes generated
- ✅ No errors in logs

---

## 💰 **PRICING SUMMARY:**

| Region | Gateway | Price | Currency |
|--------|---------|-------|----------|
| India | Razorpay | ₹40,000 | INR |
| USA | Stripe | $500 | USD |
| UK | Stripe | £395 | GBP |
| Europe | Stripe | €465 | EUR |
| Others | Stripe | $500 | USD |

---

## 🚀 **DEPLOYMENT TIMELINE:**

**Day 1 (Tomorrow):**
- Morning: Setup accounts
- Afternoon: Backend integration
- Evening: Test locally

**Day 2 (Day After):**
- Morning: Frontend integration
- Afternoon: End-to-end testing
- Evening: Deploy to production

**Day 3 (Launch):**
- Go live!
- Monitor payments
- Fix any issues

---

## 📝 **ENVIRONMENT VARIABLES CHECKLIST:**

```bash
# Backend .env
✅ RAZORPAY_KEY_ID
✅ RAZORPAY_KEY_SECRET
✅ STRIPE_PUBLISHABLE_KEY
✅ STRIPE_SECRET_KEY
✅ STRIPE_WEBHOOK_SECRET
✅ FRONTEND_URL

# Frontend .env
✅ VITE_RAZORPAY_KEY_ID
✅ VITE_STRIPE_PUBLISHABLE_KEY
✅ VITE_API_URL
```

---

## 🎉 **YOU'RE READY!**

All backend services are created!

**Next steps:**
1. Create accounts tomorrow
2. Add API keys to .env
3. Test locally
4. Deploy!

**Total time:** 2 days to complete dual gateway setup!

---

**Last Updated:** 2026-01-20 20:52 PM  
**Status:** Backend services ready, accounts needed  
**Next:** Create Razorpay + Stripe accounts tomorrow
