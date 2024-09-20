import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Order } from '../../../models/order.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomDatePipe } from '../../../shared/pipes/custom-date.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { OrderService } from '../../../core/services/order.service';
import { Router } from '@angular/router';
import { CommonResponseDTO } from '../../../models/common-response-dto.model';
import { OrderCreateComponent } from '../order-add/order-add.component';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-order-list',
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
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Order>();

  isMediumScreen: boolean = false;
  isSmallScreen: boolean = false;
  isVerySmallScreen: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (response: CommonResponseDTO<Order[]>) => {
        if (response && response.data) {
          console.log(response.data);

          // Convert orderDate from array to Date and store it in orderDateConverted
          const ordersWithConvertedDate = response.data.map(order => ({
            ...order,
            orderDateConverted: order.orderDate ? this.convertToDate(order.orderDate) : undefined
          }));

          // Set the dataSource with the converted data
          this.dataSource.data = ordersWithConvertedDate;
        } else {
          console.warn('No orders data received');
          this.dataSource.data = [];
        }

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.dataSource.data = [];
      }
    });

    this.updateScreenSize();
    window.addEventListener('resize', this.updateScreenSize.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateScreenSize();
  }

  updateScreenSize() {
    this.isMediumScreen = window.innerWidth <= 1180;
    this.isSmallScreen = window.innerWidth <= 800;
    this.isVerySmallScreen = window.innerWidth <= 550;
    this.setDisplayedColumns();
  }

  setDisplayedColumns() {
    if (this.isVerySmallScreen) {
      this.displayedColumns = ['orderId', 'orderCode', 'actions'];
    } else if (this.isSmallScreen) {
      this.displayedColumns = ['orderId', 'orderCode', 'totalPrice', 'actions'];
    } else if (this.isMediumScreen) {
      this.displayedColumns = ['orderId', 'customerId', 'itemsId', 'orderCode', 'totalPrice', 'actions'];
    } else {
      this.displayedColumns = ['orderId', 'customerId', 'customerName', 'itemsId', 'itemName', 'orderCode', 'quantity', 'totalPrice', 'orderDate', 'actions'];
    }
  }

  convertToDate(dateArray: number[]): Date {
    if (Array.isArray(dateArray) && dateArray.length >= 5) {
      const [year, month, day, hour, minute] = dateArray;
      return new Date(year, month - 1, day, hour, minute);
    }
    return new Date(); 
  }

  openCreateOrderDialog(): void {
    console.log("Opening dialog"); 
    const dialogRef = this.dialog.open(OrderCreateComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //convert order data
        const newOrderWithConvertedDate = {
          ...result,
          orderDateConverted: result.orderDate ? this.convertToDate(result.orderDate) : undefined
        };

        this.dataSource.data = [...this.dataSource.data, newOrderWithConvertedDate];
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  viewOrder(orderId: number) {
    this.router.navigate(['/order-view', orderId]);
  }

  downloadAllReports(): void {
    this.orderService.downloadAllReports().subscribe({
      next: (blob) => {
        const fileName = `all_orders_report.pdf`; 
        saveAs(blob, fileName);
      },
      error: (error) => {
        console.error('Error downloading all orders report:', error);
      }
    });
  }

}
