import express from "express";
import { getMovieData } from "../api/movieapi.js";
import { reviewDAO } from "../DAO/reviews_dao.js";

const router = express.Router();

router.post('/movie/:name', async(req, res)=>{
    const movieName = req.params.name;
    const movieId = req.body.movieId;
    const movieData =await getMovieData(movieId);
    res.render("movie.ejs",{"movieData": movieData});
});

router.get('/movie/reviews/:id',async(req,res)=>{
    const movieId = req.params.id;
    const reviewData = await reviewDAO.getReviewByMovieId(movieId);
    res.json({"reviewData":reviewData});
});


export default router;