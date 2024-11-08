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
  // Liste des factures
  invoices: Array<InvoiceModel> = [];
  // Source de données pour la table des factures
  datasource!: MatTableDataSource<any>;
  // Pagination pour la table
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  // Colonnes affichées dans la table des factures
  displayedColumns: string[] = ['invoiceNumber', 'createdAt', 'client', 'tva', 'travel', 'ttc', 'editor', 'status', 'paymentDate', 'paymentMethod', 'action'];
  // Liste des abonnements pour une bonne gestion de la mémoire
  private subscriptions: Subscription[] = [];

  // Liste des factures filtrées
  filteredInvoices: Array<InvoiceModel> = [];

  // Valeur des champs sélectionnés
  selectedYear! : any
  selectedStatus! : any
  selectedClient! : any
  selectedEditor!: any

  // Injection des services nécessaires
  constructor(
    private invoiceService: InvoicingService,
    public keycloakService: KeycloakService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private invoicingService: InvoicingService,
    private trainingService: TrainingService,
  ) {
  }

  // Appelée lors de l'initialisation pour charger les factures
  ngOnInit() {
    this.getInvoices();
  }

  // Désabonnement des abonnements lors de la destruction du composant
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /************************************************/

  // Récupère la liste des factures depuis le service
  getInvoices() {
    const invoicesSubscription = this.invoiceService.getInvoices().subscribe({
      next: data => {
        this.invoices = data;
        this.datasource = new MatTableDataSource(this.invoices);
        this.datasource.paginator = this.paginator; // Initialise la pagination
      },
      error: err => {
        // Affiche un message d'erreur en cas de problème
        this.snackBar.open(err.message, 'Fermer', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        console.log(err.message);
      }
    });
    this.subscriptions.push(invoicesSubscription);
  }

  /**************************************************/

  // Méthode pour rechercher une facture par mot-clé
  search(keyword: string) {
    console.log(keyword);
  }

  /**************************************************/

  // Imprime la facture en récupérant les informations par ID
  printBill(invoiceId: number) {
    this.invoicingService.getInvoice(invoiceId).subscribe({
      next: data => {
        this.generateInvoice(data);
      },
      error: err => {
      }
    });
  }

  // Génère la facture en fonction du type (standard ou groupé)
  generateInvoice(invoice: InvoiceModel) {
    if (invoice.invoiceType === 'standard') {
      this.invoicingService.generateStandardInvoice(invoice, invoice.products, invoice.client, invoice.numberInvoice);
    }
    if (invoice.invoiceType === 'groupInvoice') {
      this.invoicingService.generateGroupsInvoice(invoice.numberInvoice, invoice, invoice.trainings, invoice.client);
    }
  }

  /**************************************************/

  // Ouvre une boîte de dialogue pour ajouter une facture
  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddInvoiceDialogContentComponent);

    // Abonnement pour naviguer selon le type de facture choisi dans la boîte de dialogue
    const openAddDialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'addTrainingInvoice') {
        this.router.navigate(['invoicing/invoice-groups']);
      }
      if (result.event === 'addStandardInvoice') {
        this.router.navigate(['invoicing/add-standard-invoice']);
      }
    });
    this.subscriptions.push(openAddDialogSubscription);
  }

  // Ouvre une boîte de dialogue pour des actions spécifiques sur une facture
  openDialog(action: string, obj: any): void {
    const dialogRef = this.dialog.open(InvoiceDialogContentComponent, {
      data: {obj: obj, action: action},
    });

    // Abonnement pour gérer les actions de la boîte de dialogue (supprimer, modifier le statut)
    const openDialogSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Supprimer') {
        const deleteInvoiceSubscription = this.invoicingService.deleteInvoice(result.data.idInvoice).subscribe({
          next: value => {
            this.getInvoices(); // Rafraîchit la liste après suppression
          },
          error: err => {
            console.log(err.message);
          }
        });
        this.subscriptions.push(deleteInvoiceSubscription);
      }
      if (result.event === 'status') {
        const {cheque, copyRemise, ...rest} = result.data;
        const invoice: InvoiceModel = {...rest};
        const formData = new FormData();
        if (result.data.cheque) formData.append('cheque', result.data.cheque);
        if (result.data.copyRemise) formData.append('copyRemise', result.data.copyRemise);
        formData.append('invoiceData', JSON.stringify(invoice));

        // Met à jour le statut de la facture
        const updateInvoiceStatusSubscription = this.invoicingService.updateInvoiceStatus(formData).subscribe({
          next: value => {
            if (value.trainings) {
              // Si des formations sont associées, met à jour leur cycle de vie
              value.trainings.forEach(training => {
                const updateLifeCycleSubscription = this.trainingService.updateLifeCycle(training.idTraining, training).subscribe({
                  next: value => {
                    this.getInvoices();
                  },
                  error: err => {
                    console.log("Erreur lors de la mise à jour du cycle de vie");
                  }
                });
                this.subscriptions.push(updateLifeCycleSubscription);
              });
            }
            this.getInvoices(); // Rafraîchit la liste après la mise à jour
          },
          error: err => {
            console.log(err.message);
          }
        });
        this.subscriptions.push(updateInvoiceStatusSubscription);
      } else if (result.event === 'Cancel') {
        this.getInvoices();
      }
    });
    this.subscriptions.push(openDialogSubscription);
  }

  // Déclenche un changement de statut
  onStatusChange(event: any, invoice: InvoiceModel) {
    this.openDialog('status', {...invoice});
  }

  // ********** Start *************
  // applyFilter(event: any, filterType: string) {
  //   const value = event.value.toLowerCase();
  //   if (value === '') {
  //     this.invoices = this.filteredInvoices.slice();
  //     this.datasource = new MatTableDataSource(this.invoices);
  //     this.datasource.paginator = this.paginator;
  //
  //   } else {
  //     switch (filterType) {
  //       case 'year':
  //         this.invoices = this.filteredInvoices.filter(invoice =>
  //           `${invoice.createdAt.toString().toLowerCase()}` === value
  //         );
  //         this.resetFilter('year')
  //         break;
  //       case 'client':
  //         const selectedYear = parseInt(value, 10);
  //         this.invoices = this.filteredInvoices.filter(invoice => {
  //           if (!invoice.trainingDates) {
  //             return false;
  //           }
  //           const trainingDates = training.trainingDates.map(trainingDate => new Date(trainingDate));
  //           return trainingDates.some(trainingDate => this.isSameDate(selectedDate, trainingDate));
  //         });
  //         this.resetFilter('date')
  //         break;
  //       case 'status':
  //         const selectedDate = parseInt(value, 10);
  //         this.invoices = this.filteredInvoices.filter(training => {
  //           if (!training.trainingDates) {
  //             return false;
  //           }
  //           const trainingDates = training.trainingDates.map(trainingDate => new Date(trainingDate));
  //           return trainingDates.some(trainingDate => this.isSameDate(selectedDate, trainingDate));
  //         });
  //         this.resetFilter('date')
  //         break;
  //       case 'editor':
  //         this.invoices = this.filteredInvoices.filter(training =>
  //           `${training.client.corporateName.toLowerCase()}` === value
  //         );
  //         this.resetFilter('client')
  //         break;
  //       default:
  //         console.error(`Unknown filter type: ${filterType}`);
  //     }
  //     this.datasource = new MatTableDataSource(this.invoices);
  //     this.datasource.paginator = this.paginator;
  //     console.log(this.datasource.paginator)
  //
  //   }
  // }
  //
  // resetFilter(filterType: string) {
  //   if (filterType === 'year') {
  //     this.selectedStatus = null;
  //     this.selectedClient = null;
  //     this.selectedEditor = null;
  //   }
  //   if (filterType === 'client') {
  //     this.selectedYear = null;
  //     this.selectedStatus = null;
  //     this.selectedEditor = null;
  //   }
  //   if (filterType === 'status') {
  //     this.selectedClient = null;
  //     this.selectedEditor = null;
  //     this.selectedYear = null;
  //   }
  //   if (filterType === 'editor') {
  //     this.selectedClient = null;
  //     this.selectedEditor = null;
  //     this.selectedYear = null;
  //   }
  // }

  // ********** End *************
}

