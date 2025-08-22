<?php

/**
 * Data Migration Script: Node.js to Laravel
 * 
 * This script migrates existing data from the Node.js PostgreSQL database
 * to the new Laravel database structure.
 * 
 * Usage: php migrate-data.php
 */

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

// Setup database connections
$capsule = new Capsule;

// Source database (existing Node.js app)
$capsule->addConnection([
    'driver'    => 'pgsql',
    'host'      => 'localhost',
    'database'  => 'moviedb',
    'username'  => 'postgres',
    'password'  => 'password',
    'charset'   => 'utf8',
    'prefix'    => '',
    'schema'    => 'public',
    'port'      => 5432,
], 'source');

// Target database (new Laravel app)
$capsule->addConnection([
    'driver'    => 'pgsql',
    'host'      => 'localhost',
    'database'  => 'moviedb',
    'username'  => 'postgres',
    'password'  => 'password',
    'charset'   => 'utf8',
    'prefix'    => '',
    'schema'    => 'public',
    'port'      => 5432,
], 'target');

$capsule->setAsGlobal();
$capsule->bootEloquent();

class DataMigrator
{
    private $sourceDb;
    private $targetDb;
    private $stats = [
        'users' => ['migrated' => 0, 'skipped' => 0, 'errors' => 0],
        'reviews' => ['migrated' => 0, 'skipped' => 0, 'errors' => 0],
        'reactions' => ['migrated' => 0, 'skipped' => 0, 'errors' => 0],
        'watchlists' => ['migrated' => 0, 'skipped' => 0, 'errors' => 0],
    ];

    public function __construct()
    {
        $this->sourceDb = Capsule::connection('source');
        $this->targetDb = Capsule::connection('target');
    }

    public function migrate()
    {
        echo "🚀 Starting data migration from Node.js to Laravel...\n\n";
        
        try {
            // Test connections
            $this->testConnections();
            
            // Backup existing Laravel data (if any)
            $this->backupData();
            
            // Clear target tables
            $this->clearTargetTables();
            
            // Migrate data in dependency order
            $this->migrateUsers();
            $this->migrateReviews();
            $this->migrateReactions();
            $this->migrateWatchlists();
            
            // Update sequences
            $this->updateSequences();
            
            // Verify migration
            $this->verifyMigration();
            
            $this->printSummary();
            
        } catch (Exception $e) {
            echo "❌ Migration failed: " . $e->getMessage() . "\n";
            throw $e;
        }
    }

    private function testConnections()
    {
        echo "🔍 Testing database connections...\n";
        
        // Test source connection
        $sourceVersion = $this->sourceDb->select('SELECT version() as version')[0]->version;
        echo "  ✓ Source DB connected: " . substr($sourceVersion, 0, 50) . "...\n";
        
        // Test target connection
        $targetVersion = $this->targetDb->select('SELECT version() as version')[0]->version;
        echo "  ✓ Target DB connected: " . substr($targetVersion, 0, 50) . "...\n";
        
        echo "\n";
    }

    private function backupData()
    {
        echo "💾 Creating backup of existing Laravel data...\n";
        
        $timestamp = date('Y_m_d_H_i_s');
        $backupSql = "
        -- Backup existing data
        CREATE TABLE IF NOT EXISTS backup_users_{$timestamp} AS SELECT * FROM users;
        CREATE TABLE IF NOT EXISTS backup_reviews_{$timestamp} AS SELECT * FROM reviews;
        CREATE TABLE IF NOT EXISTS backup_reactions_{$timestamp} AS SELECT * FROM reactions;
        CREATE TABLE IF NOT EXISTS backup_watchlists_{$timestamp} AS SELECT * FROM watchlists;
        ";
        
        try {
            $this->targetDb->unprepared($backupSql);
            echo "  ✓ Backup created with timestamp: {$timestamp}\n\n";
        } catch (Exception $e) {
            echo "  ⚠️ Backup creation failed (tables might be empty): " . $e->getMessage() . "\n\n";
        }
    }

    private function clearTargetTables()
    {
        echo "🧹 Clearing target tables...\n";
        
        $this->targetDb->statement('TRUNCATE TABLE reactions CASCADE');
        $this->targetDb->statement('TRUNCATE TABLE watchlists CASCADE');
        $this->targetDb->statement('TRUNCATE TABLE reviews CASCADE');
        $this->targetDb->statement('TRUNCATE TABLE users CASCADE');
        
        echo "  ✓ All target tables cleared\n\n";
    }

