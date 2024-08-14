export interface IImageElement {
  class: string;
  caption: string;
  visible: boolean;
  enabled: boolean;
}

export class UIImageElement implements IImageElement {
  class = null;
  caption = null;
  visible = null;
  enabled = null;
}
