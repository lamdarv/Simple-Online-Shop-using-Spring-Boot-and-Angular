export interface Customer {
    customerId: number;
    customerName: string;
    customerAddress: string;
    customerCode: string;
    customerPhone: string;
    isActive: boolean;
    lastOrderDate?: number[];
    pic?: string;
}