    private function migrateUsers()
    {
        echo "👥 Migrating users...\n";
        
        // Get all users from source
        $users = $this->sourceDb->select('SELECT * FROM users ORDER BY id');
        
        foreach ($users as $user) {
            try {
                // Check if user already exists in target
                $existingUser = $this->targetDb->select(
                    'SELECT id FROM users WHERE email = ?',
                    [$user->email]
                );
                
                if (!empty($existingUser)) {
                    $this->stats['users']['skipped']++;
                    continue;
                }
                
                // Insert user into target database
                $this->targetDb->insert(
                    'INSERT INTO users (id, name, email, age, password, email_verified_at, created_at, updated_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        $user->id,
                        $user->name,
                        $user->email,
                        $user->age,
                        $user->password, // Already hashed in Node.js app
                        $user->email_verified_at ?? null,
                        $user->created_at ?? now(),
                        $user->updated_at ?? now()
                    ]
                );
                
                $this->stats['users']['migrated']++;
                echo "  ✓ Migrated user: {$user->email}\n";
                
            } catch (Exception $e) {
                $this->stats['users']['errors']++;
                echo "  ❌ Failed to migrate user {$user->email}: " . $e->getMessage() . "\n";
            }
        }
        
        echo "  📊 Users - Migrated: {$this->stats['users']['migrated']}, Skipped: {$this->stats['users']['skipped']}, Errors: {$this->stats['users']['errors']}\n\n";
    }

    private function migrateReviews()
    {
        echo "📝 Migrating reviews...\n";
        
        $reviews = $this->sourceDb->select('SELECT * FROM reviews ORDER BY id');
        
        foreach ($reviews as $review) {
            try {
                // Check if review already exists
                $existingReview = $this->targetDb->select(
                    'SELECT id FROM reviews WHERE user_id = ? AND movie_id = ?',
                    [$review->user_id, $review->movie_id]
                );
                
                if (!empty($existingReview)) {
                    $this->stats['reviews']['skipped']++;
                    continue;
                }
                
                $this->targetDb->insert(
                    'INSERT INTO reviews (id, user_id, movie_id, star_rating, review_content, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        $review->id,
                        $review->user_id,
                        $review->movie_id,
                        $review->star_rating,
                        $review->review_content,
                        $review->created_at ?? now(),
                        $review->updated_at ?? now()
                    ]
                );
                
                $this->stats['reviews']['migrated']++;
                echo "  ✓ Migrated review ID: {$review->id}\n";
                
            } catch (Exception $e) {
                $this->stats['reviews']['errors']++;
                echo "  ❌ Failed to migrate review {$review->id}: " . $e->getMessage() . "\n";
            }
        }
        
        echo "  📊 Reviews - Migrated: {$this->stats['reviews']['migrated']}, Skipped: {$this->stats['reviews']['skipped']}, Errors: {$this->stats['reviews']['errors']}\n\n";
    }

    private function migrateReactions()
    {
        echo "👍 Migrating reactions...\n";
        
        $reactions = $this->sourceDb->select('SELECT * FROM react ORDER BY id');
        
        foreach ($reactions as $reaction) {
            try {
                // Check if reaction already exists
                $existingReaction = $this->targetDb->select(
                    'SELECT id FROM reactions WHERE user_id = ? AND review_id = ?',
                    [$reaction->user_id, $reaction->review_id]
                );
                
                if (!empty($existingReaction)) {
                    $this->stats['reactions']['skipped']++;
                    continue;
                }
                
                $this->targetDb->insert(
                    'INSERT INTO reactions (id, user_id, review_id, reaction_type, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        $reaction->id,
                        $reaction->user_id,
                        $reaction->review_id,
                        $reaction->reaction_type,
                        $reaction->created_at ?? now(),
                        $reaction->updated_at ?? now()
                    ]
                );
                
                $this->stats['reactions']['migrated']++;
                echo "  ✓ Migrated reaction ID: {$reaction->id}\n";
                
            } catch (Exception $e) {
                $this->stats['reactions']['errors']++;
                echo "  ❌ Failed to migrate reaction {$reaction->id}: " . $e->getMessage() . "\n";
            }
        }
        
        echo "  📊 Reactions - Migrated: {$this->stats['reactions']['migrated']}, Skipped: {$this->stats['reactions']['skipped']}, Errors: {$this->stats['reactions']['errors']}\n\n";
    }

    private function migrateWatchlists()
    {
        echo "📺 Migrating watchlists...\n";
        
        $watchlists = $this->sourceDb->select('SELECT * FROM watchlist ORDER BY id');
        
        foreach ($watchlists as $watchlist) {
            try {
                // Check if watchlist entry already exists
                $existingWatchlist = $this->targetDb->select(
                    'SELECT id FROM watchlists WHERE user_id = ? AND movie_id = ?',
                    [$watchlist->user_id, $watchlist->movie_id]
                );
                
                if (!empty($existingWatchlist)) {
                    $this->stats['watchlists']['skipped']++;
                    continue;
                }
                
                $this->targetDb->insert(
                    'INSERT INTO watchlists (id, user_id, movie_id, added_at, created_at, updated_at)
                     VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        $watchlist->id,
                        $watchlist->user_id,
                        $watchlist->movie_id,
                        $watchlist->added_at ?? now(),
                        $watchlist->created_at ?? now(),
                        $watchlist->updated_at ?? now()
                    ]
                );
                
                $this->stats['watchlists']['migrated']++;
                echo "  ✓ Migrated watchlist ID: {$watchlist->id}\n";
                
            } catch (Exception $e) {
                $this->stats['watchlists']['errors']++;
                echo "  ❌ Failed to migrate watchlist {$watchlist->id}: " . $e->getMessage() . "\n";
            }
        }
        
        echo "  📊 Watchlists - Migrated: {$this->stats['watchlists']['migrated']}, Skipped: {$this->stats['watchlists']['skipped']}, Errors: {$this->stats['watchlists']['errors']}\n\n";
    }

    private function updateSequences()
    {
        echo "🔢 Updating database sequences...\n";
        
        // Update sequences to prevent ID conflicts
        $sequences = [
            'users_id_seq' => 'users',
            'reviews_id_seq' => 'reviews', 
            'reactions_id_seq' => 'reactions',
            'watchlists_id_seq' => 'watchlists'
        ];
        
        foreach ($sequences as $sequence => $table) {
            $maxId = $this->targetDb->select("SELECT COALESCE(MAX(id), 0) as max_id FROM {$table}")[0]->max_id;
            $this->targetDb->statement("SELECT setval('{$sequence}', {$maxId})");
            echo "  ✓ Updated {$sequence} to {$maxId}\n";
        }
        
        echo "\n";
    }

    private function verifyMigration()
    {
        echo "✅ Verifying migration...\n";
        
        $tables = ['users', 'reviews', 'reactions', 'watchlists'];
        
        foreach ($tables as $table) {
            $sourceCount = $this->sourceDb->select("SELECT COUNT(*) as count FROM {$table}")[0]->count;
            
            // Handle table name differences
            $targetTable = $table === 'react' ? 'reactions' : ($table === 'watchlist' ? 'watchlists' : $table);
            $targetCount = $this->targetDb->select("SELECT COUNT(*) as count FROM {$targetTable}")[0]->count;
            
            echo "  📊 {$table}: Source={$sourceCount}, Target={$targetCount}";
            
            if ($sourceCount == $targetCount) {
                echo " ✓\n";
            } else {
                echo " ⚠️ (difference: " . ($targetCount - $sourceCount) . ")\n";
            }
        }
        
        echo "\n";
    }

    private function printSummary()
    {
        echo "🎉 Migration completed!\n\n";
        echo "📊 MIGRATION SUMMARY:\n";
        echo "==================\n";
        
        $totalMigrated = 0;
        $totalErrors = 0;
        
        foreach ($this->stats as $table => $stats) {
            echo sprintf(
                "%-12s | Migrated: %3d | Skipped: %3d | Errors: %3d\n",
                ucfirst($table),
                $stats['migrated'],
                $stats['skipped'],
                $stats['errors']
            );
            
            $totalMigrated += $stats['migrated'];
            $totalErrors += $stats['errors'];
        }
        
        echo "==================\n";
        echo "Total Records Migrated: {$totalMigrated}\n";
        echo "Total Errors: {$totalErrors}\n";
        
        if ($totalErrors > 0) {
            echo "\n⚠️ Some errors occurred during migration. Please review the log above.\n";
        } else {
            echo "\n✅ All data migrated successfully!\n";
        }
        
        echo "\n🚀 Laravel API is now ready with migrated data!\n";
    }
}

// Execute migration
try {
    $migrator = new DataMigrator();
    $migrator->migrate();
} catch (Exception $e) {
    echo "\n💥 Migration failed with error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}
