import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorgraphdivergentComponent } from './doctorgraphdivergent.component';

describe('DoctorgraphdivergentComponent', () => {
  let component: DoctorgraphdivergentComponent;
  let fixture: ComponentFixture<DoctorgraphdivergentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorgraphdivergentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorgraphdivergentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
