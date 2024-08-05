import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customer/customer-list/customer-list.component';
import { ItemListComponent } from './features/item/item-list/item-list.component';
import { OrderListComponent } from './features/order/order-list/order-list.component';

export const routes: Routes = [
    { path: 'customer', component: CustomerListComponent },
    { path: 'item', component: ItemListComponent },
    { path: 'order', component: OrderListComponent },
    { path: '', redirectTo: '/customer', pathMatch: 'full' }
];
