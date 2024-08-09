import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../models/item.model';
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
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'item-add-dialog',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css'],
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
  ]
})
export class ItemAddDialog {
  itemForm: FormGroup;
  isVerySmallScreen: boolean = false; // Terima kondisi isVerySmallScreen

  constructor(
    public dialogRef: MatDialogRef<ItemAddDialog>,

    private itemService: ItemService,
    private fb: FormBuilder
  ) {
    this.itemForm = this.fb.group({
      itemsName: ['', Validators.required],
      itemsCode: ['', Validators.required],
      stock: [0, Validators.required],
      price: [0, Validators.required],
      isAvailable: [false],
      lastReStock: [null, Validators.required],
      restockTime: ['00:00', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      // Create a new Date object combining the date and setting time to 00:00:00
      const lastReStockDate = new Date(`${formValue.lastReStock.toISOString().split('T')[0]}T${formValue.restockTime}:00.000Z`);
      const lastReStockISO = lastReStockDate.toISOString(); // Ensure the full ISO format with milliseconds and timezone

      const newItem: Item = {
        ...formValue,
        lastReStock: lastReStockISO // Send in full ISO format
      };

      this.itemService.createItem(newItem).subscribe((response) => {
        if (response) {
          this.dialogRef.close(response);
        }
      });
    }
  }

}

