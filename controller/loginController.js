import express from "express";
import env from "dotenv";
import { userDAO } from "../DAO/users_dao.js";

env.config();
const {
    SESS_NAME
} = process.env;

const router = express.Router();

function errMessageMaker(msgKey,keyword){
    const msg = {
        same: {message: `New ${keyword} is same with the old one`,isSuccess:false},
        err : {message: `Error occur while changing ${keyword}.Please try again`,isSuccess:false},
        invalid: {message: `${keyword} is Invalid`,isSuccess:false},
        success: {message: `${keyword} changed complete.`,isSuccess:true }
    }
    return msg[msgKey];
}

const redirectLogin = (req,res,next) =>{
    if(req.session.userId){
        next();
    }else{
        res.redirect("/login");
    }
};

const redirectProfile = (req,res,next)=>{
    if(req.session.userId){
        res.redirect("/profile");
    }else{
        next();
    }
}


router.get("/login",redirectProfile,(req,res)=>{
    res.render("login.ejs");
});

router.get("/register",redirectProfile,(req,res)=>{
    res.render("register.ejs");
})

router.post("/login",redirectProfile,async (req,res)=>{
    const {user_email,password} = req.body;
    if(user_email&&password){
        const isAuthenticate = await userDAO.checkUser(user_email,password);
        if(isAuthenticate.email){
            req.session.userId = isAuthenticate.id;
            req.session.userName = isAuthenticate.name;
            req.session.userEmail = isAuthenticate.email;
            req.session.age = isAuthenticate.age;
            return res.redirect("/profile");
        }
    }
    res.render("login.ejs",{message: "Email or password is wrong"});
})

router.post("/register",redirectProfile,async (req,res)=>{
    const {user_name,user_email,password,age} = req.body;
    let {isValid,message} = validChecker(user_name,user_email,password,age);
    
    if(isValid){
        const {id}= await userDAO.registerUser(user_name,user_email,password,age);
        if(id>0){
            req.session.userId = id;
            req.session.userName = user_name;
            req.session.userEmail = user_email;
            req.session.age = age
            return res.redirect("/profile");
        }
    }
    message = message.length<=0?["User with same email already exist. Try Login"]:message;
    res.render("register.ejs",{message: message});
    
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




router.put("/changeName",redirectLogin,async(req,res)=>{
    let newName = req.body.newName;
    if(newName){
        if(newName == req.session.userName){
            return res.json(errMessageMaker("same","name"));
        }
        let changedName = await userDAO.changeUserName(req.session.userId,newName);
        if(changedName.length<=0){
            return res.json(errMessageMaker("err","name"));
        }
        req.session.userName = changedName[0].name;
        return res.json({newName:changedName[0].name});
    }else{
        return res.json(errMessageMaker("invalid","name"));
    }
})

router.put("/changePassWord",redirectLogin,async(req,res)=>{
    
    let newPassword = req.body.newPw || "";
    let oldPassword = req.body.oldPw || "";
    const email = req.session.userEmail;
    if(newPassword.length<8){
        return res.json(errMessageMaker("invalid","Password"));
    }
    
    const isOldpw = await userDAO.checkUser(email,newPassword);
    if(isOldpw.email){
        return res.json(errMessageMaker("same","Password"));
    }else{
        const changeStatus = await userDAO.changePassWord(email,oldPassword,newPassword);
        if(changeStatus<0){
            return res.json(errMessageMaker("err","Password"));
        }else{
            return res.json(errMessageMaker("success","Password"));
        }
    }
})

router.get("/profile",redirectLogin,(req,res)=>{
    res.render("profile.ejs",{
        userName: req.session.userName,
        email : req.session.userEmail,
        age: req.session.age
    });
})

router.post("/logout",redirectLogin,(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect("/profile");
        }
        res.clearCookie(SESS_NAME);
        res.redirect("/login");
    })
})



function validChecker(user_name,user_email,password,age){
    let validCheck = {isValid:true,message: []};
    const validateEmail = (email)=> (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(email);
    
    validCheck.message = [
        (user_name || "").length<=0 || (user_name || "").length>20 ?"User name is invalid" : null,
        validateEmail(user_email || "")?null: "Email is invalid",
        (password || "").length<8?"Password is invalid": null,
        (age<=0 || age > 120)? "Age is invalid": null
    ].filter(e=>Boolean(e));

    validCheck.isValid = validCheck.message.length==0;
    return validCheck;
}



export default router;