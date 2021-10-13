import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BwControlErrorMessageComponent } from './bw-control-error-message.component';

describe('BwControlErrorMessageComponent', () => {
  let component: BwControlErrorMessageComponent;
  let fixture: ComponentFixture<BwControlErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BwControlErrorMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BwControlErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
