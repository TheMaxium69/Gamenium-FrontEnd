import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMygameComponent } from './page-mygame.component';

describe('PageMygameComponent', () => {
  let component: PageMygameComponent;
  let fixture: ComponentFixture<PageMygameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageMygameComponent]
    });
    fixture = TestBed.createComponent(PageMygameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
