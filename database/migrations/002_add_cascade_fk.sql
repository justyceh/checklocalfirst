-- Add proper cascade behavior to existing foreign keys
-- businesses.owner_user_id: SET NULL when owning user is deleted
-- services.business_id: CASCADE when parent business is deleted

ALTER TABLE businesses
DROP CONSTRAINT businesses_owner_user_id_fkey;

ALTER TABLE businesses
ADD CONSTRAINT businesses_owner_user_id_fkey
FOREIGN KEY (owner_user_id) REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE services
DROP CONSTRAINT services_business_id_fkey;

ALTER TABLE services
ADD CONSTRAINT services_business_id_fkey
FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE;