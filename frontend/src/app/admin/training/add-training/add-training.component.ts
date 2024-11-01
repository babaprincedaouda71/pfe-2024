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
import {ClientService} from "../../../_services/client.service";
import {ClientModel} from "../../../../models/client.model";
import {Vendor} from "../../../../models/vendor.model";
import {VendorService} from "../../../_services/vendor.service";
import {TrainingService} from "../../../_services/training.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTableDataSource} from "@angular/material/table";
import {TrainingModel} from "../../../../models/training.model";
import {Subscription} from "rxjs";
import {positiveNumberValidator} from "../../../_validators/positiveNumberValidator";
import {staffMatchValidator} from "../../../_validators/staffMatchValidator";

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrl: './add-training.component.scss'
})
export class AddTrainingComponent implements OnInit, OnDestroy {
  addTrainingForm!: FormGroup;
  clients!: ClientModel[];
  vendors!: Vendor[];
  datasource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['groupe', 'effectif', 'dates', 'lieu'];
  minStartDate!: string
  minEndDate!: string
  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private clientService: ClientService,
              private vendorService: VendorService,
              private trainingService: TrainingService,
              private router: Router,
              private snackBar: MatSnackBar,) {
  }

  //Get Group as Array
  get trainingGroups() {
    return (this.addTrainingForm.get('groups') as FormArray).controls
  }

  ngOnInit() {
    this.buildTrainingForm()
    this.getClients()
    this.getVendors()
    this.addGroup()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  /*
  * Build Form to add Training
  * */
  buildTrainingForm() {
    this.addTrainingForm = this.formBuilder.group({
      idClient: ['', [Validators.required]],
      theme: ['', [Validators.required]],
      days: ['', [Validators.required, positiveNumberValidator]],
      staff: ['', [Validators.required]],
      location: [''],
      dailyAmount: ['', [Validators.required, positiveNumberValidator]],
      groups: this.formBuilder.array([]),
    }, { validators: staffMatchValidator });
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
  * Group Management
  * */

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

  // Add Group To Form
  addGroup() {
    const group: FormGroup = this.formBuilder.group({
      groupStaff: [''],
      location: [''],
      startDate: [''],
      endDate: [''],
      idVendor: [''],
      groupDates: this.formBuilder.array([this.formBuilder.control('')]),
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

    (this.addTrainingForm.get('groups') as FormArray).push(group)

    if (dateSubscription) {
    }
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
    (this.addTrainingForm.get('groups') as FormArray).removeAt(index)
  }

  // Get Dates as Array
  dates(group: AbstractControl) {
    return (group.get('groupDates') as FormArray).controls
  }

  // Add Date to Form
  addDate(groupIndex: number) {
    const control = this.formBuilder.control('');
    ((this.addTrainingForm.get('groups') as FormArray).at(groupIndex).get('groupDates') as FormArray).push(control);
  }

  // Remove Date to Form
  removeDate(groupIndex: number, dateIndex: number) {
    ((this.addTrainingForm.get('groups') as FormArray).at(groupIndex).get('groupDates') as FormArray).removeAt(dateIndex);
  }

  /*
  * Save a Training
  * */
  onSubmit() {
    // console.log(this.addTrainingForm.value)
    const training: TrainingModel = this.addTrainingForm.value
    training.amount = this.addTrainingForm.get('dailyAmount')?.value * this.addTrainingForm.get('days')?.value
    console.log(training)
    const addTrainingSubscription = this.trainingService.addTraining(training)
      .subscribe({
        next: data => {
          this.router.navigate(['/training']);
          this.snackBar.open('La Formation ' + data.theme + ' a été ajoutée avec Succès', 'Fermer', {
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
    this.subscriptions.push(addTrainingSubscription)
  }

  handleAdd(action: string) {
    if (action === 'client') {
      this.router.navigate(['client/add'])
    }
    if (action === 'vendor') {
      this.router.navigate(['vendor/add'])
    }
  }
}
