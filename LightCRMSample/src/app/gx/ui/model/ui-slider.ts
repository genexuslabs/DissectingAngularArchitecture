import { UIEditElement } from "./ui-edit";

export interface ISliderElement {
  maxValue: number;
  minValue: number;
  step: number;
}

export class UISliderElement extends UIEditElement implements ISliderElement {
  maxValue = null;
  minValue = null;
  step = null;
}
