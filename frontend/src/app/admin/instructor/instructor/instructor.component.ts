import {AfterViewInit, Component, Inject, Optional, ViewChild} from '@angular/core';
import {InstructorModel} from "../../../../models/instructor-model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {InstructorService} from "../../../_services/instructor.service";
import {KeycloakService} from "keycloak-angular";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrl: './instructor.component.scss'
})
export class InstructorComponent implements AfterViewInit {
  instructors! : InstructorModel[]
  datasource! : MatTableDataSource<any>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  displayedColumns : string[] = ['lastName', 'firstName', 'phone', 'email', 'address', 'action'];

  constructor(private instructorService : InstructorService,
              public keycloakService: KeycloakService,
              public dialog : MatDialog,) {}

  ngAfterViewInit() {
    this.getInstructors()
  }

  getInstructors() {
    this.instructorService.getInstructors()
      .subscribe({
        next : data => {
          this.instructors = data
          this.datasource = new MatTableDataSource(this.instructors);
          this.datasource.paginator = this.paginator;
        },
        error : err => {
          console.log(err.message)
        }
      })
  }

  /*
  * Search Instructors
  * */
  search(keyword : string){
    const results : InstructorModel[] = []
    for (const instructor of this.instructors){
      if (instructor.phone.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || instructor.email.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || instructor.firstName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || instructor.lastName.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
        || instructor.address.toLowerCase().indexOf(keyword.toLowerCase()) !== -1){
        results.push(instructor)
        this.datasource = new MatTableDataSource(results);
        this.datasource.paginator = this.paginator;
      }
    }
    this.instructors = results
    if (results.length === 0 || !keyword){
      this.getInstructors()
    }
    console.log("test")
  }

  // Handle delete and update dialog
  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppInstructorDialogContentComponent, {
      data: {
        // form : this.buildClientForm(),
        obj : obj
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Supprimer') {
        this.deleteRowData(result.data);
      }
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: InstructorModel): boolean | any {
    this.instructorService.deleteInstructor(row_obj.idInstructor)
      .subscribe({
        next : data => {
          this.getInstructors()
        },
        error : err => {
          console.log(err.message)
        }
      })
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector : 'app-dialog-content',
  templateUrl : 'instructor-dialog-content.html'
})

// tslint:disable-next-line: component-class-suffix
export class AppInstructorDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  constructor(public dialogRef: MatDialogRef<AppInstructorDialogContentComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data : {form : FormGroup, obj : InstructorModel},
  ) {
    this.local_data = { ...data.obj };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
