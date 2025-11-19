import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexStroke,
  ApexGrid,
  ApexTooltip,
  ApexFill,
} from 'ng-apexcharts';

export interface AreaChartDataPoint {
  x: number | string;
  y: number;
}

export interface AreaChartSeries {
  name: string;
  data: AreaChartDataPoint[];
}

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  fill: ApexFill;
  colors: string[];
};

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss',
})
export class AreaChartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() series: AreaChartSeries[] = [];
  @Input() height: number = 350;
  @Input() xAxisTitle: string = '';
  @Input() yAxisTitle: string = '';
  @Input() colors: string[] = ['#956065', '#793D52', '#89A1DB'];

  chartOptions!: Partial<AreaChartOptions>;

  constructor() {
    this.initChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] && this.series.length > 0) {
      this.updateChartData();
    }
  }

  private initChartOptions(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'area',
        height: this.height,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        type: 'category',
        title: {
          text: this.xAxisTitle,
        },
      },
      yaxis: {
        title: {
          text: this.yAxisTitle,
        },
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
      },
      colors: this.colors,
    };
  }

  private updateChartData(): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: this.series,
      chart: {
        type: 'area',
        height: this.height,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        type: 'category',
        title: {
          text: this.xAxisTitle,
        },
      },
      yaxis: {
        title: {
          text: this.yAxisTitle,
        },
      },
      colors: this.colors,
    };
  }
}
