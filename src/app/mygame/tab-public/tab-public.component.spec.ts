import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPublicComponent } from './tab-public.component';

describe('TabPublicComponent', () => {
  let component: TabPublicComponent;
  let fixture: ComponentFixture<TabPublicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabPublicComponent]
    });
    fixture = TestBed.createComponent(TabPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
