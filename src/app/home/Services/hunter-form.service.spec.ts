import { TestBed } from '@angular/core/testing';

import { HunterFormService } from './hunter-form.service';

describe('HunterFormService', () => {
  let service: HunterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HunterFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
