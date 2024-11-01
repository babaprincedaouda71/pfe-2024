import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {InstructorModel} from "../../models/instructor-model";

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private host : string = "http://57.128.221.44:8888/INSTRUCTOR-SERVICE"
  // private host : string = "http://51.254.114.223:8888/INSTRUCTOR-SERVICE"

  constructor(private http : HttpClient) { }

  public getInstructors() {
    return this.http.get<Array<InstructorModel>>(`${this.host}/instructor/all`)
  }

  public getInstructor(idInstructor : number) {
    return this.http.get<InstructorModel>(`${this.host}/instructor/find/${idInstructor}`)
  }

  public addInstructor(instructor : InstructorModel) {
    return this.http.post<InstructorModel>(`${this.host}/instructor/add`, instructor)
  }

  public getById(idInstructor : number) {
    return this.http.get<InstructorModel>(`${this.host}/find/${idInstructor}`)
  }

  public add(instructor : InstructorModel) {
    return this.http.post<InstructorModel>(`${this.host}/instructor/add/test`, instructor)
  }

  public deleteInstructor(idInstructor : number) {
    return this.http.delete<InstructorModel>(`${this.host}/instructor/delete/${idInstructor}`)
  }

  public updateInstructor(idInstructor : InstructorModel) {
    return this.http.put<InstructorModel>(`${this.host}/instructor/update`, idInstructor)
  }
}
