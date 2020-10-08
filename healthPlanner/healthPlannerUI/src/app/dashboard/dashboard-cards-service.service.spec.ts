import { TestBed } from '@angular/core/testing';

import { DashboardCardsServiceService } from './dashboard-cards-service.service';

describe('DashboardCardsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardCardsServiceService = TestBed.get(DashboardCardsServiceService);
    expect(service).toBeTruthy();
  });
});
