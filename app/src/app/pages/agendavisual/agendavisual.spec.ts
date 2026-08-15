import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Agendavisual } from './agendavisual';

describe('Agendavisual', () => {
  let component: Agendavisual;
  let fixture: ComponentFixture<Agendavisual>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Agendavisual],
    }).compileComponents();

    fixture = TestBed.createComponent(Agendavisual);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
