-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_state JSONB NOT NULL DEFAULT '{
        "boards": [],
        "meta_board": [],
        "game_winner": null,
        "next_board": null,
        "available_boards": [],
        "move_history": []
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at DESC);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own games
CREATE POLICY "Users can view own games"
    ON games FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own games
CREATE POLICY "Users can insert own games"
    ON games FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own games
CREATE POLICY "Users can update own games"
    ON games FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own games
CREATE POLICY "Users can delete own games"
    ON games FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

