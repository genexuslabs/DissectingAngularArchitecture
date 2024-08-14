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

import { WorkWithCompany_Company_DetailService , WorkWithCompany_Company_DetailData  , WorkWithCompany_Company_DetailLocalModel } from './workwithcompany_company_detail.service';
import { format as Core_format } from '@genexus/web-standard-functions/dist/lib-esm/text/format';
import { ContactData } from 'app/Contact/contact.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UITextblockElement } from 'app/gx/ui/model/ui-textblock';
import { UIEditElement } from 'app/gx/ui/model/ui-edit';
import { UITabElement } from 'app/gx/ui/model/ui-tab';
import { UITabpageElement } from 'app/gx/ui/model/ui-tab';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { ContactService } from 'app/Contact/contact.service';
import { WorkWithCompany_Company_Section_GeneralComponent } from 'app/WorkWithCompany/workwithcompany_company_section_general.component';
import { WorkWithCompany_Company_Section_ContactComponent } from 'app/WorkWithCompany/workwithcompany_company_section_contact.component';

@Component({
  selector: 'WorkWithCompany_Company_Detail',
  templateUrl: './workwithcompany_company_detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ContactService,CompanyService,
    WorkWithCompany_Company_DetailService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule, WorkWithCompany_Company_Section_GeneralComponent, WorkWithCompany_Company_Section_ContactComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithCompany_Company_DetailComponent extends BcPanelComponent<CompanyData, CompanyService> {
  state: WorkWithCompany_Company_DetailStateModel;
  @Input("companyid") CompanyId: number;
  @Input("mode") Mode: string;
  ContactInstance: BusinessComponent<ContactData, ContactService>;
  bcInstance: BusinessComponent<CompanyData, CompanyService>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithCompany-Company_Detail';

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


  private ContactService = inject(ContactService);
  private CompanyService = inject(CompanyService);
  panelService = inject(WorkWithCompany_Company_DetailService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithCompany_Company_DetailStateModel();
      this.ContactInstance = new BusinessComponent(new ContactData(),this.ContactService);
      this.bcInstance = new BusinessComponent(new CompanyData(),this.CompanyService);

    this.__canControlAppBar = this.activatedRoute.component === WorkWithCompany_Company_DetailComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithCompany_Company_DetailStateModel();
    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.WorkWithCompany_Company_Detail_data.CompanyId = +this.nvg.getParam('companyid', params, 1) || 0;
      this.state.localModel.Mode = this.nvg.getParam('mode', params, 2) || "";
    } else {
      this.state.WorkWithCompany_Company_Detail_data.CompanyId = 0;
      this.state.localModel.Mode = "";
    }
  }

  setParametersFromInputs() {
    this.state.WorkWithCompany_Company_Detail_data.CompanyId = this.CompanyId;
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
        ['ctrlApplicationbar', 'caption', this.app.translate('Company Info')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', ''],
        ['ctrlForm', 'caption', ''],
        ['ctrlTxbtrnname', 'caption', this.app.translate('Text Block')],
        ['ctrlTxbtrnname', 'visible', false],
        ['ctrlCompanyname', 'visible', true]
      ];
    }

    return [];
  }


  // Actions
  _ReturnToCaller = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      await this.return({CompanyId:this.state.WorkWithCompany_Company_Detail_data.CompanyId}, __aSt);
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
        this.state.uiModel.ctrlForm.caption = Core_format( this.app.translate('GXM_newbc'), this.app.translate('Company'));
      }

      this.state.uiModel.ctrlTxbtrnname.caption = Core_format( this.app.translate('GXM_newbc'), this.app.translate('Company'));
      if ((this.state.localModel.Mode == 'INS')) {
        this.state.uiModel.ctrlTxbtrnname.visible = true;
        this.state.uiModel.ctrlCompanyname.visible = false;
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
    this.state.WorkWithCompany_Company_Detail_data.CompanyId = this.bcInstance.data.CompanyId;
    this.state.WorkWithCompany_Company_Detail_data.CompanyName = this.bcInstance.data.CompanyName;
    this.state.WorkWithCompany_Company_Detail_data._bc_md5_hash_WorkWithCompany_Company_Detail = this.bcInstance.data.gx_md5_hash;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.CompanyId = this.state.WorkWithCompany_Company_Detail_data.CompanyId;
    this.bcInstance.data.CompanyName = this.state.WorkWithCompany_Company_Detail_data.CompanyName;
    this.bcInstance.data.gx_md5_hash = this.state.WorkWithCompany_Company_Detail_data._bc_md5_hash_WorkWithCompany_Company_Detail;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 



  // Load and refresh
  async loadPanel() {
    this.state.WorkWithCompany_Company_Detail_data = await this.panelService.getWorkWithCompany_Company_Detail(this.state.WorkWithCompany_Company_Detail_data.CompanyId, this.state.WorkWithCompany_Company_Detail_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), CompanyData), this.state.WorkWithCompany_Company_Detail_data.CompanyId, this.state.localModel.Mode);
  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    this.state.WorkWithCompany_Company_Detail_data = await this.panelService.getWorkWithCompany_Company_Detail(this.state.WorkWithCompany_Company_Detail_data.CompanyId, this.state.WorkWithCompany_Company_Detail_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), CompanyData), this.state.WorkWithCompany_Company_Detail_data.CompanyId, this.state.localModel.Mode);
    this.endAction(__aSt);
  }


}

class WorkWithCompany_Company_DetailStateModel {
  WorkWithCompany_Company_Detail_data: WorkWithCompany_Company_DetailData;
  localModel: WorkWithCompany_Company_DetailLocalModel;
  uiModel: WorkWithCompany_Company_DetailUIModel;

  constructor() {
      this.WorkWithCompany_Company_Detail_data = new WorkWithCompany_Company_DetailData();
      this.localModel = new WorkWithCompany_Company_DetailLocalModel();
      this.uiModel = new WorkWithCompany_Company_DetailUIModel();

  }
}

class WorkWithCompany_Company_DetailUIModel {

  constructor() {
    this.ctrlCtrlsectionsgeneral.parent = this.ctrlSections;
    this.ctrlCtrlsectionsgeneral.active = true;
    this.ctrlCtrlsectionsgeneral.selected = true;
    this.ctrlCtrlsectionscontact.parent = this.ctrlSections;
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  ctrlSections = new UITabElement();
  ctrlCtrlsectionsgeneral = new UITabpageElement();
  ctrlCtrlsectionscontact = new UITabpageElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
  ctrlTxbtrnname = new UITextblockElement();
  ctrlCompanyname = new UIEditElement();
}



