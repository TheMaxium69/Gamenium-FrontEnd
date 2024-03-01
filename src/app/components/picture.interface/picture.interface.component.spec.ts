import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureInterfaceComponent } from './picture.interface.component';

describe('PictureInterfaceComponent', () => {
  let component: PictureInterfaceComponent;
  let fixture: ComponentFixture<PictureInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PictureInterfaceComponent]
    });
    fixture = TestBed.createComponent(PictureInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
