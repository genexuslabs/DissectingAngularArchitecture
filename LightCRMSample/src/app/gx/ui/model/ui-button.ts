import { GxImage } from "@genexus/web-standard-functions/dist/lib-esm/types/gximage";
import { Subject } from "rxjs";

export interface IButtonElement {
  id?: string;
  class?: string;
  caption?: string;
  visible?: boolean;
  enabled?: boolean;
  icon?: GxImage;
  priority?: string;
  BadgeText?: string;
  slotName?: string

  onClick: () => void;
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

  id: string = null;
  class: string = null;
  caption: string = null;
  visible: boolean = null;
  enabled: boolean = null;
  icon: GxImage = null;
  priority: string = null;
  BadgeText: string;
  slotName: string

  onClick: () => void;

  propertyChange: Subject<UIButtonElement>;
}
