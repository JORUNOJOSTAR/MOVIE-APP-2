import {executeQuery,getData,manipulateData} from "../dbConnection.js";

export default class watchlist_dao{

    static async getWatchList(user_id){
        return await getData("SELECT * FROM watchlist WHERE user_id = $1",[user_id]);
    }

    static async addToWatchlist(user_id,movie_id){
        const add_date = new Date();
        return await manipulateData("INSERT INTO watchlist (user_id,movie_id,add_date) VALUES ($1,$2,$3)",[user_id,movie_id,add_date]);
    }

    static async deleteFromWatchlist(user_id,movie_id){
        return await manipulateData("DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2",[user_id,movie_id]);
    }
}