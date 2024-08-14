import { GxCollectionData, gxRowNumberId } from "app/gx/base/gxcollection.dt";
import {
  UIListElementItem,
  UIListPagingType,
  UI_LIST_DATA_STATE,
} from "app/gx/ui/model/ui-list";
import { UIListLoadingState } from "app/gx/ui/model/ui-list";
import { GridControllerData } from "app/gx/base/grid-data";
import { PanelComponent } from "app/gx/base/panel.component";

export abstract class GridDataset<D, U extends UIListElementItem> {
  gridName: string;
  gridDataType: { new(): D };
  gridItemType: { new(): U };
  identityName: string;
  gridDef: { uiModelDefaultsFn?: any, gridRowsPerPage: number } | null = null;
  nestedGrids: Array<{ id: string; loader: any, controller?: any, dataModelName?: string, uiModelName?: string, uiModelDefaultsFn?: any }> = [];

  gridData: GxCollectionData<D>;
  gridControllerData: GridControllerData<U>;

  dataFetchStrategy: IFetchStrategy<U>;

  get dataState() {
    // TO DO: This should not be required: dataState should be revcovered
    // from model grid controller model itself
    return this.gridControllerData.dataState;
  }

  uiModel = null;

  constructor(
    gm: string,
    gdt: { new(): D },
    git: { new(): U },
    tm: any,
    identityName?: string,
    gridDef: any = null
  ) {
    this.gridName = gm;
    this.gridDataType = gdt;
    this.gridItemType = git;
    this.nestedGrids = tm;
    this.identityName = identityName;
    this.gridDef = gridDef;
  }

  initState() {
    this.gridData = new GxCollectionData<D>().setType(this.gridDataType);
    this.gridControllerData = new GridControllerData<U>().setType(this.gridItemType);
  }

  setState(
    data: GxCollectionData<D>,
    controllerData: GridControllerData<U>,
    uiModel: any = null
  ) {
    this.gridData = data;
    this.gridControllerData = controllerData;
    this.uiModel = uiModel;
  }

