import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, inject,  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, ActivatedRoute } from '@angular/router';
import { AppContainer } from 'app/gx/base/app-container';
import { CompositeNavigation } from 'app/gx/navigation/composite-navigation';
import { PanelComponent } from 'app/gx/base/panel.component';
import { BcPanelComponent} from 'app/gx/base/bc-panel.component';
import { GAMService} from "app/gx/auth/gam.service";
import { AppBarService } from "app/gx/base/app-bar.service";
import { NavigationStyle } from "app/gx/base/view-manager";
import { Settings } from "app/app.settings";
import { CommonModule as gxCommonModule}  from 'app/common.module';

import { WorkWithMeeting_Meeting_ListService , WorkWithMeeting_Meeting_ListData , WorkWithMeeting_Meeting_List_Grid1Data  , WorkWithMeeting_Meeting_ListLocalModel } from './workwithmeeting_meeting_list.service';
import { GridControllerData } from 'app/gx/base/grid-data';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { UIListPagingType } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { msg as GeneXus__SD__Interop_msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { GxDatetime } from '@genexus/web-standard-functions/dist/lib-esm/types/gxdatetime';
import { sdtMeetingData } from 'app/sdtMeeting/sdtmeeting.dt';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { GlobalEvents } from 'app/gx/base/global-events';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';

@Component({
  selector: 'WorkWithMeeting_Meeting_List',
  templateUrl: './workwithmeeting_meeting_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WorkWithMeeting_Meeting_ListService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithMeeting_Meeting_ListComponent extends PanelComponent {
  state: WorkWithMeeting_Meeting_ListStateModel;
  __MeetingId: number;
  ctrlReciclebin_Drop_subscription: any;
  ctrlGrid1Controller: DataGridController<WorkWithMeeting_Meeting_List_Grid1Data, ctrlGrid1UIModel>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithMeeting-Meeting_List';

  __views = [
    {
      name: "ViewAnyWebScreen",
      type: "any",
      os: "Web",
      device: "Any Device Kind",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      navigationStyle: "default",
      appBarBindFn: this.bindAppBar_ViewAnyWebScreen.bind(this),
      UIModelDefaults: this.getUIModelDefaults_ViewAnyWebScreen.bind(this),
      theme: "GeneXusUnanimo.UnanimoAngular"
    }
  ];


  private _globalevents = inject(GlobalEvents);
  panelService = inject(WorkWithMeeting_Meeting_ListService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithMeeting_Meeting_ListStateModel();
      this.__MeetingId = 0;
      this.ctrlReciclebin_Drop_subscription = null;
      this.ctrlGrid1Controller = new DataGridController<WorkWithMeeting_Meeting_List_Grid1Data, ctrlGrid1UIModel>("ctrlGrid1",WorkWithMeeting_Meeting_List_Grid1Data,ctrlGrid1UIModel,[],"Gxidentity",{uiModelDefaultsFn: this.__viewManager.getUIModelDefaults, gridRowsPerPage: 30 });

    this.__canControlAppBar = this.activatedRoute.component === WorkWithMeeting_Meeting_ListComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithMeeting_Meeting_ListStateModel();
    this.ctrlGrid1Controller.initState();
    this.ctrlGrid1Controller.setPaging(UIListPagingType.pages);

    this.panelService.start();
  }


  initUIModel() {
    this.__viewManager.update(this.Mode);
    this.updateUIModel(this.state.uiModel, this.__viewManager.getUIModelDefaults());

  }

  bindAppBar_ViewAnyWebScreen(navigationStyle: NavigationStyle) {
    if (this.isPrimaryContent()) {
      this.state.uiModel.ctrlApplicationbar.navigationStyle = navigationStyle;
      this.state.uiModel.ctrlApplicationbar.showBackButton = this.nvg.canGoBack();
      this.state.uiModel.ctrlApplicationbar.actionItems = [];
      this.state.uiModel.ctrlApplicationbar.onBackButtonClick = () => this.__Cancel();
      if (! this.__showAsCard) {
        this.appBarService.setAppbar(this.state.uiModel.ctrlApplicationbar);
      }
      this.cdr.markForCheck();
    }
  } 

  getUIModelDefaults_ViewAnyWebScreen(containerName?: string) {
    if (!containerName) {
      return [
        ['ctrlApplicationbar', 'class', 'ApplicationBars'],
        ['ctrlApplicationbar', 'visible', true],
        ['ctrlApplicationbar', 'caption', this.app.translate('Meetings')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', '']
      ];
    }
    if (containerName === 'ctrlGrid1') {
      return [
        ['ctrlMeetingtitle', 'visible', true]
      ];
    }

    return [];
  }


  // Actions
  _GridSelect = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      const data = await this.navigateForResult(['WorkWithMeeting-Meeting_Detail' , { meetingid:'' + this.state.WorkWithMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId }], __aSt);
      this.state.WorkWithMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId = data?.MeetingId ?? this.state.WorkWithMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId;

      await this.Refresh();
    } catch (e) {
      this.processCompositeError(e);
    } finally {
       
      this.cdr.markForCheck();
      this.endAction(__aSt);
    }
  } 

  _Insert = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      const data1 = await this.navigateForResult(['WorkWithMeeting-Meeting_Detail' , { meetingid:'' + this.__MeetingId,mode:'INS' }], __aSt);
      this.__MeetingId = data1?.MeetingId ?? this.__MeetingId;

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
    this.state.localModel.Meeting = Meeting;
    this.state.localModel.Bool = Bool;

    this.state.localModel.Bool = + true;
    this.state.localModel.Meeting.MeetingId = this.state.WorkWithMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  ctrlReciclebin_Drop = async (
  Meeting
  ): Promise<any> => {
    const __aSt = this.startAction();
    this.state.localModel.Meeting = Meeting;

    try {
      this.state.localModel.Ameetingid = this.state.localModel.Meeting.MeetingId;
      await this.panelService.DeleteMeeting(this.state.localModel.Ameetingid);
      await this.Refresh();
    } catch (e) {
      this.processCompositeError(e);
    } finally {
       
      this.cdr.markForCheck();
      this.endAction(__aSt);
    }
  } 

  ctrlMeetingtitle_DropAccepted = async (
  Meeting
  ): Promise<any> => {
    const __aSt = this.startAction();
    this.state.localModel.Meeting = Meeting;

    try {
      await GeneXus__SD__Interop_msg( this.app.translate('Meeting deleted'));
      this.state.uiModel._ctrlGrid1Items.CurrentItem.ctrlMeetingtitle.visible = true;
    } catch (e) {
      this.processCompositeError(e);
    } finally {
       
      this.cdr.markForCheck();
      this.endAction(__aSt);
    }
  } 

  ctrlMeetingtitle_Tap = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      const data2 = await this.navigateForResult(['WorkWithMeeting-Meeting_Detail' , { meetingid:'' + this.state.WorkWithMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId }], __aSt);
      this.state.WorkWithMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId = data2?.MeetingId ?? this.state.WorkWithMeeting_Meeting_List_Grid1_collection.CurrentItem.MeetingId;

      await this.Refresh();
    } catch (e) {
      this.processCompositeError(e);
    } finally {
       
      this.cdr.markForCheck();
      this.endAction(__aSt);
    }
  } 



  // Load and refresh
  async loadPanel() {
    await this.ctrlGrid1Load();

  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    await this.ctrlGrid1Load();

    this.endAction(__aSt);
  }

  async ctrlGrid1Load() {
   this.ctrlGrid1Controller.initPaging();
    const response = await this.panelService.getWorkWithMeeting_Meeting_List_Grid1(this.state.WorkWithMeeting_Meeting_List_data.Search, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.WorkWithMeeting_Meeting_List_Grid1_collection = response.data;
    this.state.uiModel._ctrlGrid1Items = new GridControllerData<ctrlGrid1UIModel>().setType(ctrlGrid1UIModel);
    this.ctrlGrid1Controller.load1(this.state.WorkWithMeeting_Meeting_List_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, null, []);
  }

  async ctrlGrid1Fetch() {
    const response = await this.panelService.getWorkWithMeeting_Meeting_List_Grid1(this.state.WorkWithMeeting_Meeting_List_data.Search, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.WorkWithMeeting_Meeting_List_Grid1_collection = response.data;
    this.state.uiModel._ctrlGrid1Items.clear();
    this.ctrlGrid1Controller.load1(this.state.WorkWithMeeting_Meeting_List_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, null, []);
  }

  async fetchNextPagectrlGrid1(event) {
    const response = await this.panelService.getWorkWithMeeting_Meeting_List_Grid1(this.state.WorkWithMeeting_Meeting_List_data.Search, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.WorkWithMeeting_Meeting_List_Grid1_collection.push(...response.data);
    this.ctrlGrid1Controller.load1(this.state.WorkWithMeeting_Meeting_List_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, event, []);
    this.cdr.markForCheck();
  }
  initControllers() {
    this.ctrlGrid1Controller.setState(
      this.state.WorkWithMeeting_Meeting_List_Grid1_collection, 
      this.state.uiModel._ctrlGrid1Items,
      null,
    );

  }

  ctrlGrid1SetContext(ix: number) {
    this.ctrlGrid1Controller.setCurrent(ix);
  }

  ctrlGrid1Select(ix: number, selected = true) {
    if (selected) {
      this.ctrlGrid1Controller.setCurrent(ix);
    }
    this.ctrlGrid1Controller.action_select(ix, selected, "" );
  }
  async ctrlGrid1Action(ix: number, actionHandler: any) {
    this.ctrlGrid1Controller.action_noselection(ix, actionHandler);
  }

  async ctrlGrid1SelectionChanged(eventInfo) {
    this.ctrlGrid1Controller.setCurrent(parseInt(eventInfo.addedRowsId[0] || eventInfo.removedRowsId[0])+1);
    this.ctrlGrid1Controller.action_select_list(eventInfo.rowsId.map(rowId => parseInt(rowId)+1), "", null);
  }
  async ctrlGrid1RowClicked(eventInfo, actionHandler) {
    if (actionHandler) {
      this.ctrlGrid1Controller.setCurrent(parseInt(eventInfo.rowId)+1);
      await actionHandler();
    }
  }

  async ctrlGrid1Refresh() {
    await this.ctrlGrid1Load();
    this.cdr.markForCheck();
  }

  async ctrlGrid1AutoRefresh(force?: boolean) {
    this.app.debounce.submit(this.ctrlGrid1Refresh, this, force ? 0 : null);
  }

  async ctrlGrid1PageNavigate(type:string, page?:number) {
    switch (type) {
      case "first":
        this.ctrlGrid1Controller.firstPage();
        break;
      case "previous":
        this.ctrlGrid1Controller.previousPage();
        break;
      case "next":
        this.ctrlGrid1Controller.nextPage();
        break;
      case "last":
        this.ctrlGrid1Controller.lastPage();
        break;
      case "goto":
        this.ctrlGrid1Controller.gotoPage(page);
        break;
    }

    if (! this.ctrlGrid1Controller.gridControllerData.allRecordsLoaded) {
      await this.ctrlGrid1Fetch();
    }
    this.cdr.markForCheck();
  }

  async ctrlGrid1PageRefresh() {
    await this.ctrlGrid1Fetch();
    this.cdr.markForCheck();
  }



  startEvents() {
    this.ctrlReciclebin_Drop_subscription = this._globalevents.subscribe('RecicleBin.Drop', (Meeting) => {this.ctrlReciclebin_Drop(Meeting)});
  }

  endEvents() {
    this._globalevents.unsubscribe(this.ctrlReciclebin_Drop_subscription);
  }

}

class WorkWithMeeting_Meeting_ListStateModel {
  WorkWithMeeting_Meeting_List_data: WorkWithMeeting_Meeting_ListData;
  WorkWithMeeting_Meeting_List_Grid1_collection: GxCollectionData<WorkWithMeeting_Meeting_List_Grid1Data>;
  localModel: WorkWithMeeting_Meeting_ListLocalModel;
  uiModel: WorkWithMeeting_Meeting_ListUIModel;

  constructor() {
      this.WorkWithMeeting_Meeting_List_data = new WorkWithMeeting_Meeting_ListData();
      this.WorkWithMeeting_Meeting_List_Grid1_collection = new GxCollectionData<WorkWithMeeting_Meeting_List_Grid1Data>().setType(WorkWithMeeting_Meeting_List_Grid1Data);
      this.localModel = new WorkWithMeeting_Meeting_ListLocalModel();
      this.uiModel = new WorkWithMeeting_Meeting_ListUIModel();

  }
}

class WorkWithMeeting_Meeting_ListUIModel {

  constructor() {
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  _ctrlGrid1Items = new GridControllerData<ctrlGrid1UIModel>().setType(ctrlGrid1UIModel);
  ctrlGrid1 = new UIListElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
}

class ctrlGrid1UIModel extends UIListElementItem {
  ctrlMeetingtitle = new UIEditElement();
}


