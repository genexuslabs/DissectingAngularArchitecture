import { Component, Input } from '@angular/core';
import { AppContainer } from 'app/gx/base/app-container';
import { ActivatedRoute } from '@angular/router';
import { CompositeNavigation } from 'app/gx/navigation/composite-navigation';
import { PanelComponent} from 'app/gx/base/panel.component';
import { LoginService} from "app/gx/auth/login.service";
import { AppBarService } from "app/gx/base/app-bar.service";

import { LightCRMService } from './lightcrm.service';
import { GlobalEvents } from 'app/gx/base/global-events';

@Component({
  selector: 'LightCRM',
  templateUrl: './lightcrm.component.html',
  providers: [
    LightCRMService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class LightCRMComponent extends PanelComponent {

  showNavbarOptions = false;

  goPage_subscription: any;


  constructor(
      private panelService: LightCRMService,
      private _globalevents : GlobalEvents,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.goPage_subscription = null;

    this.initState(null);
  }

  initState(params) {
    this.loadParams(params);
    this.appBarService.setNavigation({
      caption: "LightCRM",
      className: "Menu",
      toggleButtonLabel: this.translate("Toggle Menu"),
      items: [
        {
            id: "_WorkWithDevicesCompany",
            caption: "Companies",
            className: "MenuItem",
            iconSrc: this.getImageSource('img_company'),
            onClick: this._WorkWithDevicesCompany,
        },
        {
            id: "_WorkWithDevicesContact",
            caption: "Contacts",
            className: "MenuItem",
            iconSrc: this.getImageSource('img_contact'),
            onClick: this._WorkWithDevicesContact,
        },
        {
            id: "_WorkWithDevicesMeeting",
            caption: "Meetings",
            className: "MenuItem",
            iconSrc: this.getImageSource('img_meeting'),
            onClick: this._WorkWithDevicesMeeting,
        }
      ]
    });

  }

  async loadPanel() {
    if (this.nvg.emptyPrimaryOutlet()) {
      this._WorkWithDevicesCompany();    
    }
  }

  goPage = (id: string, element:string) => {
      if (element) {
        const page = element.match(/tab\[([0-9]+)\]/i);
        if (page && page.length > 0) {
          if (+page[1] === 1) {
            this._WorkWithDevicesCompany();
            return;
          }if (+page[1] === 2) {
            this._WorkWithDevicesContact();
            return;
          }if (+page[1] === 3) {
            this._WorkWithDevicesMeeting();
            return;
          };
        }
    }
  }

  // Actions
  _WorkWithDevicesCompany = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigate(['WorkWithDevicesCompany-Company_List' ], __aSt);

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  _WorkWithDevicesContact = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigate(['WorkWithDevicesContact-Contact_List' ], __aSt);

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  _WorkWithDevicesMeeting = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigate(['WorkWithDevicesMeeting-Meeting_List' ], __aSt);

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 

  startEvents() {
    this.goPage_subscription = this._globalevents.subscribe('gx-standard-api-to-generator_showTarget', (...parms) => {this.callAction( this.goPage, ...parms)});
  }
  endEvents() {
    this._globalevents.unsubscribe( this.goPage_subscription);
  }


}

class LightCRMUIModel {

  private _host: LightCRMComponent;

  constructor( host: LightCRMComponent) {
    this._host = host;
  }

}


class LightCRMUIActions {

  private _host: LightCRMComponent;

  constructor( host: LightCRMComponent) {
    this._host = host;
  }

}
