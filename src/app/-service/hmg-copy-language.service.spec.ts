import { TestBed } from '@angular/core/testing';

import { HmgCopyLanguageService } from './hmg-copy-language.service';

describe('HmgCopyLanguageService', () => {
  let service: HmgCopyLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HmgCopyLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
