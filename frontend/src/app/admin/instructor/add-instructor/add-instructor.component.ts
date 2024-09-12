import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InstructorService} from "../../../_services/instructor.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-instructor',
  templateUrl: './add-instructor.component.html',
  styleUrl: './add-instructor.component.scss'
})
export class AddInstructorComponent implements OnInit {
  addInstructorForm!: FormGroup;

  constructor(private formBuilder : FormBuilder,
              private instructorService : InstructorService,
              private router: Router,) {}

  ngOnInit() {
    this.buildAddForm()
  }

  onSubmit() {
    if (this.addInstructorForm.valid) {
      this.instructorService.addInstructor(this.addInstructorForm.value)
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

  buildAddForm() {
    this.addInstructorForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      ice : ['', Validators.required],
    })
  }
}
