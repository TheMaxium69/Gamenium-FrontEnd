import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMygameComponent } from './view-mygame.component';

describe('ViewMygameComponent', () => {
  let component: ViewMygameComponent;
  let fixture: ComponentFixture<ViewMygameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMygameComponent]
    });
    fixture = TestBed.createComponent(ViewMygameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
