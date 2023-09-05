import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments.prod';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http:HttpClient) { }

  private apiUrl = environment.endpoint;

  GetCustomer(){
      return this.http.get(this.apiUrl + "Customer" + "/GetAll");
  }

  GetCustomerByCode(code:any){
      return this.http.get(this.apiUrl + "Customer" + '/GetByCode?Code=' + code);
  }

  GetProduct(){
      return this.http.get(this.apiUrl + "Product" + "/GetAll");
  }

  GetProductByCode(code:any){
      return this.http.get(this.apiUrl + "Product" + '/GetByCode?Code=' + code);
  }

  GetAllInvoice(){
    return this.http.get(this.apiUrl + "Invoice" + "/GetAllHeader");
  }

  GetInvHeaderbycode(invoiceno:any){
    return this.http.get(this.apiUrl+"Invoice"+'/GetHeaderByCode?Code='+invoiceno);
  }

  GetInvDetailbycode(invoiceno:any){
    return this.http.get(this.apiUrl+'Invoice'+'/GetAllDetailByCode?invoiceno='+invoiceno);
  }

  RemoveInvoice(invoiceno:any){
    return this.http.delete(this.apiUrl + "Invoice"+"/Remove?invoiceno="+invoiceno);
  }

  SaveInvoice(invoicedata:any){
    return this.http.post(this.apiUrl + "Invoice"+"/Save",invoicedata);
  }

  GenerateInvoicePDF(invoiceNo:any){
    return this.http.get(this.apiUrl + "Invoice" + "/generatepdf?InvoiceNo=" + invoiceNo, {observe:'response',responseType:'blob'});
  }
}
