import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyWhereInterfaceComponent } from './buy-where.interface.component';

describe('BuyWhereInterfaceComponent', () => {
  let component: BuyWhereInterfaceComponent;
  let fixture: ComponentFixture<BuyWhereInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyWhereInterfaceComponent]
    });
    fixture = TestBed.createComponent(BuyWhereInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
