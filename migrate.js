#!/usr/bin/env node

// Migration Runner for Movie Review System
// Usage: node migrate.js [migration-name]
// Example: node migrate.js 001_add_indexes_and_cascade_constraints

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function listMigrations() {
    console.log('📋 Available Migrations:');
    console.log('=' .repeat(50));
    
    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith('.js') && file !== 'README.md')
        .sort();
    
    files.forEach((file, index) => {
        const filePath = path.join(MIGRATIONS_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract migration info from comments
        const lines = content.split('\n');
        const descLine = lines.find(line => line.includes('Description:'));
        const dateLine = lines.find(line => line.includes('Date:'));
        
        const description = descLine ? descLine.split('Description:')[1].trim() : 'No description';
        const date = dateLine ? dateLine.split('Date:')[1].trim() : 'No date';
        
        console.log(`${index + 1}. ${file}`);
        console.log(`   📅 Date: ${date}`);
        console.log(`   📝 Description: ${description}`);
        console.log('');
    });
}

async function runMigration(migrationName) {
    const migrationPath = path.join(MIGRATIONS_DIR, migrationName);
    
    if (!fs.existsSync(migrationPath)) {
        console.error(`❌ Migration file not found: ${migrationName}`);
        console.log('\nAvailable migrations:');
        listMigrations();
        return;
    }
    
    if (migrationName.endsWith('.sql')) {
        console.log('📋 SQL Migration detected. Please run manually:');
        console.log(`psql -U postgres -d moviedb -f migrations/${migrationName}`);
        console.log('\nOr copy/paste the SQL content into your database client.');
        return;
    }
    
    if (migrationName.endsWith('.js')) {
        console.log(`🚀 Running migration: ${migrationName}`);
        console.log('=' .repeat(50));
        
        try {
            // Import and run the migration
            const migrationModule = await import(migrationPath);
            
            // If migration exports a function, run it
            if (typeof migrationModule.default === 'function') {
                await migrationModule.default();
            } else {
                // If it's a script that runs on import, it should have already run
                console.log('✅ Migration script executed on import');
            }
            
        } catch (error) {
            console.error(`❌ Error running migration: ${error.message}`);
            console.error('Stack trace:', error.stack);
        }
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('🗄️  Database Migration Runner');
    console.log('=' .repeat(50));
    console.log('Usage:');
    console.log('  node migrate.js [migration-name]');
    console.log('  node migrate.js list');
    console.log('');
    console.log('Examples:');
    console.log('  node migrate.js 001_add_indexes_and_cascade_constraints.js');
    console.log('  node migrate.js list');
    console.log('');
    listMigrations();
} else if (args[0] === 'list') {
    listMigrations();
} else {
    const migrationName = args[0];
    // Add .js extension if not provided
    const fullMigrationName = migrationName.endsWith('.js') || migrationName.endsWith('.sql') 
        ? migrationName 
        : `${migrationName}.js`;
    
    runMigration(fullMigrationName);
}
