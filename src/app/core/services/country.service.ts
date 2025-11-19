import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { OlympicCountry } from '../models/Olympic';
import { OlympicService } from './olympic.service';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private olympicService: OlympicService) {}

  /**
   * Get country details by ID
   * @param id - The country ID
   * @returns Observable of OlympicCountry or undefined if not found
   */
  getCountryById(id: number): Observable<OlympicCountry | undefined> {
    return this.olympicService.getOlympics().pipe(
      map((countries) => {
        if (!countries) {
          return undefined;
        }
        return countries.find((country) => country.id === id);
      })
    );
  }

  /**
   * Get country details by name
   * @param name - The country name
   * @returns Observable of OlympicCountry or undefined if not found
   */
  getCountryByName(name: string): Observable<OlympicCountry | undefined> {
    return this.olympicService.getOlympics().pipe(
      map((countries) => {
        if (!countries) {
          return undefined;
        }
        return countries.find(
          (country) => country.country.toLowerCase() === name.toLowerCase()
        );
      })
    );
  }
}
