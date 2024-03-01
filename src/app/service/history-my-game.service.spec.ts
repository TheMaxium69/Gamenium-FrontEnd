import { TestBed } from '@angular/core/testing';

import { HistoryMyGameService } from './history-my-game.service';

describe('HistoryMyGameService', () => {
  let service: HistoryMyGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryMyGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
