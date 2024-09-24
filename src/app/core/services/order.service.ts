import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponseDTO } from '../../models/common-response-dto.model';
import { Order } from '../../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `http://localhost:8081/api/orders`;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<CommonResponseDTO<Order[]>> {
    return this.http.get<CommonResponseDTO<Order[]>>(this.apiUrl);
  }

  // Create a new order
  createOrder(customerId: number, itemsId: number, quantity: number): Observable<CommonResponseDTO<Order>> {
    // Preparing the body data for the POST request
    const body = new HttpParams()
      .set('customerId', customerId.toString())
      .set('itemsId', itemsId.toString())
      .set('quantity', quantity.toString());

    // Sending the POST request to create an order
    return this.http.post<CommonResponseDTO<Order>>(this.apiUrl, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`, { responseType: 'text' });
  }

  updateOrder(orderId: number, order: Order): Observable<CommonResponseDTO<Order>> {
    const formData: FormData = new FormData();
    formData.append('quantity', order.quantity?.toString() || '0'); // Default ke '0' jika quantity tidak ada
    return this.http.put<CommonResponseDTO<Order>>(`${this.apiUrl}/${orderId}`, formData);
  }


  getOrderById(orderId: number): Observable<CommonResponseDTO<Order>> {
    return this.http.get<CommonResponseDTO<Order>>(`${this.apiUrl}/${orderId}`);
  }

  // 'blob' digunakan untuk mendownload file
  downloadReportByOrderId(orderId: number): Observable<Blob> {
    const url = `http://localhost:8081/api/report/order/${orderId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadAllReports(pageIndex: number, pageSize: number): Observable<Blob> {
    const url = `http://localhost:8081/api/report/reports`;
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get(url, {
      params: params,
      responseType: 'blob'
    });
  }
}
