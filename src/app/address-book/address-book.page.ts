import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Clipboard } from '@ionic-native/clipboard/ngx'
import { ToastController, ModalController } from '@ionic/angular';
import { ModaltransactionPage } from '../modaltransaction/modaltransaction.page';
import { OverlayEventDetail } from '@ionic/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
var locales =  require('../locales.js')

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.page.html',
  styleUrls: ['./address-book.page.scss'],
})

export class AddressBookPage implements OnInit {
  language: any = 'en'
  locales: any = locales
  translations: any = {}
  balance: string = '-'
  wallet: ''
  contacts = []
  filtered = []
  modalAction: string = 'Create'
  toggleNoBalance: boolean = true
  newContactAddress: string = ''
  newContactLabel: string = ''
  newContactNotes: string = ''
  encrypted: string = ''
  showNewContact: boolean = false
  searchContact: string = ''
  selected: number = 0
  nodesh: string = 'nodesh01.bdcashprotocol.com'
  address: string
  editing: string = '0'
  transactions = []
  constructor(public alertController: AlertController, public actionSheetController: ActionSheetController, private clipboard: Clipboard, private qrScanner: BarcodeScanner, private toast: ToastController, private modalCtrl: ModalController, public router:Router, private _location: Location, private iab: InAppBrowser) { }

  async presentActionSheet(index) {
    const app = this
    let contact = app.contacts[index]
    axios.get('https://' + app.nodesh + '/transactions/' + app.address).then(response => {
      app.transactions = response.data.data
    })
    const actionSheet = await this.actionSheetController.create({
        header: contact.label,
        buttons: [{
          text: app.translations.send.send_title,
          icon: 'send',
          handler: () => {
            app.router.navigate(['/send/' + contact.address])
          }
        },{
          text: app.translations.contacts.edit_contact,
          icon: 'create',
          handler: () => {
            app.newContactAddress = app.contacts[index].address
            app.newContactLabel = app.contacts[index].label
            app.newContactNotes = app.contacts[index].notes
            app.modalAction = 'Edit'
            app.editing = index
            app.showNewContact = true
          }
        },{
          text: app.translations.contacts.delete_contact,
          icon: 'trash',
          handler: async () => {
            app.confirmDelete(index)
          }
        }]
      });
      await actionSheet.present();
    }

    ngOnInit() {
      const app = this
      app.showNewContact = false
      if (localStorage.getItem('language') !== null) {
        app.language = localStorage.getItem('language')
      }
      app.translations = this.locales.default[app.language]
      app.parseAddressBook()
    }

    parseAddressBook(){
      const app = this
      let addressBook = localStorage.getItem('addressbook')
      if(addressBook !== undefined && addressBook !== null){
        app.contacts = JSON.parse(addressBook)
      }
      app.filterContacts()
    }
    hideNewContact(){
      this.showNewContact = false
    }
    goBack(){
      const app = this
      app.router.navigate(['/dashboard'])
    }
    async confirmDelete(index) {
      const app = this
      const alert = await this.alertController.create({
        header: app.translations.contacts.confirm_delete,
        message: app.translations.contacts.want_delete + ' <strong>'+app.contacts[index].label+'</strong>?',
        buttons: [
          {
            text: app.translations.contacts.cancel,
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Okay',
            handler: async () => {
              let updated = []
              for(let k in app.contacts){
                if(parseInt(k) !== parseInt(index)){
                  updated.push(app.contacts[k])
                }
              }
              await localStorage.setItem('addressbook',JSON.stringify(updated))
              app.contacts = updated
              app.filterContacts()
            }
          }
        ]
      });
  
      await alert.present();
    }

    filterContacts(){
      const app = this
      const filter = app.searchContact
      let filtered = app.contacts.filter(address => {
        return address.label.toLowerCase().includes(filter)
      })
      app.filtered = filtered
    }

    scanQRCode() {
      const app = this
      this.qrScanner.scan().then(barcodeData => {
        barcodeData.text = barcodeData.text.replace('bdcash:','')
        let check = barcodeData.text.split('?')
        if(check[1] !== undefined){
          var amount = check[1].replace('amount=','')
          this.newContactAddress = check[0]
        }else{
          this.newContactAddress = barcodeData.text
        }
      }).catch(err => {
        console.log(err)
      })
  
    }

    addContact(){
      this.newContactAddress = ''
      this.newContactLabel = ''
      this.newContactNotes = ''
      this.modalAction = 'Create'
      this.showNewContact = true
    }

    saveContact(){
      const app = this
      var found = false
      if(app.newContactAddress.length === 34){
        for(var k in app.contacts){
          if(app.contacts[k] !== undefined){
            if(app.contacts[k].address === app.newContactAddress){
              found = true
            }
          }  
        }
        if(found === true){
          alert('This address exist yet!')
        }else{
          app.contacts.push({
            address: app.newContactAddress,
            label: app.newContactLabel,
            notes: app.newContactNotes
          })
          app.showNewContact = false
          app.newContactAddress = ''
          app.newContactLabel = ''
          app.newContactNotes = ''
          localStorage.setItem('addressbook',JSON.stringify(app.contacts))
          app.filterContacts()
        }
      }else{
        alert('This is not a valid address!')
      }
    }

    editContact(){
      const app = this
      var found = false
      if(app.newContactAddress.length === 34){
        for(let k in app.contacts){
          if(parseInt(k) === parseInt(app.editing)){
            app.contacts[k] = {
              address: app.newContactAddress,
              label: app.newContactLabel,
              notes: app.newContactNotes
            }
          }
        }
        localStorage.setItem('addressbook',JSON.stringify(app.contacts))
        app.filterContacts()
        app.showNewContact = false
        app.newContactAddress = ''
        app.newContactLabel = ''
        app.newContactNotes = ''
      }else{
        alert('This is not a valid address!')
      }
    }
}
