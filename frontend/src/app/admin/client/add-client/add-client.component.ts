import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTabGroup} from "@angular/material/tabs";
import {ClientModel} from "../../../../models/client.model";
import {Router} from "@angular/router";
import {ClientService} from "../../../_services/client.service";
import {DomSanitizer} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ColorService} from "../../../_services/color.service";
import {ColorModel} from "../../../../models/color.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent implements OnInit, OnDestroy {
  addClientForm!: FormGroup;
  client!: ClientModel
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  private selectedFile!: File;
  availableColors: ColorModel[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private clientService: ClientService,
              private sanitizer: DomSanitizer,
              private datePipe: DatePipe,
              private snackBar: MatSnackBar,
              private colorService: ColorService) {
  }

  ngOnInit() {
    this.buildClientForm()
    this.getAvailableColors()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /*
  * Build Form
  * */
  buildClientForm() {
    this.addClientForm = this.formBuilder.group({
      // Informations de l'Entreprise
      corporateName: ['', Validators.required],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      website: ['', [Validators.required]],
      color: ['', [Validators.required]],
      // Informations du Contact Principal
      nameMainContact: ['', [Validators.required]],
      phoneNumberMainContact: ['', [Validators.required]],
      emailMainContact: ['', [Validators.required, Validators.email]],
      positionMainContact: ['', [Validators.required]],
      // Identification de l'Entreprise
      commonCompanyIdentifier: ['', [Validators.required, Validators.maxLength(20)]],
      taxRegistration: ['', [Validators.required, Validators.maxLength(20)]],
      commercialRegister: ['', [Validators.required, Validators.maxLength(20)]],
      professionalTax: ['', [Validators.required, Validators.maxLength(20)]],
      cnss: ['', [Validators.required, Validators.maxLength(20)]],
      // Informations Générales sur l'Entreprise
      // logo: [''],
      field: ['', [Validators.required]],
      status: ['', [Validators.required]],
      deadline: ['', [Validators.required]],
      limitAmount: ['', [Validators.required]]
    });
  }

  /*
  * Manage image file input
  * */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return; // early return if no file selected
    this.selectedFile = file;
  }

  /*
  * Save a Client with Logo file
  * */
  onSubmit() {
    if (this.addClientForm.valid) {
      this.client = {
        ...this.addClientForm.value
      }
      console.log(this.client)
    }
    const formData: FormData = new FormData()
    formData.append('clientData', JSON.stringify(this.client))
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile)
    } else {
      alert("Logo absent")
    }
    const addClientSubscription = this.clientService.addClient(formData)
      .subscribe({
        next: data => {
          this.addClientForm.reset()
          console.log(data)
          this.router.navigate(['client'])
          this.snackBar.open('Le Client ' + data.corporateName + ' a été ajouté avec Succès', 'Fermer', {
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

    this.subscriptions.push(addClientSubscription)
  }

  goToNextTab() {
    const selectedIndex: number | null = this.tabGroup.selectedIndex;
    // @ts-ignore
    if (selectedIndex < this.tabGroup._tabs.length - 1) {
      // @ts-ignore
      this.tabGroup.selectedIndex = selectedIndex + 1;
    }
  }

  goToPreviousTab() {
    const selectedIndex = this.tabGroup.selectedIndex;
    // @ts-ignore
    if (selectedIndex > 0) {
      // @ts-ignore
      this.tabGroup.selectedIndex = selectedIndex - 1;
    }
  }

  hasPreviousTab() {
    // @ts-ignore
    return this.tabGroup.selectedIndex > 0;
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

  getAvailableColors() {
    const colorSubscription = this.colorService.getAvailableColors()
      .subscribe({
        next: data => {
          this.availableColors = data
        },
        error: err => {
          console.log(err)
        }
      })
    this.subscriptions.push(colorSubscription)
  }

}
