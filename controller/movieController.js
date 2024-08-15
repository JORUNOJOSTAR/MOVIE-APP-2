import express from "express";
import { getMovieData } from "../api/movieapi.js";
import { reviewDAO } from "../DAO/reviews_dao.js";
import { userDAO } from "../DAO/users_dao.js";
import { reactDAO } from "../DAO/react_dao.js";


const router = express.Router();

router.post('/movie/:name', async(req, res)=>{
    const movieName = req.params.name;
    const movieId = req.body.movieId;
    const movieData =await getMovieData(movieId);
    if(req.session.userId){
        res.locals.user = req.session.userName;
    }
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
            return Object.assign(data,{review_datetime:formattedDate},{user_name: user.name},{reactLike: false},{reactFunny: false});
        })
    );
    
    if(req.session.userId){
        reviewData = await reactionDataForAuth(reviewData,req.session.userId,movieId);
    }
    res.json({"reviewData":reviewData});
});

router.get('/movie/rating/:id',async(req,res)=>{
    const movieId = req.params.id;
    const reviewStar = await reviewDAO.ratingOfMovie(movieId);
    res.json(averageRating(reviewStar));
});

async function reactionDataForAuth(reviewData,user_id,movie_id){
    reviewData = await Promise.all(
        reviewData.map(async(e)=>{
            // add reactlike:true/false and reactFunny:true/false to all reviews that make by user
            let react = await reactDAO.getReaction(user_id,movie_id,e.id);
            
            e.reactLike = react[0]? react[0].react_like : false;
            e.reactFunny = react[0]? react[0].react_funny : false;
            return e;
        }) 
    );
    
    return reviewData;
}

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