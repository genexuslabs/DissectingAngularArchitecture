import { UIEditElement } from "./ui-edit";

export interface IRatingElement {
  maxValue: number;
  step: number;
}

export class UIRatingElement extends UIEditElement implements IRatingElement {
  maxValue = null;
  step = null;
}
