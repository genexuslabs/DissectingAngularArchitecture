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

import { WorkWithContact_Contact_DetailService , WorkWithContact_Contact_DetailData  , WorkWithContact_Contact_DetailLocalModel } from './workwithcontact_contact_detail.service';
import { format as Core_format } from '@genexus/web-standard-functions/dist/lib-esm/text/format';
import { MeetingData } from 'app/Meeting/meeting.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UITextblockElement } from 'app/gx/ui/model/ui-textblock';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { UITabElement } from 'app/gx/ui/model/ui-tab';
import { UITabpageElement } from 'app/gx/ui/model/ui-tab';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { MeetingService } from 'app/Meeting/meeting.service';
import { WorkWithContact_Contact_Section_GeneralComponent } from 'app/WorkWithContact/workwithcontact_contact_section_general.component';
import { WorkWithContact_Contact_Section_MeetingComponent } from 'app/WorkWithContact/workwithcontact_contact_section_meeting.component';

@Component({
  selector: 'WorkWithContact_Contact_Detail',
  templateUrl: './workwithcontact_contact_detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MeetingService,ContactService,
    WorkWithContact_Contact_DetailService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule, WorkWithContact_Contact_Section_GeneralComponent, WorkWithContact_Contact_Section_MeetingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithContact_Contact_DetailComponent extends BcPanelComponent<ContactData, ContactService> {
  state: WorkWithContact_Contact_DetailStateModel;
  @Input("contactid") ContactId: number;
  @Input("companyid") CompanyId: number;
  @Input("mode") Mode: string;
  MeetingInstance: BusinessComponent<MeetingData, MeetingService>;
  bcInstance: BusinessComponent<ContactData, ContactService>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithContact-Contact_Detail';

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
  private ContactService = inject(ContactService);
  panelService = inject(WorkWithContact_Contact_DetailService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithContact_Contact_DetailStateModel();
      this.MeetingInstance = new BusinessComponent(new MeetingData(),this.MeetingService);
      this.bcInstance = new BusinessComponent(new ContactData(),this.ContactService);

    this.__canControlAppBar = this.activatedRoute.component === WorkWithContact_Contact_DetailComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithContact_Contact_DetailStateModel();
    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.WorkWithContact_Contact_Detail_data.ContactId = +this.nvg.getParam('contactid', params, 1) || 0;
      this.state.WorkWithContact_Contact_Detail_data.CompanyId = +this.nvg.getParam('companyid', params, 2) || 0;
      this.state.localModel.Mode = this.nvg.getParam('mode', params, 3) || "";
    } else {
      this.state.WorkWithContact_Contact_Detail_data.ContactId = 0;
      this.state.WorkWithContact_Contact_Detail_data.CompanyId = 0;
      this.state.localModel.Mode = "";
    }
  }

  setParametersFromInputs() {
    this.state.WorkWithContact_Contact_Detail_data.ContactId = this.ContactId;
    this.state.WorkWithContact_Contact_Detail_data.CompanyId = this.CompanyId;
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
        ['ctrlApplicationbar', 'caption', this.app.translate('Contact Info')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', ''],
        ['ctrlForm', 'caption', ''],
        ['ctrlTxbtrnname', 'caption', this.app.translate('Text Block')],
        ['ctrlTxbtrnname', 'visible', false],
        ['ctrlContactname', 'visible', true]
      ];
    }

    return [];
  }


  // Actions
  _ReturnToCaller = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.return({ContactId:this.state.WorkWithContact_Contact_Detail_data.ContactId, CompanyId:this.state.WorkWithContact_Contact_Detail_data.CompanyId}, __aSt);
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
        this.state.uiModel.ctrlForm.caption = Core_format( this.app.translate('GXM_newbc'), this.app.translate('Contact'));
      }

      this.state.uiModel.ctrlTxbtrnname.caption = Core_format( this.app.translate('GXM_newbc'), this.app.translate('Contact'));
      if ((this.state.localModel.Mode == 'INS')) {
        this.state.uiModel.ctrlTxbtrnname.visible = true;
        this.state.uiModel.ctrlContactname.visible = false;
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
    this.state.WorkWithContact_Contact_Detail_data.ContactId = this.bcInstance.data.ContactId;
    this.state.WorkWithContact_Contact_Detail_data.CompanyId = this.bcInstance.data.CompanyId;
    this.state.WorkWithContact_Contact_Detail_data.ContactName = this.bcInstance.data.ContactName;
    this.state.WorkWithContact_Contact_Detail_data._bc_md5_hash_WorkWithContact_Contact_Detail = this.bcInstance.data.gx_md5_hash;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.ContactId = this.state.WorkWithContact_Contact_Detail_data.ContactId;
    this.bcInstance.data.CompanyId = this.state.WorkWithContact_Contact_Detail_data.CompanyId;
    this.bcInstance.data.ContactName = this.state.WorkWithContact_Contact_Detail_data.ContactName;
    this.bcInstance.data.gx_md5_hash = this.state.WorkWithContact_Contact_Detail_data._bc_md5_hash_WorkWithContact_Contact_Detail;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 



  // Load and refresh
  async loadPanel() {
    this.state.WorkWithContact_Contact_Detail_data = await this.panelService.getWorkWithContact_Contact_Detail(this.state.WorkWithContact_Contact_Detail_data.ContactId, this.state.WorkWithContact_Contact_Detail_data.CompanyId, this.state.WorkWithContact_Contact_Detail_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), ContactData), this.state.WorkWithContact_Contact_Detail_data.ContactId, this.state.WorkWithContact_Contact_Detail_data.CompanyId, this.state.localModel.Mode);
  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    this.state.WorkWithContact_Contact_Detail_data = await this.panelService.getWorkWithContact_Contact_Detail(this.state.WorkWithContact_Contact_Detail_data.ContactId, this.state.WorkWithContact_Contact_Detail_data.CompanyId, this.state.WorkWithContact_Contact_Detail_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), ContactData), this.state.WorkWithContact_Contact_Detail_data.ContactId, this.state.WorkWithContact_Contact_Detail_data.CompanyId, this.state.localModel.Mode);
    this.endAction(__aSt);
  }


}

class WorkWithContact_Contact_DetailStateModel {
  WorkWithContact_Contact_Detail_data: WorkWithContact_Contact_DetailData;
  localModel: WorkWithContact_Contact_DetailLocalModel;
  uiModel: WorkWithContact_Contact_DetailUIModel;

  constructor() {
      this.WorkWithContact_Contact_Detail_data = new WorkWithContact_Contact_DetailData();
      this.localModel = new WorkWithContact_Contact_DetailLocalModel();
      this.uiModel = new WorkWithContact_Contact_DetailUIModel();

  }
}

class WorkWithContact_Contact_DetailUIModel {

  constructor() {
    this.ctrlCtrlsectionsgeneral.parent = this.ctrlSections;
    this.ctrlCtrlsectionsgeneral.active = true;
    this.ctrlCtrlsectionsgeneral.selected = true;
    this.ctrlCtrlsectionsmeeting.parent = this.ctrlSections;
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  ctrlSections = new UITabElement();
  ctrlCtrlsectionsgeneral = new UITabpageElement();
  ctrlCtrlsectionsmeeting = new UITabpageElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
  ctrlTxbtrnname = new UITextblockElement();
  ctrlContactname = new UIEditElement();
}



