import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CountryService } from '../../core/services/country.service';
import { OlympicCountry } from '../../core/models/Olympic';
import { CountryDataDetailComponent } from '../../components/country-data-detail/country-data-detail.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, CountryDataDetailComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent implements OnInit {
  country$: Observable<OlympicCountry | undefined> = of(undefined);
  countryId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private countryService: CountryService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.countryId = +id;
      this.country$ = this.countryService.getCountryById(this.countryId);
    }
  }

  goBack(): void {
    this.location.back();
  }
}
