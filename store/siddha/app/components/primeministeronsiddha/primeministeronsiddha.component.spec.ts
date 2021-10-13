import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeministeronsiddhaComponent } from './primeministeronsiddha.component';

describe('PrimeministeronsiddhaComponent', () => {
  let component: PrimeministeronsiddhaComponent;
  let fixture: ComponentFixture<PrimeministeronsiddhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimeministeronsiddhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeministeronsiddhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
