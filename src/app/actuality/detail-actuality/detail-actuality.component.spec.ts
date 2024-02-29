import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailActualityComponent } from './detail-actuality.component';

describe('DetailActualityComponent', () => {
  let component: DetailActualityComponent;
  let fixture: ComponentFixture<DetailActualityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailActualityComponent]
    });
    fixture = TestBed.createComponent(DetailActualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
