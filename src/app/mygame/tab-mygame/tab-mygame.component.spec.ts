import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMygameComponent } from './tab-mygame.component';

describe('TabMygameComponent', () => {
  let component: TabMygameComponent;
  let fixture: ComponentFixture<TabMygameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabMygameComponent]
    });
    fixture = TestBed.createComponent(TabMygameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
