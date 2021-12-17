import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { ModaltransactionPage } from '../modaltransaction/modaltransaction.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardPage,ModaltransactionPage],
  entryComponents:[ModaltransactionPage],
  providers:[InAppBrowser]
})
export class DashboardPageModule {}
