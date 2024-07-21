import express from "express";
import { returnMovies ,searchMovies,getMovieByCategory} from "../api/movieapi.js";
const router = express.Router();


router.get("/",async(req,res)=>{
    const movieData = await returnMovies();
    res.render("home.ejs",{"movieData":movieData});
})

router.get("/getPage",async(req,res)=>{
    const reqPage = req.query.page;
    const movieData = await returnMovies(reqPage);
    res.render("home.ejs",{"movieData":movieData});
})

router.get("/search",async(req,res)=>{
    const {movieKeywords,page} =req.query;
    
    const movieData = await searchMovies(movieKeywords,(page?page:1));
    res.render("home.ejs",
        {
            "movieData":movieData,
            "keyword": movieKeywords
        });
})



router.get('/category/:name', async(req, res)=>{
    const page = req.query.page?req.query.page:1;
    const categoryName = req.params.name;
    const movieData = await getMovieByCategory(categoryName,page);
    res.render("home.ejs",
        {
            "movieData":movieData,
            "keyword": categoryName
        });
  });
  



export default router;