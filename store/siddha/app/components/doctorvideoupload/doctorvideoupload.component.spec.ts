import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorvideouploadComponent } from './doctorvideoupload.component';

describe('DoctorvideouploadComponent', () => {
  let component: DoctorvideouploadComponent;
  let fixture: ComponentFixture<DoctorvideouploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorvideouploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorvideouploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
