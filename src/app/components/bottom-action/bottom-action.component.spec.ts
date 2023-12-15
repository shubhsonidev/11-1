import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomActionComponent } from './bottom-action.component';

describe('BottomActionComponent', () => {
  let component: BottomActionComponent;
  let fixture: ComponentFixture<BottomActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BottomActionComponent]
    });
    fixture = TestBed.createComponent(BottomActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
