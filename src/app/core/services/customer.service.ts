import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../../models/customer.model';
import { CommonResponseDTO } from '../../models/common-response-dto.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8081/api/customers';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<CommonResponseDTO<Customer[]>> {
    return this.http.get<CommonResponseDTO<Customer[]>>(this.apiUrl);
  }

  getCustomerById(customerId: number): Observable<CommonResponseDTO<Customer>> {
    return this.http.get<CommonResponseDTO<Customer>>(`${this.apiUrl}/${customerId}`);
  }

  createCustomer(customer: Customer, file?: File): Observable<CommonResponseDTO<Customer>> {
    const formData: FormData = new FormData();
    formData.append('customerName', customer.customerName);
    formData.append('customerAddress', customer.customerAddress);
    formData.append('customerCode', customer.customerCode);
    formData.append('customerPhone', customer.customerPhone);
    formData.append('isActive', customer.isActive.toString());
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.http.post<CommonResponseDTO<Customer>>(`http://localhost:8081/api/customers/create`, formData);
  }

  updateCustomer(customerId: number, customer: Customer, file?: File): Observable<CommonResponseDTO<Customer>> {
    const formData: FormData = new FormData();
    formData.append('customerName', customer.customerName || '');
    formData.append('customerAddress', customer.customerAddress || '');
    formData.append('customerCode', customer.customerCode || '');
    formData.append('customerPhone', customer.customerPhone || '');
    formData.append('isActive', customer.isActive !== undefined ? customer.isActive.toString() : '');
    if (file) {
      formData.append('file', file, file.name);
    }
    return this.http.put<CommonResponseDTO<Customer>>(`${this.apiUrl}/${customerId}`, formData);
  }


  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${customerId}`, { responseType: 'text' });
  }
}
