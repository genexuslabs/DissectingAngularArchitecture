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

import { WorkWithDevicesContact_Contact_Section_GeneralService , WorkWithDevicesContact_Contact_Section_GeneralData } from './workwithdevicescontact_contact_section_general.service';
import { BusinessComponent } from 'app/gx/base/business-component';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Component({
  selector: 'WorkWithDevicesContact_Contact_Section_General',
  templateUrl: './workwithdevicescontact_contact_section_general.component.html',
  providers: [
    ContactService,
    WorkWithDevicesContact_Contact_Section_GeneralService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesContact_Contact_Section_GeneralComponent extends BcPanelComponent<ContactData, ContactService> {

  WorkWithDevicesContact_Contact_Section_General_data: WorkWithDevicesContact_Contact_Section_GeneralData;
  uiModel: WorkWithDevicesContact_Contact_Section_GeneralUIModel;
  uiActions: WorkWithDevicesContact_Contact_Section_GeneralUIActions;
  @Input('contactid') 
  ContactId: number;
  @Input('companyid') 
  CompanyId: number;
  @Input('mode') 
  Mode: string;
  bcInstance: BusinessComponent<ContactData, ContactService>;


  stateMembers = [
    "WorkWithDevicesContact_Contact_Section_General_data", "uiModel", "ContactId", "CompanyId", "Mode"
  ];

  _routingPath = 'WorkWithDevicesContact-Contact_Section_General';
  views = [
    {
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
      private panelService: WorkWithDevicesContact_Contact_Section_GeneralService,
      private ContactService : ContactService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new WorkWithDevicesContact_Contact_Section_GeneralUIActions(this);
    this.bcInstance = new BusinessComponent(new ContactData(),this.ContactService);

    this.canControlAppBar = activatedRoute.component === WorkWithDevicesContact_Contact_Section_GeneralComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.WorkWithDevicesContact_Contact_Section_General_data = new WorkWithDevicesContact_Contact_Section_GeneralData();
    this.uiModel = new WorkWithDevicesContact_Contact_Section_GeneralUIModel(this);
    this.ContactId = !params ? this.ContactId : 0;
    this.CompanyId = !params ? this.CompanyId : 0;
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
        const ctrlButton1 = this.uiModel.ctrlButton1;
        ctrlButton1.id = "ctrlButton1";
        ctrlButton1.caption = this.translate("GXM_update");
        ctrlButton1.class = "Button";
        ctrlButton1.visible = true;
        ctrlButton1.enabled = true;
        ctrlButton1.priority = "Normal";
        ctrlButton1.onClick = () => this.callAction(this._Update);

        const ctrlButton2 = this.uiModel.ctrlButton2;
        ctrlButton2.id = "ctrlButton2";
        ctrlButton2.caption = this.translate("GX_BtnDelete");
        ctrlButton2.class = "Button";
        ctrlButton2.visible = true;
        ctrlButton2.enabled = true;
        ctrlButton2.priority = "Normal";
        ctrlButton2.onClick = () => this.callAction(this._Delete);

        this.appBarService.setActions([
          ctrlButton1,
          ctrlButton2
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
        const ctrlButton1 = this.uiModel.ctrlButton1;
        ctrlButton1.id = "ctrlButton1";
        ctrlButton1.caption = this.translate("GXM_Save");
        ctrlButton1.class = "Button";
        ctrlButton1.visible = true;
        ctrlButton1.enabled = true;
        ctrlButton1.priority = "High";
        ctrlButton1.onClick = () => this.callAction(this._Save);

        const ctrlButton2 = this.uiModel.ctrlButton2;
        ctrlButton2.id = "ctrlButton2";
        ctrlButton2.caption = this.translate("GXM_cancel");
        ctrlButton2.class = "Button";
        ctrlButton2.visible = true;
        ctrlButton2.enabled = true;
        ctrlButton2.priority = "High";
        ctrlButton2.onClick = () => this.callAction(this._Cancel);

        this.appBarService.setActions([
          ctrlButton1,
          ctrlButton2
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
   

  // Actions
  _Update = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigateForResult(['WorkWithDevicesContact-Contact_Detail' , { contactid:'' + this.WorkWithDevicesContact_Contact_Section_General_data.ContactId,companyid:'' + this.WorkWithDevicesContact_Contact_Section_General_data.CompanyId,mode:'UPD' }], __aSt);
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
      await this.nvg.navigateForResult(['WorkWithDevicesContact-Contact_Detail' , { contactid:'' + this.WorkWithDevicesContact_Contact_Section_General_data.ContactId,companyid:'' + this.WorkWithDevicesContact_Contact_Section_General_data.CompanyId,mode:'DLT' }], __aSt);
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
    this.WorkWithDevicesContact_Contact_Section_General_data.ContactId = this.bcInstance.data.ContactId;
    this.WorkWithDevicesContact_Contact_Section_General_data.CompanyId = this.bcInstance.data.CompanyId;
    this.WorkWithDevicesContact_Contact_Section_General_data.ContactPhoto = this.bcInstance.data.ContactPhoto;
    this.WorkWithDevicesContact_Contact_Section_General_data.ContactName = this.bcInstance.data.ContactName;
    this.WorkWithDevicesContact_Contact_Section_General_data.CompanyName = this.bcInstance.data.CompanyName;
    this.WorkWithDevicesContact_Contact_Section_General_data.ContactEmail = this.bcInstance.data.ContactEmail;
    this.WorkWithDevicesContact_Contact_Section_General_data._bc_md5_hash_WorkWithDevicesContact_Contact_Section_General = this.bcInstance.data.gx_md5_hash;
    this.endAction(__aSt);
  } 
  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.ContactId = this.WorkWithDevicesContact_Contact_Section_General_data.ContactId;
    this.bcInstance.data.CompanyId = this.WorkWithDevicesContact_Contact_Section_General_data.CompanyId;
    this.bcInstance.data.ContactPhoto = this.WorkWithDevicesContact_Contact_Section_General_data.ContactPhoto;
    this.bcInstance.data.ContactName = this.WorkWithDevicesContact_Contact_Section_General_data.ContactName;
    this.bcInstance.data.CompanyName = this.WorkWithDevicesContact_Contact_Section_General_data.CompanyName;
    this.bcInstance.data.ContactEmail = this.WorkWithDevicesContact_Contact_Section_General_data.ContactEmail;
    this.bcInstance.data.gx_md5_hash = this.WorkWithDevicesContact_Contact_Section_General_data._bc_md5_hash_WorkWithDevicesContact_Contact_Section_General;
    this.endAction(__aSt);
  } 

  async _promptCompanyName() : Promise<any> {
    const __aSt = this.startAction();
    let result = await this.nvg.navigate(['SelectCompany-Level_Detail' , { pcompanyid:'' + this.WorkWithDevicesContact_Contact_Section_General_data.CompanyId }], __aSt);
    this.WorkWithDevicesContact_Contact_Section_General_data.CompanyId = result.Pcompanyid;
    let afterResult = await this.panelService.get_promptCompanyName(this.WorkWithDevicesContact_Contact_Section_General_data.CompanyId);
    this.WorkWithDevicesContact_Contact_Section_General_data.CompanyName = afterResult[0]; 
    this.endAction(__aSt);
  }



  loadParams(params) {
    if (params) {
      this.ContactId = +this.nvg.getParam('contactid', params, 1) || 0;
      this.CompanyId = +this.nvg.getParam('companyid', params, 2) || 0;
      this.Mode = this.nvg.getParam('mode', params, 3) || "";
    }
  }

  async loadPanel() {
    this.WorkWithDevicesContact_Contact_Section_General_data = await this.panelService.getWorkWithDevicesContact_Contact_Section_General( this.ContactId, this.CompanyId);


    this.initBC(this.nvg.getAppExtras('bc'), this.ContactId, this.CompanyId, this.Mode);
  }

  async Refresh(type?: string) {
    this.WorkWithDevicesContact_Contact_Section_General_data = await this.panelService.getWorkWithDevicesContact_Contact_Section_General( this.ContactId, this.CompanyId);


    this.initBC(this.nvg.getAppExtras('bc'), this.ContactId, this.CompanyId, this.Mode);
  }



}

class WorkWithDevicesContact_Contact_Section_GeneralUIModel {

  private _host: WorkWithDevicesContact_Contact_Section_GeneralComponent;

  constructor( host: WorkWithDevicesContact_Contact_Section_GeneralComponent) {
    this._host = host;
  }

  ctrlButton1 = new UIButtonElement();
  ctrlButton2 = new UIButtonElement();
}

  
class WorkWithDevicesContact_Contact_Section_GeneralUIActions {

  private _host: WorkWithDevicesContact_Contact_Section_GeneralComponent;

  constructor( host: WorkWithDevicesContact_Contact_Section_GeneralComponent) {
    this._host = host;
  }

}
