import { TestBed } from '@angular/core/testing';

import { LinksGuard } from './links.guard';

describe('LinksGuard', () => {
  let guard: LinksGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LinksGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
