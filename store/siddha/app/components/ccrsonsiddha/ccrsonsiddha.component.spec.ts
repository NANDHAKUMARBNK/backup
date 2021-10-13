import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CcrsonsiddhaComponent } from './ccrsonsiddha.component';

describe('CcrsonsiddhaComponent', () => {
  let component: CcrsonsiddhaComponent;
  let fixture: ComponentFixture<CcrsonsiddhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CcrsonsiddhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CcrsonsiddhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
