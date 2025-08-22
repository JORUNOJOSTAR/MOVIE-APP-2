<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Watchlist;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class WatchlistController extends Controller
{
    /**
     * Get user's watchlist.
     */
    public function index(Request $request)
    {
        $watchlist = Watchlist::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $watchlist
        ]);
    }

    /**
     * Add a movie to watchlist.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'movie_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $userId = $request->user()->id;
        $movieId = $request->movie_id;

        // Check if movie is already in watchlist
        $existingEntry = Watchlist::where('user_id', $userId)
            ->where('movie_id', $movieId)
            ->first();

        if ($existingEntry) {
            return response()->json([
                'success' => false,
                'message' => 'Movie is already in your watchlist'
            ], Response::HTTP_CONFLICT);
        }

        $watchlistEntry = Watchlist::create([
            'user_id' => $userId,
            'movie_id' => $movieId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Movie added to watchlist successfully',
            'data' => $watchlistEntry
        ], Response::HTTP_CREATED);
    }

    /**
     * Remove a movie from watchlist.
     */
    public function destroy(Request $request, $movieId)
    {
        $userId = $request->user()->id;

        $watchlistEntry = Watchlist::where('user_id', $userId)
            ->where('movie_id', $movieId)
            ->first();

        if (!$watchlistEntry) {
            return response()->json([
                'success' => false,
                'message' => 'Movie not found in your watchlist'
            ], Response::HTTP_NOT_FOUND);
        }

        $watchlistEntry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Movie removed from watchlist successfully'
        ]);
    }

    /**
     * Check if a movie is in user's watchlist.
     */
    public function check(Request $request, $movieId)
    {
        $userId = $request->user()->id;

        $inWatchlist = Watchlist::where('user_id', $userId)
            ->where('movie_id', $movieId)
            ->exists();

        return response()->json([
            'success' => true,
            'data' => [
                'in_watchlist' => $inWatchlist
            ]
        ]);
    }
}
