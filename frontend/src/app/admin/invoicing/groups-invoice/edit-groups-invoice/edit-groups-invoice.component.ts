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
import {TrainingService} from "../../../../_services/training.service";

@Component({
  selector: 'app-edit-groups-invoice',
  templateUrl: './edit-groups-invoice.component.html',
  styleUrl: './edit-groups-invoice.component.scss'
})
export class EditGroupsInvoiceComponent implements OnInit, OnDestroy {

  // Variables de données pour le formulaire, les formations et le client
  editTrainingInvoiceForm!: FormGroup;
  editGroupsInvoiceForm!: FormGroup;
  selectedDate: Date = new Date(); // Date sélectionnée pour la facture
  invoiceNumber: string = ''; // Numéro de facture
  selectedTrainings: TrainingModel[] = []; // Formations sélectionnées pour la facture
  client!: ClientModel; // Données du client lié à la facture
  displayedColumns: string[] = ['client', 'theme', 'group', 'staff', 'amount']; // Colonnes pour l'affichage des formations
  datasource!: MatTableDataSource<TrainingModel>; // Source de données pour la table
  selection = new SelectionModel<GroupModel>(true, []); // Sélection des groupes dans la table
  groups!: Array<GroupModel>; // Liste des groupes associés aux formations
  groupsIds!: Array<number>; // Identifiants uniques des groupes
  selectedGroupIds: Array<number> = []; // Identifiants des groupes sélectionnés
  deadline!: number; // Délai de paiement
  amount: number = 0; // Montant HT total de la facture
  tva!: number; // TVA calculée sur le montant
  ttc!: number; // Montant TTC
  travelF!: number; // Frais de déplacement

  private subscriptions: Subscription[] = []; // Liste des abonnements pour la gestion de mémoire
  private userProfile!: KeycloakProfile; // Profil utilisateur connecté

  // Constructeur injectant les services nécessaires
  constructor(
    private invoicingService: InvoicingService,
    private router: Router,
    private formBuilder: FormBuilder,
    private keycloakService: KeycloakService,
    private groupService: GroupService,
    private clientService: ClientService,
    private trainingService: TrainingService
  ) {
  }

  // Méthode appelée lors de l'initialisation du composant
  ngOnInit() {
    const selectedGroupIds = localStorage.getItem('selectedGroupIds');
    if (selectedGroupIds) {
      // Charge les formations filtrées pour les groupes sélectionnés
      this.selectedGroupIds = JSON.parse(selectedGroupIds);
      this.getFilteredTrainings(this.selectedGroupIds);
    }
    // Charge le profil utilisateur
    this.getUserProfile();
  }

  // Méthode appelée à la destruction du composant pour libérer les abonnements
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // Récupère les formations filtrées par les identifiants de groupe sélectionnés
  getFilteredTrainings(groupIds: Array<number>) {
    const trainingSubs = this.trainingService.getFilteredTrainings(groupIds).subscribe({
      next: data => {
        this.selectedTrainings = data;
        this.calculateAmountHT(this.selectedTrainings); // Calcule le montant HT
        this.datasource = new MatTableDataSource(this.selectedTrainings);
        this.getClient(this.selectedTrainings[0].idClient); // Récupère le client associé
        this.updateInvoiceNumber(); // Met à jour le numéro de facture
      },
      error: err => console.error(err.message)
    });
    this.subscriptions.push(trainingSubs);
  }

  // Calcule le montant HT total de la facture à partir des formations
  calculateAmountHT(trainings: TrainingModel[]) {
    trainings.forEach(training => {
      training.groups.forEach(group => {
        this.amount += group.groupAmount;
      });
    });
    this.getGroupsIds(trainings); // Récupère les identifiants de groupes uniques
  }

  // Récupère les informations du client à partir de l'identifiant du client
  getClient(clientId: number) {
    const clientSubs = this.clientService.getClient(clientId).subscribe({
      next: value => {
        this.client = value;
        this.deadline = this.client.deadline; // Définit le délai de paiement
        this.buildForm(); // Construit le formulaire avec les informations du client
      },
      error: err => console.error(err.message)
    });
    this.subscriptions.push(clientSubs);
  }

  // Récupère les identifiants de groupes uniques associés aux formations
  getGroupsIds(trainings: TrainingModel[]) {
    const uniqueGroupIds = new Set<number>();
    trainings.forEach(training => {
      training.groups.forEach(group => uniqueGroupIds.add(group.idGroup));
    });
    this.groupsIds = Array.from(uniqueGroupIds);
  }

  // Construit le formulaire de modification de la facture
  buildForm() {
    this.editGroupsInvoiceForm = this.formBuilder.group({
      idClient: [this.client.corporateName],
      numberInvoice: [this.invoiceNumber, [referenceValidator(this.selectedDate)]],
      createdAt: [new Date(), [Validators.required, Validators.minLength(6)]],
      travelFees: ['', [Validators.required]],
    });

    // Calcule la TVA sur le montant HT
    this.tva = this.amount * 0.2;

    // Abonnement aux modifications des frais de déplacement
    const travelExpensesSubscription = this.editGroupsInvoiceForm.get('travelFees')?.valueChanges.subscribe((travelFees) => {
      this.travelF = this.editGroupsInvoiceForm.get('travelFees')?.value;
      // Calcule le montant TTC en ajoutant la TVA et les frais de déplacement
      this.ttc = this.tva + this.travelF + this.amount;
    });

    if (travelExpensesSubscription) {
      this.subscriptions.push(travelExpensesSubscription);
    }
  }

  // Met à jour le numéro de facture en fonction de la date sélectionnée
  updateInvoiceNumber() {
    const year = this.selectedDate.getFullYear() % 100; // Récupère les deux derniers chiffres de l'année
    const month = this.selectedDate.getMonth() + 1; // Les mois commencent à 0 en JS

    this.invoicingService.getNextInvoiceNumber(year, month).subscribe((nextNum: string) => {
      this.invoiceNumber = nextNum;
    });
  }

  // Méthode déclenchée lors de la modification de la date
  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.updateInvoiceNumber();
  }

  // Charge le profil utilisateur si l'utilisateur est connecté
  getUserProfile() {
    if (this.keycloakService.isLoggedIn()) {
      this.keycloakService.loadUserProfile().then(profile => {
        this.userProfile = profile;
      });
    }
  }

  // Soumet la facture de groupes en enregistrant les données
  onSubmit() {
    const trainingInvoice: TrainingInvoice = {
      numberInvoice: this.invoiceNumber,
      idClient: this.selectedTrainings[0].idClient,
      trainings: this.selectedTrainings,
      groupsIds: this.groupsIds,
      editor: this.userProfile.firstName + ' ' + this.userProfile.lastName,
      ht: this.amount,
      tva: this.tva,
      travelFees: this.travelF,
      ttc: this.ttc,
      createdAt: this.editGroupsInvoiceForm.get('createdAt')?.value,
    };

    const saveInvoiceSubscription = this.invoicingService.saveGroupsInvoice(trainingInvoice).subscribe({
      next: data => {
        data.trainings.forEach(training => {
          training.groups.forEach(group => {
            const updateLifeCycleSubscription = this.groupService.updateLifeCycle(group.idGroup, group).subscribe({
              next: () => this.router.navigate(['invoicing']), // Redirection après mise à jour
              error: err => console.log("Erreur lors de la mise à jour")
            });
            this.subscriptions.push(updateLifeCycleSubscription);
          });
        });
      },
      error: err => console.log(err.message)
    });
    this.subscriptions.push(saveInvoiceSubscription);
  }
}
