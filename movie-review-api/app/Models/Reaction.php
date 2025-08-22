<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reaction extends Model
{
    use HasFactory;

    /**
     * The primary key for the model.
     *
     * @var array
     */
    protected $primaryKey = ['review_id', 'user_id'];

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'review_id',
        'user_id',
        'react_like',
        'react_funny',
        'movie_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'react_like' => 'boolean',
            'react_funny' => 'boolean',
            'movie_id' => 'integer',
        ];
    }

    /**
     * Get the user that owns the reaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the review that owns the reaction.
     */
    public function review()
    {
        return $this->belongsTo(Review::class);
    }
}
