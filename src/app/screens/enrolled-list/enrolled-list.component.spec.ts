import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrolledListComponent } from './enrolled-list.component';

describe('EnrolledListComponent', () => {
  let component: EnrolledListComponent;
  let fixture: ComponentFixture<EnrolledListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnrolledListComponent]
    });
    fixture = TestBed.createComponent(EnrolledListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
