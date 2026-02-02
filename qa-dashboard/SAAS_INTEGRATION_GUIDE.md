# SaaS Metrics Integration Guide

## Overview
This guide explains how to integrate the SaaS metrics system with your QA Dashboard using Supabase as the backend database.

## What's Been Created

### 1. Database Schema (`database/saas_metrics_schema.sql`)
A comprehensive Supabase schema that includes:
- **Subscription Plans**: Manage different pricing tiers (Free, Pro, Enterprise)
- **User Subscriptions**: Track user subscription status and billing
- **Revenue Transactions**: Record all payment transactions
- **Token Usage**: Monitor AI token consumption and costs
- **Support Tickets**: Customer support ticket system
- **User Activity**: Track user engagement
- **User Moderation**: Ban/suspend user management
- **Daily Metrics**: Aggregated SaaS metrics for dashboards

### 2. API Route (`src/app/api/saas-metrics/route.ts`)
A Next.js API route that:
- Fetches real-time SaaS metrics from Supabase
- Calculates MRR, growth rates, and health scores
- Generates AI-powered recommendations
- Returns formatted data for the dashboard

### 3. Custom Hook (`src/hooks/useSaasMetrics.ts`)
A React hook that:
- Fetches SaaS metrics from the API
- Auto-refreshes data every 30 seconds
- Handles loading and error states
- Provides type-safe data access

### 4. SaaS Admin Dashboard (`src/app/saas-admin/page.tsx`)
A beautiful admin interface that displays:
- Monthly Recurring Revenue (MRR) and growth
- Active/total user counts
- Token usage and costs
- Support ticket metrics
- Revenue trends
- AI-powered recommendations
- Real-time alerts

## Setup Instructions

### Step 1: Deploy the Database Schema

1. Open your Supabase project dashboard at [https://supabase.com/dashboard](https://supabase.com/dashboard)

2. Navigate to the **SQL Editor** section

3. Create a new query and paste the contents of `database/saas_metrics_schema.sql`

4. Run the query to create all tables, views, indexes, and RLS policies

### Step 2: Verify Environment Variables

Make sure your `.env` file in the `qa-dashboard` directory contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jmaerbneeavezfrvttzq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Install Dependencies (if needed)

```powershell
cd qa-dashboard
npm install
```

### Step 4: Run the Development Server

```powershell
npm run dev
```

### Step 5: Access the Dashboards

- **QA Dashboard**: http://localhost:3000
- **SaaS Admin**: http://localhost:3000/saas-admin

## Database Tables Overview

### Core Tables

1. **subscription_plans**
   - Stores available subscription tiers
   - Pre-seeded with Free, Pro, and Enterprise plans

2. **user_subscriptions**
   - Links users to their subscription plans
   - Tracks billing cycles and payment status

3. **revenue_transactions**
   - Records all payment events
   - Supports Razorpay and Stripe

4. **token_usage**
   - Tracks AI token consumption per user
   - Calculates costs for unit economics

5. **support_tickets**
   - Manages customer support requests
   - Tracks resolution times

6. **saas_metrics_daily**
   - Daily aggregated metrics
   - Used for trend charts and historical analysis

### Views for Analytics

- **current_mrr**: Real-time MRR calculation
- **token_usage_summary**: Daily token usage per user
- **support_metrics**: Support team performance

## Populating Test Data

To see the dashboard in action, you'll need to populate some test data. Here's a sample SQL script:

```sql
-- Insert test user subscription
INSERT INTO user_subscriptions (user_id, plan_id, status, billing_cycle, current_period_start, current_period_end)
SELECT 
  auth.uid(),
  (SELECT id FROM subscription_plans WHERE name = 'pro'),
  'active',
  'monthly',
  NOW(),
  NOW() + INTERVAL '30 days'
WHERE auth.uid() IS NOT NULL;

-- Insert test revenue transaction
INSERT INTO revenue_transactions (user_id, amount, currency, payment_gateway, payment_status, transaction_type)
SELECT 
  auth.uid(),
  29.00,
  'USD',
  'razorpay',
  'completed',
  'subscription'
WHERE auth.uid() IS NOT NULL;

-- Insert test token usage
INSERT INTO token_usage (user_id, tokens_used, model_used, cost_usd)
SELECT 
  auth.uid(),
  5000,
  'gpt-4',
  0.25
WHERE auth.uid() IS NOT NULL;

-- Insert daily metrics for trends
INSERT INTO saas_metrics_daily (date, mrr, active_users, total_users, total_token_usage, total_token_cost)
VALUES 
  (CURRENT_DATE - 6, 1000, 50, 60, 100000, 50),
  (CURRENT_DATE - 5, 1200, 55, 65, 120000, 60),
  (CURRENT_DATE - 4, 1400, 60, 70, 140000, 70),
  (CURRENT_DATE - 3, 1600, 65, 75, 160000, 80),
  (CURRENT_DATE - 2, 1800, 70, 80, 180000, 90),
  (CURRENT_DATE - 1, 2000, 75, 85, 200000, 100),
  (CURRENT_DATE, 2200, 80, 90, 220000, 110);
```

## Features

### Real-Time Metrics
- MRR and growth tracking
- Active user monitoring
- Token cost analysis
- Support ticket tracking

### AI Recommendations
The system automatically generates recommendations based on:
- Token cost efficiency (revenue per token)
- Support load
- Growth rate

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Admin operations require service role

### Auto-Refresh
- Dashboard auto-refreshes every 30 seconds
- Manual refresh available
- Loading states for better UX

## Integration with Main QA Dashboard

The SaaS admin dashboard is accessible from the main QA dashboard via a button in the top-right corner:

```tsx
<Link href="/saas-admin">
  Go to SaaS Control Plane
</Link>
```

## Customization

### Changing Refresh Interval

Edit `src/app/saas-admin/page.tsx`:

```typescript
const { data, isLoading, error } = useSaasMetrics(60000); // 60 seconds
```

### Adding New Metrics

1. Add columns to `saas_metrics_daily` table
2. Update the API route to calculate new metrics
3. Update the `SaasMetrics` interface in `useSaasMetrics.ts`
4. Add new cards to the dashboard

### Modifying Subscription Plans

Edit the seed data in `database/saas_metrics_schema.sql` or insert via SQL:

```sql
INSERT INTO subscription_plans (name, display_name, price_monthly, token_limit, features)
VALUES (
  'startup',
  'Startup Plan',
  49.00,
  200000,
  '["200K tokens/month", "Team features", "Priority support"]'::jsonb
);
```

## Troubleshooting

### Dashboard shows 0 for all metrics
- Check if the database schema has been deployed
- Verify Supabase credentials in `.env`
- Check browser console for API errors
- Ensure you have test data in the database

### API returns errors
- Check Supabase connection
- Verify RLS policies allow access
- Check if tables exist
- Review server logs in terminal

### Trends chart is empty
- Insert data into `saas_metrics_daily` table
- Ensure dates are within the last 7 days
- Check API response in browser DevTools

## Next Steps

1. **Deploy the schema** to your Supabase project
2. **Add test data** to see the dashboard in action
3. **Integrate payment webhooks** (Razorpay/Stripe) to auto-populate revenue data
4. **Set up cron jobs** to calculate daily metrics
5. **Add authentication** to protect admin routes
6. **Customize** the dashboard to match your brand

## Support

For issues or questions:
1. Check the browser console for errors
2. Review Supabase logs
3. Verify all environment variables are set
4. Ensure the database schema is properly deployed

---

**Built with**: Next.js 16, React 19, Supabase, TypeScript, Tailwind CSS
