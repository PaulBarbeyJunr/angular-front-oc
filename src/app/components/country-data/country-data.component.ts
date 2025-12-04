import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from '../../core/services/olympic.service';
import { OlympicCountry } from '../../core/models/Olympic';
import { TotalMedalsPipe } from '../../core/pipes/total-medals.pipe';
import { TotalNumberOfJosPipe } from '../../core/pipes/total-number_of-jos';
import {
  PieChartComponent,
  PieChartData,
} from '../pie-charts/pie-chart.component';
import { CardComponent } from '../card/card.component';
import { TitleComponent } from '../title/title.component';

@Component({
  selector: 'app-country-data',
  standalone: true,
  imports: [
    CommonModule,
    TotalMedalsPipe,
    TotalNumberOfJosPipe,
    PieChartComponent,
    CardComponent,
    TitleComponent,
  ],
  templateUrl: './country-data.component.html',
  styleUrl: './country-data.component.scss',
})
export class CountryDataComponent implements OnInit, OnDestroy {
  olympicData: OlympicCountry[] | null = null;
  numberOfCountry?: number;
  numberOfJos?: number;
  pieChartData: PieChartData[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private totalMedalsPipe: TotalMedalsPipe,
    private totalNumberOfJosPipe: TotalNumberOfJosPipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService
      .getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.olympicData = data;
          this.prepareData(data);
          this.preparePieChartData(data);
        },
        error: (error) => {
          console.error('Error fetching Olympic data:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private prepareData(data: OlympicCountry[] | null): void {
    if (!data) {
      return;
    }
    this.numberOfCountry = data.length;
    this.numberOfJos = this.totalNumberOfJosPipe.transform(data).length;
  }

  private preparePieChartData(data: OlympicCountry[] | null): void {
    if (!data) {
      this.pieChartData = [];
      return;
    }

    this.pieChartData = data.map((country) => ({
      label: country.country,
      value: this.totalMedalsPipe.transform(country.participations),
      id: country.id,
    }));
  }

  onCountryClick(countryId: number): void {
    this.router.navigate(['/detail', countryId]);
  }
}
