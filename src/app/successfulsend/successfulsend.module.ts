import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SuccessfulsendPage } from './successfulsend.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessfulsendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SuccessfulsendPage]
})
export class SuccessfulsendPageModule {}
