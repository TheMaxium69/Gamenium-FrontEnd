import { TestBed } from '@angular/core/testing';

import { WarnService } from './warn.service';

describe('WarnService', () => {
  let service: WarnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
