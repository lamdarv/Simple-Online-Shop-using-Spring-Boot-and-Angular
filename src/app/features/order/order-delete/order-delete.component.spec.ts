import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDeleteComponent } from './order-delete.component';

describe('OrderDeleteComponent', () => {
  let component: OrderDeleteComponent;
  let fixture: ComponentFixture<OrderDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
