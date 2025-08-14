# Movie Review Application - System Architecture

## High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    MOVIE REVIEW APPLICATION                                          │
│                                 Full-Stack Web Application                                          │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                     │
│  ┌─────────────────────────┐   ┌──────────────────────────┐   ┌─────────────────────────────────┐  │
│  │      CLIENT LAYER       │   │    APPLICATION LAYER     │   │       DATA & SERVICE LAYER      │  │
│  │    (Frontend/UI)        │   │    (Business Logic)      │   │     (Storage & External)        │  │
│  │                         │   │                          │   │                                 │  │
│  │ ┌─────────────────────┐ │   │ ┌──────────────────────┐ │   │ ┌─────────────────────────────┐ │  │
│  │ │   Web Browser       │ │   │ │   Node.js Server     │ │   │ │    PostgreSQL Database      │ │  │
│  │ │   (User Interface)  │ │◄──┤ │   Express.js Framework│ │   │ │   (User & Review Data)      │ │  │
│  │ │                     │ │   │ │                      │ │   │ │                             │ │  │
│  │ │ • EJS Templates     │ │   │ │ • Route Controllers  │ │   │ │ • users table               │ │  │
│  │ │ • CSS Styling       │ │   │ │ • Authentication     │ │   │ │ • reviews table             │ │  │
│  │ │ • JavaScript        │ │   │ │ • Session Management │ │   │ │ • watchlist table           │ │  │
│  │ │ • Responsive Design │ │   │ │ • Input Validation   │ │   │ │ • react table               │ │  │
│  │ └─────────────────────┘ │   │ │                      │ │   │ │ • session table             │ │  │
│  │                         │   │ │ • Security Layer     │ │   │ └─────────────────────────────┘ │  │
│  │ User Features:          │   │ │ • Error Handling     │ │   │                                 │  │
│  │ • Browse Movies         │   │ │ • Data Processing    │ │   │ ┌─────────────────────────────┐ │  │
│  │ • Search & Filter       │   │ └──────────────────────┘ │   │ │    TMDB API Service         │ │  │
│  │ • Write Reviews         │   │                          │   │ │   (External Movie Data)     │ │  │
│  │ • Rate Movies           │   │ ┌──────────────────────┐ │   │ │                             │ │  │
│  │ • Social Interactions   │   │ │   Data Access Layer  │ │   │ │ • Movie Information         │ │  │
│  │ • Manage Watchlist      │   │ │   (DAO Pattern)      │ │   │ │ • Search Functionality      │ │  │
│  │ • User Authentication   │   │ │                      │ │   │ │ • Genre Categories          │ │  │
│  └─────────────────────────┘   │ │ • users_dao.js       │ │   │ │ • Image CDN                 │ │  │
│                                │ │ • reviews_dao.js     │ │   │ │ • Trending Movies           │ │  │
│                                │ │ • watchlist_dao.js   │ │   │ └─────────────────────────────┘ │  │
│                                │ │ • react_dao.js       │ │   │                                 │  │
│                                │ └──────────────────────┘ │   │                                 │  │
│                                └──────────────────────────┘   │                                 │  │
│                                                               │                                 │  │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Core System Components

