import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {GroupModel, TrainingModel} from "../../../../models/training.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {TrainingService} from "../../../_services/training.service";
import {KeycloakService} from "keycloak-angular";
import {ClientService} from "../../../_services/client.service";
import {ClientModel} from "../../../../models/client.model";
import {Vendor} from "../../../../models/vendor.model";
import {VendorService} from "../../../_services/vendor.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TrainingLifecycleDialogComponent} from "../detail-training/detail-training.component";
import {DatesService} from "../../../_services/dates.service";
import {Router} from "@angular/router";
import {firstValueFrom, Subscription} from "rxjs";
import {LifecycleDialogContentComponent} from "../group/group.component";
import {GroupService} from "../../../_services/group.service";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss'
})
export class TrainingComponent implements OnInit, OnDestroy {
  trainings!: TrainingModel[];
  clients!: ClientModel[];
  vendors!: Vendor[]
  datasource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  displayedColumns: string[] = ['client', 'theme', 'groups', 'vendor', 'dates', 'days', 'staff', 'status', 'action'];
  /*
  * Filter variables
  */
  filteredTrainings!: Array<TrainingModel>;
  // Déclarez une propriété pour stocker les formateurs uniques pour les contrôles de sélection
  uniqueVendors!: string[];
  // Déclarez une propriété pour stocker les clients uniques pour les contrôles de sélection
  uniqueClients!: string[];
  // Selected field value
  selectedClient!: any
  selectedVendor!: any
  selectedDate!: any
  selectedYear!: any
  selectedStatus!: any
  private subscriptions: Subscription[] = []

  constructor(private trainingService: TrainingService,
              private clientService: ClientService,
              private vendorService: VendorService,
              public keycloakService: KeycloakService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              public dateService: DatesService,
              private groupService: GroupService) {

  }

