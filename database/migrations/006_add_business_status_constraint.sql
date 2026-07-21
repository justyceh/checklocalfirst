-- Convert the old status names to the new workflow
UPDATE businesses
SET status = 'approved'
WHERE status = 'active';

-- The suspended row was only created for testing
UPDATE businesses
SET status = 'pending'
WHERE status = 'suspended';

-- Prevent unsupported status values
ALTER TABLE businesses
DROP CONSTRAINT IF EXISTS businesses_status_check;

ALTER TABLE businesses
ADD CONSTRAINT businesses_status_check
CHECK (
    status IN (
        'pending',
        'approved',
        'suspended',
        'rejected'
    )
);