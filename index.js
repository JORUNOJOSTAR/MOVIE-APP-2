import app from "./server.js";
import homeRouter from "./controller/homeController.js";
import movieRouter from "./controller/movieController.js";
import loginRouter from "./controller/loginController.js";
import watchListRouter from "./controller/watchListController.js";
import reviewRouter from "./controller/reviewController.js";

import { userDAO } from "./DAO/users_dao.js";


app.use(homeRouter);
app.use(movieRouter);
app.use(loginRouter);
app.use(watchListRouter);
app.use(reviewRouter);




app.get("*",(req,res)=>{
    res.redirect("/");
});


