import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexTooltip,
  ApexPlotOptions,
  ApexDataLabels,
} from 'ng-apexcharts';

export interface PieChartData {
  label: string;
  value: number;
  id?: number;
}

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
};

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements OnChanges {
  @ViewChild('chart') chart!: ChartComponent;

  @Input() data: PieChartData[] = [];
  @Input() height: number = 400;
  @Input() tooltipSuffix: string = '';
  @Input() tooltipBackground: string = '#00b8db';
  @Input() tooltipTextColor: string = '#ffffff';
  @Output() sliceClick = new EventEmitter<number>();

  chartOptions!: Partial<ChartOptions>;

  constructor() {
    this.initChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length > 0) {
      this.updateChartData();
    }
  }

  private initChartOptions(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'pie',
        height: this.height,
        events: {
          dataPointSelection: (_event, _chartContext, config) => {
            const selectedIndex = config.dataPointIndex;
            const selectedData = this.data[selectedIndex];
            if (selectedData && selectedData.id !== undefined) {
              this.sliceClick.emit(selectedData.id);
            }
          },
        },
      },
      labels: [],
      colors: ['#956065', '#793D52', '#89A1DB', '#9780A1', '#BFE0F1'],
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val.toFixed(1) + '%';
        },
      },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
      },
      tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, w }) => {
          const label = w.globals.labels[seriesIndex];
          const value = series[seriesIndex];
          const suffix = this.tooltipSuffix ? ' ' + this.tooltipSuffix : '';
          return `<div style="background: ${this.tooltipBackground}; color: ${this.tooltipTextColor}; padding: 8px 12px; border-radius: 4px; font-size: 14px; text-align: center;">
            <strong>${label}</strong><br/>
            <span style="display: inline-flex; align-items: center;"><img src="assets/icons/medal-white.svg" alt="medal" style="width: 16px; height: 16px; margin-right: 4px;" />${value}${suffix}</span>
          </div>`;
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '0%',
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  private updateChartData(): void {
    const labels = this.data.map((item) => item.label);
    const series = this.data.map((item) => item.value);

    this.chartOptions = {
      ...this.chartOptions,
      series: series,
      labels: labels,
      chart: {
        type: 'pie',
        height: this.height,
        events: {
          dataPointSelection: (_event, _chartContext, config) => {
            const selectedIndex = config.dataPointIndex;
            const selectedData = this.data[selectedIndex];
            if (selectedData && selectedData.id !== undefined) {
              this.sliceClick.emit(selectedData.id);
            }
          },
        },
      },
    };
  }
}
