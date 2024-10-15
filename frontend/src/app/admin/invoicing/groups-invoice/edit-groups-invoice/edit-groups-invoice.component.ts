import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ClientService} from "../../../../_services/client.service";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {KeycloakService} from "keycloak-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ClientModel} from "../../../../../models/client.model";
import {MatTableDataSource} from "@angular/material/table";
import {GroupModel, TrainingModel} from "../../../../../models/training.model";
import {SelectionModel} from "@angular/cdk/collections";
import {KeycloakProfile} from "keycloak-js";
import {SelectionService} from "../../../../_services/selection.service";
import {referenceValidator} from "../../../../_validators/invoice-format.validator";
import {TrainingInvoice} from "../../../../../models/trainingInvoice";
import {GroupService} from "../../../../_services/group.service";
import {group} from "@angular/animations";

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
  datasource!: MatTableDataSource<TrainingModel>
  selection = new SelectionModel<GroupModel>(true, []);
  groups!: Array<GroupModel>
  private subscriptions: Subscription[] = []
  private userProfile!: KeycloakProfile;


  constructor(private invoicingService: InvoicingService,
              private router: Router,
              private formBuilder: FormBuilder,
              private keycloakService: KeycloakService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private selectionService: SelectionService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    const selectedTrainings = localStorage.getItem('selectedTrainings');
    if (selectedTrainings) {
      this.selectedTrainings = JSON.parse(selectedTrainings);
      this.datasource = new MatTableDataSource(this.selectedTrainings)
      this.buildForm()
      this.updateInvoiceNumber()
    }
    this.getUserProfile()
  }

  ngOnDestroy() {
  }

  buildForm() {
    this.editGroupsInvoiceForm = this.formBuilder.group({
      idClient: [this.selectedTrainings[0].client.corporateName, [Validators.required, Validators.minLength(6)]],
      numberInvoice: [this.invoiceNumber, [referenceValidator(this.selectedDate)]],
      createdAt: [new Date(), [Validators.required, Validators.minLength(6)]],
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
    this.selectedDate = event.value; // Mettre à jour la date sélectionnée
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
      editor: this.userProfile.firstName + ' ' + this.userProfile.lastName
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
