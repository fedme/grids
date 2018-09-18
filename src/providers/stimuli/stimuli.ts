import { Injectable, EventEmitter } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Utils } from '../utils/utils';
import { Participant } from '../../models/participant';
import { AppInfo } from './app-info';

@Injectable()
export class Stimuli {
  
  appInfo: AppInfo = AppInfo;

  public langChangedEvent: EventEmitter<string> = new EventEmitter();
  lang: string = "en";

  // general exp
  shortVersion: boolean = false;
  condition: any;
  conditionId: number;
  initialTimestamp: number;
  participant: Participant;
  conditionCounterOverride: number = null;
  runInBrowser: boolean = false;
  
  constructor(
    private utils: Utils, 
    private platform: Platform
  ) {
    console.log('Hello Stimuli Provider');
    this.participant = new Participant("anonymous-" + this.utils.getCounterValue());
    //this.runInBrowser = this.platform.is('core') || this.platform.is('mobileweb'); TODO: not detecting windows UWA
    this.runInBrowser = false
    console.log("You are running", this.platform)

    if (localStorage.getItem('lang') != null && localStorage.getItem('lang') != "") {
      this.lang = localStorage.getItem('lang');
    }

  }


  initialize() {
    this.shortVersion = false; // TODO
    this.initialTimestamp = Date.now(); 
    this.participant = new Participant("anonymous-" + this.utils.getCounterValue());
  }

  initializeConditions(isShortVersion: boolean = false) {
    if (isShortVersion) {
      this.shortVersion = true;
    }
    this.initialTimestamp = Date.now(); 
  }


  // TODO: age groups
  getParticipantAgeGroup(age: number): string {
    if (this.participant.age >= 18) return "18";
    return this.participant.age + "";
  }


  setLang(langCode: string) {
    this.langChangedEvent.emit(langCode);
  }

}
