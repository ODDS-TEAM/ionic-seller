import { TestBed } from '@angular/core/testing';

import { ActivityBadgeService } from './event.service';

describe('ActivityBadgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActivityBadgeService = TestBed.get(ActivityBadgeService);
    expect(service).toBeTruthy();
  });
});
