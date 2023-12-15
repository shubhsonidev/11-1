import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayemiMobComponent } from './payemi-mob.component';

describe('PayemiMobComponent', () => {
  let component: PayemiMobComponent;
  let fixture: ComponentFixture<PayemiMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayemiMobComponent]
    });
    fixture = TestBed.createComponent(PayemiMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
