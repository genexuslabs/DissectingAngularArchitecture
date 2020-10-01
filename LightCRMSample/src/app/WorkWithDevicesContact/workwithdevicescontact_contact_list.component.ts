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

import { WorkWithDevicesContact_Contact_ListService , WorkWithDevicesContact_Contact_List_Grid1Data } from './workwithdevicescontact_contact_list.service';
import { GridControllerData } from 'app/gx/base/grid-dataset';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Component({
  selector: 'WorkWithDevicesContact_Contact_List',
  templateUrl: './workwithdevicescontact_contact_list.component.html',
  providers: [
    WorkWithDevicesContact_Contact_ListService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesContact_Contact_ListComponent extends PanelComponent {

  WorkWithDevicesContact_Contact_List_Grid1_collection: GxCollectionData<WorkWithDevicesContact_Contact_List_Grid1Data>;
  uiModel: WorkWithDevicesContact_Contact_ListUIModel;
  uiActions: WorkWithDevicesContact_Contact_ListUIActions;
  ctrlGrid1Controller: DataGridController<WorkWithDevicesContact_Contact_List_Grid1Data, UIListElementItem>;
  @Input('start') 
  start: number;
  @Input('1') 
  count: number;


  stateMembers = [
    "WorkWithDevicesContact_Contact_List_Grid1_collection", "uiModel", "start", "count"
  ];

  _routingPath = 'WorkWithDevicesContact-Contact_List';
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
      private panelService: WorkWithDevicesContact_Contact_ListService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new WorkWithDevicesContact_Contact_ListUIActions(this);
    this.ctrlGrid1Controller = new DataGridController<WorkWithDevicesContact_Contact_List_Grid1Data, UIListElementItem>("ctrlGrid1",{ctrlGrid1:UIListElementItem},"Gxidentity");

    this.canControlAppBar = activatedRoute.component === WorkWithDevicesContact_Contact_ListComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.WorkWithDevicesContact_Contact_List_Grid1_collection = new GxCollectionData<WorkWithDevicesContact_Contact_List_Grid1Data>();
    this.uiModel = new WorkWithDevicesContact_Contact_ListUIModel(this);
    this.start = !params ? this.start : 0;
    this.count = !params ? this.count : 0;

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
        const ctrlButtoninsert = this.uiModel.ctrlButtoninsert;
        ctrlButtoninsert.id = "ctrlButtoninsert";
        ctrlButtoninsert.caption = this.translate("GXM_insert");
        ctrlButtoninsert.class = "Button";
        ctrlButtoninsert.visible = true;
        ctrlButtoninsert.enabled = true;
        ctrlButtoninsert.priority = "High";
        ctrlButtoninsert.onClick = () => this.callAction(this._Insert);

        this.appBarService.setActions([
          ctrlButtoninsert
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
  _GridSelect = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigate(['WorkWithDevicesContact-Contact_Detail' , { contactid:'' + this.WorkWithDevicesContact_Contact_List_Grid1_collection.CurrentItem.ContactId,companyid:'' + this.WorkWithDevicesContact_Contact_List_Grid1_collection.CurrentItem.CompanyId }], __aSt);

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  _Insert = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigateForResult(['WorkWithDevicesContact-Contact_Detail' , { mode:'INS' }], __aSt);
      await this.Refresh();

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 



  loadParams(params) {
    if (params) {
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
    let data = await this.panelService.getWorkWithDevicesContact_Contact_List_Grid1( this.uiModel._ctrlGrid1Items.start, 30);
    this.WorkWithDevicesContact_Contact_List_Grid1_collection = data;
    this.ctrlGrid1Controller.loadFromData(this.WorkWithDevicesContact_Contact_List_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.WorkWithDevicesContact_Contact_List_Grid1_collection.length, 30, UIListLoadingState.loaded, null);    
  }

  async fetchNextPagectrlGrid1(event) {
    let data = await this.panelService.getWorkWithDevicesContact_Contact_List_Grid1( this.uiModel._ctrlGrid1Items.start, 30);
    this.WorkWithDevicesContact_Contact_List_Grid1_collection.push(...data);
    this.ctrlGrid1Controller.loadFromData(this.WorkWithDevicesContact_Contact_List_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.WorkWithDevicesContact_Contact_List_Grid1_collection.length, 30, UIListLoadingState.loaded, event);
  }


  initControllers() {
    this.ctrlGrid1Controller.setState(this.WorkWithDevicesContact_Contact_List_Grid1_collection, this.uiModel._ctrlGrid1Items );

  }

  ctrlGrid1SetContext( ix: number) {
    this.WorkWithDevicesContact_Contact_List_Grid1_collection.CurrentItem = this.WorkWithDevicesContact_Contact_List_Grid1_collection[ix];
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

class WorkWithDevicesContact_Contact_ListUIModel {

  private _host: WorkWithDevicesContact_Contact_ListComponent;

  constructor( host: WorkWithDevicesContact_Contact_ListComponent) {
    this._host = host;
  }

  _ctrlGrid1Items = new GridControllerData<UIListElementItem>();
  ctrlGrid1 = new UIListElement();
  ctrlButtoninsert = new UIButtonElement();
}

   
class WorkWithDevicesContact_Contact_ListUIActions {

  private _host: WorkWithDevicesContact_Contact_ListComponent;

  constructor( host: WorkWithDevicesContact_Contact_ListComponent) {
    this._host = host;
  }

}
