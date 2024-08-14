export interface ITableElement {
  class: string;
  visible: boolean;
  enabled: boolean;
}

export class UITableElement implements ITableElement {
  class = null;
  visible = null;
  enabled = null;
}
