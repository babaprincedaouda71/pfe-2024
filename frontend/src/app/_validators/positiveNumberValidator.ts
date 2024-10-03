import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// Fonction de validation personnalisée pour empêcher les nombres négatifs
export function positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  // Vérifie si la valeur est un nombre et si elle est négative
  if (value !== null && value !== '' && Number(value) < 0) {
    return { negativeNumber: true };
  }
  return null;
}
