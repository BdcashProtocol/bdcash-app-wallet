import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { IonicModule } from '@ionic/angular'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AddressBookPage } from './address-book.page';
import { ModaltransactionPage } from '../modaltransaction/modaltransaction.page';

const routes: Routes = [
  {
    path: '',
    component: AddressBookPage
  }
];

@NgModule({
  imports: [
    QRCodeModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddressBookPage],
  entryComponents:[],
  providers:[InAppBrowser]
})

export class AddressBookPageModule {}
