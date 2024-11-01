import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {ClientRoutingModule} from './client-routing.module';
import {AppClientDialogContentComponent, ClientComponent} from './client/client.component';
import {MatPaginator} from "@angular/material/paginator";
import {TablerIconsModule} from "angular-tabler-icons";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AddClientComponent} from './add-client/add-client.component';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatOption, MatSelect} from "@angular/material/select";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {EditClientComponent} from './edit-client/edit-client.component';
import {MaterialModule} from "../../material.module";
import {DetailClientComponent} from './detail-client/detail-client.component';
import {OkDialogComponent} from "./edit-client/ok-dialog/ok-dialog.component";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ClientComponent,
    AppClientDialogContentComponent,
    AddClientComponent,
    EditClientComponent,
    DetailClientComponent,
    OkDialogComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MatPaginator,
    TablerIconsModule,
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatTable,
    MatCardContent,
    MatCard,
    MatButton,
    MatIcon,
    MatSuffix,
    MatInput,
    MatFormField,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatDialogTitle,
    MatDialogContent,
    FormsModule,
    MatDialogActions,
    ReactiveFormsModule,
    MatTabGroup,
    MatTab,
    MatLabel,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatIconButton,
    MatDatepickerModule,
    MaterialModule,
  ],
  providers : [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // Définit la locale française,
    DatePipe
  ],
  exports : [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ClientModule { }
