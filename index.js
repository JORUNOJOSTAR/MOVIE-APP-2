import app from "./server.js";
import homeRouter from "./controller/homeController.js";
import movieRouter from "./controller/movieController.js";
import loginRouter from "./controller/loginController.js";
import { userDAO } from "./DAO/users_dao.js";


app.use(homeRouter);
app.use(movieRouter);
app.use(loginRouter);




app.get("*",(req,res)=>{
    res.redirect("/");
});

