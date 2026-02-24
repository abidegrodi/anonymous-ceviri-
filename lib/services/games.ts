import api from '../api';

// Types
export interface GamePhoto {
  photoUrl: string;
  isMain: boolean;
}

export interface CategoryType {
  id: number;
  name: string;
}

export interface GameCategory {
  id: number;
  name: string;
  categoryTypeId: number;
  categoryType: CategoryType;
}

export interface GameListItem {
  gameId: number;
  name: string;
  isFree: boolean;
  releaseDate: string;
  primaryColor: string;
  backgroundURL: string;
  completeRate: number;
  photos: GamePhoto[];
  categories: GameCategory[];
}

export interface GameDetail extends GameListItem {
  websiteURL: string;
  videoURL: string;
  metacritic: number;
  compatibleVersions: string;
  installationInstructions: string;
  dlcs: string;
  description: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GamesResponse {
  games: GameListItem[];
  pagination: Pagination;
}

export interface GamesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categories?: number | number[];
  isFree?: boolean;
  translationStatus?: 'completed' | 'in-progress' | 'all';
  sortBy?: 'releaseDate' | 'name' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Get games list with filtering, search, pagination
export async function getGames(params?: GamesQueryParams): Promise<GamesResponse> {
  const response = await api.get('/games', { params });
  return response.data.data;
}

// Get single game detail
export async function getGameDetail(gameId: number): Promise<GameDetail> {
  const response = await api.get(`/games/${gameId}`);
  return response.data.data;
}
