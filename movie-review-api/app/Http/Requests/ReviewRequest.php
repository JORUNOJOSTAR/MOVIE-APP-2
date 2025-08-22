<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'review_message' => 'required|string|min:10|max:2000',
            'review_star' => 'required|integer|min:1|max:5',
            'movie_id' => 'required|integer',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'review_message.required' => 'Review message is required.',
            'review_message.min' => 'Review message must be at least 10 characters.',
            'review_message.max' => 'Review message cannot exceed 2000 characters.',
            'review_star.required' => 'Star rating is required.',
            'review_star.min' => 'Star rating must be at least 1.',
            'review_star.max' => 'Star rating cannot be more than 5.',
            'movie_id.required' => 'Movie ID is required.',
            'movie_id.integer' => 'Movie ID must be a valid number.',
        ];
    }
}
