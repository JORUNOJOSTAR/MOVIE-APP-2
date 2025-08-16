-- DATABASE MIGRATION: 002 - Counter Maintenance Triggers
-- Date: August 16, 2025
-- Description: Implements automatic counter maintenance for like_count and funny_count

-- =====================================================
-- STEP 1: CREATE TRIGGER FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_review_counters()
RETURNS TRIGGER AS $$
DECLARE
    target_review_id INTEGER;
    affected_rows INTEGER;
BEGIN
    -- Determine which review to update based on the operation
    IF TG_OP = 'DELETE' THEN
        target_review_id := OLD.review_id;
    ELSE
        target_review_id := NEW.review_id;
    END IF;

    -- Check if review exists (safety check)
    SELECT COUNT(*) INTO affected_rows 
    FROM reviews WHERE id = target_review_id;
    
    IF affected_rows = 0 THEN
        RAISE WARNING 'Review ID % not found during counter update', target_review_id;
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
    END IF;

    -- Update the counters in the reviews table
    UPDATE reviews SET
        like_count = COALESCE((
            SELECT COUNT(*) 
            FROM react 
            WHERE review_id = target_review_id 
            AND react_like = true
        ), 0),
        funny_count = COALESCE((
            SELECT COUNT(*) 
            FROM react 
            WHERE review_id = target_review_id 
            AND react_funny = true
        ), 0)
    WHERE id = target_review_id;

    -- Return the appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't prevent the original operation
        RAISE WARNING 'Error updating review counters for review %: %', target_review_id, SQLERRM;
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 2: CREATE TRIGGERS
-- =====================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_review_counters ON react;

-- Create new trigger for all operations on react table
CREATE TRIGGER trigger_update_review_counters
    AFTER INSERT OR UPDATE OR DELETE ON react
    FOR EACH ROW
    EXECUTE FUNCTION update_review_counters();

-- =====================================================
-- STEP 3: SYNCHRONIZE EXISTING DATA
-- =====================================================

-- Update all existing reviews to have correct counter values
UPDATE reviews SET
    like_count = COALESCE((
        SELECT COUNT(*) 
        FROM react 
        WHERE review_id = reviews.id 
        AND react_like = true
    ), 0),
    funny_count = COALESCE((
        SELECT COUNT(*) 
        FROM react 
        WHERE review_id = reviews.id 
        AND react_funny = true
    ), 0);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if trigger was created
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_review_counters'
AND event_object_table = 'react';

-- Check if function was created
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name = 'update_review_counters'
AND routine_type = 'FUNCTION';

-- Verify counter accuracy (sample check)
SELECT r.id, r.like_count, r.funny_count,
       (SELECT COUNT(*) FROM react WHERE review_id = r.id AND react_like = true) as actual_likes,
       (SELECT COUNT(*) FROM react WHERE review_id = r.id AND react_funny = true) as actual_funny
FROM reviews r 
LIMIT 10;
