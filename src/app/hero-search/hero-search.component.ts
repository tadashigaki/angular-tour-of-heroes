import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs'

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // push search term to observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms
      .pipe(
        // wait 300 ms before searching
        debounceTime(300),
        // ingore when term is same as privious one
        distinctUntilChanged(),
        // switch new search observable every new term
        switchMap((term: string) => this.heroService.searchHeroes(term)),
      );
  }

}
