import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

@Component({
  selector: 'item-edit-dialog',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css'],
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
export class ItemEditDialog implements OnInit {
  itemForm: FormGroup;
  selectedFile: File | null = null;
  isVerySmallScreen: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ItemEditDialog>,
    private itemService: ItemService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { itemsId: number }
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

  ngOnInit(): void {
    this.itemService.getItemById(this.data.itemsId).subscribe((response) => {
      const item = response.data;
      console.log('Received item:', item); // Log the received item to debug

      if (item && item.lastReStock) {
        const year = Number(item.lastReStock[0]);
        const month = Number(item.lastReStock[1]);
        const day = Number(item.lastReStock[2]);
        const hour = Number(item.lastReStock[3]);
        const minute = Number(item.lastReStock[4]);

        // Create a Date object from the array
        const lastReStockDate = new Date(year, month - 1, day, hour, minute);
        const restockTime = `${this.padZero(hour)}:${this.padZero(minute)}`; // Format the time properly

        this.itemForm.patchValue({
          ...item,
          lastReStock: lastReStockDate,
          restockTime: restockTime
        });
      } else {
        this.itemForm.patchValue({
          ...item,
          restockTime: '00:00'
        });
      }
    });
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  private extractTimeFromDateTime(date: Date | null): string {
    if (date && !isNaN(date.getTime())) {
      const hours = this.padToTwoDigits(date.getHours());
      const minutes = this.padToTwoDigits(date.getMinutes());
      return `${hours}:${minutes}`;
    }
    return '00:00';
  }

  private padToTwoDigits(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
        const formValue = this.itemForm.value;
        const lastReStockDate = new Date(`${formValue.lastReStock.toISOString().split('T')[0]}T${formValue.restockTime}:00.000Z`);
        const lastReStockISO = lastReStockDate.toISOString();
        
        const updatedItem: Item = {
            ...formValue,
            lastReStock: lastReStockISO // Send in full ISO format
        };
  
        this.itemService.updateItem(this.data.itemsId, updatedItem, this.selectedFile || undefined).subscribe({
            next: (response) => {
                if (response) {
                    this.dialogRef.close(response);
                }
            },
            error: (error) => {
                console.error('Error updating item:', error); // Log the error
            }
        });
    }
}

  


}
