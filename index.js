import evn from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { returnMovies } from "./movieapi.js";

evn.config();

const {
    APP_PORT
} = process.env;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(APP_PORT,()=>{
    console.log(`APP RUNNING ON ${APP_PORT}`);
    
})

app.get("/",async(req,res)=>{
    const movieData = await returnMovies();
    res.render("home.ejs",{"movieData":movieData});
})

app.get("/getPage",async(req,res)=>{
    const reqPage = req.query.page;
    const movieData = await returnMovies(reqPage);
    res.render("home.ejs",{"movieData":movieData});
})