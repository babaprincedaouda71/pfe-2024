import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {VendorComponent} from "./vendor/vendor.component";
import {AddVendorComponent} from "./add-vendor/add-vendor.component";
import {EditVendorComponent} from "./edit-vendor/edit-vendor.component";
import {DetailVendorComponent} from "./detail-vendor/detail-vendor.component";

const routes: Routes = [
  {
    path : '',
    component: VendorComponent,
    data : {
      title: 'Fournisseur'
    }
  },
  {
    path : 'add',
    component : AddVendorComponent,
    data : {
      title: 'Ajouter Fournisseur'
    }
  },
  {
    path : 'edit/:idVendor',
    component : EditVendorComponent,
    data : {
      title: 'Modifier Fournisseur'
    }
  },
  {
    path : 'detail/:idVendor',
    component : DetailVendorComponent,
    data : {
      title: 'Détail Fournisseur'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
