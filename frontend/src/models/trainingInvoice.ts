import {TrainingModel} from "./training.model";

export interface TrainingInvoice {
  idInvoice? : number;
  editor : string;
  idClient : number | null;
  numberInvoice? : string
  createdAt? : string,
  amount? : number,
  tva? : number | null;
  travelFees? : number | null;
  trainings : Array<TrainingModel>;
}
