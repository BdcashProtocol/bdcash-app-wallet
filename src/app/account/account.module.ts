import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { IonicModule } from '@ionic/angular'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AccountPage } from './account.page';
import { ModaltransactionPage } from '../modaltransaction/modaltransaction.page';
import { AccountDetailPage } from '../account-detail/account-detail.page';

const routes: Routes = [
  {
    path: '',
    component: AccountPage
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
  declarations: [AccountPage,AccountDetailPage],
  entryComponents:[AccountDetailPage],
  providers:[InAppBrowser]
})

export class AccountPageModule {}
