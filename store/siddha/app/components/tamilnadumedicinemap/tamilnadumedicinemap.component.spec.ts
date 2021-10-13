import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TamilnadumedicinemapComponent } from './tamilnadumedicinemap.component';

describe('TamilnadumedicinemapComponent', () => {
  let component: TamilnadumedicinemapComponent;
  let fixture: ComponentFixture<TamilnadumedicinemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TamilnadumedicinemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TamilnadumedicinemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
