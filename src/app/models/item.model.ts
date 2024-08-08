export interface Item {
    itemsId: number;
    itemsName: string;
    itemsCode: string;
    stock: number;
    price: number;
    isAvailable: boolean;
    lastReStock?: Date;
  }