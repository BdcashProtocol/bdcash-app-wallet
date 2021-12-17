import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
//import { File } from '@ionic-native/file/';
import {File} from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import Axios from 'axios';
import { WindowRefService, ICustomWindow } from '../windowservice';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
var locales =  require('../locales.js')

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.page.html',
  styleUrls: ['./congratulations.page.scss'],
})
export class CongratulationsPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  storageDirectory:string='';
  filedownload:any;
  a:any;
  public_address:string;
  nodes:string[]=[];
  connected:string='';
  private _window: ICustomWindow;
  decrypted_wallet: string;
  constructor(private transfer:FileTransfer, private file:File,public router:Router,fileTransfer:FileTransfer,windowRef: WindowRefService,private permission:AndroidPermissions) { 
    this._window = windowRef.nativeWindow;
  }
  
  
  ngOnInit() {
    const app = this
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
  }
  
  async goToBackup()
  {
    const app = this
    app.router.navigate(['/backup'])
  }

}
