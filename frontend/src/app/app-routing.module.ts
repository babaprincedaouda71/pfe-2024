import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./_guards/auth.guard";
import {ErrorComponent} from "./_utils/error/error.component";

const routes: Routes = [
  {
    path : '',
    loadChildren : () => import('./admin/admin.module')
      .then(m => m.AdminModule),
    canActivate : [AuthGuard],
  },
  // {
  //   path : 'public',
  //   loadChildren : () => import('./public/public.module')
  //     .then(m => m.PublicModule),
  // },
  {
    path : '**',
    component : ErrorComponent
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
