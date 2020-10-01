import { Subject } from "rxjs";

export interface IButtonElement {
  id?: string;
  class?: string;
  caption?: string;
  visible?: boolean;
  enabled?: boolean;
  iconSrc?: string;
  priority?: string;

  BadgeText?: string;

  onClick?: (eventInfo: any) => void;

  setClickAction?: (action: any) => void;
}

export class UIButtonElement implements IButtonElement {
  constructor() {
    this.propertyChange = new Subject<UIButtonElement>();

    const handlePropertySet = (
      target: UIButtonElement,
      prop: keyof UIButtonElement,
      value: any
    ) => {
      (target[prop] as any) = value;
      target.propertyChange.next(target);
      return true;
    };

    return new Proxy(this, {
      set: handlePropertySet,
    });
  }

  id = null;
  class = null;
  caption = null;
  visible = null;
  enabled = null;
  iconSrc = null;
  priority = null;

  BadgeText: string;

  onClickAction = null;

  onClick(eventInfo: any) {
    eventInfo.stopPropagation();
    this.onClickAction();
  }

  setClickAction(action: any) {
    this.onClickAction = action;
  }

  propertyChange: Subject<UIButtonElement>;
}
