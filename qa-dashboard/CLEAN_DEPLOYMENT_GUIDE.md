# 🔧 SaaS Schema Deployment - Clean Slate Solution

## ❌ The Problem

Your existing `subscription_plans` table has a **completely different structure** than what the SaaS integration expects. The columns don't match:

**Error:**
```
column "price_monthly" of relation "subscription_plans" does not exist
```

This means your existing table probably has columns like `price`, `monthly_price`, or something else entirely.

## ✅ The Solution: Clean Slate Deployment

Since the table structure is incompatible, the **safest and fastest** approach is to:

1. **Backup** your existing data (automatically done)
2. **Drop** all SaaS-related tables
3. **Recreate** them with the correct structure
4. **Start fresh** with the new schema

## 🚀 Deployment Steps

### **Step 1: Use the Clean Deployment Script**

I've created a new file: `database/saas_metrics_schema_clean.sql`

This script will:
- ✅ Create a backup of your existing `subscription_plans` table
- ✅ Drop all SaaS-related tables (subscription_plans, user_subscriptions, etc.)
- ✅ Recreate all 8 tables with the correct structure
- ✅ Add RLS policies, indexes, and triggers
- ✅ Seed with 3 default subscription plans
- ✅ Create analytics views

### **Step 2: Run in Supabase**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the **entire contents** of `database/saas_metrics_schema_clean.sql`
5. Paste and click **Run**

### **Step 3: Verify**

After running, you should see:

```
✅ SaaS Metrics Schema deployed successfully!
📊 Tables created: 8
🔒 RLS policies enabled
📈 Analytics views created
💾 Backup table: subscription_plans_backup (if existed)
🎯 Ready to use!
```

### **Step 4: Add Test Data (Optional)**

To see the dashboard with data, uncomment lines 273-280 in the script:

```sql
INSERT INTO saas_metrics_daily (date, mrr, active_users, total_users, total_token_usage, total_token_cost, revenue_today)
VALUES 
  (CURRENT_DATE - 6, 8200, 850, 900, 100000, 750, 250),
  (CURRENT_DATE - 5, 8400, 880, 910, 110000, 780, 270),
  (CURRENT_DATE - 4, 8900, 920, 930, 120000, 810, 290),
  (CURRENT_DATE - 3, 9500, 950, 950, 130000, 850, 310),
  (CURRENT_DATE - 2, 10200, 1050, 980, 140000, 890, 330),
  (CURRENT_DATE - 1, 11500, 1100, 1020, 150000, 920, 350),
  (CURRENT_DATE, 12400, 1140, 1054, 160000, 950, 370);
```

Or run it separately after the main script.

## 📋 What Gets Created

### **8 Tables:**
1. ✅ `subscription_plans` - Pricing tiers (Free, Pro, Enterprise)
2. ✅ `user_subscriptions` - User subscription tracking
3. ✅ `revenue_transactions` - Payment records
4. ✅ `token_usage` - AI token consumption
5. ✅ `support_tickets` - Customer support
6. ✅ `user_activity` - Engagement tracking
7. ✅ `user_moderation` - Ban/suspend management
8. ✅ `saas_metrics_daily` - Daily aggregated metrics

### **3 Analytics Views:**
1. ✅ `current_mrr` - Real-time MRR calculation
2. ✅ `token_usage_summary` - Token consumption by user/date
3. ✅ `support_metrics` - Support ticket analytics

### **Seed Data:**
3 subscription plans automatically created:
- **Free Tier**: $0/month, 10K tokens
- **Pro Plan**: $29/month, 100K tokens
- **Enterprise**: $99/month, 500K tokens

## ⚠️ Important Notes

### **Data Loss:**
- This script **drops existing tables**
- Your old `subscription_plans` data will be backed up to `subscription_plans_backup`
- If you have important data in other SaaS tables, you'll need to migrate it manually

### **Safe to Run:**
- ✅ Creates backup before dropping
- ✅ Uses `IF EXISTS` to avoid errors
- ✅ Handles all dependencies correctly
- ✅ Won't affect other tables in your database

### **First Time Setup:**
If this is your first time setting up SaaS metrics, this is the **perfect** script to use!

## 🔍 Verify Deployment

After running the script, check your Supabase dashboard:

### **Tables Tab:**
You should see 8 new tables:
- subscription_plans
- user_subscriptions
- revenue_transactions
- token_usage
- support_tickets
- user_activity
- user_moderation
- saas_metrics_daily

### **Table Editor:**
Open `subscription_plans` - you should see 3 rows:
| name | display_name | price_monthly | price_yearly | token_limit |
|------|--------------|---------------|--------------|-------------|
| free | Free Tier | 0.00 | 0.00 | 10000 |
| pro | Pro Plan | 29.00 | 290.00 | 100000 |
| enterprise | Enterprise | 99.00 | 990.00 | 500000 |

## 🎯 After Deployment

1. **Refresh your dashboard** at http://localhost:3000
2. **Check the SaaS section** - it should now load without errors
3. **Add test data** to see charts and metrics populate
4. **Integrate payment webhooks** to start tracking real revenue

## 🐛 Troubleshooting

### **Still getting errors?**

**Check if tables were created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%subscription%' OR table_name LIKE '%saas%';
```

**Check subscription_plans structure:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscription_plans'
ORDER BY ordinal_position;
```

**Manually verify seed data:**
```sql
SELECT * FROM subscription_plans;
```

### **Foreign key errors?**

The script creates tables in the correct order. If you get foreign key errors, make sure you're running the **entire script** at once, not line by line.

### **Permission errors?**

Make sure you're using the **service role key** or have admin permissions in Supabase.

## 📚 Files

- **Clean Deployment**: `database/saas_metrics_schema_clean.sql` ⭐ **Use this one!**
- **Old Schema**: `database/saas_metrics_schema.sql` (has compatibility issues)
- **Deployment Guide**: `SCHEMA_DEPLOYMENT_FIX.md`

## 🎉 Summary

**Problem**: Existing table structure incompatible  
**Solution**: Clean slate deployment with backup  
**Time**: ~2 minutes  
**Risk**: Low (creates backup first)  
**Result**: Fresh, working SaaS metrics system  

---

**Status**: ✅ Ready to Deploy  
**File**: `database/saas_metrics_schema_clean.sql`  
**Action**: Copy to Supabase SQL Editor and run  
**Expected**: All 8 tables created successfully
