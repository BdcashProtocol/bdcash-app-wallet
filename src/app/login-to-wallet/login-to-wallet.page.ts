import { Component, OnInit, ViewChild } from '@angular/core';
import { NFC } from '@ionic-native/nfc/ngx';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform, ModalController, LoadingController } from '@ionic/angular'
import { WindowRefService, ICustomWindow } from '../windowservice';
import { Router } from '@angular/router';
import Axios from 'axios';
//import {createCipher,createDecipher} from 'crypto';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx'
import { HTTP } from '@ionic-native/http/ngx'
import { OverlayEventDetail } from '@ionic/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
var locales =  require('../locales.js')

@Component({
  selector: 'app-login-to-wallet',
  templateUrl: './login-to-wallet.page.html',
  styleUrls: ['./login-to-wallet.page.scss'],
})
export class LoginToWalletPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  add: string = ''
  privKeyRestore: string = ''
  password: string = '';
  decrypted_wallet: string = '';
  nodes: string[] = [];
  connected: string = '';
  passwordRestore: string = '';
  private _window: ICustomWindow;
  isIOS: boolean = false
  fileName: any = ''
  showNFC:boolean = false
  showPK:boolean = false
  haveNFC: boolean = true
  fileBuffer: any = ''
  nfcreader:any

  constructor(private nfc: NFC, private qrScanner: BarcodeScanner, public platform: Platform, windowRef: WindowRefService, public router: Router, private fileChooser: FileChooser, private fileOpener: FileOpener, private filePath: FilePath, private file: File, private http: HTTP, private modalCtrl: ModalController, private loadingController: LoadingController,
    public activatedRoute: ActivatedRoute, private _location: Location) {
      const app = this
      this._window = windowRef.nativeWindow;
      this.platform.ready().then(async () => {
        if(this.platform.is('ios') === true ){
          app.isIOS = true
        }
      })
  }

  ngOnInit() {
    this.add = this.activatedRoute.snapshot.paramMap.get('add')
    const app = this
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
  }

  goBack() {
    const app = this
    app.router.navigate(['/dashboard'])
  }

  loadSidFile() {
    var app = this;
    var file: any
    file = window.document.querySelector('#fileInput')
    let fileBuffer = file.files[0]
    const reader = new FileReader();
    reader.onload = function() {
      var dataKey = reader.result;
      app.addAddress(dataKey)
    };
    reader.readAsText(fileBuffer);
    //console.log('IMAGEFILE', JSON.stringify(file.files))
  }

  loginCardiOS(){
    const app = this
    this.nfc.enabled().then(() => {
      this.nfc.beginSession().subscribe(() => {
        this.nfc.addNdefListener(() => {}).subscribe((event: any) => {
          let NFC = this.nfc.bytesToString(event.tag.ndefMessage[0].payload)
          var hex  = NFC.toString();
          let address = hex.substr(3)
          console.log('ADDRESS', address)
          app.addAddress(address)
          app.closeSession()
        });
      });
    }, () => {
      alert(app.translations.identities.no_nfc);
    });
  }

  closeSession(){
    const app = this
    app.nfcreader.invalidateSession(success => {
      console.log('Can\'t close session')
    }, error => {
      alert(app.translations.identities.no_nfc)
    })
  }

  openRestorePrivKey(){
    const app = this
    app.showPK = true
  }

  closeRestorePrivKey(){
    const app = this
    app.showPK = false
  }

  async importPrivKey(){
    const app = this
    if(app.privKeyRestore !== '' && app.passwordRestore !== ''){
      let privkey = app.privKeyRestore
      let pubkey = await app._window.ScryptaCore.getPublicKey(privkey)
      let address = await app._window.ScryptaCore.getAddressFromPubKey(pubkey)

      var wallet = {
          prv: privkey,
          key: pubkey
      }

      var walletstore = await app._window.ScryptaCore.buildWallet(app.passwordRestore, address, wallet, false)
      app.addAddress(walletstore)
      app.passwordRestore = ''
      app.privKeyRestore = ''
      app.showPK = false
    }
  }

  loginCardAndroid() {
    const app = this
      app.nfcreader = this.nfc.addNdefListener(() => {
        app.showNFC = true
      }, (err) => {
        alert(app.translations.identities.no_nfc);
      }).subscribe(async (event) => {
        app.showNFC = false
        let NFC = this.nfc.bytesToHexString(event.tag.ndefMessage[0].payload)
        var hex  = NFC.toString();
        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
          str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        let address = str.substr(3)
        app.addAddress(address)
        app.nfcreader.unsubscribe()

        if(app.add !== null){
          app.router.navigate(['/account'])
        }else{
          app.router.navigate(['/dashboard'])
        }
    })
  }

  closeNFC(){
    const app = this
    app.nfcreader.unsubscribe()
    app.showNFC = false
  }

  createNewAddress() {
    const app = this
    app.router.navigate(['/home/add'])
  }

  addAddress(address){
    let app = this
    let payload = address.split(':')
    if(payload[0] !== undefined && payload[1] !== undefined){
      if(payload[0].length === 34){
        if(localStorage.getItem('wallet') === null){
          let wallet = [address]
          localStorage.setItem('wallet',JSON.stringify(wallet))
          alert('Address ' + payload[0] + ' imported!')
          this.router.navigate(['/dashboard'])
        }else{
          let wallet = JSON.parse(localStorage.getItem('wallet'))
          let found = false
          for(let xx in wallet){
            let pp = wallet[xx].split(':')
            if(pp[0] === payload[0]){
              found = true
            }
          }
          if(found === false){
            wallet.push(address)
            localStorage.setItem('wallet',JSON.stringify(wallet))
            alert(payload[0] + ' ' + app.translations.identities.imported + '!')
            this.router.navigate(['/dashboard'])
          }else{
            alert(payload[0] + ' ' + app.translations.identities.address_exist)
            this.router.navigate(['/dashboard'])
          }
        }
      }else{
        alert(app.translations.identities.payload_error)
      }
    }else{
      alert(app.translations.identities.payload_error)
    }
  }

  async loading() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      duration: 3500,
      message: 'Please Wait...',
      translucent: true,
    })
    await loading.present();
  }

  async readQrCode() {
    await this.qrScanner.scan().then(async barcodeData => {
      this.addAddress(barcodeData.text)
      if(this.add !== null){
        this.router.navigate(['/account'])
      }else{
        this.router.navigate(['/dashboard'])
      }
    }).catch(err => {
      console.log(err)
    })
  }

}
