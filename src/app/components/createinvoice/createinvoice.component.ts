import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-createinvoice',
  templateUrl: './createinvoice.component.html',
  styleUrls: ['./createinvoice.component.scss']
})
export class CreateinvoiceComponent implements OnInit {
  pageTitle:string = "Create Invoice";
  invoiceDetail !: FormArray<any>;
  invoiceProduct !: FormGroup<any>;

  constructor(private builder:FormBuilder, private service:MasterService,private route:Router, private alert: ToastrService, private activeRoute:ActivatedRoute) {

  }

  mastercustomer: any;
  masterproduct: any;
  isedit = false;
  editInvoiceNo:any;
  editInvDetail:any;

  ngOnInit(): void {
    this.GetCustomers();
    this.GetProducts();

    this.editInvoiceNo = this.activeRoute.snapshot.paramMap.get('invoiceno')

    if(this.editInvoiceNo != null){
      this.pageTitle = "Edit Invoice";
      this.isedit = true;
      this.SetEditInfo(this.editInvoiceNo)
    }
  }

  invoiceform=this.builder.group({
     invoiceNo:this.builder.control(''),
     customerId:this.builder.control(''),
     customerName: this.builder.control(''),
     deliveryAddress:this.builder.control(''),
     remarks:this.builder.control(''),
     total:this.builder.control({value:0,disabled:true}),
     tax:this.builder.control({value:0,disabled:true}),
     netTotal:this.builder.control({value:0,disabled:true}),
     details:this.builder.array([])
  });

  SaveInvoice() {
    if (this.invoiceform.valid) {
      this.service.SaveInvoice(this.invoiceform.getRawValue()).subscribe(res => {
        let result: any;
        result = res;
        if(result != null){
          console.log(result)
        }else{
          console.log("No llega el objeto")
        }
        if (result.result == 'pass') {
          if(this.isedit){
            this.alert.success('Updated Successfully.', 'Invoice :' + result.kyValue);
          }else{
          this.alert.success('Created Successfully.', 'Invoice :' + result.kyValue);
          }
          this.route.navigate(['/']);
        } else {
          this.alert.error('Failed to save.', 'Invoice');
        }
      });
    } else {
      this.alert.warning('Please enter values in all mandatory filed', 'Validation');
    }

  }

  SetEditInfo(invoiceNo:any){
   this.service.GetInvDetailbycode(invoiceNo).subscribe(res=>{
    this.editInvDetail = res;
    for(let i = 0; i < this.editInvDetail.length; i++){
      this.addnewproduct();
    }
   });

   this.service.GetInvHeaderbycode(invoiceNo).subscribe(res=>{
    let editData:any;
    editData=res;
    if(editData != null){
      this.invoiceform.setValue({
        invoiceNo: editData.invoiceNo, customerId: editData.customerId,
          customerName: editData.customerName, deliveryAddress: editData.deliveryAddress, remarks: editData.remarks,
          total: editData.total, tax: editData.tax, netTotal: editData.netTotal, details: this.editInvDetail
      });
    }
   });
  }

  addnewproduct(){
     this.invoiceDetail = this.invoiceform.get("details") as FormArray;

     let customerCode = this.invoiceform.get("customerId")?.value;
     if((customerCode != null && customerCode != '') || this.isedit){
      this.invoiceDetail.push(this.GenerateRow());
     }else{
      this.alert.warning('Please select the customer','Validation');
     }
     
  }

  get invproducts(){
    return this.invoiceform.get("details") as FormArray;
  }

  GenerateRow(){
    return this.builder.group({
       invoiceNo:this.builder.control(''),
       productCode:this.builder.control('',Validators.required),
       productName:this.builder.control(''),
       qty:this.builder.control(1),
       salesPrice:this.builder.control(0),
       total:this.builder.control({value:0,disabled:true})
    });
  }

  GetCustomers(){
    this.service.GetCustomer().subscribe(res=>{
      this.mastercustomer = res;
    })
  }

  GetProducts(){
    this.service.GetProduct().subscribe(res=>{
      this.masterproduct = res;
    })
  }

  customerchange(){
    let customercode = this.invoiceform.get("customerId")?.value;
    this.service.GetCustomerByCode(customercode).subscribe(res=>{
      let custdata: any;
      custdata = res;
      if(custdata !=null){
        this.invoiceform.get("deliveryAddress")?.setValue(custdata.address + ',' + custdata.phoneno + ',' + custdata.email);
        this.invoiceform.get("customerName")?.setValue(custdata.name);
      }
    })
  }

  productchange(index:any){
     this.invoiceDetail = this.invoiceform.get("details") as FormArray;
     this.invoiceProduct = this.invoiceDetail.at(index) as FormGroup;
     let productCode = this.invoiceProduct.get("productCode")?.value;
     this.service.GetProductByCode(productCode).subscribe(res=>{
     let prodData: any;
     prodData = res;
     console.log(prodData);
     if(prodData != null){
      this.invoiceProduct.get("productName")?.setValue(prodData.name);
      this.invoiceProduct.get("salesPrice")?.setValue(prodData.price);
      this.ItemCalculation(index);
     }
     })
  }

  ItemCalculation(index:any){
    this.invoiceDetail = this.invoiceform.get("details") as FormArray;
    this.invoiceProduct = this.invoiceDetail.at(index) as FormGroup;
    let qty = this.invoiceProduct.get("qty")?.value;
    let price = this.invoiceProduct.get("salesPrice")?.value;
    let total = qty * price;
    this.invoiceProduct.get("total")?.setValue(total);

    this.Summarycalculation();
  }

  Summarycalculation(){
    let array = this.invoiceform.getRawValue().details;
    let sumTotal = 0;
    array.forEach((x:any)=>{
      sumTotal = sumTotal + x.total;
    });

    //tax calculation
    let sumtax = (7 / 100) * sumTotal;
    let netTotal = sumTotal + sumtax;

    this.invoiceform.get("total")?.setValue(sumTotal);
    this.invoiceform.get("tax")?.setValue(sumtax);
    this.invoiceform.get("netTotal")?.setValue(netTotal);
  }

  RemoveProduct(index:any){
      if(confirm('Do you want to remove?')){
        this.invproducts.removeAt(index);
        this.Summarycalculation();
      }
  }

}
