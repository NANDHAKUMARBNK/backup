import { TestBed } from '@angular/core/testing';

import { VotingsServiceService } from './votings-service.service';

describe('VotingsServiceService', () => {
  let service: VotingsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotingsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
