import { TestBed } from '@angular/core/testing';

import { OnboardingService } from './onboarding.service';

describe('RepositoryService', () => {
  let service: OnboardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
