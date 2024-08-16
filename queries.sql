-- Table: public.react

-- DROP TABLE IF EXISTS public.react;

CREATE TABLE IF NOT EXISTS public.react
(
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    react_like boolean DEFAULT false,
    react_funny boolean DEFAULT false,
    movie_id integer NOT NULL,
    CONSTRAINT react_pkey PRIMARY KEY (review_id, user_id),
    CONSTRAINT react_review_id_fkey FOREIGN KEY (review_id)
        REFERENCES public.reviews (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT react_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.react
    OWNER to postgres;

-- Table: public.reviews

-- DROP TABLE IF EXISTS public.reviews;

CREATE TABLE IF NOT EXISTS public.reviews
(
    id integer NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
    review_message text COLLATE pg_catalog."default" NOT NULL,
    review_star smallint NOT NULL,
    review_datetime timestamp without time zone NOT NULL,
    like_count integer DEFAULT 0,
    funny_count integer DEFAULT 0,
    movie_id integer NOT NULL,
    user_id integer NOT NULL,
    edited boolean NOT NULL DEFAULT false,
    CONSTRAINT reviews_pkey PRIMARY KEY (user_id, movie_id),
    CONSTRAINT reviews_id_key UNIQUE (id),
    CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT reviews_review_star_check CHECK (review_star >= 1 AND review_star <= 5),
    CONSTRAINT like_count_check CHECK (like_count >= 0) NOT VALID,
    CONSTRAINT funny_count_check CHECK (funny_count >= 0) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reviews
    OWNER to postgres;

-- Table: public.session

-- DROP TABLE IF EXISTS public.session;

CREATE TABLE IF NOT EXISTS public.session
(
    sid character varying COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp with time zone NOT NULL,
    CONSTRAINT session_pkey PRIMARY KEY (sid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.session
    OWNER to postgres;

-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    age integer NOT NULL,
    password character varying(100) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT age_check CHECK (age >= 1 AND age <= 100) NOT VALID
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

-- Table: public.watchlist

-- DROP TABLE IF EXISTS public.watchlist;

CREATE TABLE IF NOT EXISTS public.watchlist
(
    user_id integer NOT NULL DEFAULT nextval('watchlist_user_id_seq'::regclass),
    movie_id integer NOT NULL,
    CONSTRAINT watchlist_pkey PRIMARY KEY (user_id, movie_id),
    CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.watchlist
    OWNER to postgres;