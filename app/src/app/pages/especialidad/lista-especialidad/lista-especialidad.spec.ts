import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEspecialidad } from './lista-especialidad';

describe('ListaEspecialidad', () => {
  let component: ListaEspecialidad;
  let fixture: ComponentFixture<ListaEspecialidad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEspecialidad],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaEspecialidad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
