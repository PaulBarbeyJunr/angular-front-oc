import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from '../../core/services/olympic.service';
import { OlympicCountry } from '../../core/models/Olympic';
import { CardComponent } from '../../components/card/card.component';
import { TitleComponent } from '../../components/title/title.component';

interface CountryStats {
  country: string;
  id: number;
  totalMedals: number;
  totalAthletes: number;
  participations: number;
  avgMedalsPerJO: number;
  avgAthletesPerJO: number;
  bestYear: number;
  bestYearMedals: number;
}

interface GlobalStats {
  totalCountries: number;
  totalJOs: number;
  totalMedals: number;
  totalAthletes: number;
  avgMedalsPerCountry: number;
  topCountry: string;
  topCountryMedals: number;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, TitleComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit, OnDestroy {
  globalStats: GlobalStats | null = null;
  countryStats: CountryStats[] = [];
  private destroy$ = new Subject<void>();

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService
      .getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            this.calculateStats(data);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateStats(data: OlympicCountry[]): void {
    // Stats par pays
    this.countryStats = data
      .map((country) => {
        const totalMedals = country.participations.reduce(
          (sum, p) => sum + p.medalsCount,
          0
        );
        const totalAthletes = country.participations.reduce(
          (sum, p) => sum + p.athleteCount,
          0
        );
        const bestParticipation = country.participations.reduce((best, p) =>
          p.medalsCount > best.medalsCount ? p : best
        );

        return {
          country: country.country,
          id: country.id,
          totalMedals,
          totalAthletes,
          participations: country.participations.length,
          avgMedalsPerJO: Math.round(totalMedals / country.participations.length),
          avgAthletesPerJO: Math.round(totalAthletes / country.participations.length),
          bestYear: bestParticipation.year,
          bestYearMedals: bestParticipation.medalsCount,
        };
      })
      .sort((a, b) => b.totalMedals - a.totalMedals);

    // Stats globales
    const allYears = new Set<number>();
    data.forEach((c) => c.participations.forEach((p) => allYears.add(p.year)));

    const totalMedals = this.countryStats.reduce((sum, c) => sum + c.totalMedals, 0);
    const totalAthletes = this.countryStats.reduce((sum, c) => sum + c.totalAthletes, 0);
    const topCountry = this.countryStats[0];

    this.globalStats = {
      totalCountries: data.length,
      totalJOs: allYears.size,
      totalMedals,
      totalAthletes,
      avgMedalsPerCountry: Math.round(totalMedals / data.length),
      topCountry: topCountry.country,
      topCountryMedals: topCountry.totalMedals,
    };
  }
}
