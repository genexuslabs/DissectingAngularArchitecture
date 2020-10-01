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

import { WorkWithDevicesMeeting_Meeting_Section_GeneralService , WorkWithDevicesMeeting_Meeting_Section_GeneralData } from './workwithdevicesmeeting_meeting_section_general.service';
import { BusinessComponent } from 'app/gx/base/business-component';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { MeetingService } from 'app/Meeting/meeting.service';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Component({
  selector: 'WorkWithDevicesMeeting_Meeting_Section_General',
  templateUrl: './workwithdevicesmeeting_meeting_section_general.component.html',
  providers: [
    MeetingService,
    WorkWithDevicesMeeting_Meeting_Section_GeneralService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesMeeting_Meeting_Section_GeneralComponent extends BcPanelComponent<MeetingData, MeetingService> {

  WorkWithDevicesMeeting_Meeting_Section_General_data: WorkWithDevicesMeeting_Meeting_Section_GeneralData;
  uiModel: WorkWithDevicesMeeting_Meeting_Section_GeneralUIModel;
  uiActions: WorkWithDevicesMeeting_Meeting_Section_GeneralUIActions;
  @Input('meetingid') 
  MeetingId: number;
  @Input('companyid') 
  CompanyId: number;
  @Input('contactid') 
  ContactId: number;
  @Input('mode') 
  Mode: string;
  bcInstance: BusinessComponent<MeetingData, MeetingService>;


  stateMembers = [
    "WorkWithDevicesMeeting_Meeting_Section_General_data", "uiModel", "MeetingId", "CompanyId", "ContactId", "Mode"
  ];

  _routingPath = 'WorkWithDevicesMeeting-Meeting_Section_General';
  views = [
    {
      name: "ViewiPad",
      type: "any",
      minShortestBound: 768,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_ViewiPad.bind(this),
      appBarResetFn: this.resetAppBar_ViewiPad.bind(this)
    }
    ,{
      name: "EditiPad",
      type: "edit",
      minShortestBound: 768,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_EditiPad.bind(this),
      appBarResetFn: this.resetAppBar_EditiPad.bind(this)
    }
    ,{
      name: "ViewAny",
      type: "any",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_ViewAny.bind(this),
      appBarResetFn: this.resetAppBar_ViewAny.bind(this)
    }
    ,{
      name: "EditAny",
      type: "edit",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_EditAny.bind(this),
      appBarResetFn: this.resetAppBar_EditAny.bind(this)
    }

  ];



  constructor(
      private panelService: WorkWithDevicesMeeting_Meeting_Section_GeneralService,
      private MeetingService : MeetingService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new WorkWithDevicesMeeting_Meeting_Section_GeneralUIActions(this);
    this.bcInstance = new BusinessComponent(new MeetingData(),this.MeetingService);

    this.canControlAppBar = activatedRoute.component === WorkWithDevicesMeeting_Meeting_Section_GeneralComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.WorkWithDevicesMeeting_Meeting_Section_General_data = new WorkWithDevicesMeeting_Meeting_Section_GeneralData();
    this.uiModel = new WorkWithDevicesMeeting_Meeting_Section_GeneralUIModel(this);
    this.MeetingId = !params ? this.MeetingId : 0;
    this.CompanyId = !params ? this.CompanyId : 0;
    this.ContactId = !params ? this.ContactId : 0;
    this.Mode = !params ? this.Mode : "";

    this.loadParams(params);
    this.panelService.start();
  }

  initAppBar_ViewAny(navigationStyle: NavigationStyle) {
    if (this.canControlAppBar) {
      this.appBarService.setNavigation({
        className: "ApplicationBars",
        visible: true,
        navigationStyle,
        showBackButton: false,
      });

      if (!this.showAsCard) {
        const ctrlButtonupdate = this.uiModel.ctrlButtonupdate;
        ctrlButtonupdate.id = "ctrlButtonupdate";
        ctrlButtonupdate.caption = this.translate("GXM_update");
        ctrlButtonupdate.class = "Button";
        ctrlButtonupdate.visible = true;
        ctrlButtonupdate.enabled = true;
        ctrlButtonupdate.priority = "Normal";
        ctrlButtonupdate.onClick = () => this.callAction(this._Update);

        const ctrlButtondelete = this.uiModel.ctrlButtondelete;
        ctrlButtondelete.id = "ctrlButtondelete";
        ctrlButtondelete.caption = this.translate("GX_BtnDelete");
        ctrlButtondelete.class = "Button";
        ctrlButtondelete.visible = true;
        ctrlButtondelete.enabled = true;
        ctrlButtondelete.priority = "Normal";
        ctrlButtondelete.onClick = () => this.callAction(this._Delete);

        this.appBarService.setActions([
          ctrlButtonupdate,
          ctrlButtondelete
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

  resetAppBar_ViewAny() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   
  initAppBar_EditAny(navigationStyle: NavigationStyle) {
    if (this.canControlAppBar) {
      this.appBarService.setNavigation({
        className: "ApplicationBars",
        visible: true,
        navigationStyle,
        showBackButton: false,
      });

      if (!this.showAsCard) {
        const ctrlButtonsave = this.uiModel.ctrlButtonsave;
        ctrlButtonsave.id = "ctrlButtonsave";
        ctrlButtonsave.caption = this.translate("GXM_Save");
        ctrlButtonsave.class = "Button";
        ctrlButtonsave.visible = true;
        ctrlButtonsave.enabled = true;
        ctrlButtonsave.priority = "High";
        ctrlButtonsave.onClick = () => this.callAction(this._Save);

        const ctrlButtoncancel = this.uiModel.ctrlButtoncancel;
        ctrlButtoncancel.id = "ctrlButtoncancel";
        ctrlButtoncancel.caption = this.translate("GXM_cancel");
        ctrlButtoncancel.class = "Button";
        ctrlButtoncancel.visible = true;
        ctrlButtoncancel.enabled = true;
        ctrlButtoncancel.priority = "High";
        ctrlButtoncancel.onClick = () => this.callAction(this._Cancel);

        this.appBarService.setActions([
          ctrlButtonsave,
          ctrlButtoncancel
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

  resetAppBar_EditAny() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   
  initAppBar_ViewiPad(navigationStyle: NavigationStyle) {
    if (this.canControlAppBar) {
      this.appBarService.setNavigation({
        className: "ApplicationBars",
        visible: true,
        navigationStyle,
        showBackButton: false,
      });

      if (!this.showAsCard) {
        const ctrlButtonupdate = this.uiModel.ctrlButtonupdate;
        ctrlButtonupdate.id = "ctrlButtonupdate";
        ctrlButtonupdate.caption = this.translate("GXM_update");
        ctrlButtonupdate.class = "Button";
        ctrlButtonupdate.visible = true;
        ctrlButtonupdate.enabled = true;
        ctrlButtonupdate.priority = "Normal";
        ctrlButtonupdate.onClick = () => this.callAction(this._Update);

        const ctrlButtondelete = this.uiModel.ctrlButtondelete;
        ctrlButtondelete.id = "ctrlButtondelete";
        ctrlButtondelete.caption = this.translate("GX_BtnDelete");
        ctrlButtondelete.class = "Button";
        ctrlButtondelete.visible = true;
        ctrlButtondelete.enabled = true;
        ctrlButtondelete.priority = "Normal";
        ctrlButtondelete.onClick = () => this.callAction(this._Delete);

        this.appBarService.setActions([
          ctrlButtonupdate,
          ctrlButtondelete
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

  resetAppBar_ViewiPad() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   
  initAppBar_EditiPad(navigationStyle: NavigationStyle) {
    if (this.canControlAppBar) {
      this.appBarService.setNavigation({
        className: "ApplicationBars",
        visible: true,
        navigationStyle,
        showBackButton: false,
      });

      if (!this.showAsCard) {
        const ctrlButtonupdate = this.uiModel.ctrlButtonupdate;
        ctrlButtonupdate.id = "ctrlButtonupdate";
        ctrlButtonupdate.caption = this.translate("GXM_update");
        ctrlButtonupdate.class = "Button";
        ctrlButtonupdate.visible = true;
        ctrlButtonupdate.enabled = true;
        ctrlButtonupdate.priority = "Normal";
        ctrlButtonupdate.onClick = () => this.callAction(this._Update);

        const ctrlButtondelete = this.uiModel.ctrlButtondelete;
        ctrlButtondelete.id = "ctrlButtondelete";
        ctrlButtondelete.caption = this.translate("GX_BtnDelete");
        ctrlButtondelete.class = "Button";
        ctrlButtondelete.visible = true;
        ctrlButtondelete.enabled = true;
        ctrlButtondelete.priority = "Normal";
        ctrlButtondelete.onClick = () => this.callAction(this._Delete);

        this.appBarService.setActions([
          ctrlButtonupdate,
          ctrlButtondelete
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

  resetAppBar_EditiPad() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   

  // Actions
  _Update = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigateForResult(['WorkWithDevicesMeeting-Meeting_Detail' , { meetingid:'' + this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingId,mode:'UPD' }], __aSt);
      await this.Refresh();

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  _Delete = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigateForResult(['WorkWithDevicesMeeting-Meeting_Detail' , { meetingid:'' + this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingId,mode:'DLT' }], __aSt);
      await this.Refresh();


      await this.return({}, __aSt)

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  _Save = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.saveBC();


      await this.return({}, __aSt)

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  _Cancel = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.cancel(__aSt)

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  bcToEntity = (): void => {
    const __aSt = this.startAction();
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingId = this.bcInstance.data.MeetingId;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyName = this.bcInstance.data.CompanyName;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactName = this.bcInstance.data.ContactName;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingTitle = this.bcInstance.data.MeetingTitle;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingDate = this.bcInstance.data.MeetingDate;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingNote = this.bcInstance.data.MeetingNote;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingGeolocation = this.bcInstance.data.MeetingGeolocation;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactId = this.bcInstance.data.ContactId;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyId = this.bcInstance.data.CompanyId;
    this.WorkWithDevicesMeeting_Meeting_Section_General_data._bc_md5_hash_WorkWithDevicesMeeting_Meeting_Section_General = this.bcInstance.data.gx_md5_hash;
    this.endAction(__aSt);
  } 
  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.MeetingId = this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingId;
    this.bcInstance.data.CompanyName = this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyName;
    this.bcInstance.data.ContactName = this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactName;
    this.bcInstance.data.MeetingTitle = this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingTitle;
    this.bcInstance.data.MeetingDate = this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingDate;
    this.bcInstance.data.MeetingNote = this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingNote;
    this.bcInstance.data.MeetingGeolocation = this.WorkWithDevicesMeeting_Meeting_Section_General_data.MeetingGeolocation;
    this.bcInstance.data.ContactId = this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactId;
    this.bcInstance.data.CompanyId = this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyId;
    this.bcInstance.data.gx_md5_hash = this.WorkWithDevicesMeeting_Meeting_Section_General_data._bc_md5_hash_WorkWithDevicesMeeting_Meeting_Section_General;
    this.endAction(__aSt);
  } 

  async _promptCompanyName() : Promise<any> {
    const __aSt = this.startAction();
    let result = await this.nvg.navigate(['SelectCompany-Level_Detail' , { pcompanyid:'' + this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyId }], __aSt);
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyId = result.Pcompanyid;
    let afterResult = await this.panelService.get_promptCompanyName(this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyId);
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyName = afterResult[0]; 
    this.endAction(__aSt);
  }
  async _promptContactName() : Promise<any> {
    const __aSt = this.startAction();
    let result = await this.nvg.navigate(['SelectContact-Level_Detail' , { pcompanyid:'' + this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyId,pcontactid:'' + this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactId }], __aSt);
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactId = result.Pcontactid;
    let afterResult = await this.panelService.get_promptContactName(this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactId, this.WorkWithDevicesMeeting_Meeting_Section_General_data.CompanyId);
    this.WorkWithDevicesMeeting_Meeting_Section_General_data.ContactName = afterResult[0]; 
    this.endAction(__aSt);
  }



  loadParams(params) {
    if (params) {
      this.MeetingId = +this.nvg.getParam('meetingid', params, 1) || 0;
      this.Mode = this.nvg.getParam('mode', params, 2) || "";
    }
  }

  async loadPanel() {
    this.WorkWithDevicesMeeting_Meeting_Section_General_data = await this.panelService.getWorkWithDevicesMeeting_Meeting_Section_General( this.MeetingId);


    this.initBC(this.nvg.getAppExtras('bc'), this.MeetingId, this.Mode);
  }

  async Refresh(type?: string) {
    this.WorkWithDevicesMeeting_Meeting_Section_General_data = await this.panelService.getWorkWithDevicesMeeting_Meeting_Section_General( this.MeetingId);


    this.initBC(this.nvg.getAppExtras('bc'), this.MeetingId, this.Mode);
  }



}

class WorkWithDevicesMeeting_Meeting_Section_GeneralUIModel {

  private _host: WorkWithDevicesMeeting_Meeting_Section_GeneralComponent;

  constructor( host: WorkWithDevicesMeeting_Meeting_Section_GeneralComponent) {
    this._host = host;
  }

  ctrlButtonupdate = new UIButtonElement();
  ctrlButtondelete = new UIButtonElement();
  ctrlButtonsave = new UIButtonElement();
  ctrlButtoncancel = new UIButtonElement();
}

    
class WorkWithDevicesMeeting_Meeting_Section_GeneralUIActions {

  private _host: WorkWithDevicesMeeting_Meeting_Section_GeneralComponent;

  constructor( host: WorkWithDevicesMeeting_Meeting_Section_GeneralComponent) {
    this._host = host;
  }

}
