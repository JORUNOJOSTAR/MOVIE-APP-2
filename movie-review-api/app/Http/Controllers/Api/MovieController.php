<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class MovieController extends Controller
{
    /**
     * Search for movies.
     */
    public function search(Request $request)
    {
        $query = $request->get('query');
        
        if (empty($query)) {
            return response()->json([
                'success' => false,
                'message' => 'Search query is required'
            ], Response::HTTP_BAD_REQUEST);
        }

        $cacheKey = "movie_search_" . md5($query);
        
        $movies = Cache::remember($cacheKey, 3600, function () use ($query) {
            $apiKey = config('services.tmdb.api_key');
            $url = "https://api.themoviedb.org/3/search/movie?api_key={$apiKey}&query=" . urlencode($query);
            
            $response = Http::get($url);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return null;
        });

        if (!$movies) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch movies'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return response()->json([
            'success' => true,
            'data' => $movies
        ]);
    }

    /**
     * Get movie details by ID.
     */
    public function show($id)
    {
        $cacheKey = "movie_details_{$id}";
        
        $movie = Cache::remember($cacheKey, 7200, function () use ($id) {
            $apiKey = config('services.tmdb.api_key');
            $url = "https://api.themoviedb.org/3/movie/{$id}?api_key={$apiKey}";
            
            $response = Http::get($url);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return null;
        });

        if (!$movie) {
            return response()->json([
                'success' => false,
                'message' => 'Movie not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $movie
        ]);
    }

    /**
     * Get popular movies.
     */
    public function popular(Request $request)
    {
        $page = $request->get('page', 1);
        $cacheKey = "popular_movies_page_{$page}";
        
        $movies = Cache::remember($cacheKey, 1800, function () use ($page) {
            $apiKey = config('services.tmdb.api_key');
            $url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key={$apiKey}&page={$page}";
            
            $response = Http::get($url);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return null;
        });

        if (!$movies) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch popular movies'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return response()->json([
            'success' => true,
            'data' => $movies
        ]);
    }

    /**
     * Get movie genres.
     */
    public function genres()
    {
        $cacheKey = "movie_genres";
        
        $genres = Cache::remember($cacheKey, 86400, function () {
            $apiKey = config('services.tmdb.api_key');
            $url = "https://api.themoviedb.org/3/genre/movie/list?api_key={$apiKey}";
            
            $response = Http::get($url);
            
            if ($response->successful()) {
                return $response->json();
            }
            
            return null;
        });

        if (!$genres) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch genres'
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return response()->json([
            'success' => true,
            'data' => $genres
        ]);
    }
}
