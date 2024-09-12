import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InvoiceComponent} from "./invoice/invoice.component";
import {ClientTrainingComponent} from "./client-training/client-training.component";
import {AddComponent} from "./standard-invoice/add/add.component";
import {DetailComponent} from "./standard-invoice/detail/detail.component";
import {
  DetailTrainingInvoiceComponent
} from "./training-invoice/detail-training-invoice/detail-training-invoice.component";
import {EditComponent} from "./standard-invoice/edit/edit.component";
import {DetailPdfComponent} from "./standard-invoice/detail-pdf/detail-pdf.component";
import {DetailInvoiceComponent} from "./detail-invoice/detail-invoice.component";
import {EditTrainingInvoiceComponent} from "./training-invoice/edit-training-invoice/edit-training-invoice.component";
const routes: Routes = [
  {
    path : '',
    component: InvoiceComponent,
    data : {
      title: 'Facturation'
    }
  },
  {
    path : 'client-training',
    component: ClientTrainingComponent,
    data : {
      title: 'Facturation'
    }
  },
  {
    path : 'add-standard-invoice',
    component: AddComponent,
    data : {
      title: 'Facturation'
    }
  },
  {
    path : 'detail-invoice/:idInvoice',
    component: DetailInvoiceComponent,
    data : {
      title: 'Détail Facture'
    }
  },
  {
    path : 'detail-standard-invoice/:idInvoice',
    component: DetailComponent,
    data : {
      title: 'Détail Facture'
    }
  },
  {
    path : 'detail-standard-invoice-pdf/:idInvoice',
    component: DetailPdfComponent,
    data : {
      title: 'Détail PDF Facture'
    }
  },
  {
    path : 'edit-standard-invoice/:idInvoice',
    component: EditComponent,
    data : {
      title: 'Modification Facture'
    }
  },
  {
    path : 'edit-training-invoice/:idInvoice',
    component: EditTrainingInvoiceComponent,
    data : {
      title: 'Modification Facture'
    }
  },
  {
    path : 'detail-training-invoice/:idInvoice',
    component: DetailTrainingInvoiceComponent,
    data : {
      title: 'Détail Facture'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicingRoutingModule { }
