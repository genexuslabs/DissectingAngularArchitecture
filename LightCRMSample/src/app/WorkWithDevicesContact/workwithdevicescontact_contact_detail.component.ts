import { Component, Input } from '@angular/core';
import { Routes, ActivatedRoute } from '@angular/router';
import { AppContainer } from 'app/gx/base/app-container';
import { CompositeNavigation } from 'app/gx/navigation/composite-navigation';
import { PanelComponent } from 'app/gx/base/panel.component';
import { BcPanelComponent} from 'app/gx/base/bc-panel.component';
import { LoginService} from "app/gx/auth/login.service";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppBarService } from "app/gx/base/app-bar.service";
import { NavigationStyle } from "app/gx/base/view-manager";

import { WorkWithDevicesContact_Contact_DetailService  } from './workwithdevicescontact_contact_detail.service';

@Component({
  selector: 'WorkWithDevicesContact_Contact_Detail',
  templateUrl: './workwithdevicescontact_contact_detail.component.html',
  providers: [
    WorkWithDevicesContact_Contact_DetailService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesContact_Contact_DetailComponent extends PanelComponent {

  @Input('companyid') 
  CompanyId: number;
  @Input('contactid') 
  ContactId: number;
  @Input('mode') 
  Mode: string;
  uiModel: number;


  stateMembers = [
    "CompanyId", "ContactId", "Mode", "uiModel"
  ];

  _routingPath = 'WorkWithDevicesContact-Contact_Detail';
  views = [
    {
      name: "ViewOrEditAnyiOS",
      type: "any",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_ViewOrEditAnyiOS.bind(this),
      appBarResetFn: this.resetAppBar_ViewOrEditAnyiOS.bind(this)
    }

  ];



  constructor(
      private panelService: WorkWithDevicesContact_Contact_DetailService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.canControlAppBar = activatedRoute.component === WorkWithDevicesContact_Contact_DetailComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.CompanyId = !params ? this.CompanyId : 0;
    this.ContactId = !params ? this.ContactId : 0;
    this.Mode = !params ? this.Mode : "";
    this.uiModel = 0;

    this.loadParams(params);
    this.panelService.start();
  }

  initAppBar_ViewOrEditAnyiOS(navigationStyle: NavigationStyle) {
    if (this.canControlAppBar) {
      this.appBarService.setNavigation({
        className: "ApplicationBars",
        visible: true,
        navigationStyle,
        showBackButton: false,
      });

      if (!this.showAsCard) {
        this.appBarService.setActions([
        ]);
      }
    }

    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: true,
        onBackButtonClick: () => this.callAction(this.__Cancel),
      });
    }
  }

  resetAppBar_ViewOrEditAnyiOS() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   

  // Actions



  loadParams(params) {
    if (params) {
      this.ContactId = +this.nvg.getParam('contactid', params, 1) || 0;
      this.CompanyId = +this.nvg.getParam('companyid', params, 2) || 0;
      this.Mode = this.nvg.getParam('mode', params, 3) || "";
    }
  }

  async loadPanel() {
  }

  async Refresh(type?: string) {
  }



}

class WorkWithDevicesContact_Contact_DetailUIModel {

  private _host: WorkWithDevicesContact_Contact_DetailComponent;

  constructor( host: WorkWithDevicesContact_Contact_DetailComponent) {
    this._host = host;
  }

}


class WorkWithDevicesContact_Contact_DetailUIActions {

  private _host: WorkWithDevicesContact_Contact_DetailComponent;

  constructor( host: WorkWithDevicesContact_Contact_DetailComponent) {
    this._host = host;
  }

}
