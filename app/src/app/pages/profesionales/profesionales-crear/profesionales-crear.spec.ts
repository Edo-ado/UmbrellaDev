import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalesCrear } from './profesionales-crear';

describe('ProfesionalesCrear', () => {
  let component: ProfesionalesCrear;
  let fixture: ComponentFixture<ProfesionalesCrear>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalesCrear],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionalesCrear);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
