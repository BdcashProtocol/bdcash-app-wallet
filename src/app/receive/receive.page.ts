import { Component, OnInit } from '@angular/core'
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import axios from 'axios'
import { Clipboard } from '@ionic-native/clipboard/ngx'
import { WindowRefService, ICustomWindow } from '../windowservice';
var locales =  require('../locales.js')
import { NFC } from '@ionic-native/nfc/ngx'
import { Platform } from '@ionic/angular'

declare var QRious: any
@Component({
  selector: 'app-receive',
  templateUrl: './receive.page.html',
  styleUrls: ['./receive.page.scss'],
})
export class ReceivePage implements OnInit {
  language: any = 'en'
  locales: any = locales
  password: any = ''
  translations: any = {}
  amount: any = 0
  currency: string = 'eur'
  chain: string = 'main'
  amountLyra: any = 0
  amountSidechain: any = 0
  ticker: any = ''
  amountFIAT: any = 0
  price: any = 0
  focus: any = 'lyra'
  encrypted: string = ''
  wallet: string = ''
  idanode: string = 'https://idanodejs01.scryptachain.org'
  selected: number = 0
  isSending: boolean = false
  guestBalance: any = ''
  address: string
  showUnlock: boolean = false
  guestWallet: any = ''
  encodedData: {}
  showNFC:boolean = false
  showQR:boolean = false
  private _window: ICustomWindow;
  haveNFC: boolean = true
  nfcreader:any
  isIOS: boolean = false
  public myAngularxQrCode: string = null;
  constructor(private nfc: NFC, public platform: Platform, windowRef: WindowRefService, private clipboard: Clipboard) { 
    const app = this
    app._window = windowRef.nativeWindow;
    setTimeout(async () => {
      app.idanode = await app._window.ScryptaCore.connectNode()
    },50)
    app.platform.ready().then(async () => {
      if(this.platform.is('ios') === true ){
        app.isIOS = true
      }
    })
  }

  async ngOnInit() {
    const app = this
    
    if (localStorage.getItem('selected') !== null) {
      app.selected = parseInt(localStorage.getItem('selected'))
    }
    
    if (localStorage.getItem('currency') != null) {
      this.currency = localStorage.getItem('currency')
    }
    
    if (localStorage.getItem('chain') !== null) {
      app.chain = localStorage.getItem('chain')
    }
    
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]

    app.wallet = JSON.parse(localStorage.getItem('wallet'))
    let payload = app.wallet[app.selected].split(':')
    app.address = payload[0]
    app.encrypted = payload[1]

    if(app.chain !== 'main'){
      let sidechainBalance = await axios.post(app.idanode + '/sidechain/balance', { dapp_address: app.address, sidechain_address: app.chain })
      app.ticker = sidechainBalance.data.symbol
    }

