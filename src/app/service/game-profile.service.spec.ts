import { TestBed } from '@angular/core/testing';

import { GameProfileService } from './game-profile.service';

describe('GameProfileService', () => {
  let service: GameProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
