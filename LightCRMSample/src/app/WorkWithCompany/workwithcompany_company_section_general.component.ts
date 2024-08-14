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

import { WorkWithCompany_Company_Section_GeneralService , WorkWithCompany_Company_Section_GeneralData  , WorkWithCompany_Company_Section_GeneralLocalModel } from './workwithcompany_company_section_general.service';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { BusinessComponent } from 'app/gx/base/business-component';
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { UISelectElement } from 'app/gx/ui/model/ui-select';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';
import { UIHidecodeController } from 'app/gx/ui/model/ui-hidecode-controller';

@Component({
  selector: 'WorkWithCompany_Company_Section_General',
  templateUrl: './workwithcompany_company_section_general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CompanyService,
    WorkWithCompany_Company_Section_GeneralService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithCompany_Company_Section_GeneralComponent extends BcPanelComponent<CompanyData, CompanyService> {
  state: WorkWithCompany_Company_Section_GeneralStateModel;
  ctrlCompanyidController: UIHidecodeController;
  @Input("companyid") CompanyId: number;
  @Input("mode") Mode: string;
  bcInstance: BusinessComponent<CompanyData, CompanyService>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithCompany-Company_Section_General';

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


  private CompanyService = inject(CompanyService);
  panelService = inject(WorkWithCompany_Company_Section_GeneralService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithCompany_Company_Section_GeneralStateModel();
      this.ctrlCompanyidController = new UIHidecodeController(this.panelService.getctrlCompanyidHcProvider,this.panelService.getctrlCompanyidSgProvider);
      this.bcInstance = new BusinessComponent(new CompanyData(),this.CompanyService);

    this.__canControlAppBar = this.activatedRoute.component === WorkWithCompany_Company_Section_GeneralComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithCompany_Company_Section_GeneralStateModel();
    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.WorkWithCompany_Company_Section_General_data.CompanyId = +this.nvg.getParam('companyid', params, 1) || 0;
      this.state.localModel.Mode = this.nvg.getParam('mode', params, 2) || "";
    } else {
      this.state.WorkWithCompany_Company_Section_General_data.CompanyId = 0;
      this.state.localModel.Mode = "";
    }
  }

  setParametersFromInputs() {
    this.state.WorkWithCompany_Company_Section_General_data.CompanyId = this.CompanyId;
    this.state.localModel.Mode = this.Mode;
  }


  initUIModel() {
    this.__viewManager.update(this.Mode);
    this.updateUIModel(this.state.uiModel, this.__viewManager.getUIModelDefaults());
    this.ctrlCompanyidController.setState(this.state.WorkWithCompany_Company_Section_General_data.CompanyId, this.state.uiModel.ctrlCompanyid);

  }

  bindAppBar_ViewOrEditAnyWebScreen(navigationStyle: NavigationStyle) {
    if (this.isPrimaryContent()) {
      this.state.uiModel.ctrlApplicationbar.navigationStyle = navigationStyle;
      this.state.uiModel.ctrlApplicationbar.showBackButton = this.nvg.canGoBack();
      this.state.uiModel.ctrlApplicationbar.actionItems = [];
      this.state.uiModel.ctrlBtnupdate.onClick = () => this._Update();
      this.state.uiModel.ctrlBtnupdate.id = 'WorkWithCompany_Company_Section_General_ctrlBtnupdate';
      this.state.uiModel.ctrlApplicationbar.actionItems.push(this.state.uiModel.ctrlBtnupdate);
      this.state.uiModel.ctrlBtndelete.onClick = () => this._Delete();
      this.state.uiModel.ctrlBtndelete.id = 'WorkWithCompany_Company_Section_General_ctrlBtndelete';
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
      this.state.uiModel.ctrlBtnsave.id = 'WorkWithCompany_Company_Section_General_ctrlBtnsave';
      this.state.uiModel.ctrlApplicationbar.actionItems.push(this.state.uiModel.ctrlBtnsave);
      this.state.uiModel.ctrlBtncancel.onClick = () => this._Cancel();
      this.state.uiModel.ctrlBtncancel.id = 'WorkWithCompany_Company_Section_General_ctrlBtncancel';
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
        ['ctrlBtnupdate', 'id', 'WorkWithCompany_Company_Section_General_ctrlBtnupdate'],
        ['ctrlBtnupdate', 'caption', this.app.translate('GXM_update')],
        ['ctrlBtnupdate', 'class', 'Button button-primary'],
        ['ctrlBtnupdate', 'visible', true],
        ['ctrlBtnupdate', 'enabled', true],
        ['ctrlBtnupdate', 'priority', 'Normal'],
        ['ctrlBtndelete', 'id', 'WorkWithCompany_Company_Section_General_ctrlBtndelete'],
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
        ['ctrlBtnsave', 'id', 'WorkWithCompany_Company_Section_General_ctrlBtnsave'],
        ['ctrlBtnsave', 'caption', this.app.translate('GXM_Save')],
        ['ctrlBtnsave', 'class', 'Button button-primary'],
        ['ctrlBtnsave', 'visible', true],
        ['ctrlBtnsave', 'enabled', true],
        ['ctrlBtnsave', 'priority', 'Normal'],
        ['ctrlBtncancel', 'id', 'WorkWithCompany_Company_Section_General_ctrlBtncancel'],
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
      const data = await this.navigateForResult(['WorkWithCompany-Company_Detail' , { companyid:'' + this.state.WorkWithCompany_Company_Section_General_data.CompanyId,mode:'UPD' }], __aSt);
      this.state.WorkWithCompany_Company_Section_General_data.CompanyId = data?.CompanyId ?? this.state.WorkWithCompany_Company_Section_General_data.CompanyId;

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
        const data1 = await this.navigateForResult(['WorkWithCompany-Company_Detail' , { companyid:'' + this.state.WorkWithCompany_Company_Section_General_data.CompanyId,mode:'DLT' }], __aSt);
        this.state.WorkWithCompany_Company_Section_General_data.CompanyId = data1?.CompanyId ?? this.state.WorkWithCompany_Company_Section_General_data.CompanyId;

        await this.Refresh();
      })() );

      await this.return({CompanyId:this.state.WorkWithCompany_Company_Section_General_data.CompanyId}, __aSt);
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

      await this.return({CompanyId:this.state.WorkWithCompany_Company_Section_General_data.CompanyId}, __aSt);
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
    this.state.WorkWithCompany_Company_Section_General_data.CompanyId = this.bcInstance.data.CompanyId;
    this.state.WorkWithCompany_Company_Section_General_data.CompanyLogo = this.bcInstance.data.CompanyLogo;
    this.state.WorkWithCompany_Company_Section_General_data.CompanyName = this.bcInstance.data.CompanyName;
    this.state.WorkWithCompany_Company_Section_General_data.CompanyAddress = this.bcInstance.data.CompanyAddress;
    this.state.WorkWithCompany_Company_Section_General_data.CompanyPhone = this.bcInstance.data.CompanyPhone;
    this.state.WorkWithCompany_Company_Section_General_data._bc_md5_hash_WorkWithCompany_Company_Section_General = this.bcInstance.data.gx_md5_hash;
        
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.CompanyId = this.state.WorkWithCompany_Company_Section_General_data.CompanyId;
    this.bcInstance.data.CompanyLogo = this.state.WorkWithCompany_Company_Section_General_data.CompanyLogo;
    this.bcInstance.data.CompanyName = this.state.WorkWithCompany_Company_Section_General_data.CompanyName;
    this.bcInstance.data.CompanyAddress = this.state.WorkWithCompany_Company_Section_General_data.CompanyAddress;
    this.bcInstance.data.CompanyPhone = this.state.WorkWithCompany_Company_Section_General_data.CompanyPhone;
    this.bcInstance.data.gx_md5_hash = this.state.WorkWithCompany_Company_Section_General_data._bc_md5_hash_WorkWithCompany_Company_Section_General;
        
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 



  // Load and refresh
  async loadPanel() {
    this.state.WorkWithCompany_Company_Section_General_data = await this.panelService.getWorkWithCompany_Company_Section_General(this.state.WorkWithCompany_Company_Section_General_data.CompanyId, this.state.WorkWithCompany_Company_Section_General_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), CompanyData), this.state.WorkWithCompany_Company_Section_General_data.CompanyId, this.state.localModel.Mode);
  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    this.state.WorkWithCompany_Company_Section_General_data = await this.panelService.getWorkWithCompany_Company_Section_General(this.state.WorkWithCompany_Company_Section_General_data.CompanyId, this.state.WorkWithCompany_Company_Section_General_data);


    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), CompanyData), this.state.WorkWithCompany_Company_Section_General_data.CompanyId, this.state.localModel.Mode);
    this.endAction(__aSt);
  }

  initControllers() {
    this.ctrlCompanyidController.setState(this.state.WorkWithCompany_Company_Section_General_data.CompanyId, this.state.uiModel.ctrlCompanyid);
  }

  async get_ctrlCompanyid(value) {
    this.state.WorkWithCompany_Company_Section_General_data.CompanyId = +this.validateHidecode(await this.ctrlCompanyidController.retrieveValue(this.state.WorkWithCompany_Company_Section_General_data.Gxdesc_companyid))
    this.cdr.markForCheck();
  }
  async load_ctrlCompanyid(description) {
    await this.ctrlCompanyidController.load(description);
    this.cdr.markForCheck();
  }

}

class WorkWithCompany_Company_Section_GeneralStateModel {
  WorkWithCompany_Company_Section_General_data: WorkWithCompany_Company_Section_GeneralData;
  localModel: WorkWithCompany_Company_Section_GeneralLocalModel;
  uiModel: WorkWithCompany_Company_Section_GeneralUIModel;

  constructor() {
      this.WorkWithCompany_Company_Section_General_data = new WorkWithCompany_Company_Section_GeneralData();
      this.localModel = new WorkWithCompany_Company_Section_GeneralLocalModel();
      this.uiModel = new WorkWithCompany_Company_Section_GeneralUIModel();

  }
}

class WorkWithCompany_Company_Section_GeneralUIModel {

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


