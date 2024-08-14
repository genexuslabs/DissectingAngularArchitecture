import { Component, Input, OnChanges, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TimerState } from 'app/gx/ui/controls/timer/timer.component';
import { TimerComponent } from '../timer/timer.component';

@Component({
  selector: 'gx-action-group',
  templateUrl: './action-group.component.html',
  styleUrls: ['./action-group.component.scss'],
  standalone: true,
  imports: [TimerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ActionGroupComponent implements OnChanges {

  @Input() show = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  timerState = TimerState.Stopped;

  dismissGroup() {
    this.show = false;
    this.onClose.emit();
  }

  ngOnChanges() {
    if (this.show) {
      this.timerState = TimerState.Running;
    }
    else {
      this.timerState = TimerState.Reset;
    }
  }
}