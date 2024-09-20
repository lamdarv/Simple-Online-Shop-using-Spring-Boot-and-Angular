import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customer/customer-list/customer-list.component';
import { ItemListComponent } from './features/item/item-list/item-list.component';
import { OrderListComponent } from './features/order/order-list/order-list.component';
import { CustomerViewComponent } from './features/customer/customer-view/customer-view.component';
import { ItemViewComponent } from './features/item/item-view/item-view.component';
import { OrderViewComponent } from './features/order/order-view/order-view.component';

export const routes: Routes = [
    { path: 'customer', component: CustomerListComponent },
    { path: 'customer-view/:id', component: CustomerViewComponent },
    { path: 'item', component: ItemListComponent },
    { path: 'item-view/:id', component: ItemViewComponent },
    { path: 'order', component: OrderListComponent },
    { path: 'order-view/:id', component: OrderViewComponent},
    { path: '', redirectTo: '/customer', pathMatch: 'full' }
];
