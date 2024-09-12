import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InstructorRoutingModule} from './instructor-routing.module';
import {AppInstructorDialogContentComponent, InstructorComponent} from './instructor/instructor.component';
import {AddInstructorComponent} from './add-instructor/add-instructor.component';
import {DetailInstructorComponent} from './detail-instructor/detail-instructor.component';
import {EditInstructorComponent} from './edit-instructor/edit-instructor.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
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
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatPaginator} from "@angular/material/paginator";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatDialogActions, MatDialogTitle} from "@angular/material/dialog";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {MatTab, MatTabGroup} from "@angular/material/tabs";


@NgModule({
  declarations: [
    InstructorComponent,
    AddInstructorComponent,
    DetailInstructorComponent,
    EditInstructorComponent,
    AppInstructorDialogContentComponent
  ],
  imports: [
    CommonModule,
    InstructorRoutingModule,
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
    MatDialogTitle,
    MatDialogActions,
    MatHeaderCellDef,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatLabel,
    MatOption,
    MatSelect,
    MatTab,
    MatTabGroup
  ]
})
export class InstructorModule { }
