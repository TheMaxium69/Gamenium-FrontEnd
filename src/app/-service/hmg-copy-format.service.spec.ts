import { TestBed } from '@angular/core/testing';

import { HmgCopyFormatService } from './hmg-copy-format.service';

describe('HmgCopyFormatService', () => {
  let service: HmgCopyFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HmgCopyFormatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
