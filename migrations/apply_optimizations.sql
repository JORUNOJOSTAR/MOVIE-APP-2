-- HIGH PRIORITY OPTIMIZATIONS - OPTION B (DEVELOPMENT MODE)
-- Fast execution with brief downtime
-- Date: August 16, 2025

-- =====================================================
-- PART 1: ADD MISSING INDEXES (FAST EXECUTION)
-- =====================================================

BEGIN;

-- Index for movie review queries (most frequent query)
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);

-- Index for review sorting by likes (ORDER BY like_count DESC)
CREATE INDEX IF NOT EXISTS idx_reviews_like_count ON reviews(like_count DESC);

-- Index for review sorting by date (ORDER BY review_datetime DESC)
CREATE INDEX IF NOT EXISTS idx_reviews_datetime ON reviews(review_datetime DESC);

-- Index for review sorting by funny count (ORDER BY funny_count DESC)
CREATE INDEX IF NOT EXISTS idx_reviews_funny_count ON reviews(funny_count DESC);

-- Index for reaction queries (finding reactions for a review)
CREATE INDEX IF NOT EXISTS idx_react_review_id ON react(review_id);

-- Index for user-specific queries
CREATE INDEX IF NOT EXISTS idx_react_user_id ON react(user_id);

-- Index for watchlist queries (user's watchlist)
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);

-- Index for session cleanup (DELETE WHERE expire < NOW())
CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);

COMMIT;

-- =====================================================
-- PART 2: FIX CASCADE DELETE BEHAVIOR
-- =====================================================

BEGIN;

-- Reviews should be deleted when user is deleted
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Reactions should be deleted when user is deleted
ALTER TABLE react DROP CONSTRAINT IF EXISTS react_user_id_fkey;
ALTER TABLE react ADD CONSTRAINT react_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Reactions should also be deleted when review is deleted
ALTER TABLE react DROP CONSTRAINT IF EXISTS react_review_id_fkey;
ALTER TABLE react ADD CONSTRAINT react_review_id_fkey 
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE;

-- Watchlist entries should be deleted when user is deleted
ALTER TABLE watchlist DROP CONSTRAINT IF EXISTS watchlist_user_id_fkey;
ALTER TABLE watchlist ADD CONSTRAINT watchlist_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

COMMIT;

-- =====================================================
-- PART 3: STANDARDIZE TIMESTAMP TYPES
-- =====================================================

BEGIN;

-- Update reviews table to use timestamp with time zone
ALTER TABLE reviews ALTER COLUMN review_datetime TYPE timestamp with time zone;

COMMIT;

-- =====================================================
-- PART 4: INCREASE PASSWORD FIELD SIZE
-- =====================================================

BEGIN;

-- Increase password field size for future-proofing
ALTER TABLE users ALTER COLUMN password TYPE varchar(255);

COMMIT;
