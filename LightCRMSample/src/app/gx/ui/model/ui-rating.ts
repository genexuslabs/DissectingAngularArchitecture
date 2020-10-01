import { UIEditElement } from './ui-edit';

export interface IRatingElement {
  maxValue: number;
  step: number;
}

export class UIRatingElement extends UIEditElement implements IRatingElement {
  maxValue = 5;
  step = 1;


  setControlValueChangedAction(action: any) {
    this.onControlValueChangedAction = action;
  }

  onControlValueChanged(eventInfo: any) {
    this.onControlValueChangedAction(eventInfo);
  }

}