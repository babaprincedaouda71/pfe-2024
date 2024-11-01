import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InstructorService} from "../../../_services/instructor.service";
import {ActivatedRoute, Router} from "@angular/router";
import {InstructorModel} from "../../../../models/instructor-model";

@Component({
  selector: 'app-edit-instructor',
  templateUrl: './edit-instructor.component.html',
  styleUrl: './edit-instructor.component.scss'
})
export class EditInstructorComponent implements OnInit{
  updateInstructorForm!: FormGroup;
  instructor! : InstructorModel
  idInstructor! : number

  constructor(private formBuilder : FormBuilder,
              private instructorService : InstructorService,
              private router: Router,
              private route: ActivatedRoute,) {
    this.idInstructor = this.route.snapshot.params['idInstructor'];
    this.getInstructor(this.idInstructor);
  }

  ngOnInit() {
  }

  getInstructor(idInstructor: number) {
    this.instructorService.getInstructor(idInstructor)
      .subscribe({
        next : value => {
          this.instructor = value
          this.buildEditForm()
        },
        error : err => {
          console.log(err.message)
        }
      })
  }

  onSubmit() {
    if (this.updateInstructorForm.valid) {
      this.instructorService.addInstructor(this.updateInstructorForm.value)
        .subscribe({
          next: result => {
            this.router.navigate(['instructor'])
          },
          error: err => {
            console.log(err.message)
          }
        })
    }
  }

  buildEditForm() {
    this.updateInstructorForm = this.formBuilder.group({
      firstName: [this.instructor.firstName, Validators.required],
      lastName: [this.instructor.lastName, Validators.required],
      email: [this.instructor.email, [Validators.required, Validators.email]],
      phone: [this.instructor.phone, Validators.required],
      address: [this.instructor.address, Validators.required],
      ice : [this.instructor.ice, Validators.required],
    })
  }
}
