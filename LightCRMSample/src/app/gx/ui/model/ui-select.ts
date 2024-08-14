import { UIEditElement } from "./ui-edit";
import { GxCollectionData } from "app/gx/base/gxcollection.dt";

export interface ISelectElement {
}

export class UISelectElement extends UIEditElement implements ISelectElement {
  items = new GxCollectionData<[[], []]>();
}
