import { TestBed } from '@angular/core/testing';

import { BadgeVersUserService } from './badge-vers-user.service';

describe('BadgeVersUserService', () => {
  let service: BadgeVersUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BadgeVersUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
