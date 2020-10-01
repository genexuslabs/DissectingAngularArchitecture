export interface IListElement {
  class: string;
  visible: boolean;
  enabled: boolean;

  currentItem: any;

  onSelect(selectedItem: any, eventInfo: any);
  onPullRelease(eventInfo: any);
  onSelectionChanged(eventInfo: any);

  setSelectAction(action: any);
  setSelectionChangedAction(action: any);
  setPullReleaseAction(action: any);
  setRefreshAction(action: any);

}

export interface IListPagedElement {
  currentPage: number;
  setPageChangedAction(action: any);
  select(page: number);
}

export enum UIListLoadingState {
  loading = "loading",
  loaded = "loaded",
}

export class UIListElement implements IListElement, IListPagedElement {
  class = null;
  visible = null;
  enabled = null;
  defaultLayoutName = null;
  columnsPerPagePortrait = null;

  loadingState: UIListLoadingState = UIListLoadingState.loading;

  currentPage = 1;
  recordCount = 0;
  count = 0;
  start = 0;

  currentItem: any;

  onSelectAction: any;
  onPullReleaseAction: any;
  onRefreshAction: any;
  onSelectionChangedAction: any;
  onPageChangedAction: any;

  onSelect(selectedItem: any, eventInfo: CustomEvent) {
    if (this.onSelectAction) {
      eventInfo.stopPropagation();
      this.currentItem = selectedItem;
      this.onSelectAction();
    }
  }

  onPullRelease(eventInfo: CustomEvent) {
    if (this.onRefreshAction) {
      this.onRefreshAction();
    }
  }

  onSelectionChanged(eventInfo: CustomEvent) {
    // TODO: Bring implementation from selectAction panel.component and add CurrentItem to model
    if (this.onSelectionChangedAction) {
      this.onSelectionChangedAction();
    }
  }

  onPageChanged(eventInfo: CustomEvent) {
    this.currentPage = eventInfo.detail;
    if (this.onPageChangedAction) {
      this.onPageChangedAction();
    }
  }

  setPageChangedAction(action: any) {
    this.onPageChangedAction = action;
  }

  setSelectAction(action: any) {
    this.onSelectAction = action;
  }

  setPullReleaseAction(action: any) {
    this.onPullReleaseAction = action;
  }

  setRefreshAction(action: any) {
    this.onRefreshAction = action;
  }

  setSelectionChangedAction(action: any) {
    this.onSelectionChangedAction = action;
  }

  refresh() {
    if (this.onRefreshAction) {
      this.onRefreshAction();
    }
  }
  load() { }

  select(page: number) {
  }

}

export class UIListElementItem {
  public Itemlayout = "";
  public Selected = false;
  public Break = false;
}
