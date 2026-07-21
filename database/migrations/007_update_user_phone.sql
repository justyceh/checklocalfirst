-- 007: Make users.phone optional and non-unique
-- Phone numbers get recycled/reused across people; email already
-- anchors identity uniqueness for users. businesses.phone stays UNIQUE.

ALTER TABLE users
ALTER COLUMN phone DROP NOT NULL;

ALTER TABLE users
DROP CONSTRAINT users_phone_key;