import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modaltransaction',
  templateUrl: './modaltransaction.page.html',
  styleUrls: ['./modaltransaction.page.scss'],
})
export class ModaltransactionPage implements OnInit {
  @Input() response:any
  risposta
  constructor(private modalCtrl:ModalController) { 
   
  }

  ngOnInit() {
    this.risposta=this.response
    console.log(this.risposta)
  }

  close(){
    this.modalCtrl.dismiss()
  }

}
