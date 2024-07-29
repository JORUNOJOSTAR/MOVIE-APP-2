import {executeQuery} from "../dbConnection.js";

export class reviewDAO{

    // Get all reviews of movie
    static async getReviewByMovieId(movie_id){
        let reviews = {};
        const result = await executeQuery("SELECT * FROM reviews WHERE movie_id = $1",[movie_id]);
        if(result.rows && result.rows.length>0){
            reviews=result.rows;
        }
        return reviews;
    }


    // Get all reviews of user
    static async getReviewByUserId(user_id){
        let reviews = {};
        const result = await executeQuery(`SELECT * FROM reviews WHERE user_id = $1`,[user_id]);
        if(result.rows && result.rows.length>0){
            reviews=result.rows;
        }
        return reviews;
    }


    //Get review by Order
    static async getReviewByOrder(order){
        
    }

    

    // CREATE OR EDIT REVIEW
    static async updateReview(message,star,movie_id,user_id){
        let reviews = {};
        let datetime = new Date();
        const result = await executeQuery(`
            INSERT INTO reviews (review_message,review_star,review_datetime,movie_id,user_id)
               VALUES ($1,$2,$3,$4,$5)
               ON CONFLICT(movie_id,user_id) 
            DO UPDATE SET
               review_message = EXCLUDED.review_message,
               review_star = EXCLUDED.review_star,
               review_datetime = EXCLUDED.review_datetime RETURNING *
            `,
            [message,star,datetime,movie_id,user_id]);

        if(result.rows && result.rows.length>0){
            reviews=result.rows[0];
        }
        return reviews;
    }

    // DELETE REVIEW
    static async deleteReview(review_id){
        let deleteStatus = -1;
        const result = await executeQuery("DELETE FROM reviews WHERE id = $1",[review_id]);
        if(result.rowCount){
            deleteStatus=result.rowCount;
        }
        return deleteStatus;
    }
    
    // INCREASE OR DECREASE LIKE COUNT
    
    static async updateLikeCount(review_id){
        // const sql = `This is a string ${review_id}`;
    }

    // INCREASE OR DECREASE Funny COUNT
    static async updateFunnyCount(review_id){

    }

    
    
};