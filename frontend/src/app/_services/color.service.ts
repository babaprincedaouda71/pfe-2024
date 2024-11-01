import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ColorModel} from "../../models/color.model";

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private host : string = "http://51.254.114.223:8888/CLIENT-SERVICE"
  // private host : string = "http://57.128.221.44:8888/CLIENT-SERVICE"

  constructor(private http: HttpClient) { }

  public getAvailableColors() {
    return this.http.get<Array<ColorModel>>(`${this.host}/color/find/all`)
  }
}
