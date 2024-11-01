import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

export function staffMatchValidator(control: AbstractControl): ValidationErrors | null {
  const formGroup = control as FormGroup;
  const totalStaff = formGroup.get('staff')?.value;
  const groups = formGroup.get('groups')?.value;

  const groupStaffSum = groups?.reduce((sum: number, group: any) => sum + (group.groupStaff || 0), 0);

  if (totalStaff !== groupStaffSum) {
    return { staffMismatch: true }; // L'erreur est déclenchée si les effectifs ne correspondent pas
  }

  return null;
}
