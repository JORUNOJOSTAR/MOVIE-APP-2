import express from "express";
import { getMovieData } from "../api/movieapi.js";
import { reviewDAO } from "../DAO/reviews_dao.js";
import { userDAO } from "../DAO/users_dao.js";

const router = express.Router();

router.post('/movie/:name', async(req, res)=>{
    const movieName = req.params.name;
    const movieId = req.body.movieId;
    const movieData =await getMovieData(movieId);
    res.render("movie.ejs",{"movieData": movieData});
});

router.get('/movie/reviews/:id',async(req,res)=>{
    const movieId = req.params.id;
    const offset=req.query.offset || 0;
    const order = req.query.order || 0;
    let reviewData = await reviewDAO.getReviewByOrder(movieId,offset,order);
    reviewData = await Promise.all(
        reviewData.map(async (data) => {
            let formattedDate = formatDate(data.review_datetime);
            let user = await userDAO.getUserById(data.user_id);
            return Object.assign(data,{review_datetime:formattedDate},{user_name: user.name})
        })
    );
    res.json({"reviewData":reviewData});
});


router.get('/movie/rating/:id',async(req,res)=>{
    const movieId = req.params.id;
    const reviewStar = await reviewDAO.ratingOfMovie(movieId);
    res.json(averageRating(reviewStar));
});

function averageRating(reviewStar){
    let starAverage = [0,0,0,0,0];
    let total = 0;
    const reviewCount = reviewStar.length;
    reviewStar.forEach( element =>{
        total = total + element.review_star;
        starAverage[element.review_star-1] = starAverage[element.review_star-1] + 1;
    });
    starAverage = starAverage.map((star)=> Math.floor(((star/reviewCount)*100)*100)/100);
    const averageRating = Math.floor((total/reviewCount)*10)/10;
    return {
        "averageRating" : averageRating ,
        "reviewCount" : reviewCount,
        "starAverage" : starAverage
    };
}

function formatDate(dateString){
    const toDate = new Date(dateString);
    return new Intl.DateTimeFormat("ja-jp", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"}).format(toDate).replaceAll("/","-");
}


export default router;