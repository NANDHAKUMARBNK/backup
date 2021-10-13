import { TestBed } from '@angular/core/testing';

import { CollaborationGuard } from './collaboration.guard';

describe('CollaborationGuard', () => {
  let guard: CollaborationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CollaborationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
