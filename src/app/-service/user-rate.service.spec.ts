import { TestBed } from '@angular/core/testing';

import { UserRateService } from './user-rate.service';

describe('UserRateService', () => {
  let service: UserRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
