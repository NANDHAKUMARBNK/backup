import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetoonsiddhaComponent } from './retoonsiddha.component';

describe('RetoonsiddhaComponent', () => {
  let component: RetoonsiddhaComponent;
  let fixture: ComponentFixture<RetoonsiddhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetoonsiddhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetoonsiddhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
