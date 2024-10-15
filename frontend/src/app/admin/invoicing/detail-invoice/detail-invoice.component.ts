import {Component, OnDestroy, OnInit} from '@angular/core';
import {InvoiceModel} from "../../../../models/invoice.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoicingService} from "../../../_services/invoicing.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-detail-invoice',
  templateUrl: './detail-invoice.component.html',
  styleUrl: './detail-invoice.component.scss'
})
export class DetailInvoiceComponent implements OnInit, OnDestroy {
  invoice!: InvoiceModel;
  idInvoice!: number
  pdfUrl: SafeResourceUrl | null = null;
  height: number = 820
  chequeBytes!: Uint8Array | undefined;
  chequeUrl!: string | null
  remiseBytes!: Uint8Array | undefined;
  remiseUrl!: string | null;
  private subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute,
              private invoicingService: InvoicingService,
              private router: Router,
              private sanitizer: DomSanitizer) {
    this.idInvoice = this.route.snapshot.params['idInvoice'];
  }

  ngOnInit(): void {
    this.getInvoice(this.idInvoice)
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  /**************************************************/
  generateInvoice(invoice: InvoiceModel) {
    if (invoice.invoiceType == 'standard') {
      this.invoicingService.generateStandardInvoicePDF(invoice.products, invoice.client, invoice.numberInvoice)
        .then((blob: any) => {
          const url = URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        })
    }
    if (invoice.invoiceType == 'trainingModule') {
      this.invoicingService.generateTrainingInvoicePDF(invoice.trainings, invoice.client, invoice.numberInvoice)
        .then((blob: any) => {
          const url = URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        })
    }
    if (invoice.invoiceType == 'groupInvoice') {
      this.invoicingService.generateGroupsInvoicePDF(invoice.numberInvoice, invoice.trainings, invoice.client)
        .then((blob: any) => {
          const url = URL.createObjectURL(blob);
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        })
    }
  }

  onEditInvoice(invoice: InvoiceModel) {
    if (invoice.invoiceType == 'standard') {
      this.router.navigate(['/invoicing/edit-standard-invoice', invoice.idInvoice])
    }
    if (invoice.invoiceType == 'trainingModule') {
      this.router.navigate(['/invoicing/edit-training-invoice', invoice.idInvoice])
    }
  }

  /**************************************************/

  convertToBytes() {
    if (this.invoice.cheque) {
      const byteCharacters = atob(this.invoice.cheque);
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      this.chequeBytes = new Uint8Array(byteNumbers);
      this.createChequeUrl();
    }

    if (this.invoice.copyRemise) {
      const byteCharacters = atob(this.invoice.copyRemise);
      const byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      this.remiseBytes = new Uint8Array(byteNumbers);
      this.createRemiseUrl();
    }
  }

  createChequeUrl() {
    if (this.chequeBytes) {
      const blob = new Blob([this.chequeBytes], {type: 'application/pdf'});
      this.chequeUrl = URL.createObjectURL(blob);
    } else {
      this.chequeUrl = null;
    }
  }

  getChequeUrl() {
    return this.chequeUrl
  }

  openChequeUrl() {
    if (this.getChequeUrl()) {
      // @ts-ignore
      window.open(this.getChequeUrl(), '_blank');
    } else {
      // Gérer le cas où l'URL n'est pas disponible
      console.error('Cheque URL is not available');
    }
  }

  createRemiseUrl() {
    if (this.remiseBytes) {
      const blob = new Blob([this.remiseBytes], {type: 'application/pdf'});
      this.remiseUrl = URL.createObjectURL(blob);
    } else {
      this.remiseUrl = null;
    }
  }

  getCopyRemiseUrl() {
    return this.remiseUrl
  }

  openRemiseUrl() {
    if (this.getCopyRemiseUrl()) {
      // @ts-ignore
      window.open(this.getCopyRemiseUrl(), '_blank');
    } else {
      // Gérer le cas où l'URL n'est pas disponible
      console.error('Cheque URL is not available');
    }
  }

  private getInvoice(idInvoice: number) {
    const invoiceSubscription = this.invoicingService.getInvoice(idInvoice)
      .subscribe({
        next: data => {
          this.invoice = data;
          this.generateInvoice(this.invoice)
          this.convertToBytes()
        },
        error: error => {
          console.log(error)
        }
      })
    this.subscriptions.push(invoiceSubscription)
  }
}
