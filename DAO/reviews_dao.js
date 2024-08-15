import {getData,manipulateData} from "../dbConnection.js";
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
        const order_by = ["like_count","review_datetime","funny_count"];
        order = order > 2 ? 0:order;
        return await getData(
            `SELECT * FROM reviews WHERE movie_id = $1 
            ORDER BY ${order_by[order]} desc  
            limit 5 offset $2`,
            [movie_id,offset]
        );
    }

    
    // CREATE OR EDIT REVIEW
    static async updateReview(message,star,movie_id,user_id){
        let datetime = new Date();
        const result = await getData(`
            INSERT INTO reviews (review_message,review_star,review_datetime,movie_id,user_id)
               VALUES ($1,$2,$3,$4,$5)
               ON CONFLICT(movie_id,user_id) 
            DO UPDATE SET
               edited = true ,
               review_message = EXCLUDED.review_message,
               review_star = EXCLUDED.review_star,
               review_datetime = EXCLUDED.review_datetime 
               RETURNING *
            `,
            [message,star,datetime,movie_id,user_id]);
        const reviews = result[0] || {};
        return reviews;
    }

    // DELETE REVIEW
    // should check wheter users is owner of review
    static async deleteReview(review_id,user_id){
        let deleteStatus = -1;
        const deleteReact = await reactDAO.removeReactForReview(review_id);
        if(deleteReact>=0){
            deleteStatus = await manipulateData("DELETE FROM reviews WHERE id = $1 AND user_id = $2",[review_id,user_id]);
        }
        return deleteStatus;
    }


    
    // INCREASE OR DECREASE LIKE COUNT
    static async updateLikeCount(review_id,user_id,movie_id,decrease){
        let updateStatus = -1;
        let updateReact = decrease ? await reactDAO.removeLike(review_id,user_id) : await reactDAO.addLike(review_id,user_id,movie_id);
        let updateString = decrease?"-1":"+1";
        
        if(updateReact>0){
            updateStatus = await manipulateData(
                `UPDATE reviews SET like_count = like_count ${updateString} WHERE id = $1`,
                [review_id]);
        }

        return updateStatus;
    }

    // INCREASE OR DECREASE Funny COUNT
    static async updateFunnyCount(review_id,user_id,movie_id,decrease){
        let updateStatus = -1;
        let updateReact = decrease ? await reactDAO.removeFunny(review_id,user_id) : await reactDAO.addFunny(review_id,user_id,movie_id);
        let updateString = decrease?"-1":"+1";

        if(updateReact>0){
            updateStatus = await manipulateData(
                `UPDATE reviews SET funny_count = funny_count ${updateString} WHERE id = $1`,
                [review_id]);
        }

        return updateStatus;
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