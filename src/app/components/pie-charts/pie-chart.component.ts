import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

export interface PieChartData {
  label: string;
  value: number;
  id?: number;
}

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss',
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  @Input() data: PieChartData[] = [];
  @Input() height: number = 400;
  @Input() tooltipSuffix: string = '';
  @Input() tooltipBackground: string = '#04838f';
  @Input() tooltipTextColor: string = '#ffffff';
  @Output() sliceClick = new EventEmitter<number>();

  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null =
    null;
  private colors = ['#956065', '#793D52', '#89A1DB', '#9780A1', '#BFE0F1'];
  private initialized = false;

  ngAfterViewInit(): void {
    this.initialized = true;
    if (this.data.length > 0) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length > 0 && this.initialized) {
      this.createChart();
    }
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('*').remove();

    const width = element.offsetWidth || 600;
    const height = this.height;
    const radius = Math.min(width, height) / 2 - 80;

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = this.svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<PieChartData>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius);

    const outerArc = d3
      .arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(this.data.map((d) => d.label))
      .range(this.colors);

    const tooltip = d3
      .select(element)
      .append('div')
      .attr('class', 'pie-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', this.tooltipBackground)
      .style('color', this.tooltipTextColor)
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '14px')
      .style('text-align', 'center')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    const arcs = g
      .selectAll('.arc')
      .data(pie(this.data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => colorScale(d.data.label))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', (_, d) => {
        const suffix = this.tooltipSuffix ? ' ' + this.tooltipSuffix : '';
        tooltip
          .html(
            `<strong>${d.data.label}</strong><br/>
            <span style="display: inline-flex; align-items: center;">
              <img src="assets/icons/medal-white.svg" alt="medal" style="width: 16px; height: 16px; margin-right: 4px;" />
              ${d.data.value}${suffix}
            </span>`
          )
          .style('visibility', 'visible');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', event.offsetY - 10 + 'px')
          .style('left', event.offsetX + 10 + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      })
      .on('click', (_, d) => {
        if (d.data.id !== undefined) {
          this.sliceClick.emit(d.data.id);
        }
      });

    g.selectAll('.polyline')
      .data(pie(this.data))
      .enter()
      .append('polyline')
      .attr('class', 'polyline')
      .attr('stroke', '#333')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('points', (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const posA: [number, number] = [
          Math.sin(midAngle) * (radius + 5),
          -Math.cos(midAngle) * (radius + 5),
        ];
        const posB = outerArc.centroid(d);
        const posC: [number, number] = [
          radius * 1.25 * (midAngle < Math.PI ? 1 : -1),
          posB[1],
        ];
        return [posA, posB, posC].map((p) => p.join(',')).join(' ');
      });

    g.selectAll('.label')
      .data(pie(this.data))
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('transform', (d) => {
        const pos = outerArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 1.3 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('text-anchor', (d) => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? 'start' : 'end';
      })
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .style('fill', '#333')
      .text((d) => d.data.label);
  }
}
