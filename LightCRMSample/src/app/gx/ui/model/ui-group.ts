export interface IGroupElement {

  class: string;
  caption: string;
  visible: boolean;
  enabled: boolean;

  onClick(eventInfo: any);

  show();
  hide();

  setClickAction(action: any);
  setDragAction(action: any);
  setDropAction(action: any);
  setDropAcceptedAction(action: any);
  setDragCanceledAction(action: any);
}

export class UIGroupElement implements IGroupElement {

  class = null;
  caption = null;
  visible = null;
  enabled = null;

  onClickAction = null;

  onClick(eventInfo: any) {
    this.onClickAction();
  }

  show() {
    this.visible = true;

  }
  hide() {
    this.visible = false;
  }

  setClickAction(action: any) {
    this.onClickAction = action;
  }

  setDragAction(action: any) {
    // TODO
  }

  setDropAction(action: any) {
    // TODO
  }

  setDropAcceptedAction(action: any) {
    // TODO
  }

  setDragCanceledAction(action: any) {
    // TODO
  }

}
