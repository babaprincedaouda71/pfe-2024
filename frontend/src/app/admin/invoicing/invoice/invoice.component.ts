import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {KeycloakService} from "keycloak-angular";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InvoicingService} from "../../../_services/invoicing.service";
import {InvoiceModel} from "../../../../models/invoice.model";
import {Router} from "@angular/router";
import {TrainingService} from "../../../_services/training.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit, OnDestroy {
  invoices: Array<InvoiceModel> = []
  datasource!: MatTableDataSource<any>
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  displayedColumns: string[] = ['invoiceNumber', 'createdAt', 'client', 'tva', 'travel', 'ttc', 'editor', 'status', 'paymentDate', 'paymentMethod', 'action'];
  private subscriptions: Subscription[] = [];

  constructor(private invoiceService: InvoicingService,
              public keycloakService: KeycloakService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private invoicingService: InvoicingService,
              private trainingService: TrainingService,) {
  }

  ngOnInit() {
    this.getInvoices()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  /************************************************/
  getInvoices() {
    const invoicesSubscription = this.invoiceService.getInvoices()
      .subscribe({
        next: data => {
          this.invoices = data
          this.datasource = new MatTableDataSource(this.invoices)
          this.datasource.paginator = this.paginator
        },
        error: err => {
          this.snackBar.open(err.message, 'Fermer', {
            duration: 4000,
            horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
            verticalPosition: 'top', // 'top', 'bottom'
          })
          console.log(err.message)
        }
      })
    this.subscriptions.push(invoicesSubscription)
  }

  /**************************************************/
  search(keyword: string) {
    console.log(keyword)
  }

  /**************************************************/
  generateInvoice(invoice: InvoiceModel) {
    if (invoice.invoiceType === 'standard') {
      this.invoicingService.generateStandardInvoice(invoice.products, invoice.client, invoice.numberInvoice)
    }
    if (invoice.invoiceType === 'trainingModule') {
      this.invoicingService.generateInvoiceWithMultipleTrainings(invoice.trainings, invoice.client)
    }
  }

  /**************************************************/
  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddInvoiceDialogContentComponent);

    const openAddDialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'addTrainingInvoice') {
        this.router.navigate(['invoicing/client-training'])
      }
      if (result.event === 'addStandardInvoice') {
        this.router.navigate(['invoicing/add-standard-invoice'])
      }
    })
    this.subscriptions.push(openAddDialogSubscription)
  }

  openDialog(action: string, obj: any): void {
    const dialogRef = this.dialog.open(InvoiceDialogContentComponent, {
      data: {
        obj: obj,
        action: action,
      }
    });

    const openDialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Supprimer') {
        const deleteInvoiceSubscription = this.invoicingService.deleteInvoice(result.data.idInvoice)
          .subscribe({
            next: value => {
              this.getInvoices()
            },
            error: err => {
              console.log(err.message)
            }
          })
        this.subscriptions.push(deleteInvoiceSubscription)
      }
      if (result.event === 'status') {
        const {cheque, copyRemise, ...rest} = result.data;

        const invoice: InvoiceModel = {
          ...rest,
        };
        const formData = new FormData();
        if (result.data.cheque) {
          formData.append('cheque', result.data.cheque)
        }
        if (result.data.copyRemise) {
          formData.append('copyRemise', result.data.copyRemise)
        }
        formData.append('invoiceData', JSON.stringify(invoice))
        const updateInvoiceStatusSubscription = this.invoicingService.updateInvoiceStatus(formData)
          .subscribe({
            next: value => {
              if (value.trainings) {
                value.trainings.forEach(training => {
                  const updateLifeCycleSubscription = this.trainingService.updateLifeCycle(training.idTraining, training)
                    .subscribe({
                      next: value => {
                        this.getInvoices()
                      },
                      error: err => {
                        console.log("Efjskdvekjvsdfklvdsfkjsdkjgdsklgrkg")
                      }
                    })
                  this.subscriptions.push(updateLifeCycleSubscription)
                })
              }
              this.getInvoices()
            },
            error: err => {
              console.log(err.message)
            }
          })
        this.subscriptions.push(updateInvoiceStatusSubscription)
      }
      else if (result.event ==='Cancel') {
        this.getInvoices()
      }
    })
    this.subscriptions.push(openDialogSubscription)
  }

  onStatusChange(event: any, invoice: InvoiceModel) {
    this.openDialog('status', { ...invoice }); // Passez le nouvel état à la boîte de dialogue
  }
}


@Component({
  selector: 'app-invoice-dialog-content',
  templateUrl: 'invoice-dialog-content.html'
})

export class InvoiceDialogContentComponent {
  action!: string
  local_data!: any
  selectedCheck!: File
  selectedRemise!: File
  selectedPaymentMethod!: string
  currentDate: any = new Date();
  paymentDate: any = new Date();

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { obj: InvoiceModel, action: string },
    public dialogRef: MatDialogRef<InvoiceDialogContentComponent>,
  ) {
    this.local_data = {...data.obj};
    this.action = this.data.action;
  }

  doAction() {
    if (this.action == 'status') {
      this.local_data.paymentDate = this.paymentDate
      this.local_data.paymentMethod = this.selectedPaymentMethod
      this.local_data.cheque = this.selectedCheck
      this.local_data.copyRemise = this.selectedRemise
      this.dialogRef.close({event: this.action, data: this.local_data,})
    } else {
      this.dialogRef.close({event: this.action, data: this.local_data})
    }
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel', data : this.local_data});
  }

  onCheckChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedCheck = event.target.files[0];
  }

  onRemiseChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedRemise = event.target.files[0];

  }

  onPaymentMethodChange(event: any) {
    if (event.value != '') {
      this.selectedPaymentMethod = event.value
    }
  }

  onPaymentDateChange(event: any) {
    if (event.value != '') {
      this.paymentDate = event.value
    }
  }
}

/************************************************************************************/
@Component({
  selector: 'app-add-invoice-dialog-content',
  templateUrl: 'add-invoice-dialog-content.html'
})

export class AddInvoiceDialogContentComponent {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddInvoiceDialogContentComponent>,
  ) {
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  onAddStandardInvoice(addStandardInvoice: string) {
    this.dialogRef.close({event: addStandardInvoice})
  }

  onAddTrainingInvoice(addTrainingInvoice: string) {
    this.dialogRef.close({event: addTrainingInvoice})
  }
}
