import { Pipe, PipeTransform } from '@angular/core';
import { Participation } from '../models/Participation';
import { AreaChartSeries } from '../../components/area-chart/area-chart.component';

@Pipe({
  name: 'participationToAreaChart',
  standalone: true,
})
export class ParticipationToAreaChartPipe implements PipeTransform {
  transform(participations: Participation[]): AreaChartSeries[] {
    if (!participations || participations.length === 0) {
      return [];
    }

    // Trier les participations par année
    const sortedParticipations = [...participations].sort(
      (a, b) => a.year - b.year
    );

    return [
      {
        name: 'Médailles',
        data: sortedParticipations.map((p) => ({
          x: p.year,
          y: p.medalsCount,
        })),
      },
    ];
  }
}
