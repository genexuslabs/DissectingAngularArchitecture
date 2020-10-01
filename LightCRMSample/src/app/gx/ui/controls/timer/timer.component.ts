import { Component, Input, Output, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';

@Component({
    selector: 'gx-timer',
    templateUrl: './timer.component.html'
})
export class TimerComponent implements OnChanges, OnDestroy {

    @Input() state: string;   // 'running', 'stopped', 'reset'
    @Input() interval = 1;   // interval in seconds
    @Input() maxValue = 0;   // maxVlaue in seconds

    @Output() onTick: EventEmitter<any> = new EventEmitter<any>();;
    @Output() onEnd: EventEmitter<any> = new EventEmitter<any>();;

    timer: any;
    counter: number = 0;

    private timerSubscription: Subscription;

    constructor() {
    }

    ngOnChanges() {
        if (this.state === TimerState.Running) {
            this.startTimer();
        } else if (this.state === TimerState.Stopped) {
            this.stopTimer();
        } else if (this.state === TimerState.Reset) {
            this.stopTimer();
            this.counter = 0;
        }
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    startTimer() {
        if (!this.timer) {
            this.timer = interval(this.interval * 1000);
            this.timerSubscription = this.timer.subscribe(() => {
                this.counter++;
                if (this.maxValue > 0 && this.counter >= this.maxValue) {
                    this.stopTimer();
                    this.onEnd.emit(this.counter);
                }
                this.onTick.emit(this.counter);
            });
        }
    }

    stopTimer() {
        if (this.timer) {
            this.timerSubscription.unsubscribe();
            this.timer = null;
            this.state = TimerState.Stopped;
        }
    }
}

export enum TimerState {
    Running = 'running',
    Stopped = 'stopped',
    Reset = 'reset'
}
