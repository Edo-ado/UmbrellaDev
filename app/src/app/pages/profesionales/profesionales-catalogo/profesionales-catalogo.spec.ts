import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalesCatalogo } from './profesionales-catalogo';

describe('ProfesionalesCatalogo', () => {
  let component: ProfesionalesCatalogo;
  let fixture: ComponentFixture<ProfesionalesCatalogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfesionalesCatalogo],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfesionalesCatalogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
