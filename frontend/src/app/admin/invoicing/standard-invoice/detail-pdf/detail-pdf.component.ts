import {Component, OnDestroy, OnInit} from '@angular/core';
import {InvoiceModel} from "../../../../../models/invoice.model";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicingService} from "../../../../_services/invoicing.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail-pdf',
  templateUrl: './detail-pdf.component.html',
  styleUrl: './detail-pdf.component.scss'
})
export class DetailPdfComponent implements OnInit, OnDestroy{
  invoice!: InvoiceModel;
  idInvoice! : number
  pdfUrl: SafeResourceUrl | null = null;
  private subscriptions: Subscription[] = []


  constructor(private route : ActivatedRoute,
              private invoicingService: InvoicingService,
              private router : Router,
              private sanitizer: DomSanitizer) {
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
          this.generateInvoice(this.invoice)
        },
        error: error => {
          console.log(error)
        }
      })
    this.subscriptions.push(invoiceSubscription)
  }

  /**************************************************/
  generateInvoice(invoice : InvoiceModel) {
    if (invoice.invoiceType == 'standard') {
      this.invoicingService.generateStandardInvoicePDF(invoice.products, invoice.client, invoice.numberInvoice)
        .then((blob : any) => {
          const url = URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        })
    }
  }
  /**************************************************/

  onEditInvoice(idInvoice: number) {
    this.router.navigate(['/invoicing/edit-standard-invoice', idInvoice])
  }
}
