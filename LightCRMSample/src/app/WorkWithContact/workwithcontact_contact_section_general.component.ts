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

import { WorkWithContact_Contact_Section_GeneralService , WorkWithContact_Contact_Section_GeneralData  , WorkWithContact_Contact_Section_GeneralLocalModel } from './workwithcontact_contact_section_general.service';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UISelectElement } from 'app/gx/ui/model/ui-select';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';
import { UIHidecodeController } from 'app/gx/ui/model/ui-hidecode-controller';

@Component({
  selector: 'WorkWithContact_Contact_Section_General',
  templateUrl: './workwithcontact_contact_section_general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ContactService,
    WorkWithContact_Contact_Section_GeneralService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithContact_Contact_Section_GeneralComponent extends BcPanelComponent<ContactData, ContactService> {
  state: WorkWithContact_Contact_Section_GeneralStateModel;
  ctrlCompanyidController: UIHidecodeController;
  @Input("contactid") ContactId: number;
  @Input("companyid") CompanyId: number;
  @Input("mode") Mode: string;
  bcInstance: BusinessComponent<ContactData, ContactService>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithContact-Contact_Section_General';

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
    },{
      name: "EditAnyWebScreen",
      type: "edit",
      os: "Web",
      device: "Any Device Kind",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      navigationStyle: "default",
      appBarBindFn: this.bindAppBar_EditAnyWebScreen.bind(this),
      UIModelDefaults: this.getUIModelDefaults_EditAnyWebScreen.bind(this),
      theme: "GeneXusUnanimo.UnanimoAngular"
    }
  ];


  private ContactService = inject(ContactService);
  panelService = inject(WorkWithContact_Contact_Section_GeneralService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithContact_Contact_Section_GeneralStateModel();
      this.ctrlCompanyidController = new UIHidecodeController(this.panelService.getctrlCompanyidHcProvider,this.panelService.getctrlCompanyidSgProvider);
      this.bcInstance = new BusinessComponent(new ContactData(),this.ContactService);

    this.__canControlAppBar = this.activatedRoute.component === WorkWithContact_Contact_Section_GeneralComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithContact_Contact_Section_GeneralStateModel();
    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.WorkWithContact_Contact_Section_General_data.ContactId = +this.nvg.getParam('contactid', params, 1) || 0;
      this.state.WorkWithContact_Contact_Section_General_data.CompanyId = +this.nvg.getParam('companyid', params, 2) || 0;
      this.state.localModel.Mode = this.nvg.getParam('mode', params, 3) || "";
    } else {
      this.state.WorkWithContact_Contact_Section_General_data.ContactId = 0;
      this.state.WorkWithContact_Contact_Section_General_data.CompanyId = 0;
      this.state.localModel.Mode = "";
    }
  }

  setParametersFromInputs() {
    this.state.WorkWithContact_Contact_Section_General_data.ContactId = this.ContactId;
    this.state.WorkWithContact_Contact_Section_General_data.CompanyId = this.CompanyId;
    this.state.localModel.Mode = this.Mode;
  }


  initUIModel() {
    this.__viewManager.update(this.Mode);
    this.updateUIModel(this.state.uiModel, this.__viewManager.getUIModelDefaults());
    this.ctrlCompanyidController.setState(this.state.WorkWithContact_Contact_Section_General_data.CompanyId, this.state.uiModel.ctrlCompanyid);

  }

  bindAppBar_ViewOrEditAnyWebScreen(navigationStyle: NavigationStyle) {
    if (this.isPrimaryContent()) {
      this.state.uiModel.ctrlApplicationbar.navigationStyle = navigationStyle;
      this.state.uiModel.ctrlApplicationbar.showBackButton = this.nvg.canGoBack();
      this.state.uiModel.ctrlApplicationbar.actionItems = [];
      this.state.uiModel.ctrlBtnupdate.onClick = () => this._Update();
      this.state.uiModel.ctrlBtnupdate.id = 'WorkWithContact_Contact_Section_General_ctrlBtnupdate';
      this.state.uiModel.ctrlApplicationbar.actionItems.push(this.state.uiModel.ctrlBtnupdate);
      this.state.uiModel.ctrlBtndelete.onClick = () => this._Delete();
      this.state.uiModel.ctrlBtndelete.id = 'WorkWithContact_Contact_Section_General_ctrlBtndelete';
      this.state.uiModel.ctrlApplicationbar.actionItems.push(this.state.uiModel.ctrlBtndelete);
      this.state.uiModel.ctrlApplicationbar.onBackButtonClick = () => this.__Cancel();
      if (! this.__showAsCard) {
        this.appBarService.setAppbar(this.state.uiModel.ctrlApplicationbar);
      }
      this.cdr.markForCheck();
    }
  } 
  bindAppBar_EditAnyWebScreen(navigationStyle: NavigationStyle) {
    if (this.isPrimaryContent()) {
      this.state.uiModel.ctrlApplicationbar.navigationStyle = navigationStyle;
      this.state.uiModel.ctrlApplicationbar.showBackButton = this.nvg.canGoBack();
      this.state.uiModel.ctrlApplicationbar.actionItems = [];
      this.state.uiModel.ctrlBtnsave.onClick = () => this._Save();
      this.state.uiModel.ctrlBtnsave.id = 'WorkWithContact_Contact_Section_General_ctrlBtnsave';
      this.state.uiModel.ctrlApplicationbar.actionItems.push(this.state.uiModel.ctrlBtnsave);
      this.state.uiModel.ctrlBtncancel.onClick = () => this._Cancel();
      this.state.uiModel.ctrlBtncancel.id = 'WorkWithContact_Contact_Section_General_ctrlBtncancel';
      this.state.uiModel.ctrlApplicationbar.actionItems.push(this.state.uiModel.ctrlBtncancel);
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
        ['ctrlApplicationbar', 'caption', this.app.translate('General')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', ''],
        ['ctrlBtnupdate', 'id', 'WorkWithContact_Contact_Section_General_ctrlBtnupdate'],
        ['ctrlBtnupdate', 'caption', this.app.translate('GXM_update')],
        ['ctrlBtnupdate', 'class', 'Button button-primary'],
        ['ctrlBtnupdate', 'visible', true],
        ['ctrlBtnupdate', 'enabled', true],
        ['ctrlBtnupdate', 'priority', 'Normal'],
        ['ctrlBtndelete', 'id', 'WorkWithContact_Contact_Section_General_ctrlBtndelete'],
        ['ctrlBtndelete', 'caption', this.app.translate('GX_BtnDelete')],
        ['ctrlBtndelete', 'class', 'Button button-tertiary'],
        ['ctrlBtndelete', 'visible', true],
        ['ctrlBtndelete', 'enabled', true],
        ['ctrlBtndelete', 'priority', 'Normal']
      ];
    }

    return [];
  }
  getUIModelDefaults_EditAnyWebScreen(containerName?: string) {
    if (!containerName) {
      return [
        ['ctrlApplicationbar', 'class', 'ApplicationBars'],
        ['ctrlApplicationbar', 'visible', true],
        ['ctrlApplicationbar', 'caption', this.app.translate('General')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', ''],
        ['ctrlBtnsave', 'id', 'WorkWithContact_Contact_Section_General_ctrlBtnsave'],
        ['ctrlBtnsave', 'caption', this.app.translate('GXM_Save')],
        ['ctrlBtnsave', 'class', 'Button button-primary'],
        ['ctrlBtnsave', 'visible', true],
        ['ctrlBtnsave', 'enabled', true],
        ['ctrlBtnsave', 'priority', 'Normal'],
        ['ctrlBtncancel', 'id', 'WorkWithContact_Contact_Section_General_ctrlBtncancel'],
        ['ctrlBtncancel', 'caption', this.app.translate('GXM_cancel')],
        ['ctrlBtncancel', 'class', 'Button button-tertiary'],
        ['ctrlBtncancel', 'visible', true],
        ['ctrlBtncancel', 'enabled', true],
        ['ctrlBtncancel', 'priority', 'Normal']
      ];
    }

    return [];
  }


  // Actions
  _Update = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      const data = await this.navigateForResult(['WorkWithContact-Contact_Detail' , { contactid:'' + this.state.WorkWithContact_Contact_Section_General_data.ContactId,companyid:'' + this.state.WorkWithContact_Contact_Section_General_data.CompanyId,mode:'UPD' }], __aSt);
      this.state.WorkWithContact_Contact_Section_General_data.ContactId = data?.ContactId ?? this.state.WorkWithContact_Contact_Section_General_data.ContactId;
      this.state.WorkWithContact_Contact_Section_General_data.CompanyId = data?.CompanyId ?? this.state.WorkWithContact_Contact_Section_General_data.CompanyId;

      await this.Refresh();
    } catch (e) {
      this.processCompositeError(e);
    } finally {
           
      this.cdr.markForCheck();
      this.endAction(__aSt);
    }
  } 

  _Delete = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      this.compositeExecution(await (async () => { 
        const data1 = await this.navigateForResult(['WorkWithContact-Contact_Detail' , { contactid:'' + this.state.WorkWithContact_Contact_Section_General_data.ContactId,companyid:'' + this.state.WorkWithContact_Contact_Section_General_data.CompanyId,mode:'DLT' }], __aSt);
        this.state.WorkWithContact_Contact_Section_General_data.ContactId = data1?.ContactId ?? this.state.WorkWithContact_Contact_Section_General_data.ContactId;
        this.state.WorkWithContact_Contact_Section_General_data.CompanyId = data1?.CompanyId ?? this.state.WorkWithContact_Contact_Section_General_data.CompanyId;

        await this.Refresh();
      })() );

      await this.return({ContactId:this.state.WorkWithContact_Contact_Section_General_data.ContactId, CompanyId:this.state.WorkWithContact_Contact_Section_General_data.CompanyId}, __aSt);
      return;
    } catch (e) {
      this.processCompositeError(e);
    } finally {
           
      this.cdr.markForCheck();
      this.endAction(__aSt);
    }
  } 

  _Save = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      this.compositeExecution(await (async () => { 
        await this.saveBC();
      })() );

      await this.return({ContactId:this.state.WorkWithContact_Contact_Section_General_data.ContactId, CompanyId:this.state.WorkWithContact_Contact_Section_General_data.CompanyId}, __aSt);
      return;
    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 

  _Cancel = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.cancel(__aSt);
    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 

  bcToEntity = (): void => {
    const __aSt = this.startAction();
    this.state.WorkWithContact_Contact_Section_General_data.ContactId = this.bcInstance.data.ContactId;
    this.state.WorkWithContact_Contact_Section_General_data.CompanyId = this.bcInstance.data.CompanyId;
    this.state.WorkWithContact_Contact_Section_General_data.ContactPhoto = this.bcInstance.data.ContactPhoto;
    this.state.WorkWithContact_Contact_Section_General_data.ContactName = this.bcInstance.data.ContactName;
    this.state.WorkWithContact_Contact_Section_General_data.CompanyName = this.bcInstance.data.CompanyName;
    this.state.WorkWithContact_Contact_Section_General_data.ContactEmail = this.bcInstance.data.ContactEmail;
    this.state.WorkWithContact_Contact_Section_General_data._bc_md5_hash_WorkWithContact_Contact_Section_General = this.bcInstance.data.gx_md5_hash;
         
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.ContactId = this.state.WorkWithContact_Contact_Section_General_data.ContactId;
    this.bcInstance.data.CompanyId = this.state.WorkWithContact_Contact_Section_General_data.CompanyId;
    this.bcInstance.data.ContactPhoto = this.state.WorkWithContact_Contact_Section_General_data.ContactPhoto;
    this.bcInstance.data.ContactName = this.state.WorkWithContact_Contact_Section_General_data.ContactName;
    this.bcInstance.data.CompanyName = this.state.WorkWithContact_Contact_Section_General_data.CompanyName;
    this.bcInstance.data.ContactEmail = this.state.WorkWithContact_Contact_Section_General_data.ContactEmail;
    this.bcInstance.data.gx_md5_hash = this.state.WorkWithContact_Contact_Section_General_data._bc_md5_hash_WorkWithContact_Contact_Section_General;
         
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  async _promptCompanyName(): Promise<any> {
    const __aSt = this.startAction();
    const result = await this.navigate(['SelectCompany-Level_Detail' , { pcompanyid:'' + this.state.WorkWithContact_Contact_Section_General_data.CompanyId }], __aSt);
    this.state.WorkWithContact_Contact_Section_General_data.CompanyId = result.Pcompanyid ?? this.state.WorkWithContact_Contact_Section_General_data.CompanyId;
    const afterResult = await this.panelService.get_promptCompanyName(this.state.WorkWithContact_Contact_Section_General_data.CompanyId);
    this.state.WorkWithContact_Contact_Section_General_data.CompanyName = afterResult[0]; 
    this.endAction(__aSt);
  }



  // Load and refresh
  async loadPanel() {
    this.state.WorkWithContact_Contact_Section_General_data = await this.panelService.getWorkWithContact_Contact_Section_General(this.state.WorkWithContact_Contact_Section_General_data.ContactId, this.state.WorkWithContact_Contact_Section_General_data.CompanyId, this.state.WorkWithContact_Contact_Section_General_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), ContactData), this.state.WorkWithContact_Contact_Section_General_data.ContactId, this.state.WorkWithContact_Contact_Section_General_data.CompanyId, this.state.localModel.Mode);
  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    this.state.WorkWithContact_Contact_Section_General_data = await this.panelService.getWorkWithContact_Contact_Section_General(this.state.WorkWithContact_Contact_Section_General_data.ContactId, this.state.WorkWithContact_Contact_Section_General_data.CompanyId, this.state.WorkWithContact_Contact_Section_General_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), ContactData), this.state.WorkWithContact_Contact_Section_General_data.ContactId, this.state.WorkWithContact_Contact_Section_General_data.CompanyId, this.state.localModel.Mode);
    this.endAction(__aSt);
  }

  initControllers() {
    this.ctrlCompanyidController.setState(this.state.WorkWithContact_Contact_Section_General_data.CompanyId, this.state.uiModel.ctrlCompanyid);
  }

  async get_ctrlCompanyid(value) {
    this.state.WorkWithContact_Contact_Section_General_data.CompanyId = +this.validateHidecode(await this.ctrlCompanyidController.retrieveValue(this.state.WorkWithContact_Contact_Section_General_data.Gxdesc_companyid))
    this.cdr.markForCheck();
  }
  async load_ctrlCompanyid(description) {
    await this.ctrlCompanyidController.load(description);
    this.cdr.markForCheck();
  }

}

class WorkWithContact_Contact_Section_GeneralStateModel {
  WorkWithContact_Contact_Section_General_data: WorkWithContact_Contact_Section_GeneralData;
  localModel: WorkWithContact_Contact_Section_GeneralLocalModel;
  uiModel: WorkWithContact_Contact_Section_GeneralUIModel;

  constructor() {
      this.WorkWithContact_Contact_Section_General_data = new WorkWithContact_Contact_Section_GeneralData();
      this.localModel = new WorkWithContact_Contact_Section_GeneralLocalModel();
      this.uiModel = new WorkWithContact_Contact_Section_GeneralUIModel();

  }
}

class WorkWithContact_Contact_Section_GeneralUIModel {

  constructor() {
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
  ctrlBtnupdate = new UIButtonElement();
  ctrlBtndelete = new UIButtonElement();
  ctrlBtnsave = new UIButtonElement();
  ctrlBtncancel = new UIButtonElement();
  ctrlCompanyid = new UISelectElement();
}



