import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RamonsiddhaComponent } from './ramonsiddha.component';

describe('RamonsiddhaComponent', () => {
  let component: RamonsiddhaComponent;
  let fixture: ComponentFixture<RamonsiddhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RamonsiddhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RamonsiddhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
