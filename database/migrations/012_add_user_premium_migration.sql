ALTER TABLE users
ADD COLUMN is_premium BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE users
ADD COLUMN is_comped BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE users
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT;