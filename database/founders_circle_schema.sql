-- ==========================================
-- FOUNDER'S CIRCLE SYSTEM SCHEMA
-- ==========================================
-- Milestone A4: Self-Funding Growth Model
-- ==========================================

-- ========================================
-- PART 1: Founder Memberships
-- ========================================

CREATE TABLE IF NOT EXISTS founder_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  membership_type TEXT NOT NULL CHECK (membership_type IN ('paid', 'sweat_equity')),
  
  -- Payment details
  amount_paid NUMERIC(10, 2),
  stripe_payment_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Sweat equity details
  sweat_equity_task TEXT,
  sweat_equity_completed BOOLEAN DEFAULT FALSE,
  
  -- Referral tracking
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES profiles(id),
  referral_count INTEGER DEFAULT 0,
  
  -- Commission tracking
  total_commission_earned NUMERIC(10, 2) DEFAULT 0,
  commission_paid NUMERIC(10, 2) DEFAULT 0,
  commission_pending NUMERIC(10, 2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_founder_memberships_user ON founder_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_founder_memberships_referral_code ON founder_memberships(referral_code);
CREATE INDEX IF NOT EXISTS idx_founder_memberships_referred_by ON founder_memberships(referred_by);

COMMENT ON TABLE founder_memberships IS 'Founder Circle memberships and referral tracking';

-- ========================================
-- PART 2: Referrals
-- ========================================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  
  -- Conversion tracking
  converted BOOLEAN DEFAULT FALSE,
  conversion_type TEXT CHECK (conversion_type IN ('signup', 'founder', 'paid_plan')),
  conversion_value NUMERIC(10, 2),
  
  -- Commission
  commission_rate REAL DEFAULT 0.2,
  commission_amount NUMERIC(10, 2),
  commission_paid BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  
  UNIQUE(referred_user_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_converted ON referrals(converted);

COMMENT ON TABLE referrals IS 'Individual referral tracking and commission calculation';

-- ========================================
-- PART 3: Commission Payouts
-- ========================================

CREATE TABLE IF NOT EXISTS commission_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  payment_method TEXT,
  payment_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_commission_payouts_user ON commission_payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_payouts_status ON commission_payouts(status);

COMMENT ON TABLE commission_payouts IS 'Commission payout requests and tracking';

-- ========================================
-- PART 4: Helper Functions
-- ========================================

-- Generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM founder_memberships WHERE referral_code = code) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Process referral conversion
CREATE OR REPLACE FUNCTION process_referral_conversion(
  p_referred_user_id UUID,
  p_conversion_type TEXT,
  p_conversion_value NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_referral RECORD;
  v_commission NUMERIC;
BEGIN
  -- Get referral record
  SELECT * INTO v_referral
  FROM referrals
  WHERE referred_user_id = p_referred_user_id
    AND NOT converted;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'No pending referral found');
  END IF;
  
  -- Calculate commission
  v_commission := p_conversion_value * v_referral.commission_rate;
  
  -- Update referral
  UPDATE referrals
  SET 
    converted = TRUE,
    conversion_type = p_conversion_type,
    conversion_value = p_conversion_value,
    commission_amount = v_commission,
    converted_at = NOW()
  WHERE id = v_referral.id;
  
  -- Update referrer's founder membership
  UPDATE founder_memberships
  SET 
    referral_count = referral_count + 1,
    total_commission_earned = total_commission_earned + v_commission,
    commission_pending = commission_pending + v_commission,
    updated_at = NOW()
  WHERE user_id = v_referral.referrer_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'commission', v_commission,
    'referrer_id', v_referral.referrer_id
  );
END;
$$;

-- Get founder dashboard stats
CREATE OR REPLACE FUNCTION get_founder_stats(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_membership RECORD;
  v_total_referrals INTEGER;
  v_converted_referrals INTEGER;
BEGIN
  -- Get membership
  SELECT * INTO v_membership
  FROM founder_memberships
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Not a founder');
  END IF;
  
  -- Get referral stats
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE converted)
  INTO v_total_referrals, v_converted_referrals
  FROM referrals
  WHERE referrer_id = p_user_id;
  
  RETURN jsonb_build_object(
    'referral_code', v_membership.referral_code,
    'total_referrals', v_total_referrals,
    'converted_referrals', v_converted_referrals,
    'conversion_rate', CASE WHEN v_total_referrals > 0 
      THEN (v_converted_referrals::REAL / v_total_referrals * 100)
      ELSE 0 END,
    'total_commission_earned', v_membership.total_commission_earned,
    'commission_paid', v_membership.commission_paid,
    'commission_pending', v_membership.commission_pending
  );
END;
$$;

-- ========================================
-- PART 5: Grant Permissions
-- ========================================

GRANT SELECT, INSERT, UPDATE ON founder_memberships TO authenticated;
GRANT SELECT, INSERT ON referrals TO authenticated;
GRANT SELECT, INSERT ON commission_payouts TO authenticated;
GRANT EXECUTE ON FUNCTION generate_referral_code TO authenticated;
GRANT EXECUTE ON FUNCTION process_referral_conversion TO authenticated;
GRANT EXECUTE ON FUNCTION get_founder_stats TO authenticated;

-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ FOUNDERS CIRCLE DEPLOYED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '💰 Self-Funding System Ready';
  RAISE NOTICE '✅ founder_memberships table created';
  RAISE NOTICE '✅ referrals table created';
  RAISE NOTICE '✅ commission_payouts table created';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Features:';
  RAISE NOTICE '   - Paid memberships ($500)';
  RAISE NOTICE '   - Sweat equity option';
  RAISE NOTICE '   - 20%% referral commission';
  RAISE NOTICE '   - Automatic tracking';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Functions:';
  RAISE NOTICE '   - generate_referral_code()';
  RAISE NOTICE '   - process_referral_conversion()';
  RAISE NOTICE '   - get_founder_stats()';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Milestone A4: Founders Circle Ready!';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
