import { TestBed } from '@angular/core/testing';

import { BuyWhereService } from './buy-where.service';

describe('BuyWhereService', () => {
  let service: BuyWhereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuyWhereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
