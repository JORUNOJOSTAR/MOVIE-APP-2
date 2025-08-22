<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ReactionController;
use App\Http\Controllers\Api\WatchlistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication routes
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Public movie routes
    Route::get('/movies/search', [MovieController::class, 'search']);
    Route::get('/movies/popular', [MovieController::class, 'popular']);
    Route::get('/movies/genres', [MovieController::class, 'genres']);
    Route::get('/movies/{id}', [MovieController::class, 'show']);
    
    // Public review routes (get reviews for a movie)
    Route::get('/movies/{movieId}/reviews', [ReviewController::class, 'index']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    
    // Review routes
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::put('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
    Route::get('/user/reviews', [ReviewController::class, 'userReviews']);
    
    // Reaction routes
    Route::post('/reviews/{reviewId}/react', [ReactionController::class, 'react']);
    Route::delete('/reviews/{reviewId}/react', [ReactionController::class, 'removeReaction']);
    
    // Watchlist routes
    Route::get('/user/watchlist', [WatchlistController::class, 'index']);
    Route::post('/watchlist', [WatchlistController::class, 'store']);
    Route::delete('/watchlist/{movieId}', [WatchlistController::class, 'destroy']);
    Route::get('/watchlist/{movieId}/check', [WatchlistController::class, 'check']);
});
