import { UIEditElement } from "./ui-edit";

export interface ITimerElement {
  state: string;
  maxValue: number | null;
  maxValueText: string | null;
  interval: number | null;
}

export class UITimerElement extends UIEditElement implements ITimerElement {
  onTickAction = null;
  state = "stopped";
  maxValue = null;
  maxValueText = null;
  interval = null;

  start() {
    this.state = "running";
  }

  stop() {
    this.state = "stopped";
  }

  reset() {
    this.state = "reset";
  }
}
