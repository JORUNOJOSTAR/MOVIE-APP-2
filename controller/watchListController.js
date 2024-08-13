import express from "express";
import { getMovieData } from "../api/movieapi.js";
import watchlist_dao from "../DAO/watchlist_dao.js";
const router = express.Router();

router.get("/watchList",async(req,res)=>{
    let movieData = []
    if(req.session.userId){
        let watchList = await watchlist_dao.getWatchList(req.session.userId);
        watchList = watchList.map(e=>e.movie_id);
        movieData = await getAllMovies(watchList);
    }else{
       movieData=await guestWatchList(req.cookies);
    }

    res.render("watchList.ejs",
        {
            movieData:movieData
        }
    );
})

router.get("/checkWatchList",async(req,res)=>{
    let watchList = []
    if(req.session.userId){
        watchList = await watchlist_dao.getWatchList(req.session.userId);
        watchList = watchList.map(e=>e.movie_id);
    }else{
        watchList = cookieToList(req.cookies);
    }
    res.json({
        watchList : watchList
    });
})

router.post("/setWatchList",async(req,res)=>{
    if(req.session.userId){
        let userId = req.session.userId;
        let watchList = await watchlist_dao.getWatchList(userId);
        watchList = watchList.map(e=>e.movie_id);
        const movieId = parseInt(req.body.movieId);
        if(watchList.includes(movieId)){
            res.json({status: await watchlist_dao.deleteFromWatchlist(userId,movieId)})
        }else{
            res.json({status: await watchlist_dao.addToWatchlist(userId,movieId)})
        };
    }else{
        res.json({status:-1});
    }
})

function cookieToList(cookies){
    let {movieId} = cookies;
    movieId = movieId || "";
    return movieId.split(",").filter(e=>Boolean(e));
}

async function guestWatchList(cookies){
    const movieList = cookieToList(cookies);
    return await getAllMovies(movieList);
}

async function getAllMovies(movieIdList) {
    let movieData = []
    for(let i=0;i<movieIdList.length;i++){
        movieData.push(await getMovieData(movieIdList[i],false));
    }
    return movieData;
}

export default router;