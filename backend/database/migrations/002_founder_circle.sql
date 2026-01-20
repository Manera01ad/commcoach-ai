-- Founder's Circle Membership Table
CREATE TABLE IF NOT EXISTS founder_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    membership_type TEXT NOT NULL DEFAULT 'paid', -- 'paid' or 'honorary'
    amount_paid NUMERIC(10, 2),
    referral_code TEXT UNIQUE,
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'refunded'))
);

-- Index for referral lookups
CREATE INDEX IF NOT EXISTS idx_founder_referral ON founder_memberships(referral_code);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    new_code TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        -- Generate random code like "FND-A1B2"
        new_code := 'FND-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if exists
        IF NOT EXISTS (SELECT 1 FROM founder_memberships WHERE referral_code = new_code) THEN
            done := TRUE;
        END IF;
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;
