import { UIActionBarElement } from "app/gx/ui/model/ui-actionbar";

export interface IFormElement {
  caption: string;
  applicationBar: UIActionBarElement;
}

export class UIFormElement implements IFormElement {
  _caption = null;
  applicationBar = new UIActionBarElement();

  get caption() {
    return this._caption;
  }
  set caption(value: string) {
    if (this.applicationBar) {
      this.applicationBar.caption = value;
    }
    this._caption = value;
  }
}
