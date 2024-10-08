import {Injectable} from '@angular/core';
import {GroupModel} from "../../models/training.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private host : string = "http://localhost:8888/TRAINING-SERVICE"

  constructor(private http : HttpClient) { }

  public getGroups() {
    return this.http.get<Array<GroupModel>>(`${this.host}/trainingGroup/all`)
  }

  public updateLifeCycle(idGroup : number, group : GroupModel) {
    return this.http.put<GroupModel>(`${this.host}/trainingGroup/updateLifeCycle/${idGroup}`, group)
  }

  // Pas encore implémentée
  public addPv(pv : string, idGroup : number) {
    return this.http.put<GroupModel>(`${this.host}/training/add/pv/${idGroup}`, pv)
  }

  public removePv(idGroup : number, group : GroupModel) {
    return this.http.put<GroupModel>(`${this.host}/training/remove/pv/${idGroup}`, group)
  }

  public addTrainingSupport(formData: FormData, idTraining : number) {
    const headers = new HttpHeaders()
    headers.append('Content-Type', 'multipart/form-data')
    return this.http.put<GroupModel>(`${this.host}/training/add/trainingSupport/${idTraining}`, formData, { headers })
  }

  public removeTrainingSupport(idTraining: number, group: GroupModel) {
    return this.http.put<GroupModel>(`${this.host}/training/remove/trainingSupport/${idTraining}`, group)
  }

  public addReferenceCertificate(formData: FormData, idTraining : number) {
    const headers = new HttpHeaders()
    headers.append('Content-Type', 'multipart/form-data')
    return this.http.put<GroupModel>(`${this.host}/training/add/referenceCertificate/${idTraining}`, formData, { headers })
  }

  public removeReferenceCertificate(idTraining: number, group: GroupModel) {
    return this.http.put<GroupModel>(`${this.host}/training/remove/referenceCertificate/${idTraining}`, group)
  }

  public addTrainingNotes(trainingNotes: FormData, idTraining : number) {
    const headers = new HttpHeaders()
    headers.append('Content-Type', 'multipart/form-data')
    return this.http.put<GroupModel>(`${this.host}/training/add/trainingNotes/${idTraining}`, trainingNotes, { headers })
  }

  public removeTrainingNotes(idTraining: number, group: GroupModel) {
    return this.http.put<GroupModel>(`${this.host}/training/remove/trainingNotes/${idTraining}`, group)
  }
}
