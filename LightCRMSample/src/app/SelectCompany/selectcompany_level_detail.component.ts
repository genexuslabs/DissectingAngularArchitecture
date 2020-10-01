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

import { SelectCompany_Level_DetailService , SelectCompany_Level_Detail_Grid1Data } from './selectcompany_level_detail.service';
import { GridControllerData } from 'app/gx/base/grid-dataset';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { UIListElement } from 'app/gx/ui/model/ui-list';

@Component({
  selector: 'SelectCompany_Level_Detail',
  templateUrl: './selectcompany_level_detail.component.html',
  providers: [
    SelectCompany_Level_DetailService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class SelectCompany_Level_DetailComponent extends PanelComponent {

  SelectCompany_Grid1_collection: GxCollectionData<SelectCompany_Level_Detail_Grid1Data>;
  uiModel: SelectCompany_Level_DetailUIModel;
  uiActions: SelectCompany_Level_DetailUIActions;
  ctrlGrid1Controller: DataGridController<SelectCompany_Level_Detail_Grid1Data, UIListElementItem>;
  @Input('pcompanyid') 
  Pcompanyid: number;
  @Input('start') 
  start: number;
  @Input('1') 
  count: number;
  @Input('mode') 
  Mode: string;


  stateMembers = [
    "SelectCompany_Grid1_collection", "uiModel", "Pcompanyid", "start", "count", "Mode"
  ];

  _routingPath = 'SelectCompany-Level_Detail';
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

  ];



  constructor(
      private panelService: SelectCompany_Level_DetailService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new SelectCompany_Level_DetailUIActions(this);
    this.ctrlGrid1Controller = new DataGridController<SelectCompany_Level_Detail_Grid1Data, UIListElementItem>("ctrlGrid1",{ctrlGrid1:UIListElementItem},"Gxidentity");

    this.canControlAppBar = activatedRoute.component === SelectCompany_Level_DetailComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.SelectCompany_Grid1_collection = new GxCollectionData<SelectCompany_Level_Detail_Grid1Data>();
    this.uiModel = new SelectCompany_Level_DetailUIModel(this);
    this.Pcompanyid = !params ? this.Pcompanyid : 0;
    this.start = !params ? this.start : 0;
    this.count = !params ? this.count : 0;
    this.Mode = !params ? this.Mode : "";

    this.loadParams(params);
    this.ctrlGrid1Controller.initState();

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

  resetAppBar_ViewAny() {
    if (this.showAsCard) {
      this.appBarService.setNavigation({
        showBackButton: false,
        onBackButtonClick: null,
      });
    }

    this.appBarService.setActions([]);
  }
   

  // Actions
  _Select = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      this.Pcompanyid = this.SelectCompany_Grid1_collection.CurrentItem.CompanyId;

      await this.return({Pcompanyid:this.Pcompanyid}, __aSt)

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 



  loadParams(params) {
    if (params) {
      this.Pcompanyid = +this.nvg.getParam('pcompanyid', params, 1) || 0;
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
    let data = await this.panelService.getSelectCompany_Level_Detail_Grid1( this.Pcompanyid, this.uiModel._ctrlGrid1Items.start, 30);
    this.SelectCompany_Grid1_collection = data;
    this.ctrlGrid1Controller.loadFromData(this.SelectCompany_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.SelectCompany_Grid1_collection.length, 30, UIListLoadingState.loaded, null);    
  }

  async fetchNextPagectrlGrid1(event) {
    let data = await this.panelService.getSelectCompany_Level_Detail_Grid1( this.Pcompanyid, this.uiModel._ctrlGrid1Items.start, 30);
    this.SelectCompany_Grid1_collection.push(...data);
    this.ctrlGrid1Controller.loadFromData(this.SelectCompany_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.SelectCompany_Grid1_collection.length, 30, UIListLoadingState.loaded, event);
  }


  initControllers() {
    this.ctrlGrid1Controller.setState(this.SelectCompany_Grid1_collection, this.uiModel._ctrlGrid1Items );

  }

  ctrlGrid1SetContext( ix: number) {
    this.SelectCompany_Grid1_collection.CurrentItem = this.SelectCompany_Grid1_collection[ix];
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

class SelectCompany_Level_DetailUIModel {

  private _host: SelectCompany_Level_DetailComponent;

  constructor( host: SelectCompany_Level_DetailComponent) {
    this._host = host;
  }

  _ctrlGrid1Items = new GridControllerData<UIListElementItem>();
  ctrlGrid1 = new UIListElement();
}

  
class SelectCompany_Level_DetailUIActions {

  private _host: SelectCompany_Level_DetailComponent;

  constructor( host: SelectCompany_Level_DetailComponent) {
    this._host = host;
  }

}
