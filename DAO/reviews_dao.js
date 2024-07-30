import {executeQuery,getData,manipulateData} from "../dbConnection.js";

export class reviewDAO{

    // Get all reviews of movie
    static async getReviewByMovieId(movie_id){
        return await getData("SELECT * FROM reviews WHERE movie_id = $1",[movie_id]);
    }

    // Get all reviews of user
    static async getReviewByUserId(user_id){
        return await getData(`SELECT * FROM reviews WHERE user_id = $1`,[user_id]);
    }


    //Get review by Order
    static async getReviewByOrder(order=0){
        const order_by = ["like_count","review_datetime","funny_count"];
        order = order > 2 ? 0:order;
        return await getData(`SELECT * FROM reviews ORDER BY ${order_by[order]} desc`);
    }

    
    // CREATE OR EDIT REVIEW
    static async updateReview(message,star,movie_id,user_id){
        let datetime = new Date();
        const result = await getData(`
            INSERT INTO reviews (review_message,review_star,review_datetime,movie_id,user_id)
               VALUES ($1,$2,$3,$4,$5)
               ON CONFLICT(movie_id,user_id) 
            DO UPDATE SET
               review_message = EXCLUDED.review_message,
               review_star = EXCLUDED.review_star,
               review_datetime = EXCLUDED.review_datetime RETURNING *
            `,
            [message,star,datetime,movie_id,user_id]);
        const reviews = result[0] || [];
        return reviews;
    }

    // DELETE REVIEW
    static async deleteReview(review_id){
        return await manipulateData("DELETE FROM reviews WHERE id = $1",[review_id]);
    }
    
    // INCREASE OR DECREASE LIKE COUNT
    static async updateLikeCount(review_id,decrease=false){
        let updateStatus = -1;
        let updateString = decrease?"-1":"+1";

        return await manipulateData(
            `UPDATE reviews SET like_count = like_count ${updateString} WHERE id = $1`,
            [review_id]);
    }

    // INCREASE OR DECREASE Funny COUNT
    static async updateFunnyCount(review_id,decrease=false){
        let updateStatus = -1;
        let updateString = decrease?"-1":"+1";

        return await manipulateData(
            `UPDATE reviews SET funny_count = funny_count ${updateString} WHERE id = $1`,
            [review_id]);
    }
    
};