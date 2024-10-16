import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {GroupModel, TrainingModel} from "../../../../../models/training.model";
import {SelectionModel} from "@angular/cdk/collections";
import {Subscription} from "rxjs";
import {KeycloakProfile} from "keycloak-js";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {ActivatedRoute, Router} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SelectionService} from "../../../../_services/selection.service";
import {GroupService} from "../../../../_services/group.service";
import {ClientService} from "../../../../_services/client.service";
import {InvoiceModel} from "../../../../../models/invoice.model";
import {ClientModel} from "../../../../../models/client.model";
import {referenceValidator} from "../../../../_validators/invoice-format.validator";
import {TrainingService} from "../../../../_services/training.service";
import {TrainingInvoice} from "../../../../../models/trainingInvoice";

@Component({
  selector: 'app-update-groups-invoice',
  templateUrl: './update-groups-invoice.component.html',
  styleUrl: './update-groups-invoice.component.scss'
})
export class UpdateGroupsInvoiceComponent implements OnInit, OnDestroy {
  updateGroupsInvoiceForm!: FormGroup;
  selectedDate: Date = new Date(); // Date sélectionnée dans le calendrier
  invoiceNumber: string = '';
  displayedColumns: string[] = [
    'client',
    'theme',
    'group',
    'staff',
    'amount',
    'select'
  ];
  deadline!: number;
  datasource!: MatTableDataSource<TrainingModel>
  selection = new SelectionModel<GroupModel>(true, []);
  groups!: Array<GroupModel>
  tva!: number
  ttc!: number
  travelFees!: number
  idInvoice!: number
  idClient!: number
  client!: ClientModel
  invoice!: InvoiceModel;
  trainings: Array<TrainingModel> = [];
  private subscriptions: Subscription[] = []
  private userProfile!: KeycloakProfile;

  constructor(
    private invoicingService: InvoicingService,
    private router: Router,
    private formBuilder: FormBuilder,
    private keycloakService: KeycloakService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private selectionService: SelectionService,
    private groupService: GroupService,
    private clientService: ClientService,
    private trainingService: TrainingService
  ) {
    this.idInvoice = this.route.snapshot.params['idInvoice']
    console.log(this.idInvoice)
  }

