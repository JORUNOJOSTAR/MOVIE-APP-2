import express from "express";
import { getMovieData } from "../api/movieapi.js";
const router = express.Router();

router.post('/movie/:name', async(req, res)=>{
    const movieName = req.params.name;
    const movieId = req.body.movieId;
    const movieData =await getMovieData(movieId);
    res.render("movie.ejs",{"movieData": movieData});
});


export default router;