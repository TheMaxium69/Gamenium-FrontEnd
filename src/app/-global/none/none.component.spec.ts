import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoneComponent } from './none.component';

describe('NoneComponent', () => {
  let component: NoneComponent;
  let fixture: ComponentFixture<NoneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoneComponent]
    });
    fixture = TestBed.createComponent(NoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
