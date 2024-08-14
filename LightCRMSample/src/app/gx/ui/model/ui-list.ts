import { ObjectValues } from "app/gx/types/utils";

export interface IListElement {
  class: string;
  visible: boolean;
  enabled: boolean;
  currentItem: any;
}

export interface IListSelectableElement {
  SelectedIndex: number;
}

export interface IListPagedElement {
  currentPage: number;
}

export const UI_LIST_DATA_STATE = {
  initial: "initial",
  moreDataToFetch: "more-data-to-fetch",
  allRecordsLoaded: "all-records-loaded",
} as const;

export type UIListDataState = ObjectValues<typeof UI_LIST_DATA_STATE>;

export enum UIListLoadingState {
  loading = "loading",
  loaded = "loaded",
}

export enum UIListPagingType {
  infinite = "infinite",
  pages = "pages",
}

export class UIListElement
  implements IListElement, IListPagedElement, IListSelectableElement
{
  class = null;
  visible = null;
  enabled = null;
  currentItem: any;

  SelectedIndex = 0;

  scrollDirection: string;
  itemSelectedLayout: string;

  defaultLayoutName = null;
  columnsPerPagePortrait = null;
  rowsPerPagePortrait = null;
  columnsPerPageLandscape = null;
  rowsPerPageLandscape = null;

  loadingState: UIListLoadingState = UIListLoadingState.loading;

  currentPage = 1;
  recordCount = 0;
  count = 0;
  start = 0;

  load() {}
}

export class UIListElementItem {
  public Itemlayout = "";
  public Selected = false;
  public Break = false;
}
