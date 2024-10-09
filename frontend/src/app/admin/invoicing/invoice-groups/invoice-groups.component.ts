import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupService} from "../../../_services/group.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {GroupModel, TrainingModel} from "../../../../models/training.model";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-invoice-groups',
  templateUrl: './invoice-groups.component.html',
  styleUrl: './invoice-groups.component.scss'
})
export class InvoiceGroupsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'group',
    'theme',
    'dates',
    'amount',
    'select'
  ];
  idTraining!: number
  training!: TrainingModel
  groupsToBeInvoiced! : Array<GroupModel>
  datasource!: MatTableDataSource<GroupModel>;
  selection = new SelectionModel<GroupModel>(true, []);
  private subscriptions: Subscription[] = [];
  client!: string;
  theme!: string;

  constructor(private groupService: GroupService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,) {
    this.idTraining = this.route.snapshot.params['idTraining']
  }

  /***************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: GroupModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.idGroup + 1
    }`;
  }

  /** Handle checkbox change */
  onCheckboxChange(event: any, row: GroupModel): void {
    if (event.checked) {
      if (this.canSelect(row)) {
        this.selection.toggle(row);
      } else {
        event.source.checked = false;
        this.snackBar.open('Les Groupes sélectionnés doivent avoir le même Client et le même mois de date de réalisation.', 'Fermer', {
          duration: 5000,
          verticalPosition: "top",
          horizontalPosition: 'center'
        });
      }
    } else {
      this.selection.toggle(row);
    }
  }

  /** Check if the row can be selected */
  canSelect(row: GroupModel): boolean {
    if (this.selection.isEmpty()) {
      return true;
    }
    // return false
    const selectedClient = this.client;
    // const selectedMonth = new Date(this.selection.selected[0].completionDate).getMonth();
    const rowClient = this.client;
    // const rowMonth = new Date(row.completionDate).getMonth();
    //
    return selectedClient === rowClient;
  }

  /**************************/

  ngOnInit() {
    this.getGroupsByTraining()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  getGroupsByTraining() {
    const groupsByTrainingSubscriptions = this.groupService.getGroupsByTraining(this.idTraining)
      .subscribe({
        next: value => {
          this.training = value
          this.datasource = new MatTableDataSource(this.filterGroups(this.training))
          this.client = value.client.corporateName
          this.theme = value.theme
        },
        error: err => {
          console.log("Erreur de lors du chargement des groupes")
        }
      })
    this.subscriptions.push(groupsByTrainingSubscriptions)
  }

  filterGroups(training : TrainingModel) {
    return training.groups.filter(group => group.status === 'Facturation')
  }

  onGoToValidate() {

  }
}
