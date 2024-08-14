export class NavigationEvent {
  type: string;
  id: number;
  uri: string;
  trigger: string;

  navigationCommand: any;
  outlet: string;
  restoredId: number;
  stackBehavior: string;

  nvgExtras: any;
  appExtras: any;

  fromActionIID: number;
  fromActionId: number;
  fromActionOutlet: string;

}