import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from "chart.js";
import axios from 'axios';
import { ModalController, Platform } from '@ionic/angular';
import { WindowRefService, ICustomWindow } from '../windowservice';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';
var locales =  require('../locales.js')
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {
  wallet = []
  address: string = ''
  pricelabel: string = ''
  selected: number = 0
  balance: any = '-'
  encrypted: string = ''
  chain: string = 'main'
  lyra: number;
  value: string = '0'
  language: any = 'en'
  translations: any = {}
  locales: any = locales
  idanode: string = 'https://nodesh01.bdcashprotocol.com'
  valueBTC: string = '0';
  valore: number;
  options: any;
  dati: any;
  transactions = []
  unconfirmed = []
  currency: string = 'eur'
  ticker: string = ''
  isRefreshing: boolean = false
  current_price: any = 0
  private _window: ICustomWindow;
  @ViewChild("lineCanvas", {static: true}) lineCanvas: ElementRef;
  lineChart: Chart;
 
  constructor(
    windowRef: WindowRefService,
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    public router:Router,
    private platform: Platform,
    private menu: MenuController
  ) {
    const app = this
    app._window = windowRef.nativeWindow;

    app.router.events.subscribe(async (val) => {
      app.menu.close();
      if(app.isRefreshing === false){
        app.isRefreshing = true
        app.nodesh = await app._window.BDCashCore.connectNode()
        await app.fetchTransactions()
        await app.getBalance()
        app.isRefreshing = false
      }
    })
  }

  async ngOnInit() {
    const app = this
    if (localStorage.getItem('selected') !== null) {
      app.selected = parseInt(localStorage.getItem('selected'))
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
    
    app.nodesh = await app._window.BDCashCore.connectNode()
    this.fetchGraph()
    await this.fetchTransactions()
    await this.getBalance()

    setInterval(async function(){
      app.isRefreshing = true
      await app.fetchTransactions()
      await app.getBalance()
      app.isRefreshing = false
    },10000)
  }

  async getBalance() {
    const app = this
    if(app.chain === 'main'){
      if (localStorage.getItem('currency') !== null) {
        app.currency = localStorage.getItem('currency')
      }

      let url = 'https://api.coingecko.com/api/v3/simple/price?ids=bdcash&vs_currencies=btc,' + app.currency
      axios.get(url)
        .then(function (result) {
          let price: number = result.data.bdcash[app.currency]
          var priceBTC = result.data.bdcash['btc']
          app.current_price = price
          app.pricelabel = app.translations.home.price_is + ' ' + app.current_price + ' ' + app.currency.toUpperCase()
          axios.get(app.nodesh + '/balance/' + app.address)
            .then(function (response) {
              app.balance = response.data['balance'].toFixed(4)
              app.value = (parseFloat(app.balance) * parseFloat(app.current_price)).toFixed(4)
              app.valueBTC = (parseFloat(app.balance) * parseFloat(priceBTC)).toFixed(8)
              app.balance = parseFloat(app.balance).toFixed(4)
            })
        }).catch(error => {
          this.getBalance()
        })
    }else{
      let sidechainBalance = await axios.post(app.nodesh + '/sidechain/balance', { dapp_address: app.address, sidechain_address: app.chain })
      app.balance = sidechainBalance.data.balance
      app.ticker = sidechainBalance.data.symbol
    }
  }

  async fetchTransactions() {
    const app = this
    if(app.chain === 'main'){
      axios.get(app.nodesh + '/transactions/' + app.address)
        .then(function (response) {
          app.transactions = response.data['data']
          app.unconfirmed = response.data['unconfirmed']
        })
    }else{
      axios.post(app.nodesh + '/sidechain/transactions', { dapp_address: app.address, sidechain_address: app.chain })
      .then(function (response) {
        app.transactions = response.data.transactions
      })
    }
  }

  async fetchGraph() {
    var app = this;
    app.currency = 'eur'
    if (localStorage.getItem('currency') !== null) {
      app.currency = localStorage.getItem('currency')
    }
    var url: string
    if (app.currency == 'eur') {
      url = 'https://api.coingecko.com/api/v3/coins/bdcash/market_chart?vs_currency=eur&days=4'
    }
    else if (app.currency == 'usd') {
      url = 'https://api.coingecko.com/api/v3/coins/bdcash/market_chart?vs_currency=usd&days=4'
    }
    else if (app.currency == 'gbp') {
      url = 'https://api.coingecko.com/api/v3/coins/bdcash/market_chart?vs_currency=gbp&days=4'
    }
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bdcash&vs_currencies=btc,' + app.currency)
      .then(function (result) {
        let price: number = result.data.bdcash[app.currency]
        var priceBTC = result.data.bdcash['btc']
        app.current_price = price
        app.pricelabel = "Price is " + app.current_price + ' ' + app.currency.toUpperCase()
        axios.get(url)
          .then(function (response) {
            app.dati = response.data.prices
            var labels = []
            var data = []
            for(let i in app.dati){
              let date = new Date(app.dati[i][0]).toLocaleDateString() +' '+new Date(app.dati[i][0]).toLocaleTimeString()
              labels.push(date)
              data.push(app.dati[i][1])
            }
            if(app.chain === 'main'){
              setTimeout(function(){
                app.lineChart = new Chart(app.lineCanvas.nativeElement, {
                  type: "line",
                  options: {
                    responsive: true,
                    legend: {
                      display: false,
                        labels: {
                          boxWidth: 0
                        }
                    },
                    scales: {
                      xAxes: [{
                        display: false,
                        scaleLabel: {
                          display: false,
                          labelString: 'Month'
                        }
                      }],
                      yAxes: [{
                        display: false,
                        scaleLabel: {
                          display: true,
                          labelString: 'Value'
                        }
                      }]
                    }
                  },
                  data: {
                    labels: labels,
                    datasets: [
                      {
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: "rgba(216,39,58,0.4)",
                        borderColor: "rgba(216,39,58,1)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgba(216,39,58,0)",
                        pointBackgroundColor: "transparent",
                        pointBorderWidth: 0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(216,39,58,1)",
                        pointHoverBorderColor: "rgba(216,39,58,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: data,
                        spanGaps: false
                      }
                    ]
                  }
                })
              },300)
            }
          })
      });
  }


  async doRefresh(event) {
    const app = this
    if(app.isRefreshing === false){
      app.isRefreshing = true
      app.fetchGraph()
      await app.fetchTransactions()
      await app.getBalance()

      setTimeout(() => {
        event.target.complete();
        app.isRefreshing = false
      }, 2000);
    }
  }

  openDetails(response) {
    this.iab.create('https://explorer.scryptachain.org/transaction/' + response.txid, '_system', 'location=yes')
  }
}