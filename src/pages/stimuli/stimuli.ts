import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Stimuli, Data } from '../../providers/providers';


@IonicPage()
@Component({
  selector: 'page-stimuli',
  templateUrl: 'stimuli.html',
})
export class StimuliPage {

  nextConfirmed: boolean = false;
  endCheckInterval: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private stimli: Stimuli, private data: Data) {
    
    this.endCheckInterval = setInterval(() => {
      this.checkEnded();
    }, 600);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StimuliPage');
  }

  checkEnded() {
    if (localStorage.getItem('isrc-embedded-mode-ended') == 'true') {
      localStorage.setItem('isrc-embedded-mode-ended', null);
      this.data.save();
      this.navCtrl.setRoot('EndPage');
    }
  }

  confirmNext() {
    this.nextConfirmed = true;
  }

  next() {
    if (!this.nextConfirmed) return;
    this.navCtrl.setRoot('EndPage');
  }

}
