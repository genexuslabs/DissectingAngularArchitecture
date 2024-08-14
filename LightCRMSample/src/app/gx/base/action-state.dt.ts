import { PanelNavigationState } from "app/gx/navigation/panel-navigation-state.dt";

export class ActionState {

  actionId: number;           // unique action id 
  iid: number;                // instance id of the component running the action
  nid: number;

  navigationState: PanelNavigationState;

  static create(name: string, navigation: PanelNavigationState, iid: number): ActionState {
    const act = new ActionState();
    act.iid = iid;
    act.navigationState = navigation;
    return act;
  }
}
