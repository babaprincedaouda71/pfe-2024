import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AgendaRoutingModule} from './agenda-routing.module';
import {AgendaComponent, TrainingDialog} from './agenda/agenda.component';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatIcon} from "@angular/material/icon";
import {CalendarCommonModule, CalendarDayModule, CalendarMonthModule, CalendarWeekModule} from "angular-calendar";
import {MatDialogTitle} from "@angular/material/dialog";


@NgModule({
  declarations: [
    AgendaComponent,
    TrainingDialog
  ],
  imports: [
    CommonModule,
    AgendaRoutingModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatButton,
    MatToolbar,
    MatIconButton,
    MatIcon,
    CalendarCommonModule,
    CalendarMonthModule,
    CalendarWeekModule,
    CalendarDayModule,
    MatToolbarModule,
    MatDialogTitle
  ]
})
export class AgendaModule { }
