import evn from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import Session from "./session.js";
import cookie from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

evn.config();

const {
    APP_PORT,
    ALLOWED_ORIGINS,
    NODE_ENV,
} = process.env;

const app = express();

// Helmet security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://image.tmdb.org"],
            scriptSrc: ["'self'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
            connectSrc: ["'self'", "https://api.themoviedb.org"],
            // Explicitly prevent HTTPS upgrade in development
            upgradeInsecureRequests: NODE_ENV === 'production' ? [] : null,
        },
    },
    // Configure HSTS based on environment
    hsts: NODE_ENV === 'production' ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    } : false
}));

// CORS protection
app.use(cors({
    origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Basic rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

if(NODE_ENV === 'production'){
    app.use(limiter);
}

app.use(cookie());
app.use(express.static("public"));

// Handle favicon requests explicitly to prevent auth redirects
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.get('/favicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.png'));
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(Session);


app.listen(APP_PORT,()=>{
    console.log(`APP RUNNING ON ${APP_PORT}`);
})


export default app;