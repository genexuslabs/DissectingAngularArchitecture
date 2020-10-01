import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { UIProgress } from './progress.service';
@Component({
  selector: 'gx-progress',
  templateUrl: './progress.component.html'
})
export class ProgressComponent implements OnChanges {

  @Input() updateSettings: UIProgress;

  settings = new UIProgress();

  show = false;
  sValue: string;

  constructor() {
  }

  ngOnChanges() {

    if (this.updateSettings) {
      for (let st in this.updateSettings) {
        this.settings[st] = this.updateSettings[st];
      }
      this.sValue = this.settings.value / this.settings.maxValue * 100 + '';
      if (!this.settings.type) {
        this.sValue = "100";
      }
    }
    this.show = this.updateSettings ? true : false;

    if (this.updateSettings && this.updateSettings.callback) {
      setTimeout(() => {
        this.updateSettings.callback(true);
      }, 500);
    }

  }

  openAction() {
  }

  closeAction() {
    this.show = false;
    this.sValue = "0";
    this.settings = {};
  }
}