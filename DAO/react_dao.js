import {getData, manipulateData} from "../dbConnection.js";

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
        let removeStatus = -1
        const removeLike = await getData("UPDATE react SET react_like=false WHERE review_id = $1 AND user_id = $2 RETURNING *",[review_id,user_id]);
        if(removeLike[0]){
            removeStatus = 1;
            if(!removeLike[0].react_funny){
                await this.removeReact(review_id,user_id);
            }
        }
        return removeStatus;
    }

    static async removeFunny(review_id,user_id){
        let removeStatus = -1
        const removeFunny = await getData("UPDATE react SET react_funny=false WHERE review_id = $1 AND user_id = $2 RETURNING *",[review_id,user_id]);
        if(removeFunny[0]){
            removeStatus = 1;
            if(!removeFunny[0].react_like){
                await this.removeReact(review_id,user_id);
            }
        }
        return removeStatus;
    }

    static async removeReact(review_id,user_id){
        return await manipulateData("DELETE FROM react WHERE review_id = $1 AND user_id = $2",[review_id,user_id]);
    }
    
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