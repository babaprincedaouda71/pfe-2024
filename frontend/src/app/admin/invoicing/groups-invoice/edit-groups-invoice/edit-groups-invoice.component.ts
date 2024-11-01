import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ClientService} from "../../../../_services/client.service";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {KeycloakService} from "keycloak-angular";
import {ClientModel} from "../../../../../models/client.model";
import {MatTableDataSource} from "@angular/material/table";
import {GroupModel, TrainingModel} from "../../../../../models/training.model";
import {SelectionModel} from "@angular/cdk/collections";
import {KeycloakProfile} from "keycloak-js";
import {referenceValidator} from "../../../../_validators/invoice-format.validator";
import {TrainingInvoice} from "../../../../../models/trainingInvoice";
import {GroupService} from "../../../../_services/group.service";

@Component({
  selector: 'app-edit-groups-invoice',
  templateUrl: './edit-groups-invoice.component.html',
  styleUrl: './edit-groups-invoice.component.scss'
})
export class EditGroupsInvoiceComponent implements OnInit, OnDestroy {
  editTrainingInvoiceForm!: FormGroup;
  selectedDate: Date = new Date(); // Date sélectionnée dans le calendrier
  invoiceNumber: string = '';
  selectedTrainings: TrainingModel[] = []; // Tableau pour stocker les formations sélectionnées
  editGroupsInvoiceForm!: FormGroup;
  clients!: Array<ClientModel>;
  displayedColumns: string[] = [
    'client',
    'theme',
    'group',
    'staff',
    'amount',
  ];
  deadline!: number;
  datasource!: MatTableDataSource<TrainingModel>
  selection = new SelectionModel<GroupModel>(true, []);
  groups!: Array<GroupModel>
  private subscriptions: Subscription[] = []
  private userProfile!: KeycloakProfile;

  tva! : number
  ttc! : number
  travelFees!: number

  amount : number = 0


  constructor(private invoicingService: InvoicingService,
              private router: Router,
              private formBuilder: FormBuilder,
              private keycloakService: KeycloakService,
              private groupService: GroupService,
              private clientService: ClientService,) {
  }

  ngOnInit() {
    const selectedTrainings = localStorage.getItem('selectedTrainings');
    if (selectedTrainings) {
      this.selectedTrainings = JSON.parse(selectedTrainings);
      this.calculateAmountHT(this.selectedTrainings)
      this.datasource = new MatTableDataSource(this.selectedTrainings)
      this.buildForm()
      this.getDeadlineForClient(this.selectedTrainings[0].idClient)
      this.updateInvoiceNumber()
    }
    this.getUserProfile()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  calculateAmountHT(trainings : TrainingModel[]) {
    trainings.forEach(training => {
      training.groups.forEach(group => {
        this.amount += group.groupAmount
      })
    })
  }

  buildForm() {
    this.editGroupsInvoiceForm = this.formBuilder.group({
      idClient: [this.selectedTrainings[0].client.corporateName, [Validators.required, Validators.minLength(6)]],
      numberInvoice: [this.invoiceNumber, [referenceValidator(this.selectedDate)]],
      createdAt: [new Date(), [Validators.required, Validators.minLength(6)]],
    })

    this.tva = this.amount * 0.2
    this.travelFees = 4500
    this.ttc = this.tva + this.travelFees + this.amount

    // const deadlineSubscription = this.editGroupsInvoiceForm.get('idClient')?.valueChanges.subscribe((idClient) => {
    //   // Mettre en place la logique pour récupérer l'échéance en fonction du client sélectionné
    //   this.getDeadlineForClient(idClient);
    // });
    //
    // if (deadlineSubscription) {
    //   this.subscriptions.push(deadlineSubscription)
    // }
  }

  // Fonction pour obtenir l'échéance en fonction du client sélectionné
  getDeadlineForClient(clientId: number) {
    this.clientService.getDeadline(clientId).subscribe({
      next: (deadline) => {
        if (deadline) {
          this.deadline = deadline;
        }
      }
    })
  }

  updateInvoiceNumber() {
    const year = this.selectedDate.getFullYear() % 100; // Récupérer les deux derniers chiffres de l'année
    const month = this.selectedDate.getMonth() + 1; // Les mois commencent à 0 en JS

    this.invoicingService.getNextInvoiceNumber(year, month).subscribe((nextNum: string) => {
      this.invoiceNumber = nextNum;
    });
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;// Mettre à jour la date sélectionnée
    console.log(this.selectedDate)
    this.updateInvoiceNumber();
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

  onSubmit() {
    const trainingInvoice: TrainingInvoice = {
      numberInvoice: this.invoiceNumber,
      idClient: this.selectedTrainings[0].idClient,
      trainings: this.selectedTrainings,
      editor: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      amount : this.amount,
      tva : this.tva
    }
    const saveInvoiceSubscription = this.invoicingService.saveGroupsInvoice(trainingInvoice).subscribe({
      next: data => {
        data.trainings.forEach(training => {
          training.groups.forEach(group => {
            const updateLifeCycleSubscription = this.groupService.updateLifeCycle(group.idGroup, group).subscribe({
              next: data => {
                this.router.navigate(['invoicing'])
              },
              error: err => {
                console.log("Erreur lors de la mise à jour")
              }
            })
            this.subscriptions.push(updateLifeCycleSubscription)
          })
        })
      },
      error: err => {
        console.log(err.message)
      }
    })
    this.subscriptions.push(saveInvoiceSubscription)
  }

  handleAdd() {

  }
}
