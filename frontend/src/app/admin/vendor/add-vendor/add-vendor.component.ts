import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {VendorService} from "../../../_services/vendor.service";
import {Router} from "@angular/router";
import {Vendor} from "../../../../models/vendor.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrl: './add-vendor.component.scss'
})
export class AddVendorComponent implements OnInit {
  addVendorForm!: FormGroup;
  private selectedRIB!: File;
  private selectedCV!: File;
  private selectedContract!: File;
  private selectedConvention!: File;
  private selectedCTR!: File;
  @ViewChild('fileInput') fileInput!: ElementRef;
  vendor! : Vendor
  private selectedFile!: File;

  constructor(private vendorService: VendorService,
              private formBuilder: FormBuilder,
              private router : Router,
              private snackBar: MatSnackBar,) {
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.addVendorForm = this.formBuilder.group({
      status: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      nameMainContact: ['', [Validators.required]],
      phoneNumberMainContact: ['', [Validators.required]],
      emailMainContact: ['', [Validators.required, Validators.email]],
      positionMainContact: ['', [Validators.required]],
      bankAccountNumber: ['', [Validators.required]],
      deadline: ['', [Validators.required]],
      service: ['', [Validators.required]],
      cnss: ['', [Validators.required]],
      name: ['', [Validators.required]],
      nic: ['', []],
      ice: ['', [Validators.required]],
      fi: ['', [Validators.required]],
      rc: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      tp: ['', [Validators.required]],
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

  onRIBChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedRIB = event.target.files[0];
  }

  onCVChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedCV = event.target.files[0];
  }

  onContractChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedContract = event.target.files[0];
  }

  onConventionChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedConvention = event.target.files[0];
  }

  onCTRChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedCTR = event.target.files[0];
  }

  clearFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return; // early return if no file selected
    this.selectedFile = file;
  }

  onSubmit() {
    if (this.addVendorForm.value){
      this.vendor = {
        ...this.addVendorForm.value
      }
      console.log(this.vendor);

      const formData : FormData = new FormData()
      formData.append('vendorData', JSON.stringify(this.vendor))
      if (this.selectedRIB) {
        formData.append('rib', this.selectedRIB)
      }
      if (this.selectedCV) {
        formData.append('cv', this.selectedCV)
      }
      if (this.selectedContract) {
        formData.append('contract', this.selectedContract)
      }
      if (this.selectedConvention) {
        formData.append('convention', this.selectedConvention)
      }
      if (this.selectedContract) {
        formData.append('ctr', this.selectedCTR)
      }

      this.vendorService.addVendor(formData)
        .subscribe({
          next : value => {
            this.router.navigate(['vendor'])
            this.snackBar.open('Le Fournisseur ' + value.name + ' a été ajouté avec Succès', 'Fermer', {
              duration: 4000,
              panelClass : ['green-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            })
          },
          error: error => console.log(error)
        })
    }
  }
}
