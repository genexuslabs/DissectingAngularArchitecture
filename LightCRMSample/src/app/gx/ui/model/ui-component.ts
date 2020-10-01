export interface IComponentElement {

  class: string;
  visible: boolean;

  object: string;

  clear();
  refresh();

  setRefreshAction(action: any);
}

export class UIComponentElement implements IComponentElement {

  class = null;
  visible = null;
  object = null;

  onRefreshAction: any;

  clear() {
    this.object = null;
  }

  refresh() {
    this.object = null;
  }

  setRefreshAction(action: any) {
    this.onRefreshAction = action;
  }
}