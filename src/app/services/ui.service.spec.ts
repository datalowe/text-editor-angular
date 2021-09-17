import { TestBed } from '@angular/core/testing';

import { UiService } from './ui.service';

describe('UiService', () => {
  let service: UiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('toggles showDocList value and makes subject emit event when toggleShowDocList is called', () => {
    service.onToggleDocList().subscribe((showBool) => expect(showBool).toBeTruthy())
    service.toggleShowDocList();
  });
});
