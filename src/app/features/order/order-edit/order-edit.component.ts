import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css'
})
export class OrderEditDialog implements OnInit {
  orderForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<OrderEditDialog>,
    private orderService: OrderService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number }
  ) {
    this.orderForm = this.fb.group({
      quantity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.orderService.getOrderById(this.data.orderId).subscribe((response) => {
      this.orderForm.patchValue(response.data);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const updatedOrder: Order = this.orderForm.value;

      this.orderService.updateOrder(this.data.orderId, updatedOrder).subscribe({
        next: (response) => {
          if (response) {
            this.dialogRef.close(response);
          }
        },
        error: (error) => {
          console.error('Error updating order:', error);
        }
      });
    }
  }
}
