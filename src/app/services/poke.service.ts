import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IPokemon, IPokemonResponse } from '../models/pokemon.interface';

@Injectable({
  providedIn: 'root',
})
export class PokeService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  http = inject(HttpClient);

  getPokemonList(offset = 0, limit = 20): Observable<IPokemonResponse> {
    return this.http.get<IPokemonResponse>(this.apiUrl + '?offset=' + offset + '&limit=' + limit);
  }

  getPokemonDetails(name: string): Observable<IPokemon> {
    return this.http.get<IPokemon>(this.apiUrl + '/' + name);
  }

  saveFavorite(pokemon: IPokemon): void {
    let favs = localStorage.getItem('favorites');
    let favorites = JSON.parse(favs || '[]');
    favorites.push(pokemon);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  removeFavorite(pokemon: IPokemon): void {
    let favs = localStorage.getItem('favorites');
    if (!favs) return;
    let favorites = JSON.parse(favs);
    favorites = favorites.filter((fav: any) => fav.name !== pokemon.name);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
