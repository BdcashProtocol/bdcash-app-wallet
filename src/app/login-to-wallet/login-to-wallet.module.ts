import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginToWalletPage } from './login-to-wallet.page';

const routes: Routes = [
  {
    path: '',
    component: LoginToWalletPage
  }
];

@NgModule({
  imports: [
    
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginToWalletPage],
  entryComponents:[]
})
export class LoginToWalletPageModule {}
