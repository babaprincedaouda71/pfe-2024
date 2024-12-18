import {ClientModel} from "./client.model";
import {GroupModel, TrainingModel} from "./training.model";
import {ProductItem} from "./standardInvoice";

export interface InvoiceModel {
  idInvoice: number;
  numberInvoice: string;
  createdAt : Date;
  idClient: number;
  client : ClientModel,
  idTraining: number;
  trainings : Array<TrainingModel>,
  groups : Array<GroupModel>,
  groupsIds? : Array<number>
  products : Array<ProductItem>,
  ht : number;
  tva : number;
  travelFees : number;
  ttc : number;
  editor : string;
  status : string;
  deadline : number;
  expired : boolean
  paymentDate : string;
  paymentMethod : string;
  invoiceType : string;
  cheque? : string;
  copyRemise? : string
}
