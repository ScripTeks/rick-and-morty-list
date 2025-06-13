// types.ts
export interface Character {
  id: number;
  name: string;
  species: string;
  status: 'Alive' | 'Dead' | 'unknown';
  image: string;
}

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}
export interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;

};