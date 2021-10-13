import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphpopulationComponent } from './graphpopulation.component';

describe('GraphpopulationComponent', () => {
  let component: GraphpopulationComponent;
  let fixture: ComponentFixture<GraphpopulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphpopulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphpopulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
