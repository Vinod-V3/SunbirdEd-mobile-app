import { Injectable } from '@angular/core';
import { PrivacyPolicyAndTCComponent } from './components/privacy-policy-and-tc/privacy-policy-and-tc.component';
import { PopoverController } from '@ionic/angular';
import { SbGenericPopoverComponent } from '../../../app/components/popups/sb-generic-popover/sb-generic-popover.component';
import { CommonUtilService } from '../../../services/common-util.service';
import { StartImprovementComponent } from './components/start-improvement/start-improvement.component';
import { PiiConsentPopupComponent } from './components/pii-consent-popup/pii-consent-popup.component';
import { RouterLinks } from '../../../app/app.constant';
import { JoinProgramComponent } from './components/join-program/join-program.component';

@Injectable({
  providedIn: 'root',
})
export class GenericPopUpService {
  consentPopup: any
  constructor(private popOverCtrl: PopoverController, private commonUtils: CommonUtilService) {}

    async showPPPForProjectPopUp(message, message1, linkLabel, header, link, type) {
        const alert = await this.popOverCtrl.create({
            component: PrivacyPolicyAndTCComponent,
            componentProps: {
                message: message,
                message1: message1,
                linkLabel: linkLabel,
                header: header,
                isPrivacyPolicy: type == 'privacyPolicy' ? true : false
            },
            cssClass: 'sb-popover',
        });
        await alert.present();
        const { data } = await alert.onDidDismiss();
        return data;
    }
  async confirmBox(...args:any) {
    args = Object.assign({}, ...args);
    let buttons = [];
    args.yes && buttons.push({
       btntext: this.commonUtils.translateMessage(args.yes),
       btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info',
    })
    args.no &&
      buttons.push({
        btntext: this.commonUtils.translateMessage(args.no),
        btnClass: 'popover-color',
      });
    const alert = await this.popOverCtrl.create({
      component: SbGenericPopoverComponent,
      componentProps: {
        sbPopoverHeading:args.heading ? this.commonUtils.translateMessage(args.heading):'',
        sbPopoverMainTitle:args.title ? this.commonUtils.translateMessage(args.title):'',
        sbPopoverContent: args.content ? this.commonUtils.translateMessage(args.content) : '',
        showHeader:args.header? true:false,
        actionsButtons: buttons,
        icon: null,
      },
      cssClass: 'sb-popover',
    });
    await alert.present();
    setTimeout(() => {
      args.autoDissmiss?alert.dismiss({ isLeftButtonClicked: true }):''
    },1000);
    const { data } = await alert.onDidDismiss();
    return data.isLeftButtonClicked;
  }

  async showStartIMPForProjectPopUp(header,message, message1, ) {
    const alert = await this.popOverCtrl.create({
        component: StartImprovementComponent,
        componentProps: {
            message: message,
            message1: message1,
            header: header,
        },
        cssClass: 'sb-popover',
    });
    await alert.present();
    const { data } = await alert.onDidDismiss();
    return data;
}

async showJoinProgramForProjectPopup(header,name,type,button,message?){
  const alert = await this.popOverCtrl.create({
    component : JoinProgramComponent,
    componentProps: {
      header: header,
      name: name,
      type:type,
      button: button,
      message: message
    },
    cssClass: 'sb-popover',
  });
  await alert.present();
  const {data} = await alert.onDidDismiss();
  return data

}

async showConsent(type){
  let componentProps={}
  switch (type) {
    case 'program':
      componentProps={
        consentMessage1 : "FRMELEMNTS_LBL_CONSENT_POPUP_MSG1",
        consentMessage2 : "FRMELEMNTS_LBL_CONSENT_POPUP_POLICY_MSG",
        consentMessage3 : "FRMELEMNTS_LBL_CONSENT_POPUP_MSG2",
        redirectLink : RouterLinks.TERM_OF_USE
      }
      break;

    default:
      componentProps={
        consentMessage1 : "FRMELEMNTS_LBL_CONSENT_POPUP_MSG1",
        consentMessage2 : "FRMELEMNTS_LBL_CONSENT_POPUP_POLICY_MSG",
        consentMessage3 : "FRMELEMNTS_LBL_CONSENT_POPUP_MSG2",
        redirectLink : RouterLinks.TERM_OF_USE
      }
      break;
  }
  this.consentPopup = await this.popOverCtrl.create({
    component : PiiConsentPopupComponent,
    componentProps : componentProps,
    cssClass: 'sb-popover back-drop-hard',
    backdropDismiss: false
  })
  await this.consentPopup.present()
  let {data} = await this.consentPopup.onDidDismiss()
  return data
}

async closeConsent(){
  this.consentPopup ? await this.consentPopup.dismiss() : null
}

}