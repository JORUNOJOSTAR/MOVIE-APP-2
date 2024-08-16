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
    if(star<=0 || review_message.length<=0 || !Boolean(parseInt(movie_id))){
        console.log(movie_id);
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


router.post("/review/react",async(req,res)=>{
    let resData = {update:false};
    const reqData = req.body.review;
    const userId = req.session.userId;
    let movie_id = reqData.movieId || ""; 
    let review_id = reqData.review_id;
    let decrease = reqData.decrease;
    let reaction = reqData.reaction;
    if(Boolean(parseInt(movie_id)) || Boolean(parseInt(review_id)) || typeof decrease == "boolean"){
        let updateStatus = 0;
        if(reaction == "like"){
            updateStatus = await reviewDAO.updateLikeCount(review_id,userId,movie_id,decrease);
        }
        if(reaction == "funny"){
            updateStatus = await reviewDAO.updateFunnyCount(review_id,userId,movie_id,decrease);
        }
        resData.update = updateStatus > 0;
    }
    res.json(resData);
});

router.post("/review/funny",(req,res)=>{
    res.sendStatus(200);
});

export default router;