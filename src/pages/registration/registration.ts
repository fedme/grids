import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Stimuli, Data } from '../../providers/providers';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({
  priority: 'high'
})
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  lang: string = "en";
  smoothOnly: boolean;
  youngKidsVersion: boolean;
  availableLangs: string[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private stimuli: Stimuli, 
    private data: Data,
    private modalCtrl: ModalController,
    private translate: TranslateService,
    private alertCtrl: AlertController
  ) {
      
      // Parse available langs
      this.availableLangs = this.translate.langs;
      console.log('available langs: ', this.availableLangs);

      // Initialize providers
      this.stimuli.initialize();
      this.data.initialize();

      // Get language from localStorage
      if (localStorage.getItem('lang') != null && localStorage.getItem('lang') != '') {
        this.lang = localStorage.getItem('lang');
      }

      // Get smoothOnly from localStorage
      this.smoothOnly = false;
      if (localStorage.getItem('isrc-grids-smoothOnly') != null && localStorage.getItem('isrc-grids-smoothOnly') == 'true') {
        this.smoothOnly = true;
      }

      // Get youngKidsVersion from localStorage
      this.youngKidsVersion = false;
      if (localStorage.getItem('isrc-grids-youngKidsVersion') != null && localStorage.getItem('isrc-grids-youngKidsVersion') == 'true') {
        this.youngKidsVersion = true;
      }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
    if (this.parseUrlParams()) {
      console.log("participant:", this.stimuli.participant);
      this.navCtrl.setRoot('ConsentFormPage');
    }
  }

  handleRegistration() {
      // set Language
      this.stimuli.setLang(this.lang);
      localStorage.setItem('lang', this.lang);

      // Set additional participant props
      this.stimuli.participant.ageGroup = this.stimuli.getParticipantAgeGroup(this.stimuli.participant.age);

      // Embedded stimuli
      localStorage.setItem("isrc-embedded-mode", "true");
      localStorage.setItem("isrc-embedded-mode-ended", null);
      localStorage.setItem("isrc-embedded-mode-data", null);
      localStorage.setItem("isrc-embedded-mode-uid", this.stimuli.participant.code);
      localStorage.setItem("isrc-embedded-mode-gender", this.stimuli.participant.gender);
      localStorage.setItem("isrc-embedded-mode-age", this.stimuli.participant.age.toString());
      localStorage.setItem("isrc-embedded-mode-grade", this.stimuli.participant.grade.toString());
      localStorage.setItem("isrc-grids-smoothOnly", this.smoothOnly ? "true" : "false");
      localStorage.setItem("isrc-grids-youngKidsVersion", this.youngKidsVersion ? "true" : "false");
   
      // initialize stimuli
      this.stimuli.initializeConditions();
      this.navCtrl.setRoot('StimuliPage');
  }

  validateRegistration() {

    const codeNull = this.stimuli.participant.code == null
      || this.stimuli.participant.code == "";

    const genderNull = this.stimuli.participant.gender == null
      || this.stimuli.participant.gender == "";

    const ageNull = this.stimuli.participant.age == null
      || this.stimuli.participant.age == 0;

    // If some info is missing...
    if (codeNull || ageNull || genderNull) {

      let alertMsg: string = "You are missing: ";
      if (codeNull) alertMsg += "<br>- Participant Code";
      if (ageNull) alertMsg += "<br>- Age";
      if (genderNull) alertMsg += "<br>- Gender";

      // Present alert
      let alert = this.alertCtrl.create({
        title: 'Missing some info. Proceed?',
        message: alertMsg,
        buttons: [
          {
            text: 'Proceed',
            handler: () => {

              // Fill default info

              if (ageNull) {
                this.stimuli.participant.age = 0;
                this.stimuli.participant.grade = 0;
              }

              if (codeNull) {
                this.stimuli.participant.code = "nocode";
              }

              this.handleRegistration();
            }
          },
          {
            text: 'Stay here',
            role: 'cancel',
            handler: () => {}
          }
        ]
      });
      alert.present();
    }

    // Otherwise, proceed to registration
    else {
      this.handleRegistration();
    }

  }

  public convertToNumber(event):number {  return +event; }

  showRecords() {
    let recordsModal = this.modalCtrl.create("ViewRecordsPage");
    recordsModal.present();
  }

  parseUrlParams() {
    let codeProvided = false;
    if (document.URL.indexOf("?") > 0) {
      let splitURL = document.URL.split("?");
      let splitParams = splitURL[1].split("&");
      let i: any;
      for (i in splitParams){
        let singleURLParam = splitParams[i].split('=');
        if (singleURLParam[0] == "participant_code"){
          this.stimuli.participant.code = singleURLParam[1];
          codeProvided = true;
        }
        else if (singleURLParam[0] == "workerId"){
          this.stimuli.participant.code = singleURLParam[1];
          codeProvided = true;
        }
        else if (singleURLParam[0] == "participant_age"){
          this.stimuli.participant.age = parseInt(singleURLParam[1]);
        }
        else if (singleURLParam[0] == "participant_grade"){
          this.stimuli.participant.grade = parseInt(singleURLParam[1]);
        }
        else if (singleURLParam[0] == "condition"){
          this.stimuli.conditionCounterOverride = parseInt(singleURLParam[1]);
          console.log("[param][conditionCounterOverride]", parseInt(singleURLParam[1]));
          console.log( this.stimuli.conditionCounterOverride);
        }
      }
    }
    return codeProvided;
  }
 

}
