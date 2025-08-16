# Database Schema Documentation - Movie Review System

## Entity Descriptions

### USERS
- **Primary Key**: `id` (auto-increment)
- **Unique Constraints**: `email`
- **Description**: Stores user account information
- **Constraints**: 
  - Age must be between 1 and 100
  - Email must be unique
  - Name limited to 20 characters

### REVIEWS
- **Primary Key**: Composite (`user_id`, `movie_id`)
- **Unique Key**: `id` (auto-increment)
- **Description**: Stores movie reviews written by users
- **Constraints**:
  - Star rating must be between 1 and 5
  - Like count and funny count must be >= 0
  - One review per user per movie

### REACT
- **Primary Key**: Composite (`review_id`, `user_id`)
- **Description**: Stores user reactions (like/funny) to reviews
- **Note**: Users can react to reviews with like and/or funny reactions

### WATCHLIST
- **Primary Key**: Composite (`user_id`, `movie_id`)
- **Description**: Stores movies that users want to watch
- **Note**: Many-to-many relationship between users and movies

### SESSION
- **Primary Key**: `sid` (session ID)
- **Description**: Stores session data for user authentication
- **Note**: Used for maintaining user login sessions

## Detailed Table Specifications

### USERS Table
```sql
- id: integer (PK, auto-increment)
- name: varchar(20) NOT NULL
- email: varchar(100) NOT NULL UNIQUE
- age: integer NOT NULL (CHECK: 1-100)
- password: varchar(100) NOT NULL
```

### REVIEWS Table
```sql
- id: integer UNIQUE (auto-increment)
- review_message: text NOT NULL
- review_star: smallint NOT NULL (CHECK: 1-5)
- review_datetime: timestamp NOT NULL
- like_count: integer DEFAULT 0 (CHECK: >= 0)
- funny_count: integer DEFAULT 0 (CHECK: >= 0)
- movie_id: integer NOT NULL
- user_id: integer NOT NULL (FK to users.id)
- edited: boolean DEFAULT false
- PRIMARY KEY: (user_id, movie_id)
```

### REACT Table
```sql
- review_id: integer NOT NULL (FK to reviews.id)
- user_id: integer NOT NULL (FK to users.id)
- react_like: boolean DEFAULT false
- react_funny: boolean DEFAULT false
- movie_id: integer NOT NULL
- PRIMARY KEY: (review_id, user_id)
```

### WATCHLIST Table
```sql
- user_id: integer NOT NULL (FK to users.id)
- movie_id: integer NOT NULL
- PRIMARY KEY: (user_id, movie_id)
```

### SESSION Table
```sql
- sid: varchar NOT NULL (PK)
- sess: json NOT NULL
- expire: timestamp with time zone NOT NULL
```

## Relationships Summary

### 1. Users to Reviews (One-to-Many)
- **Relationship**: A user can write multiple reviews
- **Constraint**: Each review belongs to one user
- **Business Rule**: One review per user per movie (enforced by composite PK)
- **Foreign Key**: reviews.user_id → users.id

### 2. Users to React (One-to-Many)
- **Relationship**: A user can react to multiple reviews
- **Constraint**: Each reaction belongs to one user
- **Business Rule**: One reaction per user per review (enforced by composite PK)
- **Foreign Key**: react.user_id → users.id

### 3. Reviews to React (One-to-Many)
- **Relationship**: A review can receive multiple reactions
- **Constraint**: Each reaction is for one specific review
- **Business Rule**: Users can like and/or find funny the same review
- **Foreign Key**: react.review_id → reviews.id

### 4. Users to Watchlist (One-to-Many)
- **Relationship**: A user can have multiple movies in their watchlist
- **Constraint**: Each watchlist entry belongs to one user
- **Business Rule**: One entry per user per movie (enforced by composite PK)
- **Foreign Key**: watchlist.user_id → users.id

### 5. Session (Independent)
- **Relationship**: No direct foreign key relationships
- **Purpose**: Manages user authentication sessions
- **Note**: Sessions are linked to users through application logic, not database constraints

## Database Design Notes

### Movie Data Strategy
- **External API**: The system references movies by `movie_id` but doesn't store movie details locally
- **Assumption**: Movie data is fetched from external sources (e.g., TMDB, OMDB)
- **Benefit**: Always up-to-date movie information without local storage overhead

### Composite Primary Keys
- **Purpose**: Prevent duplicate entries and ensure data integrity
- **Tables Using Composite PKs**: REVIEWS, REACT, WATCHLIST
- **Benefit**: Natural constraints that match business rules

### Reaction System
- **Design**: Separate table from reviews to allow multiple users to react
- **Flexibility**: Users can independently like and find reviews funny
- **Scalability**: Easy to add new reaction types in the future

### Watchlist Implementation
- **Simple Design**: Many-to-many relationship between users and movies
- **Efficiency**: Minimal data storage with maximum functionality
- **Future Enhancement**: Could add timestamps, priority, or notes

### Session Management
- **Standard Approach**: JSON session storage with expiration
- **Security**: Session-based authentication
- **Performance**: Efficient session lookup by session ID

## Indexing Recommendations

### Recommended Indexes
```sql
-- For frequent queries
CREATE INDEX idx_reviews_movie_id ON reviews(movie_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_react_review_id ON react(review_id);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_session_expire ON session(expire);
```

### Performance Considerations
- **Movie Reviews**: Index on movie_id for fast review retrieval
- **User Activities**: Index on user_id for user-specific queries
- **Session Cleanup**: Index on expire for efficient session cleanup
- **Reaction Counts**: Consider denormalization for frequently accessed counts
