<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

// Create new capsule instance
$capsule = new Capsule;

// Add database connection
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
]);

// Set the event dispatcher used by Eloquent models
$capsule->setAsGlobal();

// Setup the Eloquent ORM
$capsule->bootEloquent();

try {
    // Test the connection
    $pdo = $capsule->getConnection()->getPdo();
    echo "✓ Database connection successful!\n";
    echo "Database name: " . $capsule->getConnection()->getDatabaseName() . "\n";
    
    // Test a simple query
    $result = $capsule->getConnection()->select('SELECT version() as version');
    echo "PostgreSQL Version: " . $result[0]->version . "\n";
    
    // Check if our tables exist
    $tables = $capsule->getConnection()->select("
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    ");
    
    echo "\nTables in database:\n";
    foreach ($tables as $table) {
        echo "- " . $table->table_name . "\n";
    }
    
    // Count records in users table if it exists
    try {
        $userCount = $capsule->getConnection()->select('SELECT COUNT(*) as count FROM users')[0]->count;
        echo "\nUsers in database: " . $userCount . "\n";
    } catch (Exception $e) {
        echo "Users table not accessible or empty\n";
    }
    
    echo "\n✓ Database connection test completed successfully!\n";
    
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
