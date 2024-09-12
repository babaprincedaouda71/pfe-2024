import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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
  private selectedCV!: File;
  private selectedContract!: File;
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
      status: ['', []],
      phone: ['', []],
      email: ['', []],
      address: ['', []],
      bankAccountNumber: ['', []],
      deadline: ['', []],
      service: ['', []],
      cnss: ['', []],
      name: ['', []],
      nic: ['', []],
      ice: ['', []],
      fi: ['', []],
      rc: ['', []],
      subject: ['', []],
      tp: ['', []],
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

  onCVChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedCV = event.target.files[0];
  }

  onContractChange(event: any) {
    if (!event.target.files[0]) return
    this.selectedContract = event.target.files[0];
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

      const formData : FormData = new FormData()
      formData.append('vendorData', JSON.stringify(this.vendor))
      if (this.selectedCV) {
        formData.append('cv', this.selectedCV)
      }
      if (this.selectedContract) {
        formData.append('contract', this.selectedContract)
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
