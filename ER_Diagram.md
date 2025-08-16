# Movie Review System - Database Documentation

This directory contains the complete database documentation for the Movie Review System.

## Documentation Files

### 📊 [ER_Diagram_Visual.md](./ER_Diagram_Visual.md)
Contains the visual Entity-Relationship diagram using Mermaid syntax. This file shows:
- Database tables and their fields
- Relationships between entities
- Primary and foreign keys
- Quick reference guide

### 📋 [Database_Schema.md](./Database_Schema.md)
Contains detailed documentation including:
- Comprehensive entity descriptions
- Table specifications with data types
- Detailed relationship explanations
- Database design decisions and notes
- Performance recommendations
- Indexing suggestions

### 🔧 [Database_Optimization_Analysis.md](./Database_Optimization_Analysis.md)
Comprehensive analysis and optimization recommendations:
- Current strengths and weaknesses
- Critical performance issues
- Detailed optimization strategies
- Implementation priorities
- Migration scripts
- Expected performance improvements

### 🗄️ [migrations/](./migrations/)
Database migration scripts and management:
- Applied optimizations and schema changes
- Migration runner for easy execution
- Detailed migration history and documentation
- See [migrations/README.md](./migrations/README.md) for details

## Quick Migration Commands

```bash
# List all available migrations
node migrate.js list

# Run a specific migration
node migrate.js 001_add_indexes_and_cascade_constraints

# View migration documentation
cat migrations/README.md
```

## Quick Overview

**Database Tables**: 5 main tables
- **USERS** - User account management
- **REVIEWS** - Movie reviews and ratings
- **REACT** - User reactions to reviews
- **WATCHLIST** - User movie watchlists
- **SESSION** - Authentication sessions

**Key Features**:
- Composite primary keys for data integrity
- External movie API integration
- Flexible reaction system
- Session-based authentication

## Getting Started

1. View the visual diagram: [ER_Diagram_Visual.md](./ER_Diagram_Visual.md)
2. Read detailed specifications: [Database_Schema.md](./Database_Schema.md)
3. Refer to SQL implementation: [queries.sql](./queries.sql)
