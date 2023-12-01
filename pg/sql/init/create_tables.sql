create domain hex_color char(6) default '1e293b' not null;

create table if not exists
  user_account (
    -- identification:
    id serial primary key,
    email varchar(80) unique,
    username varchar(20) unique,
    user_password varchar(255),
    -- user presentation:
    display_name varchar(80),
    user_color hex_color,
    blurb varchar(255)
  );

create table if not exists
  follow (
    followee_id integer primary key,
    foreign key (followee_id) references user_account (id),
    follower_id integer,
    foreign key (follower_id) references user_account (id)
  );

create domain date_year as smallint check (value > 1799);

-- create type season_type as enum('winter', 'spring', 'fall', 'summer');
create type watch_status as enum(
  'watching',
  'plan to watch',
  'completed',
  'rewatching',
  'paused',
  'dropped'
);

create table if not exists
  season (
    id serial primary key,
    season_year date_year not null,
    season_name varchar(255) not null
  );

create table if not exists
  anime (
    id integer primary key,
    title varchar(255),
    episodes smallint,
    season_id integer,
    foreign key (season_id) references season (id) on delete set null
  );

create table if not exists
  favorite (
    user_id integer,
    foreign key (user_id) references user_account (id),
    anime_id integer,
    foreign key (anime_id) references anime (id)
  );

create table if not exists
  genre (
    id integer primary key,
    genre_name varchar(80) unique
  );

create table if not exists
  anime_genre (
    anime_id integer,
    foreign key (anime_id) references anime (id),
    genre_id integer,
    foreign key (genre_id) references genre (id)
  );

create table if not exists
  watched_anime (
    user_id integer,
    foreign key (user_id) references user_account (id),
    anime_id integer,
    foreign key (anime_id) references anime (id),
    watch_status watch_status default 'watching',
    watch_count smallint,
    watch_date date
  );

-- FIXME: rating and review might need some revision; how should we couple the 
-- two (if at all?):
create table if not exists
  rating (
    user_id integer,
    foreign key (user_id) references user_account (id),
    anime_id integer,
    foreign key (anime_id) references anime (id),
    rate_score smallint check (
      rate_score >= 0
      and rate_score <= 10
    ),
    rate_date date
  );

create table if not exists
  review (
    user_id integer,
    foreign key (user_id) references user_account (id),
    anime_id integer,
    foreign key (anime_id) references anime (id),
    post varchar(2047) not null
  );

create table if not exists
  producer (
    id integer primary key,
    studio_name varchar(80),
    studio_year date,
    studio_blurb varchar(4093)
  );

create table if not exists
  produced_by (
    anime_id integer,
    foreign key (anime_id) references anime (id),
    producer_id integer,
    foreign key (producer_id) references producer (id)
  );