  setPaging(type: UIListPagingType) {
    if (this.dataFetchStrategy) {
      this.dataFetchStrategy.uiPagingType = type;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Grid paging

  initPaging() {
    this.gridControllerData.start = 0;
    this.gridControllerData.count = 0;
    this.gridControllerData.startRecordPage = 0;
    this.gridControllerData.endRecordPage = 0;
    this.gridControllerData.currentPage = 1;
    this.gridControllerData.totalPages = -1;
    this.gridControllerData.rowsPerPage = 0;
    this.gridControllerData.hasNextPage = false;
    this.gridControllerData.allRecordsLoaded = false;
    this.gridControllerData.dataState = UI_LIST_DATA_STATE.initial;
  }

  firstPage() {
    this.gotoPage(1);
  }

  previousPage() {
    this.gotoPage(this.gridControllerData.currentPage - 1);
  }

  nextPage() {
    this.gotoPage(this.gridControllerData.currentPage + 1);
  }

  lastPage() {
    if (this.gridControllerData.allRecordsLoaded) {
      this.gotoPage(this.gridControllerData.totalPages);
    } else {
      this.gridControllerData.start = -1;
    }
  }

  gotoPage(page: number) {
    const rowsPerPage = this.gridControllerData.rowsPerPage;

    if (this.gridControllerData.allRecordsLoaded) {
      page = Math.min(Math.max(page, 1), this.gridControllerData.totalPages);

      this.gridControllerData.currentPage = page;
      this.gridControllerData.start = page * rowsPerPage - rowsPerPage;
      this.gridControllerData.startRecordPage = page * rowsPerPage - rowsPerPage;
      this.gridControllerData.endRecordPage = page * rowsPerPage;
    } else {
      this.gridControllerData.start = page * rowsPerPage - rowsPerPage;
      this.gridControllerData.startRecordPage = 0;
      this.gridControllerData.endRecordPage = rowsPerPage;
    }
  }

  setCurrent(ix: number) {
    this.balanceModels();
    this.gridData.CurrentItem = this.gridData[ix - 1];
    this.gridControllerData.CurrentItem = this.gridControllerData[ix - 1];
  }

  getCurrentItem(ix: number) {
    this.balanceModels();
    return this.gridData[ix - 1];
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Grid actions behaviour

  async action_noselection(ix: number, actionHandler: any) {
    if (actionHandler) {
      await actionHandler();
    }
  }

  async action_single_executing(
    ix: number,
    actionHandler: any = null,
    selectionChangedHandler: any = null
  ) {
    this.select(ix, true);
    const curr = this.gridControllerData.CurrentItem;
    if (selectionChangedHandler) {
      await selectionChangedHandler(null);
    }
    if (actionHandler) {
      await actionHandler();
    }
    curr.Selected = false;
  }

  async action_single_keep(
    ix: number,
    actionHandler: any = null,
    selectionChangedHandler: any = null
  ) {
    this.clearSelection();
    this.select(ix, true);
    if (selectionChangedHandler) {
      await selectionChangedHandler(null);
    }
    if (actionHandler) {
      await actionHandler();
    }
  }

  async action_multi_keep(
    ix: number,
    flagVar: string,
    actionHandler: any = null,
    selectionChangedHandler: any = null
  ) {
    if (flagVar) {
      const currItem = this.getCurrentItem(ix);
      if (currItem) {
        currItem[flagVar] = !currItem[flagVar];
      }
    }
    this.toggle(ix);
    if (selectionChangedHandler) {
      await selectionChangedHandler(null);
    }
    if (actionHandler) {
      await actionHandler();
    }
  }

  async action_select_list(
    ixs: Array<number>,
    flagVar: string,
    selectionChangedHandler: any = null
  ) {
    this.clearSelection();
    ixs.forEach((ix) => this.select(ix, true));

    if (selectionChangedHandler) {
      await selectionChangedHandler(null);
    }
  }

  async action_select(
    ix: number,
    selected = true,
    flagVar: string,
    selectionChangedHandler: any = null
  ) {
    if (flagVar) {
      const currItem = this.getCurrentItem(ix);
      if (currItem) {
        currItem[flagVar] = selected;
      }
    }
    this.select(ix, selected);
    if (selectionChangedHandler) {
      await selectionChangedHandler(null);
    }
  }

  private select(ix: number, selected: boolean) {
    const curr = this.gridControllerData[ix - 1];
    curr.Selected = selected;
    if (this.uiModel) {
      this.uiModel.SelectedIndex = curr.Selected ? ix : 0;
      this.uiModel.currentPage = curr.Selected ? ix : 0;
    }
  }

  private toggle(ix: number) {
    const curr = this.gridControllerData[ix - 1];
    curr.Selected = !curr.Selected;
    if (this.uiModel) {
      this.uiModel.SelectedIndex = curr.Selected ? ix : 0;
    }
  }

  clearSelection() {
    for (const item of this.gridControllerData) {
      item.Selected = false;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Utility functions

  identify = (index: number, item: any) => {
    return this.firstDefinedValue(
      item[this.identityName],
      item[gxRowNumberId],
      index
    );
  };

  firstDefinedValue = (...args: any[]) => {
    for (let i = 0; i < args.length; i++) {
      if (args[i] !== undefined) return args[i];
    }
    return null;
  };

  balanceModels() {
    const dataLength = this.gridData.length;
    const controllerLength = this.gridControllerData.length;
    for (let i = controllerLength; i < dataLength; i++) {
      const element = this.createDataElement<U>([], [], this.gridItemType);
      this.gridControllerData.push(element);
    }
  }

  createDataElement<E>(defaultProps, dynpropsObject, c: { new(): E }) {
    const element = new c();
    this.applyElementProperties(defaultProps, dynpropsObject, element);
    return element;
  }

  applyElementProperties(defaultProps, dynpropsObject, element) {
    // Apply defaults
    for (let j = 0; j < defaultProps.length; j++) {
      this.setGridControlProperty(
        defaultProps,
        [defaultProps[j][0], defaultProps[j][1], defaultProps[j][2]],
        element
      );
    }
    // Apply dyanamic properties
    for (let j = 0; j < dynpropsObject.length; j++) {
      this.setGridControlProperty(
        defaultProps,
        [
          PanelComponent.toControlName(dynpropsObject[j][0]),
          dynpropsObject[j][1],
          dynpropsObject[j][2],
        ],
        element
      );
    }
  }

  setGridControlProperty(
    defaultProps: any,
    propToApply: any,
    uiModel: UIListElementItem
  ): boolean {
    let handled = true;
    const propName = propToApply[1].toLowerCase();
    switch (propName) {
      case "itemlayout":
        uiModel.Itemlayout = propToApply[2];
        break;
      default:
        handled = PanelComponent.setProperty(
          propToApply[0],
          propToApply[1],
          propToApply[2],
          uiModel
        );
    }
    return handled;
  }

  toGridUiModelName(name: string): string {
    return "_" + name + "Items";
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  // Loading

  load1(dataModel, uiModel, dynProps, response, event, breakBy) {
    const defaults = this.gridDef.uiModelDefaultsFn(this.gridName);
    this.loader(dataModel, uiModel, dynProps, defaults, response, event, breakBy);
  }

  loader = (dataModel, uiModel, dynprops, defaults, response, event, breakBy) => {

  }

  breakBy(dataWithDyn_i, breakBy: string[], element) {
    if (breakBy) {
      const currBreakValue = [];
      breakBy.forEach((bb) => currBreakValue.push(dataWithDyn_i[bb]));
      if (
        !GridDataset.compareBreakBy(
          currBreakValue,
          this.gridControllerData.lastBreakValue
        )
      ) {
        element.Break = true;
        this.gridControllerData.lastBreakValue = currBreakValue;
      }
    }
  }

  static compareBreakBy(a1: string[], a2: string[]) {
    if (!a1 || !a2) return false;

    if (a1.length !== a2.length) return false;

    for (let i = 0, l = a1.length; i < l; i++) {
      if (a1[i].toString() !== a2[i].toString()) {
        return false;
      }
    }
    return true;
  }

}

export class SdtGridController<
  D,
  U extends UIListElementItem
> extends GridDataset<D, U> {

  dataFetchStrategy = new FullFetchStrategy<U>();

  private readonly observedProps = ["add", "remove"];
  private handler = {
    get: (target, property) => {
      if (
        typeof target[property] === "function" &&
        this.observedProps.includes(property)
      ) {
        return (...args) => {
          const result = target[property](...args);

          this.loadFromSDT(target, this.gridControllerData, null);
          this.dataFetchStrategy.updateState(
            this.gridControllerData,
            {
              gridCurrentRecordStart: this.gridControllerData.start,
              gridRowsPerPage: this.gridControllerData.rowsPerPage,
              gridTotalRecordCount: this.gridControllerData.length
            }
          );

          return result;
        };
      }
      return target[property];
    },
  };

  createProxy(collection) {
    return new Proxy(collection, this.handler);
  }

  loader = (dataModel, uiModel, dynprops, defaults, response, event, breakBy) => {
    this.loadFromSDT(
      dataModel,
      uiModel,
      dynprops,
      defaults,
      breakBy);

    const gridPagingState = {
      gridCurrentRecordStart: uiModel.start,
      gridRowsPerPage: this.gridDef.gridRowsPerPage,
      gridTotalRecordCount: uiModel.length
    };
    this.dataFetchStrategy.updateState(this.gridControllerData, gridPagingState);
  }

  loadFromSDT(
    data: GxCollectionData<any>,
    controllerData: GridControllerData<U>,
    gridDynpropsString: string,
    defaultProps: any = [],
    breakBy: string[] = []
  ) {
    this.gridData = data;
    if (controllerData) {
      this.gridControllerData = controllerData;
      controllerData.splice(0, controllerData.length);
      const gridDynprops = gridDynpropsString ? JSON.parse(gridDynpropsString) : [];
      for (let i = 0; i < this.gridData.length; i++) {
        const itemDynprops = gridDynprops.length > i ? JSON.parse(gridDynprops[i]) : [];
        const element = this.createDataElement<U>(
          defaultProps,
          itemDynprops,
          this.gridItemType
        );
        this.breakBy(data[i], breakBy, element);
        if (this.nestedGrids) {
          for (const def of this.nestedGrids) {
            def.controller.loader(
              data[i][def.dataModelName],
              element[def.uiModelName],
              this.getSDTDynprops(def.id, itemDynprops),
              this.gridDef.uiModelDefaultsFn(this.gridName),
              null,
              null
            );
          }
        }
        controllerData.push(element);
      }
    }
    this.gridData.forEach((item, index) => {
      if (typeof item === "object") {
        item[gxRowNumberId] = index;
      }
    });
  }

  getSDTDynprops(gridId, dynprops) {
    if (dynprops) {
      for (const prop of dynprops) {
        if (prop[0] == gridId && prop[1] == "Gxprops") {
          return prop[2];
        }
      }
    }
    return null;
  }

}

export class DataGridController<
  D,
  U extends UIListElementItem
> extends GridDataset<D, U> {

  dataFetchStrategy: IFetchStrategy<U> = new PagedFetchStrategy<U>();

  loader = (dataModel, uiModel, dynprops, defaults, response, event, breakBy) => {
    this.loadController(
      dataModel,
      uiModel.length,
      uiModel,
      defaults,
      breakBy
    );
    const gridPagingState = {
      gridCurrentRecordStart: uiModel.start,
      gridCurrentRecordCount: dataModel.length,
      gridRowsPerPage: this.gridDef.gridRowsPerPage,
      gridHasNextPage: response.metadata.hasNextPage,
      gridTotalRecordCount: response.metadata.recordCount,
      gridTotalRecordCountSupported: response.metadata.recordCountSupported,
      loadingState: UIListLoadingState.loaded,
      event: event
    }
    this.dataFetchStrategy.updateState(this.gridControllerData, gridPagingState);
  }

  loadController(
    data: GxCollectionData<any>,
    from: number,
    controllerData = null,
    defaultProps: any = [],
    breakBy: string[] = []
  ) {
    this.gridData = data;
    if (controllerData) {
      this.gridControllerData = controllerData;
      for (let i = from; i < data.length; i++) {
        const dynProps = this.getElementDynprops(data[i]);
        const element = this.createDataElement<U>(
          defaultProps,
          dynProps,
          this.gridItemType
        );
        this.breakBy(data[i], breakBy, element);
        if (this.nestedGrids) {
          for (const def of this.nestedGrids) {
            def.controller.loader(
              data[i][def.dataModelName],
              element[def.uiModelName],
              this.getSDTDynprops(def.id, data[i]),
              this.gridDef.uiModelDefaultsFn(this.gridName),
              null,
              null
            );
          }
        }
        controllerData.push(element);
      }
    }
    this.gridData.forEach((item, index) => {
      if (typeof item === "object") {
        item[gxRowNumberId] = index;
      }
    });
  }

  getElementDynprops(dataItem) {
    const dynpropsElement = dataItem.Gxdynprop ? dataItem.Gxdynprop : "[]";
    dataItem.Gxdynprop = null; // Reset to prevent reloading on state recovery
    return JSON.parse(dynpropsElement);
  }

  getSDTDynprops(gridId, dataElement) {
    const gridPropToApply = dataElement["Gxprops_" + gridId.toLowerCase()];
    return gridPropToApply ? gridPropToApply : "[]";
  }
}

export class DataGridLevelController<
  D,
  U extends UIListElementItem
> extends DataGridController<D, U> {

  dataFetchStrategy: IFetchStrategy<U> = new FullFetchStrategy<U>();

  loader = (dataModel, uiModel, dynprops, defaults, response, event, breakBy) => {
    this.loadController(
      dataModel,
      0,
      uiModel,
      defaults,
      breakBy
    );
    const gridPagingState = {
      gridCurrentRecordStart: 0,
      gridRowsPerPage: this.gridDef.gridRowsPerPage,
      gridTotalRecordCount: dataModel.length
    };
    this.dataFetchStrategy.updateState(this.gridControllerData, gridPagingState);
  }

}

interface IFetchStrategy<U> {
  uiPagingType: UIListPagingType;
  updateState(controllerData: GridControllerData<U>, pagingData);
}

class PagedFetchStrategy<U> implements IFetchStrategy<U> {

  uiPagingType: UIListPagingType = UIListPagingType.infinite;

  updateState(controllerData: GridControllerData<U>, gridPagingState) {
    this.updatePagingData(
      controllerData,
      gridPagingState.gridCurrentRecordStart,
      gridPagingState.gridCurrentRecordCount,
      gridPagingState.gridRowsPerPage,
      gridPagingState.gridHasNextPage,
      gridPagingState.gridTotalRecordCount,
      gridPagingState.gridTotalRecordCountSupported,
      gridPagingState.loadingState,
      gridPagingState.event
    );
  }

  updatePagingData(
    controllerData: GridControllerData<U>,
    gridCurrentRecordStart: number,
    gridCurrentRecordCount: number,
    gridRowsPerPage: number,
    gridHasNextPage: boolean,
    gridTotalRecordCount: number,
    gridTotalRecordCountSupported: boolean,
    loadingState: UIListLoadingState,
    event: any
  ) {
    if (this.uiPagingType == UIListPagingType.infinite) {
      // Check if the record count did change
      controllerData.dataState =
        controllerData.count === gridCurrentRecordCount
          ? UI_LIST_DATA_STATE.allRecordsLoaded
          : UI_LIST_DATA_STATE.moreDataToFetch;

      controllerData.start = gridCurrentRecordCount;
      controllerData.count = gridCurrentRecordCount;

      controllerData.hasNextPage = !!gridHasNextPage;
      controllerData.allRecordsLoaded = gridCurrentRecordStart == 0 && !gridHasNextPage;

      controllerData.loadingState = loadingState;

      if (event?.target?.complete) {
        event.target.complete();
      }

    } else if (this.uiPagingType == UIListPagingType.pages) {
      controllerData.start =
        gridCurrentRecordStart >= 0
          ? gridCurrentRecordStart
          : gridTotalRecordCount - gridCurrentRecordCount;
      controllerData.count = gridCurrentRecordCount;
      controllerData.allRecordsLoaded = gridCurrentRecordStart == 0 && !gridHasNextPage;

      controllerData.currentPage = Math.ceil((controllerData.start + 1) / gridRowsPerPage);
      controllerData.rowsPerPage = gridRowsPerPage;
      controllerData.hasNextPage = !!gridHasNextPage;
      if (controllerData.allRecordsLoaded) {
        controllerData.startRecordPage = controllerData.start;
        controllerData.endRecordPage = controllerData.start + controllerData.rowsPerPage;
        controllerData.totalPages = Math.ceil(gridCurrentRecordCount / gridRowsPerPage);
      } else {
        controllerData.startRecordPage = 0;
        controllerData.endRecordPage = controllerData.rowsPerPage;
        controllerData.totalPages = gridTotalRecordCount
          ? Math.ceil(gridTotalRecordCount / gridRowsPerPage)
          : -1;
      }

      controllerData.recordCountSupported = gridTotalRecordCountSupported;
      controllerData.loadingState = loadingState;
    }
  }
}

class FullFetchStrategy<U> implements IFetchStrategy<U> {
  uiPagingType: UIListPagingType = UIListPagingType.infinite;

  updateState(controllerData: GridControllerData<U>, gridPagingState) {
    this.updatePagingLevel(
      controllerData,
      gridPagingState.gridCurrentRecordStart,
      gridPagingState.gridRowsPerPage,
      gridPagingState.gridTotalRecordCount
    );
  }

  updatePagingLevel(
    controllerData: GridControllerData<U>,
    gridCurrentRecordStart: number,
    gridRowsPerPage: number,
    gridTotalRecordCount: number
  ) {
    if (this.uiPagingType == UIListPagingType.pages) {
      controllerData.start =
        gridCurrentRecordStart >= 0
          ? gridCurrentRecordStart
          : gridRowsPerPage * Math.ceil(gridTotalRecordCount / gridRowsPerPage) - gridRowsPerPage;
      controllerData.count = gridRowsPerPage;
      controllerData.rowsPerPage = gridRowsPerPage;
      controllerData.startRecordPage = controllerData.start;
      controllerData.endRecordPage = controllerData.start + controllerData.rowsPerPage;
      controllerData.currentPage = Math.ceil((controllerData.start + 1) / gridRowsPerPage);
      controllerData.totalPages = Math.ceil(gridTotalRecordCount / gridRowsPerPage);
      controllerData.hasNextPage =
        gridCurrentRecordStart + gridRowsPerPage > gridTotalRecordCount;
      controllerData.allRecordsLoaded = true;
    }
  }
}