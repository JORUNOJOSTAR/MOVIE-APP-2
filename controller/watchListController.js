import express from "express";
import { getMovieData } from "../api/movieapi.js";
const router = express.Router();

router.get("/watchList",async(req,res)=>{
    let movieData = [];
    let {movieId} = req.cookies;
    movieId = movieId || "";
    const movieList = movieId.split(",").filter(e=>Boolean(e));

    for(let i=0;i<movieList.length;i++){
        movieData.push(await getMovieData(movieList[i],false));
    }

    res.render("watchList.ejs",
        {
            "movieData":movieData,
        }
    );
})

export default router;