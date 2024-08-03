import express from "express";
import env from "dotenv";
import { userDAO } from "../DAO/users_dao.js";

env.config();
const {
    SESS_NAME
} = process.env;

const router = express.Router();

const redirectLogin = (req,res,next) =>{
    if(req.session.userId){
        next();
    }else{
        res.redirect("/login");
    }
};

const redirectHome = (req,res,next)=>{
    if(req.session.userId){
        res.redirect("/home");
    }else{
        next();
    }
}


router.get("/login",redirectHome,(req,res)=>{
    res.render("login.ejs");
});

router.get("/register",redirectHome,(req,res)=>{
    res.render("register.ejs")
})

router.post("/login",redirectHome,async (req,res)=>{
    const {user_email,password} = req.body;
    console.log(user_email);
    console.log(password);
    if(user_email&&password){
        const isAuthenticate = await userDAO.checkUser(user_email,password);
        console.log(isAuthenticate);
        if(isAuthenticate.email){
            req.session.userId = isAuthenticate.id;
            req.session.userName = isAuthenticate.name;
            req.session.userEmail = isAuthenticate.email;
            return res.redirect("/");
        }
    }
    res.redirect("/login");
})

router.post("/register",redirectHome,async (req,res)=>{
    const {user_name,user_email,password} = req.body;
    if(user_name&&user_email&&password){
        const new_id = await userDAO.registerUser(user_name,user_email,password,age);
        console.log(new_id);
        if(new_id>0){
            req.session.userId = new_id;
            req.session.userName = user_name;
            req.session.userEmail = user_email;
            return res.redirect("/");
        }
    }
    res.redirect("/register");
    
})

router.post("/logout",redirectLogin,(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect("/");
        }

        res.clearCookie(SESS_NAME);
        res.redirect("/login");
    })
})

export default router;