import {TrainingModel} from "./training.model";

export interface TrainingInvoice {
  idInvoice? : number;
  editor : string;
  idClient : number | null;
  numberInvoice? : string
  createdAt? : string,
  trainings : Array<TrainingModel>;
}
