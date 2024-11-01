import {ErrorHandler, Injectable} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private snackBar: MatSnackBar) {
  }

  handleError(error: any): Observable<any> {
    let errorMessage = 'Une erreur inconnue s\'est produite';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Une erreur s'est produite : ${error.error.message}`;
      this.printErrorMessage(errorMessage);
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Erreur de connexion : impossible de se connecter au serveur.';
          this.printErrorMessage(errorMessage);

          break;
        case 400:
          errorMessage = 'Requête invalide : les données fournies sont incorrectes.';
          this.printErrorMessage(errorMessage);
          break;
        case 401:
          errorMessage = 'Non autorisé : vous n\'êtes pas autorisé à accéder à cette ressource.';
          this.printErrorMessage(errorMessage);
          break;
        case 403:
          errorMessage = 'Accès refusé : vous ne disposez pas des permissions nécessaires pour accéder à cette ressource.';
          this.printErrorMessage(errorMessage);
          break;
        case 404:
          errorMessage = 'Ressource non trouvée : la ressource demandée est introuvable.';
          this.printErrorMessage(errorMessage);
          break;
        case 408:
          errorMessage = 'Délai d\'attente dépassé : la requête a pris trop de temps pour être traitée.';
          this.printErrorMessage(errorMessage);
          break;
        case 500:
          errorMessage = 'Erreur du serveur : une erreur interne du serveur s\'est produite.';
          this.printErrorMessage(errorMessage);
          break;
        case 503:
          errorMessage = 'Service non disponible : le service est temporairement indisponible.';
          this.printErrorMessage(errorMessage);
          break;

        default:
          // errorMessage = `Erreur du serveur : ${error.status}, message : ${error.error.message || error.statusText}`;
          this.printErrorMessage(error);
          console.log(error)
          break;
      }
    }
    return throwError(errorMessage);
  }

  printErrorMessage(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    })
  }
}
