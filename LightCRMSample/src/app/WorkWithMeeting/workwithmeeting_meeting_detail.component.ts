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

import { WorkWithMeeting_Meeting_DetailService , WorkWithMeeting_Meeting_DetailData  , WorkWithMeeting_Meeting_DetailLocalModel } from './workwithmeeting_meeting_detail.service';
import { format as Core_format } from '@genexus/web-standard-functions/dist/lib-esm/text/format';
import { BusinessComponent } from 'app/gx/base/business-component';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { MeetingService } from 'app/Meeting/meeting.service';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UITextblockElement } from 'app/gx/ui/model/ui-textblock';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { UITabElement } from 'app/gx/ui/model/ui-tab';
import { UITabpageElement } from 'app/gx/ui/model/ui-tab';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { WorkWithMeeting_Meeting_Section_GeneralComponent } from 'app/WorkWithMeeting/workwithmeeting_meeting_section_general.component';

@Component({
  selector: 'WorkWithMeeting_Meeting_Detail',
  templateUrl: './workwithmeeting_meeting_detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MeetingService,
    WorkWithMeeting_Meeting_DetailService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule, WorkWithMeeting_Meeting_Section_GeneralComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithMeeting_Meeting_DetailComponent extends BcPanelComponent<MeetingData, MeetingService> {
  state: WorkWithMeeting_Meeting_DetailStateModel;
  @Input("meetingid") MeetingId: number;
  @Input("mode") Mode: string;
  bcInstance: BusinessComponent<MeetingData, MeetingService>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithMeeting-Meeting_Detail';

  __views = [
    {
      name: "ViewOrEditAnyWebScreen",
      type: "any",
      os: "Web",
      device: "Any Device Kind",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      navigationStyle: "default",
      appBarBindFn: this.bindAppBar_ViewOrEditAnyWebScreen.bind(this),
      UIModelDefaults: this.getUIModelDefaults_ViewOrEditAnyWebScreen.bind(this),
      theme: "GeneXusUnanimo.UnanimoAngular"
    }
  ];


  private MeetingService = inject(MeetingService);
  panelService = inject(WorkWithMeeting_Meeting_DetailService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithMeeting_Meeting_DetailStateModel();
      this.bcInstance = new BusinessComponent(new MeetingData(),this.MeetingService);

    this.__canControlAppBar = this.activatedRoute.component === WorkWithMeeting_Meeting_DetailComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithMeeting_Meeting_DetailStateModel();
    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId = +this.nvg.getParam('meetingid', params, 1) || 0;
      this.state.localModel.Mode = this.nvg.getParam('mode', params, 2) || "";
    } else {
      this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId = 0;
      this.state.localModel.Mode = "";
    }
  }

  setParametersFromInputs() {
    this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId = this.MeetingId;
    this.state.localModel.Mode = this.Mode;
  }


  initUIModel() {
    this.__viewManager.update(this.Mode);
    this.updateUIModel(this.state.uiModel, this.__viewManager.getUIModelDefaults());

  }

  bindAppBar_ViewOrEditAnyWebScreen(navigationStyle: NavigationStyle) {
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

  getUIModelDefaults_ViewOrEditAnyWebScreen(containerName?: string) {
    if (!containerName) {
      return [
        ['ctrlApplicationbar', 'class', 'ApplicationBars'],
        ['ctrlApplicationbar', 'visible', true],
        ['ctrlApplicationbar', 'caption', this.app.translate('Meeting Info')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', ''],
        ['ctrlForm', 'caption', ''],
        ['ctrlTxbtrnname', 'caption', this.app.translate('Text Block')],
        ['ctrlTxbtrnname', 'visible', false],
        ['ctrlMeetingtitle', 'visible', true]
      ];
    }

    return [];
  }


  // Actions
  _ReturnToCaller = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.return({MeetingId:this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId}, __aSt);
      return;
    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 

  _ClientStart = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      if ((this.state.localModel.Mode == 'INS')) {
        this.state.uiModel.ctrlForm.caption = Core_format( this.app.translate('GXM_newbc'), this.app.translate('Meeting'));
      }

      this.state.uiModel.ctrlTxbtrnname.caption = Core_format( this.app.translate('GXM_newbc'), this.app.translate('Meeting'));
      if ((this.state.localModel.Mode == 'INS')) {
        this.state.uiModel.ctrlTxbtrnname.visible = true;
        this.state.uiModel.ctrlMeetingtitle.visible = false;
      }

    } catch (e) {
      this.processCompositeError(e);
    } finally {
       
      this.cdr.markForCheck();
      this.endAction(__aSt);
    }
  } 

  bcToEntity = (): void => {
    const __aSt = this.startAction();
    this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId = this.bcInstance.data.MeetingId;
    this.state.WorkWithMeeting_Meeting_Detail_data.MeetingTitle = this.bcInstance.data.MeetingTitle;
    this.state.WorkWithMeeting_Meeting_Detail_data._bc_md5_hash_WorkWithMeeting_Meeting_Detail = this.bcInstance.data.gx_md5_hash;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.MeetingId = this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId;
    this.bcInstance.data.MeetingTitle = this.state.WorkWithMeeting_Meeting_Detail_data.MeetingTitle;
    this.bcInstance.data.gx_md5_hash = this.state.WorkWithMeeting_Meeting_Detail_data._bc_md5_hash_WorkWithMeeting_Meeting_Detail;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 



  // Load and refresh
  async loadPanel() {
    this.state.WorkWithMeeting_Meeting_Detail_data = await this.panelService.getWorkWithMeeting_Meeting_Detail(this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId, this.state.WorkWithMeeting_Meeting_Detail_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), MeetingData), this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId, this.state.localModel.Mode);
  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    this.state.WorkWithMeeting_Meeting_Detail_data = await this.panelService.getWorkWithMeeting_Meeting_Detail(this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId, this.state.WorkWithMeeting_Meeting_Detail_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), MeetingData), this.state.WorkWithMeeting_Meeting_Detail_data.MeetingId, this.state.localModel.Mode);
    this.endAction(__aSt);
  }


}

class WorkWithMeeting_Meeting_DetailStateModel {
  WorkWithMeeting_Meeting_Detail_data: WorkWithMeeting_Meeting_DetailData;
  localModel: WorkWithMeeting_Meeting_DetailLocalModel;
  uiModel: WorkWithMeeting_Meeting_DetailUIModel;

  constructor() {
      this.WorkWithMeeting_Meeting_Detail_data = new WorkWithMeeting_Meeting_DetailData();
      this.localModel = new WorkWithMeeting_Meeting_DetailLocalModel();
      this.uiModel = new WorkWithMeeting_Meeting_DetailUIModel();

  }
}

class WorkWithMeeting_Meeting_DetailUIModel {

  constructor() {
    this.ctrlCtrlsectionsgeneral.parent = this.ctrlSections;
    this.ctrlCtrlsectionsgeneral.active = true;
    this.ctrlCtrlsectionsgeneral.selected = true;
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  ctrlSections = new UITabElement();
  ctrlCtrlsectionsgeneral = new UITabpageElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
  ctrlTxbtrnname = new UITextblockElement();
  ctrlMeetingtitle = new UIEditElement();
}



