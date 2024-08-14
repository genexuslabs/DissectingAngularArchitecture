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

import { WorkWithContact_Contact_ListService , WorkWithContact_Contact_ListData , WorkWithContact_Contact_List_Grid1Data   } from './workwithcontact_contact_list.service';
import { GridControllerData } from 'app/gx/base/grid-data';
import { UIListElementItem } from 'app/gx/ui/model/ui-list';
import { UIListLoadingState } from 'app/gx/ui/model/ui-list';
import { UIListPagingType } from 'app/gx/ui/model/ui-list';
import { DataGridController } from 'app/gx/base/grid-dataset';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { UIListElement } from 'app/gx/ui/model/ui-list';
import { UIFormElement } from 'app/gx/ui/model/ui-form';
import { UIActionBarElement } from 'app/gx/ui/model/ui-actionbar';

@Component({
  selector: 'WorkWithContact_Contact_List',
  templateUrl: './workwithcontact_contact_list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    WorkWithContact_Contact_ListService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkWithContact_Contact_ListComponent extends PanelComponent {
  state: WorkWithContact_Contact_ListStateModel;
  __ContactId: number;
  __CompanyId: number;
  ctrlGrid1Controller: DataGridController<WorkWithContact_Contact_List_Grid1Data, UIListElementItem>;

  __stateMembers = ['state'];

  __routingPath = 'WorkWithContact-Contact_List';

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


  panelService = inject(WorkWithContact_Contact_ListService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new WorkWithContact_Contact_ListStateModel();
      this.__ContactId = 0;
      this.__CompanyId = 0;
      this.ctrlGrid1Controller = new DataGridController<WorkWithContact_Contact_List_Grid1Data, UIListElementItem>("ctrlGrid1",WorkWithContact_Contact_List_Grid1Data,UIListElementItem,[],"Gxidentity",{uiModelDefaultsFn: this.__viewManager.getUIModelDefaults, gridRowsPerPage: 30 });

    this.__canControlAppBar = this.activatedRoute.component === WorkWithContact_Contact_ListComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new WorkWithContact_Contact_ListStateModel();
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
        ['ctrlApplicationbar', 'caption', this.app.translate('Contacts')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', '']
      ];
    }

    return [];
  }


  // Actions
  _GridSelect = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      const data = await this.navigateForResult(['WorkWithContact-Contact_Detail' , { contactid:'' + this.state.WorkWithContact_Contact_List_Grid1_collection.CurrentItem.ContactId,companyid:'' + this.state.WorkWithContact_Contact_List_Grid1_collection.CurrentItem.CompanyId }], __aSt);
      this.state.WorkWithContact_Contact_List_Grid1_collection.CurrentItem.ContactId = data?.ContactId ?? this.state.WorkWithContact_Contact_List_Grid1_collection.CurrentItem.ContactId;
      this.state.WorkWithContact_Contact_List_Grid1_collection.CurrentItem.CompanyId = data?.CompanyId ?? this.state.WorkWithContact_Contact_List_Grid1_collection.CurrentItem.CompanyId;

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
      const data1 = await this.navigateForResult(['WorkWithContact-Contact_Detail' , { contactid:'' + this.__ContactId,companyid:'' + this.__CompanyId,mode:'INS' }], __aSt);
      this.__ContactId = data1?.ContactId ?? this.__ContactId;
      this.__CompanyId = data1?.CompanyId ?? this.__CompanyId;

      await this.Refresh();
    } catch (e) {
      this.processCompositeError(e);
    } finally {
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
    const response = await this.panelService.getWorkWithContact_Contact_List_Grid1(this.state.WorkWithContact_Contact_List_data.Search, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.WorkWithContact_Contact_List_Grid1_collection = response.data;
    this.state.uiModel._ctrlGrid1Items = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
    this.ctrlGrid1Controller.load1(this.state.WorkWithContact_Contact_List_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, null, []);
  }

  async ctrlGrid1Fetch() {
    const response = await this.panelService.getWorkWithContact_Contact_List_Grid1(this.state.WorkWithContact_Contact_List_data.Search, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.WorkWithContact_Contact_List_Grid1_collection = response.data;
    this.state.uiModel._ctrlGrid1Items.clear();
    this.ctrlGrid1Controller.load1(this.state.WorkWithContact_Contact_List_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, null, []);
  }

  async fetchNextPagectrlGrid1(event) {
    const response = await this.panelService.getWorkWithContact_Contact_List_Grid1(this.state.WorkWithContact_Contact_List_data.Search, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.WorkWithContact_Contact_List_Grid1_collection.push(...response.data);
    this.ctrlGrid1Controller.load1(this.state.WorkWithContact_Contact_List_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, event, []);
    this.cdr.markForCheck();
  }
  initControllers() {
    this.ctrlGrid1Controller.setState(
      this.state.WorkWithContact_Contact_List_Grid1_collection, 
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



}

class WorkWithContact_Contact_ListStateModel {
  WorkWithContact_Contact_List_data: WorkWithContact_Contact_ListData;
  WorkWithContact_Contact_List_Grid1_collection: GxCollectionData<WorkWithContact_Contact_List_Grid1Data>;
  uiModel: WorkWithContact_Contact_ListUIModel;

  constructor() {
      this.WorkWithContact_Contact_List_data = new WorkWithContact_Contact_ListData();
      this.WorkWithContact_Contact_List_Grid1_collection = new GxCollectionData<WorkWithContact_Contact_List_Grid1Data>().setType(WorkWithContact_Contact_List_Grid1Data);
      this.uiModel = new WorkWithContact_Contact_ListUIModel();

  }
}

class WorkWithContact_Contact_ListUIModel {

  constructor() {
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  _ctrlGrid1Items = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
  ctrlGrid1 = new UIListElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
}



