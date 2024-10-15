import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {TrainingModel} from "../../models/training.model";

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  constructor() { }

  // Créer un BehaviorSubject pour stocker les données sélectionnées
  private selectedTrainingsSource = new BehaviorSubject<TrainingModel[]>([]);
  selectedTrainings$ = this.selectedTrainingsSource.asObservable();

  setSelectedTrainings(trainings: TrainingModel[]) {
    this.selectedTrainingsSource.next(trainings);
    localStorage.setItem('selectedTrainings', JSON.stringify(trainings)); // Stocker dans localStorage
  }

  private getSelectedTrainingsFromLocalStorage(): TrainingModel[] {
    const data = localStorage.getItem('selectedTrainings');
    return data ? JSON.parse(data) : []; // Récupérer les données de localStorage
  }
}
