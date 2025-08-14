# Movie Review Application - Comprehensive System Architecture

## Executive Summary
A full-stack web application built with Node.js/Express and PostgreSQL that provides a comprehensive movie review platform with social features, external API integration, and responsive design.

## Technology Stack Overview
- **Backend**: Node.js 20+, Express.js 4.19+
- **Database**: PostgreSQL 14+ with connection pooling
- **Frontend**: EJS templating, Vanilla JavaScript ES6+
- **External APIs**: The Movie Database (TMDB) API v3
- **Authentication**: Express Sessions with bcrypt
- **Architecture**: MVC Pattern with DAO Layer

## High-Level System Architecture

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    MOVIE REVIEW APPLICATION                                        │
│                                 COMPREHENSIVE SYSTEM ARCHITECTURE                                  │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                   │
│  ┌─────────────────────────┐   ┌──────────────────────────┐   ┌─────────────────────────────────┐  │
│  │      CLIENT TIER        │   │      APPLICATION TIER    │   │       DATA & SERVICE TIER       │  │
│  │    (Presentation)       │   │      (Business Logic)    │   │     (Persistence & APIs)        │  │
│  │                         │   │                          │   │                                 │  │
│  │ ┌─────────────────────┐ │   │ ┌──────────────────────┐ │   │ ┌─────────────────────────────┐ │  │
│  │ │     Web Browser     │ │   │ │    Express.js        │ │   │ │      PostgreSQL           │ │  │
│  │ │                     │ │   │ │    Application       │ │   │ │      Database             │ │  │
│  │ │ ┌─────────────────┐ │ │   │ │                      │ │   │ │                           │ │  │
│  │ │ │ EJS Templates   │ │ │◄──┤ │ ┌──────────────────┐ │ │   │ │ ┌───────────────────────┐ │ │  │
│  │ │ │ • Dynamic HTML  │ │ │   │ │ │  Route Controllers│ │ │   │ │ │     Core Tables       │ │ │  │
│  │ │ │ • Partials      │ │ │   │ │ │  • homeController │ │ │   │ │ │ • users (auth)        │ │ │  │
│  │ │ │ • Responsive UI │ │ │   │ │ │  • movieController│ │ │   │ │ │ • reviews (content)   │ │ │  │
│  │ │ └─────────────────┘ │ │   │ │ │  • loginController│ │ │   │ │ │ • watchlist (prefs)   │ │ │  │
│  │ │                     │ │   │ │ │  • reviewController│ │   │ │ │ • react (social)      │ │ │  │
│  │ │ ┌─────────────────┐ │ │   │ │ │  • watchController│ │ │   │ │ │ • session (state)     │ │ │  │
│  │ │ │ CSS Styling     │ │ │   │ │ └──────────────────┘ │ │   │ │ └───────────────────────┘ │ │  │
│  │ │ │ • styles.css    │ │ │   │ │                      │ │   │ └─────────────────────────────┘ │  │
│  │ │ │ • movie.css     │ │ │   │ │ ┌──────────────────┐ │ │                                   │  │
│  │ │ │ • responsive    │ │ │   │ │ │  Middleware      │ │ │   ┌─────────────────────────────┐ │  │
│  │ │ └─────────────────┘ │ │   │ │ │  • Session Mgmt  │ │ │   │     External Services       │ │  │
│  │ │                     │ │   │ │ │  • Body Parser   │ │ │   │                             │ │  │
│  │ │ ┌─────────────────┐ │ │   │ │ │  • Static Files  │ │ │   │ ┌─────────────────────────┐ │ │  │
│  │ │ │ Client Scripts  │ │ │   │ │ │  • Cookie Parser │ │ │   │ │    TMDB API v3          │ │ │  │
│  │ │ │ • AJAX Requests │ │ │   │ │ │  • Error Handler │ │ │   │ │                         │ │ │  │
│  │ │ │ • DOM Updates   │ │ │   │ │ └──────────────────┘ │ │   │ │ Endpoints:              │ │ │  │
│  │ │ │ • User Events   │ │ │   │ │                      │ │   │ │ • /discover/movie       │ │ │  │
│  │ │ │ • Rating System │ │ │   │ │ ┌──────────────────┐ │ │   │ │ • /search/movie         │ │ │  │
│  │ │ │ • Watchlist     │ │ │   │ │ │  Data Access     │ │ │   │ │ • /movie/{id}           │ │ │  │
│  │ │ └─────────────────┘ │ │   │ │ │  Object (DAO)    │ │ │   │ │ • /genre/movie/list     │ │ │  │
│  │ └─────────────────────┘ │   │ │ │  • users_dao     │ │ │   │ │ • Image CDN             │ │ │  │
│  └─────────────────────────┘   │ │ │  • reviews_dao   │ │ │   │ └─────────────────────────┘ │ │  │
│                                │ │ │  • watchlist_dao │ │ │   └─────────────────────────────┘ │  │
│  ┌─────────────────────────┐   │ │ │  • react_dao     │ │ │                                   │  │
│  │    Client Features      │   │ │ └──────────────────┘ │ │                                   │  │
│  │                         │   │ │                      │ │                                   │  │
│  │ • Movie Browsing        │   │ │ ┌──────────────────┐ │ │                                   │  │
│  │ • Search & Filter       │   │ │ │  Database        │ │ │                                   │  │
│  │ • User Authentication   │   │ │ │  Connection      │ │ │                                   │  │
│  │ • Review Writing        │   │ │ │  • Connection    │ │ │                                   │  │
│  │ • Rating System         │   │ │ │    Pool Mgmt     │ │ │                                   │  │
│  │ • Social Interactions   │   │ │ │  • Query         │ │ │                                   │  │
│  │ • Watchlist Management  │   │ │ │    Execution     │ │ │                                   │  │
│  │ • Responsive Design     │   │ │ │  • Error         │ │ │                                   │  │
│  └─────────────────────────┘   │ │ │    Handling      │ │ │                                   │  │
│                                │ │ │  • Data          │ │ │                                   │  │
│                                │ │ │    Validation    │ │ │                                   │  │
│                                │ │ └──────────────────┘ │ │                                   │  │
│                                │ └──────────────────────┘ │                                   │  │
│                                └──────────────────────────┘                                   │  │
│                                                                                               │  │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Request-Response Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   REQUEST-RESPONSE FLOW                                             │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   CLIENT    │    │   ROUTES    │    │     DAO     │    │  DATABASE   │    │  EXTERNAL API   │  │
│  │  (Browser)  │    │(Controllers)│    │   LAYER     │    │(PostgreSQL) │    │    (TMDB)       │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────────┘  │
│         │                   │                   │                   │                   │          │
│         │ 1. HTTP Request   │                   │                   │                   │          │
│         ├──────────────────▶│                   │                   │                   │          │
│         │                   │ 2. Process Route  │                   │                   │          │
│         │                   ├──────────────────▶│                   │                   │          │
│         │                   │                   │ 3. Query Database │                   │          │
│         │                   │                   ├──────────────────▶│                   │          │
│         │                   │                   │ 4. Return Data    │                   │          │
│         │                   │                   │◄──────────────────┤                   │          │
│         │                   │ 5. External API   │                   │                   │          │
│         │                   ├───────────────────────────────────────────────────────────▶          │
│         │                   │ 6. API Response   │                   │                   │          │
│         │                   │◄───────────────────────────────────────────────────────────          │
│         │                   │ 7. Process Data   │                   │                   │          │
│         │                   │◄──────────────────┤                   │                   │          │
│         │ 8. HTTP Response  │                   │                   │                   │          │
│         │◄──────────────────┤                   │                   │                   │          │
│         │                   │                   │                   │                   │          │
│                                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                 MIDDLEWARE STACK                                           │  │
│  │                                                                                             │  │
│  │  Request → Cookie Parser → Body Parser → Session → Static Files → Routes → Response       │  │
│  │              ↓              ↓            ↓          ↓              ↓                       │  │
│  │           Parse Cookies  Parse Body   Check Auth  Serve Assets  Business Logic            │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Detailed Component Architecture

