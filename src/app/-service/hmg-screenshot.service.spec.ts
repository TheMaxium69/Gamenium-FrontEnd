import { TestBed } from '@angular/core/testing';

import { HmgScreenshotService } from './hmg-screenshot.service';

describe('HmgScreenshotService', () => {
  let service: HmgScreenshotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HmgScreenshotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
