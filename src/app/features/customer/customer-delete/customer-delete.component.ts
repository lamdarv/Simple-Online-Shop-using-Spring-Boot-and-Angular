import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'delete-customer-dialog',
  templateUrl: './customer-delete.component.html',
  styleUrls: ['./customer-delete.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class DeleteCustomerDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteCustomerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { customerId: number }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
