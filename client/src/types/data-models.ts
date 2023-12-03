export interface AnimeItemResponseModel {
  id: number;
  title?: string;
  episodes?: number;
  season_id?: number;
}

export interface AnimeItemModel extends AnimeItemResponseModel {
  image?: string;
  genres: GenreItemResponseModel[];
  producers: ProducerItemResponseModel[];
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
