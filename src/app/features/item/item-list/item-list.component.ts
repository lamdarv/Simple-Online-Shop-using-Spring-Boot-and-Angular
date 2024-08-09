import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Item } from '../../../models/item.model';
import { ItemService } from '../../../core/services/item.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomDatePipe } from '../../../shared/pipes/custom-date.pipe';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ItemAddDialog } from '../item-add/item-add.component';
import { DeleteItemDialog } from '../item-delete/item-delete.component';
import { ItemEditDialog } from '../item-edit/item-edit.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    CustomDatePipe,
    MatDialogModule,
    MatCardModule,
    ItemAddDialog,
    ItemEditDialog
  ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Item>();

  isMediumScreen: boolean = false;
  isSmallScreen: boolean = false;
  isVerySmallScreen: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private itemService: ItemService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.itemService.getItems().subscribe((response: any) => {
      this.dataSource.data = response.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.updateScreenSize();
    window.addEventListener('resize', this.updateScreenSize.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateScreenSize();
  }

  updateScreenSize() {
    this.isMediumScreen = window.innerWidth <= 1100;
    this.isSmallScreen = window.innerWidth <= 800;
    this.isVerySmallScreen = window.innerWidth <= 550;
    this.setDisplayedColumns();
  }

  setDisplayedColumns() {
    if (this.isVerySmallScreen) {
      this.displayedColumns = ['itemsId', 'itemsCode', 'actions'];
    } else if (this.isSmallScreen) {
      this.displayedColumns = ['itemsId', 'itemsCode', 'isAvailable', 'actions'];
    } else if (this.isMediumScreen) {
      this.displayedColumns = ['itemsId', 'itemsName', 'itemsCode', 'stock', 'price', 'isAvailable', 'actions'];
    } else {
      this.displayedColumns = ['itemsId', 'itemsName', 'itemsCode', 'stock', 'price', 'isAvailable', 'lastReStock', 'actions'];
    }
  }

  viewItem(itemId: number) {
    console.log('Navigating to item-view with ID:', itemId);
    this.router.navigate(['/item-view', itemId]);
  }

  viewCustomer(customerId: number) {
    this.router.navigate(['/customer-view', customerId]);
  }

  openCreateItemDialog(): void {
    const dialogWidth = this.isVerySmallScreen ? '300px' : '600px'; // Atur width sesuai kondisi layar

    const dialogRef = this.dialog.open(ItemAddDialog, {
      width: dialogWidth,
    });

    dialogRef.componentInstance.isVerySmallScreen = this.isVerySmallScreen;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result.data];
      }
    });
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
    const dialogWidth = this.isVerySmallScreen ? '300px' : '600px'; // Atur width sesuai kondisi layar

    const dialogRef = this.dialog.open(ItemEditDialog, {
      width: dialogWidth,
      data: { itemsId: itemsId }
    });

    dialogRef.componentInstance.isVerySmallScreen = this.isVerySmallScreen;

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
