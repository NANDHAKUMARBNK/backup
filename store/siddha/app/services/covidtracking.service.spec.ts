import { TestBed } from '@angular/core/testing';

import { CovidtrackingService } from './covidtracking.service';

describe('CovidtrackingService', () => {
  let service: CovidtrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CovidtrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
