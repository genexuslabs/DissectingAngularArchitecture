export interface IImageElement {

  class: string;
  caption: string;
  visible: boolean;
  enabled: boolean;

  onDoubleclick(eventInfo: any);
  onClick(eventInfo: any);

  setClickAction(action: any);
  setDoubleclickAction(action: any);

  setDragAction(action: any);
  setDropAction(action: any);
  setDropAcceptedAction(action: any);
  setDragCanceledAction(action: any);


}

let clickPending = false;

export class UIImageElement implements IImageElement {

  class = null;
  caption = null;
  visible = null;
  enabled = null;

  onClickAction = null;
  onDoubleclickAction = null;

  async onDoubleclick(eventInfo: any) {
    eventInfo.stopPropagation();
    if (this.onDoubleclickAction) {
      clickPending = false;
      await this.onDoubleclickAction();
    }
  }

  onClick(eventInfo: any) {
    eventInfo.stopPropagation();
    if (this.onClickAction) {
      clickPending = true;
      setTimeout(() => {
        if (clickPending) {
          this.onClickAction();
        }
      }, 250);
    }
  }

  setClickAction(action: any) {
    this.onClickAction = action;
  }

  setDoubleclickAction(action: any) {
    this.onDoubleclickAction = action;
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

