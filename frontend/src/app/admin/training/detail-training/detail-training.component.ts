import {Component, Inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {TrainingModel} from "../../../../models/training.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TrainingService} from "../../../_services/training.service";
import {Subscription, switchMap} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {ErrorDialogComponent} from "../training/error-dialog/error-dialog.component";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DatesService} from "../../../_services/dates.service";

@Component({
  selector: 'app-detail-training',
  templateUrl: './detail-training.component.html',
  styleUrl: './detail-training.component.scss'
})
export class DetailTrainingComponent implements OnInit, OnDestroy {
  training!: TrainingModel
  idTraining!: number
  confirmFormVendor!: FormGroup;
  confirmFormClient!: FormGroup;
  datasource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['group', 'vendor', 'staff', 'dates', 'location'];
  pdfBytes!: Uint8Array | undefined
  presenceBytes!: Uint8Array | undefined
  evaluationBytes!: Uint8Array | undefined
  referenceBytes!: Uint8Array | undefined
  pdfUrl!: string | null;
  presenceUrl!: string | null;
  evaluationUrl!: string | null;
  referenceUrl!: string | null;
  private subscriptions : Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private trainingService: TrainingService,
              private router: Router,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              public dateService: DatesService) {
    this.idTraining = this.route.snapshot.params['idTraining']
    this.confirmFormVendor = this.formBuilder.group({
      receiver: [''], // Valeur par défaut pour receiver
      subject: [''], // Valeur par défaut pour subject
      body: [''] // Valeur par défaut pour body
    });
    this.confirmFormClient = this.formBuilder.group({
      receiver: [''], // Valeur par défaut pour receiver
      subject: [''], // Valeur par défaut pour subject
      body: [''] // Valeur par défaut pour body
    });
  }

  ngOnInit() {
    this.loadTraining();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  loadTraining() {
    const trainingSubscription = this.route.params.pipe(
      switchMap((params: Params) =>
        this.trainingService.getTraining(params['idTraining'])
      )
    ).subscribe({
      next: value => {
        this.training = value
        this.datasource = new MatTableDataSource(this.training.groups)
        // this.buildSendMailFormVendor()
        // this.buildSendMailFormClient()
        this.convertLogoToBytes()
      },
      error: error => {
      }
    })
    this.subscriptions.push(trainingSubscription);
  }

  // buildSendMailFormVendor() {
  //   this.confirmFormVendor = this.formBuilder.group({
  //     receiver: [this.training.vendor.email, [Validators.email]],
  //     subject: ['Confirmation des Détails de la formation'],
  //     body: [`Bonjour ${this.training.vendor.name} Nous vous écivons pour confirmer la formation prévu pour ${this.training.trainingDates}`]
  //   })
  // }

  // buildSendMailFormClient() {
  //   this.confirmFormClient = this.formBuilder.group({
  //     receiver: [this.training.client.email, [Validators.email]],
  //     subject: ['Confirmation des Détails de la formation'],
  //     body: [`Bonjour Monsieur ${this.training.client.nameMainContact} Nous vous écivons pour confirmer la formation prévu pour ${this.training.trainingDates}`]
  //   })
  // }

  // sendMail(receiver: string) {
  //   if (receiver === 'instructor') {
  //     document.getElementById('btn-closeIns')?.click()
  //     this.trainingService.sendMail(this.confirmFormVendor.value)
  //       .subscribe({
  //         next: value => {
  //           console.log(value)
  //         },
  //         error: err => {
  //           console.error(err.message)
  //         }
  //       })
  //   } else if (receiver === 'client') {
  //     document.getElementById('btn-closeCl')?.click()
  //     this.trainingService.sendMail(this.confirmFormClient.value)
  //       .subscribe({
  //         next: value => {
  //           console.log(value)
  //         },
  //         error: err => {
  //           console.error(err.message)
  //         }
  //       })
  //   }
  // }

  handleEdit(idTraining: number) {
    this.router.navigate([`training/edit/${idTraining}`])
  }

  /********** Printing Training Files **********/
  getTrainingSupportUrl() {
    return this.pdfUrl
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

  /*********** Training Life Cycle ***********/
  openErrorDialog(obj: TrainingModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: {
        obj: obj,
      }
    })
  }

  /********** End **********/

  private convertLogoToBytes() {
    if (this.training && this.training.trainingSupport) {
      // @ts-ignore
      const byteCharacters = atob(this.training.trainingSupport);
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      this.pdfBytes = new Uint8Array(byteNumbers);
      this.createPdfUrl();
    }
    if (this.training && this.training.presenceList) {
      // @ts-ignore
      const byteCharacters = atob(this.training.presenceList);
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      this.presenceBytes = new Uint8Array(byteNumbers);
      this.createPresenceUrl();
    }
    if (this.training && this.training.evaluation) {
      // @ts-ignore
      const byteCharacters = atob(this.training.evaluation);
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      this.evaluationBytes = new Uint8Array(byteNumbers);
      this.createEvaluationUrl();
    }

    if (this.training && this.training.referenceCertificate) {
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

  private createPdfUrl() {
    if (this.pdfBytes) {
      const blob = new Blob([this.pdfBytes], {type: 'application/pdf'});
      this.pdfUrl = URL.createObjectURL(blob);
    } else {
      this.pdfUrl = null;
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

  /********** End Life Cycle **********/
  onRowClick(row : any) {

    // Stocker les données dans localStorage
    localStorage.setItem('group', JSON.stringify(row));

    this.router.navigate(['training/detail-group'])
    console.log('Row clicked: ', row);
  }
}


/*****************************************************************************************/
@Component({
  selector: 'training-life-cycle-dialog',
  templateUrl: 'training-life-cycle-dialog.html'
})
export class TrainingLifecycleDialogComponent {
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
              private trainingService: TrainingService) {
    this.local_data = {...data.obj}
    this.action = data.action
    this.selectedTrainingSupport = this.local_data.trainingSupport
  }

  doAction(local_data: TrainingModel) {
    this.dialogRef.close({event: this.action, data: local_data});
  }

  closeDialog(): void {
    this.dialogRef.close({event: 'Cancel'});
  }


  onAddPV() {
    this.trainingService.addPv(this.pv, this.local_data.idTraining)
      .subscribe({
        next: value => {
          console.log(value.idTraining)
          value.lifeCycle.kickOfMeeting = true
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

    this.trainingService.addTrainingSupport(formData, this.local_data.idTraining)
      .subscribe({
        next: data => {
          data.lifeCycle.trainingSupport = true
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

    this.trainingService.addReferenceCertificate(formData, this.local_data.idTraining)
      .subscribe({
        next: data => {
          data.lifeCycle.reference = true
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

    this.trainingService.addTrainingNotes(formData, this.local_data.idTraining)
      .subscribe({
        next: data => {
          data.lifeCycle.certif = true
          this.doAction(data)
        },
        error: error => {
          console.log(error.message)
        }
      })
  }
}