  ngOnInit() {
    this.getTrainings();
    this.getClients()
    this.getVendors()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  /*
  * Get All Trainings
  * */
  getTrainings() {
    const trainingSubscription = this.trainingService.getTrainings().subscribe({
      next: (data) => {
        this.trainings = data.map(training => ({
          ...training,
          groups: training.groups.map(group => ({
            ...group,
            idTraining: training.idTraining
          }))
        }));

        // Setup table data and pagination
        this.datasource = new MatTableDataSource(this.trainings);
        this.datasource.paginator = this.paginator;
        console.log(this.datasource)


        // Filter operations
        this.filteredTrainings = [...this.trainings];
        this.uniqueVendors = this.getAllUniqueVendors();
        this.uniqueClients = this.getAllUniqueClients();
      },
      error: (err) => {
        console.error('Error fetching trainings:', err.message);
      }
    });

    this.subscriptions.push(trainingSubscription);
  }


  /*
  * Get All Clients
  * */
  getClients() {
    const clientsSubscription = this.clientService.getClients()
      .subscribe({
        next: data => {
          this.clients = data
        },
        // error: err => {
        //   console.log(err.message)
        // }
      })
    this.subscriptions.push(clientsSubscription)
  }

  /*
  * Get All Vendors
  * */
  getVendors() {
    const vendorSubscription = this.vendorService.getVendors()
      .subscribe({
        next: data => {
          this.vendors = data
        },
        // error: err => {
        //   console.log(err.message)
        // }
      })
    this.subscriptions.push(vendorSubscription)
  }


  /*
   * Search Trainings
  * */
  search(keyword: string) {
    const results: TrainingModel[] = []
    for (const training of this.trainings) {
      if (training.theme.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || training.client.corporateName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || training.vendor.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || training.location.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        results.push(training)
        this.datasource = new MatTableDataSource(results);
        this.datasource.paginator = this.paginator;
        console.log(this.datasource.paginator)

      }
    }
    this.trainings = results
    if (results.length === 0 || !keyword) {
      this.getTrainings()
    }
  }

  /**
   * Advanced search
   * */

  // Get All Unique Vendors
  getAllUniqueVendors() {
    const vendors = new Set<string>()
    this.trainings.forEach(training => {
      vendors.add(training.vendor.name)
    })
    return Array.from(vendors)
  }

  // Fonction pour vérifier si deux dates sont les mêmes (même jour, mois et année)
  isSameDate(date1: number, date2: Date): boolean {
    return date1 === date2.getMonth()
  }


  // Get All Unique Client
  getAllUniqueClients() {
    const clients = new Set<string>()
    this.trainings.forEach(training => {
      clients.add(training.client.corporateName)
    })
    return Array.from(clients)
  }


  // ********** Start *************
  applyFilter(event: any, filterType: string) {
    const value = event.value.toLowerCase();
    if (value === '') {
      this.trainings = this.filteredTrainings.slice();
      this.datasource = new MatTableDataSource(this.trainings);
      this.datasource.paginator = this.paginator;
      console.log(this.datasource.paginator)

    } else {
      switch (filterType) {
        case 'vendor':
          this.trainings = this.filteredTrainings.filter(training =>
            `${training.vendor.name.toLowerCase()}` === value
          );
          this.resetFilter('vendor')
          break;
        case 'year':
          const selectedYear = parseInt(value, 10);
          this.trainings = this.filteredTrainings.filter(training => {
            if (!training.trainingDates) {
              return false;
            }
            const trainingDates = training.trainingDates.map(trainingDate => new Date(trainingDate));
            return trainingDates.some(trainingDate => this.isSameDate(selectedDate, trainingDate));
          });
          this.resetFilter('date')
          break;
        case 'date':
          const selectedDate = parseInt(value, 10);
          this.trainings = this.filteredTrainings.filter(training => {
            if (!training.trainingDates) {
              return false;
            }
            const trainingDates = training.trainingDates.map(trainingDate => new Date(trainingDate));
            return trainingDates.some(trainingDate => this.isSameDate(selectedDate, trainingDate));
          });
          this.resetFilter('date')
          break;
        case 'client':
          this.trainings = this.filteredTrainings.filter(training =>
            `${training.client.corporateName.toLowerCase()}` === value
          );
          this.resetFilter('client')
          break;
        case 'status':
          this.trainings = this.filteredTrainings.filter(training =>
            `${training.status.toLowerCase()}` === value.toLowerCase()
          );
          this.resetFilter('status')
          break;
        default:
          console.error(`Unknown filter type: ${filterType}`);
      }
      this.datasource = new MatTableDataSource(this.trainings);
      this.datasource.paginator = this.paginator;
      console.log(this.datasource.paginator)

    }
  }

  resetFilter(filterType: string) {
    if (filterType === 'vendor') {
      this.selectedStatus = null;
      this.selectedClient = null;
      this.selectedDate = null;
    }
    if (filterType === 'date') {
      this.selectedVendor = null;
      this.selectedStatus = null;
      this.selectedClient = null;
    }
    if (filterType === 'client') {
      this.selectedDate = null;
      this.selectedVendor = null;
      this.selectedStatus = null;
    }
    if (filterType === 'status') {
      this.selectedClient = null;
      this.selectedVendor = null;
      this.selectedDate = null;
    }
  }

  // ********** End *************

  // Handle delete and update dialog
  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppTrainingDialogContentComponent, {
      data: {
        // form : this.buildClientForm(),
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
  deleteRowData(row_obj: TrainingModel): boolean | any {
    const deleteTrainingSubscription = this.trainingService.deleteTraining(row_obj.idTraining)
      .subscribe({
        next: data => {
          this.getTrainings()
          this.snackBar.open('La Formation ' + data.theme + ' a été supprimée avec Succès', 'Fermer', {
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
    this.subscriptions.push(deleteTrainingSubscription)
  }

  // Method to check if it's the las group
  isLastGroup(groups: GroupModel[], group: GroupModel): boolean {
    return groups[groups.length - 1] === group;
  }


  /********************************************************************************/
  /********* Gestion du cycle de vie du groupe *********/

  /* Group Life Cycle*/
  openLifeCycleDialog(action: string, group: GroupModel) {
    const dialogRef = this.dialog.open(LifecycleDialogContentComponent, {
      data: {
        obj: group,
        action: action,
      }
    })
    const openLifeCycleSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'lifeCycle') {
        this.updateLifeCycle(result.data)
      } else {
        this.getTrainings()
      }
    })

    this.subscriptions.push(openLifeCycleSubscription)
  }

  // Update group life cycle
  updateLifeCycle(group: GroupModel) {
    const updateLifeCycleSubscription = this.groupService.updateLifeCycle(group.idGroup, group)
      .subscribe({
        next: data => {
          this.getTrainings()
        },
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(updateLifeCycleSubscription)
  }

}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  templateUrl: 'training-dialog-content.html'
})

// tslint:disable-next-line: component-class-suffix
export class AppTrainingDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  constructor(public dialogRef: MatDialogRef<AppTrainingDialogContentComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup, obj: TrainingModel },
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


@Component({
  selector: 'training-lifecycle-dialog-content',
  templateUrl: 'training-lifecycle-dialog-content.html',
  styleUrl: './training-lifecycle-dialog-content.scss'
})
export class TrainingLifecycleDialogContentComponent {
  action!: string;
  local_data: any
  showTrainingSupportForm: boolean = false;
  showPV: boolean = false;
  pv!: string
  showCertifForm: boolean = false;
  selectedTrainingSupport!: File
  selectedPresenceList!: File
  selectedEvaluation!: File

  constructor(public dialogRef: MatDialogRef<TrainingLifecycleDialogContentComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private trainingService: TrainingService,
              private snackBar: MatSnackBar,
              private router: Router) {
    this.local_data = {...data.obj}
    this.action = data.action
    this.selectedTrainingSupport = this.local_data.trainingSupport
  }

  doAction() {
    this.dialogRef.close({event: this.action, data: this.local_data});
    this.snackBar.open('Le Cycle de Vie a été modifié avec Succès', 'Fermer', {
      duration: 4000,
      panelClass: ['green-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }

  /*
  * BLACK BOX AI CODE
  * */
  openLifeCycleDialog(action: string, obj: TrainingModel) {
    const dialogRef = this.dialog.open(TrainingLifecycleDialogComponent, {
      data: {
        obj: obj,
        action: action
      }
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'pv') {
        this.resetCheckboxes('kickOfMeeting');
      }
      if (result.event == 'trainingSupport') {
        this.resetCheckboxes('trainingSupport');
      }
      if (result.event == 'trainingNotes') {
        this.resetCheckboxes('certif');
      }
      if (result.event == 'referenceCertificate') {
        this.resetCheckboxes('reference');
      }
      if (result.data != undefined) {
        this.local_data = result.data
        this.updateLifeCycle(this.local_data)
          .then(() => {
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    })
  }

  removePv(idTraining: number) {
    this.trainingService.removePv(idTraining, this.local_data).subscribe({
      next: data => {
      },
      error: error => {
        console.log(error.message)
      }
    })
  }

  removeTrainingSupport() {
    this.trainingService.removeTrainingSupport(this.local_data.idTraining, this.local_data).subscribe({
      next: data => {
        console.log(data)
      },
      error: error => {
        console.log(error.message)
      }
    })
  }

  // Update training life cycle
  updateLifeCycle(training: TrainingModel): Promise<TrainingModel> {
    return firstValueFrom(this.trainingService.updateLifeCycle(training.idTraining, training));
  }


  checkVendor(event: any) {
    this.local_data.groups.forEach((group: GroupModel) => {
      if (!group.supplier || group.supplier.idVendor == null) {
        event.preventDefault();
        event.stopPropagation();
        this.local_data.lifeCycle.trainerSearch = false;
        this.closeDialog();
        // this.openErrorDialog(this.local_data);
      }
      this.resetCheckboxes('trainerSearch');
      this.updateLifeCycle(this.local_data)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    })
  }

  checkValidation() {
    this.resetCheckboxes('trainerValidation');
    this.updateLifeCycle(this.local_data)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkKickOfMeeting(event: any) {
    if (this.local_data.lifeCycle.kickOfMeeting && !this.local_data.lifeCycle.trainingSupport) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.lifeCycle.kickOfMeeting = false;
      this.openLifeCycleDialog('pv', this.local_data)
    } else {
      this.local_data.lifeCycle.kickOfMeeting = false;
      this.resetCheckboxes('kickOfMeeting');
      this.updateLifeCycle(this.local_data)
        .then(() => {
          this.removePv(this.local_data.idTraining)
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkTrainingSupport(event: any) {
    if (this.local_data.lifeCycle.trainingSupport && !this.local_data.lifeCycle.impression) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.lifeCycle.trainingSupport = false
      this.openLifeCycleDialog('trainingSupport', this.local_data)
    } else {
      this.resetCheckboxes('trainingSupport');
      this.local_data.lifeCycle.trainingSupport = false
      this.updateLifeCycle(this.local_data)
        .then(() => {
          this.removeTrainingSupport()
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkImpression() {
    this.resetCheckboxes('impression');
    this.updateLifeCycle(this.local_data)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkCompletion() {
    this.resetCheckboxes('completion');
    this.updateLifeCycle(this.local_data)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkCertif(event: any) {
    if (this.local_data.lifeCycle.certif && !this.local_data.lifeCycle.invoicing) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.lifeCycle.certif = false
      this.openLifeCycleDialog('trainingNotes', this.local_data)
    } else {
      this.local_data.lifeCycle.certif = false
      this.resetCheckboxes('certif');
      this.updateLifeCycle(this.local_data)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkInvoicing(event: any) {
    if (this.local_data.lifeCycle.invoicing && !this.local_data.lifeCycle.payment) {
      event.preventDefault();
      event.stopPropagation();
      this.closeDialog()
      this.router.navigate(['invoicing/client-training'])
    } else {
      this.resetCheckboxes('invoicing');
      this.updateLifeCycle(this.local_data)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkPayment() {
    this.resetCheckboxes('payment');
    this.updateLifeCycle(this.local_data)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkReference(event: any) {
    if (this.local_data.lifeCycle.reference) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.lifeCycle.reference = false
      this.openLifeCycleDialog('referenceCertificate', this.local_data)
    } else {
      this.local_data.lifeCycle.reference = false
      this.resetCheckboxes('reference');
      this.updateLifeCycle(this.local_data)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  onSubmitTrainingSupport() {
    const formData: FormData = new FormData()
    if (this.selectedTrainingSupport) {
      formData.append('trainingSupport', this.selectedTrainingSupport)
    }

    this.trainingService.addTrainingSupport(formData, this.local_data.idTraining)
      .subscribe({
        next: data => {
          console.log("OKKK")
          console.log(data)
          this.showTrainingSupportForm = false
        },
        error: error => {
          console.log(error.message)
        }
      })
  }

  /*
  * END BLACK BOX AI CODE
  * */

  onTrainingSupportChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedTrainingSupport = event.target.files[0];
  }

  onPresenceListChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedPresenceList = event.target.files[0];
  }

  onEvaluationChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedEvaluation = event.target.files[0];
  }

  onAddPV() {
    this.trainingService.addPv(this.pv, this.local_data.idTraining)
      .subscribe({
        next: value => {
          this.showPV = false
          console.log(value)
        },
        error: err => {
          console.log(err.message)
        }
      })
  }

  onSubmitTrainingNotes() {
    const formData: FormData = new FormData()
    if (this.selectedPresenceList) {
      formData.append('presenceList', this.selectedPresenceList)
    }
    if (this.selectedEvaluation) {
      formData.append('evaluation', this.selectedEvaluation)
    }

    this.trainingService.addTrainingNotes(formData, this.local_data.idTraining)
      .subscribe({
        next: data => {
          console.log("OKKK")
          console.log(data)
          this.showCertifForm = false
        },
        error: error => {
          console.log(error.message)
        }
      })
  }

  private resetCheckboxes(currentCheckbox: string) {
    const checkboxOrder = [
      'trainerSearch',
      'trainerValidation',
      'kickOfMeeting',
      'trainingSupport',
      'impression',
      'completion',
      'certif',
      'invoicing',
      'payment'
    ];

    const currentIndex = checkboxOrder.indexOf(currentCheckbox);
    if (currentIndex !== -1) {
      for (let i = currentIndex + 1; i < checkboxOrder.length; i++) {
        this.local_data.lifeCycle[checkboxOrder[i]] = false;
      }
    }
  }
}

/**  Cycle de vie du groupe */
