import { TestBed } from '@angular/core/testing';

import { EvaluationGuard } from './evaluation.guard';

describe('EvaluationGuard', () => {
  let guard: EvaluationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EvaluationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
