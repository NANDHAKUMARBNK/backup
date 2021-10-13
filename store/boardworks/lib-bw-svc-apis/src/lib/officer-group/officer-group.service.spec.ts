import { TestBed } from '@angular/core/testing';

import { OfficerGroupService } from './officer-group.service';

describe('OfficerGroupService', () => {
  let service: OfficerGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficerGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
