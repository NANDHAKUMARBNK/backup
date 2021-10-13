import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombographComponent } from './combograph.component';

describe('CombographComponent', () => {
  let component: CombographComponent;
  let fixture: ComponentFixture<CombographComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombographComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
