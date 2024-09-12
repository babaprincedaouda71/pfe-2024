import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicingRoutingModule } from './invoicing-routing.module';
import {
  AddInvoiceDialogContentComponent,
  InvoiceComponent,
  InvoiceDialogContentComponent
} from './invoice/invoice.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatDialogActions, MatDialogTitle} from "@angular/material/dialog";
import { ClientTrainingComponent } from './client-training/client-training.component';
import {MatCheckbox} from "@angular/material/checkbox";
import { AddComponent } from './standard-invoice/add/add.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTooltip} from "@angular/material/tooltip";
import { DetailComponent } from './standard-invoice/detail/detail.component';
import { DetailTrainingInvoiceComponent } from './training-invoice/detail-training-invoice/detail-training-invoice.component';
import { EditComponent } from './standard-invoice/edit/edit.component';
import { DetailPdfComponent } from './standard-invoice/detail-pdf/detail-pdf.component';
import { DetailInvoiceComponent } from './detail-invoice/detail-invoice.component';
import { EditTrainingInvoiceComponent } from './training-invoice/edit-training-invoice/edit-training-invoice.component';
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";


@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceDialogContentComponent,
    AddInvoiceDialogContentComponent,
    ClientTrainingComponent,
    AddComponent,
    DetailComponent,
    DetailTrainingInvoiceComponent,
    EditComponent,
    DetailPdfComponent,
    DetailInvoiceComponent,
    EditTrainingInvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoicingRoutingModule,
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatInput,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSuffix,
    MatTable,
    TablerIconsModule,
    MatDialogTitle,
    MatDialogActions,
    MatHeaderCellDef,
    MatCardHeader,
    MatCheckbox,
    MatCardSubtitle,
    MatCardTitle,
    MatCardActions,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatIconButton,
    MatLabel,
    MatOption,
    MatSelect,
    MatSlideToggle,
    MatTooltip,
    ReactiveFormsModule,
    MatRadioGroup,
    MatRadioButton
  ]
})
export class InvoicingModule { }
