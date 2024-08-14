export interface IEditElement {
  class: string;
  caption: string;
  visible: boolean;
  enabled: boolean;
  isPassword: boolean;
  gxvalue: string;
}

export class UIEditElement implements IEditElement {
  class = null;
  caption = null;
  visible = null;
  enabled = null;
  isPassword = null;
  gxvalue = null;

  setfocus() {
    console.warn("setFocus not implemented");
  }
}