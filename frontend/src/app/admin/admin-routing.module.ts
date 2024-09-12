import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FullComponent} from "./layout/full/full.component";
import {WelcomeComponent} from "./welcome/welcome.component";

const routes: Routes = [
  {
    path : '',
    component : FullComponent,
    children : [
      {
        path : '',
        component : WelcomeComponent,
        data : {
          title: 'Bienvenu(e)'
        }
      },
      {
        path : 'client',
        loadChildren : () => import('./client/client.module')
          .then(m => m.ClientModule),
      },
      {
        path : 'instructor',
        loadChildren : () => import('./instructor/instructor.module')
          .then(m => m.InstructorModule),
      },
      {
        path : 'vendor',
        loadChildren : () => import('./vendor/vendor.module')
          .then(m => m.VendorModule),
      },
      {
        path : 'training',
        loadChildren : () => import('./training/training.module')
          .then(m => m.TrainingModule)
      },
      {
        path : 'agenda',
        loadChildren : () => import('./agenda/agenda.module')
          .then(m => m.AgendaModule),
      },
      {
        path : 'invoicing',
        loadChildren : () => import('./invoicing/invoicing.module')
          .then(m => m.InvoicingModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
