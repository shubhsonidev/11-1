import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectYearComponent } from './select-year.component';

describe('SelectYearComponent', () => {
  let component: SelectYearComponent;
  let fixture: ComponentFixture<SelectYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectYearComponent]
    });
    fixture = TestBed.createComponent(SelectYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
