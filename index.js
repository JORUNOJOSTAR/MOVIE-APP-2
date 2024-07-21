import app from "./server.js";
import homeRouter from "./controller/homeController.js";

app.use(homeRouter);
