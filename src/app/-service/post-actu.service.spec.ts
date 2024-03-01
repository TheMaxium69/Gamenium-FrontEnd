import { TestBed } from '@angular/core/testing';

import { PostActuService } from './post-actu.service';

describe('PostActuService', () => {
  let service: PostActuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostActuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
