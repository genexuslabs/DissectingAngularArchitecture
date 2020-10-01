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

import { SelectContact_Level_DetailService , SelectContact_Level_Detail_Grid1Data } from './selectcontact_level_detail.service';
import { GridControllerData } from 'app/gx/base/grid-dataset';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { UIListElement } from 'app/gx/ui/model/ui-list';

@Component({
  selector: 'SelectContact_Level_Detail',
  templateUrl: './selectcontact_level_detail.component.html',
  providers: [
    SelectContact_Level_DetailService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class SelectContact_Level_DetailComponent extends PanelComponent {

  SelectContact_Grid1_collection: GxCollectionData<SelectContact_Level_Detail_Grid1Data>;
  uiModel: SelectContact_Level_DetailUIModel;
  uiActions: SelectContact_Level_DetailUIActions;
  ctrlGrid1Controller: DataGridController<SelectContact_Level_Detail_Grid1Data, UIListElementItem>;
  @Input('pcompanyid') 
  Pcompanyid: number;
  @Input('pcontactid') 
  Pcontactid: number;
  @Input('start') 
  start: number;
  @Input('1') 
  count: number;
  @Input('mode') 
  Mode: string;


  stateMembers = [
    "SelectContact_Grid1_collection", "uiModel", "Pcompanyid", "Pcontactid", "start", "count", "Mode"
  ];

  _routingPath = 'SelectContact-Level_Detail';
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
      private panelService: SelectContact_Level_DetailService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new SelectContact_Level_DetailUIActions(this);
    this.ctrlGrid1Controller = new DataGridController<SelectContact_Level_Detail_Grid1Data, UIListElementItem>("ctrlGrid1",{ctrlGrid1:UIListElementItem},"Gxidentity");

    this.canControlAppBar = activatedRoute.component === SelectContact_Level_DetailComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.SelectContact_Grid1_collection = new GxCollectionData<SelectContact_Level_Detail_Grid1Data>();
    this.uiModel = new SelectContact_Level_DetailUIModel(this);
    this.Pcompanyid = !params ? this.Pcompanyid : 0;
    this.Pcontactid = !params ? this.Pcontactid : 0;
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
      this.Pcontactid = this.SelectContact_Grid1_collection.CurrentItem.ContactId;

      await this.return({Pcontactid:this.Pcontactid}, __aSt)

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 



  loadParams(params) {
    if (params) {
      this.Pcompanyid = +this.nvg.getParam('pcompanyid', params, 1) || 0;
      this.Pcontactid = +this.nvg.getParam('pcontactid', params, 2) || 0;
      this.Mode = this.nvg.getParam('mode', params, 3) || "";
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
    let data = await this.panelService.getSelectContact_Level_Detail_Grid1( this.Pcompanyid, this.Pcontactid, this.uiModel._ctrlGrid1Items.start, 30);
    this.SelectContact_Grid1_collection = data;
    this.ctrlGrid1Controller.loadFromData(this.SelectContact_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.SelectContact_Grid1_collection.length, 30, UIListLoadingState.loaded, null);    
  }

  async fetchNextPagectrlGrid1(event) {
    let data = await this.panelService.getSelectContact_Level_Detail_Grid1( this.Pcompanyid, this.Pcontactid, this.uiModel._ctrlGrid1Items.start, 30);
    this.SelectContact_Grid1_collection.push(...data);
    this.ctrlGrid1Controller.loadFromData(this.SelectContact_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.SelectContact_Grid1_collection.length, 30, UIListLoadingState.loaded, event);
  }


  initControllers() {
    this.ctrlGrid1Controller.setState(this.SelectContact_Grid1_collection, this.uiModel._ctrlGrid1Items );

  }

  ctrlGrid1SetContext( ix: number) {
    this.SelectContact_Grid1_collection.CurrentItem = this.SelectContact_Grid1_collection[ix];
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

class SelectContact_Level_DetailUIModel {

  private _host: SelectContact_Level_DetailComponent;

  constructor( host: SelectContact_Level_DetailComponent) {
    this._host = host;
  }

  _ctrlGrid1Items = new GridControllerData<UIListElementItem>();
  ctrlGrid1 = new UIListElement();
}

  
class SelectContact_Level_DetailUIActions {

  private _host: SelectContact_Level_DetailComponent;

  constructor( host: SelectContact_Level_DetailComponent) {
    this._host = host;
  }

}
