import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteOrderDialog } from './order-delete.component';

describe('DeleteOrderDialog', () => {
  let component: DeleteOrderDialog;
  let fixture: ComponentFixture<DeleteOrderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteOrderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteOrderDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
