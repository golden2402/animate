export interface UserItemResponseModel {
  id: number;
  email: string;
  username: string;
  user_password: string;
  display_name: string;
  user_color: string;
  blurb: string;
  admin?: boolean
}

export interface AnimeItemResponseModel {
  id: number;
  title?: string;
  episodes?: number;
  season_id?: number;
}

export interface AnimeItemModel extends AnimeItemResponseModel {
  image?: string;
  genres: GenreItemResponseModel[];
  studios: ProducerItemResponseModel[];
  ratings: RatingItemResponseModel[];
  reviews: ReviewItemModel[];
}

export interface GenreItemResponseModel {
  id: number;
  genre_name: string;
}

export interface GenreItemResponseModel {
  id: number;
  genre_name: string;
}

export interface AnimeProducerResponseModel {
  anime_id: number;
  producer_id: number;
}

export interface ProducerItemResponseModel {
  id: number;
  studio_name?: string;
  studio_year?: string;
  studio_blurb?: string;
}

export interface RatingItemResponseModel {
  user_id: number;
  anime_id: number;
  rate_score: number;
  rate_date: Date;
}

export interface ReviewItemResponseModel {
  user_id: number;
  anime_id: number;
  post: string;
}

export interface ReviewItemModel extends ReviewItemResponseModel {
  username: string;
}
