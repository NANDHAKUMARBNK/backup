import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaSearchComponent } from './alpha-search.component';

describe('AlphaSearchComponent', () => {
  let component: AlphaSearchComponent;
  let fixture: ComponentFixture<AlphaSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlphaSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlphaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
