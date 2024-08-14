import { UIUserControlBaseElement } from "app/gx/ui/model/ui-usercontrol-base";

export interface IGeneXusUnanimo__AlertAngularElement {
  Type: string;
  Title: string;
  Message: string;
  Position: string;
  ShowMultiple: boolean;
  Count: number;
  onClose(eventInfo: any);
  set_CloseAction(action: any);
}

export class UIGeneXusUnanimo__AlertAngularElement extends UIUserControlBaseElement implements IGeneXusUnanimo__AlertAngularElement {
  Type: string;
  Title: string;
  Message: string;
  Position: string;
  ShowMultiple: boolean;
  Count: number;

  constructor() {
    super();
    this.Type = "info";
    this.Title = "";
    this.Message = "";
    this.Position = null;
    this.ShowMultiple = false;
    this.Count = 0;
  }
  _CloseAction = null;

  onClose(eventInfo: any) {
    eventInfo.stopPropagation();
    this._CloseAction();
  }

  set_CloseAction(action: any) {
    this._CloseAction = action;
  }
}
