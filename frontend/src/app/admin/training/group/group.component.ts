import {Component, Inject, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {GroupModel, TrainingModel} from "../../../../models/training.model";
import {DatesService} from "../../../_services/dates.service";
import {firstValueFrom, Subscription} from "rxjs";
import {TrainingLifecycleDialogContentComponent} from "../training/training.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {GroupService} from "../../../_services/group.service";
import {TrainingLifecycleDialogComponent} from "../detail-training/detail-training.component";

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit, OnDestroy{
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  displayedColumns: string[] = ['group', 'supplier', 'dates', 'staff', 'status', 'action'];
  groups! : Array<GroupModel>

  private subscriptions: Subscription[] = []


  constructor(private groupService : GroupService,
              public dateService : DatesService,
              public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.getGroups()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  getGroups() {
    const groupSubscription = this.groupService.getGroups().subscribe({
      next : data => {
        this.groups = data
        this.dataSource = new MatTableDataSource(this.groups)
        this.dataSource.paginator = this.paginator
      }
    })
    this.subscriptions.push(groupSubscription)
  }

  /* Group Life Cycle*/
  openLifeCycleDialog(action: string, obj: GroupModel) {
    const dialogRef = this.dialog.open(LifecycleDialogContentComponent, {
      data: {
        obj: obj,
        action: action
      }
    })
    const openLifeCycleSubscription = dialogRef.afterClosed().subscribe((result) => {
      if (result.event == 'lifeCycle') {
        this.updateLifeCycle(result.data)
      }
    })

    this.subscriptions.push(openLifeCycleSubscription)
  }

  // Update group life cycle
  updateLifeCycle(group: GroupModel) {
    const updateLifeCycleSubscription = this.groupService.updateLifeCycle(group.idGroup, group)
      .subscribe({
        next: data => {
          this.getGroups()
        },
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(updateLifeCycleSubscription)
  }
}

/***/

@Component({
  selector: 'lifecycle-dialog-content',
  templateUrl: 'lifecycle-dialog-content.html',
  styleUrl : './lifecycle-dialog-content.scss'
})

export class LifecycleDialogContentComponent{
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
              private groupService: GroupService,
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

  //Réinitialiser les checkbox en cas d'erreur
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
        this.local_data.groupLifeCycle[checkboxOrder[i]] = false;
      }
    }
  }

  // Update training life cycle
  updateLifeCycle(group: GroupModel): Promise<GroupModel> {
    return firstValueFrom(this.groupService.updateLifeCycle(group.idGroup, group));
  }

  checkSupplier(event: any) {
    if (!this.local_data.supplier || this.local_data.idVendor == null) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.groupLifeCycle.trainerSearch = false
      this.closeDialog()
      // appeler le dialog qui demande d'attribuer un formateur au groupe
    }
    this.resetCheckboxes('trainerSearch')
    this.updateLifeCycle(this.local_data)
      .then(() => {})
      .catch(err => {
        console.log(err.message)
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
    if (this.local_data.groupLifeCycle.kickOfMeeting && !this.local_data.groupLifeCycle.trainingSupport) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.groupLifeCycle.kickOfMeeting = false;
      // this.openLifeCycleDialog('pv', this.local_data)
    } else {
      this.local_data.groupLifeCycle.kickOfMeeting = false;
      this.resetCheckboxes('kickOfMeeting');
      this.updateLifeCycle(this.local_data)
        .then(() => {
          // this.removePv(this.local_data.idTraining)
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkTrainingSupport(event: any) {
    if (this.local_data.groupLifeCycle.trainingSupport && !this.local_data.groupLifeCycle.impression) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.groupLifeCycle.trainingSupport = false
      // this.openLifeCycleDialog('trainingSupport', this.local_data)
    } else {
      this.resetCheckboxes('trainingSupport');
      this.local_data.groupLifeCycle.trainingSupport = false
      this.updateLifeCycle(this.local_data)
        .then(() => {
          // this.removeTrainingSupport()
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
    if (this.local_data.groupLifeCycle.certif && !this.local_data.groupLifeCycle.invoicing) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.groupLifeCycle.certif = false
      // this.openLifeCycleDialog('trainingNotes', this.local_data)
    } else {
      this.local_data.groupLifeCycle.certif = false
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
    if (this.local_data.groupLifeCycle.invoicing && !this.local_data.groupLifeCycle.payment) {
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

  checkReference(event : any) {
    if (this.local_data.groupLifeCycle.reference) {
      event.preventDefault();
      event.stopPropagation();
      this.local_data.groupLifeCycle.reference = false
      // this.openLifeCycleDialog('referenceCertificate', this.local_data)
    } else {
      this.local_data.groupLifeCycle.reference = false
      this.resetCheckboxes('reference');
      this.updateLifeCycle(this.local_data)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  openLifeCycleDocumentsDialog(action: string, obj: GroupModel) {
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
}

/**/

/*****************************************************************************************/
@Component({
  selector: 'training-life-cycle-dialog',
  templateUrl: 'training-life-cycle-dialog.html'
})
export class LifecycleDocumentsDialogComponent {
  action!: string;
  local_data: any
  pv!: string
  selectedTrainingSupport!: File
  selectedReferenceCertificate!: File
  selectedPresenceList!: File
  selectedEvaluation!: File
  private subscriptions : Subscription[] = []

  constructor(public dialogRef: MatDialogRef<TrainingLifecycleDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              public dialog: MatDialog,
              private groupService: GroupService) {
    this.local_data = {...data.obj}
    this.action = data.action
    this.selectedTrainingSupport = this.local_data.trainingSupport
  }

  doAction(local_data: GroupModel) {
    this.dialogRef.close({event: this.action, data: local_data});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }


  onAddPV() {
    this.groupService.addPv(this.pv, this.local_data.idGroup)
      .subscribe({
        next: value => {
          value.groupLifeCycle.kickOfMeeting = true
          this.doAction(value)
        },
        error: err => {
          console.log(err.message)
        }
      })
  }

  onTrainingSupportChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedTrainingSupport = event.target.files[0];
    console.log(event.target.files[0])
  }

  onSubmitTrainingSupport() {
    const formData: FormData = new FormData()
    if (this.selectedTrainingSupport) {
      formData.append('trainingSupport', this.selectedTrainingSupport)
    }

    this.groupService.addTrainingSupport(formData, this.local_data.idGroup)
      .subscribe({
        next: data => {
          data.groupLifeCycle.trainingSupport = true
          this.doAction(data)
        },
        error: error => {
          console.log(error.message)
        }
      })
  }

  onReferenceCertificateChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedReferenceCertificate = event.target.files[0];
    console.log(event.target.files[0])
  }

  onSubmitReferenceCertificate() {
    const formData: FormData = new FormData()
    if (this.selectedReferenceCertificate) {
      formData.append('referenceCertificate', this.selectedReferenceCertificate)
    }

    this.groupService.addReferenceCertificate(formData, this.local_data.idGroup)
      .subscribe({
        next: data => {
          data.groupLifeCycle.reference = true
          this.doAction(data)
        },
        error: error => {
          console.log(error.message)
        }
      })
  }


  onPresenceListChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedPresenceList = event.target.files[0];
    console.log(event.target.files[0])
  }

  onEvaluationChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedEvaluation = event.target.files[0];
    console.log(event.target.files[0])
  }


  onSubmitTrainingNotes() {
    const formData: FormData = new FormData()
    if (this.selectedPresenceList) {
      formData.append('presenceList', this.selectedPresenceList)
    }
    if (this.selectedEvaluation) {
      formData.append('evaluation', this.selectedEvaluation)
    }

    this.groupService.addTrainingNotes(formData, this.local_data.idGroup)
      .subscribe({
        next: data => {
          data.groupLifeCycle.certif = true
          this.doAction(data)
        },
        error: error => {
          console.log(error.message)
        }
      })
  }
}
