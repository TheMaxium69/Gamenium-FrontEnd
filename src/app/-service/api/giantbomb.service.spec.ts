import { TestBed } from '@angular/core/testing';

import { GiantbombService } from './giantbomb.service';

describe('GiantbombService', () => {
  let service: GiantbombService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiantbombService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
