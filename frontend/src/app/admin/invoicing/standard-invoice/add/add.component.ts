import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {ClientModel} from "../../../../../models/client.model";
import {ClientService} from "../../../../_services/client.service";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {StandardInvoice} from "../../../../../models/standardInvoice";
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";
import {Router} from "@angular/router";
import {referenceValidator} from "../../../../_validators/invoice-format.validator";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit, OnDestroy {
  addStandardInvoiceForm!: FormGroup;
  clients!: Array<ClientModel>;
  displayedColumns: string[] = ['name', 'quantity', 'unitPrice', 'total'];
  deadline!: number;
  selectedDate: Date = new Date(); // Date sélectionnée dans le calendrier
  invoiceNumber: string = '';
  private userProfile!: KeycloakProfile;
  private subscriptions: Subscription[] = []
  tva : number = 0

  constructor(private formBuilder: FormBuilder,
              private clientService: ClientService,
              private invoicingService: InvoicingService,
              public keycloakService: KeycloakService,
              private router: Router,
              private snackBar: MatSnackBar) {
  }

  get productItem(): FormArray {
    return (this.addStandardInvoiceForm.get('products') as FormArray)
  }

  ngOnInit(): void {
    this.getUserProfile();
    this.buildForm()
    this.addProductItem()
    this.getClients()
    this.updateInvoiceNumber()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  getClients(): void {
    const clientsSubscribe = this.clientService.getClients()
      .subscribe({
        next: data => {
          this.clients = data
        },
        error: err => {
          console.log(err.message)
        }
      })
    this.subscriptions.push(clientsSubscribe)
  }

  buildForm() {
    this.addStandardInvoiceForm = this.formBuilder.group({
      createdAt: [new Date(), [Validators.required, Validators.minLength(6)]],
      idClient: [null, [Validators.required, Validators.minLength(6)]],
      numberInvoice: [this.invoiceNumber, [referenceValidator(this.selectedDate)]],
      addDeadline: [],
      products: this.formBuilder.array([]),
      totalHT: [{value: '', disabled: true}],
      // tva: [0.2, Validators.required],
      totalTravelExpenses: [{value: '', disabled: true}],
      totalTTC: [{value: '', disabled: true}],
    })

    // Ecouter les changements de sélection du client pour mettre à jour l'échéance
    const deadlineSubscription = this.addStandardInvoiceForm.get('idClient')?.valueChanges.subscribe((idClient) => {
      // Mettre en place la logique pour récupérer l'échéance en fonction du client sélectionné
      this.deadline = this.getDeadlineForClient(idClient);
    });

    if (deadlineSubscription) {
      this.subscriptions.push(deadlineSubscription)
    }
  }

  // Fonction pour obtenir l'échéance en fonction du client sélectionné
  getDeadlineForClient(clientId: number): number {
    const selectedClient = this.clients.find(client => client.idClient === clientId);

    if (selectedClient) {
      return selectedClient.deadline;
    } else {
      // Si aucun client correspondant n'est trouvé, retournez une valeur par défaut (0 ou une autre valeur appropriée)
      return 0;
    }
  }

  // Get Client
  getClient(idClient: number): ClientModel | undefined {
    return this.clients.find(client => client.idClient === idClient);
  }

  // get groupItemControls() {
  //   return this.groupItem.controls as FormGroup[];
  // }

  addProductItem() {
    const groupItem: FormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      travelExpenses: ['',],
      total: [{value: '', disabled: true}],
    });

    this.productItem.push(groupItem);
    this.addValueChangeSubscriptions(groupItem);

    // (this.addStandardInvoiceForm.get('groupItem') as FormArray).push(groupItem)
  }

  onSubmit() {
    const standardInvoice: StandardInvoice = this.addStandardInvoiceForm.value;
    standardInvoice.editor = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    standardInvoice.numberInvoice = this.invoiceNumber
    standardInvoice.ht = this.addStandardInvoiceForm.get('totalHT')?.value;
    standardInvoice.tva = this.tva
    standardInvoice.travelFees = this.addStandardInvoiceForm.get('totalTravelExpenses')?.value
    standardInvoice.ttc = this.addStandardInvoiceForm.get('totalTTC')?.value
    console.log("Numéro : " + standardInvoice.numberInvoice)
    const findInvoiceNumberSubscription = this.invoicingService.findInvoiceNumber(standardInvoice.numberInvoice)
      .subscribe({
        next: value => {
          if (value) {
            this.snackBar.open(`Il existe déjà une facture avec ce Numéro`, 'Fermer', {
              duration: 4000,
              horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
              verticalPosition: 'top', // 'top', 'bottom'
            })
          } else {
            this.saveInvoice(standardInvoice)
          }
        },
        error: err => {
          console.log(err.error.message)
        }
      })
    this.subscriptions.push(findInvoiceNumberSubscription)
  }

  saveInvoice(standardInvoice: StandardInvoice) {
    const saveStandardInvoiceSubscription = this.invoicingService.saveStandardInvoice(standardInvoice)
      .subscribe({
        next: data => {
          this.router.navigate(['invoicing'])
        },
        error: err => {
          console.log(err.message)
        }
      })
    // this.invoicingService.generateStandardInvoice(this.addStandardInvoiceForm.get('groupItem')?.value, this.getClient(this.addStandardInvoiceForm.get('idClient')?.value), this.addStandardInvoiceForm.get('reference')?.value);
    this.subscriptions.push(saveStandardInvoiceSubscription)
  }

  handleAdd() {
    this.router.navigate(['/client/add'])
  }

  removeProductItem(i: number) {
    this.productItem.removeAt(i); // Supprime la ligne du formulaire
    this.calculateTotals()
  }

  // User Profile
  getUserProfile() {
    if (this.keycloakService.isLoggedIn()) {
      this.keycloakService.loadUserProfile().then(
        profile => {
          this.userProfile = profile
        }
      )
    }
  }


  updateInvoiceNumber() {
    const year = this.selectedDate.getFullYear() % 100; // Récupérer les deux derniers chiffres de l'année
    const month = this.selectedDate.getMonth() + 1; // Les mois commencent à 0 en JS

    this.invoicingService.getNextInvoiceNumber(year, month).subscribe((nextNum: string) => {
      this.invoiceNumber = nextNum;
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.value; // Mettre à jour la date sélectionnée
    this.updateInvoiceNumber();
  }

  private addValueChangeSubscriptions(group: FormGroup) {
    const quantitySubscription = group.get('quantity')?.valueChanges.subscribe(() => {
      this.updateLineTotal(group);
      this.calculateTotals();
    });

    const unitPriceSubscription = group.get('unitPrice')?.valueChanges.subscribe(() => {
      this.updateLineTotal(group);
      this.calculateTotals();
    });

    const travelExpensesSubscription = group.get('travelExpenses')?.valueChanges.subscribe(() => {
      this.calculateTotals();
    });

    this.subscriptions.push(quantitySubscription!, unitPriceSubscription!, travelExpensesSubscription!);
  }

  private updateLineTotal(group: FormGroup) {
    const quantity = group.get('quantity')?.value || 0;
    const unitPrice = group.get('unitPrice')?.value || 0;
    const total = quantity * unitPrice;
    group.get('total')?.setValue(total, {emitEvent: false});
  }

  private calculateTotals() {
    let totalHT = 0;
    let totalTravelExpenses = 0;

    this.productItem.controls.forEach(control => {
      const total = control.get('total')?.value || 0;
      const travelExpenses = control.get('travelExpenses')?.value || 0;

      totalHT += total;
      this.tva = totalHT * 0.2;
      totalTravelExpenses += travelExpenses;
    });

    const totalTTC = totalHT + (totalHT * 0.2) + totalTravelExpenses;

    this.addStandardInvoiceForm.get('totalHT')?.setValue(totalHT, {emitEvent: false});
    this.addStandardInvoiceForm.get('totalTravelExpenses')?.setValue(totalTravelExpenses, {emitEvent: false});
    this.addStandardInvoiceForm.get('totalTTC')?.setValue(totalTTC, {emitEvent: false});
  }
}
