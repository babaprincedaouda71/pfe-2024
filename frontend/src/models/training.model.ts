import {ClientModel} from "./client.model";
import {Vendor} from "./vendor.model";

export interface TrainingModel {
  idTraining: number;
  idClient: number | null;
  client: ClientModel;
  theme: string;
  days?: number;
  staff?: number;
  idVendor: number | null;
  vendor: Vendor;
  trainingDates: Array<string>;
  location: string;
  amount: number;
  idBill?: number;
  status: string;
  groups: Array<GroupModel>
  lifeCycle: LifecycleModel
  trainingSupport: Uint8Array | undefined;
  pv : string | undefined;
  presenceList: Uint8Array | undefined;
  evaluation: Uint8Array | undefined;
  referenceCertificate: Uint8Array | undefined;
  completionDate : string
}

export interface GroupModel {
  idGroup: number;
  groupStaff: number;
  location: string;
  startDate : string;
  endDate : string;
  groupDates: Array<string>;
  idVendor: number | null;
  vendor: Vendor;
}

export interface LifecycleModel {
  idLifecycle: number;
  trainerSearch: boolean;
  trainerValidation: boolean;
  kickOfMeeting: boolean;
  trainingSupport: boolean;
  impression: boolean;
  completion: boolean;
  certif: boolean;
  invoicing: boolean;
  payment: boolean;
  reference : boolean;
}

