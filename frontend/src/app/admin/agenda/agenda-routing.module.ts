import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AgendaComponent} from "./agenda/agenda.component";

const routes: Routes = [
  {
    path : '',
    component: AgendaComponent,
    data : {
      title: 'Agenda',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgendaRoutingModule { }
