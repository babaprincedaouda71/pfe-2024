import {Component, OnDestroy, OnInit} from '@angular/core';
import {Vendor} from "../../../../models/vendor.model";
import {ActivatedRoute, Router} from "@angular/router";
import {VendorService} from "../../../_services/vendor.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrl: './edit-vendor.component.scss'
})
export class EditVendorComponent implements OnInit, OnDestroy {
  vendor!: Vendor
  idVendor!: number;
  editVendorForm!: FormGroup
  private selectedFile!: File;
  private subscriptions: Subscription[] = []

  constructor(private route: ActivatedRoute,
              private vendorService: VendorService,
              private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,) {

  }

  ngOnInit() {
    this.idVendor = this.route.snapshot.params['idVendor']
    this.getVendor(this.idVendor)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getVendor(idVendor: number) {
    const vendorSubscription = this.vendorService.getVendor(idVendor)
      .subscribe({
        next: data => {
          this.vendor = data
          this.buildEditForm()
        },
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(vendorSubscription)
  }

  buildEditForm() {
    this.editVendorForm = this.fb.group({
      idVendor: [this.vendor.idVendor],
      status: [this.vendor.status, []],
      phone: [this.vendor.phone, []],
      email: [this.vendor.email, []],
      address: [this.vendor.address, []],
      nameMainContact: ['', [Validators.required]],
      phoneNumberMainContact: ['', [Validators.required]],
      emailMainContact: ['', [Validators.required, Validators.email]],
      positionMainContact: ['', [Validators.required]],
      bankAccountNumber: [this.vendor.bankAccountNumber, []],
      deadline: [this.vendor.deadline, []],
      service: [this.vendor.service, []],
      cnss: [this.vendor.cnss, []],
      name: [this.vendor.name, []],
      nic: [this.vendor.nic, []],
      ice: [this.vendor.ice, []],
      fi: [this.vendor.fi, []],
      rc: [this.vendor.rc, []],
      subject: [this.vendor.subject, []],
      tp: [this.vendor.tp, []],
    })
  }

  /*
  * Fonction pour recuperer la date du jour et filtrer le champs date
  * pour selectionner une date supérieure à la date jour
  * */
  getDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    // Ajoutez un zéro en tête si le jour ou le mois est inférieur à 10
    // const formattedDay = day < 10 ? '0' + day : day;
    // const formattedMonth = month < 10 ? '0' + month : month;

    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    // return `${formattedDay}-${formattedMonth}-${year}`;
  }

  onFileChange(event: any) {
    if (event.target.files) {
      this.selectedFile = event.target.files[0]
    }
  }

  onSubmit() {
    const addVendorSubscription = this.vendorService.updateVendor(this.editVendorForm.value)
      .subscribe({
        next: data => {
          this.router.navigate(['vendor'])
          this.snackBar.open('Le Fournisseur ' + data.name + ' a été modifié avec Succès', 'Fermer', {
            duration: 4000,
            panelClass: ['green-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
        },
        error: err => {
          console.error(err)
        }
      })
    this.subscriptions.push(addVendorSubscription)
  }
}
