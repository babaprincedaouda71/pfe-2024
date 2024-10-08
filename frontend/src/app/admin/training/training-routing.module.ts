import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrainingComponent} from "./training/training.component";
import {AddTrainingComponent} from "./add-training/add-training.component";
import {EditTrainingComponent} from "./edit-training/edit-training.component";
import {DetailTrainingComponent} from "./detail-training/detail-training.component";
import {GroupComponent} from "./group/group.component";

const routes: Routes = [
  {
    path : '',
    component: TrainingComponent,
    data : {
      title: 'Formation'
    }
  },
  {
    path : 'group',
    component: GroupComponent,
    data : {
      title: 'Groupes de Formation'
    }
  },
  {
    path : 'add',
    component: AddTrainingComponent,
    data : {
      title: 'Ajouter une Formation'
    }
  },
  {
    path : 'edit/:idTraining',
    component: EditTrainingComponent,
    data : {
      title: 'Modifier la Formation'
    }
  },
  {
    path : 'detail/:idTraining',
    component: DetailTrainingComponent,
    data : {
      title: 'Détail de la Formation'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRoutingModule { }
