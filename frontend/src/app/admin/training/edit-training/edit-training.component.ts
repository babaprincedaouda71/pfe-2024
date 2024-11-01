import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {GroupModel, TrainingModel} from "../../../../models/training.model";
import {ActivatedRoute, Router} from "@angular/router";
import {TrainingService} from "../../../_services/training.service";
import {ClientModel} from "../../../../models/client.model";
import {Vendor} from "../../../../models/vendor.model";
import {ClientService} from "../../../_services/client.service";
import {VendorService} from "../../../_services/vendor.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {positiveNumberValidator} from "../../../_validators/positiveNumberValidator";

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrl: './edit-training.component.scss'
})
export class EditTrainingComponent implements OnInit, OnDestroy {
  updateTrainingForm!: FormGroup;
  training!: TrainingModel;
  idTraining!: number
  clients!: ClientModel[]
  vendors!: Vendor[]
  minStartDate!: string
  minEndDate!: string
  isToggleChecked!: boolean
  private subscriptions: Subscription[] = []

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private trainingService: TrainingService,
              private router: Router,
              private clientService: ClientService,
              private vendorService: VendorService,
              private snackBar: MatSnackBar) {
  }

  get trainingGroups() {
    return (this.updateTrainingForm.get('groups') as FormArray).controls
  }

  ngOnInit() {
    this.idTraining = this.route.snapshot.params['idTraining']
    this.getTraining(this.idTraining)
    this.getClients()
    this.getVendors()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /* ***************** Edit Form **************** */
  private buildEditForm() {
    this.updateTrainingForm = this.formBuilder.group({
      idTraining: [this.training.idTraining, [Validators.required]],
      idClient: [this.training.idClient, [Validators.required]],
      theme: [this.training.theme, [Validators.required]],
      days: [this.training.days],
      staff: [this.training.staff],
      dailyAmount: [this.training.dailyAmount, [Validators.required, positiveNumberValidator]],
      groups: this.formBuilder.array(
        this.training.groups.map(group => {
          return this.initializeGroupForm(group)
        })
      ),
    })
  }

  initializeGroupForm(group: GroupModel): FormGroup {
    return this.formBuilder.group({
      idGroup: [group.idGroup],
      groupStaff: [group.groupStaff],
      location: [group.location],
      startDate: [group.startDate ? group.startDate : ''],
      endDate: [group.endDate ? group.endDate : ''],
      idVendor: [group.idVendor],
      groupDates: this.formBuilder.array(
        group.groupDates.map((date) => this.formBuilder.control(date))
      )
    })
  }

  addGroup() {
    const group: FormGroup = this.formBuilder.group({
      idGroup: [''],
      groupStaff: [''],
      location: [''],
      startDate: [''],
      endDate: [''],
      idVendor: [''],
      groupDates: this.formBuilder.array([this.formBuilder.control('')])
    });

    // Dynamically setting minEndDate for each new group
    const dateSubscription = group.get('startDate')?.valueChanges.subscribe((startDate: string) => {
      if (startDate) {
        group.get('endDate')?.setValidators([this.minEndDateValidator(startDate)]);
        this.minEndDate = startDate;
        group.get('endDate')?.updateValueAndValidity();
      }
    });

    if (dateSubscription) {
      this.subscriptions.push(dateSubscription)
    }

    (this.updateTrainingForm.get('groups') as FormArray).push(group)
  }

  // Custom validator for endDate to ensure it's greater than or equal to startDate
  minEndDateValidator(startDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const endDate = control.value;
      return endDate && startDate && endDate < startDate ? {minEndDate: true} : null;
    };
  }

  // Remove Group From Form
  removeGroup(index: number) {
    (this.updateTrainingForm.get('groups') as FormArray).removeAt(index)
  }

  // Get Dates as Array
  dates(group: AbstractControl) {
    return (group.get('groupDates') as FormArray).controls
  }

  // Add Date to Form
  addDate(groupIndex: number) {
    const control = this.formBuilder.control('');
    ((this.updateTrainingForm.get('groups') as FormArray).at(groupIndex).get('groupDates') as FormArray).push(control);
  }

  // Remove Date to Form
  removeDate(groupIndex: number, dateIndex: number) {
    ((this.updateTrainingForm.get('groups') as FormArray).at(groupIndex).get('groupDates') as FormArray).removeAt(dateIndex);
  }

  onSubmit() {
    const training: TrainingModel = this.updateTrainingForm.value
    training.amount = this.updateTrainingForm.get('dailyAmount')?.value * this.updateTrainingForm.get('days')?.value
    console.log(training)
    const updateTrainingSubscription = this.trainingService.updateTraining(training, this.idTraining)
      .subscribe({
        next: data => {
          this.router.navigate(['/training']);
          this.snackBar.open('La Formation ' + data.theme + ' a été modifiée avec Succès', 'Fermer', {
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
    this.subscriptions.push(updateTrainingSubscription)
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
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(clientsSubscription)
  }

  /*
  * Get All Vendors
  * */
  getVendors() {
    const vendorsSubscription = this.vendorService.getVendors()
      .subscribe({
        next: data => {
          this.vendors = data
        },
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(vendorsSubscription)
  }


  handleAdd(action: string) {
    if (action === 'client') {
      this.router.navigate(['client/add'])
    }
    if (action === 'vendor') {
      this.router.navigate(['vendor/add'])
    }
  }

  private getTraining(idTraining: number) {
    const trainingSubscription = this.trainingService.getTraining(idTraining)
      .subscribe({
        next: value => {
          this.training = value
          this.buildEditForm()
        },
        error: error => {
          console.log(error.message)
        }
      })
    this.subscriptions.push(trainingSubscription)
  }
}
