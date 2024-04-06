import { TestBed } from '@angular/core/testing';

import { SyncfusionDataService } from './syncfusion-data.service';

describe('SyncfusionDataService', () => {
  let service: SyncfusionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncfusionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
