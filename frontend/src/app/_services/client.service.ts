import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ClientModel} from "../../models/client.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  /*******************************************************************************/
  clients!: Array<ClientModel>
  /**/
  // private host: string = "http://localhost:8888/CLIENT-SERVICE"
  // private host: string = "http://57.128.221.44:8888/CLIENT-SERVICE"
  private host: string = "http://51.254.114.223:8888/CLIENT-SERVICE"
  // private host: string = "http://gs-gateway-service:8888/CLIENT-SERVICE"

  constructor(private http: HttpClient) {
  }

  // Get all clients from the database
  public getClients() {
    console.log(this.host);
    return this.http.get<Array<ClientModel>>(`${this.host}/client/all`)
  }

  // Get a client with its 'id'
  public getClient(idClient: number) {
    return this.http.get<ClientModel>(`${this.host}/client/find/${idClient}`)
  }

  // public addClient(client : ClientModel) {
  //   return this.http.post<ClientModel>(`${this.host}/client/add`, client)
  // }

  // Add a new client
  public addClient(client: FormData) {
    const headers = new HttpHeaders();
    // Make sure datatype is correct like "multipart/form-data"
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<ClientModel>(`${this.host}/client/add`, client, {headers})
  }

  // Delete a client with its 'id'
  public deleteClient(idClient: number) {
    return this.http.delete<ClientModel>(`${this.host}/client/delete/${idClient}`)
  }

  // Update a client
  public updateClient(client: ClientModel) {
    return this.http.put<ClientModel>(`${this.host}/client/update`, client)
  }

  public getClientsN() {
    return this.http.get<Array<ClientModel>>(`${this.host}/client/all`)
      .subscribe({
        next: value => {
          this.clients = value
        },
        error: error => {
        }
      })
  }

  /*******************************************************************************/
  getDeadline(clientId: number) : Observable<number> {
    return this.http.get<number>(`${this.host}/client/find/getDeadline/${clientId}`)
  }
}
