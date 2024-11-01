import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import {ClientModel} from "../../../../../models/client.model";
import {KeycloakProfile} from "keycloak-js";
import {ClientService} from "../../../../_services/client.service";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {ActivatedRoute, Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {InvoiceModel} from "../../../../../models/invoice.model";
import {ProductItem, StandardInvoice} from "../../../../../models/standardInvoice";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnDestroy {
  editStandardInvoiceForm!: FormGroup;
  clients!: Array<ClientModel>;
  displayedColumns: string[] = ['name', 'quantity', 'unitPrice', 'total'];
  deadline!: number;
  idInvoice!: number
  invoice!: InvoiceModel;
  selectedDate: Date = new Date(); // Date sélectionnée dans le calendrier
  invoiceNumber: string = '';
  private userProfile!: KeycloakProfile;
  private subscriptions: Subscription[] = []


  constructor(private clientService: ClientService,
              private invoicingService: InvoicingService,
              private router: Router,
              private formBuilder: FormBuilder,
              private keycloakService: KeycloakService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar) {
  }

  get productItem(): FormArray {
    return (this.editStandardInvoiceForm.get('products') as FormArray)
  }

  ngOnInit() {
    this.idInvoice = this.route.snapshot.params['idInvoice'];
    this.getInvoice(this.idInvoice)
    this.getClients()
    this.getUserProfile()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getClients(): void {
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

  buildForm() {
    this.editStandardInvoiceForm = this.formBuilder.group({
      idClient: [this.invoice.idClient, [Validators.required, Validators.minLength(6)]],
      numberInvoice: [this.invoice.numberInvoice],
      createdAt: [this.invoice.createdAt, [Validators.required, Validators.minLength(6)]],
      products: this.formBuilder.array(
        this.invoice.products.map(product => {
          return this.initializeProductForm(product)
        })
      )
    })

    // Ecouter les changements de sélection du client pour mettre à jour l'échéance
    const deadlineSubscription = this.editStandardInvoiceForm.get('idClient')?.valueChanges.subscribe((idClient) => {
      // Mettre en place la logique pour récupérer l'échéance en fonction du client sélectionné
      this.deadline = this.getDeadlineForClient(idClient);
    });

    if (deadlineSubscription) {
      this.subscriptions.push(deadlineSubscription)
    }
  }

  initializeProductForm(product: ProductItem): FormGroup {
    return this.formBuilder.group({
      name: product.name,
      quantity: product.quantity,
      unitPrice: product.unitPrice,
      total: product.unitPrice * product.quantity
    })
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

  addProductItem() {
    const groupItem: FormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      total: [{value: '', disabled: true}],
    });

    this.productItem.push(groupItem);
    this.addValueChangeSubscriptions(groupItem);

    // (this.addStandardInvoiceForm.get('groupItem') as FormArray).push(groupItem)
  }

  removeProductItem(i: number) {
    this.productItem.removeAt(i); // Supprime la ligne du formulaire
  }

  onSubmit() {
    const standardInvoice: StandardInvoice = this.editStandardInvoiceForm.value;
    standardInvoice.editor = this.userProfile.firstName + ' ' + this.userProfile.lastName;
    standardInvoice.idInvoice = this.invoice.idInvoice
    const updateStandardInvoiceSubscription = this.invoicingService.updateStandardInvoice(standardInvoice)
      .subscribe({
        next: data => {
          this.router.navigate(['invoicing'])
        },
        error: err => {
          console.log(err.message)
        }
      })
    // // this.invoicingService.generateStandardInvoice(this.addStandardInvoiceForm.get('groupItem')?.value, this.getClient(this.addStandardInvoiceForm.get('idClient')?.value), this.addStandardInvoiceForm.get('reference')?.value);
    this.subscriptions.push(updateStandardInvoiceSubscription)
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

  handleAdd() {
    this.router.navigate(['/client/add'])
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

  private getInvoice(idInvoice: number) {
    const invoiceSubscription = this.invoicingService.getInvoice(idInvoice)
      .subscribe({
        next: data => {
          this.invoice = data;
          this.buildForm()
        },
        error: error => {
          console.log(error)
        }
      })
    this.subscriptions.push(invoiceSubscription)
  }

  private addValueChangeSubscriptions(group: FormGroup) {
    const quantitySubscription = group.get('quantity')?.valueChanges.subscribe(quantity => {
      const unitPrice = group.get('unitPrice')?.value || 0;
      group.get('total')?.setValue(quantity * unitPrice, {emitEvent: false});
    });

    const unitPriceSubscription = group.get('unitPrice')?.valueChanges.subscribe(unitPrice => {
      const quantity = group.get('quantity')?.value || 0;
      group.get('total')?.setValue(quantity * unitPrice, {emitEvent: false});
    });

    if (quantitySubscription) {
      this.subscriptions.push(quantitySubscription)
    }

    if (unitPriceSubscription) {
      this.subscriptions.push(unitPriceSubscription)
    }
  }
}
