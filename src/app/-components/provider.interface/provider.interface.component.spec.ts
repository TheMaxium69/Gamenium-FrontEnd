import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderInterfaceComponent } from './provider.interface.component';

describe('ProviderInterfaceComponent', () => {
  let component: ProviderInterfaceComponent;
  let fixture: ComponentFixture<ProviderInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderInterfaceComponent]
    });
    fixture = TestBed.createComponent(ProviderInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
