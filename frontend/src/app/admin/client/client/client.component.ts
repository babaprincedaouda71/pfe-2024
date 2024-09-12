import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild
} from '@angular/core';
import {ClientService} from "../../../_services/client.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ClientModel} from "../../../../models/client.model";
import {KeycloakService} from "keycloak-angular";
import {DatePipe} from "@angular/common";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit, AfterViewInit, OnDestroy {
  clients: Array<ClientModel> = [];
  client!: ClientModel;
  datasource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  displayedColumns: string[] = ['corporateName', 'address', 'phone', 'email', 'website', 'nameMainContact', 'action'];
  private subscriptions: Subscription[] = [];

  constructor(private clientService: ClientService,
              public keycloakService: KeycloakService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.getClients()
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // revoke the blob URL to avoid memory leaks
    this.clients.forEach(value => {
      if (value.logoUrl) {
        URL.revokeObjectURL(value.logoUrl);
      }
    })

    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /*
  * Get All Clients
  * */
  getClients() {
    const clientsSubscription = this.clientService.getClients()
      .subscribe({
        next: clients => {
          this.clients = clients
          this.clients.forEach(client => {
            this.convertLogoToBytes(client)
          })
          this.datasource = new MatTableDataSource(this.clients);
          this.datasource.paginator = this.paginator;
        },
      })

    this.subscriptions.push(clientsSubscription)
  }

  getLogoImageUrl(value: ClientModel) {
    return value.logoUrl;
  }

  // private createLogoUrl(client: ClientModel) {
  //   if (client.logoBytes) {
  //     const blob = new Blob([client.logoBytes], {type: 'image/png'});
  //     client.logoUrl = URL.createObjectURL(blob);
  //   } else {
  //     client.logoUrl = null;
  //   }
  // }

  /*
  * Search Clients
  * */
  search(keyword: string) {
    const results: ClientModel[] = []
    for (const client of this.clients) {
      if (client.corporateName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || client.email.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || client.address.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || client.nameMainContact.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || client.website.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        results.push(client)
        this.datasource = new MatTableDataSource(results);
        this.datasource.paginator = this.paginator;
      }
    }
    this.clients = results
    if (results.length === 0 || !keyword) {
      this.getClients()
    }
    console.log("test")
  }

  // Handle delete and update dialog
  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppClientDialogContentComponent, {
      data: {
        // form : this.buildClientForm(),
        obj: obj
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Supprimer') {
        this.deleteRowData(result.data);
      }
    });
  }

  // tslint:disable-next-line - Disables all
  addRowData(row_obj: ClientModel): void {
    // console.log(row_obj)
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: ClientModel): boolean | any {
    this.clientService.deleteClient(row_obj.idClient)
      .subscribe({
        next: data => {
          this.getClients()
          this.snackBar.open('Le Client ' + data.corporateName + ' a été supprimé avec Succès', 'Fermer', {
            duration: 4000,
            panelClass: ['green-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
        },
        error: err => {
          console.log(err.message)
        }
      })
  }

  /*
  * Convert logo to Bytes
  * */
  private convertLogoToBytes(client: ClientModel) {
    if (client && client.logo) {
      const byteCharacters = atob(client.logo);
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      client.logoBytes = new Uint8Array(byteNumbers);
      this.createLogoUrl(client);
    }
  }

  private createLogoUrl(client: ClientModel) {
    if (client.logoBytes) {
      const mimeTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
      for (const mimeType of mimeTypes) {
        try {
          const blob = new Blob([client.logoBytes], {type: mimeType});
          client.logoUrl = URL.createObjectURL(blob);
          return;
        } catch (e) {
          // swallow exception and try next MIME type
        }
      }
    }
    client.logoUrl = null;
  }
}

/**/
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'client-dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class AppClientDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  joiningDate: any = '';
  selectedFile!: File

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppClientDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, obj: ClientModel },
    private clientService: ClientService
  ) {
    this.local_data = {...data.obj};
    this.action = this.local_data.action;
    if (this.local_data.DateOfJoining !== undefined) {
      this.joiningDate = this.datePipe.transform(
        new Date(this.local_data.DateOfJoining),
        'yyyy-MM-dd',
      );
    }

  }

  /*
  * Fonction pour recuperer la date du jour et filtrer le champs date
  * pour selectionner une date supérieure à la date jour
  * */
  getDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    // Ajoutez un zéro en tête si le jour ou le mois est inférieur à 10
    // const formattedDay = day < 10 ? '0' + day : day;
    // const formattedMonth = month < 10 ? '0' + month : month;

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    // return `${formattedDay}-${formattedMonth}-${year}`;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    this.local_data.logo = event.target.files[0]
    console.log(this.local_data.logo)
  }
}
