import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
var locales =  require('../locales.js')

@Component({
  selector: 'app-successfulsend',
  templateUrl: './successfulsend.page.html',
  styleUrls: ['./successfulsend.page.scss'],
})
export class SuccessfulsendPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  constructor(private router:Router) { 

  }

  ngOnInit() {
    const app = this
    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
  }

  goDashboard()
  {
    this.router.navigate(['/dashboard'])
  }

}
