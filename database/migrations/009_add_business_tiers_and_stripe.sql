ALTER TABLE businesses
ADD COLUMN business_tier VARCHAR(20) DEFAULT 'basic' NOT NULL,
ADD CONSTRAINT businesses_tier_check CHECK (business_tier IN ('basic', 'premium'));

ALTER TABLE businesses
ADD COLUMN is_comped BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE businesses
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT;