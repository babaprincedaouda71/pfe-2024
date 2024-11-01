import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClientModel} from "../../../../../models/client.model";
import {KeycloakProfile} from "keycloak-js";
import {InvoiceModel} from "../../../../../models/invoice.model";
import {ClientService} from "../../../../_services/client.service";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {ActivatedRoute, Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {referenceValidator} from "../../../../_validators/invoice-format.validator";
import {MatTableDataSource} from "@angular/material/table";
import {TrainingModel} from "../../../../../models/training.model";
import {SelectionModel} from "@angular/cdk/collections";
import {TrainingService} from "../../../../_services/training.service";
import {TrainingInvoice} from "../../../../../models/trainingInvoice";

@Component({
  selector: 'app-edit-training-invoice',
  templateUrl: './edit-training-invoice.component.html',
  styleUrl: './edit-training-invoice.component.scss'
})
export class EditTrainingInvoiceComponent implements OnInit {
  editTrainingInvoiceForm!: FormGroup;
  clients!: Array<ClientModel>;
  deadline!: number;
  idInvoice!: number
  invoice!: InvoiceModel;
  /*************Training**************/
  displayedColumns: string[] = [
    'client',
    'theme',
    'dates',
    'amount',
    'status',
    'select'
  ];
  datasource!: MatTableDataSource<TrainingModel>;
  selection = new SelectionModel<TrainingModel>(true, []);
  trainings!: Array<TrainingModel>;
  private userProfile!: KeycloakProfile;

  selectedDate: Date = new Date(); // Date sélectionnée dans le calendrier
  invoiceNumber: string = '';

  constructor(private clientService: ClientService,
              private invoicingService: InvoicingService,
              private router: Router,
              private formBuilder: FormBuilder,
              private keycloakService: KeycloakService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private trainingService: TrainingService,) {
  }

  ngOnInit() {
    this.idInvoice = this.route.snapshot.params['idInvoice'];
    this.getInvoice(this.idInvoice)
    this.getClients()
    this.getUserProfile()
  }

  getInvoice(idInvoice: number) {
    this.invoicingService.getInvoice(idInvoice)
      .subscribe({
        next: data => {
          this.invoice = data;
          this.buildForm()
          this.getTrainingsByClient(this.invoice.idClient)
        },
        error: error => {
          console.log(error)
        }
      })
  }

  getClients(): void {
    this.clientService.getClients()
      .subscribe({
        next: data => {
          this.clients = data
        },
        error: err => {
          console.log(err.message)
        }
      })
  }

  getTrainingsByClient(idClient: number) {
    this.trainingService.getTrainingsByClient(idClient)
      .subscribe({
        next: data => {
          this.trainings = data
          this.trainings.map(value => {
            console.log(value)
            value.groups.map(groupe => {
              if (groupe.status === "Reglement" || groupe.status === "Facturation") {
                this.selection.toggle(value)
              }
            })
            // if (value.status === "Reglement" || value.status === "Realisée") {
            //   this.selection.toggle(value)
            // }
          })

          this.datasource = new MatTableDataSource(this.trainings);
        },
        error: err => {
          console.log(err.message)
        }
      })
  }

  buildForm() {
    this.editTrainingInvoiceForm = this.formBuilder.group({
      idClient: [this.invoice.idClient, [Validators.required, Validators.minLength(6)]],
      numberInvoice: [this.invoice.numberInvoice, [referenceValidator(this.selectedDate)]],
      createdAt: [this.invoice.createdAt, [Validators.required, Validators.minLength(6)]],
    })

    // Ecouter les changements de sélection du client pour mettre à jour l'échéance
    this.editTrainingInvoiceForm.get('idClient')?.valueChanges.subscribe((idClient) => {
      // Mettre en place la logique pour récupérer l'échéance en fonction du client sélectionné
      this.getTrainingsByClient(idClient)
    });
  }

  // User Profile
  getUserProfile() {
    if (this.keycloakService.isLoggedIn()) {
      this.keycloakService.loadUserProfile().then(
        profile => {
          this.userProfile = profile
        }
      )
    }
  }

  onSubmit() {
    // console.log(this.editTrainingInvoiceForm.value)
    // console.log(this.selection.selected)
    const trainingInvoice: TrainingInvoice = {
      idInvoice: this.invoice.idInvoice,
      idClient: this.selection.selected[0].idClient,
      numberInvoice: this.editTrainingInvoiceForm.get('numberInvoice')?.value,
      createdAt: this.editTrainingInvoiceForm.get('createdAt')?.value,
      trainings: this.selection.selected,
      editor: this.userProfile.firstName + ' ' + this.userProfile.lastName
    }
    // console.log(trainingInvoice)
    this.invoicingService.updateTrainingInvoice(trainingInvoice)
      .subscribe({
        next: data => {
          data.trainings.forEach(training => {
            this.trainingService.updateLifeCycle(training.idTraining, training)
              .subscribe({
                next: value => {
                  this.router.navigate(['invoicing'])
                },
                error: err => {
                  console.log(err.message)
                }
              })
          })
        },
        error: error => {
          console.log(error.message)
        }
      })
  }

  handleAdd() {
    this.router.navigate(['/client/add'])
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle(): void {
  //   this.isAllSelected()
  //     ? this.selection.clear()
  //     : this.datasource.data.forEach((row) => this.selection.select(row));
  // }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TrainingModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.theme + 1
    }`;
  }

  /** Handle checkbox change */
  onCheckboxChange(event: any, row: TrainingModel): void {
    if (event.checked) {
      if (this.canSelect(row)) {
        this.selection.toggle(row);
      } else {
        event.source.checked = false;
        this.snackBar.open('Les Formations sélectionnés doivent avoir le même Client et le même mois de date de réalisation.', 'Fermer', {
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: 'center'
        });
      }
    } else {
      this.selection.toggle(row);
    }
  }

  /** Check if the row can be selected */
  canSelect(row: TrainingModel): boolean {
    if (this.selection.isEmpty()) {
      return true;
    }

    const selectedClient = this.selection.selected[0].client.corporateName;
    const selectedMonth = new Date(this.selection.selected[0].completionDate).getMonth();
    const rowClient = row.client.corporateName;
    const rowMonth = new Date(row.completionDate).getMonth();

    return selectedClient === rowClient && selectedMonth === rowMonth;
  }

  updateInvoiceNumber() {
    const year = this.selectedDate.getFullYear() % 100; // Récupérer les deux derniers chiffres de l'année
    const month = this.selectedDate.getMonth() + 1; // Les mois commencent à 0 en JS

    this.invoicingService.getNextInvoiceNumber(year, month).subscribe((nextNum: string) => {
      this.invoiceNumber = nextNum;
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.value; // Mettre à jour la date sélectionnée
    this.updateInvoiceNumber();
  }
}
