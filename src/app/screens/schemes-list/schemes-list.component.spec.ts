import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemesListComponent } from './schemes-list.component';

describe('SchemesListComponent', () => {
  let component: SchemesListComponent;
  let fixture: ComponentFixture<SchemesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchemesListComponent]
    });
    fixture = TestBed.createComponent(SchemesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