### Frontend Components (Client Layer)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │  EJS Templates  │  │   CSS Styles    │  │   JavaScript    │                │
│  │                 │  │                 │  │                 │                │
│  │ • home.ejs      │  │ • styles.css    │  │ • movieRating   │                │
│  │ • movie.ejs     │  │ • movie.css     │  │ • pageNav       │                │
│  │ • login.ejs     │  │ • responsive    │  │ • review        │                │
│  │ • profile.ejs   │  │   media queries │  │ • watchList     │                │
│  │ • register.ejs  │  │                 │  │ • profile       │                │
│  │ • watchList.ejs │  │                 │  │                 │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  User Experience Features:                                                      │
│  • Real-time search and filtering                                              │
│  • Interactive star rating system                                              │
│  • Social reactions (like/funny)                                               │
│  • Responsive mobile-first design                                              │
│  • Dynamic content loading                                                     │
│  • Form validation and error handling                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Backend Components (Application Layer)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│  │   Controllers   │  │   Middleware    │  │   Data Access   │                │
│  │                 │  │                 │  │                 │                │
│  │ • homeController│  │ • Authentication│  │ • users_dao     │                │
│  │ • movieController│ │ • Session Mgmt  │  │ • reviews_dao   │                │
│  │ • loginController│ │ • Body Parser   │  │ • watchlist_dao │                │
│  │ • reviewController│ │ • Static Files  │  │ • react_dao     │                │
│  │ • watchController│ │ • Error Handler │  │                 │                │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                │
│                                                                                 │
│  Key Features:                                                                  │
│  • RESTful API endpoints                                                       │
│  • MVC architecture pattern                                                    │
│  • Secure authentication with bcrypt                                           │
│  • Session-based user management                                               │
│  • Input validation and sanitization                                           │
│  • Error handling and logging                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema (Data Layer)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               DATABASE SCHEMA                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │    users    │────▶│   reviews   │◄────│    react    │     │ watchlist   │   │
│  │             │     │             │     │             │     │             │   │
│  │ • id (PK)   │     │ • id        │     │ • review_id │     │ • user_id   │   │
│  │ • name      │     │ • user_id   │     │ • user_id   │     │ • movie_id  │   │
│  │ • email     │     │ • movie_id  │     │ • movie_id  │     │             │   │
│  │ • age       │     │ • message   │     │ • like      │     │ Purpose:    │   │
│  │ • password  │     │ • star (1-5)│     │ • funny     │     │ Personal    │   │
│  │             │     │ • datetime  │     │             │     │ movie       │   │
│  │ Purpose:    │     │ • like_count│     │ Purpose:    │     │ collection  │   │
│  │ User        │     │ • funny_count│    │ Social      │     │             │   │
│  │ accounts    │     │             │     │ reactions   │     │             │   │
│  │ & auth      │     │ Purpose:    │     │ to reviews  │     │             │   │
│  └─────────────┘     │ Movie       │     └─────────────┘     └─────────────┘   │
│                      │ reviews     │                                           │
│                      │ & ratings   │     ┌─────────────┐                       │
│                      └─────────────┘     │   session   │                       │
│                                          │             │                       │
│                                          │ • sid (PK)  │                       │
│                                          │ • sess JSON │                       │
│                                          │ • expire    │                       │
│                                          │             │                       │
│                                          │ Purpose:    │                       │
│                                          │ User session│                       │
│                                          │ management  │                       │
│                                          └─────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            SYSTEM REQUEST FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  User Action                                                                    │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐                                                               │
│  │   Browser   │                                                               │
│  │   Request   │                                                               │
│  └─────────────┘                                                               │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Routes    │───▶│ Controllers │───▶│ DAO Layer   │───▶│  Database   │     │
│  │             │    │             │    │             │    │             │     │
│  │ • Express   │    │ • Business  │    │ • Data      │    │ • PostgreSQL│     │
│  │   routing   │    │   logic     │    │   access    │    │ • CRUD ops  │     │
│  │ • Middleware│    │ • Validation│    │ • Queries   │    │ • Relations │     │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │
│       │                   │                   │                   │            │
│       │                   │                   │                   ▼            │
│       │                   │                   │            ┌─────────────┐     │
│       │                   │                   │            │ TMDB API    │     │
│       │                   │                   │            │             │     │
│       │                   │                   │            │ • Movie data│     │
│       │                   │                   │            │ • Search    │     │
│       │                   │                   │            │ • Images    │     │
│       │                   │                   │            │ • Genres    │     │
│       │                   │                   │            └─────────────┘     │
│       │                   │                   │                   │            │
│       │                   │                   ▼                   │            │
│       │                   │            ┌─────────────┐           │            │
│       │                   │            │ Data        │           │            │
│       │                   │            │ Processing  │◄──────────┘            │
│       │                   │            │             │                        │
│       │                   │            │ • Transform │                        │
│       │                   │            │ • Validate  │                        │
│       │                   │            │ • Format    │                        │
│       │                   │            └─────────────┘                        │
│       │                   │                   │                                │
│       │                   ▼                   ▼                                │
│       │            ┌─────────────┐    ┌─────────────┐                         │
│       │            │ EJS Template│    │ JSON/AJAX   │                         │
│       │            │ Rendering   │    │ Response    │                         │
│       │            │             │    │             │                         │
│       │            │ • HTML gen  │    │ • API data  │                         │
│       │            │ • Dynamic   │    │ • Real-time │                         │
│       │            │   content   │    │   updates   │                         │
│       │            └─────────────┘    └─────────────┘                         │
│       │                   │                   │                                │
│       ▼                   ▼                   ▼                                │
│  ┌─────────────────────────────────────────────────────┐                      │
│  │               HTTP Response                         │                      │
│  │                                                     │                      │
│  │ • Rendered HTML page (for page requests)           │                      │
│  │ • JSON data (for AJAX requests)                    │                      │
│  │ • Error messages (if applicable)                   │                      │
│  │ • Redirect responses (after actions)               │                      │
│  └─────────────────────────────────────────────────────┘                      │
│       │                                                                         │
│       ▼                                                                         │
│  ┌─────────────┐                                                               │
│  │   Browser   │                                                               │
│  │   Display   │                                                               │
│  │             │                                                               │
│  │ • Render UI │                                                               │
│  │ • Update DOM│                                                               │
│  │ • User      │                                                               │
│  │   feedback  │                                                               │
│  └─────────────┘                                                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              TECHNOLOGY STACK                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Frontend Technologies        Backend Technologies        Database & External   │
│  ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐│
│  │ • HTML5 & EJS       │     │ • Node.js 20+       │     │ • PostgreSQL 14+    ││
│  │ • CSS3 & Flexbox    │     │ • Express.js 4.19+  │     │ • TMDB API v3       ││
│  │ • Vanilla JavaScript│     │ • bcrypt (security)  │     │ • Image CDN         ││
│  │ • Responsive Design │     │ • express-session    │     │ • Session store     ││
│  │ • AJAX & Fetch API  │     │ • body-parser        │     │                     ││
│  │                     │     │ • cookie-parser      │     │                     ││
│  └─────────────────────┘     │ • dotenv (config)    │     └─────────────────────┘│
│                              │ • pg (PostgreSQL)    │                            │
│  Development Tools           │ • axios (HTTP)       │     Security Features      │
│  ┌─────────────────────┐     └─────────────────────┘     ┌─────────────────────┐│
│  │ • VS Code           │                                  │ • Password hashing  ││
│  │ • Git version ctrl  │     Architecture Patterns       │ • Session security  ││
│  │ • NPM package mgmt  │     ┌─────────────────────┐     │ • Input validation  ││
│  │ • Nodemon (dev)     │     │ • MVC Pattern       │     │ • SQL injection     ││
│  │ • Browser DevTools  │     │ • DAO Pattern       │     │   prevention        ││
│  └─────────────────────┘     │ • RESTful APIs      │     │ • Error handling    ││
│                              │ • Modular design    │     │ • HTTPS ready       ││
│                              └─────────────────────┘     └─────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

**Movie Review Application** - A comprehensive full-stack web platform for movie discovery, reviewing, and social interaction, built with modern web technologies and best practices for security, performance, and user experience.
