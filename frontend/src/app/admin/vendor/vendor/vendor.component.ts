import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
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
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit, OnDestroy {
  vendors!: Vendor[];
  displayedColumns: string[] = ['name', 'phone', 'email', 'address', 'action'];
  datasource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator = Object.create(null);
  private subscriptions: Subscription[] = [];

  constructor(
    private vendorService: VendorService,
    public keycloakService: KeycloakService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.getVendors();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /*
   * Fetch all vendors
   */
  getVendors() {
    const vendorsSubscription = this.vendorService.getVendors()
      .subscribe({
        next: data => {
          this.vendors = data;
          this.datasource = new MatTableDataSource(this.vendors);
          this.datasource.paginator = this.paginator;
          console.log(this.datasource.paginator)
        },
        error: err => {
          console.error(err.message);
        }
      });
    this.subscriptions.push(vendorsSubscription);
  }

  /*
   * Search vendors by keyword
   */
  search(keyword: string) {
    const results: Vendor[] = this.vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(keyword.toLowerCase()) ||
      vendor.phone.toLowerCase().includes(keyword.toLowerCase()) ||
      vendor.email.toLowerCase().includes(keyword.toLowerCase()) ||
      vendor.address.toLowerCase().includes(keyword.toLowerCase())
    );

    this.datasource = new MatTableDataSource(results);
    this.datasource.paginator = this.paginator;

    if (!keyword || results.length === 0) {
      this.getVendors();
    }
  }

  /*
   * Open dialog for update or delete
   */
  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppVendorDialogContentComponent, {
      data: {obj}
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Supprimer') {
        this.deleteVendor(result.data);
      }
    });

    this.subscriptions.push(dialogSubscription);
  }

  /*
   * Delete a vendor
   */
  deleteVendor(vendor: Vendor): void {
    const deleteVendorSubscription = this.vendorService.deleteVendor(vendor.idVendor)
      .subscribe({
        next: data => {
          this.showSnackbar(`Le Fournisseur ${data.name} a été supprimé avec succès`, 'green-snackbar');
          this.getVendors();
        },
        error: err => {
          console.error(err.message);
        }
      });
    this.subscriptions.push(deleteVendorSubscription);
  }

  /*
   * Utility method to display snackbar messages
   */
  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 4000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}

@Component({
  selector: 'app-vendor-dialog-content',
  templateUrl: 'vendor-dialog-content.html'
})
export class AppVendorDialogContentComponent {
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<AppVendorDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, obj: Vendor }
  ) {
    this.local_data = {...data.obj};
    this.action = this.local_data.action;
  }

  /*
   * Perform the selected action
   */
  doAction(): void {
    this.dialogRef.close({event: this.action, data: this.local_data});
  }

  /*
   * Close dialog without performing any action
   */
  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }
}
