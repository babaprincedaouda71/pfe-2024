import {AfterViewInit, Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {Vendor} from "../../../../models/vendor.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {VendorService} from "../../../_services/vendor.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {KeycloakService} from "keycloak-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent implements OnInit, OnDestroy {
  vendors!: Vendor[]
  displayedColumns: string[] = ['name', 'phone', 'email', 'address', 'action'];
  datasource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  private subscriptions: Subscription[] = [];

  constructor(private vendorService: VendorService,
              public keycloakService: KeycloakService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getVendors()
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getVendors() {
    const vendorsSubscription = this.vendorService.getVendors()
      .subscribe({
        next: data => {
          this.vendors = data
          this.datasource = new MatTableDataSource(this.vendors);
          this.datasource.paginator = this.paginator;
          console.log(this.datasource)
        }
      })
    this.subscriptions.push(vendorsSubscription)
  }

  /*
  * Search Vendors
  * */
  search(keyword: string) {
    console.log(keyword)
    const results: Vendor[] = []
    for (const vendor of this.vendors) {
      if (vendor.phone.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || vendor.email.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || vendor.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || vendor.address.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        results.push(vendor)
        this.datasource = new MatTableDataSource(results);
        this.datasource.paginator = this.paginator;
      }
    }
    this.vendors = results
    if (results.length === 0 || !keyword) {
      this.getVendors()
    }
  }

  // Handle delete and update dialog
  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppVendorDialogContentComponent, {
      data: {
        obj: obj
      },
    });
    const openDialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Supprimer') {
        this.deleteRowData(result.data);
      }
    });

    this.subscriptions.push(openDialogSubscription)
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Vendor): boolean | any {
    const deleteVendorSubscription = this.vendorService.deleteVendor(row_obj.idVendor)
      .subscribe({
        next: data => {
          this.snackBar.open('Le Fournisseur ' + data.name + ' a été supprimé avec Succès', 'Fermer', {
            duration: 4000,
            panelClass: ['green-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
          this.getVendors()
        },
        error: err => {
          console.log(err.message)
          this.vendors = []
        }
      })
    this.subscriptions.push(deleteVendorSubscription)
  }

}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-vendor-dialog-content',
  templateUrl: 'vendor-dialog-content.html'
})

// tslint:disable-next-line: component-class-suffix
export class AppVendorDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  constructor(public dialogRef: MatDialogRef<AppVendorDialogContentComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, obj: Vendor },
  ) {
    this.local_data = {...data.obj};
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}

