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
    followee_id serial primary key,
    foreign key (followee_id) references user_account (id),
    follower_id serial,
    foreign key (follower_id) references user_account (id)
  );

create domain date_year as smallint check (value > 1799);

-- create type season_type as enum('winter', 'spring', 'fall', 'summer');

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
    episodes integer,
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
  episode (
    id serial primary key,
    episode_number smallint not null
  );

create table if not exists
  anime_episode (
    anime_id integer,
    foreign key (anime_id) references anime (id),
    episode_id serial,
    foreign key (episode_id) references episode (id)
  );

create table if not exists
  watched_episodes (
    user_id serial,
    foreign key (user_id) references user_account (id),
    episode_id serial,
    foreign key (episode_id) references episode (id),
    watch_date date
  );

-- FIXME: rating and review might need some revision; how should we couple the 
-- two (if at all?):
create table if not exists
  rating (
    user_id serial,
    foreign key (user_id) references user_account (id),
    episode_id serial,
    foreign key (episode_id) references episode (id),
    -- should this be not null?:
    rate_score smallint not null check (
      rate_score >= 0
      and rate_score <= 10
    ),
    rate_date date
  );

create table if not exists
  review (
    user_id serial,
    foreign key (user_id) references user_account (id),
    episode_id serial,
    foreign key (episode_id) references episode (id),
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

-- insert into
--   season (season_year, season_name)
-- values
--   (2022, 'winter'),
--   (2022, 'fall'),
--   (2022, 'spring'),
--   (2022, 'summer'),
--   (2023, 'winter'),
--   (2023, 'fall'),
--   (2023, 'spring'),
--   (2023, 'summer');

-- -- spoofed users:
-- insert into
--   user_account (email, username, user_password)
-- values
--   ('john@vt.edu', 'john', '12345678'),
--   ('jane@vt.edu', 'jane', '12345678'),
--   ('rathi@vt.edu', 'rathi', '12345678'),
--   ('david@vt.edu', 'david', '12345678'),
--   ('joey@vt.edu', 'joey', 'password'),
--   ('will@vt.edu', 'will', 'password'),
--   ('tomas@vt.edu', 'tomas', 'password'),
--   ('maxim@vt.edu', 'maxim', 'password'),
--   ('namita@vt.edu', 'namita', 'password_a'),
--   ('raseen@vt.edu', 'raseen', 'password_a'),
--   ('vineet@vt.edu', 'vineet', 'password_a'),
--   ('anthony@vt.edu', 'anthony', 'password_a'),
--   ('brian@vt.edu', 'brian', 'password_b'),
--   ('tony@vt.edu', 'tony', 'password_b'),
--   ('alex@vt.edu', 'alex', 'password_b'),
--   ('alexander@vt.edu', 'alexander', 'password_b'),
--   ('rich@vt.edu', 'rich', 'password_c'),
--   ('lisa@vt.edu', 'lisa', 'password_c'),
--   ('hiba@vt.edu', 'hiba', 'password_c'),
--   ('rion@vt.edu', 'rion', 'password_c');

-- insert into
--   anime (title, season_id)
-- values
--   ('Anime 1', 1),
--   ('Anime 2', 1),
--   ('Anime 1', 2),
--   ('Anime 2', 2),
--   ('Anime 3', 3),
--   ('Anime 4', 4),
--   ('Anime 4', 1),
--   ('Anime 5', 6),
--   ('Anime 5', 8),
--   ('Anime 6', 5),
--   ('Anime 3', 3),
--   ('Anime 5', 6),
--   ('Anime 10', 7),
--   ('Anime 11', 1),
--   ('Anime 12', 7),
--   ('Anime 16', 2),
--   ('Anime 17', 5),
--   ('Anime 18', 6),
--   ('Anime 19', 8),
--   ('Anime 20', 4);

-- insert into
--   genre (genre_name)
-- values
--   ('Action'),
--   ('Adventure'),
--   ('Avant Garde'),
--   ('Award Winning'),
--   ('Humor'),
--   ('Boys Love'),
--   ('Comedy'),
--   ('Drama'),
--   ('Fantasy'),
--   ('Girls Love'),
--   ('Gourment'),
--   ('Gourmet'),
--   ('Horror'),
--   ('Mystery'),
--   ('Sci-Fi'),
--   ('Romance'),
--   ('Slice of Life'),
--   ('Sports'),
--   ('Supernatural'),
--   ('Suspense'),
--   ('Ecchi'),
--   ('Erotica');

-- insert into
--   producer (studio_name, studio_year, studio_blurb)
-- values
--   ('Pierrot', 1979, 'This is Pierrot'),
--   ('Gonzo', 2000, 'This is Gonzo'),
--   (
--     'Kyoto Animation',
--     1985,
--     'This is Kyoto Animation'
--   ),
--   ('Bones', 1998, 'This is Bones!'),
--   ('Bee Train', 1997, 'This is bee train'),
--   ('Gainex', 1984, 'This is Gainex'),
--   ('JCSTaff', 1986, 'This is JCStaff'),
--   ('Artland', 2010, 'This is Artland'),
--   ('Production IG', 1987, 'This is Production IG'),
--   ('MadHouse', 1972, 'This is MadHouse'),
--   ('Sunrise', 1976, 'This is Sunrise'),
--   (
--     'Sony Pictures Entertainment',
--     1984,
--     'This is Sony'
--   ),
--   ('TV Tokyo', 1964, 'This is TV Tokyo'),
--   ('Aniplex', 1995, 'This is Aniplex'),
--   ('Toei Animation', 1948, 'This is Toei Animation'),
--   ('Studio Ghibli', 1985, 'This is Studio Ghibli'),
--   (
--     'Nippon Animation',
--     1975,
--     'This is Nippon Animation'
--   ),
--   ('Bandai Visual', 1983, 'This is Bandai Visual'),
--   (
--     'Studio Fantasia',
--     1983,
--     'This is Studio Fantasia'
--   ),
--   ('Milky Animation Label', 2020, null);
