import { TestBed } from '@angular/core/testing';

import { HmgCopyRegionService } from './hmg-copy-region.service';

describe('HmgCopyRegionService', () => {
  let service: HmgCopyRegionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HmgCopyRegionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
