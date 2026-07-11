import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosDetail } from './servicios-detail';

describe('ServiciosDetail', () => {
  let component: ServiciosDetail;
  let fixture: ComponentFixture<ServiciosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
