export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: Pokemon[];
}
