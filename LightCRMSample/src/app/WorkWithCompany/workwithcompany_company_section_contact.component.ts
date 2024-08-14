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

import { WorkWithCompany_Company_Section_ContactService , WorkWithCompany_Company_Section_ContactData , WorkWithCompany_Company_Section_Contact_GridContactData  , WorkWithCompany_Company_Section_ContactLocalModel } from './workwithcompany_company_section_contact.service';
import { GridControllerData } from 'app/gx/base/grid-data';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { UIListPagingType } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { BusinessComponent } from 'app/gx/base/business-component';
import { CompanyData } from 'app/Company/company.dt';
import { CompanyService } from 'app/Company/company.service';
import { ContactData } from 'app/Contact/contact.dt';
import { ContactService } from 'app/Contact/contact.service';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';
import { UIButtonElement } from 'app/gx/ui/model/ui-button';

@Component({
  selector: 'WorkWithCompany_Company_Section_Contact',
  templateUrl: './workwithcompany_company_section_contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ContactService,CompanyService,
    WorkWithCompany_Company_Section_ContactService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithCompany_Company_Section_ContactComponent extends BcPanelComponent<CompanyData, CompanyService> {
  state: WorkWithCompany_Company_Section_ContactStateModel;
  __CompanyId: number;
  ctrlGridcontactController: DataGridController<WorkWithCompany_Company_Section_Contact_GridContactData, UIListElementItem>;
  @Input("companyid") CompanyId: number;
  @Input("mode") Mode: string;
  ContactInstance: BusinessComponent<ContactData, ContactService>;
  bcInstance: BusinessComponent<CompanyData, CompanyService>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithCompany-Company_Section_Contact';

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


  private ContactService = inject(ContactService);
  private CompanyService = inject(CompanyService);
  panelService = inject(WorkWithCompany_Company_Section_ContactService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithCompany_Company_Section_ContactStateModel();
      this.__CompanyId = 0;
      this.ctrlGridcontactController = new DataGridController<WorkWithCompany_Company_Section_Contact_GridContactData, UIListElementItem>("ctrlGridcontact",WorkWithCompany_Company_Section_Contact_GridContactData,UIListElementItem,[],"Gxidentity",{uiModelDefaultsFn: this.__viewManager.getUIModelDefaults, gridRowsPerPage: 30 });
      this.ContactInstance = new BusinessComponent(new ContactData(),this.ContactService);
      this.bcInstance = new BusinessComponent(new CompanyData(),this.CompanyService);

    this.__canControlAppBar = this.activatedRoute.component === WorkWithCompany_Company_Section_ContactComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithCompany_Company_Section_ContactStateModel();
    this.ctrlGridcontactController.initState();
    this.ctrlGridcontactController.setPaging(UIListPagingType.pages);

    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId = +this.nvg.getParam('companyid', params, 1) || 0;
      this.state.localModel.Mode = this.nvg.getParam('mode', params, 2) || "";
    } else {
      this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId = 0;
      this.state.localModel.Mode = "";
    }
  }

  setParametersFromInputs() {
    this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId = this.CompanyId;
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
      this.state.uiModel.ctrlBtninsert.id = 'WorkWithCompany_Company_Section_Contact_ctrlBtninsert';
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
        ['ctrlApplicationbar', 'caption', this.app.translate('Contacts')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', ''],
        ['ctrlBtninsert', 'id', 'WorkWithCompany_Company_Section_Contact_ctrlBtninsert'],
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
      const data = await this.navigateForResult(['WorkWithContact-Contact_Detail' , { contactid:'' + this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection.CurrentItem.ContactId,companyid:'' + this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection.CurrentItem.CompanyId }], __aSt);
      this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection.CurrentItem.ContactId = data?.ContactId ?? this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection.CurrentItem.ContactId;
      this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection.CurrentItem.CompanyId = data?.CompanyId ?? this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection.CurrentItem.CompanyId;

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
      this.ContactInstance.data.CompanyId = this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId;
      const data1 = await this.navigateForResultWithExtras(['WorkWithContact-Contact_Detail' , { companyid:'' + this.__CompanyId,mode:'INS' }], { bc: TypeConversions.classToObject(this.ContactInstance.data)}, __aSt);
      this.ContactInstance.data = data1?.ContactId ?? this.ContactInstance.data;
      this.__CompanyId = data1?.CompanyId ?? this.__CompanyId;


    } catch (e) {
      this.processCompositeError(e);
    } finally {
      this.endAction(__aSt);
    }
  } 

  bcToEntity = (): void => {
    const __aSt = this.startAction();
    this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId = this.bcInstance.data.CompanyId;
    this.state.WorkWithCompany_Company_Section_Contact_data._bc_md5_hash_WorkWithCompany_Company_Section_Contact = this.bcInstance.data.gx_md5_hash;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 

  entityToBc = (): void => {
    const __aSt = this.startAction();
    this.bcInstance.data.CompanyId = this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId;
    this.bcInstance.data.gx_md5_hash = this.state.WorkWithCompany_Company_Section_Contact_data._bc_md5_hash_WorkWithCompany_Company_Section_Contact;
     
    this.cdr.markForCheck();
    this.endAction(__aSt);
  } 



  // Load and refresh
  async loadPanel() {
    this.state.WorkWithCompany_Company_Section_Contact_data = await this.panelService.getWorkWithCompany_Company_Section_Contact(this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId, this.state.WorkWithCompany_Company_Section_Contact_data);

    await this.ctrlGridcontactLoad();

    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), CompanyData), this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId, this.state.localModel.Mode);
  }

  async Refresh(type?: string) {
    const __aSt = this.startAction();
    this.state.WorkWithCompany_Company_Section_Contact_data = await this.panelService.getWorkWithCompany_Company_Section_Contact(this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId, this.state.WorkWithCompany_Company_Section_Contact_data);

    await this.ctrlGridcontactLoad();

    await this.initBC(TypeConversions.objectToClass(this.nvg.getAppExtras('bc'), CompanyData), this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId, this.state.localModel.Mode);
    this.endAction(__aSt);
  }

  async ctrlGridcontactLoad() {
   this.ctrlGridcontactController.initPaging();
    const response = await this.panelService.getWorkWithCompany_Company_Section_Contact_GridContact(this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId, this.state.uiModel._ctrlGridcontactItems.start, 30);
    this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection = response.data;
    this.state.uiModel._ctrlGridcontactItems = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
    this.ctrlGridcontactController.load1(this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection, this.state.uiModel._ctrlGridcontactItems, null, response, null, []);
  }

  async ctrlGridcontactFetch() {
    const response = await this.panelService.getWorkWithCompany_Company_Section_Contact_GridContact(this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId, this.state.uiModel._ctrlGridcontactItems.start, 30);
    this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection = response.data;
    this.state.uiModel._ctrlGridcontactItems.clear();
    this.ctrlGridcontactController.load1(this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection, this.state.uiModel._ctrlGridcontactItems, null, response, null, []);
  }

  async fetchNextPagectrlGridcontact(event) {
    const response = await this.panelService.getWorkWithCompany_Company_Section_Contact_GridContact(this.state.WorkWithCompany_Company_Section_Contact_data.CompanyId, this.state.uiModel._ctrlGridcontactItems.start, 30);
    this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection.push(...response.data);
    this.ctrlGridcontactController.load1(this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection, this.state.uiModel._ctrlGridcontactItems, null, response, event, []);
    this.cdr.markForCheck();
  }
  initControllers() {
    this.ctrlGridcontactController.setState(
      this.state.WorkWithCompany_Company_Section_Contact_GridContact_collection, 
      this.state.uiModel._ctrlGridcontactItems,
      null,
    );

  }

  ctrlGridcontactSetContext(ix: number) {
    this.ctrlGridcontactController.setCurrent(ix);
  }

  ctrlGridcontactSelect(ix: number, selected = true) {
    if (selected) {
      this.ctrlGridcontactController.setCurrent(ix);
    }
    this.ctrlGridcontactController.action_select(ix, selected, "" );
  }
  async ctrlGridcontactAction(ix: number, actionHandler: any) {
    this.ctrlGridcontactController.action_noselection(ix, actionHandler);
  }

  async ctrlGridcontactSelectionChanged(eventInfo) {
    this.ctrlGridcontactController.setCurrent(parseInt(eventInfo.addedRowsId[0] || eventInfo.removedRowsId[0])+1);
    this.ctrlGridcontactController.action_select_list(eventInfo.rowsId.map(rowId => parseInt(rowId)+1), "", null);
  }
  async ctrlGridcontactRowClicked(eventInfo, actionHandler) {
    if (actionHandler) {
      this.ctrlGridcontactController.setCurrent(parseInt(eventInfo.rowId)+1);
      await actionHandler();
    }
  }

  async ctrlGridcontactRefresh() {
    await this.ctrlGridcontactLoad();
    this.cdr.markForCheck();
  }


  async ctrlGridcontactPageNavigate(type:string, page?:number) {
    switch (type) {
      case "first":
        this.ctrlGridcontactController.firstPage();
        break;
      case "previous":
        this.ctrlGridcontactController.previousPage();
        break;
      case "next":
        this.ctrlGridcontactController.nextPage();
        break;
      case "last":
        this.ctrlGridcontactController.lastPage();
        break;
      case "goto":
        this.ctrlGridcontactController.gotoPage(page);
        break;
    }

    if (! this.ctrlGridcontactController.gridControllerData.allRecordsLoaded) {
      await this.ctrlGridcontactFetch();
    }
    this.cdr.markForCheck();
  }

  async ctrlGridcontactPageRefresh() {
    await this.ctrlGridcontactFetch();
    this.cdr.markForCheck();
  }



}

class WorkWithCompany_Company_Section_ContactStateModel {
  WorkWithCompany_Company_Section_Contact_data: WorkWithCompany_Company_Section_ContactData;
  WorkWithCompany_Company_Section_Contact_GridContact_collection: GxCollectionData<WorkWithCompany_Company_Section_Contact_GridContactData>;
  localModel: WorkWithCompany_Company_Section_ContactLocalModel;
  uiModel: WorkWithCompany_Company_Section_ContactUIModel;

  constructor() {
      this.WorkWithCompany_Company_Section_Contact_data = new WorkWithCompany_Company_Section_ContactData();
      this.WorkWithCompany_Company_Section_Contact_GridContact_collection = new GxCollectionData<WorkWithCompany_Company_Section_Contact_GridContactData>().setType(WorkWithCompany_Company_Section_Contact_GridContactData);
      this.localModel = new WorkWithCompany_Company_Section_ContactLocalModel();
      this.uiModel = new WorkWithCompany_Company_Section_ContactUIModel();

  }
}

class WorkWithCompany_Company_Section_ContactUIModel {

  constructor() {
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  _ctrlGridcontactItems = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
  ctrlGridcontact = new UIListElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
  ctrlBtninsert = new UIButtonElement();
}



