import {getData, manipulateData, withTransaction} from "../dbConnection.js";

export class reactDAO {

    static async addLike(review_id,user_id,movie_id){
        return await manipulateData(
            `INSERT INTO react (review_id,user_id,movie_id,react_like)
             VALUES ($1,$2,$3,true)
             ON CONFLICT(review_id,user_id) DO UPDATE SET
             react_like = true
             `,
            [review_id,user_id,movie_id]
        );
    }

    static async addFunny(review_id,user_id,movie_id){
        return await manipulateData(
            `INSERT INTO react (review_id,user_id,movie_id,react_funny)
             VALUES ($1,$2,$3,true)
             ON CONFLICT(review_id,user_id) DO UPDATE SET
             react_funny = true
             `,
            [review_id,user_id,movie_id]
        );
    }

    static async removeLike(review_id,user_id){
        return await withTransaction(async (client) => {
            try {
                // Validate input parameters
                if (!review_id || !user_id) {
                    throw new Error('Review ID and User ID are required');
                }
                
                // Update react_like to false
                const removeLike = await client.query(
                    "UPDATE react SET react_like=false WHERE review_id = $1 AND user_id = $2 RETURNING *",
                    [review_id, user_id]
                );
                
                if (removeLike.rows.length === 0) {
                    throw new Error('Like reaction not found for this user and review');
                }
                
                const reaction = removeLike.rows[0];
                
                // If both like and funny are false, remove the entire reaction record
                if (!reaction.react_funny) {
                    await client.query(
                        "DELETE FROM react WHERE review_id = $1 AND user_id = $2",
                        [review_id, user_id]
                    );
                }
                
                return 1; // Success
                
            } catch (error) {
                throw error;
            }
        });
    }

    static async removeFunny(review_id,user_id){
        return await withTransaction(async (client) => {
            try {
                // Validate input parameters
                if (!review_id || !user_id) {
                    throw new Error('Review ID and User ID are required');
                }
                
                // Update react_funny to false
                const removeFunny = await client.query(
                    "UPDATE react SET react_funny=false WHERE review_id = $1 AND user_id = $2 RETURNING *",
                    [review_id, user_id]
                );
                
                if (removeFunny.rows.length === 0) {
                    throw new Error('Funny reaction not found for this user and review');
                }
                
                const reaction = removeFunny.rows[0];
                
                // If both like and funny are false, remove the entire reaction record
                if (!reaction.react_like) {
                    await client.query(
                        "DELETE FROM react WHERE review_id = $1 AND user_id = $2",
                        [review_id, user_id]
                    );
                }
                
                return 1; // Success
                
            } catch (error) {
                throw error;
            }
        });
    }

    static async removeReact(review_id,user_id){
        return await manipulateData("DELETE FROM react WHERE review_id = $1 AND user_id = $2",[review_id,user_id]);
    }
    
    // DEPRECATED: CASCADE DELETE now handles this automatically when review is deleted
    // This method is kept for backward compatibility but is no longer needed
    static async removeReactForReview(review_id){
        return await manipulateData("DELETE FROM react WHERE review_id = $1",[review_id]);
    }

    static async getReaction(user_id,movie_id,review_id){
        return await getData("SELECT * FROM react WHERE user_id = $1  and movie_id = $2 and review_id = $3",[user_id,movie_id,review_id]);
    }

    // static async removeReactForUser(user_id){
    //     return await manipulateData("DELETE FROM react WHERE user_id = $1",[user_id]);
    // }
    
}