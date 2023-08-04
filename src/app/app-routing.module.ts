import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingComponent } from './components/listing/listing.component';
import { CreateinvoiceComponent } from './components/createinvoice/createinvoice.component';

const routes: Routes = [
  {component:ListingComponent,path:""},
  {component:CreateinvoiceComponent,path:"createinvoice"},
  {component:CreateinvoiceComponent,path:"editinvoice/:invoiceno"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
