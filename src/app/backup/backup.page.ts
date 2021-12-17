import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { WindowRefService, ICustomWindow } from '../windowservice';
import { File } from '@ionic-native/file/ngx';
import {Router} from '@angular/router'
import * as jsPdf from 'jspdf'
import {Location} from '@angular/common';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
var locales =  require('../locales.js')

declare var QRious: any
@Component({
  selector: 'app-backup',
  templateUrl: './backup.page.html',
  styleUrls: ['./backup.page.scss'],
})
export class BackupPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  address: string
  public_address: string;
  filedownload: Blob;
  private _window: ICustomWindow;
  password: string = ''
  private_key = ''
  encrypted: string
  wallet: string = ''
  selected: any = 0
  pdfDownload: Blob
  showUnlock: boolean = false
  constructor(public platform: Platform, private permission: AndroidPermissions, private file: File, private transfer: FileTransfer, windowRef: WindowRefService, private router:Router, private _location: Location, private socialSharing: SocialSharing) {
    this._window = windowRef.nativeWindow;
  }

  goBack(){
    const app = this
    app.router.navigate(['/dashboard'])
  }

  ngOnInit() {
    const app = this
    if (localStorage.getItem('selected') !== null) {
      app.selected = parseInt(localStorage.getItem('selected'))
    }
    app.wallet = JSON.parse(localStorage.getItem('wallet'))
    let payload = app.wallet[app.selected].split(':')
    app.address = payload[0]
    app.encrypted = payload[1]
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
  }

  getPermissions() {
    this.permission.checkPermission(this.permission.PERMISSION.READ_EXTERNAL_STORAGE).then(status => {
      if (status.hasPermission) {
        this.downloadFile()
      }
      else {
        this.permission.requestPermission(this.permission.PERMISSION.READ_EXTERNAL_STORAGE).then(status => {
          if (status.hasPermission) {
            this.downloadFile()
          }
        })
      }
    })
  }

  async downloadFile() {
    const app = this
    var sidfile = new Blob([app.wallet[app.selected]], { type: 'sid' })
    var location
    var message
    if(this.platform.is('android') === true ){
      location = this.file.externalRootDirectory + '/Download/'
      message = 'Sid File saved in Download folder!'
      this.file.writeFile(location, this.address + '.sid', sidfile, { replace: true }).then(response => {
        alert(message)
      }).catch(err => {
        alert('Can\'t save file: ' + err.message + '.')
      })
    }else{
      location = this.file.documentsDirectory
      this.file.writeFile(location, app.address + '.sid', sidfile, { replace: true }).then(response => {
        var options = {
          subject: 'Sid file Backup',
          message: 'Save it in a safe place',
          files: [location + '/' + app.address + '.sid']
        }
        this.socialSharing.shareWithOptions(options).catch((err) => {
          console.log(err)
        });
      }).catch(err => {
        alert('Can\'t save file: ' + err.message + '.')
      })
    }
  }

  unlock() {
    const app = this
    app.showUnlock = true
  }

  lock() {
    const app = this
    app.showUnlock = false
  }

  unlockWallet() {
    const app = this
    if (app.password !== '') {
      app._window.ScryptaCore.readKey(app.password, app.address + ':' + app.encrypted).then(function (response) {
        if (response !== false) {
          app.lock()
          app.private_key = response.prv
          app.password = ''
          app.getQRCode()
        } else {
          alert('Wrong Password')
        }
      })
    } else {
      alert('Fill all the fields!')
    }
  }

  getQRCode() {
    const app = this
    var QrCode = new QRious({ value: app.address + ':' + app.encrypted, size: 500 })

    var pdf = new jsPdf("p", "mm", "a4")
    pdf.text("Encrypted Wallet.", 57, 38)

    pdf.addImage(QrCode.toDataURL(), "JPEG", 55, 40, 100, 100)
    pdf.text("Public Address", 10, 158)
    var QrCodePublicAddress = new QRious({ value: this.address, size: 500 })
    pdf.addImage(QrCodePublicAddress.toDataURL(), "JPEG", 10, 160, 60, 60)
    pdf.text('Private Key', 140, 158)
    var QrCodeDecryptedWallet = new QRious({ value: this.private_key, size: 500 })
    pdf.addImage(QrCodeDecryptedWallet.toDataURL(), "JPEG", 140, 160, 60, 60)
    var pdfOutPut = pdf.output()
    var buffer = new ArrayBuffer(pdfOutPut.length)
    var array = new Uint8Array(buffer)
    for (var i = 0; i < pdfOutPut.length; i++) {
      array[i] = pdfOutPut.charCodeAt(i)
    }
    var location
    var message
    if(this.platform.is('android') === true ){
      location = this.file.externalRootDirectory + '/Download/'
      message = 'Paper wallet saved in Download folder!'
      this.file.writeFile(location, this.address + '.pdf', buffer, { replace: true }).then(response => {
          alert(message)
        }).catch(err => {
          alert('Can\'t save file: ' + err.message + '.')
        })
    }else{
      location = this.file.documentsDirectory
      this.file.writeFile(location, app.address + '.pdf', buffer, { replace: true }).then(response => {
        var options = {
          subject: 'Paper wallet Backup',
          message: 'Save it in a safe place',
          files: [location + '/' + app.address + '.pdf']
        }
        this.socialSharing.shareWithOptions(options).catch((err) => {
          console.log(err)
        });
      }).catch(err => {
        alert('Can\'t save file: ' + err.message + '.')
      })
    }
  }

}
