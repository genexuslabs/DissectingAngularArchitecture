import { ActionState } from 'app/gx/base/action-state.dt';
import { PanelNavigationState } from 'app/gx/navigation/panel-navigation-state.dt';

export class NavigationState {
  current = {};

  save(iid: number, comp: IStateContainer) {
    if (comp) {
      const state = {
        _name: comp.constructor.name,
        navigation: comp._navigation
      };
      for (let prop of comp.stateMembers) {
        state[prop] = comp[prop];
      }
      this.current[iid] = state;
    }
  }

  restore(iid: number, comp: IStateContainer): boolean {
    const state = this.current[iid];
    if (state) {
      for (let prop of comp.stateMembers) {
        comp[prop] = state[prop];
      }
      comp._navigation = state.navigation;
      return true;
    }
    return false;
  }

  getInstance( iid: number): IStateContainer {
    return this.current[iid];
  }

}

export interface IStateContainer {
  stateMembers: Array<any>;
  _navigation: PanelNavigationState;
  _outlet: string;
}