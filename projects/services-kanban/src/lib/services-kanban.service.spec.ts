import { TestBed } from '@angular/core/testing';

import { ServicesKanbanService } from './services-kanban.service';

describe('ServicesKanbanService', () => {
  let service: ServicesKanbanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesKanbanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
