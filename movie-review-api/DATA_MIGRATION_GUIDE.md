# Data Migration Guide: Node.js to Laravel

## Overview
This guide covers migrating existing production data from the Node.js PostgreSQL database to the new Laravel API backend.

## Migration Scripts

### 1. Standalone PHP Script
**File**: `migrate-data.php`
- **Purpose**: Direct database-to-database migration
- **Features**: Backup creation, progress tracking, error handling
- **Usage**: `php migrate-data.php`

### 2. Laravel Artisan Command
**File**: `app/Console/Commands/MigrateFromNodeJS.php`
- **Purpose**: Laravel-integrated migration command
- **Features**: Dry-run mode, backup options, progress bars
- **Usage**: `php artisan migrate:from-nodejs`

## Migration Process

### Prerequisites
1. ✅ PostgreSQL extensions installed (`pdo_pgsql`, `pgsql`)
2. ✅ Laravel migrations completed
3. ✅ Database connection tested
4. 🔄 Backup of existing Node.js data

### Step 1: Backup Current Data
```bash
# Using Artisan command with backup
php artisan migrate:from-nodejs --backup

# Manual backup
pg_dump -h localhost -U postgres -d moviedb > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Run Migration (Dry Run)
```bash
# Test migration without changes
php artisan migrate:from-nodejs --dry-run
```

### Step 3: Execute Migration
```bash
# Using Artisan command
php artisan migrate:from-nodejs

# Or using standalone script
php migrate-data.php
```

## Data Mapping

### Table Mappings
| Node.js Table | Laravel Table | Notes |
|---------------|---------------|-------|
| `users` | `users` | Direct mapping |
| `reviews` | `reviews` | Direct mapping |
| `react` | `reactions` | Table renamed |
| `watchlist` | `watchlists` | Table renamed |

### Field Mappings

#### Users Table
| Node.js | Laravel | Notes |
|---------|---------|-------|
| `id` | `id` | Primary key |
| `name` | `name` | Direct mapping |
| `email` | `email` | Unique constraint |
| `age` | `age` | Age validation (1-100) |
| `password` | `password` | Pre-hashed bcrypt |
| `created_at` | `created_at` | Laravel timestamps |
| `updated_at` | `updated_at` | Laravel timestamps |

#### Reviews Table
| Node.js | Laravel | Notes |
|---------|---------|-------|
| `id` | `id` | Auto-increment |
| `user_id` | `user_id` | Foreign key |
| `movie_id` | `movie_id` | TMDB movie ID |
| `star_rating` | `star_rating` | 1-5 stars |
| `review_content` | `review_content` | Text content |
| `created_at` | `created_at` | Laravel timestamps |
| `updated_at` | `updated_at` | Laravel timestamps |

#### Reactions Table (react → reactions)
| Node.js | Laravel | Notes |
|---------|---------|-------|
| `id` | `id` | Auto-increment |
| `user_id` | `user_id` | Foreign key |
| `review_id` | `review_id` | Foreign key |
| `reaction_type` | `reaction_type` | like/dislike |
| `created_at` | `created_at` | Laravel timestamps |
| `updated_at` | `updated_at` | Laravel timestamps |

#### Watchlists Table (watchlist → watchlists)
| Node.js | Laravel | Notes |
|---------|---------|-------|
| `id` | `id` | Auto-increment |
| `user_id` | `user_id` | Foreign key |
| `movie_id` | `movie_id` | TMDB movie ID |
| `added_at` | `added_at` | When added to watchlist |
| `created_at` | `created_at` | Laravel timestamps |
| `updated_at` | `updated_at` | Laravel timestamps |

## Migration Features

### Error Handling
- ✅ Duplicate detection and skipping
- ✅ Foreign key constraint validation
- ✅ Transaction rollback on failures
- ✅ Detailed error logging

### Data Integrity
- ✅ Sequence updates after migration
- ✅ Foreign key relationship validation
- ✅ Data type compatibility checks
- ✅ Constraint validation

### Progress Tracking
- ✅ Real-time migration progress
- ✅ Success/failure statistics
- ✅ Detailed migration summary
- ✅ Error reporting

## Post-Migration Verification

### 1. Data Count Verification
```sql
-- Compare record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL  
SELECT 'reactions', COUNT(*) FROM reactions
UNION ALL
SELECT 'watchlists', COUNT(*) FROM watchlists;
```

### 2. Relationship Verification
```sql
-- Check foreign key relationships
SELECT 
    r.id,
    r.user_id,
    u.email,
    r.movie_id,
    r.star_rating
FROM reviews r
JOIN users u ON r.user_id = u.id
LIMIT 5;
```

### 3. API Testing
```bash
# Test API endpoints with migrated data
curl -X GET http://localhost:8000/api/v1/movies/550/reviews
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"existing@user.com","password":"password"}'
```

## Rollback Procedure

### If Migration Fails
1. **Stop Laravel application**
2. **Restore from backup**
   ```bash
   psql -h localhost -U postgres -d moviedb < backup_TIMESTAMP.sql
   ```
3. **Verify Node.js app functionality**
4. **Investigate migration errors**

### Backup Tables
- `backup_users_TIMESTAMP`
- `backup_reviews_TIMESTAMP`
- `backup_reactions_TIMESTAMP`
- `backup_watchlists_TIMESTAMP`

## Common Issues & Solutions

### Issue 1: Duplicate Key Errors
**Solution**: Migration script automatically skips duplicates

### Issue 2: Foreign Key Violations
**Solution**: Migration follows dependency order (users → reviews → reactions/watchlists)

### Issue 3: Sequence Out of Sync
**Solution**: Script automatically updates all sequences after migration

### Issue 4: Character Encoding Issues
**Solution**: Both databases use UTF-8 encoding

## Migration Checklist

- [ ] ✅ Database connection tested
- [ ] ✅ Laravel migrations completed
- [ ] ✅ Test data seeded successfully
- [ ] 🔄 Production data backed up
- [ ] 🔄 Migration script tested (dry-run)
- [ ] 🔄 Full migration executed
- [ ] 🔄 Data verification completed
- [ ] 🔄 API testing with migrated data
- [ ] 🔄 Node.js app shutdown
- [ ] 🔄 Laravel app deployed

## Contact & Support
For migration issues, check:
1. Laravel logs: `storage/logs/laravel.log`
2. Migration script output
3. PostgreSQL logs
4. Database connection settings in `.env`
