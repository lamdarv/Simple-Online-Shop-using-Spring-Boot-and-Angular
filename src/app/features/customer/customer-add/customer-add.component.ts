import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'customer-add-dialog',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css'],
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
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
  ]
})
export class CustomerAddDialog {
  customerForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<CustomerAddDialog>,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile); // Read the file to create a base64 string
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const newCustomer: Customer = this.customerForm.value;
      this.customerService.createCustomer(newCustomer, this.selectedFile || undefined).subscribe({
        next: (response) => {
          if (response) {
            this.snackBar.open('Customer added successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.dialogRef.close(response);
          }
        },
        error: () => {
          this.snackBar.open('Error adding customer. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

}
