import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../../shared/shared.module';
import { OrderService } from '../../../core/services/order.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ItemService } from '../../../core/services/item.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteOrderDialog } from '../order-delete/order-delete.component';
import { OrderEditDialog } from '../order-edit/order-edit.component';
import { saveAs } from 'file-saver';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-order-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    SharedModule,
    MatDialogModule,
    MatIcon
  ],
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.css']
})
export class OrderViewComponent implements OnInit {
  order: Order | undefined;
  customerName: string | undefined;
  itemName: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private customerService: CustomerService,
    private itemService: ItemService,
    public dialog: MatDialog, 
    private router: Router,   
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderById(+orderId).subscribe((response: any) => {
        this.order = response.data;

        // Ambil data customer berdasarkan customerId dari order
        if (this.order?.customerId) {
          this.customerService.getCustomerById(this.order.customerId).subscribe(customerResponse => {
            this.customerName = customerResponse.data.customerName;
          });
        }

        // Ambil data item berdasarkan itemsId dari order
        if (this.order?.itemsId) {
          this.itemService.getItemById(this.order.itemsId).subscribe(itemResponse => {
            this.itemName = itemResponse.data.itemsName;
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/order']); // Kembali ke halaman daftar order
  }

  confirmDeleteOrder(orderId: number): void {
    const dialogRef = this.dialog.open(DeleteOrderDialog, {
      width: '300px',
      data: { orderId: orderId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.deleteOrder(orderId).subscribe({
          next: () => {
            this.router.navigate(['/order']); // Navigasi kembali ke daftar order setelah dihapus
          },
          error: (error) => {
            console.error('Error deleting order:', error);
          }
        });
      }
    });
  }

  editOrder(orderId: number): void {
    console.log("Opening edit dialog for orderId:", orderId);

    const dialogRef = this.dialog.open(OrderEditDialog, {
      width: '300px',
      data: { orderId: orderId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Edit completed. Fetching updated order data.");

        // Fetch updated order data again
        this.orderService.getOrderById(orderId).subscribe((response: any) => {
          this.order = {
            ...response.data,
            orderDateConverted: response.data.orderDate ? this.convertToDate(response.data.orderDate) : undefined
          };

          this.cdr.detectChanges(); // Memperbarui tampilan setelah data diperbarui
        });
      } else {
        console.log("Edit dialog was closed without any result.");
      }
    });
  }

  downloadReportByOrderId(orderId: number): void {
    this.orderService.downloadReportByOrderId(orderId).subscribe({
      next: (blob) => {
        const fileName = `order_${orderId}_report.pdf`; // Nama file yang akan didownload
        saveAs(blob, fileName); // Gunakan file-saver untuk menyimpan file
      },
      error: (error) => {
        console.error('Error downloading order report:', error);
      }
    });
  }

  convertToDate(dateArray: number[]): Date {
    if (Array.isArray(dateArray) && dateArray.length >= 5) {
      const [year, month, day, hour, minute] = dateArray;
      return new Date(year, month - 1, day, hour, minute);
    }
    return new Date(); // Handle invalid date arrays
  }
}

