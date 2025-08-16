-- HIGH PRIORITY DATABASE OPTIMIZATIONS
-- Migration Script for Movie Review System
-- Date: August 16, 2025

-- =====================================================
-- PART 1: ADD MISSING INDEXES (IMMEDIATE PERFORMANCE BOOST)
-- =====================================================

-- These indexes will dramatically improve query performance
-- 
-- IMPORTANT: Choose ONE of the two approaches below:
-- 
-- OPTION A: PRODUCTION (Zero Downtime) - Use if your app is running
-- OPTION B: DEVELOPMENT (Faster) - Use if you can take the app offline

-- =====================================================
-- OPTION A: PRODUCTION DEPLOYMENT (ZERO DOWNTIME)
-- =====================================================
-- Use CONCURRENTLY to avoid locking tables
-- NOTE: Cannot use inside transaction block
-- Run each command separately:

-- Index for movie review queries (most frequent query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);

-- Index for review sorting by likes (ORDER BY like_count DESC)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_like_count ON reviews(like_count DESC);

-- Index for review sorting by date (ORDER BY review_datetime DESC)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_datetime ON reviews(review_datetime DESC);

-- Index for review sorting by funny count (ORDER BY funny_count DESC)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reviews_funny_count ON reviews(funny_count DESC);

-- Index for reaction queries (finding reactions for a review)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_react_review_id ON react(review_id);

-- Index for user-specific queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_react_user_id ON react(user_id);

-- Index for watchlist queries (user's watchlist)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);

-- Index for session cleanup (DELETE WHERE expire < NOW())
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_session_expire ON session(expire);

-- =====================================================
-- OPTION B: DEVELOPMENT/MAINTENANCE (FASTER, WITH DOWNTIME)
-- =====================================================
-- Use regular CREATE INDEX inside transaction for faster creation
-- Uncomment this section if you prefer speed over zero-downtime:

/*
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
*/

-- =====================================================
-- PART 2: FIX CASCADE DELETE BEHAVIOR
-- =====================================================

-- Update foreign key constraints to properly handle user deletion
-- This prevents orphaned records and maintains data integrity

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

-- Standardize all timestamps to include timezone information
-- This is important for global applications

BEGIN;

-- Update reviews table to use timestamp with time zone
ALTER TABLE reviews ALTER COLUMN review_datetime TYPE timestamp with time zone;

COMMIT;

-- =====================================================
-- PART 4: INCREASE PASSWORD FIELD SIZE (FUTURE-PROOFING)
-- =====================================================

-- Increase password field size to accommodate different hash algorithms
-- bcrypt is 60 chars, but this future-proofs for other algorithms

BEGIN;

-- Increase password field size
ALTER TABLE users ALTER COLUMN password TYPE varchar(255);

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these to verify the optimizations were applied correctly

-- Check indexes were created
SELECT 
    schemaname, 
    tablename, 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename IN ('reviews', 'react', 'watchlist', 'session')
ORDER BY tablename, indexname;

-- Check foreign key constraints
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu 
        ON ccu.constraint_name = tc.constraint_name
    JOIN information_schema.referential_constraints AS rc 
        ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('reviews', 'react', 'watchlist');

-- Check column types
SELECT 
    table_name, 
    column_name, 
    data_type, 
    character_maximum_length 
FROM information_schema.columns 
WHERE table_name IN ('users', 'reviews') 
    AND column_name IN ('password', 'review_datetime')
ORDER BY table_name, column_name;
