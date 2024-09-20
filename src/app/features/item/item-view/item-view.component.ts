import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.css']
})
export class ItemViewComponent implements OnInit {
  item: Item | undefined;
  dataSource = new MatTableDataSource<Item>();

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.itemService.getItemById(+itemId).subscribe((response: any) => {
        this.item = response.data;
      });
    }
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
            this.dataSource.data = this.dataSource.data.filter(i => i.itemsId !== itemId);
          },
          error: (error) => {
            console.error('Error deleting item:', error);
          }
        });
      }
    });
  }


  // Uncomment and adjust as necessary
  editItem(itemsId: number) {
    const dialogRef = this.dialog.open(ItemEditDialog, {
      width: '300px', 
      data: { itemsId: itemsId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(i => i.itemsId === itemsId);
        if (index !== -1) {
          this.dataSource.data[index] = result.data;
          this.dataSource._updateChangeSubscription(); 
        }
      }
    });
  }
  
}
