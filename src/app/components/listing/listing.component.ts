import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MasterService } from 'src/app/services/master.service';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  constructor(private service:MasterService,private alert:ToastrService, private route:Router,
    private modalservice: NgbModal){}
  ngOnInit(): void {
    this.LoadInvoice();
  }

  InvoiceHeader:any;
  dtTrigger:Subject<any>=new Subject<any>();
  invoiceNo: any;
  pdfurl = '';

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

  PreviewInvoice(invoiceNo:any){
    this.invoiceNo = invoiceNo;
    this.service.GenerateInvoicePDF(invoiceNo).subscribe(res =>{
      let blob:Blob = res.body as Blob;
      let url = window.URL.createObjectURL(blob);
      this.pdfurl = url;
      this.modal

    })
  }

  DownloadInvoice(invoiceNo:any){

  }
}
