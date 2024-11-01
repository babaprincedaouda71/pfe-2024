export interface ClientModel {
  idClient: number;
  corporateName: string;
  address: string;
  email: string;
  phoneNumber: string;
  website: string;
  nameMainContact: string;
  emailMainContact?: string;
  phoneNumberMainContact?: string;
  positionMainContact?: string;
  commonCompanyIdentifier: string;
  taxRegistration?: string;
  commercialRegister?: string;
  professionalTax?: string;
  cnss?: string;
  logo: string;
  logoUrl: string | null;
  logoBytes: Uint8Array | undefined;
  field?: string;
  status?: string;
  deadline: number;
  limitAmount?: string;
  color : string
}
