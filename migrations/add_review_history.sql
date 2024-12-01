-- Create review_history table
CREATE TABLE IF NOT EXISTS review_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    difficulty VARCHAR(10) CHECK (difficulty IN ('FAIL', 'HARD', 'GOOD', 'EASY', 'PERFECT')),
    interval INTEGER NOT NULL CHECK (interval >= 0),
    ease_factor DECIMAL(4,2) CHECK (ease_factor >= 1.3 AND ease_factor <= 2.5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_review_history_user_id ON review_history(user_id);
CREATE INDEX IF NOT EXISTS idx_review_history_card_id ON review_history(card_id);
CREATE INDEX IF NOT EXISTS idx_review_history_review_date ON review_history(review_date);

-- Add comment to describe the table
COMMENT ON TABLE review_history IS 'Tracks the review history of flashcards for spaced repetition';

-- Add comments for columns
COMMENT ON COLUMN review_history.user_id IS 'The user who reviewed the card';
COMMENT ON COLUMN review_history.card_id IS 'The flashcard that was reviewed';
COMMENT ON COLUMN review_history.review_date IS 'When the review occurred';
COMMENT ON COLUMN review_history.difficulty IS 'The difficulty rating given by the user';
COMMENT ON COLUMN review_history.interval IS 'The number of days until the next review';
COMMENT ON COLUMN review_history.ease_factor IS 'The ease factor used in the spaced repetition algorithm';

-- Enable Row Level Security
ALTER TABLE review_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own review history"
    ON review_history FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own review history"
    ON review_history FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON review_history TO authenticated;
GRANT SELECT ON review_history TO anon;