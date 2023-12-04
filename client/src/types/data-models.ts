export interface UserItemResponseModel {
  id: number;
  email: string;
  username: string;
  user_password: string;
  display_name: string;
  user_color: string;
  blurb: string;
  admin?: boolean;
}

export interface NamedWatchItemResponseModel extends WatchItemResponseModel {
  anime_name?: string;
}

export interface AnimeItemResponseModel {
  id: number;
  title?: string;
  blurb?: string;
  episodes?: number;
  season_id?: number;
  watched?: boolean
}

export interface AnimeItemModel extends AnimeItemResponseModel {
  image?: string;
  genres: GenreItemResponseModel[];
  studios: ProducerItemResponseModel[];
  ratings: RatingItemResponseModel[];
  reviews: ReviewItemModel[];
}

export interface UserDataModel extends UserItemResponseModel {
  ratings: RatingItemResponseModel[];
  reviews: ReviewItemResponseModel[];
  watchList: NamedWatchItemResponseModel[];
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

export interface SeasonItemResponseModel {
  id?: number;
  season_year: string;
  season_name: string;
}

export interface WatchItemResponseModel {
  user_id?: number;
  anime_id?: number;
  watch_date?: string;
}
