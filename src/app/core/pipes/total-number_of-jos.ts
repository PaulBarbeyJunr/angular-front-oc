import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'totalNumberOfJos',
  standalone: true
})
export class TotalNumberOfJosPipe implements PipeTransform {
  /**
   * Collecte toutes les années uniques des JO de tous les pays
   * et retourne un tableau trié
   * @param countries - Tableau des pays olympiques
   * @returns Un tableau d'années triées par ordre croissant
   */
  transform(countries: OlympicCountry[] | null): number[] {
    if (!countries || countries.length === 0) {
      return [];
    }

    // Set pour stocker les années uniques
    const uniqueYears = new Set<number>();

    // Parcourir tous les pays
    countries.forEach(country => {
      // Parcourir toutes les participations de chaque pays
      if (country.participations && country.participations.length > 0) {
        country.participations.forEach(participation => {
          // Ajouter l'année au Set (les doublons sont automatiquement ignorés)
          uniqueYears.add(participation.year);
        });
      }
    });

    // Convertir le Set en tableau et trier par ordre croissant
    return Array.from(uniqueYears).sort((a, b) => a - b);
  }
}
