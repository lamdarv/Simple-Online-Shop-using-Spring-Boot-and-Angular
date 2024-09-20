import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../models/customer.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CustomDatePipe } from '../../../shared/pipes/custom-date.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerEditDialog } from '../customer-edit/customer-edit.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerAddDialog } from '../customer-add/customer-add.component';
import { DeleteCustomerDialog } from '../customer-delete/customer-delete.component';
import { saveAs } from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Import MatSnackBarModule
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CustomDatePipe,
    SharedModule,
    MatDialogModule,
    CustomerAddDialog,
    DeleteCustomerDialog,
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  customer: Customer | undefined;
  dataSource = new MatTableDataSource<Customer>();

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.customerService.getCustomerById(+customerId).subscribe((response: any) => {
        this.customer = response.data;
      });
    }
  }

  

  goBack(): void {
    window.history.back();
  }

  editCustomer(customerId: number) {
    const dialogRef = this.dialog.open(CustomerEditDialog, {
      width: '300px',
      data: { customerId: customerId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(c => c.customerId === customerId);
        if (index !== -1) {
          this.dataSource.data[index] = result.data;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }

  confirmDeleteCustomer(customerId: number) {
    const dialogRef = this.dialog.open(DeleteCustomerDialog, {
      width: '300px',
      data: { customerId: customerId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.deleteCustomer(customerId).subscribe({
          next: () => {
            this.goBack();
          },
          error: (error) => {
            console.error('Error deleting customer:', error);
          }
        });
      }
    });
  }

  downloadReportByCustomerId(customerId: number): void {
    this.customerService.downloadReportByCustomerId(customerId).subscribe({
      next: (blob) => {
        // Jika sukses, unduh file PDF
        const fileName = `order_${customerId}_report.pdf`;
        saveAs(blob, fileName);
        this.snackBar.open('Report downloaded successfully.', 'Close', { 
          duration: 3000,
          horizontalPosition: 'center',  
          verticalPosition: 'top' 
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Ambil pesan error dari header
          const errorMessage = error.headers.get('Error-Message') || 'Customer has no orders.';
          this.snackBar.open(errorMessage, 'Close', { 
            duration: 3000,
            horizontalPosition: 'center',  
            verticalPosition: 'top' 
          });
        } else {
          console.error('Error downloading order report:', error);
          this.snackBar.open('An error occurred while downloading the report.', 'Close', { 
            duration: 3000,
            horizontalPosition: 'center',  
            verticalPosition: 'top' 
          });
        }
      }
    });
}


}
