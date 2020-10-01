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

import { WorkWithDevicesMeeting_Meeting_DetailService  } from './workwithdevicesmeeting_meeting_detail.service';

@Component({
  selector: 'WorkWithDevicesMeeting_Meeting_Detail',
  templateUrl: './workwithdevicesmeeting_meeting_detail.component.html',
  providers: [
    WorkWithDevicesMeeting_Meeting_DetailService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesMeeting_Meeting_DetailComponent extends PanelComponent {

  @Input('meetingid') 
  MeetingId: number;
  @Input('mode') 
  Mode: string;
  uiModel: number;


  stateMembers = [
    "MeetingId", "Mode", "uiModel"
  ];

  _routingPath = 'WorkWithDevicesMeeting-Meeting_Detail';
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
      private panelService: WorkWithDevicesMeeting_Meeting_DetailService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.canControlAppBar = activatedRoute.component === WorkWithDevicesMeeting_Meeting_DetailComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.MeetingId = !params ? this.MeetingId : 0;
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
      this.MeetingId = +this.nvg.getParam('meetingid', params, 1) || 0;
      this.Mode = this.nvg.getParam('mode', params, 2) || "";
    }
  }

  async loadPanel() {
  }

  async Refresh(type?: string) {
  }



}

class WorkWithDevicesMeeting_Meeting_DetailUIModel {

  private _host: WorkWithDevicesMeeting_Meeting_DetailComponent;

  constructor( host: WorkWithDevicesMeeting_Meeting_DetailComponent) {
    this._host = host;
  }

}


class WorkWithDevicesMeeting_Meeting_DetailUIActions {

  private _host: WorkWithDevicesMeeting_Meeting_DetailComponent;

  constructor( host: WorkWithDevicesMeeting_Meeting_DetailComponent) {
    this._host = host;
  }

}
