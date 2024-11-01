import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {TrainingService} from "../../../_services/training.service";
import {Router} from "@angular/router";
import {TrainingModel} from "../../../../models/training.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {InvoicingService} from "../../../_services/invoicing.service";
import {TrainingInvoice} from "../../../../models/trainingInvoice";
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-client-training',
  templateUrl: './client-training.component.html',
  styleUrl: './client-training.component.scss'
})
export class ClientTrainingComponent implements OnInit, OnDestroy {
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
  userProfile!: KeycloakProfile
  private subscriptions: Subscription[] = []

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private snackBar: MatSnackBar,
    private invoicingService: InvoicingService,
    public keycloakService: KeycloakService
  ) {
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle(): void {
  //   this.isAllSelected()
  //     ? this.selection.clear()
  //     : this.datasource.data.forEach((row) => this.selection.select(row));
  // }

  /*********************************************************************************/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

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

  ngOnInit() {
    this.getUserProfile()
    this.getTrainings()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  getTrainings() {
    const trainingSubscription = this.trainingService.getTrainingsClient()
      .subscribe({
        next: data => {
          this.trainings = data
          console.log(this.trainings)

          this.datasource = new MatTableDataSource(this.trainings);
          console.log("TAILLE DU TABLEAU : " + this.datasource.data.length)
          // this.datasource.paginator = this.paginator;
        },
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(trainingSubscription)
  }

  /* Generate Invoice */
  onGenerateInvoice() {
    // this.invoicingService.generateInvoiceWithMultipleTrainings(this.selection.selected, this.selection.selected[0].client)
    const trainingInvoice: TrainingInvoice = {
      idClient: this.selection.selected[0].idClient,
      trainings: this.selection.selected,
      editor: this.userProfile.firstName + ' ' + this.userProfile.lastName
    }
    const saveTrainingInvoiceSubscription = this.invoicingService.saveTrainingInvoice(trainingInvoice)
      .subscribe({
        next: data => {
          data.trainings.forEach(training => {
            const updateLifeCycleSubscription = this.trainingService.updateLifeCycle(training.idTraining, training)
              .subscribe({
                next: value => {
                  this.router.navigate(['invoicing'])
                },
                error: err => {
                  console.log(err.message)
                }
              })
            this.subscriptions.push(updateLifeCycleSubscription)
          })
        },
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(saveTrainingInvoiceSubscription)
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

  onGoToValidate() {
    const trainingInvoice: TrainingInvoice = {
      idClient: this.selection.selected[0].idClient,
      trainings: this.selection.selected,
      editor: this.userProfile.firstName + ' ' + this.userProfile.lastName
    }

    const idTrainings : Array<number> = []
    trainingInvoice.trainings.forEach(training => {
      idTrainings.push(training.idTraining)
    })
    this.router.navigate(['invoicing/validate-client-training', idTrainings])
  }
}
