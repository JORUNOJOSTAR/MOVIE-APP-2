# Database Schema Documentation - Movie Review System (Security Enhanced)

⬅️ [Back to Database Documentation Index](./ER_Diagram.md)

## 🛡️ Security-Enhanced Database Schema

### Security Features Implemented:
- ✅ **SQL Injection Prevention**: All queries use parameterized statements
- ✅ **Input Validation**: Server-side validation for all user inputs
- ✅ **Password Security**: bcrypt hashing with salt
- ✅ **Session Security**: Secure session management with database storage
- ✅ **Data Integrity**: Enhanced constraints and foreign key relationships

## Entity Descriptions

### USERS (Authentication & Profile Management)
- **Primary Key**: `id` (auto-increment)
- **Unique Constraints**: `email` (enforced at database level)
- **Security Features**: 
  - Password stored with bcrypt hash (never plaintext)
  - Email validation enforced
  - Input sanitization for name field
- **Description**: Stores secure user account information
- **Enhanced Constraints**: 
  - Age validation: 1-100 years (as per actual database constraint)
  - Email uniqueness with proper indexing
  - Name length: 20 characters maximum (as per actual database schema)
  - Password: minimum 8 characters (enforced at application level)

### REVIEWS (Content & Rating System)
- **Primary Key**: Composite (`user_id`, `movie_id`)
- **Unique Key**: `id` (auto-increment for easy referencing)
- **Security Features**:
  - XSS prevention through content sanitization
  - Input validation for rating values
  - Foreign key constraints for data integrity
- **Description**: Stores movie reviews with enhanced security
- **Enhanced Constraints**:
  - Star rating: 1-5 (strictly enforced)
  - Review content: 10-2000 characters (prevents spam/abuse)
  - Like/funny counters: >= 0 with proper update triggers
  - Timestamp tracking for audit purposes

### REACT (Social Interaction System)
- **Primary Key**: Composite (`review_id`, `user_id`)
- **Security Features**:
  - Prevents duplicate reactions
  - Foreign key integrity
  - User authorization checks
- **Description**: Secure user reaction system for reviews
- **Enhanced Features**:
  - Reaction type validation
  - Automatic counter maintenance
  - Cascade delete protection

### WATCHLIST (User Preferences)
- **Primary Key**: Composite (`user_id`, `movie_id`)
- **Security Features**:
  - User authorization validation
  - Movie ID validation
  - Duplicate prevention
- **Description**: Secure watchlist management
- **Enhanced Features**:
  - Added timestamp for tracking
  - Optimized indexes for performance
  - Cascade delete handling

### SESSION (Secure Authentication)
- **Primary Key**: `sid` (session ID)
- **Security Features**:
  - Secure session token generation
  - Automatic expiration handling
  - httpOnly and secure cookie attributes
- **Description**: Enhanced session management for security
- **Security Enhancements**:
  - Session rotation on login
  - Automatic cleanup of expired sessions
  - IP address tracking (optional)
  - User agent validation

## Detailed Table Specifications (Security Enhanced)

### USERS Table (Actual Database Schema)
```sql
CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name character varying(20) NOT NULL,  -- 20 characters max
    email character varying(100) NOT NULL UNIQUE,
    age integer NOT NULL,
    password character varying(100) NOT NULL, -- bcrypt hash storage
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT age_check CHECK (age >= 1 AND age <= 100) NOT VALID  -- 1-100 years
);

-- Security Indexes (implemented via migrations)
CREATE INDEX idx_users_email ON users(email);
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

---
⬅️ [Back to Database Documentation Index](./ER_Diagram.md)
