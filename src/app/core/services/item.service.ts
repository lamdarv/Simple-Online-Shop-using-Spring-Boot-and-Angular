import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponseDTO } from '../../models/common-response-dto.model';
import { Item } from '../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:8081/api/items';

  constructor(private http: HttpClient) { }

  getItems(): Observable<CommonResponseDTO<Item[]>> {
    return this.http.get<CommonResponseDTO<Item[]>>(this.apiUrl);
  }

  getItemById(itemsId: number): Observable<CommonResponseDTO<Item>> {
    return this.http.get<CommonResponseDTO<Item>>(`${this.apiUrl}/${itemsId}`);
  }

  createItem(item: Item, file?: File): Observable<CommonResponseDTO<Item>> {
    const formData: FormData = new FormData();
    formData.append('itemsName', item.itemsName);
    formData.append('itemsCode', item.itemsCode);
    formData.append('stock', item.stock.toString());
    formData.append('price', item.price.toString());
    formData.append('isAvailable', item.isAvailable.toString());
    if (item.lastReStock) {
      formData.append('lastReStock', item.lastReStock); // Kirim sebagai string
    }

    return this.http.post<CommonResponseDTO<Item>>(`${this.apiUrl}/create`, formData);
  }


  updateItem(itemsId: number, item: Item, file?: File): Observable<CommonResponseDTO<Item>> {
    const formData: FormData = new FormData();
    formData.append('itemsName', item.itemsName || '');
    formData.append('itemsCode', item.itemsCode || '');
    formData.append('stock', item.stock !== undefined ? item.stock.toString() : '');
    formData.append('price', item.price !== undefined ? item.price.toString() : '');
    formData.append('isAvailable', item.isAvailable !== undefined ? item.isAvailable.toString() : '');
    if (item.lastReStock) {
      formData.append('lastReStock', item.lastReStock); // Kirim sebagai string
    }

    return this.http.put<CommonResponseDTO<Item>>(`${this.apiUrl}/${itemsId}`, formData);
  }

  deleteItem(itemsId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemsId}`, { responseType: 'text' });
  }
}
