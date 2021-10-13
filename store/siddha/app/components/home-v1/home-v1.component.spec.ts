import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeV1Component } from './home-v1.component';

describe('HomeV1Component', () => {
  let component: HomeV1Component;
  let fixture: ComponentFixture<HomeV1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeV1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
