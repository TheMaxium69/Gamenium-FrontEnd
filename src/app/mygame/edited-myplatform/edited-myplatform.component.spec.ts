import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedMyplatformComponent } from './edited-myplatform.component';

describe('EditedMyplatformComponent', () => {
  let component: EditedMyplatformComponent;
  let fixture: ComponentFixture<EditedMyplatformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditedMyplatformComponent]
    });
    fixture = TestBed.createComponent(EditedMyplatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
