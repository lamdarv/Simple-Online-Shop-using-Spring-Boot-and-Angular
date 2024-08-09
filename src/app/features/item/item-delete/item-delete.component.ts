import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'delete-item-dialog',
  templateUrl: './item-delete.component.html',
  styleUrls: ['./item-delete.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class DeleteItemDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { itemId: number }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
