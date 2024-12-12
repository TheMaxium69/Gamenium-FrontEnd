import { TestBed } from '@angular/core/testing';

import { UserdefaultService } from './userdefault.service';

describe('UserdefaultService', () => {
  let service: UserdefaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserdefaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
