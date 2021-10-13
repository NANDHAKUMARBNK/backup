import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MgronsiddhaComponent } from './mgronsiddha.component';

describe('MgronsiddhaComponent', () => {
  let component: MgronsiddhaComponent;
  let fixture: ComponentFixture<MgronsiddhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MgronsiddhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MgronsiddhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
