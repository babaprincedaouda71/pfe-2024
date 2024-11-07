export interface StandardInvoice {
  idInvoice? : number;
  numberInvoice: string;
  idClient : number;
  createdAt? : number;
  editor : string;
  products : Array<ProductItem>;
  ht? : number,
  tva? : number | null;
  ttc? : number | null;
  travelFees? : number | null;
}

export interface ProductItem {
  name: string;
  quantity: number;
  unitPrice: number;
  travelExpenses : number;
}
