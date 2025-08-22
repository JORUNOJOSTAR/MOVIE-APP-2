<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reaction;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class ReactionController extends Controller
{
    /**
     * Add or update a reaction to a review.
     */
    public function react(Request $request, $reviewId)
    {
        $validator = Validator::make($request->all(), [
            'react_like' => 'boolean',
            'react_funny' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $review = Review::find($reviewId);
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Check if user is trying to react to their own review
        if ($review->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot react to your own review'
            ], Response::HTTP_FORBIDDEN);
        }

        $userId = $request->user()->id;
        
        // Find existing reaction or create new one
        $reaction = Reaction::where('review_id', $reviewId)
            ->where('user_id', $userId)
            ->first();

        $oldLike = $reaction ? $reaction->react_like : false;
        $oldFunny = $reaction ? $reaction->react_funny : false;
        
        $newLike = $request->has('react_like') ? $request->react_like : $oldLike;
        $newFunny = $request->has('react_funny') ? $request->react_funny : $oldFunny;

        if ($reaction) {
            $reaction->update([
                'react_like' => $newLike,
                'react_funny' => $newFunny,
            ]);
        } else {
            $reaction = Reaction::create([
                'review_id' => $reviewId,
                'user_id' => $userId,
                'movie_id' => $review->movie_id,
                'react_like' => $newLike,
                'react_funny' => $newFunny,
            ]);
        }

        // Update counters in review
        $likeDiff = ($newLike ? 1 : 0) - ($oldLike ? 1 : 0);
        $funnyDiff = ($newFunny ? 1 : 0) - ($oldFunny ? 1 : 0);

        $review->increment('like_count', $likeDiff);
        $review->increment('funny_count', $funnyDiff);

        return response()->json([
            'success' => true,
            'message' => 'Reaction updated successfully',
            'data' => [
                'reaction' => $reaction,
                'review_counters' => [
                    'like_count' => $review->fresh()->like_count,
                    'funny_count' => $review->fresh()->funny_count,
                ]
            ]
        ]);
    }

    /**
     * Remove a reaction from a review.
     */
    public function removeReaction(Request $request, $reviewId)
    {
        $review = Review::find($reviewId);
        if (!$review) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $userId = $request->user()->id;
        
        $reaction = Reaction::where('review_id', $reviewId)
            ->where('user_id', $userId)
            ->first();

        if (!$reaction) {
            return response()->json([
                'success' => false,
                'message' => 'No reaction found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Update counters in review
        if ($reaction->react_like) {
            $review->decrement('like_count');
        }
        if ($reaction->react_funny) {
            $review->decrement('funny_count');
        }

        $reaction->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reaction removed successfully',
            'data' => [
                'review_counters' => [
                    'like_count' => $review->fresh()->like_count,
                    'funny_count' => $review->fresh()->funny_count,
                ]
            ]
        ]);
    }
}
