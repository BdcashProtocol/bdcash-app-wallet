import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Clipboard } from '@ionic-native/clipboard/ngx'
import { ToastController, ModalController } from '@ionic/angular';
import { ModaltransactionPage } from '../modaltransaction/modaltransaction.page';
import { WindowRefService, ICustomWindow } from '../windowservice';
import { OverlayEventDetail } from '@ionic/core';
import { AccountDetailPage } from '../account-detail/account-detail.page';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
var locales =  require('../locales.js')

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})

export class AccountPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  balance: string = '-'
  wallet: ''
  accounts = []
  isParsing: boolean = false
  toggleNoBalance: boolean = false
  encrypted: string = ''
  selected: number = 0
  private _window: ICustomWindow;
  nodesh: string = 'https://nodesh01.bdcashprotocol.com'
  address: string
  transactions = []
  constructor(private clipboard: Clipboard, private toast: ToastController, private modalCtrl: ModalController, public router:Router, windowRef: WindowRefService, private _location: Location, private iab: InAppBrowser) {
    const app = this
    app._window = windowRef.nativeWindow;

    this.router.events.subscribe(async (val) => {
      this.accounts = []
      app.nodesh = await app._window.BDCashCore.connectNode()
      this.parseWallet()
    })
   }

  async ngOnInit() {
    const app = this
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
  }
  
  async parseWallet() {
    const app = this
    if(app.isParsing === false){
      app.isParsing = true
      app.accounts = []
      if (localStorage.getItem('selected') !== null) {
        app.selected = parseInt(localStorage.getItem('selected'))
      }
      app.wallet = JSON.parse(localStorage.getItem('wallet'))
      let payload = app.wallet[app.selected].split(':')
      app.address = payload[0]
      app.encrypted = payload[1]
      for (let i = 0; i < app.wallet.length; i++) {
        let payload = app.wallet[i].split(':')
        let transactions = await axios.get(app.nodesh + '/transactions/' + payload[0])
        let balance = await axios.get(app.nodesh + '/balance/' + payload[0])
        let address = {
          address: payload[0],
          balance: balance.data.balance.toFixed(4),
          transactions: transactions.data.data,
          index: i
        }
        app.accounts.push(address)
      }
      setTimeout(function(){
        app.isParsing = false
      }, 5000)
    }
  }
  
  async doRefresh(event) {
    const app = this
    app.accounts = []
    app.parseWallet()

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  goBack(){
    const app = this
    app.router.navigate(['/dashboard'])
  }

  addAccount() {
    const app = this
    app.router.navigate(['/login-to-wallet/add'])
  }

  async fetchTransactions() {
    const app = this
    axios.get(app.nodesh + '/transactions/' + app.address)
      .then(function (response) {
        app.transactions = response.data['data']
      })
  }

  async openDetails(index) {
    const app = this
    const modal = await this.modalCtrl.create({
      component: AccountDetailPage,
      componentProps: {
        index: index
      }
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      app.parseWallet()
    })
    await modal.present()
  }

}
