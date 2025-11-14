import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OlympicService } from '../../core/services/olympic.service';
import { OlympicCountry } from '../../core/models/Olympic';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TotalMedalsPipe } from '../../core/pipes/total-medals.pipe';

interface PieChartData {
  name: string;
  value: number;
  extra: {
    code: number;
  };
}

@Component({
  selector: 'app-country-data',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, TotalMedalsPipe],
  templateUrl: './country-data.component.html',
  styleUrl: './country-data.component.scss',
})
export class CountryDataComponent implements OnInit {
  olympicData: OlympicCountry[] | null = null;
  pieChartData: PieChartData[] = [];
  numberOfCountry?: number;

  // Options du pie chart
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor(
    private olympicService: OlympicService,
    private totalMedalsPipe: TotalMedalsPipe
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe({
      next: (data) => {
        this.olympicData = data;
        this.numberOfCountry = data?.length;
        this.preparePieChartData(data);
      },
      error: (error) => {
        console.error('Error fetching Olympic data:', error);
      },
    });
  }

  // Transforme les données olympiques en format pour le pie chart
  private preparePieChartData(data: OlympicCountry[] | null): void {
    if (!data) {
      this.pieChartData = [];
      return;
    }

    this.pieChartData = data.map((country) => ({
      name: country.country,
      value: this.totalMedalsPipe.transform(country.participations),
      extra: {
        code: country.id,
      },
    }));
  }

  onSelect(event: any): void {
    console.log('Pays sélectionné:', event);
  }
}
