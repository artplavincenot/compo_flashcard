-- Add cards_studied column to user_progress table
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS cards_studied INTEGER NOT NULL DEFAULT 0;

-- Update existing rows to initialize the column with default value
UPDATE user_progress 
SET cards_studied = 0 
WHERE cards_studied IS NULL;

-- Add a check constraint to ensure non-negative values
ALTER TABLE user_progress 
ADD CONSTRAINT cards_studied_non_negative 
CHECK (cards_studied >= 0);

-- Add comment to describe the column
COMMENT ON COLUMN user_progress.cards_studied IS 'Tracks the number of cards a user has studied in their learning sessions';