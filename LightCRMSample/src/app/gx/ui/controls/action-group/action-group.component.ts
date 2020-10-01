import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { TimerState } from 'app/gx/ui/controls/timer/timer.component';

@Component({
    selector: 'gx-action-group',
    templateUrl: './action-group.component.html',
    styleUrls: ['./action-group.component.scss']
})
export class ActionGroupComponent implements OnChanges {

    @Input() show = false;
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();;

    timerState = TimerState.Stopped;

    constructor() {
    }

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