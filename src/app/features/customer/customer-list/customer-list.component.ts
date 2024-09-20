import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';
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
import { DeleteCustomerDialog } from '../customer-delete/customer-delete.component';
import { CustomerAddDialog } from '../customer-add/customer-add.component';

@Component({
  selector: 'app-customer-list',
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
    DeleteCustomerDialog,
    CustomerAddDialog
  ],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Customer>();

  isMediumScreen: boolean = false;
  isSmallScreen: boolean = false;
  isVerySmallScreen: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private customerService: CustomerService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.customerService.getCustomers().subscribe((response: any) => {
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
      this.displayedColumns = ['customerId', 'customerCode', 'actions'];
    } else if (this.isSmallScreen) {
      this.displayedColumns = ['customerId', 'customerCode', 'isActive', 'actions'];
    } else if (this.isMediumScreen) {
      this.displayedColumns = ['customerId', 'customerName', 'customerAddress', 'customerCode', 'isActive', 'actions'];
    } else {
      this.displayedColumns = ['customerId', 'customerName', 'customerAddress', 'customerCode', 'customerPhone', 'isActive', 'lastOrderDate', 'pic', 'actions'];
    }
  }

  viewCustomer(customerId: number) {
    this.router.navigate(['/customer-view', customerId]);
  }

  openCreateCustomerDialog(): void {
    console.log("Opening dialog"); // Add this line for debugging
    const dialogRef = this.dialog.open(CustomerAddDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result.data];
      }
    });
  }

}