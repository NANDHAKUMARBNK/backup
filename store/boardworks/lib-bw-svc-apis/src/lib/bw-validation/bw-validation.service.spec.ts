import { TestBed } from '@angular/core/testing';

import { BwValidationService } from './bw-validation.service';

describe('BwValidationService', () => {
  let service: BwValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BwValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
