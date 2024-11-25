import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateformViewComponent } from './plateform-view.component';

describe('PlateformViewComponent', () => {
  let component: PlateformViewComponent;
  let fixture: ComponentFixture<PlateformViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlateformViewComponent]
    });
    fixture = TestBed.createComponent(PlateformViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
