import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ClientModel} from "../../../../models/client.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ClientService} from "../../../_services/client.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTabGroup} from "@angular/material/tabs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss'
})
export class EditClientComponent implements OnInit, OnDestroy {
  idClient!: number
  updateClientForm!: FormGroup
  client!: ClientModel
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  private subscriptions: Subscription[] = [];

  constructor(private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,) {
    this.idClient = this.route.snapshot.params['idClient']
    this.getClient(this.idClient)
  }

  ngOnInit() {
    if (this.client?.deadline) {
      this.updateClientForm.get('deadline')?.setValue(this.client?.deadline)
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  buildUpdateClientForm() {
    this.updateClientForm = this.fb.group({
      idClient: [this.client.idClient],
      corporateName: [this.client.corporateName],
      address: [this.client.address],
      email: [this.client.email],
      phoneNumber: [this.client.phoneNumber],
      website: [this.client.website],
      nameMainContact: [this.client.nameMainContact],
      emailMainContact: [this.client.emailMainContact],
      phoneNumberMainContact: [this.client.phoneNumberMainContact],
      positionMainContact: [this.client.positionMainContact],
      commonCompanyIdentifier: [this.client.commonCompanyIdentifier],
      taxRegistration: [this.client.taxRegistration],
      commercialRegister: [this.client.commercialRegister],
      professionalTax: [this.client.professionalTax],
      cnss: [this.client.cnss],
      field: [this.client.field],
      status: [this.client.status],
      deadline: [this.client.deadline],
      limitAmount: [this.client.limitAmount]
    })
  }

  getDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  getClient(idClient: number) {
    const clientSubscription = this.clientService.getClient(idClient)
      .subscribe({
        next: data => {
          this.client = data
          this.buildUpdateClientForm()
        },
        error: err => {
          console.error(err.message)
        }
      })
    this.subscriptions.push(clientSubscription)
  }

  updateClient() {
    const client = this.updateClientForm.value
    const updateClientSubscription = this.clientService.updateClient(client)
      .subscribe({
        next: data => {
          this.router.navigateByUrl("client")
          this.snackBar.open('Le Client ' + data.corporateName + ' a été modifié avec Succès', 'Fermer', {
            duration: 4000,
            panelClass: ['green-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          })
        },
        error: err => {
          console.error(err.message)
        }
      })
    this.subscriptions.push(updateClientSubscription)
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
}
