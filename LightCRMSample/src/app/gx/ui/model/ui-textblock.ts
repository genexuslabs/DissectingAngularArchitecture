export interface ITextblockElement {
  class: string;
  caption: string;
  visible: boolean;
  enabled: boolean;
}

export class UITextblockElement implements ITextblockElement {
  class = null;
  caption = null;
  visible = null;
  enabled = null;
}
