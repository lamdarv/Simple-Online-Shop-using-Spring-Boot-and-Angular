import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditDialog } from './order-edit.component';

describe('OrderEditDialog', () => {
  let component: OrderEditDialog;
  let fixture: ComponentFixture<OrderEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
