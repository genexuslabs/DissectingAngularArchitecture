import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompositeNavigation } from 'app/gx/navigation/composite-navigation';
import { ActionState } from 'app/gx/base/action-state.dt';
import { ComponentsStateManager } from 'app/gx/navigation/navigation-state';

@Component({
  selector: "app-home",
  template: "",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppHome implements OnInit {
  subscriptions = new Subscription();

  private activeState = inject(ComponentsStateManager);
  private nvg = inject(CompositeNavigation);

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
