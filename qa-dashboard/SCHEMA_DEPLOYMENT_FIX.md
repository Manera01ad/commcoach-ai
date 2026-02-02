# 🔧 SaaS Schema Deployment - Fixed Version

## ⚠️ Issue Resolved

**Error**: `column "display_name" of relation "subscription_plans" does not exist`

**Cause**: You likely have an existing `subscription_plans` table in Supabase with a different structure (missing the `display_name` column).

**Solution**: The updated schema now safely handles existing tables!

## ✅ What's Fixed

The new `saas_metrics_schema.sql` now:

1. ✅ **Checks for existing tables** before creating
2. ✅ **Adds missing columns** to existing tables (like `display_name`)
3. ✅ **Handles conflicts** gracefully with `ON CONFLICT` clauses
4. ✅ **Drops and recreates** policies and triggers safely
5. ✅ **Updates existing data** instead of failing

## 🚀 Deployment Options

### **Option 1: Safe Deployment (Recommended)**

This will **keep your existing data** and add missing columns:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Copy the entire contents of `database/saas_metrics_schema.sql`
5. Paste and click **Run**

The script will:
- Keep existing tables and data
- Add missing columns (like `display_name`)
- Update subscription plans with new data
- Create missing tables

### **Option 2: Fresh Start (Clean Slate)**

If you want to **start completely fresh**:

1. Open `database/saas_metrics_schema.sql`
2. **Uncomment** lines 13-20 (the DROP TABLE statements):
   ```sql
   DROP TABLE IF EXISTS saas_metrics_daily CASCADE;
   DROP TABLE IF EXISTS user_moderation CASCADE;
   DROP TABLE IF EXISTS user_activity CASCADE;
   DROP TABLE IF EXISTS support_tickets CASCADE;
   DROP TABLE IF EXISTS token_usage CASCADE;
   DROP TABLE IF EXISTS revenue_transactions CASCADE;
   DROP TABLE IF EXISTS user_subscriptions CASCADE;
   DROP TABLE IF EXISTS subscription_plans CASCADE;
   ```
3. Run the script in Supabase SQL Editor
4. This will delete all existing SaaS data and create fresh tables

⚠️ **Warning**: Option 2 will delete all existing subscription and revenue data!

### **Option 3: Using PowerShell Script**

```powershell
cd C:\Users\Hp\.gemini\antigravity\scratch\commcoach-ai\qa-dashboard
.\deploy-saas-schema.ps1
```

The script will:
- Open Supabase SQL Editor
- Show you the schema file
- Copy it to clipboard for easy pasting

## 📋 What the Fixed Schema Does

### **For Existing Tables:**
```sql
-- Adds missing columns if table exists
ALTER TABLE subscription_plans 
  ADD COLUMN IF NOT EXISTS display_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS price_yearly DECIMAL(10, 2),
  -- ... other columns
```

### **For New Tables:**
```sql
-- Creates table only if it doesn't exist
CREATE TABLE IF NOT EXISTS user_subscriptions (
  -- ... columns
);
```

### **For Seed Data:**
```sql
-- Updates existing plans or inserts new ones
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  -- ... other fields
```

## ✅ Expected Output

After running the script, you should see:

```
✅ SaaS Metrics Schema deployed successfully!
📊 Tables created: 8
🔒 RLS policies enabled
📈 Analytics views created
🎯 Ready to use!
```

## 🔍 Verify Deployment

After deployment, check your Supabase dashboard:

### **Tables Created:**
1. ✅ `subscription_plans` (with `display_name` column)
2. ✅ `user_subscriptions`
3. ✅ `revenue_transactions`
4. ✅ `token_usage`
5. ✅ `support_tickets`
6. ✅ `user_activity`
7. ✅ `user_moderation`
8. ✅ `saas_metrics_daily`

### **Views Created:**
1. ✅ `current_mrr`
2. ✅ `token_usage_summary`
3. ✅ `support_metrics`

### **Seed Data:**
Check `subscription_plans` table - should have 3 rows:
- Free Tier ($0/month)
- Pro Plan ($29/month)
- Enterprise ($99/month)

## 🧪 Test with Sample Data

After deployment, add test data:

```sql
-- Insert daily metrics for the last 7 days
INSERT INTO saas_metrics_daily (date, mrr, active_users, total_users, total_token_usage, total_token_cost, revenue_today)
VALUES 
  (CURRENT_DATE - 6, 8200, 850, 900, 100000, 750, 250),
  (CURRENT_DATE - 5, 8400, 880, 910, 110000, 780, 270),
  (CURRENT_DATE - 4, 8900, 920, 930, 120000, 810, 290),
  (CURRENT_DATE - 3, 9500, 950, 950, 130000, 850, 310),
  (CURRENT_DATE - 2, 10200, 1050, 980, 140000, 890, 330),
  (CURRENT_DATE - 1, 11500, 1100, 1020, 150000, 920, 350),
  (CURRENT_DATE, 12400, 1140, 1054, 160000, 950, 370)
ON CONFLICT (date) DO NOTHING;
```

## 🎯 Next Steps

1. ✅ **Deploy the fixed schema** using Option 1 (recommended)
2. ✅ **Verify tables** in Supabase dashboard
3. ✅ **Add test data** (optional)
4. ✅ **Refresh dashboard** at http://localhost:3000
5. ✅ **See SaaS metrics** populate in the dashboard!

## 🐛 Troubleshooting

### **Still getting errors?**

1. **Check existing table structure:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'subscription_plans';
   ```

2. **Manually add missing column:**
   ```sql
   ALTER TABLE subscription_plans 
   ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);
   
   UPDATE subscription_plans 
   SET display_name = name 
   WHERE display_name IS NULL;
   ```

3. **Drop and recreate (nuclear option):**
   ```sql
   DROP TABLE IF EXISTS subscription_plans CASCADE;
   -- Then run the full schema
   ```

### **RLS policy errors?**

The script now drops existing policies before creating new ones, so this should be fixed.

### **Foreign key constraint errors?**

Make sure you're running the script in order. The script creates tables in the correct dependency order.

## 📚 Documentation

- **Full Schema**: `database/saas_metrics_schema.sql`
- **Integration Guide**: `SAAS_INTEGRATION_GUIDE.md`
- **Quick Start**: `SAAS_QUICKSTART.md`
- **Dashboard Redesign**: `DASHBOARD_REDESIGN.md`

---

**Status**: ✅ Schema Fixed and Ready to Deploy  
**Recommended**: Use Option 1 (Safe Deployment)  
**Time to Deploy**: ~2 minutes
