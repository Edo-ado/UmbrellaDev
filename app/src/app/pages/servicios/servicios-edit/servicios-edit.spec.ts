import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosEdit } from './servicios-edit';

describe('ServiciosEdit', () => {
  let component: ServiciosEdit;
  let fixture: ComponentFixture<ServiciosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
