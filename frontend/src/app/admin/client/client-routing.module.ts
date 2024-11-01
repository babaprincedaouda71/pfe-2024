import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientComponent} from "./client/client.component";
import {AddClientComponent} from "./add-client/add-client.component";
import {EditClientComponent} from "./edit-client/edit-client.component";
import {DetailClientComponent} from "./detail-client/detail-client.component";

const routes: Routes = [
  {
    path : '',
    component: ClientComponent,
    data : {
      title: 'Client'
    }
  },
  {
    path : 'add',
    component: AddClientComponent,
    data : {
      title: 'Ajouter un Client'
    }
  },
  {
    path : 'edit/:idClient',
    component: EditClientComponent,
    data : {
      title: 'Modifier le Client'
    }
  },
  {
    path : 'detail/:idClient',
    component: DetailClientComponent,
    data : {
      title: 'Détail du Client'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
