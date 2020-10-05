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

import { WorkWithDevicesMeeting_Meeting_ListService , WorkWithDevicesMeeting_Meeting_List_Grid1Data } from './workwithdevicesmeeting_meeting_list.service';
import { GridControllerData } from 'app/gx/base/grid-dataset';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { msg as GeneXus__SD__Interop_msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { sdtMeetingData } from 'app/sdtMeeting/sdtmeeting.dt';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Component({
  selector: 'WorkWithDevicesMeeting_Meeting_List',
  templateUrl: './workwithdevicesmeeting_meeting_list.component.html',
  providers: [
    WorkWithDevicesMeeting_Meeting_ListService,
  ],
  styles: [":host { display: flex; flex: 1; }"]
})
export class WorkWithDevicesMeeting_Meeting_ListComponent extends PanelComponent {

  WorkWithDevicesMeeting_Meeting_List_Grid1_collection: GxCollectionData<WorkWithDevicesMeeting_Meeting_List_Grid1Data>;
  uiModel: WorkWithDevicesMeeting_Meeting_ListUIModel;
  uiActions: WorkWithDevicesMeeting_Meeting_ListUIActions;
  ctrlGrid1Controller: DataGridController<WorkWithDevicesMeeting_Meeting_List_Grid1Data, ctrlGrid1UIModel>;
  @Input('start') 
  start: number;
  @Input('1') 
  count: number;
  Bool: number;
  Meeting: sdtMeetingData;
  Ameetingid: number;


  stateMembers = [
    "WorkWithDevicesMeeting_Meeting_List_Grid1_collection", "uiModel", "start", "count", "Bool", "Meeting", "Ameetingid"
  ];

  _routingPath = 'WorkWithDevicesMeeting-Meeting_List';
  views = [
    {
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
      private panelService: WorkWithDevicesMeeting_Meeting_ListService,
      protected gam: LoginService,
      public app:AppContainer,
      protected nvg:CompositeNavigation,
      protected activatedRoute: ActivatedRoute,
      private appBarService: AppBarService
  ) {
    super( app, nvg, activatedRoute);
    this.uiActions = new WorkWithDevicesMeeting_Meeting_ListUIActions(this);
    this.ctrlGrid1Controller = new DataGridController<WorkWithDevicesMeeting_Meeting_List_Grid1Data, ctrlGrid1UIModel>("ctrlGrid1",{ctrlGrid1:ctrlGrid1UIModel},"Gxidentity");

    this.canControlAppBar = activatedRoute.component === WorkWithDevicesMeeting_Meeting_ListComponent;
    this.showAsCard = !this.canControlAppBar;
    this.initState(null);
  }

  initState(params) {
    this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection = new GxCollectionData<WorkWithDevicesMeeting_Meeting_List_Grid1Data>();
    this.uiModel = new WorkWithDevicesMeeting_Meeting_ListUIModel(this);
    this.start = !params ? this.start : 0;
    this.count = !params ? this.count : 0;
    this.Bool = 0;
    this.Meeting = new sdtMeetingData();
    this.Ameetingid = 0;

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
  _GridSelect = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigate(['WorkWithDevicesMeeting-Meeting_Detail' , { meetingid:'' + this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId }], __aSt);

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  _Insert = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigateForResult(['WorkWithDevicesMeeting-Meeting_Detail' , { mode:'INS' }], __aSt);
      await this.Refresh();

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  ctrlMeetingtitle_Drag = (
  Meeting, Bool
  ): void => {
    const __aSt = this.startAction();
    this.Meeting = Meeting;
    this.Bool = Bool;

    this.Bool = + true;
    this.Meeting.MeetingId = this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId;
    this.endAction(__aSt);
  } 
  ctrlReciclebin_Drop = async (
  Meeting
  ): Promise<any> => {
    const __aSt = this.startAction();
    this.Meeting = Meeting;

    try {
      this.Ameetingid = this.Meeting.MeetingId;

      await this.panelService.DeleteMeeting(this.Ameetingid);


      await this.Refresh()

    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  ctrlMeetingtitle_DropAccepted = async (
  Meeting
  ): Promise<any> => {
    const __aSt = this.startAction();
    this.Meeting = Meeting;

    try {
      await GeneXus__SD__Interop_msg( this.app.translate('Meeting deleted'));
      this.uiModel._ctrlGrid1Items.CurrentItem.ctrlMeetingtitle.visible = true;
    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 
  ctrlMeetingtitle_Tap = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.nvg.navigate(['WorkWithDevicesMeeting-Meeting_Detail' , { meetingid:'' + this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId }], __aSt);

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
    let data = await this.panelService.getWorkWithDevicesMeeting_Meeting_List_Grid1( this.uiModel._ctrlGrid1Items.start, 30);
    this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection = data;
    this.ctrlGrid1Controller.loadFromData(this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection.length, 30, UIListLoadingState.loaded, null);    
  }

  async fetchNextPagectrlGrid1(event) {
    let data = await this.panelService.getWorkWithDevicesMeeting_Meeting_List_Grid1( this.uiModel._ctrlGrid1Items.start, 30);
    this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection.push(...data);
    this.ctrlGrid1Controller.loadFromData(this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection, this.uiModel._ctrlGrid1Items );
    this.ctrlGrid1Controller.updatePaging(this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection.length, 30, UIListLoadingState.loaded, event);
  }


  initControllers() {
    this.ctrlGrid1Controller.setState(this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection, this.uiModel._ctrlGrid1Items );

  }

  ctrlGrid1SetContext( ix: number) {
    this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection.CurrentItem = this.WorkWithDevicesMeeting_Meeting_List_Grid1_collection[ix];
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

class WorkWithDevicesMeeting_Meeting_ListUIModel {

  private _host: WorkWithDevicesMeeting_Meeting_ListComponent;

  constructor( host: WorkWithDevicesMeeting_Meeting_ListComponent) {
    this._host = host;
  }

  _ctrlGrid1Items = new GridControllerData<ctrlGrid1UIModel>();
  ctrlGrid1 = new UIListElement();
  ctrlButtoninsert = new UIButtonElement();
}

 
class ctrlGrid1UIModel extends UIListElementItem {
   ctrlMeetingtitle = new UIEditElement();
}

 
  
class WorkWithDevicesMeeting_Meeting_ListUIActions {

  private _host: WorkWithDevicesMeeting_Meeting_ListComponent;

  constructor( host: WorkWithDevicesMeeting_Meeting_ListComponent) {
    this._host = host;
    this.ctrlMeetingtitle.setDragAction( (...parms) => {this._host.callAction(this._host.ctrlMeetingtitle_Drag, ...parms);});
    this.ctrlMeetingtitle.setDropAcceptedAction( (...parms) => {this._host.callAction(this._host.ctrlMeetingtitle_DropAccepted, ...parms);});
    this.ctrlMeetingtitle.setClickAction( (...parms) => {this._host.callAction(this._host.ctrlMeetingtitle_Tap, ...parms);});

  }

  ctrlMeetingtitle = new UIEditElement();


}
