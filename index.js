import app from "./server.js";
import homeRouter from "./controller/homeController.js";
import movieRouter from "./controller/movieController.js";



app.use(homeRouter);
app.use(movieRouter);

//Movie Page testing route
app.get("/test",(req,res)=>{
    const movieData = {
        title: 'Iron Man 2',
        release_date: '2010-04-28',
        tagline: "It's not the armor that makes the hero, but the man inside.",
        genres: [ 'Adventure', 'Action', 'Science Fiction' ],
        imgLink: 'https://image.tmdb.org/t/p/w1280/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg',
        runtime: 124,
        overview:"A brilliant counterterrorism analyst with a deep distrust A brilliant counterterrorism analyst with a deep distrust A brilliant counterterrorism analyst with a deep distrust A brilliant counterterrorism analyst with a deep distrust A brilliant counterterrorism analyst with a deep distrust of AI one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one one discovers it might be her only hope when a mission to capture a renegade robot goes awry."
      };
      res.render("movie.ejs",{"movieData": movieData});
})




app.get("*",(req,res)=>{
    res.redirect("/");
});


