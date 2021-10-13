import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrjayalalithaComponent } from './drjayalalitha.component';

describe('DrjayalalithaComponent', () => {
  let component: DrjayalalithaComponent;
  let fixture: ComponentFixture<DrjayalalithaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrjayalalithaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrjayalalithaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
