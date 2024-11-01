export interface StandardInvoice {
  idInvoice? : number;
  numberInvoice: string;
  idClient : number;
  createdAt? : number;
  editor : string;
  products : Array<ProductItem>;
}

export interface ProductItem {
  name: string;
  quantity: number;
  unitPrice: number;
  travelExpenses : number;
}
