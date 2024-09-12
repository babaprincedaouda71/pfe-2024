export interface Vendor {
  idVendor: number;
  status : string;
  name : string;
  phone : string;
  email : string;
  address : string;
  createdAt : Date;
  bankAccountNumber : string;
  deadline : number;
  service : string;
  cnss : string;
  contract? : string;
  cv? : string;
  ice? : string;
  fi? : string
  rc? : string;
  subject? : string,
  nic? : string;
  tp? : string;
}
