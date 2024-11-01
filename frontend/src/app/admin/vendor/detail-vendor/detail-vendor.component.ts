import {Component, OnDestroy, OnInit} from '@angular/core';
import {Vendor} from "../../../../models/vendor.model";
import {VendorService} from "../../../_services/vendor.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail-vendor',
  templateUrl: './detail-vendor.component.html',
  styleUrl: './detail-vendor.component.scss'
})
export class DetailVendorComponent implements OnInit, OnDestroy {
  vendor!: Vendor
  idVendor!: number
  private subscriptions: Subscription[] = []

  constructor(private vendorService: VendorService,
              private router: Router,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    this.idVendor = this.route.snapshot.params['idVendor'];
    this.getVendor(this.idVendor);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  getVendor(idVendor: number) {
    const vendorSubscription = this.vendorService.getVendor(idVendor)
      .subscribe({
        next: data => {
          this.vendor = data;
        },
        error: error => {
          console.log(error);
        }
      })
    this.subscriptions.push(vendorSubscription)
  }

  handleEditVendor(idVendor: number) {
    this.router.navigate(['vendor/edit/' + idVendor]);
  }
}
