<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // This resource formats TMDB API data
        return [
            'id' => $this->resource['id'] ?? null,
            'title' => $this->resource['title'] ?? null,
            'original_title' => $this->resource['original_title'] ?? null,
            'overview' => $this->resource['overview'] ?? null,
            'poster_path' => $this->resource['poster_path'] ? 
                config('services.tmdb.image_base_url') . $this->resource['poster_path'] : null,
            'backdrop_path' => $this->resource['backdrop_path'] ? 
                config('services.tmdb.image_base_url') . $this->resource['backdrop_path'] : null,
            'release_date' => $this->resource['release_date'] ?? null,
            'vote_average' => $this->resource['vote_average'] ?? 0,
            'vote_count' => $this->resource['vote_count'] ?? 0,
            'popularity' => $this->resource['popularity'] ?? 0,
            'adult' => $this->resource['adult'] ?? false,
            'genre_ids' => $this->resource['genre_ids'] ?? [],
            'genres' => $this->resource['genres'] ?? [],
            'runtime' => $this->resource['runtime'] ?? null,
            'budget' => $this->resource['budget'] ?? null,
            'revenue' => $this->resource['revenue'] ?? null,
            'tagline' => $this->resource['tagline'] ?? null,
            'status' => $this->resource['status'] ?? null,
        ];
    }
}
