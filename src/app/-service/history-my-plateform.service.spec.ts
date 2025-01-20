import { TestBed } from '@angular/core/testing';

import { HistoryMyPlateformService } from './history-my-plateform.service';

describe('HistoryMyPlateformService', () => {
  let service: HistoryMyPlateformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryMyPlateformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
