import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamilnadudistrictmapComponent } from './tamilnadudistrictmap.component';

describe('TamilnadudistrictmapComponent', () => {
  let component: TamilnadudistrictmapComponent;
  let fixture: ComponentFixture<TamilnadudistrictmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamilnadudistrictmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamilnadudistrictmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
