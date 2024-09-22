export interface Customer {
    customerId: number;
    customerName: string;
    customerAddress: string;
    customerCode: string;
    customerPhone: string;
    isActive: boolean;
    lastOrderDate?: number[];
    lastOrderDateConverted?: Date;
    pic?: string;
    urlPic?: string;
}