import { EventEmitter, Injectable } from '@angular/core';
import { HostInfo } from 'app/gx/base/panel.component';

@Injectable({
  providedIn: "root",
})
export class ComponentsStateManager {

  current = {};

  onStateUpdated = new EventEmitter<number>();

  save(iid: number, comp: IStateContainer) {
    if (comp) {
      const state = {};
      for (const prop of comp.__stateMembers.concat(["__iid", "__panelServiceState"])) {
        state[prop] = comp[prop];
      }
      this.current[iid] = state;
    }
  }

  update(iid: number, comp: IStateContainer) {
    if (comp) {
      const state = this.current[iid];
      if (state) {
        for (const prop of comp.__stateMembers) {
          state[prop] = comp[prop];
        }
        this.onStateUpdated.emit(iid);
      }
    }
  }

  restore(iid: number, comp: IStateContainer): boolean {
    const state = this.current[iid];
    if (state) {
      for (const prop of comp.__stateMembers.concat(["__iid", "__panelServiceState"])) {
        comp[prop] = state[prop];
      }
      return true;
    }
    return false;
  }

  private componentInstanceId = 1;

  newComponentInstanceId() {
    this.restoreState();
    const newInstanceId = this.componentInstanceId++;
    if (newInstanceId > 99999999) {
      this.componentInstanceId = 1;
    }
    this.persistState();
    return newInstanceId;
  }

  private persistState() {
    sessionStorage.setItem('components-state', JSON.stringify({ lastComponentInstance: this.componentInstanceId }));
  }

  private restoreState() {
    const storedComponentState = sessionStorage.getItem('components-state');
    if (storedComponentState) {
      const componentState = JSON.parse(storedComponentState);
      this.componentInstanceId = componentState.lastComponentInstance;
    }
  }

}

export interface IStateContainer {
  __stateMembers: Array<any>;
  __iid;
  __hostInfo: HostInfo;
}