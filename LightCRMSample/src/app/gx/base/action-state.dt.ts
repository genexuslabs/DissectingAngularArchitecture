import { PanelNavigationState } from "app/gx/navigation/panel-navigation-state.dt";
import { NavigationHelper } from "app/gx/navigation/navigation-helper";

export class ActionState {
  
    actionId: number;           // unique action id 
    iid: number;                // instance id of the component running the action
  
    navigationState: PanelNavigationState;
  
    static create(name:string, navigation: PanelNavigationState): ActionState {
      const act = new ActionState();
      act.iid = NavigationHelper.newComponentInstanceId();
      act.navigationState = navigation;
      return act;
    }
  
  }
  