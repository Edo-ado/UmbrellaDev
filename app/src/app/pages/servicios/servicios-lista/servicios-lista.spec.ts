import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosLista } from './servicios-lista';

describe('ServiciosLista', () => {
  let component: ServiciosLista;
  let fixture: ComponentFixture<ServiciosLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosLista],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
