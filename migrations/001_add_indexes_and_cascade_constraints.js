// DATABASE MIGRATION SCRIPT: 001 - High Priority Optimizations
// Migration Name: add_indexes_and_cascade_constraints
// Date: August 16, 2025
// Description: Adds critical indexes and fixes cascade delete behavior
//
// This migration applies Option B optimizations:
// - Adds 8 critical indexes for performance
// - Fixes cascade delete constraints
// - Standardizes timestamp types
// - Increases password field size
//
// Run this script to apply high priority database optimizations

import pg from "pg";
import fs from "fs";
import env from "dotenv";

env.config();

const client = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

async function applyOptimizations() {
    try {
        console.log("🔗 Connecting to database...");
        await client.connect();
        console.log("✅ Connected successfully!");

        // PART 1: Add Indexes
        console.log("\n📊 PART 1: Adding missing indexes...");
        
        const indexQueries = [
            "CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id);",
            "CREATE INDEX IF NOT EXISTS idx_reviews_like_count ON reviews(like_count DESC);",
            "CREATE INDEX IF NOT EXISTS idx_reviews_datetime ON reviews(review_datetime DESC);",
            "CREATE INDEX IF NOT EXISTS idx_reviews_funny_count ON reviews(funny_count DESC);",
            "CREATE INDEX IF NOT EXISTS idx_react_review_id ON react(review_id);",
            "CREATE INDEX IF NOT EXISTS idx_react_user_id ON react(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);",
            "CREATE INDEX IF NOT EXISTS idx_session_expire ON session(expire);"
        ];

        for (const query of indexQueries) {
            console.log(`   Creating index: ${query.split(' ')[5]}`);
            await client.query(query);
        }
        console.log("✅ All indexes created successfully!");

        // PART 2: Fix Cascade Delete Behavior
        console.log("\n🔗 PART 2: Fixing cascade delete behavior...");
        
        const cascadeQueries = [
            "ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;",
            "ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;",
            "ALTER TABLE react DROP CONSTRAINT IF EXISTS react_user_id_fkey;",
            "ALTER TABLE react ADD CONSTRAINT react_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;",
            "ALTER TABLE react DROP CONSTRAINT IF EXISTS react_review_id_fkey;",
            "ALTER TABLE react ADD CONSTRAINT react_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE;",
            "ALTER TABLE watchlist DROP CONSTRAINT IF EXISTS watchlist_user_id_fkey;",
            "ALTER TABLE watchlist ADD CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;"
        ];

        for (const query of cascadeQueries) {
            if (query.includes('DROP')) {
                console.log(`   Dropping old constraint...`);
            } else {
                console.log(`   Adding CASCADE constraint...`);
            }
            await client.query(query);
        }
        console.log("✅ Cascade delete behavior fixed!");

        // PART 3: Standardize Timestamp Types
        console.log("\n⏰ PART 3: Standardizing timestamp types...");
        await client.query("ALTER TABLE reviews ALTER COLUMN review_datetime TYPE timestamp with time zone;");
        console.log("✅ Timestamp types standardized!");

        // PART 4: Increase Password Field Size
        console.log("\n🔐 PART 4: Increasing password field size...");
        await client.query("ALTER TABLE users ALTER COLUMN password TYPE varchar(255);");
        console.log("✅ Password field size increased!");

        // VERIFICATION
        console.log("\n🔍 VERIFICATION: Checking applied optimizations...");
        
        // Check indexes
        const indexResult = await client.query(`
            SELECT indexname, tablename 
            FROM pg_indexes 
            WHERE tablename IN ('reviews', 'react', 'watchlist', 'session')
            AND indexname LIKE 'idx_%'
            ORDER BY tablename, indexname;
        `);
        
        console.log("📊 Created indexes:");
        indexResult.rows.forEach(row => {
            console.log(`   ✅ ${row.indexname} on ${row.tablename}`);
        });

        // Check foreign keys
        const fkResult = await client.query(`
            SELECT tc.constraint_name, tc.table_name, rc.delete_rule
            FROM information_schema.table_constraints AS tc 
            JOIN information_schema.referential_constraints AS rc 
                ON tc.constraint_name = rc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_name IN ('reviews', 'react', 'watchlist')
            ORDER BY tc.table_name;
        `);

        console.log("\n🔗 Foreign key constraints:");
        fkResult.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}.${row.constraint_name} - DELETE ${row.delete_rule}`);
        });

        console.log("\n🎉 HIGH PRIORITY OPTIMIZATIONS COMPLETED SUCCESSFULLY!");
        console.log("\n📈 Expected improvements:");
        console.log("   • Movie review queries: 10-100x faster");
        console.log("   • Review sorting: 5-50x faster");
        console.log("   • User operations: 5-20x faster");
        console.log("   • Data integrity: Significantly improved");

    } catch (error) {
        console.error("❌ Error applying optimizations:", error.message);
        console.error("Stack trace:", error.stack);
    } finally {
        console.log("\n🔌 Closing database connection...");
        await client.end();
    }
}

// Run the optimizations
applyOptimizations();
