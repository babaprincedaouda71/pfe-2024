import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function referenceStandardValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // Ignore validation if no value

    const year = new Date().getFullYear().toString().slice(-2); // les deux derniers chiffres de l'année
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2); // le mois actuel avec deux chiffres

    // const pattern = new RegExp(`^FS-${year}${month}-\\d{3}$`);
    const pattern = new RegExp(`^FS-${year}(0[1-9]|1[0-2])-\\d{3}$`);

    if (!pattern.test(value)) {
      return { invalidFormat: true }; // Si le format global n'est pas respecté
    }

    const [_, refYear, refMonth] = value.match(/^FS-(\d{2})(\d{2})-\d{3}$/) || [];

    if (refMonth !== month) {
      return { invalidMonth: true }; // Si le mois ne correspond pas
    }

    return null; // valide
  };
}

export function referenceTrainingValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // Ignore validation if no value

    const year = new Date().getFullYear().toString().slice(-2); // les deux derniers chiffres de l'année
    const month = ('0' + (new Date().getMonth() + 1)).slice(-2); // le mois actuel avec deux chiffres

    // const pattern = new RegExp(`^FS-${year}${month}-\\d{3}$`);
    const pattern = new RegExp(`^FF-${year}(0[1-9]|1[0-2])-\\d{3}$`);

    if (!pattern.test(value)) {
      return { invalidFormat: true }; // Si le format global n'est pas respecté
    }

    const [_, refYear, refMonth] = value.match(/^FF-(\d{2})(\d{2})-\d{3}$/) || [];

    if (refMonth !== month) {
      return { invalidMonth: true }; // Si le mois ne correspond pas
    }

    return null; // valide
  };
}


export function referenceValidator(selectedDate : Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // Ignore validation if no value

    const year = selectedDate.getFullYear().toString().slice(-2); // les deux derniers chiffres de l'année
    const month = ('0' + (selectedDate.getMonth() + 1)).slice(-2); // le mois actuel avec deux chiffres

    // Créer un pattern pour correspondre au format AAmm-xxx
    const pattern = new RegExp(`^${year}${month}-\\d{3}$`);

    if (!pattern.test(value)) {
      return { invalidFormat: true }; // Si le format global n'est pas respecté
    }

    // Extraire l'année et le mois de la référence
    const [_, refYear, refMonth] = value.match(/^(\d{2})(\d{2})-\d{3}$/) || [];

    if (refMonth !== month) {
      return { invalidMonth: true }; // Si le mois ne correspond pas
    }

    return null; // Valide
  };
}
