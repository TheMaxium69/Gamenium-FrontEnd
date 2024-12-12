import { TestBed } from '@angular/core/testing';

import { MetacriticService } from './metacritic.service';

describe('MetacriticService', () => {
  let service: MetacriticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetacriticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
