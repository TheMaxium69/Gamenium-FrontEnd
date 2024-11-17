import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedMygameComponent } from './edited-mygame.component';

describe('EditedMygameComponent', () => {
  let component: EditedMygameComponent;
  let fixture: ComponentFixture<EditedMygameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditedMygameComponent]
    });
    fixture = TestBed.createComponent(EditedMygameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
