import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomgraphComponent } from './customgraph.component';

describe('CustomgraphComponent', () => {
  let component: CustomgraphComponent;
  let fixture: ComponentFixture<CustomgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