    this.calculateQRCode()
    app.price = await app.returnLyraPrice()
  }

  copyAddress() {
    const app = this
    app.clipboard.copy(app.address)
    alert('Address copied!')
  }

  openModalQR() {
    const app = this
    if(app.showQR === false){
      app.showQR = true
    }else{
      app.showQR = false
    }
  }
  
  receiveCardiOS(){
    const app = this
    this.nfc.enabled().then(() => {
      app.showUnlock = true
      this.nfc.beginSession().subscribe(() => {
        this.nfc.addNdefListener(() => {}).subscribe(async (event: any) => {
          let NFC = this.nfc.bytesToString(event.tag.ndefMessage[0].payload)
          var hex  = NFC.toString();
          let address = hex.substr(3)
          app.guestWallet = address
          let split = app.guestWallet.split(':')
          if(app.chain !== 'main'){
            let sidechainBalance = await axios.post(app.idanode + '/sidechain/balance', { dapp_address: split[0], sidechain_address: app.chain })
            app.guestBalance = sidechainBalance.data.balance
            if(app.guestBalance > app.amountSidechain){
              app.showUnlock = true
            }else{
              alert(app.translations.token.no_balance)
            }
          }else{
            app.showUnlock = true
          }
          app.closeSession()
        });
      });
    }, () => {
      alert(app.translations.identities.no_nfc);
    });
  }

  receiveCardAndroid() {
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
        app.guestWallet = address
        let split = app.guestWallet.split(':')
        if(app.chain !== 'main'){
          let sidechainBalance = await axios.post(app.idanode + '/sidechain/balance', { dapp_address: split[0], sidechain_address: app.chain })
          app.guestBalance = sidechainBalance.data.balance
          if(app.guestBalance > app.amountSidechain){
            app.showUnlock = true
          }else{
            alert(app.translations.token.no_balance)
          }
        }else{
          app.showUnlock = true
        }
        app.nfcreader.unsubscribe()
    })
  }
  
  closeNFC(){
    const app = this
    app.nfcreader.unsubscribe()
    app.showNFC = false
  }

  unlockWallet() {
    const app = this
    if (app.password !== '') {
      app._window.ScryptaCore.readKey(app.password, app.guestWallet).then(async function (response) {
        if (response !== false) {
          app.isSending = true
          let guestSplit = app.guestWallet.split(':')
          if(app.chain === 'main'){
            app.amountLyra = parseFloat(app.amountLyra.replace(',','.').replace('0',''))
            await app._window.ScryptaCore.send(app.password, app.address, app.amountLyra, '', app.guestWallet).then((result) => {
              app.isSending = false
              if(result !== false && result !== undefined && result !== null){
                alert(app.translations.send.sent_successful)
                app.amountLyra = 0
                app.amountFIAT = 0
              }else{
                alert(app.translations.token.send_fail)
              }
              app.password = ''
              app.showUnlock = false
              app.guestWallet = ''
            })
          }else{
            let responseSend = await axios.post(app.idanode + '/sidechain/send', 
              { 
                from: guestSplit[0], 
                private_key: response.prv,
                pubkey: response.key,
                sidechain_address: app.chain,
                to: app.address,
                amount: app.amountSidechain
              })
            app.isSending = false
            if(responseSend.data.error === undefined){
              alert(app.translations.send.sent_successful)
            }else{
              alert(responseSend.data.description)
            }
            app.password = ''
            app.amountSidechain = 0
            app.showUnlock = false
            app.guestWallet = ''
          }
        } else {
          alert('Wrong Password')
        }
      })
    } else {
      alert('Fill all the fields!')
    }
  }

  lock() {
    const app = this
    app.showUnlock = false
  }

  closeSession(){
    const app = this
    app.nfcreader.invalidateSession(success => {
      console.log('Can\'t close session')
    }, error => {
      alert(app.translations.identities.no_nfc)
    })
  }

  calculateQRCode() {
    const app = this
    if (app.amountLyra === 0) {
      app.myAngularxQrCode = app.address
    } else if (app.amountLyra != 0) {
      app.myAngularxQrCode = 'lyra:' + this.address + "?" + "amount=" + app.amountLyra
    }
  }

  returnLyraPrice(){
    const app = this
    return new Promise(response => {
    
    let url = 'https://api.coingecko.com/api/v3/simple/price?ids=scrypta&vs_currencies=' + app.currency

    axios.get(url)
      .then(function (result) {
        let price:number = result.data.scrypta[app.currency]
        response(price)
      })
    })
  }

  addNumber(number){
    const app = this
    if(app.focus === 'lyra'){
      if(parseFloat(app.amountLyra) === 0){
        app.amountLyra = ''
      }
      if(app.chain === 'main'){
        let display = app.amountLyra.toString()
        display = display.concat(number.toString())
        app.amountLyra = parseFloat(display)
      }else{
        let display = app.amountSidechain.toString()
        display = display.concat(number.toString())
        app.amountSidechain = parseFloat(display)
      }
    }else{
      if(parseFloat(app.amountFIAT) === 0){
        app.amountFIAT = ''
      }
      let display = app.amountFIAT.toString()
      display = display.concat(number.toString())
      app.amountFIAT = parseFloat(display)
    }
  }

  addDot(){
    const app = this
    if(app.focus === 'lyra'){
      if(app.chain === 'main'){
        let display = app.amountLyra.toString()
        let dot = display.split('.')
        if(!dot[1]){
          display = display.concat('.')
          app.amountLyra = display
        }
      }else{
        let display = app.amountSidechain.toString()
        let dot = display.split('.')
        if(!dot[1]){
          display = display.concat('.')
          app.amountSidechain = display
        }
      }
    }else{
      let display = app.amountFIAT.toString()
      let dot = display.split('.')
      if(!dot[1]){
        display = display.concat('.')
        app.amountFIAT = display
      }
    }
  }

  removeNumber(){
    const app = this
    if(app.focus === 'lyra'){
      if(app.chain === 'main'){
        let display = app.amountLyra.toString()
        let max = display.length - 1
        display = display.substr(0,max)
        if(display.length > 0){
          app.amountLyra = parseFloat(display)
        }else{
          app.amountLyra = 0
        }
      }else{
        let display = app.amountSidechain.toString()
        let max = display.length - 1
        display = display.substr(0,max)
        if(display.length > 0){
          app.amountSidechain = parseFloat(display)
        }else{
          app.amountSidechain = 0
        }
      }
    }else{
      let display = app.amountFIAT.toString()
      let max = display.length - 1
      display = display.substr(0,max)
      if(display.length > 0){
        app.amountFIAT = parseFloat(display)
      }else{
        app.amountFIAT = 0
      }
    }
  }
  
  fixInputs(what){
    const app = this
    app.focus = what
    if(what === 'lyra'){
      if(app.amountFIAT === '' || app.amountFIAT === 'NaN'  || app.amountFIAT === null){
        app.amountFIAT = 0
      }
      if(app.amountLyra === '0.000'){
        app.amountLyra = 0
      }
    }else{
      if(app.amountLyra === '' || app.amountLyra === 'NaN'  || app.amountLyra === null || app.amountLyra === '0.0000'){
        app.amountLyra = 0
      }
    }
  }

  async calculateFIAT() {
    const app = this
    if(app.focus === 'lyra'){
      if(app.amountLyra !== null){
        app.price = await this.returnLyraPrice()
        let calculate = parseFloat(app.amountLyra) * parseFloat(app.price)
        if(calculate.toString() !== "NaN"){
          app.amountFIAT = calculate.toFixed(2)
          this.calculateQRCode()
        }else{
          app.amountFIAT = 0
        }
      }else{
        app.amountFIAT = 0
      }
    }
  }

  async calculateLyra() {
    const app = this
    if(app.focus === 'fiat'){
      if(app.amountFIAT !== null){
        app.price = await this.returnLyraPrice()
        let calculate = parseFloat(app.amountFIAT) / parseFloat(app.price)
        if(calculate.toString() !== "NaN"){
          if(app.amountLyra > 0){
            app.amountLyra = calculate.toFixed(4)
          }else{
            app.amountLyra = calculate
          }
          this.calculateQRCode()
        }else{
          app.amountLyra = 0
        }
      }else{
        app.amountFIAT = 0
      }
    }
  }
}
