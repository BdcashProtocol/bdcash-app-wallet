import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { WindowRefService, ICustomWindow } from '../windowservice';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
var locales =  require('../locales.js')
import { SocketOne, SocketTwo, SocketThree, SocketFour, SocketFive, SocketSix } from '../app.module';

@Component({
  selector: 'app-remotelogin',
  templateUrl: './remotelogin.page.html',
  styleUrls: ['./remotelogin.page.scss'],
})

export class RemoteloginPage implements OnInit {
  locales: any = locales
  language: string = 'en'
  wallet: ''
  isSending: boolean = false
  encrypted: string = ''
  interval: any = ''
  selected: number = 0
  address: string
  private _window: ICustomWindow
  translations: any = {}
  unlockPwd: string;
  scrypta: any = {}
  global: any = {}
  constructor(private router: Router, windowRef: WindowRefService, private socketone: SocketOne, private sockettwo: SocketTwo, private socketthree: SocketThree, private socketfour: SocketFour, private socketfive: SocketFive, private socketsix: SocketSix, private qrScanner: BarcodeScanner) {
    const app = this
    app._window = windowRef.nativeWindow;
    this.socketone.connect()
    this.sockettwo.connect()
    this.socketthree.connect()
    this.socketfour.connect()
    this.socketfive.connect()
    this.socketsix.connect()
    this.router.events.subscribe(async (val) => {
      app.isSending = false
      app.unlockPwd = ''
    })
  }

  goBack() {
    const app = this
    app.router.navigate(['/dashboard'])
  }

  ngOnInit() {
    const app = this
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    if (localStorage.getItem('selected') !== null) {
      app.selected = parseInt(localStorage.getItem('selected'))
    }
    app.translations = this.locales.default[app.language]
    app.wallet = JSON.parse(localStorage.getItem('wallet'))
    let payload = app.wallet[app.selected].split(':')
    app.address = payload[0]
    app.encrypted = payload[1]
    clearInterval(app.interval)
    app.unlockPwd = ''
    app.isSending = false
  }

  scanQRCode() {
    const app = this
    if(app.unlockPwd !== ''){
      app._window.ScryptaCore.readKey(app.unlockPwd, app.address + ':' + app.encrypted).then(async function (check) {
        if(check !== false){
            app.qrScanner.scan().then(barcodeData => {
              app.isSending = true
              var message = ''
              let qrRequest = barcodeData.text.split(':')
              var address = qrRequest[1]
              var protocol = qrRequest[0] + '://'
              app._window.ScryptaCore.readKey(app.unlockPwd, app.address + ':' + app.encrypted).then(async function (response) {
                let tosign = JSON.stringify({
                    protocol: protocol,
                    request: address,
                    sid: app.address + ':' + app.encrypted
                })
                message = await app._window.ScryptaCore.signMessage(response.prv, tosign)
                app.socketone.emit('message', message);
                app.sockettwo.emit('message', message);
                app.socketthree.emit('message', message);
                app.socketfour.emit('message', message);
                app.socketfive.emit('message', message);
                app.socketsix.emit('message', message);
              })
              app.interval = setInterval(function(){
                app._window.ScryptaCore.readKey(app.unlockPwd, app.address + ':' + app.encrypted).then(async function (response) {
                app.socketone.emit('message', message);
                app.sockettwo.emit('message', message);
                app.socketthree.emit('message', message);
                app.socketfour.emit('message', message);
                app.socketfive.emit('message', message);
                app.socketsix.emit('message', message);
              }, 2000)
            })
          }).catch(err => {
            console.log(err)
          })
        }else{
          alert('Wrong password!')
        }
      })
    }
  }
}
