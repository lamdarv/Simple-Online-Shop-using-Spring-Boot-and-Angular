export interface Order {
    orderId: number;
    orderCode: string;
    orderDate?: number[];
    orderDateConverted?: Date;
    totalPrice: number;
    quantity: number;
    customerId: number;
    itemsId: number;
  }
  