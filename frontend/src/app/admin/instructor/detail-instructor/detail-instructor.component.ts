import {Component} from '@angular/core';
import {InstructorModel} from "../../../../models/instructor-model";
import {InstructorService} from "../../../_services/instructor.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-detail-instructor',
  templateUrl: './detail-instructor.component.html',
  styleUrl: './detail-instructor.component.scss'
})
export class DetailInstructorComponent {
  instructor! : InstructorModel;
  idInstructor!: number;

  constructor(private instructorService: InstructorService,
              private route: ActivatedRoute,
              private router : Router,) {
    this.idInstructor = this.route.snapshot.params['idInstructor'];
    this.getInstructor(this.idInstructor);
  }

  getInstructor(idInstructor: number) {
    this.instructorService.getInstructor(idInstructor)
      .subscribe({
        next : value => {
          this.instructor = value
        },
        error : err => {
          console.log(err.message)
        }
      })
  }

  handleEdit(idInstructor: number) {
    this.router.navigate(['/instructor/edit/'+idInstructor])
  }
}
