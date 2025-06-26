import { Component, OnInit, signal } from '@angular/core';
import { PokeService } from '../../services/poke.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
})
export class PokemonListComponent implements OnInit {
  pokemonList = signal<any[]>([]);
  searchQuery = '';
  currentPage = signal(0);
  totalPages = signal(0);
  private readonly limit = 20;

  constructor(protected pokeService: PokeService) { }

  ngOnInit(): void {
    this.loadPokemon(this.currentPage());
  }

  protected getRouterLink(name: string): string {
    return `/${name}`;
  }

  loadPokemon(page: number): void {
    const offset = page * this.limit;
    this.pokeService.getPokemonList(offset, this.limit).subscribe({
      next: (data) => {
        this.pokemonList.set(data.results);
        this.currentPage.set(page);
        this.totalPages.set(Math.ceil(data.count / this.limit));
      },
      error: (err) => console.error('Failed to load Pokémon', err),
    });
  }

  public getFavs() {
    const favs = localStorage.getItem('favorites');
    if (!favs) return [];
    return JSON.parse(favs);
  }

  searchPokemon(): void {
    if (this.searchQuery.trim()) {
      this.pokeService
        .getPokemonDetails(this.searchQuery.toLowerCase())
        .subscribe({
          next: (pokemon) => {
            this.pokemonList.set([pokemon]);
          },
          error: (err) => console.error('Failed to search Pokémon', err),
        });
    }
  }

  goToNextPage(): void {
    this.loadPokemon(this.currentPage() + 1);
  }

  goToPrevPage(): void {
    if (this.currentPage() > 0) {
      this.loadPokemon(this.currentPage() - 1);
    }
  }

  get pageNumber(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }
}
