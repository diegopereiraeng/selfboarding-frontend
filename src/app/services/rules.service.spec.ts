import { TestBed } from '@angular/core/testing';

import { RulesService } from './rules.service';

describe('RepositoryService', () => {
  let service: RulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
