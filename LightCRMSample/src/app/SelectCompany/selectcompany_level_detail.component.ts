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

import { SelectCompany_Level_DetailService , SelectCompany_Level_Detail_Grid1Data  , SelectCompany_Level_DetailLocalModel } from './selectcompany_level_detail.service';
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
  selector: 'SelectCompany_Level_Detail',
  templateUrl: './selectcompany_level_detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SelectCompany_Level_DetailService,
  ],
  host: {
    class: "gx-panel"
  },
  standalone: true,
  imports: [gxCommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SelectCompany_Level_DetailComponent extends PanelComponent {
  state: SelectCompany_Level_DetailStateModel;
  ctrlGrid1Controller: DataGridController<SelectCompany_Level_Detail_Grid1Data, UIListElementItem>;
  @Input("pcompanyid") Pcompanyid: number;

  __stateMembers = ['state'];

  __routingPath = 'SelectCompany-Level_Detail';

  __views = [
    {
      name: "ViewAny",
      type: "any",
      os: "Any Platform",
      device: "Any Device Kind",
      minShortestBound: 0,
      maxShortestBound: 0,
      minLongestBound: 0,
      maxLongestBound: 0,
      navigationStyle: "default",
      appBarBindFn: this.bindAppBar_ViewAny.bind(this),
      UIModelDefaults: this.getUIModelDefaults_ViewAny.bind(this),
      theme: "GeneXusUnanimo.UnanimoAngular"
    }
  ];


  panelService = inject(SelectCompany_Level_DetailService);
  protected gam = inject(GAMService);
  private appBarService = inject(AppBarService);

  constructor() {
    super();
      this.state = new SelectCompany_Level_DetailStateModel();
      this.ctrlGrid1Controller = new DataGridController<SelectCompany_Level_Detail_Grid1Data, UIListElementItem>("ctrlGrid1",SelectCompany_Level_Detail_Grid1Data,UIListElementItem,[],"Gxidentity",{uiModelDefaultsFn: this.__viewManager.getUIModelDefaults, gridRowsPerPage: 30 });
      this.Pcompanyid = 0;

    this.__canControlAppBar = this.activatedRoute.component === SelectCompany_Level_DetailComponent;
    this.__showAsCard = !this.__canControlAppBar;
    this.initState();
    this.initParameters(null);
    this.initUIModel();
  }

  initState() {
    this.state = new SelectCompany_Level_DetailStateModel();
    this.ctrlGrid1Controller.initState();
    this.ctrlGrid1Controller.setPaging(UIListPagingType.infinite);

    this.panelService.start();
  }

  setParameters(params) {
    if (params) {
      this.state.localModel.Pcompanyid = +this.nvg.getParam('pcompanyid', params, 1) || 0;
    } else {
      this.state.localModel.Pcompanyid = 0;
    }
  }

  setParametersFromInputs() {
    this.state.localModel.Pcompanyid = this.Pcompanyid;
  }


  initUIModel() {
    this.__viewManager.update(this.Mode);
    this.updateUIModel(this.state.uiModel, this.__viewManager.getUIModelDefaults());

  }

  bindAppBar_ViewAny(navigationStyle: NavigationStyle) {
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

  getUIModelDefaults_ViewAny(containerName?: string) {
    if (!containerName) {
      return [
        ['ctrlApplicationbar', 'class', 'ApplicationBars'],
        ['ctrlApplicationbar', 'visible', true],
        ['ctrlApplicationbar', 'caption', this.app.translate('Company')],
        ['ctrlApplicationbar', 'showBackButton', 'False'],
        ['ctrlApplicationbar', 'enableHeaderRowPattern', 'False'],
        ['ctrlApplicationbar', 'headerRowPatternCssClass', '']
      ];
    }

    return [];
  }


  // Actions
  _Select = async (): Promise<any> => {
    const __aSt = this.startAction();
    try {
      this.state.localModel.Pcompanyid = this.state.SelectCompany_Grid1_collection.CurrentItem.CompanyId;
      await this.return({Pcompanyid:this.state.localModel.Pcompanyid}, __aSt);
      return;
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
    const response = await this.panelService.getSelectCompany_Level_Detail_Grid1(this.state.localModel.Pcompanyid, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.SelectCompany_Grid1_collection = response.data;
    this.state.uiModel._ctrlGrid1Items = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
    this.ctrlGrid1Controller.load1(this.state.SelectCompany_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, null, []);
  }

  async ctrlGrid1Fetch() {
    const response = await this.panelService.getSelectCompany_Level_Detail_Grid1(this.state.localModel.Pcompanyid, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.SelectCompany_Grid1_collection = response.data;
    this.state.uiModel._ctrlGrid1Items.clear();
    this.ctrlGrid1Controller.load1(this.state.SelectCompany_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, null, []);
  }

  async fetchNextPagectrlGrid1(event) {
    const response = await this.panelService.getSelectCompany_Level_Detail_Grid1(this.state.localModel.Pcompanyid, this.state.uiModel._ctrlGrid1Items.searchText, this.state.uiModel._ctrlGrid1Items.start, 30);
    this.state.SelectCompany_Grid1_collection.push(...response.data);
    this.ctrlGrid1Controller.load1(this.state.SelectCompany_Grid1_collection, this.state.uiModel._ctrlGrid1Items, null, response, event, []);
    this.cdr.markForCheck();
  }
  initControllers() {
    this.ctrlGrid1Controller.setState(
      this.state.SelectCompany_Grid1_collection, 
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





}

class SelectCompany_Level_DetailStateModel {
  SelectCompany_Grid1_collection: GxCollectionData<SelectCompany_Level_Detail_Grid1Data>;
  localModel: SelectCompany_Level_DetailLocalModel;
  uiModel: SelectCompany_Level_DetailUIModel;

  constructor() {
      this.SelectCompany_Grid1_collection = new GxCollectionData<SelectCompany_Level_Detail_Grid1Data>().setType(SelectCompany_Level_Detail_Grid1Data);
      this.localModel = new SelectCompany_Level_DetailLocalModel();
      this.uiModel = new SelectCompany_Level_DetailUIModel();

  }
}

class SelectCompany_Level_DetailUIModel {

  constructor() {
    this.ctrlForm.applicationBar = this.ctrlApplicationbar;
  }

  _ctrlGrid1Items = new GridControllerData<UIListElementItem>().setType(UIListElementItem);
  ctrlGrid1 = new UIListElement();
  ctrlForm = new UIFormElement();
  ctrlApplicationbar = new UIActionBarElement();
}



