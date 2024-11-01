import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Vendor} from "../../models/vendor.model";

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  // private host : string = "http://57.128.221.44:8888/VENDOR-SERVICE"
  private host : string = "http://51.254.114.223:8888/VENDOR-SERVICE"

  constructor(private http : HttpClient) { }

  public getVendors() {
    return this.http.get<Array<Vendor>>(`${this.host}/vendor/find/all`)
  }

  public getVendor(idVendor : number) {
    return this.http.get<Vendor>(`${this.host}/vendor/find/${idVendor}`)
  }

  public addVendor(vendor : FormData) {
    const headers = new HttpHeaders()
    headers.append('Content-Type', 'multipart/form-data')
    return this.http.post<Vendor>(`${this.host}/vendor/add`, vendor, { headers })
  }

  // public addVendor(instructor : Vendor) {
  //   return this.http.post<Vendor>(`${this.host}/vendor/add`, instructor)
  // }

  public deleteVendor(idVendor : number) {
    return this.http.delete<Vendor>(`${this.host}/vendor/delete/${idVendor}`)
  }

  public updateVendor(vendor : Vendor) {
    return this.http.put<Vendor>(`${this.host}/vendor/update`, vendor)
  }
}
