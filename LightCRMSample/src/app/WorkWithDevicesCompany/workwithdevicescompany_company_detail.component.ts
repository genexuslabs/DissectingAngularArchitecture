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

import { WorkWithDevicesCompany_Company_DetailService  } from './workwithdevicescompany_company_detail.service';

@Component({
  selector: 'WorkWithDevicesCompany_Company_Detail',
  templateUrl: './workwithdevicescompany_company_detail.component.html',
  providers: [
    WorkWithDevicesCompany_Company_DetailService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesCompany_Company_DetailComponent extends PanelComponent {

  @Input('companyid') 
  CompanyId: number;
  @Input('mode') 
  Mode: string;
  uiModel: number;


  stateMembers = [
    "CompanyId", "Mode", "uiModel"
  ];

  _routingPath = 'WorkWithDevicesCompany-Company_Detail';
  views = [
    {
      name: "ViewOrEditiPad",
      type: "any",
      minShortestBound: 768,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_ViewOrEditiPad.bind(this),
      appBarResetFn: this.resetAppBar_ViewOrEditiPad.bind(this)
    }
    ,{
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
      private panelService: WorkWithDevicesCompany_Company_DetailService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.canControlAppBar = activatedRoute.component === WorkWithDevicesCompany_Company_DetailComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.CompanyId = !params ? this.CompanyId : 0;
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
   
  initAppBar_ViewOrEditiPad(navigationStyle: NavigationStyle) {
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

  resetAppBar_ViewOrEditiPad() {
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
      this.CompanyId = +this.nvg.getParam('companyid', params, 1) || 0;
      this.Mode = this.nvg.getParam('mode', params, 2) || "";
    }
  }

  async loadPanel() {
  }

  async Refresh(type?: string) {
  }



}

class WorkWithDevicesCompany_Company_DetailUIModel {

  private _host: WorkWithDevicesCompany_Company_DetailComponent;

  constructor( host: WorkWithDevicesCompany_Company_DetailComponent) {
    this._host = host;
  }

}


class WorkWithDevicesCompany_Company_DetailUIActions {

  private _host: WorkWithDevicesCompany_Company_DetailComponent;

  constructor( host: WorkWithDevicesCompany_Company_DetailComponent) {
    this._host = host;
  }

}
