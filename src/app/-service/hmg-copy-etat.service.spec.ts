import { TestBed } from '@angular/core/testing';

import { HmgCopyEtatService } from './hmg-copy-etat.service';

describe('HmgCopyEtatService', () => {
  let service: HmgCopyEtatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HmgCopyEtatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
