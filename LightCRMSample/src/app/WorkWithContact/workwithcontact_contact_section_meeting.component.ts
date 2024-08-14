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

import { WorkWithContact_Contact_Section_MeetingService , WorkWithContact_Contact_Section_MeetingData , WorkWithContact_Contact_Section_Meeting_GridMeetingData  , WorkWithContact_Contact_Section_MeetingLocalModel } from './workwithcontact_contact_section_meeting.service';
import { GridControllerData } from 'app/gx/base/grid-data';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { UIListPagingType } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { GxDatetime } from '@genexus/web-standard-functions/dist/lib-esm/types/gxdatetime';
import { BusinessComponent } from 'app/gx/base/business-component';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { MeetingService } from 'app/Meeting/meeting.service';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Component({
  selector: 'WorkWithContact_Contact_Section_Meeting',
  templateUrl: './workwithcontact_contact_section_meeting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MeetingService,ContactService,
    WorkWithContact_Contact_Section_MeetingService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithContact_Contact_Section_MeetingComponent extends BcPanelComponent<ContactData, ContactService> {
  state: WorkWithContact_Contact_Section_MeetingStateModel;
  ctrlGridmeetingController: DataGridController<WorkWithContact_Contact_Section_Meeting_GridMeetingData, UIListElementItem>;
  @Input("contactid") ContactId: number;
  @Input("companyid") CompanyId: number;
  @Input("mode") Mode: string;
  MeetingInstance: BusinessComponent<MeetingData, MeetingService>;
  bcInstance: BusinessComponent<ContactData, ContactService>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithContact-Contact_Section_Meeting';

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


  private MeetingService = inject(MeetingService);
  private ContactService = inject(ContactService);
  panelService = inject(WorkWithContact_Contact_Section_MeetingService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithContact_Contact_Section_MeetingStateModel();
      this.ctrlGridmeetingController = new DataGridController<WorkWithContact_Contact_Section_Meeting_GridMeetingData, UIListElementItem>("ctrlGridmeeting",WorkWithContact_Contact_Section_Meeting_GridMeetingData,UIListElementItem,[],"Gxidentity",{uiModelDefaultsFn: this.__viewManager.getUIModelDefaults, gridRowsPerPage: 30 });
      this.MeetingInstance = new BusinessComponent(new MeetingData(),this.MeetingService);
      this.bcInstance = new BusinessComponent(new ContactData(),this.ContactService);

    this.__canControlAppBar = this.activatedRoute.component === WorkWithContact_Contact_Section_MeetingComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithContact_Contact_Section_MeetingStateModel();
    this.ctrlGridmeetingController.initState();
    this.ctrlGridmeetingController.setPaging(UIListPagingType.pages);

    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId = +this.nvg.getParam('contactid', params, 1) || 0;
      this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId = +this.nvg.getParam('companyid', params, 2) || 0;
      this.state.localModel.Mode = this.nvg.getParam('mode', params, 3) || "";
    } else {
      this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId = 0;
      this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId = 0;
      this.state.localModel.Mode = "";
    }
  }

  setParametersFromInputs() {
    this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId = this.ContactId;
    this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId = this.CompanyId;
    this.state.localModel.Mode = this.Mode;
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
      this.state.uiModel.ctrlBtninsert.onClick = () => this._Insert();
      this.state.uiModel.ctrlBtninsert.id = 'WorkWithContact_Contact_Section_Meeting_ctrlBtninsert';
      this.state.uiModel.ctrlApplicationbar.actionItems.push(this.state.uiModel.ctrlBtninsert);
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
        ['ctrlApplicationbar', 'headerRowPatternCssClass', ''],
        ['ctrlBtninsert', 'id', 'WorkWithContact_Contact_Section_Meeting_ctrlBtninsert'],
        ['ctrlBtninsert', 'caption', this.app.translate('GXM_insert')],
        ['ctrlBtninsert', 'class', 'Button button-primary'],
        ['ctrlBtninsert', 'visible', true],
        ['ctrlBtninsert', 'enabled', true],
        ['ctrlBtninsert', 'priority', 'Normal']
      ];
    }

    return [];
  }


  // Actions
  _GridSelect = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      const data = await this.navigateForResult(['WorkWithMeeting-Meeting_Detail' , { meetingid:'' + this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection.CurrentItem.MeetingId }], __aSt);
      this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection.CurrentItem.MeetingId = data?.MeetingId ?? this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection.CurrentItem.MeetingId;

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
      this.MeetingInstance.data.ContactId = this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId;
      this.MeetingInstance.data.CompanyId = this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId;
      const data1 = await this.navigateForResultWithExtras(['WorkWithMeeting-Meeting_Detail' , { mode:'INS' }], { bc: TypeConversions.classToObject(this.MeetingInstance.data)}, __aSt);
      this.MeetingInstance.data = data1?.MeetingId ?? this.MeetingInstance.data;


    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 

  bcToEntity = (): void => {
    const __aSt = this.startAction();
    this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId = this.bcInstance.data.ContactId;
    this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId = this.bcInstance.data.CompanyId;
    this.state.WorkWithContact_Contact_Section_Meeting_data._bc_md5_hash_WorkWithContact_Contact_Section_Meeting = this.bcInstance.data.gx_md5_hash;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.ContactId = this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId;
    this.bcInstance.data.CompanyId = this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId;
    this.bcInstance.data.gx_md5_hash = this.state.WorkWithContact_Contact_Section_Meeting_data._bc_md5_hash_WorkWithContact_Contact_Section_Meeting;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 



  // Load and refresh
  async loadPanel() {
    this.state.WorkWithContact_Contact_Section_Meeting_data = await this.panelService.getWorkWithContact_Contact_Section_Meeting(this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId, this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId, this.state.WorkWithContact_Contact_Section_Meeting_data);

    await this.ctrlGridmeetingLoad();

    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), ContactData), this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId, this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId, this.state.localModel.Mode);
  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    this.state.WorkWithContact_Contact_Section_Meeting_data = await this.panelService.getWorkWithContact_Contact_Section_Meeting(this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId, this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId, this.state.WorkWithContact_Contact_Section_Meeting_data);

    await this.ctrlGridmeetingLoad();

    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), ContactData), this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId, this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId, this.state.localModel.Mode);
    this.endAction(__aSt);
  }

  async ctrlGridmeetingLoad() {
   this.ctrlGridmeetingController.initPaging();
    const response = await this.panelService.getWorkWithContact_Contact_Section_Meeting_GridMeeting(this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId, this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId, this.state.uiModel._ctrlGridmeetingItems.start, 30);
    this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection = response.data;
    this.state.uiModel._ctrlGridmeetingItems = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
    this.ctrlGridmeetingController.load1(this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection, this.state.uiModel._ctrlGridmeetingItems, null, response, null, []);
  }

  async ctrlGridmeetingFetch() {
    const response = await this.panelService.getWorkWithContact_Contact_Section_Meeting_GridMeeting(this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId, this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId, this.state.uiModel._ctrlGridmeetingItems.start, 30);
    this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection = response.data;
    this.state.uiModel._ctrlGridmeetingItems.clear();
    this.ctrlGridmeetingController.load1(this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection, this.state.uiModel._ctrlGridmeetingItems, null, response, null, []);
  }

  async fetchNextPagectrlGridmeeting(event) {
    const response = await this.panelService.getWorkWithContact_Contact_Section_Meeting_GridMeeting(this.state.WorkWithContact_Contact_Section_Meeting_data.ContactId, this.state.WorkWithContact_Contact_Section_Meeting_data.CompanyId, this.state.uiModel._ctrlGridmeetingItems.start, 30);
    this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection.push(...response.data);
    this.ctrlGridmeetingController.load1(this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection, this.state.uiModel._ctrlGridmeetingItems, null, response, event, []);
    this.cdr.markForCheck();
  }
  initControllers() {
    this.ctrlGridmeetingController.setState(
      this.state.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection, 
      this.state.uiModel._ctrlGridmeetingItems,
      null,
    );

  }

  ctrlGridmeetingSetContext(ix: number) {
    this.ctrlGridmeetingController.setCurrent(ix);
  }

  ctrlGridmeetingSelect(ix: number, selected = true) {
    if (selected) {
      this.ctrlGridmeetingController.setCurrent(ix);
    }
    this.ctrlGridmeetingController.action_select(ix, selected, "" );
  }
  async ctrlGridmeetingAction(ix: number, actionHandler: any) {
    this.ctrlGridmeetingController.action_noselection(ix, actionHandler);
  }

  async ctrlGridmeetingSelectionChanged(eventInfo) {
    this.ctrlGridmeetingController.setCurrent(parseInt(eventInfo.addedRowsId[0] || eventInfo.removedRowsId[0])+1);
    this.ctrlGridmeetingController.action_select_list(eventInfo.rowsId.map(rowId => parseInt(rowId)+1), "", null);
  }
  async ctrlGridmeetingRowClicked(eventInfo, actionHandler) {
    if (actionHandler) {
      this.ctrlGridmeetingController.setCurrent(parseInt(eventInfo.rowId)+1);
      await actionHandler();
    }
  }

  async ctrlGridmeetingRefresh() {
    await this.ctrlGridmeetingLoad();
    this.cdr.markForCheck();
  }


  async ctrlGridmeetingPageNavigate(type:string, page?:number) {
    switch (type) {
      case "first":
        this.ctrlGridmeetingController.firstPage();
        break;
      case "previous":
        this.ctrlGridmeetingController.previousPage();
        break;
      case "next":
        this.ctrlGridmeetingController.nextPage();
        break;
      case "last":
        this.ctrlGridmeetingController.lastPage();
        break;
      case "goto":
        this.ctrlGridmeetingController.gotoPage(page);
        break;
    }

    if (! this.ctrlGridmeetingController.gridControllerData.allRecordsLoaded) {
      await this.ctrlGridmeetingFetch();
    }
    this.cdr.markForCheck();
  }

  async ctrlGridmeetingPageRefresh() {
    await this.ctrlGridmeetingFetch();
    this.cdr.markForCheck();
  }



}

