export interface IUIDashboardElement {

  class: string;
  caption: string;
  visible: boolean;
  image: string

}

export class UIDashboardElement implements IUIDashboardElement {

  class = null;
  caption = null;
  visible = null;
  image = null;

}

