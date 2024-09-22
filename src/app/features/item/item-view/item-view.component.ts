import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../models/item.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CustomDatePipe } from '../../../shared/pipes/custom-date.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { DeleteItemDialog } from '../item-delete/item-delete.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemEditDialog } from '../item-edit/item-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-item-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CustomDatePipe,
    SharedModule,
    DeleteItemDialog,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent implements OnInit {
  item: Item | undefined;
  // dataSource = new MatTableDataSource<Item>();
  item$ = new BehaviorSubject<Item | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.itemService.getItemById(+itemId).subscribe((response: any) => {
        if (response?.data) {
          let item = response.data;
          if (Array.isArray(item.lastReStock)) {
            item.lastReStock = this.convertToDate(item.lastReStock);
          }
          this.item$.next(item);
        }
      });
    }
  }

  convertToDate(dateArray: number[] | undefined): string | undefined {
    if (Array.isArray(dateArray) && dateArray.length >= 5) {
      const [year, month, day, hour, minute] = dateArray;
      const dateObj = new Date(year, month - 1, day, hour, minute);
      return dateObj.toISOString(); // Mengubah objek Date menjadi string ISO
    }
    return undefined;
  }

  goBack(): void {
    window.history.back();
  }

  confirmDeleteItem(itemId: number) {
    const dialogRef = this.dialog.open(DeleteItemDialog, {
      width: '300px',
      data: { itemId: itemId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.deleteItem(itemId).subscribe({
          next: () => {
            this.router.navigate(['/item']);
            this.snackBar.open('Item deleted successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error: (error) => {
            this.snackBar.open('Error deleting item. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            console.error('Error deleting item:', error);
          }
        });
      }
    });
  }

  editItem(itemsId: number) {
    const dialogRef = this.dialog.open(ItemEditDialog, {
      width: '300px',
      data: { itemsId: itemsId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.itemService.getItemById(itemsId).subscribe({
          next: (response: any) => {
            let updatedItem = response.data;
            if (Array.isArray(updatedItem.lastReStock)) {
              updatedItem.lastReStock = this.convertToDate(updatedItem.lastReStock);
            }
            this.item$.next(updatedItem);
            this.snackBar.open('Item updated successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.cdRef.markForCheck();
          },
          error: (error) => {
            console.error('Error details:', error);
            this.snackBar.open('Error fetching updated item. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    });
  }
}
