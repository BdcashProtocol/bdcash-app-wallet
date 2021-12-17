import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModaltransactionPage } from './modaltransaction.page';

const routes: Routes = [
  {
    path: '',
    component: ModaltransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
 // declarations: [ModaltransactionPage]
})
export class ModaltransactionPageModule {}
