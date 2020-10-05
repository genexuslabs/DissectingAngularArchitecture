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

import { WorkWithDevicesCompany_Company_Section_GeneralService , WorkWithDevicesCompany_Company_Section_GeneralData } from './workwithdevicescompany_company_section_general.service';
import { BusinessComponent } from 'app/gx/base/business-component';
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Component({
  selector: 'WorkWithDevicesCompany_Company_Section_General',
  templateUrl: './workwithdevicescompany_company_section_general.component.html',
  providers: [
    CompanyService,
    WorkWithDevicesCompany_Company_Section_GeneralService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesCompany_Company_Section_GeneralComponent extends BcPanelComponent<CompanyData, CompanyService> {

  WorkWithDevicesCompany_Company_Section_General_data: WorkWithDevicesCompany_Company_Section_GeneralData;
  uiModel: WorkWithDevicesCompany_Company_Section_GeneralUIModel;
  uiActions: WorkWithDevicesCompany_Company_Section_GeneralUIActions;
  @Input('companyid') 
  CompanyId: number;
  @Input('mode') 
  Mode: string;
  bcInstance: BusinessComponent<CompanyData, CompanyService>;


  stateMembers = [
    "WorkWithDevicesCompany_Company_Section_General_data", "uiModel", "CompanyId", "Mode"
  ];

  _routingPath = 'WorkWithDevicesCompany-Company_Section_General';
  views = [
    {
      name: "EditAnyiOS",
      type: "edit",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_EditAnyiOS.bind(this),
      appBarResetFn: this.resetAppBar_EditAnyiOS.bind(this)
    }
    ,{
      name: "ViewAnyiOS",
      type: "any",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      appBarInitFn: this.initAppBar_ViewAnyiOS.bind(this),
      appBarResetFn: this.resetAppBar_ViewAnyiOS.bind(this)
    }

  ];



  constructor(
      private panelService: WorkWithDevicesCompany_Company_Section_GeneralService,
      private CompanyService : CompanyService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new WorkWithDevicesCompany_Company_Section_GeneralUIActions(this);
    this.bcInstance = new BusinessComponent(new CompanyData(),this.CompanyService);

    this.canControlAppBar = activatedRoute.component === WorkWithDevicesCompany_Company_Section_GeneralComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.WorkWithDevicesCompany_Company_Section_General_data = new WorkWithDevicesCompany_Company_Section_GeneralData();
    this.uiModel = new WorkWithDevicesCompany_Company_Section_GeneralUIModel(this);
    this.CompanyId = !params ? this.CompanyId : 0;
    this.Mode = !params ? this.Mode : "";

    this.loadParams(params);
    this.panelService.start();
  }

  initAppBar_EditAnyiOS(navigationStyle: NavigationStyle) {
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

  resetAppBar_EditAnyiOS() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   
  initAppBar_ViewAnyiOS(navigationStyle: NavigationStyle) {
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

  resetAppBar_ViewAnyiOS() {
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
      await this.nvg.navigateForResult(['WorkWithDevicesCompany-Company_Detail' , { companyid:'' + this.WorkWithDevicesCompany_Company_Section_General_data.CompanyId,mode:'UPD' }], __aSt);
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
      await this.nvg.navigateForResult(['WorkWithDevicesCompany-Company_Detail' , { companyid:'' + this.WorkWithDevicesCompany_Company_Section_General_data.CompanyId,mode:'DLT' }], __aSt);
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
    this.WorkWithDevicesCompany_Company_Section_General_data.CompanyId = this.bcInstance.data.CompanyId;
    this.WorkWithDevicesCompany_Company_Section_General_data.CompanyLogo = this.bcInstance.data.CompanyLogo;
    this.WorkWithDevicesCompany_Company_Section_General_data.CompanyName = this.bcInstance.data.CompanyName;
    this.WorkWithDevicesCompany_Company_Section_General_data.CompanyAddress = this.bcInstance.data.CompanyAddress;
    this.WorkWithDevicesCompany_Company_Section_General_data.CompanyPhone = this.bcInstance.data.CompanyPhone;
    this.WorkWithDevicesCompany_Company_Section_General_data._bc_md5_hash_WorkWithDevicesCompany_Company_Section_General = this.bcInstance.data.gx_md5_hash;
    this.endAction(__aSt);
  } 
  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.CompanyId = this.WorkWithDevicesCompany_Company_Section_General_data.CompanyId;
    this.bcInstance.data.CompanyLogo = this.WorkWithDevicesCompany_Company_Section_General_data.CompanyLogo;
    this.bcInstance.data.CompanyName = this.WorkWithDevicesCompany_Company_Section_General_data.CompanyName;
    this.bcInstance.data.CompanyAddress = this.WorkWithDevicesCompany_Company_Section_General_data.CompanyAddress;
    this.bcInstance.data.CompanyPhone = this.WorkWithDevicesCompany_Company_Section_General_data.CompanyPhone;
    this.bcInstance.data.gx_md5_hash = this.WorkWithDevicesCompany_Company_Section_General_data._bc_md5_hash_WorkWithDevicesCompany_Company_Section_General;
    this.endAction(__aSt);
  } 



  loadParams(params) {
    if (params) {
      this.CompanyId = +this.nvg.getParam('companyid', params, 1) || 0;
      this.Mode = this.nvg.getParam('mode', params, 2) || "";
    }
  }

  async loadPanel() {
    this.WorkWithDevicesCompany_Company_Section_General_data = await this.panelService.getWorkWithDevicesCompany_Company_Section_General( this.CompanyId);


    this.initBC(this.nvg.getAppExtras('bc'), this.CompanyId, this.Mode);
  }

  async Refresh(type?: string) {
    this.WorkWithDevicesCompany_Company_Section_General_data = await this.panelService.getWorkWithDevicesCompany_Company_Section_General( this.CompanyId);


    this.initBC(this.nvg.getAppExtras('bc'), this.CompanyId, this.Mode);
  }



}

class WorkWithDevicesCompany_Company_Section_GeneralUIModel {

  private _host: WorkWithDevicesCompany_Company_Section_GeneralComponent;

  constructor( host: WorkWithDevicesCompany_Company_Section_GeneralComponent) {
    this._host = host;
  }

  ctrlButton1 = new UIButtonElement();
  ctrlButton2 = new UIButtonElement();
}

  
class WorkWithDevicesCompany_Company_Section_GeneralUIActions {

  private _host: WorkWithDevicesCompany_Company_Section_GeneralComponent;

  constructor( host: WorkWithDevicesCompany_Company_Section_GeneralComponent) {
    this._host = host;
  }

}