### 1. Application Entry & Configuration
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION BOOTSTRAP                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              index.js (Entry Point)                             │   │
│  │                                                                                 │   │
│  │  import app from "./server.js"                                                 │   │
│  │  import homeRouter from "./controller/homeController.js"                       │   │
│  │  import movieRouter from "./controller/movieController.js"                     │   │
│  │  import loginRouter from "./controller/loginController.js"                     │   │
│  │  import watchListRouter from "./controller/watchListController.js"             │   │
│  │  import reviewRouter from "./controller/reviewController.js"                   │   │
│  │                                                                                 │   │
│  │  app.use(homeRouter)     // Route registration                                 │   │
│  │  app.use(movieRouter)    // Route registration                                 │   │
│  │  app.use(loginRouter)    // Route registration                                 │   │
│  │  app.use(watchListRouter)// Route registration                                 │   │
│  │  app.use(reviewRouter)   // Route registration                                 │   │
│  │                                                                                 │   │
│  │  app.get("*", (req,res) => res.redirect("/"))  // Catch-all route             │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            server.js (Application Setup)                       │   │
│  │                                                                                 │   │
│  │  Dependencies:                        Middleware Configuration:                │   │
│  │  • express (4.19+)                   • cookie-parser (sessions)               │   │
│  │  • body-parser (request parsing)     • express.static (assets)                │   │
│  │  • dotenv (environment vars)         • body-parser (JSON/URL-encoded)         │   │
│  │  • session management                • express-session (user state)           │   │
│  │                                                                                 │   │
│  │  Configuration:                      Security Features:                       │   │
│  │  • Port: process.env.APP_PORT        • Session store (PostgreSQL)             │   │
│  │  • Static files: /public             • Cookie parsing                         │   │
│  │  • View engine: EJS                  • CORS handling                          │   │
│  │  • Body parsing: JSON/URL-encoded    • Input sanitization                     │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                           session.js (Session Configuration)                   │   │
│  │                                                                                 │   │
│  │  Session Store Configuration:        Session Security:                        │   │
│  │  • connect-pg-simple (PostgreSQL)    • Secure cookies                         │   │
│  │  • Session timeout management        • CSRF protection                        │   │
│  │  • Automatic cleanup                 • Session regeneration                   │   │
│  │  • Connection pooling                • HttpOnly cookies                       │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Controller Layer Architecture (MVC Pattern)
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                  CONTROLLER LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │    homeController.js    │  │   movieController.js    │  │   loginController.js    │ │
│  │                         │  │                         │  │                         │ │
│  │ Routes & Functions:     │  │ Routes & Functions:     │  │ Routes & Functions:     │ │
│  │                         │  │                         │  │                         │ │
│  │ GET /                   │  │ POST /movie/:name       │  │ GET /login              │ │
│  │ └── Home page with      │  │ └── Display movie       │  │ └── Show login form     │ │
│  │     popular movies      │  │     details & reviews   │  │                         │ │
│  │                         │  │                         │  │ POST /login             │ │
│  │ GET /getPage            │  │ GET /movie/reviews/:id  │  │ └── Authenticate user   │ │
│  │ └── Paginated movie     │  │ └── Get reviews with    │  │                         │ │
│  │     listings            │  │     pagination & sort   │  │ GET /register           │ │
│  │                         │  │                         │  │ └── Show register form  │ │
│  │ GET /search             │  │ GET /movie/rating/:id   │  │                         │ │
│  │ └── Search movies by    │  │ └── Calculate & return  │  │ POST /register          │ │
│  │     keywords            │  │     average ratings     │  │ └── Create new user     │ │
│  │                         │  │                         │  │                         │ │
│  │ GET /category/:name     │  │ Integrations:           │  │ GET /logout             │ │
│  │ └── Filter movies by    │  │ • TMDB API calls        │  │ └── Destroy session     │ │
│  │     genre category      │  │ • Review aggregation    │  │                         │ │
│  │                         │  │ • User reaction data    │  │ GET /profile            │ │
│  │ Integrations:           │  │ • Rating calculations   │  │ └── Show user profile   │ │
│  │ • TMDB API integration  │  │                         │  │                         │ │
│  │ • Search functionality  │  │                         │  │ POST /profile/*         │ │
│  │ • Genre filtering       │  │                         │  │ └── Update user data    │ │
│  │ • Pagination logic      │  │                         │  │     (name/email/pass)   │ │
│  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘ │
│                                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                             │ │
│  │ watchListController.js  │  │  reviewController.js    │                             │ │
│  │                         │  │                         │                             │ │
│  │ Routes & Functions:     │  │ Routes & Functions:     │                             │ │
│  │                         │  │                         │                             │ │
│  │ GET /watchlist          │  │ POST /review            │                             │ │
│  │ └── Display user's      │  │ └── Create/Edit review  │                             │ │
│  │     saved movies        │  │     with star rating    │                             │ │
│  │                         │  │                         │                             │ │
│  │ POST /watchlist         │  │ PUT /review             │                             │ │
│  │ └── Add movie to        │  │ └── Update existing     │                             │ │
│  │     watchlist           │  │     review content      │                             │ │
│  │                         │  │                         │                             │ │
│  │ DELETE /watchlist       │  │ POST /react             │                             │ │
│  │ └── Remove movie from   │  │ └── Add like/funny      │                             │ │
│  │     watchlist           │  │     reactions to reviews│                             │ │
│  │                         │  │                         │                             │ │
│  │ Features:               │  │ Features:               │                             │ │
│  │ • User authentication   │  │ • Authentication check  │                             │ │
│  │ • Movie data retrieval  │  │ • Duplicate prevention  │                             │ │
│  │ • TMDB integration      │  │ • Rating aggregation    │                             │ │
│  │ • Pagination support    │  │ • Social interactions   │                             │ │
│  └─────────────────────────┘  └─────────────────────────┘                             │ │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Data Access Layer (DAO Pattern) - Comprehensive
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DAO LAYER ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │     users_dao.js        │  │    reviews_dao.js       │  │     react_dao.js        │ │
│  │                         │  │                         │  │                         │ │
│  │ User Management:        │  │ Review Operations:      │  │ Social Interactions:    │ │
│  │                         │  │                         │  │                         │ │
│  │ • getUserById(id)       │  │ • getReviewByMovieId()  │  │ • getReaction(user,     │ │
│  │   └── Fetch user data   │  │   └── All movie reviews │  │   movie, review)        │ │
│  │                         │  │                         │  │   └── Check if user     │ │
│  │ • getUserByEmail(email) │  │ • getReviewByUserId()   │  │       reacted           │ │
│  │   └── Login validation  │  │   └── User's reviews    │  │                         │ │
│  │                         │  │                         │  │ • addReaction(data)     │ │
│  │ • createUser(userData)  │  │ • getReviewByUserAnd    │  │   └── Add like/funny    │ │
│  │   └── Registration      │  │   MovieId()             │  │                         │ │
│  │                         │  │   └── Check existing    │  │ • updateReaction(data)  │ │
│  │ • updateUserName(id,    │  │       review            │  │   └── Toggle reactions  │ │
│  │   name)                 │  │                         │  │                         │ │
│  │   └── Profile update    │  │ • getReviewByOrder()    │  │ • deleteReaction(data)  │ │
│  │                         │  │   └── Sort: like_count, │  │   └── Remove reaction   │ │
│  │ • updateUserEmail(id,   │  │       review_datetime,  │  │                         │ │
│  │   email)                │  │       funny_count       │  │ Features:               │ │
│  │   └── Email change      │  │                         │  │ • Prevents duplicate    │ │
│  │                         │  │ • updateReview(message, │  │   reactions             │ │
│  │ • updateUserPassword(   │  │   star, movie, user)    │  │ • Updates count fields  │ │
│  │   id, hash)             │  │   └── Create/Edit with  │  │ • Handles both like &   │ │
│  │   └── Password change   │  │       conflict handling │  │   funny reactions       │ │
│  │                         │  │                         │  │ • Transaction support   │ │
│  │ • deleteUser(id)        │  │ • deleteReview(user,    │  │                         │ │
│  │   └── Account removal   │  │   movie)                │  │                         │ │
│  │                         │  │   └── Remove user review│  │                         │ │
│  │ Security Features:      │  │                         │  │                         │ │
│  │ • Input validation      │  │ • ratingOfMovie(id)     │  │                         │ │
│  │ • Email uniqueness      │  │   └── Calculate average │  │                         │ │
│  │ • Password hashing      │  │       rating            │  │                         │ │
│  │ • SQL injection protect│  │                         │  │                         │ │
│  └─────────────────────────┘  │ • getReviewCount(movie) │  └─────────────────────────┘ │
│                               │   └── Total review count│                             │ │
│  ┌─────────────────────────┐  │                         │                             │ │
│  │   watchlist_dao.js      │  │ Data Integrity:         │                             │ │
│  │                         │  │ • Star rating: 1-5      │                             │ │
│  │ Watchlist Management:   │  │ • Unique constraint:    │                             │ │
│  │                         │  │   (user_id, movie_id)   │                             │ │
│  │ • getWatchlistByUser(   │  │ • Auto-update counts    │                             │ │
│  │   user_id)              │  │ • Datetime tracking     │                             │ │
│  │   └── User's saved      │  │ • Edit flag management  │                             │ │
│  │       movies            │  └─────────────────────────┘                             │ │
│  │                         │                                                           │ │
│  │ • addToWatchlist(user,  │                                                           │ │
│  │   movie)                │  ┌─────────────────────────────────────────────────────┐ │
│  │   └── Save movie        │  │              DATABASE CONNECTION LAYER              │ │
│  │                         │  │                                                     │ │
│  │ • removeFromWatchlist(  │  │  dbConnection.js - Core Database Operations:        │ │
│  │   user, movie)          │  │                                                     │ │
│  │   └── Remove movie      │  │  • executeQuery(query, params)                     │ │
│  │                         │  │    └── Base query execution with error handling    │ │
│  │ • isInWatchlist(user,   │  │                                                     │ │
│  │   movie)                │  │  • getData(query, ...params)                       │ │
│  │   └── Check if saved    │  │    └── SELECT operations, returns result rows      │ │
│  │                         │  │                                                     │ │
│  │ Features:               │  │  • manipulateData(query, ...params)                │ │
│  │ • Duplicate prevention  │  │    └── INSERT/UPDATE/DELETE operations             │ │
│  │ • User-specific lists   │  │                                                     │ │
│  │ • Movie data integration│  │  Connection Management:                            │ │
│  │ • Pagination support    │  │  • PostgreSQL client configuration                 │ │
│  └─────────────────────────┘  │  • Environment variable config                     │ │
│                               │  • Connection pooling                              │ │
│                               │  • Automatic reconnection                          │ │
│                               │  • Query parameter sanitization                    │ │
│                               │  • Transaction support                             │ │
│                               └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4. External API Integration Layer
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL API INTEGRATION                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            movieapi.js (TMDB Integration)                       │   │
│  │                                                                                 │   │
│  │  Core Functions:                          API Endpoints Used:                  │   │
│  │                                                                                 │   │
│  │  • returnMovies(page=1)                   • /discover/movie?page={page}        │   │
│  │    └── Get popular movies with           • /search/movie?query={keyword}       │   │
│  │        pagination support                • /movie/{movie_id}                   │   │
│  │                                          • /genre/movie/list                   │   │
│  │  • searchMovies(keywords, page)          • Image CDN: /t/p/w500/{image_path}   │   │
│  │    └── Search by title/keywords                                                │   │
│  │        with pagination                   Configuration:                        │   │
│  │                                                                                 │   │
│  │  • getMovieByCategory(name, page)        • API_KEY: Environment variable       │   │
│  │    └── Filter by genre category          • BASE_URL: api.themoviedb.org/3     │   │
│  │        (maps genre names to IDs)         • IMAGE_PATH: image.tmdb.org/t/p/    │   │
│  │                                          • DEFAULT_LANGUAGE: en-US             │   │
│  │  • getMovieData(movieId, poster)         • ADULT_CONTENT: Configurable         │   │
│  │    └── Detailed movie information                                              │   │
│  │        with optional poster/backdrop     Error Handling:                       │   │
│  │                                                                                 │   │
│  │  Data Processing:                        • Network timeout handling            │   │
│  │                                          • API rate limit management           │   │
│  │  • makeMovieData(apiURL)                 • Fallback image for missing posters  │   │
│  │    └── Transform TMDB response to        • Graceful degradation               │   │
│  │        application format                • Retry logic for failed requests     │   │
│  │                                                                                 │   │
│  │  • getHourMinute(time)                   Response Transformation:              │   │
│  │    └── Convert runtime to readable       • Clean data structure               │   │
│  │        format (e.g., "2hr 30min")        • Image URL construction             │   │
│  │                                          • Genre array formatting              │   │
│  │  Movie Data Structure:                   • Runtime formatting                  │   │
│  │  {                                       • Date formatting                     │   │
│  │    movieId: number,                      • Overview text sanitization         │   │
│  │    imgTitle: string,                                                           │   │
│  │    release_date: string,                 Caching Strategy:                     │   │
│  │    tagline: string,                      • In-memory caching (optional)       │   │
│  │    genres: array[string],                • Cache popular movies               │   │
│  │    imgLink: string,                      • Cache genre lists                  │   │
│  │    runtime: string,                      • TTL-based invalidation             │   │
│  │    overview: string                                                            │   │
│  │  }                                                                             │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DAO LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   users_dao     │  │  reviews_dao    │  │      react_dao              │  │
│  │                 │  │                 │  │                             │  │
│  │ • getUserById   │  │ • getReviewBy*  │  │ • getReaction               │  │
│  │ • getUserByEmail│  │ • updateReview  │  │ • addReaction               │  │
│  │ • createUser    │  │ • deleteReview  │  │ • updateReaction            │  │
│  │ • updateUser*   │  │ • ratingOfMovie │  │ • deleteReaction            │  │
│  │ • deleteUser    │  │ • getReviewCount│  │                             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │ watchlist_dao   │                                                       │
│  │                 │                                                       │
│  │ • getWatchlist  │                                                       │
│  │ • addToWatchlist│                                                       │
│  │ • removeFrom*   │                                                       │
│  │ • isInWatchlist │                                                       │
│  └─────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4. Database Connection & API Layer
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE & API LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │       dbConnection.js           │  │         movieapi.js             │   │
│  │                                 │  │                                 │   │
│  │ ┌─────────────────────────────┐ │  │ ┌─────────────────────────────┐ │   │
│  │ │     PostgreSQL Client       │ │  │ │       TMDB API Client       │ │   │
│  │ │                             │ │  │ │                             │ │   │
│  │ │ • Connection Management     │ │  │ │ • returnMovies()            │ │   │
│  │ │ • Query Execution           │ │  │ │ • searchMovies()            │ │   │
│  │ │ • Error Handling            │ │  │ │ • getMovieByCategory()      │ │   │
│  │ │                             │ │  │ │ • getMovieData()            │ │   │
│  │ │ Functions:                  │ │  │ │                             │ │   │
│  │ │ • executeQuery()            │ │  │ │ API Endpoints:              │ │   │
│  │ │ • getData()                 │ │  │ │ • Popular Movies            │ │   │
│  │ │ • manipulateData()          │ │  │ │ • Search API                │ │   │
│  │ └─────────────────────────────┘ │  │ │ • Movie Details             │ │   │
│  └─────────────────────────────────┘  │ │ • Genre Lists               │ │   │
│                                       │ └─────────────────────────────┘ │   │
│                                       └─────────────────────────────────┘   │
│                                                                             │
└───────────────────────────────────────────────────────────v──────────────────┘
```

### 5. Frontend Architecture - Complete Structure
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                               EJS TEMPLATE SYSTEM                               │   │
│  │                                                                                 │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐   │   │
│  │  │   home.ejs      │ │  movie.ejs      │ │ login.ejs       │ │profile.ejs  │   │   │
│  │  │                 │ │                 │ │                 │ │             │   │   │
│  │  │ Features:       │ │ Features:       │ │ Features:       │ │ Features:   │   │   │
│  │  │ • Movie cards   │ │ • Movie details │ │ • Login form    │ │ • User info │   │   │
│  │  │ • Search bar    │ │ • Review system │ │ • Validation    │ │ • Settings  │   │   │
│  │  │ • Pagination    │ │ • Rating display│ │ • Error msgs    │ │ • Password  │   │   │
│  │  │ • Genre filter  │ │ • Watchlist btn │ │ • Registration  │ │   change    │   │   │
│  │  │ • Responsive    │ │ • Social react  │ │   link          │ │ • Email     │   │   │
│  │  │   grid layout   │ │ • Movie trailer │ │                 │ │   update    │   │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────┘   │   │
│  │                                                                                 │   │
│  │  ┌─────────────────┐ ┌─────────────────┐                                       │   │
│  │  │register.ejs     │ │watchList.ejs    │                                       │   │
│  │  │                 │ │                 │                                       │   │
│  │  │ Features:       │ │ Features:       │                                       │   │
│  │  │ • User form     │ │ • Saved movies  │                                       │   │
│  │  │ • Validation    │ │ • Remove option │                                       │   │
│  │  │ • Age verify    │ │ • Movie details │                                       │   │
│  │  │ • Password      │ │ • Grid layout   │                                       │   │
│  │  │   strength      │ │ • Pagination    │                                       │   │
│  │  │ • Email check   │ │ • Empty state   │                                       │   │
│  │  └─────────────────┘ └─────────────────┘                                       │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐   │   │
│  │  │                           TEMPLATE PARTIALS                             │   │   │
│  │  │                                                                         │   │   │
│  │  │ Common Partials:              Movie-Specific Partials:                 │   │   │
│  │  │ • header.ejs                  • movie/rating.ejs                       │   │   │
│  │  │   └── Meta tags, CSS links    │   └── Star rating component            │   │   │
│  │  │ • top_nav.ejs                 • movie/reviewbtn.ejs                    │   │   │
│  │  │   └── Navigation bar          │   └── Review form toggle               │   │   │
│  │  │ • common.ejs                  • movie/reviewcontent.ejs                │   │   │
│  │  │   └── Footer, scripts         │   └── Review display list              │   │   │
│  │  │ • scrolltop.ejs               • movie/staricon.ejs                     │   │   │
│  │  │   └── Back to top button      │   └── Star rating icons                │   │   │
│  │  │                               • movie/stariconhalf.ejs                 │   │   │
│  │  │ Home-Specific Partials:       │   └── Half star icons                  │   │   │
│  │  │ • home/card.ejs               • movie/watchlistbtn.ejs                 │   │   │
│  │  │   └── Movie card component    │   └── Add/remove watchlist             │   │   │
│  │  │ • home/page_nav.ejs                                                    │   │   │
│  │  │   └── Pagination controls                                              │   │   │
│  │  └─────────────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                STATIC ASSETS                                    │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────────────────┐   │   │
│  │  │        CSS STYLESHEETS      │  │            JAVASCRIPT MODULES           │   │   │
│  │  │                             │  │                                         │   │   │
│  │  │ • styles.css                │  │ • ejs.min.js                           │   │   │
│  │  │   └── Global styles, layout │  │   └── EJS client-side templating       │   │   │
│  │  │       typography, colors    │  │                                         │   │   │
│  │  │                             │  │ • logoButton.js                        │   │   │
│  │  │ • movie.css                 │  │   └── Logo/brand interactions          │   │   │
│  │  │   └── Movie page specific   │  │                                         │   │   │
│  │  │       styling, reviews      │  │ • movieComponent.js                    │   │   │
│  │  │                             │  │   └── Movie card interactions,         │   │   │
│  │  │ • mediaqueries.css          │  │       hover effects                    │   │   │
│  │  │   └── Responsive breakpoints│  │                                         │   │   │
│  │  │       Mobile: 320px-768px   │  │ • movieRating.js                       │   │   │
│  │  │       Tablet: 768px-1024px  │  │   └── Star rating system,             │   │   │
│  │  │       Desktop: 1024px+      │  │       interactive rating               │   │   │
│  │  │                             │  │                                         │   │   │
│  │  │ CSS Architecture:           │  │ • pageNav.js                           │   │   │
│  │  │ • CSS Grid & Flexbox        │  │   └── Pagination controls,            │   │   │
│  │  │ • CSS Custom Properties     │  │       infinite scroll                  │   │   │
│  │  │ • Mobile-first approach     │  │                                         │   │   │
│  │  │ • Semantic class naming     │  │ • profile.js                           │   │   │
│  │  │ • Component-based styles    │  │   └── Profile management,             │   │   │
│  │  └─────────────────────────────┘  │       form validation                   │   │   │
│  │                                   │                                         │   │   │
│  │  ┌─────────────────────────────┐  │ • review.js                            │   │   │
│  │  │         ASSETS              │  │   └── Review CRUD operations,         │   │   │
│  │  │                             │  │       social reactions                 │   │   │
│  │  │ • imageNotFound.png         │  │                                         │   │   │
│  │  │   └── Fallback for missing  │  │ • watchList.js                         │   │   │
│  │  │       movie posters         │  │   └── Watchlist management,           │   │   │
│  │  │   Dimensions: 300x450       │  │       add/remove movies                │   │   │
│  │  │   Format: PNG with          │  │                                         │   │   │
│  │  │   transparency              │  │ JavaScript Architecture:               │   │   │
│  │  │                             │  │ • ES6+ syntax                          │   │   │
│  │  │ Future Assets:              │  │ • Modular design                       │   │   │
│  │  │ • Loading spinners          │  │ • Event delegation                     │   │   │
│  │  │ • Icons (stars, hearts)     │  │ • AJAX with fetch API                  │   │   │
│  │  │ • Brand logos               │  │ • Error handling                       │   │   │
│  │  │ • Social media icons        │  │ • Local storage integration            │   │   │
│  │  └─────────────────────────────┘  └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            CLIENT-SIDE INTERACTIONS                             │   │
│  │                                                                                 │   │
│  │  User Experience Features:              Performance Optimizations:             │   │
│  │  • Real-time search suggestions         • Lazy loading for images              │   │
│  │  • Infinite scroll pagination          • Debounced search input               │   │
│  │  • Dynamic content loading             • Cached API responses                 │   │
│  │  • Form validation feedback            • Optimistic UI updates                │   │
│  │  • Interactive star ratings            • Progressive enhancement               │   │
│  │  • Social reaction animations          • Service worker (future)              │   │   │
│  │  • Toast notifications                 • Bundle optimization                  │   │
│  │  • Modal dialogs                       • Image compression                    │   │
│  │  • Keyboard navigation                 • Code splitting                       │   │
│  │  • Accessibility features              • Browser caching                      │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Comprehensive Data Flow Diagrams

### User Journey: Movie Discovery to Review
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                USER JOURNEY FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐  │
│  │   LANDING   │    │   BROWSE    │    │   DISCOVER  │    │      ENGAGEMENT         │  │
│  │    PAGE     │    │   MOVIES    │    │   DETAILS   │    │      ACTIONS            │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────────────────┘  │
│         │                   │                   │                         │            │
│         │ 1. Load popular   │ 2. Search/filter  │ 3. Select movie        │            │
│         │    movies         │    movies         │    for details         │            │
│         ▼                   ▼                   ▼                         ▼            │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│  │                           TECHNICAL FLOW                                        │  │
│  │                                                                                 │  │
│  │  Browser → homeController → TMDB API → Movie Data → EJS Render → Browser      │  │
│  │     │            │              │          │           │            │         │  │
│  │     │            │              │          │           │            │         │  │
│  │  Search → movieapi.js → API Call → Process → Template → Display     │         │  │
│  │     │         │            │         │         │         │          │         │  │
│  │     │         │            │         │         │         │          │         │  │
│  │  Click → movieController → Get Details → Reviews DAO → Render Movie Page      │  │
│  │     │         │              │            │              │                    │  │
│  │     │         │              │            │              │                    │  │
│  │  Review → reviewController → Validate → Save to DB → Update UI                │  │
│  │     │           │              │          │           │                       │  │
│  │     │           │              │          │           │                       │  │
│  │  React → AJAX → reactDAO → Update Counts → Return JSON → Live Update         │  │
│  └─────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Authentication & Session Management Flow
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               AUTHENTICATION FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │   REGISTRATION      │  │      LOGIN          │  │      SESSION MANAGEMENT        │  │
│  │                     │  │                     │  │                                 │  │
│  │ 1. User Input       │  │ 1. Credentials      │  │ 1. Session Creation             │  │
│  │    • Name           │  │    • Email          │  │    • Generate session ID       │  │
│  │    • Email          │  │    • Password       │  │    • Store in PostgreSQL       │  │
│  │    • Age            │  │                     │  │    • Set HTTP cookies          │  │
│  │    • Password       │  │ 2. Validation       │  │                                 │  │
│  │                     │  │    • Email exists   │  │ 2. Session Validation           │  │
│  │ 2. Validation       │  │    • Password match │  │    • Check cookie               │  │
│  │    • Email unique   │  │    • Account active │  │    • Verify in database         │  │
│  │    • Age range      │  │                     │  │    • Refresh expiration         │  │
│  │    • Password       │  │ 3. Authentication   │  │                                 │  │
│  │      strength       │  │    • bcrypt compare │  │ 3. Session Cleanup              │  │
│  │                     │  │    • Create session │  │    • Automatic expiration       │  │
│  │ 3. Account Creation │  │    • Set user context│    │ • Manual logout             │  │
│  │    • Hash password  │  │                     │  │    • Database cleanup          │  │
│  │    • Store in DB    │  │ 4. Redirect         │  │                                 │  │
│  │    • Auto-login     │  │    • Dashboard/Home │  │ 4. Security Features            │  │
│  │                     │  │                     │  │    • HttpOnly cookies          │  │
│  └─────────────────────┘  └─────────────────────┘  │    • Secure flag (HTTPS)        │  │
│                                                    │    • SameSite protection        │  │
│  ┌─────────────────────────────────────────────────┤    • Session regeneration       │  │
│  │              ERROR HANDLING                     │    • Concurrent session limit   │  │
│  │                                                 │                                 │  │
│  │ • Invalid credentials → Show error message      └─────────────────────────────────┘  │
│  │ • Email already exists → Registration error                                         │  │
│  │ • Session expired → Redirect to login                                              │  │
│  │ • Database connection → Graceful degradation                                       │  │
│  │ • Rate limiting → Prevent brute force attacks                                      │  │
│  └─────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Review & Social Interaction Flow
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           REVIEW & SOCIAL INTERACTION FLOW                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │   REVIEW CREATION   │  │   REVIEW DISPLAY    │  │      SOCIAL INTERACTIONS        │  │
│  │                     │  │                     │  │                                 │  │
│  │ 1. Authentication   │  │ 1. Fetch Reviews    │  │ 1. Like/Funny Reactions         │  │
│  │    • Check session  │  │    • Sort options:  │  │    • AJAX requests              │  │
│  │    • User validation│  │      - Most liked   │  │    • Optimistic UI updates      │  │
│  │                     │  │      - Most recent  │  │    • Real-time count updates    │  │
│  │ 2. Review Input     │  │      - Funniest     │  │                                 │  │
│  │    • Star rating    │  │                     │  │ 2. Reaction Management          │  │
│  │      (1-5 scale)    │  │ 2. Review Processing│  │    • Toggle existing reactions  │  │
│  │    • Text content   │  │    • User info join │  │    • Update counter fields      │  │
│  │    • Character limit│  │    • Reaction data  │  │    • Database consistency       │  │
│  │                     │  │    • Date formatting│  │                                 │  │
│  │ 3. Validation       │  │                     │  │ 3. Social Features              │  │
│  │    • Prevent empty  │  │ 3. Pagination       │  │    • User reaction history      │  │
│  │    • Spam detection │  │    • Load more      │  │    • Popular review tracking    │  │
│  │    • Duplicate check│  │    • Performance    │  │    • Community moderation       │  │
│  │                     │  │      optimization   │  │                                 │  │
│  │ 4. Database Storage │  │                     │  │ 4. Analytics & Insights         │  │
│  │    • Upsert operation│  │ 4. Real-time Updates│    • Most active users          │  │
│  │    • Update counts  │  │    • New reviews    │  │    • Popular movies             │  │
│  │    • Trigger events │  │    • Reaction changes│    • Review sentiment analysis  │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────────────┘  │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                               DATA CONSISTENCY                                   │   │
│  │                                                                                 │   │
│  │ Constraints & Rules:                    Update Triggers:                       │   │
│  │ • One review per user per movie         • Auto-update like_count               │   │
│  │ • Star rating: 1-5 validation          • Auto-update funny_count              │   │
│  │ • Review text: non-empty                • Recalculate movie averages           │   │
│  │ • User must be authenticated            • Update user statistics               │   │
│  │                                                                                 │   │
│  │ Conflict Resolution:                    Performance Optimizations:             │   │
│  │ • Handle concurrent updates             • Database indexing on movie_id        │   │
│  │ • Transaction isolation                 • Cached aggregate calculations        │   │
│  │ • Rollback on errors                    • Lazy loading for reactions           │   │
│  │ • Data integrity checks                 • Background count updates             │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Watchlist Management Flow
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              WATCHLIST MANAGEMENT FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │   ADD TO WATCHLIST  │  │   VIEW WATCHLIST    │  │    WATCHLIST OPERATIONS         │  │
│  │                     │  │                     │  │                                 │  │
│  │ 1. User Action      │  │ 1. Authentication   │  │ 1. Remove Movie                 │  │
│  │    • Click watchlist│  │    • Session check  │  │    • Confirmation dialog        │  │
│  │      button         │  │    • User validation│  │    • Database removal           │  │
│  │    • Movie page or  │  │                     │  │    • UI update                  │  │
│  │      browse page    │  │ 2. Fetch User's     │  │                                 │  │
│  │                     │  │    Movies           │  │ 2. Bulk Operations              │  │
│  │ 2. Authentication   │  │    • Join with TMDB │  │    • Clear all                  │  │
│  │    • Verify login   │  │      data           │  │    • Export list                │  │
│  │    • Check session  │  │    • Pagination     │  │    • Share list                 │  │
│  │                     │  │                     │  │                                 │  │
│  │ 3. Duplicate Check  │  │ 3. Display Options  │  │ 3. Smart Features               │  │
│  │    • Query existing │  │    • Grid/List view │  │    • Recommendation based on    │  │
│  │      entries        │  │    • Sort by date   │  │      watchlist                  │  │
│  │    • Prevent        │  │    • Filter options │  │    • Similar movies             │  │
│  │      duplicates     │  │                     │  │    • Genre preferences          │  │
│  │                     │  │ 4. Movie Integration│  │                                 │  │
│  │ 4. Database Insert  │  │    • Get TMDB data  │  │ 4. Sync & Backup                │  │
│  │    • User-movie pair│  │    • Poster images  │  │    • Cloud sync (future)        │  │
│  │    • Timestamp      │  │    • Release info   │  │    • Export formats             │  │
│  │    • Success        │  │    • Ratings        │  │    • Import from other services │  │
│  │      confirmation   │  │                     │  │                                 │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────────────┘  │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            WATCHLIST FEATURES                                   │   │
│  │                                                                                 │   │
│  │ User Experience:                        Backend Optimization:                  │   │
│  │ • One-click add/remove                  • Efficient queries                    │   │
│  │ • Visual feedback                       • Indexed lookups                      │   │
│  │ • Status indicators                     • Bulk operations                      │   │
│  │ • Empty state handling                  • Caching strategies                   │   │
│  │                                                                                 │   │
│  │ Business Logic:                         Integration Points:                    │   │
│  │ • Personal collection                   • Movie details page                   │   │
│  │ • Cross-device access                   • Search results                       │   │
│  │ • Privacy controls                      • Home page recommendations            │   │
│  │ • Usage analytics                       • Profile page                         │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Advanced Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               SECURITY ARCHITECTURE                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            AUTHENTICATION SECURITY                              │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │   PASSWORD HASH     │  │   SESSION MGMT      │  │   ACCESS CONTROL        │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ • bcrypt hashing    │  │ • Express sessions  │  │ • Route protection      │ │   │
│  │  │ • Salt rounds: 12   │  │ • PostgreSQL store  │  │ • Role-based access     │ │   │
│  │  │ • Secure random     │  │ • HttpOnly cookies  │  │ • Permission middleware │ │   │
│  │  │   salt generation   │  │ • Secure flag       │  │ • Authentication checks │ │   │
│  │  │ • Password          │  │ • SameSite policy   │  │                         │ │   │
│  │  │   complexity rules  │  │ • Session timeout   │  │ Protected Routes:       │ │   │
│  │  │ • Hash comparison   │  │ • Regeneration      │  │ • /profile/*            │ │   │
│  │  │   (constant time)   │  │ • Cleanup jobs      │  │ • /review/*             │ │   │
│  │  │                     │  │                     │  │ • /watchlist/*          │ │   │
│  │  │ Security Features:  │  │ Security Features:  │  │ • /logout               │ │   │
│  │  │ • No plaintext      │  │ • Session fixation  │  │                         │ │   │
│  │  │   storage           │  │   protection        │  │ Public Routes:          │ │   │
│  │  │ • Timing attack     │  │ • Cross-tab logout  │  │ • /                     │ │   │
│  │  │   resistance        │  │ • Concurrent        │  │ • /login                │ │   │
│  │  │ • Rainbow table     │  │   session limits    │  │ • /register             │ │   │
│  │  │   protection        │  │                     │  │ • /search               │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              INPUT VALIDATION                                   │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │   SQL INJECTION     │  │   XSS PREVENTION    │  │   DATA VALIDATION       │ │   │
│  │  │   PREVENTION        │  │                     │  │                         │ │   │
│  │  │                     │  │ • Output encoding   │  │ • Input sanitization    │ │   │
│  │  │ • Parameterized     │  │ • Content Security  │  │ • Type checking         │ │   │
│  │  │   queries           │  │   Policy (CSP)      │  │ • Length limits         │ │   │
│  │  │ • Prepared          │  │ • HTML escaping     │  │ • Format validation     │ │   │
│  │  │   statements        │  │ • Script tag        │  │                         │ │   │
│  │  │ • Query validation  │  │   filtering         │  │ Validation Rules:       │ │   │
│  │  │ • Input escaping    │  │ • DOM purification  │  │ • Email format          │ │   │
│  │  │                     │  │                     │  │ • Age range: 1-100      │ │   │
│  │  │ Database Security:  │  │ Template Security:  │  │ • Password strength     │ │   │
│  │  │ • Connection        │  │ • EJS auto-escaping │  │ • Review length limits  │ │   │
│  │  │   encryption        │  │ • Safe partials     │  │ • Star rating: 1-5      │ │   │
│  │  │ • User permissions  │  │ • Trusted templates │  │ • URL validation        │ │   │
│  │  │ • Query logging     │  │   only              │  │ • File upload limits    │ │   │
│  │  │ • Connection        │  │                     │  │                         │ │   │
│  │  │   pooling           │  │                     │  │                         │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                           ADDITIONAL SECURITY MEASURES                          │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │   RATE LIMITING     │  │   ERROR HANDLING    │  │   SECURITY HEADERS      │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ • Login attempts    │  │ • Graceful failures │  │ • X-Content-Type-       │ │   │
│  │  │ • API request       │  │ • No stack traces   │  │   Options               │ │   │
│  │  │   throttling        │  │   in production     │  │ • X-Frame-Options       │ │   │
│  │  │ • IP-based limits   │  │ • Generic error     │  │ • X-XSS-Protection      │ │   │
│  │  │ • User-based limits │  │   messages          │  │ • Strict-Transport-     │ │   │
│  │  │                     │  │ • Audit logging     │  │   Security              │ │   │
│  │  │ Implementation:     │  │ • Security          │  │ • Referrer-Policy       │ │   │
│  │  │ • Express-rate-     │  │   monitoring        │  │                         │ │   │
│  │  │   limit middleware  │  │                     │  │ Privacy Protection:     │ │   │
│  │  │ • Redis store       │  │ Monitoring:         │  │ • No user data in       │ │   │
│  │  │   (future)          │  │ • Failed login      │  │   client-side logs      │ │   │
│  │  │ • Progressive       │  │   tracking          │  │ • Secure data          │ │   │
│  │  │   delays            │  │ • Suspicious        │  │   transmission          │ │   │
│  │  │                     │  │   activity alerts   │  │ • GDPR compliance       │ │   │
│  │  │                     │  │ • Performance       │  │   considerations        │ │   │
│  │  │                     │  │   metrics           │  │                         │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Database Schema & Relationships - Detailed

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                CORE TABLES                                      │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐          ┌─────────────────────────────────────────┐   │   │
│  │  │       users         │          │                reviews                  │   │   │
│  │  │                     │ 1      ∞ │                                         │   │   │
│  │  │ • id (PK, SERIAL)   │◄─────────┤ • id (SERIAL)                           │   │   │
│  │  │ • name VARCHAR(20)  │          │ • user_id (FK) → users.id               │   │   │
│  │  │ • email VARCHAR(100)│          │ • movie_id INTEGER (TMDB ID)            │   │   │
│  │  │   UNIQUE            │          │ • review_message TEXT NOT NULL          │   │   │
│  │  │ • age INTEGER       │          │ • review_star SMALLINT (1-5)            │   │   │
│  │  │   CHECK (1-100)     │          │ • review_datetime TIMESTAMP             │   │   │
│  │  │ • password          │          │ • like_count INTEGER DEFAULT 0          │   │   │
│  │  │   VARCHAR(100)      │          │ • funny_count INTEGER DEFAULT 0         │   │   │
│  │  │   (bcrypt hash)     │          │ • edited BOOLEAN DEFAULT false          │   │   │
│  │  │                     │          │                                         │   │   │
│  │  │ Constraints:        │          │ Constraints:                            │   │   │
│  │  │ • email UNIQUE      │          │ • PRIMARY KEY (user_id, movie_id)       │   │   │
│  │  │ • age 1-100         │          │ • UNIQUE (id)                           │   │   │
│  │  │ • name NOT NULL     │          │ • review_star CHECK (1 ≤ star ≤ 5)      │   │   │
│  │  │                     │          │ • like_count ≥ 0                        │   │   │
│  │  │ Indexes:            │          │ • funny_count ≥ 0                       │   │   │
│  │  │ • email (UNIQUE)    │          │                                         │   │   │
│  │  │ • id (PRIMARY)      │          │ Indexes:                                │   │   │
│  │  └─────────────────────┘          │ • movie_id (for movie lookups)          │   │   │
│  │            │                      │ • user_id (for user reviews)           │   │   │
│  │            │ 1                    │ • review_datetime (for sorting)         │   │   │
│  │            │                      │ • like_count (for popular reviews)      │   │   │
│  │            │                      └─────────────────────────────────────────┘   │   │
│  │            │ ∞                                       │ 1                        │   │
│  │            ▼                                         │                          │   │
│  │  ┌─────────────────────┐                            │ ∞                        │   │
│  │  │     watchlist       │                            ▼                          │   │
│  │  │                     │          ┌─────────────────────────────────────────┐   │   │
│  │  │ • user_id (FK,PK)   │          │                react                    │   │   │
│  │  │   → users.id        │          │                                         │   │   │
│  │  │ • movie_id (PK)     │          │ • review_id (FK,PK) → reviews.id        │   │   │
│  │  │   (TMDB ID)         │          │ • user_id (FK,PK) → users.id            │   │   │
│  │  │                     │          │ • movie_id INTEGER (TMDB ID)            │   │   │
│  │  │ Constraints:        │          │ • react_like BOOLEAN DEFAULT false     │   │   │
│  │  │ • PRIMARY KEY       │          │ • react_funny BOOLEAN DEFAULT false    │   │   │
│  │  │   (user_id,         │          │                                         │   │   │
│  │  │    movie_id)        │          │ Constraints:                            │   │   │
│  │  │ • FOREIGN KEY       │          │ • PRIMARY KEY (review_id, user_id)      │   │   │
│  │  │   user_id           │          │ • FOREIGN KEY review_id                 │   │   │
│  │  │                     │          │ • FOREIGN KEY user_id                   │   │   │
│  │  │ Features:           │          │                                         │   │   │
│  │  │ • No duplicates     │          │ Business Logic:                         │   │   │
│  │  │ • Cascade delete    │          │ • One reaction per user per review      │   │   │
│  │  │   on user removal   │          │ • Auto-update review counts             │   │   │
│  │  └─────────────────────┘          │ • Prevent self-reactions (app level)    │   │   │
│  │                                   └─────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              SESSION MANAGEMENT                                 │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────────────────────┐   │   │
│  │  │                               session                                   │   │   │
│  │  │                                                                         │   │   │
│  │  │ • sid VARCHAR (PRIMARY KEY)                                             │   │   │
│  │  │   └── Session identifier (crypto-random)                               │   │   │
│  │  │ • sess JSON NOT NULL                                                    │   │   │
│  │  │   └── Session data (user info, preferences)                            │   │   │
│  │  │ • expire TIMESTAMP WITH TIME ZONE                                       │   │   │
│  │  │   └── Session expiration time                                           │   │   │
│  │  │                                                                         │   │   │
│  │  │ Session Data Structure (JSON):                                          │   │   │
│  │  │ {                                                                       │   │   │
│  │  │   "userId": integer,                                                    │   │   │
│  │  │   "userName": string,                                                   │   │   │
│  │  │   "loginTime": timestamp,                                               │   │   │
│  │  │   "lastActivity": timestamp,                                            │   │   │
│  │  │   "userAgent": string,                                                  │   │   │
│  │  │   "ipAddress": string                                                   │   │   │
│  │  │ }                                                                       │   │   │
│  │  │                                                                         │   │   │
│  │  │ Cleanup & Maintenance:                                                  │   │   │
│  │  │ • Automatic expired session cleanup                                     │   │   │
│  │  │ • Manual session invalidation                                           │   │   │
│  │  │ • Session regeneration on login                                         │   │   │
│  │  └─────────────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Performance & Scalability Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           PERFORMANCE & OPTIMIZATION                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              DATABASE OPTIMIZATION                              │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │     INDEXING        │  │   CONNECTION         │  │    QUERY                │ │   │
│  │  │     STRATEGY        │  │   POOLING            │  │    OPTIMIZATION         │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ Primary Indexes:    │  │ Pool Configuration:  │  │ Query Strategies:       │ │   │
│  │  │ • users(id)         │  │ • Min connections: 2 │  │ • Prepared statements   │ │   │
│  │  │ • reviews(id)       │  │ • Max connections:10 │  │ • Batch operations      │ │   │
│  │  │ • react(review_id,  │  │ • Idle timeout: 30s  │  │ • Efficient joins       │ │   │
│  │  │   user_id)          │  │ • Connection reuse   │  │ • Pagination limits     │ │   │
│  │  │                     │  │ • Health checks      │  │                         │ │   │
│  │  │ Secondary Indexes:  │  │                     │  │ Performance Queries:    │ │   │
│  │  │ • users(email)      │  │ Benefits:           │  │ • Review aggregation    │ │   │
│  │  │ • reviews(movie_id) │  │ • Reduced overhead  │  │ • Rating calculations   │ │   │
│  │  │ • reviews(user_id)  │  │ • Better throughput │  │ • User statistics       │ │   │
│  │  │ • reviews(datetime) │  │ • Connection reuse  │  │ • Popular movies        │ │   │
│  │  │ • watchlist(user_id)│  │ • Failover support  │  │                         │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ Index Maintenance:  │  │ Monitoring:         │  │ Query Caching:          │ │   │
│  │  │ • Auto-analyze      │  │ • Active connections│  │ • Popular movie data    │ │   │
│  │  │ • Statistics update │  │ • Query performance │  │ • User session data     │ │   │
│  │  │ • Fragmentation     │  │ • Connection leaks  │  │ • Genre lists           │ │   │
│  │  │   monitoring        │  │ • Error rates       │  │ • Review counts         │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              FRONTEND OPTIMIZATION                              │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │   ASSET DELIVERY    │  │   CLIENT-SIDE       │  │    RESPONSIVE           │ │   │
│  │  │                     │  │   OPTIMIZATION      │  │    PERFORMANCE          │ │   │
│  │  │ Static Assets:      │  │                     │  │                         │ │   │
│  │  │ • CSS minification  │  │ JavaScript:         │  │ Image Optimization:     │ │   │
│  │  │ • JS compression    │  │ • Debounced search  │  │ • TMDB CDN integration  │ │   │
│  │  │ • Image             │  │ • Lazy loading      │  │ • Responsive images     │ │   │
│  │  │   optimization      │  │ • Event delegation  │  │ • WebP format support   │ │   │
│  │  │ • Browser caching   │  │ • DOM optimization  │  │ • Progressive loading   │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ Caching Strategy:   │  │ AJAX Optimization:  │  │ Mobile Performance:     │ │   │
│  │  │ • Cache-Control     │  │ • Request batching  │  │ • Touch optimization    │ │   │
│  │  │   headers           │  │ • Error retry logic │  │ • Reduced data usage    │ │   │
│  │  │ • ETags for         │  │ • Loading states    │  │ • Optimized UI          │ │   │
│  │  │   validation        │  │ • Progress feedback │  │ • Gesture support       │ │   │
│  │  │ • Service worker    │  │                     │  │                         │ │   │
│  │  │   (future)          │  │ Local Storage:      │  │ Performance Metrics:    │ │   │
│  │  │                     │  │ • User preferences  │  │ • First Paint          │ │   │
│  │  │ CDN Strategy:       │  │ • Search history    │  │ • Time to Interactive   │ │   │
│  │  │ • Static assets     │  │ • Form data         │  │ • Core Web Vitals       │ │   │
│  │  │ • Global            │  │ • Offline support   │  │ • Bundle size           │ │   │
│  │  │   distribution      │  │   (basic)           │  │                         │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              API OPTIMIZATION                                   │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │   TMDB API          │  │   REQUEST           │  │    ERROR HANDLING       │ │   │
│  │  │   INTEGRATION       │  │   OPTIMIZATION      │  │    & RESILIENCE         │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ Rate Limiting:      │  │ Request Strategies: │  │ Error Management:       │ │   │
│  │  │ • 40 req/10 seconds │  │ • Request batching  │  │ • Graceful degradation  │ │   │
│  │  │ • Request queuing   │  │ • Parallel requests │  │ • Fallback mechanisms   │ │   │
│  │  │ • Backoff strategy  │  │ • Timeout handling  │  │ • Error categorization  │ │   │
│  │  │ • Priority queues   │  │ • Retry logic       │  │ • User-friendly messages│ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ Caching Strategy:   │  │ Data Processing:    │  │ Monitoring:             │ │   │
│  │  │ • Popular movies    │  │ • Response          │  │ • API response times    │ │   │
│  │  │   (1 hour TTL)      │  │   transformation    │  │ • Error rates           │ │   │
│  │  │ • Genre lists       │  │ • Image URL         │  │ • Quota usage           │ │   │
│  │  │   (24 hour TTL)     │  │   construction      │  │ • Cache hit rates       │ │   │
│  │  │ • Movie details     │  │ • Data validation   │  │                         │ │   │
│  │  │   (6 hour TTL)      │  │ • Format            │  │ Circuit Breaker:        │ │   │
│  │  │                     │  │   standardization   │  │ • Automatic failover    │ │   │
│  │  │ Cache Management:   │  │                     │  │ • Health monitoring     │ │   │
│  │  │ • Redis integration │  │ Performance Tuning: │  │ • Recovery strategies   │ │   │
│  │  │ • Memory caching    │  │ • Concurrent        │  │ • Alert systems         │ │   │
│  │  │ • Cache invalidation│  │   requests          │  │                         │ │   │
│  │  │ • Hit rate          │  │ • Connection        │  │                         │ │   │
│  │  │   optimization      │  │   pooling           │  │                         │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Current Development Environment

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              LOCAL DEVELOPMENT SETUP                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                               CURRENT ENVIRONMENT                               │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │    DEVELOPMENT      │  │    LOCAL DATABASE   │  │    PACKAGE MANAGEMENT   │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ Current Setup:      │  │ Database Setup:     │  │ Dependencies:           │ │   │
│  │  │ • Node.js local     │  │ • PostgreSQL local  │  │ • npm packages          │ │   │
│  │  │ • Manual startup    │  │ • Local connection  │  │ • nodemon (dev)         │ │   │
│  │  │ • Console logging   │  │ • Direct queries    │  │ • express framework     │ │   │
│  │  │ • File-based config │  │ • Manual DB mgmt    │  │ • ejs templating        │ │   │
│  │  │                     │  │                     │  │                         │ │   │
│  │  │ How to Run:         │  │ Connection:         │  │ Scripts Available:      │ │   │
│  │  │ • npm install       │  │ • .env config       │  │ • npm install           │ │   │
│  │  │ • node index.js     │  │ • Direct connection │  │ • node index.js         │ │   │
│  │  │ • Manual restart    │  │ • Local host/port   │  │ • (no dev scripts)      │ │   │
│  │  │ • Browser testing   │  │                     │  │                         │ │   │
│  │  │                     │  │ Database Tools:     │  │ Development Tools:      │ │   │
│  │  │ Local Features:     │  │ • psql command line │  │ • VS Code               │ │   │
│  │  │ • Hot reload: NO    │  │ • pgAdmin (optional)│  │ • Browser DevTools      │ │   │
│  │  │ • Auto-restart: NO  │  │ • Manual queries    │  │ • Git version control   │ │   │
│  │  │ • Process mgmt: NO  │  │ • Schema from       │  │ • Terminal commands     │ │   │
│  │  │ • Error recovery:NO │  │   queries.sql       │  │                         │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                               ACTUAL FILE STRUCTURE                             │   │
│  │                                                                                 │   │
│  │  Project Root: c:\Users\JOE\Desktop\learningProject\MovieReview\               │   │
│  │                                                                                 │   │
│  │  Configuration Files:           Code Organization:                             │   │
│  │  • package.json (dependencies)  • index.js (entry point)                      │   │
│  │  • .env.example (template)      • server.js (Express setup)                   │   │
│  │  • queries.sql (DB schema)      • controller/ (route handlers)                │   │
│  │  • README.md (basic info)       • DAO/ (database operations)                  │   │
│  │                                 • views/ (EJS templates)                      │   │
│  │  Database Files:                • public/ (static assets)                     │   │
│  │  • dbConnection.js              • api/ (TMDB integration)                     │   │
│  │  • session.js                                                                  │   │
│  │                                 Version Control:                               │   │
│  │  Current Deployment:            • Git repository                               │   │
│  │  • Local machine only           • GitHub: JORUNOJOSTAR/MOVIE-APP-2            │   │
│  │  • Manual startup               • Branch: main                                 │   │
│  │  • No automation                • Manual commits                               │   │
│  │  • No containerization                                                         │   │
│  │  • No cloud deployment                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Local Development Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              CURRENT DEVELOPMENT PROCESS                                │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │   SETUP PROCESS     │  │   DEVELOPMENT       │  │      TESTING & DEBUGGING       │  │
│  │                     │  │   WORKFLOW          │  │                                 │  │
│  │ 1. Prerequisites:   │  │                     │  │ Current Testing:                │  │
│  │    • Node.js        │  │ 1. Code Changes     │  │ • Manual browser testing        │  │
│  │    • PostgreSQL     │  │    • Edit files     │  │ • Console.log debugging         │  │
│  │    • Git            │  │    • Save changes   │  │ • Browser DevTools              │  │
│  │    • VS Code        │  │                     │  │ • Error message checking        │  │
│  │                     │  │ 2. Database Updates │  │                                 │  │
│  │ 2. Installation:    │  │    • Manual SQL     │  │ Debugging Process:              │  │
│  │    • npm install    │  │    • Run queries    │  │ • Check server logs             │  │
│  │    • Setup .env     │  │    • Test data      │  │ • Verify database connection    │  │
│  │    • Create DB      │  │                     │  │ • Test API endpoints            │  │
│  │    • Run schema     │  │ 3. Server Restart   │  │ • Validate user inputs          │  │
│  │                     │  │    • Stop server    │  │                                 │  │
│  │ 3. Configuration:   │  │    • node index.js  │  │ Current Limitations:            │  │
│  │    • DB credentials │  │    • Manual process │  │ • No automated testing          │  │
│  │    • TMDB API key   │  │                     │  │ • No error monitoring           │  │
│  │    • Port settings  │  │ 4. Browser Testing  │  │ • No performance metrics        │  │
│  │    • Session config │  │    • Open localhost │  │ • No load testing               │  │
│  │                     │  │    • Test features  │  │ • No automated deployment       │  │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────────────────┘  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Future Enhancements & Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                               FUTURE ENHANCEMENTS                                       │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                            SHORT TERM (3-6 months)                              │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │  USER EXPERIENCE    │  │   DEVELOPMENT       │  │    TECHNICAL DEBT       │ │   │
│  │  │                     │  │   IMPROVEMENTS      │  │                         │ │   │
│  │  │ • Advanced search   │  │                     │  │ • Code refactoring      │ │   │
│  │  │   with filters      │  │ • Add nodemon       │  │ • Unit test coverage    │ │   │
│  │  │ • Dark mode theme   │  │   for auto-restart  │  │ • Documentation         │ │   │
│  │  │ • Accessibility     │  │ • Environment       │  │ • Error handling        │ │   │
│  │  │   improvements      │  │   variables setup   │  │   improvement           │ │   │
│  │  │                     │  │ • Development       │  │                         │ │   │
│  │  │ • User profiles     │  │   scripts in        │  │ • Performance           │ │   │
│  │  │ • Review comments   │  │   package.json      │  │   optimization          │ │   │
│  │  │ • Social features   │  │                     │  │ • Security audit        │ │   │
│  │  │ • Review sharing    │  │ • Better logging    │  │ • Dependency updates    │ │   │
│  │  └─────────────────────┘  │ • Error monitoring  │  └─────────────────────────┘ │   │
│  │                           │ • Database backup   │                             │ │   │
│  │                           │   strategy          │                             │ │   │
│  │                           └─────────────────────┘                             │ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              MEDIUM TERM (6-12 months)                          │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │   DEPLOYMENT        │  │   CONTENT EXPANSION │  │    PLATFORM SCALE       │ │   │
│  │  │   OPTIONS           │  │                     │  │                         │ │   │
│  │  │                     │  │ • TV show support   │  │ • API development       │ │   │
│  │  │ • Docker setup      │  │ • Streaming platform│  │ • Rate limiting         │ │   │
│  │  │ • Heroku deployment │  │   integration       │  │ • Caching layer         │ │   │
│  │  │ • Environment       │  │ • Movie trailers    │  │   (Redis)               │ │   │
│  │  │   management        │  │ • Cast & crew info  │  │                         │ │   │
│  │  │                     │  │                     │  │ • Admin dashboard       │ │   │
│  │  │ • CI/CD pipeline    │  │ • News & articles   │  │ • Analytics dashboard   │ │   │
│  │  │ • Automated testing │  │ • Upcoming releases │  │ • Content management    │ │   │
│  │  │ • Production        │  │ • Box office data   │  │                         │ │   │
│  │  │   monitoring        │  │                     │  │ • Multi-language        │ │   │
│  │  │ • SSL certificates  │  │                     │  │   support               │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              LONG TERM (12+ months)                             │   │
│  │                                                                                 │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐ │   │
│  │  │   ENTERPRISE        │  │   COMMUNITY         │  │    INNOVATION           │ │   │
│  │  │   FEATURES          │  │   PLATFORM          │  │                         │ │   │
│  │  │                     │  │                     │  │ • AI-powered reviews    │ │   │
│  │  │ • Multi-tenant      │  │ • User-generated    │  │ • Recommendation        │ │   │
│  │  │   architecture      │  │   content           │  │   engine                │ │   │
│  │  │ • API marketplace   │  │ • Community         │  │ • Mobile app            │ │   │
│  │  │ • Cloud scaling     │  │   challenges        │  │   (React Native)        │ │   │
│  │  │                     │  │ • User badges       │  │                         │ │   │
│  │  │ • Microservices     │  │ • Leaderboards      │  │ • PWA features          │ │   │
│  │  │ • Load balancing    │  │                     │  │ • Offline support       │ │   │
│  │  │ • Advanced          │  │ • Film festivals    │  │ • Voice search          │ │   │
│  │  │   analytics         │  │ • Critics network   │  │                         │ │   │
│  │  │ • Enterprise SSO    │  │ • Award voting      │  │ • Smart TV apps         │ │   │
│  │  │                     │  │ • Movie clubs       │  │ • Cinema partnerships   │ │   │
│  │  │ • SLA guarantees    │  │                     │  │                         │ │   │
│  │  │ • 24/7 support      │  │                     │  │                         │ │   │
│  │  └─────────────────────┘  └─────────────────────┘  └─────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## Current State vs Future Possibilities

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           DEVELOPMENT EVOLUTION PATH                                     │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │                              CURRENT STATE                                      │   │
│  │                                                                                 │   │
│  │  What You Have Now:                         Next Immediate Steps:               │   │
│  │  ✅ Working local application               1. Add development scripts          │   │
│  │  ✅ Complete feature set                   2. Environment variable setup       │   │
│  │  ✅ Database integration                   3. Error handling improvement        │   │
│  │  ✅ TMDB API integration                   4. Code documentation               │   │
│  │  ✅ User authentication                                                         │   │
│  │  ✅ Review system                          Deployment Options When Ready:       │   │
│  │  ✅ Social features                        • Heroku (easiest)                  │   │
│  │  ✅ Responsive design                      • Vercel (for Node.js)              │   │
│  │                                           • Railway (modern alternative)       │   │
│  │  Current Gaps:                            • DigitalOcean (cost-effective)     │   │
│  │  ❌ No automated restart                                                        │   │
│  │  ❌ No environment management             When You're Ready to Scale:          │   │
│  │  ❌ No deployment automation              • Docker containerization            │   │
│  │  ❌ No monitoring                         • CI/CD pipelines                   │   │
│  │  ❌ No error tracking                     • Load balancing                    │   │
│  │  ❌ No automated testing                  • Database clustering               │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

**Note:** This system diagram now accurately reflects your current local development setup. The Docker, Heroku, and deployment technologies mentioned are **future possibilities** when you decide to deploy your application to production, not current requirements.
