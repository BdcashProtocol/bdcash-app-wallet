import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { WindowRefService, ICustomWindow } from '../windowservice';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import {Location} from '@angular/common'
var locales =  require('../locales.js')

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  password:string;
  repassword:string;
  nodes:string[]=[];
  backupAlert:boolean=true;
  add: string = '';
  connected:string="https://nodesh01.bdcashprotocol.com";
  encrypted_wallet: 'NO WALLET'; 
  unlockPwd: '';
  createPwd: '';
  isCreating:boolean = false;
  createPwdRepeat: '';
  public_address: string;
  public_qrcode: '';
  address_balance: string='';
  explorer_url: '';
  passwordShow: false;
  importShow: false;
  decrypted_wallet: '';
  transactionMessage: string='Loading transactions...';

  noTransactions: boolean;
  currentPage: 1;
  countTransactions: 0;
  items: [];
  private _window: ICustomWindow;
  constructor(
    windowRef: WindowRefService,
    navCtrl:NavController,
    public router:Router,
    public activatedRoute:ActivatedRoute, 
    private _location: Location
  ){
    this._window = windowRef.nativeWindow;
    //this.create()
  }

  ngOnInit()
  {
    const app = this
    this.add = this.activatedRoute.snapshot.paramMap.get('add')
    this.checkUser()

    if (localStorage.getItem('language') !== null) {
      app.language = localStorage.getItem('language')
    }
    app.translations = this.locales.default[app.language]
    
    setTimeout(function(){
      this.backupAlert=false;
    })
  }

  goBack(){
    const app = this
    app.router.navigate(['/dashboard'])
  }

  checkIdaNodes() {
    var checknodes = this._window.BDCashCore.returnNodes();
    const app = this
    for (var i = 0; i < checknodes.length; i++) {
      axios.get(checknodes[i] + '/wallet/getinfo').then(function (response) {
        app.nodes.push(response.data.blocks)
        if (i == checknodes.length) {
          app.connectToNode()
        }
      })
    }
  }

  connectToNode() {
    var app = this
    if (app.connected == '') {
      app.connected = app.nodes[Math.floor(Math.random() * app.nodes.length)]
    }
  }

  checkUser(){
    var app=this
    if(localStorage.getItem('wallet') !== null){
      let wallet = JSON.parse(localStorage.getItem('wallet'))
      if(wallet.length > 0 && this.add === null){
        app.router.navigate(['/dashboard'])
      }else{
        document.getElementById('splash').style.display = 'none';
      }
    }else{
      document.getElementById('splash').style.display = 'none';
    }
  }

  async createWallet(){
    
    var app=this
    
    if(app.password!==''&& app.password==app.repassword && app.isCreating === false){
      if(app.password.length >= 6){
        app.isCreating = true
        await app._window.BDCashCore.createAddress(app.password,false).then(async function(response){
          axios.post(app.connected+'/init',{
            address: response.pub,
            airdrop: true
          }).then(function(){
            app._window.BDCashCore.readKey(app.password, response.walletstore).then(function (check) {
              if (check !== false) {
                if(localStorage.getItem('wallet') === null){
                  let wallet = [response.walletstore]
                  localStorage.setItem('wallet',JSON.stringify(wallet))
                }else{
                  let wallet = JSON.parse(localStorage.getItem('wallet'))
                  wallet.push(response.walletstore)
                  localStorage.setItem('wallet',JSON.stringify(wallet))
                }
                app.isCreating = false
                if(app.add !== null){
                  app.router.navigate(['/account'])
                }else{
                  app.router.navigate(['/congratulations'])
                }
              }
            })
          }).catch((err)=>{
            console.log(err)
            app.isCreating = false
            alert("Seems there's a problem with the node, please retry!")
          });
        })
      }else{
        alert('Password should be at least 6 characters!')
      }
    }else{
      alert('Password is incorrect!')
    }
    
  }
  
}
