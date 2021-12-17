import { Component, OnInit } from '@angular/core';
import { WindowRefService, ICustomWindow } from '../windowservice';
import { ModalController } from '@ionic/angular';
import { fileURLToPath } from 'url';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx'
import { FormGroup } from '@angular/forms'
var locales =  require('../locales.js')

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.page.html',
  styleUrls: ['./upload-modal.page.scss'],
})
export class UploadModalPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  public fileInput: FormGroup;
  refID: string
  file: string
  fileName: string
  message: string
  passwordEncrypt: string
  repeatPasswordEncrypt: string
  fileBuffer: any
  fileUploaded: any
  toggleChecked: boolean = false
  wallet: ''
  encrypted: string = ''
  selected: number = 0
  address: string
  nodes: string[] = [];
  connected: string = ''
  public_address: string;
  encrypted_wallet: string;
  unlockPwd: string;
  encryptPwd: string;
  decrypted_wallet: string;
  private_key: any;
  uploadForm = {
    refID: '',
    file: '',
    message: '',
    encrypt: this.toggleChecked,
    encryptPwd: '',
    password: '',
    fileBuffer: ''
  }
  private _window: ICustomWindow;

  constructor(windowRef: WindowRefService, private modalCtrl: ModalController, private fileChooser: FileChooser, private fileOpener: FileOpener, private filePath: FilePath, private fileUpload: File) {
    this._window = windowRef.nativeWindow;
  }

  ngOnInit() {
    const app = this
    if (localStorage.getItem('selected') !== null) {
      app.selected = parseInt(localStorage.getItem('selected'))
    }
    app.wallet = JSON.parse(localStorage.getItem('wallet'))
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
    let payload = app.wallet[app.selected].split(':')
    app.address = payload[0]
    app.encrypted = payload[1]
    
  }
  
  close() {
    this.modalCtrl.dismiss()
  }

  getAttributes() {
    var file: any
    file = window.document.querySelector('#fileInput')
    this.fileBuffer = file.files[0]
    //console.log('IMAGEFILE', JSON.stringify(file.files))
  }

  unlockWallet() {
    const app = this
    if (app.unlockPwd !== undefined) {
      app.decrypted_wallet = 'Wallet Locked'
      app._window.ScryptaCore.readKey(app.unlockPwd, app.address + ':' + app.encrypted).then(function (response) {
        if (response !== false) {
          app.save();
        } else {
          alert('Wrong Password')
        }
      })
    } else {
      alert('Fill all the fields!')
    }
  }

  save() {
    var errors = false
    var error = ''
    const app = this
    if(app.toggleChecked === true && app.encryptPwd === undefined){
      errors = true
      error = 'Choose an encryption password or disable encryption'
    }
    if(app.message === undefined && app.fileBuffer === undefined){
      errors = true
      error = 'Write a text or select a file first'
    }
    if(app.message === '' && app.fileBuffer === undefined){
      errors = true
      error = 'Write a text or select a file first'
    }
    if(errors === false){
      this.uploadForm.refID = this.refID
      this.uploadForm.file = this.file
      this.uploadForm.encrypt = this.toggleChecked
      this.uploadForm.encryptPwd = this.encryptPwd
      this.uploadForm.password = app.unlockPwd
      this.uploadForm.message = this.message
      this.uploadForm.fileBuffer = this.fileBuffer
      this.modalCtrl.dismiss({
        fileObject: this.uploadForm
      })
    }else{
      alert(error)
    }
  }
}
