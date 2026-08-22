import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelGeneral } from './panel-general';

describe('PanelGeneral', () => {
  let component: PanelGeneral;
  let fixture: ComponentFixture<PanelGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelGeneral],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelGeneral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
