import { TestBed } from '@angular/core/testing';

import { ViewFileDocService } from './view-file-doc.service';

describe('ViewFileDocService', () => {
  let service: ViewFileDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewFileDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
