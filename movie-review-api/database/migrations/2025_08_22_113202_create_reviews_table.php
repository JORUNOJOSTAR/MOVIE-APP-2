<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->text('review_message');
            $table->smallInteger('review_star');
            $table->timestamp('review_datetime');
            $table->integer('like_count')->default(0);
            $table->integer('funny_count')->default(0);
            $table->integer('movie_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->boolean('edited')->default(false);
            $table->timestamps();
            
            // Composite primary key: one review per user per movie
            $table->unique(['user_id', 'movie_id']);
            
            // Indexes for performance
            $table->index('movie_id');
            $table->index('review_datetime');
        });
        
        // Add check constraints using raw SQL
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT review_star_check CHECK (review_star >= 1 AND review_star <= 5)');
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT like_count_check CHECK (like_count >= 0)');
        DB::statement('ALTER TABLE reviews ADD CONSTRAINT funny_count_check CHECK (funny_count >= 0)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
