<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific movie.
     */
    public function index(Request $request, $movieId)
    {
        $reviews = Review::with(['user', 'reactions.user'])
            ->where('movie_id', $movieId)
            ->orderBy('review_datetime', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => ReviewResource::collection($reviews)->response()->getData()
        ]);
    }

    /**
     * Store a new review.
     */
    public function store(ReviewRequest $request)
    {
        // Check if user already reviewed this movie
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('movie_id', $request->movie_id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this movie'
            ], Response::HTTP_CONFLICT);
        }

        $review = Review::create([
            'review_message' => $request->review_message,
            'review_star' => $request->review_star,
            'movie_id' => $request->movie_id,
            'user_id' => $request->user()->id,
            'review_datetime' => now(),
            'like_count' => 0,
            'funny_count' => 0,
            'edited' => false,
        ]);

        $review->load(['user', 'reactions']);

        return response()->json([
            'success' => true,
            'message' => 'Review created successfully',
            'data' => new ReviewResource($review)
        ], Response::HTTP_CREATED);
    }

    /**
     * Update a specific review.
     */
    public function update(ReviewRequest $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user owns the review
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this review'
            ], Response::HTTP_FORBIDDEN);
        }

        $review->update([
            'review_message' => $request->review_message,
            'review_star' => $request->review_star,
            'edited' => true,
        ]);

        $review->load(['user', 'reactions']);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully',
            'data' => new ReviewResource($review)
        ]);
    }

    /**
     * Delete a specific review.
     */
    public function destroy(Request $request, $id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user owns the review
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this review'
            ], Response::HTTP_FORBIDDEN);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully'
        ]);
    }

    /**
     * Get user's reviews.
     */
    public function userReviews(Request $request)
    {
        $reviews = Review::with(['reactions'])
            ->where('user_id', $request->user()->id)
            ->orderBy('review_datetime', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => ReviewResource::collection($reviews)->response()->getData()
        ]);
    }
}
