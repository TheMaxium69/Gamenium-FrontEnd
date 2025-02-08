import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMyplatformComponent } from './view-myplatform.component';

describe('ViewMyplatformComponent', () => {
  let component: ViewMyplatformComponent;
  let fixture: ComponentFixture<ViewMyplatformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewMyplatformComponent]
    });
    fixture = TestBed.createComponent(ViewMyplatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
