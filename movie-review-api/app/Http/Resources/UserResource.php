<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'age' => $this->age,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            
            // Include relationships when loaded
            'reviews_count' => $this->when($this->relationLoaded('reviews'), function () {
                return $this->reviews->count();
            }),
            'reviews' => $this->when($this->relationLoaded('reviews'), function () {
                return ReviewResource::collection($this->reviews);
            }),
            'watchlist_count' => $this->when($this->relationLoaded('watchlist'), function () {
                return $this->watchlist->count();
            }),
        ];
    }
}
