import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { WindowRefService, ICustomWindow } from '../windowservice';
import axios from 'axios';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import * as fileType from 'file-type'

@Component({
  selector: 'app-archivedetail',
  templateUrl: './archivedetail.page.html',
  styleUrls: ['./archivedetail.page.scss'],
})
export class ArchivedetailPage implements OnInit {
  @Input() response:any
  risposta
  private _window: ICustomWindow;
  wallet: any
  nodesh: any = 'https://nodesh01.bdcashprotocol.com'
  address: any = ''
  encrypted: any
  isDecrypting: boolean = false
  selected: number = 0
  password: string = ''
  decryptPwd: string = ''
  isInvalidating: boolean = false
  showInvalidate: boolean = false
  constructor(public platform: Platform, private permission: AndroidPermissions, private file: File, private modalCtrl:ModalController, private iab: InAppBrowser, windowRef: WindowRefService, private socialSharing: SocialSharing) {
    this._window = windowRef.nativeWindow;
   }

  ngOnInit() {
    this.risposta=this.response
    const app = this
    if (localStorage.getItem('selected') !== null) {
      app.selected = parseInt(localStorage.getItem('selected'))
    }
    app.wallet = JSON.parse(localStorage.getItem('wallet'))
    let payload = app.wallet[app.selected].split(':')
    app.address = payload[0]
    app.encrypted = payload[1]
    setTimeout(async () => {
      app.nodesh = await app._window.BDCashCore.connectNode()
    },50)
  }
  
  openFile(response) {
    this.iab.create(response, '_system', 'location=yes');
  }
  openPoE(uuid) {
    this.iab.create('https://check.bdcashprotocol.com/#/uuid/' + uuid, '_system', 'location=yes');
  }
  closemodal(){
    this.modalCtrl.dismiss()
  }

  decryptData(){
    const app = this
    if(app.isDecrypting === false){
      app.isDecrypting = true
      app._window.BDCashCore.decryptData(app.risposta.data, app.decryptPwd).then(decrypted => {
        app.isDecrypting = false
        if(decrypted !== false){
          app.risposta.data = decrypted
          app.risposta.protocol = ''
        }else{
          alert('Wrong password!')
        }
      })
    }
  }

  decryptFile(){
    const app = this
    if(app.isDecrypting === false){
      app.isDecrypting = true
      axios.get(app.nodesh +'/ipfs/buffer/' + app.risposta.data).then(ipfs => {
        let data = ipfs.data.data[0].content.data
        app._window.BDCashCore.decryptFile(data, app.decryptPwd).then(decrypted => {
          app.isDecrypting = false
          if(decrypted !== false){
            var mime = fileType(decrypted)
            var blob = new Blob([decrypted], {type: "octet/stream"})
            var location
            var message
            
            if(this.platform.is('android') === true ){
              location = this.file.externalRootDirectory + '/Download/'
              message = 'Decrypted file saved in Download folder!'
              this.file.writeFile(location, app.risposta.data + '.' + mime.ext, blob, { replace: true }).then(response => {
                alert(message)
              }).catch(err => {
                alert('Can\'t save file: ' + err.message + '.')
              })
            }else if(this.platform.is('ios') === true ){
              location = this.file.documentsDirectory
              this.file.writeFile(location, app.risposta.data + '.' + mime.ext, blob, { replace: true }).then(response => {
                var options = {
                  subject: 'Decrypted file written on BDcash Blockchain',
                  message: 'Save it in a safe place',
                  files: [location + '/' + app.risposta.data + '.' + mime.ext]
                }
                this.socialSharing.shareWithOptions(options).catch((err) => {
                  console.log(err)
                });
              }).catch(err => {
                alert('Can\'t save file: ' + err.message + '.')
              })
            }else{
              alert('Can\'t save file! Use Proof dApp.')
            }
          }else{
            alert('Wrong password!')
          }
        })
      })
    }
  }

  showInvalidateModal(){
    this.showInvalidate = true
    this.password = ''
  }
  hideInvalidateModal(){
    this.showInvalidate = false
    this.password = ''
  }
  unlockWallet() {
    const app = this
    if (app.password !== '') {
      app._window.BDCashCore.readKey(app.password, app.address + ':' + app.encrypted).then(function (response) {
        if (response !== false) {
          app.isInvalidating = true
          let prv = response.prv
          app.password = ''
          axios.post(app.nodesh + '/invalidate',{
            private_key: prv,
            uuid: app.risposta.uuid,
            dapp_address: app.address
          }).then(result => {
            console.log(result)
            if(result.data !== undefined && result.data.success === true){
              app.isInvalidating = false
              app.hideInvalidateModal()
              app.closemodal()
              alert('Data invalidated correctly, wait at least 2 minutes before see again your Vault.')
            }else{
              alert('Something goes wrong, please retry')
            }
          }).catch(err => {
            alert('Something goes wrong, please retry')
            app.isInvalidating = false
          })
        } else {
          alert('Wrong Password')
        }
      })
    } else {
      alert('Fill all the fields!')
    }
  }
}
