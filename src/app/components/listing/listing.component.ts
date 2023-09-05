import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { MasterService } from 'src/app/services/master.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  constructor(private service:MasterService, private route:Router, private alert:ToastrService,
    private modalservice: NgbModal){}

    @ViewChild('content') popupview !: ElementRef;
    
  ngOnInit(): void {
    this.LoadInvoice();
  }

  InvoiceHeader:any;
  dtTrigger:Subject<any>=new Subject<any>();
  invoiceNo: any;
  pdfUrl = '';

  LoadInvoice(){
    this.service.GetAllInvoice().subscribe(res=>{
      this.InvoiceHeader = res;
      this.dtTrigger.next(null);
    });
  }

  InvoiceRemove(invoiceno:any){
    if(confirm('Do you want to remove this Invoice :' + invoiceno)){
      this.service.RemoveInvoice(invoiceno).subscribe(res =>{
        let result: any;
        result = res;
        if(result.result == 'pass'){
          this.alert.success('Removed Successfully.', 'Remove Invoice')
          this.LoadInvoice();
        }else{
          this.alert.error('Failed to Remove.','Invoice');
        }
      });
    }
  }

  EditInvoice(invoiceNo:any){
     this.route.navigateByUrl('/editinvoice/',invoiceNo);
  }

  PrintInvoice(invoiceNo:any){
     this.service.GenerateInvoicePDF(invoiceNo).subscribe(res=>{
      let blob: Blob = res.body as Blob;
      let url = window.URL.createObjectURL(blob);
      window.open(url);
     });
  }

  PreviewInvoice(invoiceNo:any){
    this.invoiceNo = invoiceNo;
    this.service.GenerateInvoicePDF(invoiceNo).subscribe(res =>{
      let blob:Blob = res.body as Blob;
      let url = window.URL.createObjectURL(blob);
      this.pdfUrl = url;
      this.modalservice.open(this.popupview, { size: 'lg' });

    })
  }

  DownloadInvoice(invoiceNo:any){
    this.service.GenerateInvoicePDF(invoiceNo).subscribe(res =>{
     let blob: Blob = res.body as Blob;
     let url = window.URL.createObjectURL(blob);

     let a = document.createElement('a');
     a.download = invoiceNo;
     a.href = url;
     a.click();
    });
  }
}
