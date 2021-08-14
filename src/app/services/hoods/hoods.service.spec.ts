import { TestBed } from '@angular/core/testing';

import { HoodsService } from './hoods.service';

describe('HoodsService', () => {
  let service: HoodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HoodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
