ALTER TABLE businesses
ADD COLUMN status VARCHAR(20) DEFAULT 'suspended' NOT NULL;


-- Changed default status to suspended