  ngOnInit() {
    this.getInvoice(this.idInvoice)
    this.getUserProfile()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getInvoice(idInvoice: number) {
    const invoiceSubscription = this.invoicingService.getInvoice(idInvoice)
      .subscribe({
        next: data => {
          this.invoice = data;
          this.getClient()
          // this.datasource = new MatTableDataSource(this.invoice.trainings)
        },
        error: error => {
          console.log(error)
        }
      })
    this.subscriptions.push(invoiceSubscription)
  }

  getClient() {
    const clientSubs = this.clientService.getClient(this.invoice.idClient)
      .subscribe({
        next: data => {
          this.client = data
          this.buildForm()
          this.getTrainingsByClient(this.invoice.idClient)
        },
        error: error => {
          console.log("Erreur lors de la recherche du client")
        }
      })
    this.subscriptions.push(clientSubs)
  }

  // getTrainingsByClient(idClient: number) {
  //   this.trainingService.getTrainingsByClient(idClient)
  //     .subscribe({
  //       next: data => {
  //         // this.trainings = data
  //         data.map(value => {
  //           // récupération des formations déjà dans la facture
  //           this.invoice.trainings.map(training => {
  //             if (value.idTraining == training.idTraining) {
  //               // Cocher les groupes déjà dans la facture
  //               value.groups.map(groupe => {
  //                 if (groupe.status === "Reglement") {
  //                   this.selection.toggle(groupe)
  //                 }
  //               })
  //
  //               this.trainings.push(value)
  //             }
  //           })
  //
  //           // Récupération des autres formations ayant le status facturation
  //           value.groups.map(group => {
  //             if (group.status === "Facturation") {
  //               // Vérifiez si la formation existe déjà dans `this.trainings` avant de l'ajouter
  //               const exists = this.trainings.find(training => training.idTraining === value.idTraining);
  //
  //               if (!exists) {
  //                 this.trainings.push(value); // Ajoutez la formation seulement si elle n'existe pas
  //               }
  //             }
  //           })
  //         })
  //
  //         // Filtrage des groupes
  //         this.trainings.map(training => {
  //           training.groups = training.groups.filter(group => {
  //             return group.status === "Facturation" || group.status === "Reglement";
  //           });
  //         });
  //
  //         console.log(this.trainings)
  //
  //         this.datasource = new MatTableDataSource(this.trainings);
  //       },
  //       error: err => {
  //         console.log(err.message)
  //       }
  //     })
  // }

  getTrainingsByClient(idClient: number) {
    this.trainingService.getTrainingsByClient(idClient).subscribe({
      next: data => {
        // Étape 1 : Récupérer toutes les formations pour le client
        data.map(training => {
          // Étape 2 : Vérifier si la formation est déjà dans la facture et ajouter à la liste
          const invoiceTraining = this.invoice.trainings.find(t => t.idTraining === training.idTraining);

          if (invoiceTraining) {
            // Cocher les groupes déjà dans la facture
            training.groups.forEach(group => {
              if (group.status === "Reglement") {
                this.selection.toggle(group); // Coche les groupes avec le statut "Reglement"
              }
            });
            this.trainings.push(training); // Ajouter à la liste des trainings
          } else {
            // Étape 3 : Récupérer les autres formations à l'étape "Facturation"
            const hasFacturationGroups = training.groups.some(group => group.status === "Facturation");

            if (hasFacturationGroups) {
              this.trainings.push(training); // Ajouter à la liste seulement si "Facturation"
            }
          }
        });

        // Étape 4 : Filtrer les groupes pour n'afficher que ceux à l'étape "Facturation" ou "Reglement"
        this.trainings = this.trainings.map(training => {
          training.groups = training.groups.filter(group => {
            return (group.status === "Facturation" || group.status === "Reglement");
          });
          return training; // Retourner la formation après filtrage
        });

        // Mise à jour de la datasource pour la table
        this.datasource = new MatTableDataSource(this.trainings);
        console.log(this.trainings);
      },
      error: err => {
        console.log(err.message);
      }
    });
  }

  buildForm() {
    this.updateGroupsInvoiceForm = this.formBuilder.group({
      // idClient: [this.invoice.idClient, [Validators.required, Validators.minLength(6)]],
      numberInvoice: [this.invoice.numberInvoice, [referenceValidator(this.selectedDate)]],
      createdAt: [this.invoice.createdAt, [Validators.required, Validators.minLength(6)]],
    })

    this.tva = this.invoice.trainings[0].amount * 2
    this.travelFees = 4500
    this.ttc = this.tva + this.travelFees

    // const deadlineSubscription = this.editGroupsInvoiceForm.get('idClient')?.valueChanges.subscribe((idClient) => {
    //   // Mettre en place la logique pour récupérer l'échéance en fonction du client sélectionné
    //   this.getDeadlineForClient(idClient);
    // });
    //
    // if (deadlineSubscription) {
    //   this.subscriptions.push(deadlineSubscription)
    // }
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

  // Récupérer les formations sélectionnées
  getSelectedTrainings(): TrainingModel[] {
    // Récupérer les groupes sélectionnés
    const selectedGroups = this.selection.selected;

    // Filtrer les formations contenant les groupes sélectionnés
    const selectedTrainings = this.trainings
      .map(training => {
        // Ne garder que les groupes de la formation qui sont sélectionnés
        const filteredGroups = training.groups.filter(group =>
          selectedGroups.includes(group)
        );

        // Retourner une copie de la formation avec uniquement les groupes sélectionnés
        if (filteredGroups.length > 0) {
          return {
            ...training, // Copier les autres propriétés de la formation
            groups: filteredGroups // Remplacer les groupes par les groupes sélectionnés
          };
        }
        return null;
      })
      .filter(training => training !== null); // Exclure les formations sans groupes sélectionnés

    return selectedTrainings as TrainingModel[]; // Retourner les formations avec les groupes sélectionnés
  }

  onSubmit() {
    const trainingInvoice : TrainingInvoice = {
      idInvoice : this.invoice.idInvoice,
      numberInvoice : this.invoice.numberInvoice,
      idClient : this.client.idClient,
      createdAt : this.invoice.createdAt.toString(),
      trainings : this.getSelectedTrainings(),
      editor : this.userProfile.firstName + ' ' + this.userProfile.lastName,
    }

    // Vérifier les données
    console.log(trainingInvoice)

    // Enregistrer
    // this.invoicingService.updateGroupsInvoice(trainingInvoice, trainingInvoice.idInvoice).subscribe({
    //   next : value => {
    //     this.router.navigate(['/admin/invoicing']);
    //   },
    //   error : err => {
    //     console.log("Erreur pendant la modification" + err.message)
    //   }
    // })
  }

  /*****************************************************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed group */
  checkboxLabel(group?: GroupModel): string {
    if (!group) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(group) ? 'deselect' : 'select'} group ${group.idGroup + 1}`;
  }

  /** Handle checkbox change for a specific group */
  onGroupCheckboxChange(event: any, group: GroupModel, row: any): void {
    if (event.checked) {
      if (this.canSelect(group, row)) {
        this.selection.toggle(group);
      } else {
        event.source.checked = false;
        this.snackBar.open('Les Groupes sélectionnés doivent avoir le même Client et le même mois de date de réalisation.', 'Fermer', {
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: 'center'
        });
      }
    } else {
      this.selection.toggle(group);
    }
  }

  /** Check if the group can be selected */
  canSelect(group: GroupModel, row: TrainingModel): boolean {
    // Si aucune sélection n'a été faite, permettre la sélection
    if (this.selection.isEmpty()) {
      return true;
    }

    // Récupère le premier groupe sélectionné
    const selectedGroup = this.selection.selected[0];

    // Récupère le 'TrainingModel' correspondant au premier groupe sélectionné
    const selectedTraining = this.trainings.find(training =>
      training.groups.some(g => g.idGroup === selectedGroup.idGroup)
    );

    if (!selectedTraining) {
      return false; // Si on ne trouve pas la formation correspondante, on empêche la sélection
    }

    // Comparer le client du training de la sélection avec celui du training actuel
    const selectedClient = selectedTraining.client.corporateName;
    const currentClient = row.client.corporateName;

    // Retourner 'true' si les clients sont les mêmes, sinon 'false'
    return selectedClient === currentClient;
  }

  /*****************************************************************/
}
