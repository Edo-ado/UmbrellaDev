import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalesDetalle } from './profesionales-detalle';

describe('ProfesionalesDetalle', () => {
  let component: ProfesionalesDetalle;
  let fixture: ComponentFixture<ProfesionalesDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalesDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionalesDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
