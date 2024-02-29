import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageActualityComponent } from './page-actuality.component';

describe('PageActualityComponent', () => {
  let component: PageActualityComponent;
  let fixture: ComponentFixture<PageActualityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageActualityComponent]
    });
    fixture = TestBed.createComponent(PageActualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
