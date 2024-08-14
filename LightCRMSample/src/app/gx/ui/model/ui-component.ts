export interface IComponentElement {
  class: string;
  visible: boolean;
  object: string;
}  

export class UIComponentElement implements IComponentElement {
  class = null;
  visible = null;
  object = null;
}
