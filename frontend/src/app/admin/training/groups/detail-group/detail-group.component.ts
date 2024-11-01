import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupModel} from "../../../../../models/training.model";
import {MatTableDataSource} from "@angular/material/table";
import {firstValueFrom, Observable, Subscription} from "rxjs";
import {GroupService} from "../../../../_services/group.service";
import {LifecycleDocumentsDialogComponent} from "../../group/group.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {TrainingService} from "../../../../_services/training.service";

@Component({
  selector: 'app-detail-group',
  templateUrl: './detail-group.component.html',
  styleUrl: './detail-group.component.scss'
})
export class DetailGroupComponent implements OnInit, OnDestroy {
  datasource!: MatTableDataSource<GroupModel>
  group! : GroupModel
  private subscriptions : Subscription[] = [];

  presenceBytes!: Uint8Array | undefined
  evaluationBytes!: Uint8Array | undefined
  referenceBytes!: Uint8Array | undefined

  pdfUrl!: string | null;
  presenceUrl!: string | null;
  evaluationUrl!: string | null;
  referenceUrl!: string | null;

  constructor(private groupService : GroupService,
              private router : Router,
              private dialog : MatDialog,
              private trainingService : TrainingService) {
  }

  ngOnInit() {
    const group = localStorage.getItem('group')
    if (group) {
      this.group = JSON.parse(group) as GroupModel
      this.datasource = new MatTableDataSource([this.group])
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // Group documents
  private convertLogoToBytes() {
      if (this.group && this.group.presenceList) {
        // @ts-ignore
        const byteCharacters = atob(this.training.presenceList);
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        this.presenceBytes = new Uint8Array(byteNumbers);
        this.createPresenceUrl();
      }
      if (this.group && this.group.evaluation) {
        // @ts-ignore
        const byteCharacters = atob(this.training.evaluation);
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        this.evaluationBytes = new Uint8Array(byteNumbers);
        this.createEvaluationUrl();
      }

      if (this.group && this.group.referenceCertificate) {
        console.log("k,zee,k,k,cdc,dk,dkc,")
        // @ts-ignore
        const byteCharacters = atob(this.training.referenceCertificate);
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        this.referenceBytes = new Uint8Array(byteNumbers);
        this.createReferenceUrl();
      }
  }

  private createPresenceUrl() {
    if (this.presenceBytes) {
      const blob = new Blob([this.presenceBytes], {type: 'application/pdf'});
      this.presenceUrl = URL.createObjectURL(blob);
    } else {
      this.presenceUrl = null;
    }
  }

  private createEvaluationUrl() {
    if (this.evaluationBytes) {
      const blob = new Blob([this.evaluationBytes], {type: 'application/pdf'});
      this.evaluationUrl = URL.createObjectURL(blob);
    } else {
      this.evaluationUrl = null;
    }
  }

  private createReferenceUrl() {
    if (this.referenceBytes) {
      const blob = new Blob([this.referenceBytes], {type: 'application/pdf'});
      this.referenceUrl = URL.createObjectURL(blob);
    } else {
      this.referenceUrl = null;
    }
  }

  getPresenceListUrl() {
    return this.presenceUrl
  }

  getEvaluationUrl() {
    return this.evaluationUrl
  }

  getReferenceUrl() {
    return this.referenceUrl
  }

  /***************************** Cycle de vie **********************************/
  closeDialog(): void {
    // this.dialogRef.close({event: 'Cancel'});
  }

  // Update training life cycle
  updateLifeCycle(group: GroupModel): Promise<GroupModel> {
    return firstValueFrom(this.groupService.updateLifeCycle(group.idGroup, group));
  }

  checkSupplier(event: any) {
    if (!this.group.supplier || this.group.idVendor == null) {
      event.preventDefault();
      event.stopPropagation();
      this.group.groupLifeCycle.trainerSearch = false
      this.closeDialog()
      // appeler le dialog qui demande d'attribuer un formateur au groupe
    }
    this.removeTrainingNotes()
    this.removePv(this.group.idTraining)
    this.removeTrainingSupport()
    this.resetCheckboxes('trainerSearch')
    this.updateLifeCycle(this.group)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  checkValidation() {
    this.resetCheckboxes('trainerValidation');
    this.updateLifeCycle(this.group)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkIfPvExists(idTraining: number): Observable<boolean> {
    return this.trainingService.checkIfPvExists(idTraining);
  }

  checkKickOfMeeting(event: any) {
    if (this.group.groupLifeCycle.kickOfMeeting && !this.group.groupLifeCycle.trainingSupport) {
      event.preventDefault();
      event.stopPropagation();
      this.group.groupLifeCycle.kickOfMeeting = false;

      // Vérifier l'existence du PV avant de continuer
      this.checkIfPvExists(this.group.idTraining).subscribe((pvExists: boolean) => {
        if (pvExists) {
          // Cochez la checkbox si le PV existe
          this.group.groupLifeCycle.kickOfMeeting = true;
          this.resetCheckboxes('kickOfMeeting');
          this.updateLifeCycle(this.group)
            .then(() => {
            })
            .catch(err => {
              console.log(err.message);
            });
        } else {
          // Si le PV n'existe pas, ouvrez la boîte de dialogue pour le télécharger
          this.openLifeCycleDocumentsDialog('pv', this.group);
        }
      });


    } else {
      this.group.groupLifeCycle.kickOfMeeting = false;
      this.resetCheckboxes('kickOfMeeting');
      this.removePv(this.group.idGroup)
      this.removeTrainingNotes()
      this.removeTrainingSupport()
      this.updateLifeCycle(this.group)
        .then(() => {
          // this.removePv(this.group.idGroup)
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkIfTrainingSupportExists(idTraining: number): Observable<boolean> {
    return this.trainingService.checkIfTrainingSupportExists(idTraining);
  }

  checkTrainingSupport(event: any) {
    if (this.group.groupLifeCycle.trainingSupport && !this.group.groupLifeCycle.impression) {
      event.preventDefault();
      event.stopPropagation();
      this.group.groupLifeCycle.trainingSupport = false


      // Vérifier si le support de formation existe
      this.checkIfTrainingSupportExists(this.group.idTraining).subscribe((trainingSupportExists: boolean) => {
        if (trainingSupportExists) {
          // Cocher la case et continuer
          this.group.groupLifeCycle.trainingSupport = true
          this.resetCheckboxes('trainingSupport');
          this.updateLifeCycle(this.group)
            .then(() => {
              // Continuez le traitement ici, par exemple, supprimez le support de formation s'il existe
              // this.removeTrainingSupport(this.group.idGroup)
            })
            .catch(err => {
              console.log(err.message);
            });
        } else {
          this.openLifeCycleDocumentsDialog('trainingSupport', this.group)
        }
      })

    } else {
      this.resetCheckboxes('trainingSupport');
      this.group.groupLifeCycle.trainingSupport = false
      this.removeTrainingSupport()
      this.removeTrainingNotes()
      this.updateLifeCycle(this.group)
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
    this.updateLifeCycle(this.group)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkCompletion() {
    this.resetCheckboxes('completion');
    this.updateLifeCycle(this.group)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkCertif(event: any) {
    if (this.group.groupLifeCycle.certif && !this.group.groupLifeCycle.invoicing) {
      event.preventDefault();
      event.stopPropagation();
      this.group.groupLifeCycle.certif = false
      this.openLifeCycleDocumentsDialog('trainingNotes', this.group)
    } else {
      this.group.groupLifeCycle.certif = false
      this.resetCheckboxes('certif');
      this.removeTrainingNotes()
      this.updateLifeCycle(this.group)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkInvoicing(event: any) {
    if (this.group.groupLifeCycle.invoicing && !this.group.groupLifeCycle.payment) {
      event.preventDefault();
      event.stopPropagation();
      this.closeDialog()
      this.router.navigate([`invoicing/invoice-groups`])
    } else {
      this.resetCheckboxes('invoicing');
      this.updateLifeCycle(this.group)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  checkPayment() {
    this.resetCheckboxes('payment');
    this.updateLifeCycle(this.group)
      .then(() => {
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  checkReference(event: any) {
    if (this.group.groupLifeCycle.reference) {
      event.preventDefault();
      event.stopPropagation();
      this.group.groupLifeCycle.reference = false
      this.openLifeCycleDocumentsDialog('referenceCertificate', this.group)
    } else {
      this.group.groupLifeCycle.reference = false
      this.resetCheckboxes('reference');
      this.removeReferenceCertificate()
      this.updateLifeCycle(this.group)
        .then(() => {
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  removePv(idTraining: number) {
    const removePvSubscription = this.groupService.removePv(idTraining, this.group).subscribe({
      next: data => {
        this.updateLifeCycle(this.group)
          .then(() => {
          })
          .catch(err => {
            console.log(err.message);
          });
      },
      error: error => {
        console.log(error.message)
      }
    })
    this.subscriptions.push(removePvSubscription)
  }

  removeTrainingSupport() {
    const removeTrainingSupportSubscription = this.groupService.removeTrainingSupport(this.group.idTraining, this.group).subscribe({
      next: data => {
        this.updateLifeCycle(this.group)
          .then(() => {
            console.log(data)
          })
          .catch(err => {
            console.log(err.message);
          });
      },
      error: error => {
        console.log(error.message)
      }
    })
    this.subscriptions.push(removeTrainingSupportSubscription)
  }

  removeTrainingNotes() {
    const removeTrainingNotesSubscription = this.groupService.removeTrainingNotes(this.group.idTraining, this.group).subscribe({
      next: data => {
        this.updateLifeCycle(this.group)
          .then(() => {
          })
          .catch(err => {
            console.log(err.message);
          });
      },
      error: error => {
        console.log(error.message)
      }
    })
    this.subscriptions.push(removeTrainingNotesSubscription)
  }

  removeReferenceCertificate() {
    const removeReferenceCertificateSubscription = this.groupService.removeReferenceCertificate(this.group.idTraining, this.group).subscribe({
      next: data => {
        this.updateLifeCycle(this.group)
          .then(() => {
          })
          .catch(err => {
            console.log(err.message);
          });
      },
      error: error => {
        console.log(error.message)
      }
    })
    this.subscriptions.push(removeReferenceCertificateSubscription)
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
        // @ts-ignore
        this.group.groupLifeCycle[checkboxOrder[i]] = false;
      }
    }
  }

  openLifeCycleDocumentsDialog(action: string, obj: GroupModel) {
    const dialogRef = this.dialog.open(LifecycleDocumentsDialogComponent, {
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
        this.group = result.data
        this.updateLifeCycle(this.group)
          .then(() => {
          })
          .catch(err => {
            console.log(err.message);
          });
      }
    })
  }
}
