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
  reviews: ReviewItemResponseModel[];
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