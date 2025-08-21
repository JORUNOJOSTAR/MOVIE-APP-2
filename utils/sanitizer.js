import { body, validationResult } from 'express-validator';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create DOMPurify instance for server-side use
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Server-side HTML sanitization utility
 */
export class Sanitizer {
    
    /**
     * Sanitize HTML content - removes all HTML tags and dangerous content
     * @param {string} input - The input string to sanitize
     * @returns {string} - Sanitized string with HTML entities encoded
     */
    static sanitizeHtml(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        
        // Remove all HTML tags and encode entities
        return DOMPurify.sanitize(input, { 
            ALLOWED_TAGS: [], 
            ALLOWED_ATTR: [],
            KEEP_CONTENT: true
        });
    }
    
    /**
     * Sanitize text content - basic escaping for safe display
     * @param {string} input - The input string to sanitize
     * @returns {string} - Escaped string safe for HTML output
     */
    static escapeHtml(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    
    /**
     * Sanitize for safe URL usage
     * @param {string} input - The input string to sanitize
     * @returns {string} - URL-safe string
     */
    static sanitizeUrl(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        
        // Remove potential XSS vectors and encode for URL
        return encodeURIComponent(this.sanitizeHtml(input));
    }
    
    /**
     * Express validator middleware for review content
     * @returns {Array} - Array of validation middlewares
     */
    static validateReviewInput() {
        return [
            body('review.review_message')
                .trim()
                .isLength({ min: 1, max: 1000 })
                .withMessage('Review message must be between 1 and 1000 characters')
                .customSanitizer(value => this.sanitizeHtml(value)),
            
            body('review.star_message')
                .isInt({ min: 1, max: 5 })
                .withMessage('Star rating must be between 1 and 5'),
                
            body('review.movieId')
                .isInt()
                .withMessage('Movie ID must be a valid integer')
        ];
    }
    
    /**
     * Express validator middleware for search input
     * @returns {Array} - Array of validation middlewares
     */
    static validateSearchInput() {
        return [
            body('movieKeywords')
                .optional()
                .trim()
                .isLength({ max: 100 })
                .withMessage('Search keywords must be less than 100 characters')
                .customSanitizer(value => this.sanitizeHtml(value))
        ];
    }
    
    /**
     * Check validation results and return errors
     * @param {Object} req - Express request object
     * @returns {Object|null} - Validation errors or null
     */
    static getValidationErrors(req) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return {
                success: false,
                errors: errors.array()
            };
        }
        return null;
    }
}

export default Sanitizer;
