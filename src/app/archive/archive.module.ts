import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { ArchivePage } from './archive.page';
import { ArchivedetailPage } from '../archivedetail/archivedetail.page';
import { UploadModalPage } from '../upload-modal/upload-modal.page';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
//import { File } from '@ionic-native/file';

const routes: Routes = [
  {
    path: '',
    component: ArchivePage
  }
];

@NgModule({
  imports: [
   // FileTransfer,
    //ArchivedetailPageModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ArchivePage,ArchivedetailPage,UploadModalPage],
  entryComponents:[ArchivedetailPage,UploadModalPage],
  providers: [InAppBrowser, SocialSharing]
})
export class ArchivePageModule {}
