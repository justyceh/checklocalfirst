ALTER TABLE businesses
ADD COLUMN is_featured BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN featured_since TIMESTAMPTZ,
ADD COLUMN in_carousel BOOLEAN DEFAULT false NOT NULL;

ALTER TABLE businesses
ADD CONSTRAINT featured_requires_premium CHECK (NOT is_featured OR business_tier = 'premium'),
ADD CONSTRAINT carousel_requires_premium CHECK (NOT in_carousel OR business_tier = 'premium');

CREATE UNIQUE INDEX one_featured_business ON businesses (is_featured) WHERE is_featured = true;