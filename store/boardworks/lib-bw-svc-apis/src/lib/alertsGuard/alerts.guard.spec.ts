import { TestBed } from '@angular/core/testing';

import { AlertsGuard } from './alerts.guard';

describe('AlertsGuard', () => {
  let guard: AlertsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AlertsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
