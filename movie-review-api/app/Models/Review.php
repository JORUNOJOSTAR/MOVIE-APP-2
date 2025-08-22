<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'review_message',
        'review_star',
        'review_datetime',
        'like_count',
        'funny_count',
        'movie_id',
        'user_id',
        'edited',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'review_datetime' => 'datetime',
            'review_star' => 'integer',
            'like_count' => 'integer',
            'funny_count' => 'integer',
            'movie_id' => 'integer',
            'edited' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the review.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reactions for the review.
     */
    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }
}
