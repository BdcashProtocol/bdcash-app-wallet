import { Component } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router'
import { Globalization } from '@ionic-native/globalization/ngx';
import { Network } from '@ionic-native/network/ngx';
import { ToastController } from '@ionic/angular';

var locales =  require('./locales.js')

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  language: any = 'en'
  locales: any = locales
  connected: boolean = true
  translations: any = {}
  public appPages = [];
  private dateLogin: string
  private localAddress: string
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private router: Router,
    private menu: MenuController,
    private globalization: Globalization,
    private network: Network,
    public toastController: ToastController
  ) {
    this.initializeApp();
    const app = this
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
    app.appPages = [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: 'apps'
      },
      {
        title: app.translations.ui.identities,
        url: '/account',
        icon: 'journal'
      },
      {
        title: app.translations.ui.remotelogin,
        url: '/remote-login',
        icon: 'qr-code-outline'
      },
      {
        title: app.translations.token.title,
        url: '/token',
        icon: 'wallet'
      },
      {
        title: app.translations.ui.contacts,
        url: '/address-book',
        icon: 'people-circle'
      },
      {
        title: 'Backup',
        url: '/backup',
        icon: 'save'
      },
      {
        title: app.translations.ui.settings,
        url: '/settings',
        icon: 'settings'
      }
    ]

    if (localStorage.getItem('theme') !== null) {
      if(localStorage.getItem('theme') === 'dark'){
        document.body.classList.add("dark")
      }
    }
  }

  fetchAddress() {
    if (localStorage.getItem('lyraWallet') !== null) {
      var indirizzo = localStorage.getItem('lyraWallet').split(':')
      this.localAddress = indirizzo[0]
    }
  }

  initializeApp() {
    const app = this
    this.platform.ready().then(() => {
      if(this.platform.is('ios') === true ){
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#000000');
      }
      this.network.onConnect().subscribe(() => {
        console.log(this.network.type)
      });
      this.network.onDisconnect().subscribe(async () => {
        this.connected = false
        const toast = await this.toastController.create({
          message: app.translations.general.no_connection,
          duration: 2000
        });
        toast.present();
      });
      this.fetchAddress()
    });
  }

}
