import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesKanbanComponent } from './services-kanban.component';

describe('ServicesKanbanComponent', () => {
  let component: ServicesKanbanComponent;
  let fixture: ComponentFixture<ServicesKanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicesKanbanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
