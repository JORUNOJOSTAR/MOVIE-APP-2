import {getData,manipulateData,withTransaction} from "../dbConnection.js";
import { reactDAO } from "./react_dao.js";

export class reviewDAO{

    // Get all reviews of movie
    static async getReviewByMovieId(movie_id){
        return await getData("SELECT * FROM reviews WHERE movie_id = $1",[movie_id]);
    }

    // Get all reviews of user
    static async getReviewByUserId(user_id){
        return await getData(`SELECT * FROM reviews WHERE user_id = $1`,[user_id]);
    }
    
    static async getReviewByUserAndMovieId(user_id,movie_id){
        return await getData(`SELECT * FROM reviews WHERE user_id = $1 AND movie_id = $2`,[user_id,movie_id]);
    }


    //Get review by Order
    static async getReviewByOrder(movie_id,offset,order=0){
        // Validate and sanitize order parameter to prevent SQL injection
        const validOrders = {
            0: "like_count",
            1: "review_datetime", 
            2: "funny_count"
        };
        
        // Ensure order is a valid integer and within acceptable range
        const sanitizedOrder = parseInt(order);
        const orderBy = validOrders[sanitizedOrder] || validOrders[0];
        
        return await getData(
            `SELECT * FROM reviews WHERE movie_id = $1 
            ORDER BY ${orderBy} DESC  
            LIMIT 5 OFFSET $2`,
            [movie_id,offset]
        );
    }

    
    // CREATE OR EDIT REVIEW - Now with transaction support
    static async updateReview(message, star, movie_id, user_id){
        return await withTransaction(async (client) => {
            try {
                const datetime = new Date();
                
                // Validate input parameters
                if (!message || message.trim().length === 0) {
                    throw new Error('Review message cannot be empty');
                }
                
                if (!star || star < 1 || star > 5) {
                    throw new Error('Star rating must be between 1 and 5');
                }
                
                if (!movie_id || !user_id) {
                    throw new Error('Movie ID and User ID are required');
                }
                
                // Execute the insert/update operation within transaction
                const result = await client.query(`
                    INSERT INTO reviews (review_message,review_star,review_datetime,movie_id,user_id)
                       VALUES ($1,$2,$3,$4,$5)
                       ON CONFLICT(movie_id,user_id) 
                    DO UPDATE SET
                       edited = true,
                       review_message = EXCLUDED.review_message,
                       review_star = EXCLUDED.review_star,
                       review_datetime = EXCLUDED.review_datetime 
                       RETURNING *
                    `,
                    [message, star, datetime, movie_id, user_id]
                );
                
                // Additional validation - ensure the operation was successful
                if (result.rows.length === 0) {
                    throw new Error('Failed to create or update review');
                }
                
                const review = result.rows[0];
                
                // Log operation for audit trail (in development)
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`Review ${review.edited ? 'updated' : 'created'} for user ${user_id}, movie ${movie_id}`);
                }
                
                return review;
                
            } catch (error) {
                // Error will be caught by withTransaction and rolled back
                throw error;
            }
        });
    }

    // DELETE REVIEW
    // Note: CASCADE DELETE automatically removes all related reactions
    // No need to manually delete reactions - database handles it automatically
    static async deleteReview(review_id,user_id){
        return await withTransaction(async (client) => {
            try {
                // Validate input parameters
                if (!review_id || !user_id) {
                    throw new Error('Review ID and User ID are required');
                }
                
                // Delete the review with user verification - cascade constraints handle reaction cleanup
                const result = await client.query(
                    "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *",
                    [review_id, user_id]
                );
                
                // Verify the deletion was successful
                if (result.rows.length === 0) {
                    throw new Error('Review not found or user not authorized to delete this review');
                }
                
                // Log operation for audit trail (in development)
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`Review ${review_id} deleted by user ${user_id}`);
                }
                
                return result.rowCount;
                
            } catch (error) {
                throw error;
            }
        });
    }


    
    // INCREASE OR DECREASE LIKE COUNT
    // Note: Triggers now automatically maintain like_count, so we only need to update reactions
    static async updateLikeCount(review_id,user_id,movie_id,decrease){
        // The trigger will automatically update like_count when react table changes
        return decrease ? await reactDAO.removeLike(review_id,user_id) : await reactDAO.addLike(review_id,user_id,movie_id);
    }

    // INCREASE OR DECREASE Funny COUNT
    // Note: Triggers now automatically maintain funny_count, so we only need to update reactions
    static async updateFunnyCount(review_id,user_id,movie_id,decrease){
        // The trigger will automatically update funny_count when react table changes
        return decrease ? await reactDAO.removeFunny(review_id,user_id) : await reactDAO.addFunny(review_id,user_id,movie_id);
    }

    static async ratingOfMovie(movie_id){
        return await getData("SELECT review_star FROM reviews WHERE movie_id = $1 ",[movie_id]);
    }

    // DELETE REVIEW BY USER_ID
    // static async deleteReviewForUser(user_id){
    //     let deleteStatus = -1;
    //     const deleteReact = await reactDAO.removeReactForUser(user_id);
    //     if(deleteReact>0){
    //         deleteStatus = await manipulateData("DELETE FROM reviews WHERE user_id = $1",[user_id]);
    //     }
    //     return deleteStatus;
    // }

};