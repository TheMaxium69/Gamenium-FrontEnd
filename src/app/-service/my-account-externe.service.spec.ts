import { TestBed } from '@angular/core/testing';

import { MyAccountExterneService } from './my-account-externe.service';

describe('MyAccountExterneService', () => {
  let service: MyAccountExterneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAccountExterneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
