import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTabGroup} from "@angular/material/tabs";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../../_services/client.service";
import {ClientModel} from "../../../../models/client.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrl: './detail-client.component.scss'
})
export class DetailClientComponent implements OnInit, OnDestroy {
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  idClient!: number
  client!: ClientModel
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private clientService: ClientService,
              private router: Router,) {
    this.idClient = this.route.snapshot.params['idClient'];
  }

  ngOnInit() {
    this.getClient(this.idClient)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  getClient(idClient: number) {
    const clientSubscription = this.clientService.getClient(idClient)
      .subscribe({
        next: value => {
          this.client = value
        },
        error: error => {
          alert(error.error.message)
          console.log(error)
        },
      })
    this.subscriptions.push(clientSubscription)
  }

  handleEdit(idClient: number) {
    this.router.navigate(['/client/edit/' + idClient])
  }

  goToNextTab() {
    const selectedIndex: number | null = this.tabGroup.selectedIndex;
    // @ts-ignore
    if (selectedIndex < this.tabGroup._tabs.length - 1) {
      // @ts-ignore
      this.tabGroup.selectedIndex = selectedIndex + 1;
    }
  }

  goToPreviousTab() {
    const selectedIndex = this.tabGroup.selectedIndex;
    // @ts-ignore
    if (selectedIndex > 0) {
      // @ts-ignore
      this.tabGroup.selectedIndex = selectedIndex - 1;
    }
  }
}
