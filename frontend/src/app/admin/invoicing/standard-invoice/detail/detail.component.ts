import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InvoiceModel} from "../../../../../models/invoice.model";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  invoice!: InvoiceModel;
  idInvoice! : number
  deadline! : number;
  datasource!: MatTableDataSource<any>
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator = Object.create(null);
  displayedColumns: string[] = ['name', 'quantity', 'unitPrice', 'total'];
  private subscriptions: Subscription[] = []


  constructor(private route : ActivatedRoute,
              private invoicingService: InvoicingService,
              private router : Router) {
    this.idInvoice = this.route.snapshot.params['idInvoice'];
  }

  ngOnInit(): void {
    this.getInvoice(this.idInvoice)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private getInvoice(idInvoice: number) {
    const invoiceSubscription = this.invoicingService.getInvoice(idInvoice)
      .subscribe({
        next: data => {
          this.invoice = data;
          this.datasource = new MatTableDataSource(this.invoice.products)
          this.datasource.paginator = this.paginator
        },
        error: error => {
          console.log(error)
        }
      })
    this.subscriptions.push(invoiceSubscription)
  }

  onEditInvoice(idInvoice: number) {
    this.router.navigate(['/invoicing/edit-standard-invoice', idInvoice])
  }
}
