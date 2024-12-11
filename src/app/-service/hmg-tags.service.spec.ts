import { TestBed } from '@angular/core/testing';

import { HmgTagsService } from './hmg-tags.service';

describe('HmgTagsService', () => {
  let service: HmgTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HmgTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
