import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageThermeComponent } from './page-therme.component';

describe('PageThermeComponent', () => {
  let component: PageThermeComponent;
  let fixture: ComponentFixture<PageThermeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageThermeComponent]
    });
    fixture = TestBed.createComponent(PageThermeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
