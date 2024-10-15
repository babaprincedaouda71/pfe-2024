import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupService} from "../../../../_services/group.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {GroupModel, TrainingModel} from "../../../../../models/training.model";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TrainingService} from "../../../../_services/training.service";
import {SelectionService} from "../../../../_services/selection.service";

@Component({
  selector: 'app-invoice-groups',
  templateUrl: './invoice-groups.component.html',
  styleUrl: './invoice-groups.component.scss'
})
export class InvoiceGroupsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'client',
    'theme',
    'group',
    'staff',
    'amount',
    'select'
  ];
  idTraining!: number
  training!: TrainingModel
  trainings!: TrainingModel[]
  groupsToBeInvoiced!: Array<GroupModel>
  datasource!: MatTableDataSource<TrainingModel>;
  selection = new SelectionModel<GroupModel>(true, []);
  client!: string;
  theme!: string;
  private subscriptions: Subscription[] = [];

  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private router: Router,
              private trainingService: TrainingService,
              private selectionService : SelectionService,) {
    this.idTraining = this.route.snapshot.params['idTraining']
  }

  /***************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
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

  /** The label for the checkbox on the passed group */
  checkboxLabel(group?: GroupModel): string {
    if (!group) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(group) ? 'deselect' : 'select'} group ${group.idGroup + 1}`;
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


  /**************************/

  ngOnInit() {
    // this.getGroupsToBeInvoiced()
    this.getGroups()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  // getGroupsToBeInvoiced() {
  //   const groupsByTrainingSubscriptions = this.groupService.getGroupsToBeInvoiced()
  //     .subscribe({
  //       next: value => {
  //         this.groupsToBeInvoiced = value
  //         this.datasource = new MatTableDataSource(this.groupsToBeInvoiced)
  //         console.log(this.groupsToBeInvoiced)
  //         // this.client = value.client.corporateName
  //         // this.theme = value.
  //       },
  //       error: err => {
  //         console.log("Erreur de lors du chargement des groupes")
  //       }
  //     })
  //   this.subscriptions.push(groupsByTrainingSubscriptions)
  // }

  getGroups() {
    const groupsByTrainingSubscriptions = this.trainingService.getTrainings().subscribe({
      next: value => {
        this.trainings = value
        this.datasource = new MatTableDataSource(this.filterGroups())
      },
      error: err => {
        console.log(err.messsage)
      }
    })
    this.subscriptions.push(groupsByTrainingSubscriptions)
  }

  filterGroups() {
    return this.trainings
      .map(training => {
        // Filtrer les groupes de chaque formation
        const filteredGroups = training.groups.filter(group => group.status === "Facturation");

        // Retourner la formation avec les groupes filtrés
        return {
          ...training,
          groups: filteredGroups
        };
      })
      // Filtrer les formations pour exclure celles sans groupes avec le statut "Facturation"
      .filter(training => training.groups.length > 0);
  }


  // Method to check if it's the las group
  isLastGroup(groups: GroupModel[], group: GroupModel): boolean {
    return groups[groups.length - 1] === group;
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


  onGoToValidate() {
    const selectedTrainings = this.getSelectedTrainings();

    // Stocker les données dans localStorage
    localStorage.setItem('selectedTrainings', JSON.stringify(selectedTrainings));

    // Naviguer vers la page cible
    this.router.navigate(['/invoicing/edit-groups-invoice'])
  }
}
