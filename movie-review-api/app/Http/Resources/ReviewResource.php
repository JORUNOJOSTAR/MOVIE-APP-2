<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'review_message' => $this->review_message,
            'review_star' => $this->review_star,
            'review_datetime' => $this->review_datetime->format('Y-m-d H:i:s'),
            'like_count' => $this->like_count,
            'funny_count' => $this->funny_count,
            'movie_id' => $this->movie_id,
            'edited' => $this->edited,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // User information
            'user' => $this->when($this->relationLoaded('user'), function () {
                return new UserResource($this->user);
            }),
            
            // Reactions information
            'reactions_count' => $this->when($this->relationLoaded('reactions'), function () {
                return $this->reactions->count();
            }),
            'reactions' => $this->when($this->relationLoaded('reactions'), function () {
                return $this->reactions->map(function ($reaction) {
                    return [
                        'user_id' => $reaction->user_id,
                        'react_like' => $reaction->react_like,
                        'react_funny' => $reaction->react_funny,
                        'user' => $reaction->user ? $reaction->user->name : null,
                    ];
                });
            }),
            
            // Current user's reaction (if authenticated)
            'user_reaction' => $this->when(auth()->check(), function () {
                $userReaction = $this->reactions->where('user_id', auth()->id())->first();
                return $userReaction ? [
                    'react_like' => $userReaction->react_like,
                    'react_funny' => $userReaction->react_funny,
                ] : null;
            }),
        ];
    }
}