@Component({
  selector: 'app-invoice-dialog-content',
  templateUrl: 'invoice-dialog-content.html'
})
export class InvoiceDialogContentComponent {
  action!: string;
  local_data!: any;
  selectedCheck!: File;
  selectedRemise!: File;
  selectedPaymentMethod!: string;
  currentDate: any = new Date();
  paymentDate: any = new Date();

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { obj: InvoiceModel, action: string },
    public dialogRef: MatDialogRef<InvoiceDialogContentComponent>,
  ) {
    this.local_data = {...data.obj};
    this.action = this.data.action;
  }

  // Effectue une action sur la facture (statut ou suppression)
  doAction() {
    if (this.action == 'status') {
      this.local_data.paymentDate = this.paymentDate;
      this.local_data.paymentMethod = this.selectedPaymentMethod;
      this.local_data.cheque = this.selectedCheck;
      this.local_data.copyRemise = this.selectedRemise;
      this.dialogRef.close({event: this.action, data: this.local_data});
    } else {
      this.dialogRef.close({event: this.action, data: this.local_data});
    }
  }

  // Ferme la boîte de dialogue sans changement
  closeDialog() {
    this.dialogRef.close({event: 'Cancel', data: this.local_data});
  }

  // Méthodes pour gérer les fichiers de chèque et de remise sélectionnés
  onCheckChange(event: any) {
    if (!event.target.files[0]) return;
    this.selectedCheck = event.target.files[0];
  }

  onRemiseChange(event: any) {
    if (!event.target.files[0]) return;
    this.selectedRemise = event.target.files[0];
  }

  onPaymentMethodChange(event: any) {
    if (event.value != '') {
      this.selectedPaymentMethod = event.value;
    }
  }

  onPaymentDateChange(event: any) {
    if (event.value != '') {
      this.paymentDate = event.value;
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

  // Ferme la boîte de dialogue sans ajout
  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  // Méthodes pour ajouter différents types de factures
  onAddStandardInvoice(addStandardInvoice: string) {
    this.dialogRef.close({event: addStandardInvoice});
  }

  onAddTrainingInvoice(addTrainingInvoice: string) {
    this.dialogRef.close({event: addTrainingInvoice});
  }
}
