import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../models/customer.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'customer-edit-dialog',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
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
  ]
})
export class CustomerEditDialog implements OnInit {
  customerForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<CustomerEditDialog>,
    private customerService: CustomerService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { customerId: number }
  ) {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      customerAddress: ['', Validators.required],
      customerCode: ['', Validators.required],
      customerPhone: ['', Validators.required],
      isActive: [false],
      lastOrderDate: [null],
      pic: [null]
    });
  }

  ngOnInit(): void {
    this.customerService.getCustomerById(this.data.customerId).subscribe((response) => {
      this.customerForm.patchValue(response.data);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const updatedCustomer: Customer = this.customerForm.value;
  
      this.customerService.updateCustomer(this.data.customerId, updatedCustomer, this.selectedFile || undefined).subscribe({
        next: (response) => {
          if (response) {
            this.dialogRef.close(response);
          }
        },
        error: (error) => {
          console.error('Error updating customer:', error);
        }
      });
    }
  }
}