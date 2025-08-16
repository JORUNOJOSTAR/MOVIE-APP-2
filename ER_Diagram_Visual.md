# Entity-Relationship Diagram for Movie Review System

## ER Diagram

```mermaid
erDiagram
    USERS {
        int id PK "Auto-increment, Primary Key"
        varchar name "Max 20 characters"
        varchar email UK "Max 100 characters, Unique"
        int age "1-100 range"
        varchar password "Max 100 characters"
    }
    
    REVIEWS {
        int id UK "Auto-increment, Unique Key"
        text review_message "Review content"
        smallint review_star "1-5 star rating"
        timestamp review_datetime "Review timestamp"
        int like_count "Default 0"
        int funny_count "Default 0"
        int movie_id "Movie identifier"
        int user_id FK "Foreign Key to users"
        boolean edited "Default false"
    }
    
    REACT {
        int review_id FK "Foreign Key to reviews"
        int user_id FK "Foreign Key to users"
        boolean react_like "Default false"
        boolean react_funny "Default false"
        int movie_id "Movie identifier"
    }
    
    WATCHLIST {
        int user_id FK "Foreign Key to users"
        int movie_id "Movie identifier"
    }
    
    SESSION {
        varchar sid PK "Session ID, Primary Key"
        json sess "Session data"
        timestamp expire "Session expiration"
    }

    %% Relationships
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ REACT : "reacts_to"
    USERS ||--o{ WATCHLIST : "has"
    REVIEWS ||--o{ REACT : "receives"
    
    %% Composite Primary Keys
    REVIEWS }|--|| USERS : "user_id, movie_id (Composite PK)"
    REACT }|--|| USERS : "review_id, user_id (Composite PK)"
    REACT }|--|| REVIEWS : "review_id, user_id (Composite PK)"
    WATCHLIST }|--|| USERS : "user_id, movie_id (Composite PK)"
```

## Quick Reference

**Tables**: USERS, REVIEWS, REACT, WATCHLIST, SESSION

**Key Relationships**:
- Users write Reviews (1:M)
- Users react to Reviews (1:M)
- Users maintain Watchlists (1:M)
- Reviews receive Reactions (1:M)

For detailed entity descriptions, constraints, and design notes, see [Database Schema Documentation](./Database_Schema.md)
