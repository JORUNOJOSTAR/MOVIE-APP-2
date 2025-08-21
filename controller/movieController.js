import express from "express";
import { getMovieData, searchMovies } from "../api/movieapi.js";
import { reviewDAO } from "../DAO/reviews_dao.js";
import { userDAO } from "../DAO/users_dao.js";
import { reactDAO } from "../DAO/react_dao.js";
import Sanitizer from "../utils/sanitizer.js";


const router = express.Router();

// POST endpoint - receives the form submission and redirects
router.post('/movie/:name', async(req, res)=>{
    const movieName = req.params.name;
    const movieId = req.body.movieId;
    
    // Store movieId in session temporarily for immediate redirect
    req.session.tempMovieId = movieId;
    
    // Redirect to clean URL without movieId
    res.redirect(`/movie/${movieName}`);
});

// GET endpoint - handles the actual page rendering
router.get('/movie/:name', async(req, res)=>{
    const movieName = req.params.name;
    let movieId = req.session.tempMovieId;
    
    // Clear the temporary movieId from session
    if (movieId) {
        delete req.session.tempMovieId;
    } else {
        // No session data - this is a direct URL access (bookmark/refresh)
        // Search for the movie by title to get the movieId
        try {
            const searchResults = await searchMovies(movieName.replace(/-/g, ' '), 1);
            const exactMatch = searchResults.find(movie => 
                movie.imgTitle.replace(/\s+/g, '-').toLowerCase() === movieName.toLowerCase()
            );
            
            if (exactMatch) {
                movieId = exactMatch.movieId;
            } else {
                return res.status(404).send('Movie not found');
            }
        } catch (error) {
            console.error('Error searching for movie:', error);
            return res.status(500).send('Error finding movie');
        }
    }
    
    if (!movieId) {
        return res.status(400).send('Movie not found');
    }
    
    const movieData = await getMovieData(movieId);
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
            
            // Sanitize user-generated content before sending to client
            const sanitizedData = {
                ...data,
                review_message: Sanitizer.escapeHtml(data.review_message || ""),
                user_name: Sanitizer.escapeHtml(user.name || ""),
                review_datetime: formattedDate,
                reactLike: false,
                reactFunny: false
            };
            
            return sanitizedData;
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