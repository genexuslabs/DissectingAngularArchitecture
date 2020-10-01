export class NavigationEvent {
  type: string;
  id: number;
  uri: string;
  trigger: string;

  navigationCommand: any;
  outlet: string;
  restoredId: number;

  nvgExtras: any;
  appExtras: any;

}