import { Pipe, PipeTransform, Injectable } from '@angular/core';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'totalMedals',
  standalone: true
})
export class TotalMedalsPipe implements PipeTransform {
  /**
   * Calcule le nombre total de médailles à partir d'un tableau de participations
   * @param participations - Tableau des participations olympiques
   * @returns Le nombre total de médailles
   */
  transform(participations: Participation[] | null): number {
    if (!participations || participations.length === 0) {
      return 0;
    }

    return participations.reduce((total, participation) => {
      return total + participation.medalsCount;
    }, 0);
  }
}
