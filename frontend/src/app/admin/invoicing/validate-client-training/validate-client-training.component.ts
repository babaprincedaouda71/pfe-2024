import {Component, OnDestroy, OnInit} from '@angular/core';
import {InvoicingService} from "../../../_services/invoicing.service";
import {TrainingService} from "../../../_services/training.service";
import {KeycloakService} from "keycloak-angular";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../../_services/client.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ClientModel} from "../../../../models/client.model";
import {KeycloakProfile} from "keycloak-js";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-validate-client-training',
  templateUrl: './validate-client-training.component.html',
  styleUrl: './validate-client-training.component.scss'
})
export class ValidateClientTrainingComponent implements OnInit, OnDestroy{
  addTrainingInvoiceForm!: FormGroup;
  clients!: Array<ClientModel>;
  deadline!: number;
  private userProfile!: KeycloakProfile;
  private subscriptions: Subscription[] = []
  idTrainings : Array<number> = []


  constructor(private invoicingService : InvoicingService,
              private trainingService : TrainingService,
              public keycloakService : KeycloakService,
              private snackBar : MatSnackBar,
              private router : Router,
              private route : ActivatedRoute,
              private clientService : ClientService,
              private formBuilder : FormBuilder) {
  }

    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }
    ngOnInit(): void {
      this.idTrainings = this.route.snapshot.params['idTrainings'];
      console.log(this.idTrainings)
    }

  onSubmit() {

  }

  handleAdd() {

  }
}
