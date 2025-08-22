<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        
        // Sample movie IDs (from TMDB)
        $movieIds = [550, 680, 155, 13, 24428, 27205]; // Fight Club, Pulp Fiction, Dark Knight, etc.
        
        $sampleReviews = [
            'This movie is absolutely amazing! Great storyline and fantastic acting.',
            'One of the best films I\'ve ever watched. Highly recommended!',
            'Decent movie but could have been better. Worth watching once.',
            'Mind-blowing cinematography and direction. A masterpiece!',
            'Not my cup of tea, but I can see why others might enjoy it.',
            'Excellent character development and plot twists throughout.',
            'A bit slow-paced but the ending makes it all worth it.',
            'Outstanding performances by all the actors. Must watch!',
        ];

        foreach ($users as $user) {
            // Each user reviews 2-3 random movies
            $userMovies = collect($movieIds)->random(rand(2, 3));
            
            foreach ($userMovies as $movieId) {
                Review::create([
                    'user_id' => $user->id,
                    'movie_id' => $movieId,
                    'review_message' => $sampleReviews[array_rand($sampleReviews)],
                    'review_star' => rand(1, 5),
                    'review_datetime' => now()->subDays(rand(1, 30)),
                    'like_count' => rand(0, 15),
                    'funny_count' => rand(0, 8),
                    'edited' => rand(0, 1) ? true : false,
                ]);
            }
        }
    }
}
