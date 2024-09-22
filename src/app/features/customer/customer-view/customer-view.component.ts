import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.customerService.getCustomerById(+customerId).subscribe((response: any) => {
        this.customer = {
          ...response.data,
          lastOrderDateConverted: response.data.lastOrderDate ? this.convertToDate(response.data.lastOrderDate) : undefined
        };

        this.cdRef.detectChanges(); // Ensure view is updated after data change
      });
    }
  }

  convertToDate(dateArray: number[]): Date {
    if (Array.isArray(dateArray) && dateArray.length >= 5) {
      const [year, month, day, hour, minute] = dateArray;
      return new Date(year, month - 1, day, hour, minute);
    }
    return new Date(); // Handle invalid date arrays
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
        // Re-fetch the customer details after update
        this.customerService.getCustomerById(customerId).subscribe({
          next: (response: any) => {
            this.customer = response.data;
            // Show success message
            this.snackBar.open('Customer updated successfully.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error: (error) => {
            // Show error message
            this.snackBar.open('Error updating customer. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });

        // Update the dataSource
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
            // Show success message and navigate back
            this.snackBar.open('Customer deleted successfully.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.goBack();
          },
          error: (error) => {
            // Show error message
            this.snackBar.open('Error deleting customer. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
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
          // console.error('Error downloading order report:', error);
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
