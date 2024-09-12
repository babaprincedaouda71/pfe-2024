import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InstructorComponent} from "./instructor/instructor.component";
import {AddInstructorComponent} from "./add-instructor/add-instructor.component";
import {EditInstructorComponent} from "./edit-instructor/edit-instructor.component";
import {DetailInstructorComponent} from "./detail-instructor/detail-instructor.component";

const routes: Routes = [
  {
    path : '',
    component: InstructorComponent,
    data : {
      title: 'Formateur'
    }
  },
  {
    path : 'add',
    component: AddInstructorComponent,
    data : {
      title: 'Ajouter un Formateur'
    }
  },
  {
    path : 'edit/:idInstructor',
    component: EditInstructorComponent,
    data : {
      title: 'Modifier le Formateur'
    }
  },
  {
    path : 'detail/:idInstructor',
    component: DetailInstructorComponent,
    data : {
      title: 'Détail du Formateur'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
