import {TrainingModel} from "./training.model";

export interface TrainingInvoice {
  idInvoice? : number;
  numberInvoice? : string
  idClient : number | null;
  editor : string;
  createdAt? : string,
  ht? : number,
  tva? : number | null;
  ttc? : number | null;
  travelFees? : number | null;
  trainings : Array<TrainingModel>;
}
