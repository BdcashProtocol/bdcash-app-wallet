import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { RemoteloginPage } from './remotelogin.page';

const routes: Routes = [
  {
    path: '',
    component: RemoteloginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RemoteloginPage],
  providers:[InAppBrowser]
})
export class RemoteloginPageModule {}
