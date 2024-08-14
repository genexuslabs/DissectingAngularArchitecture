export interface ILayoutGroupElement {
  caption: string;
  class: string;
  visible: boolean;
  enabled: boolean;
}

export class UILayoutGroupElement implements ILayoutGroupElement {
  caption = null;
  class = null;
  visible = null;
  enabled = null;
}
