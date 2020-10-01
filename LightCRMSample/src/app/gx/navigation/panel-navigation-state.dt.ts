import { ActionState } from "app/gx/base/action-state.dt";

export class PanelNavigationState {
    iid: number;
    nid:number;
    outlet: string;
    navigationCommand: any;
    fromAction: ActionState;
  }