import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ItemService } from '../../../core/services/item.service';
import { Router } from '@angular/router';
import { Customer } from '../../../models/customer.model';
import { Item } from '../../../models/item.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'order-add-dialog',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSnackBarModule
  ]
})
export class OrderCreateComponent implements OnInit {
  orderForm!: FormGroup;
  customers: Customer[] = [];
  items: Item[] = [];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private customerService: CustomerService,
    private itemService: ItemService,
    private router: Router,
    public dialogRef: MatDialogRef<OrderCreateComponent>,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // Initialize the form
    this.orderForm = this.fb.group({
      customerId: [null, Validators.required],
      itemsId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    // Load customers and items
    this.loadCustomers();
    this.loadItems();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customers = response.data;
      },
      error: (error) => {
        console.error('Failed to load customers', error);
      }
    });
  }

  loadItems(): void {
    this.itemService.getItems().subscribe({
      next: (response) => {
        this.items = response.data;
      },
      error: (error) => {
        console.error('Failed to load items', error);
      }
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      console.log('Form is valid:', this.orderForm.value);
      const { customerId, itemsId, quantity } = this.orderForm.value;

      this.orderService.createOrder(customerId, itemsId, quantity).subscribe({
        next: (response) => {
          console.log('Order created successfully', response);

          // Tampilkan alert ketika order berhasil dibuat
          this.snackBar.open('Order created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.dialogRef.close(response.data);
        },
        error: (error) => {
          console.error('Error creating order', error);

          // Tampilkan alert ketika terjadi error saat membuat order
          this.snackBar.open('Error creating order. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    } else {
      console.error('Form is invalid:', this.orderForm.value);

      // Tampilkan alert jika form tidak valid
      this.snackBar.open('Form is invalid. Please fill out all required fields.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
