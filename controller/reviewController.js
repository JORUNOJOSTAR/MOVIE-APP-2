import express from "express";
import { reviewDAO } from "../DAO/reviews_dao.js";

const router = express.Router();

router.use((req,res,next) =>{
    if(req.session.userId){
        next();
    }else{
        res.redirect("/login");
    }
});

router.get("/review/getUserReview/:id",async(req,res)=>{
    const userId = req.session.userId;
    const movieId = req.params.id;
    const userName = req.session.userName;
    let userReview = await reviewDAO.getReviewByUserAndMovieId(userId,movieId);
    if(userReview.length>0){
        userReview = userReview[0];
        delete userReview.user_id;
        userReview = Object.assign(userReview,{userName: userName});
    }else{
        userReview = {userName: userName};
    }
    res.json({userReview: userReview});
});



router.delete("/review/delete",async (req,res)=>{
    let resData = {status:-1};
    let reviewId = req.body.deleteReview.review_id || "";
    
    if(reviewId.length>0){
        resData.status = await reviewDAO.deleteReview(reviewId,req.session.userId);
        resData.userName = req.session.userName;
    }
    res.json(resData);
});

router.post("/review/makeReview",async (req,res)=>{
    let resData = {};
    const reqData = req.body.review;
    const userName = req.session.userName;
    let star = reqData.star_message || 0;
    let review_message = reqData.review_message || "";
    let movie_id = reqData.movieId || "";
    if(star<=0 || review_message.length<=0 || movie_id.length<=0){
        resData = {message: "Invalid review request"};
    }else{
        let reviewData = await reviewDAO.updateReview(review_message,star,movie_id,req.session.userId);
        if(reviewData.id){
            delete reviewData.user_id;
            resData = {userReview : Object.assign(reviewData,{userName: userName})};
        }
    }
    res.json(resData);
})


router.get("/review/like",(req,res)=>{
    res.sendStatus(200);
});

router.get("/review/funny",(req,res)=>{
    res.sendStatus(200);
});

export default router;