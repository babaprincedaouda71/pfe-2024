import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {VendorRoutingModule} from './vendor-routing.module';
import {AppVendorDialogContentComponent, VendorComponent} from './vendor/vendor.component';
import {AddVendorComponent} from './add-vendor/add-vendor.component';
import {EditVendorComponent} from './edit-vendor/edit-vendor.component';
import {DetailVendorComponent} from './detail-vendor/detail-vendor.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
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
import {MatError, MatFormField, MatFormFieldModule, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatDialogActions, MatDialogTitle} from "@angular/material/dialog";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {MatCheckbox} from "@angular/material/checkbox";
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import {MaterialModule} from "../../material.module";
import {MatPaginator} from "@angular/material/paginator";


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    VendorComponent,
    AddVendorComponent,
    EditVendorComponent,
    DetailVendorComponent,
    AppVendorDialogContentComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
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
    ReactiveFormsModule,
    TablerIconsModule,
    MatHeaderCellDef,
    MatDialogTitle,
    MatDialogActions,
    MatCardHeader,
    MatStepper,
    MatStep,
    MatStepLabel,
    MatLabel,
    MatStepperNext,
    MatStepperPrevious,
    MatCheckbox,
    MatCardTitle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatOption,
    MatSelect,
    MatTab,
    MatTabGroup,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatIconButton,
    MatDatepickerModule,
    MaterialModule,
  ],
  exports : [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers : [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }, // Définit la locale française,
    DatePipe
  ]
})
export class VendorModule { }
