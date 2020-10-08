import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUpdateComponent } from './patient-update.component';

describe('PatientCreateComponent', () => {
  let component: PatientUpdateComponent;
  let fixture: ComponentFixture<PatientUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
