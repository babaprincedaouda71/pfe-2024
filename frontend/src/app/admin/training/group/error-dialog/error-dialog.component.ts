import {Component, Inject, Optional} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  local_data : any
  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.local_data = {...data.obj}
  }
}
