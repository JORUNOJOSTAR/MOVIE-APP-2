import evn from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import Session from "./session.js";
import cookie from "cookie-parser";

evn.config();

const {
    APP_PORT
} = process.env;

const app = express();

app.use(cookie());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(Session);


app.listen(APP_PORT,()=>{
    console.log(`APP RUNNING ON ${APP_PORT}`);
})


export default app;