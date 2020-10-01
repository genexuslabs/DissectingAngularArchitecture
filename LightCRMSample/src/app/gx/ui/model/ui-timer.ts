import { UIEditElement } from './ui-edit';

export interface ITimerElement {
  state: string;  
  maxValue: number;
  maxValueText: string;
  
  onTick(eventInfo: any);

  start();
  stop();
  reset();

  setTickAction(action: any);

}


export class UITimerElement extends UIEditElement implements ITimerElement {
  onTickAction = null;
  state = 'stopped';  
  maxValue = null;
  maxValueText =  null;
  
  onTick(eventInfo: any) {
    if (this.onTickAction) {
      this.onTickAction();
    }
  }

  start() {
    this.state = 'running';
  }

  stop() {
    this.state = 'stopped';
  }

  reset() {
    this.state = 'reset';
  }

  setTickAction(action: any) {
    this.onTickAction = action;
  }
}