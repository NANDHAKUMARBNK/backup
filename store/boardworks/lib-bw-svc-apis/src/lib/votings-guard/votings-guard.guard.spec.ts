import { TestBed } from '@angular/core/testing';

import { VotingsGuardGuard } from './votings-guard.guard';

describe('VotingsGuardGuard', () => {
  let guard: VotingsGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VotingsGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