class WorkWithContact_Contact_Section_MeetingStateModel {
  WorkWithContact_Contact_Section_Meeting_data: WorkWithContact_Contact_Section_MeetingData;
  WorkWithContact_Contact_Section_Meeting_GridMeeting_collection: GxCollectionData<WorkWithContact_Contact_Section_Meeting_GridMeetingData>;
  localModel: WorkWithContact_Contact_Section_MeetingLocalModel;
  uiModel: WorkWithContact_Contact_Section_MeetingUIModel;

  constructor() {
      this.WorkWithContact_Contact_Section_Meeting_data = new WorkWithContact_Contact_Section_MeetingData();
      this.WorkWithContact_Contact_Section_Meeting_GridMeeting_collection = new GxCollectionData<WorkWithContact_Contact_Section_Meeting_GridMeetingData>().setType(WorkWithContact_Contact_Section_Meeting_GridMeetingData);
      this.localModel = new WorkWithContact_Contact_Section_MeetingLocalModel();
      this.uiModel = new WorkWithContact_Contact_Section_MeetingUIModel();

  }
}

class WorkWithContact_Contact_Section_MeetingUIModel {

  constructor() {
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  _ctrlGridmeetingItems = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
  ctrlGridmeeting = new UIListElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
  ctrlBtninsert = new UIButtonElement();
}



