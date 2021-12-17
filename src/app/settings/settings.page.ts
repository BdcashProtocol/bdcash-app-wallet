import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
var locales =  require('../locales.js')

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  currency: string = 'eur'
  theme: string = 'light'
  language: any = 'en'
  locales: any = locales
  translations: any = {}

  constructor(private router: Router, private iab: InAppBrowser) {
    if (localStorage.getItem('currency') != null) {
      this.currency = localStorage.getItem('currency')
    }
    if (localStorage.getItem('theme') != null) {
      this.theme = localStorage.getItem('theme')
    }
  }

  goBack() {
    const app = this
    app.router.navigate(['/dashboard'])
  }

  ngOnInit() {
    //this.currency='eur';
    const app = this
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
  }

  changeCurrency() {
    localStorage.setItem('currency', this.currency)
    this.currency = this.currency
  }

  changeLanguage() {
    localStorage.setItem('language', this.language)
    this.language = this.language
  }

  changeTheme() {
    if (localStorage.getItem('theme') !== null) {
      if(localStorage.getItem('theme') === 'dark' && this.theme === 'light'){
        document.body.classList.remove("dark")
      }
    }
    localStorage.setItem('theme', this.theme)
    if(this.theme === 'dark'){
      document.body.classList.add("dark")
    }
    this.theme = this.theme
  }

  openLink(link) {
    this.iab.create(link, '_system', 'location=yes')
  }
}
