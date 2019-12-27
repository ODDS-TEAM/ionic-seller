import { TestBed } from '@angular/core/testing';

import { WeekMenusService } from './week-menus.service';

describe('TableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeekMenusService = TestBed.get(WeekMenusService);
    expect(service).toBeTruthy();
  });
});
