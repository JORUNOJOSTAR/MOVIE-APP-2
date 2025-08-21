import express from "express";
import { returnMovies ,searchMovies,getMovieByCategory} from "../api/movieapi.js";
import Sanitizer from "../utils/sanitizer.js";
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
    
    // Sanitize search keywords to prevent XSS
    const sanitizedKeywords = Sanitizer.escapeHtml(movieKeywords || "");
    
    const movieData = await searchMovies(movieKeywords,(page?page:1));
    res.render("home.ejs",
        {
            "movieData":movieData,
            "keyword": sanitizedKeywords
        });
})



router.get('/category/:name', async(req, res)=>{
    const page = req.query.page?req.query.page:1;
    const categoryName = req.params.name;
    
    // Sanitize category name to prevent XSS
    const sanitizedCategoryName = Sanitizer.escapeHtml(categoryName || "");
    
    const movieData = await getMovieByCategory(categoryName,page);
    res.render("home.ejs",
        {
            "movieData":movieData,
            "keyword": sanitizedCategoryName
        });
  });
  



export default router;