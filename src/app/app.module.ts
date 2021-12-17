import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Globalization } from '@ionic-native/globalization/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WindowRefService } from './windowservice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
//import { File } from '@ionic-native/file/';
import { Network } from '@ionic-native/network/ngx';
import {File} from '@ionic-native/file/ngx'
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
//import {createCipher,createDecipher} from 'crypto';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx'
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {HTTP} from '@ionic-native/http/ngx'
import {Clipboard} from '@ionic-native/clipboard/ngx'
import { ChartsModule } from 'ng2-charts';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SocketIoModule } from 'ngx-socket-io';

@Injectable()
export class SocketOne extends Socket { 
    constructor() {
        super({ url: 'http://idanodejs01.scryptachain.org:42226', options: {} });
    }
}
 
@Injectable()
export class SocketTwo extends Socket {
    constructor() {
        super({ url: 'http://idanodejs02.scryptachain.org:42226', options: {} });
    }
}

@Injectable()
export class SocketThree extends Socket {
    constructor() {
        super({ url: 'http://idanodejs03.scryptachain.org:42226', options: {} });
    }
}

@Injectable()
export class SocketFour extends Socket {
    constructor() {
        super({ url: 'http://idanodejs04.scryptachain.org:42226', options: {} });
    }
}

@Injectable()
export class SocketFive extends Socket {
    constructor() {
        super({ url: 'http://idanodejs05.scryptachain.org:42226', options: {} });
    }
}

@Injectable()
export class SocketSix extends Socket {
    constructor() {
        super({ url: 'http://idanodejs06.scryptachain.org:42226', options: {} });
    }
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    SocketIoModule,
    IonicModule.forRoot({
      swipeBackEnabled: false,
      hardwareBackButton: false
    }),
    AppRoutingModule,
    ChartsModule
  ],
  providers: [
    SocketOne, 
    SocketTwo,
    SocketThree,
    SocketFour,
    SocketFive,
    SocketSix,
    Globalization,
    LoadingController,
    Clipboard,
    Network,
    HTTP,
    BarcodeScanner,
    //QRScanner,
    AndroidPermissions,
    FileChooser,
    FileOpener,
    FilePath,
    NFC,
    Ndef,
    File,
    FileTransfer,
    FileTransferObject,
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
