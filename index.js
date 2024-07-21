import { returnMovies ,searchMovies,getMovieByCategory} from "./movieapi.js";
import app from "./server.js";

app.get("/",async(req,res)=>{
    const movieData = await returnMovies();
    res.render("home.ejs",{"movieData":movieData});
})

app.get("/getPage",async(req,res)=>{
    const reqPage = req.query.page;
    const movieData = await returnMovies(reqPage);
    res.render("home.ejs",{"movieData":movieData});
})

app.get("/search",async(req,res)=>{
    const {movieKeywords,page} =req.query;
    
    const movieData = await searchMovies(movieKeywords,(page?page:1));
    res.render("home.ejs",
        {
            "movieData":movieData,
            "keyword": movieKeywords
        });
})



app.get('/category/:name', async(req, res)=>{
    const page = req.query.page?req.query.page:1;
    const categoryName = req.params.name;
    const movieData = await getMovieByCategory(categoryName,page);
    res.render("home.ejs",
        {
            "movieData":movieData,
            "keyword": categoryName
        });
  });
  

app.get("*",(req,res)=>{
    res.redirect("/");
});