import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { WindowRefService, ICustomWindow } from '../windowservice';
import { Clipboard } from '@ionic-native/clipboard/ngx'
import { OverlayEventDetail } from '@ionic/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
var locales =  require('../locales.js')

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.page.html',
  styleUrls: ['./account-detail.page.scss'],
})

export class AccountDetailPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  @Input() response: any
  index
  private _window: ICustomWindow;
  wallet: any
  address: any = ''
  public myAngularxQrCode: string = null;
  encrypted: any
  showChange: boolean = false
  balance: any = 0
  idanode: string = 'https://nodesh01.bdcashprotocol.com'
  transactions: any = []
  password: any = ''
  passwordChange: any = ''
  passwordChangeRepeat: any = ''
  private_key: any = ''
  showUnlock:boolean = false
  constructor(public alertController: AlertController, public router:Router, private clipboard: Clipboard, windowRef: WindowRefService, private modalCtrl: ModalController, private iab: InAppBrowser) {
    this._window = windowRef.nativeWindow;
  }

  ngOnInit() {
    const app = this
    app.wallet = JSON.parse(localStorage.getItem('wallet'))
    let payload = app.wallet[app.index].split(':')
    app.address = payload[0]
    app.myAngularxQrCode = app.address
    app.encrypted = payload[1]
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
    setTimeout(async () => {
      app.idanode = await app._window.ScryptaCore.connectNode()
      axios.get(app.idanode + '/transactions/' + app.address).then(response => {
        app.transactions = response.data.data
      })
      axios.get(app.idanode + '/balance/' + app.address).then(response => {
        app.balance = response.data.balance.toFixed(4)
      })
    },50)
  }

  close() {
    this.modalCtrl.dismiss()
  }

  openChangePassword(){
    const app = this
    app.showChange = true
  }

  hideChangePassword(){
    const app = this
    app.showChange = false
  }

  changePassword() {
    const app = this
    if (app.password !== '') {
      app._window.ScryptaCore.readKey(app.password, app.address + ':' + app.encrypted).then(function (response) {
        if (response !== false) {
          if(app.passwordChange === app.passwordChangeRepeat){
            var wallet = {
                prv: response.prv,
                key: response.key
            }
            app._window.ScryptaCore.buildWallet(app.passwordChange, app.address, wallet, false).then(function(response){
              app.wallet[app.index] = response
              localStorage.setItem('wallet',JSON.stringify(app.wallet))
              app.showChange = false
              app.password = ''
              app.passwordChange = ''
              app.passwordChangeRepeat = ''
              let payload = app.wallet[app.index].split(':')
              app.address = payload[0]
              app.encrypted = payload[1]
              alert(app.translations.identities.password_changed)
            })
          }else{
            alert(app.translations.home.password_not_match)
          }
        } else {
          alert('Wrong Password')
        }
      })
    } else {
      alert('Fill all the fields!')
    }
  }

  copyAddress() {
    const app = this
    app.clipboard.copy(app.address)
    alert('Address copied!')
  }

  useAddress(){
    const app = this
    localStorage.setItem('selected', app.index)
    alert('Address selected!')
    app.router.navigate(['/dashboard'])
    this.modalCtrl.dismiss()
  }

  async confirmDelete() {
    const app = this
    const alert = await this.alertController.create({
      header: 'Please confirm.',
      message: 'Do you want to delete this address?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: async () => {
            let updated = []
            for(let k in app.wallet){
              if(parseInt(k) !== parseInt(app.index)){
                updated.push(app.wallet[k])
              }
            }
            await localStorage.setItem('wallet',JSON.stringify(updated))
            app.wallet = updated
            app.close()
          }
        }
      ]
    });

    await alert.present();
  }

  copyPrivKey() {
    const app = this
    app.clipboard.copy(app.private_key)
    alert('Private key copied!')
  }

  unlock(){
    const app = this
    app.showUnlock = true
  }

  lock(){
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
        } else {
          alert('Wrong Password')
        }
      })
    } else {
      alert('Fill all the fields!')
    }
  }

  openInExplorer() {
    const app = this
    this.iab.create('https://explorer.scryptachain.org/address/' + app.address, '_system', 'location=yes'); return false;
  }

  openDetails(response) {
    this.iab.create('https://explorer.scryptachain.org/transaction/' + response.txid, '_system', 'location=yes')
  }

}
