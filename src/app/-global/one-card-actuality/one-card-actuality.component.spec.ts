import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneCardActualityComponent } from './one-card-actuality.component';

describe('OneCardActualityComponent', () => {
  let component: OneCardActualityComponent;
  let fixture: ComponentFixture<OneCardActualityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneCardActualityComponent]
    });
    fixture = TestBed.createComponent(OneCardActualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
