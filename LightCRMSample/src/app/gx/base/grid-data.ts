import { GxCollectionData } from "app/gx/base/gxcollection.dt";
import { UIListLoadingState } from "app/gx/ui/model/ui-list";

export class GridControllerData<U> extends GxCollectionData<U> {
  start = 0;
  count = 0;
  currentPage = 1;
  startRecordPage = 0;
  endRecordPage = 0;
  totalPages = -1;
  rowsPerPage = 0;
  hasNextPage = false;
  allRecordsLoaded = false;
  recordCountSupported = true;
  searchText = "";
  loadingState: UIListLoadingState = UIListLoadingState.loading;
  lastBreakValue: Array<any>;
  dataState = "";

  setType(itemType: { new(): U }): GridControllerData<U> {
    super.setType(itemType);
    return this;
  }
}

export class GridElementData<D, U> {
  data: D;
  uiModel: U;
}

export class LevelConfig<I, C> {
  itemType: { new(): I };
  controllerType: C;

  constructor(it: { new(): I }, ct: C) {
    this.itemType = it;
    this.controllerType = ct;
  }
}
