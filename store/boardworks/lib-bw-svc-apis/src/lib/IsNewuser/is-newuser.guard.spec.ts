import { TestBed } from '@angular/core/testing';

import { IsNewuserGuard } from './is-newuser.guard';

describe('IsNewuserGuard', () => {
  let guard: IsNewuserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsNewuserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
