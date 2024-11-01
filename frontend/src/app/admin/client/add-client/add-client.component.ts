import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { ClientModel } from "../../../../models/client.model";
import { Router } from "@angular/router";
import { ClientService } from "../../../_services/client.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ColorService } from "../../../_services/color.service";
import { ColorModel } from "../../../../models/color.model";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { AppClientDialogContentComponent } from "../client/client.component";

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit, OnDestroy {
  addClientForm!: FormGroup;
  client!: ClientModel;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  availableColors: ColorModel[] = [];
  private selectedFile!: File;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    this.buildClientForm();
    this.getAvailableColors();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /*
   * Build Form
   */
  buildClientForm() {
    this.addClientForm = this.formBuilder.group({
      // Informations de l'Entreprise
      corporateName: ['', Validators.required],
      address: ['', Validators.required],
      // phoneNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      phoneNumber: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required, Validators.email]],
      website: ['', Validators.required],
      color: ['', Validators.required],
      // Informations du Contact Principal
      nameMainContact: ['', Validators.required],
      phoneNumberMainContact: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      emailMainContact: ['', [Validators.required, Validators.email]],
      positionMainContact: ['', Validators.required],
      // Identification de l'Entreprise
      commonCompanyIdentifier: ['', [Validators.required, Validators.maxLength(20)]],
      taxRegistration: ['', [Validators.required, Validators.maxLength(20)]],
      commercialRegister: ['', [Validators.required, Validators.maxLength(20)]],
      professionalTax: ['', [Validators.required, Validators.maxLength(20)]],
      cnss: ['', [Validators.required, Validators.maxLength(20)]],
      // Informations Générales sur l'Entreprise
      field: ['', Validators.required],
      status: ['', Validators.required],
      deadline: ['', Validators.required],
      limitAmount: ['', Validators.required]
    });
  }

  /*
   * Manage image file input
   */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return; // early return if no file selected
    this.selectedFile = file;
  }

  /*
   * Save a Client with Logo file
   */
  onSubmit() {
    if (this.addClientForm.invalid) {
      this.showSnackbar('Le formulaire contient des erreurs. Veuillez les corriger.', 'red-snackbar');
      return;
    }

    this.client = { ...this.addClientForm.value };
    const formData: FormData = this.createFormData();

    const addClientSubscription = this.clientService.addClient(formData)
      .subscribe({
        next: data => {
          this.addClientForm.reset();
          this.router.navigate(['client']);
          this.showSnackbar(`Le Client ${data.corporateName} a été ajouté avec succès`, 'green-snackbar');
        },
        error: err => {
          console.log(err.message);
          this.showSnackbar('Erreur lors de l\'ajout du client', 'red-snackbar');
        }
      });

    this.subscriptions.push(addClientSubscription);
  }

  /*
   * Create FormData
   */
  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('clientData', JSON.stringify(this.client));
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    } else {
      this.showSnackbar('Logo absent', 'red-snackbar');
    }
    return formData;
  }

  /*
   * Snackbar display utility
   */
  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 4000,
      panelClass: [panelClass],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  /*
   * Récupération des couleurs disponibles
   */
  getAvailableColors() {
    const colorSubscription = this.colorService.getAvailableColors()
      .subscribe({
        next: data => this.availableColors = data,
        error: err => console.log(err)
      });
    this.subscriptions.push(colorSubscription);
  }

  /*
   * Ouvrir la boîte de dialogue pour enregistrer un client
   */
  openDialog(action: string, obj: any) {
    this.client = { ...obj.value };
    obj.action = action;
    const dialogRef = this.dialog.open(AppClientDialogContentComponent, {
      data: { obj }
    });

    const openDialogSubscription = dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Save') {
        this.onSubmit();
      }
    });

    this.subscriptions.push(openDialogSubscription);
  }
}
