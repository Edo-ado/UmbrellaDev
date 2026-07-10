import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalesEditar } from './profesionales-editar';

describe('ProfesionalesEditar', () => {
  let component: ProfesionalesEditar;
  let fixture: ComponentFixture<ProfesionalesEditar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalesEditar],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionalesEditar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
