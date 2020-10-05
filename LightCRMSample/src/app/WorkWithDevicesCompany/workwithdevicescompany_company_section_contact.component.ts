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

import { WorkWithDevicesCompany_Company_Section_ContactService , WorkWithDevicesCompany_Company_Section_Contact_Grid1Data } from './workwithdevicescompany_company_section_contact.service';
import { GridControllerData } from 'app/gx/base/grid-dataset';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { UIListElement } from 'app/gx/ui/model/ui-list';

@Component({
  selector: 'WorkWithDevicesCompany_Company_Section_Contact',
  templateUrl: './workwithdevicescompany_company_section_contact.component.html',
  providers: [
    WorkWithDevicesCompany_Company_Section_ContactService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesCompany_Company_Section_ContactComponent extends PanelComponent {

  WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection: GxCollectionData<WorkWithDevicesCompany_Company_Section_Contact_Grid1Data>;
  uiModel: WorkWithDevicesCompany_Company_Section_ContactUIModel;
  uiActions: WorkWithDevicesCompany_Company_Section_ContactUIActions;
  ctrlGrid1Controller: DataGridController<WorkWithDevicesCompany_Company_Section_Contact_Grid1Data, UIListElementItem>;
  @Input('companyid') 
  CompanyId: number;
  @Input('start') 
  start: number;
  @Input('1') 
  count: number;
  @Input('mode') 
  Mode: string;


  stateMembers = [
    "WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection", "uiModel", "CompanyId", "start", "count", "Mode"
  ];

  _routingPath = 'WorkWithDevicesCompany-Company_Section_Contact';
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
      private panelService: WorkWithDevicesCompany_Company_Section_ContactService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new WorkWithDevicesCompany_Company_Section_ContactUIActions(this);
    this.ctrlGrid1Controller = new DataGridController<WorkWithDevicesCompany_Company_Section_Contact_Grid1Data, UIListElementItem>("ctrlGrid1",{ctrlGrid1:UIListElementItem},"Gxidentity");

    this.canControlAppBar = activatedRoute.component === WorkWithDevicesCompany_Company_Section_ContactComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection = new GxCollectionData<WorkWithDevicesCompany_Company_Section_Contact_Grid1Data>();
    this.uiModel = new WorkWithDevicesCompany_Company_Section_ContactUIModel(this);
    this.CompanyId = !params ? this.CompanyId : 0;
    this.start = !params ? this.start : 0;
    this.count = !params ? this.count : 0;
    this.Mode = !params ? this.Mode : "";

    this.loadParams(params);
    this.ctrlGrid1Controller.initState();

    this.panelService.start();
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

  resetAppBar_ViewAnyiOS() {
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

  resetAppBar_ViewiPad() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   

  // Actions
  _GridSelect = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigate(['WorkWithDevicesContact-Contact_Detail' , { contactid:'' + this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection.CurrentItem.ContactId,companyid:'' + this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection.CurrentItem.CompanyId }], __aSt);

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 



  loadParams(params) {
    if (params) {
      this.CompanyId = +this.nvg.getParam('companyid', params, 1) || 0;
      this.Mode = this.nvg.getParam('mode', params, 2) || "";
    }
  }

  async loadPanel() {
    await this.ctrlGrid1Load();

  }

  async Refresh(type?: string) {
    await this.ctrlGrid1Load();

  }

  async ctrlGrid1Load() {
   this.ctrlGrid1Controller.initPaging();
    let data = await this.panelService.getWorkWithDevicesCompany_Company_Section_Contact_Grid1( this.CompanyId, this.uiModel._ctrlGrid1Items.start, 30);
    this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection = data;
    this.ctrlGrid1Controller.loadFromData(this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection.length, 30, UIListLoadingState.loaded, null);    
  }

  async fetchNextPagectrlGrid1(event) {
    let data = await this.panelService.getWorkWithDevicesCompany_Company_Section_Contact_Grid1( this.CompanyId, this.uiModel._ctrlGrid1Items.start, 30);
    this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection.push(...data);
    this.ctrlGrid1Controller.loadFromData(this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection.length, 30, UIListLoadingState.loaded, event);
  }


  initControllers() {
    this.ctrlGrid1Controller.setState(this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection, this.uiModel._ctrlGrid1Items );

  }

  ctrlGrid1SetContext( ix: number) {
    this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection.CurrentItem = this.WorkWithDevicesCompany_Company_Section_Contact_Grid1_collection[ix];
    this.ctrlGrid1Controller.balanceModels();
    this.uiModel._ctrlGrid1Items.CurrentItem = this.uiModel._ctrlGrid1Items[ix];
  }
  async ctrlGrid1Action( ix: number, action: any) {
    if (action) {
      await this.callAction(action);
    }
  }
  async ctrlGrid1Refresh() {
    await this.ctrlGrid1Load();
    this.ctrlGrid1Controller.refreshUI();
  }



}

class WorkWithDevicesCompany_Company_Section_ContactUIModel {

  private _host: WorkWithDevicesCompany_Company_Section_ContactComponent;

  constructor( host: WorkWithDevicesCompany_Company_Section_ContactComponent) {
    this._host = host;
  }

  _ctrlGrid1Items = new GridControllerData<UIListElementItem>();
  ctrlGrid1 = new UIListElement();
}

  
class WorkWithDevicesCompany_Company_Section_ContactUIActions {

  private _host: WorkWithDevicesCompany_Company_Section_ContactComponent;

  constructor( host: WorkWithDevicesCompany_Company_Section_ContactComponent) {
    this._host = host;
  }

}
