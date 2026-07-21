-- 008: Remove price from services — CLF is a directory, not a marketplace
ALTER TABLE services
DROP COLUMN price;