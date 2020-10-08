import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CovidListComponent } from './covid-list.component';

describe('covid-listComponent', () => {
  let component: CovidListComponent;
  let fixture: ComponentFixture<CovidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CovidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CovidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
