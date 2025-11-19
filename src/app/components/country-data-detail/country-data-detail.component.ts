import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OlympicCountry } from '../../core/models/Olympic';
import { TitleComponent } from '../title/title.component';
import { CardComponent } from '../card/card.component';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { ParticipationToAreaChartPipe } from '../../core/pipes/participation-to-area-chart.pipe';

@Component({
  selector: 'app-country-data-detail',
  standalone: true,
  imports: [
    CommonModule,
    TitleComponent,
    CardComponent,
    AreaChartComponent,
    ParticipationToAreaChartPipe,
  ],
  templateUrl: './country-data-detail.component.html',
  styleUrl: './country-data-detail.component.scss',
})
export class CountryDataDetailComponent {
  @Input() set country(value: OlympicCountry | null | undefined) {
    if (value) {
      this._country = value;
      this.prepareData(value);
    }
  }
  get country(): OlympicCountry | null | undefined {
    return this._country;
  }

  private _country: OlympicCountry | null | undefined = null;
  totalMedals?: number;
  totalAthletes?: number;
  numberOfEntries?: number;

  private prepareData(country: OlympicCountry): void {
    if (!country) {
      this.totalAthletes = undefined;
      return;
    }
    this.getTotalMedals(country);
    this.getTotalAthletes(country);
    this.getNumberOfEntries(country);
  }

  private getTotalMedals(country: OlympicCountry): void {
    this.totalMedals = country.participations.reduce(
      (sum, p) => sum + p.medalsCount,
      0
    );
  }

  private getTotalAthletes(country: OlympicCountry): void {
    this.totalAthletes = country.participations.reduce(
      (sum, p) => sum + p.athleteCount,
      0
    );
  }

  private getNumberOfEntries(country: OlympicCountry): void {
    this.numberOfEntries = country?.participations.length || 0;
  }
}
