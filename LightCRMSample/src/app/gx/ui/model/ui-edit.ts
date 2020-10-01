export interface IEditElement {

  class: string;
  caption: string;
  visible: boolean;
  enabled: boolean;

  onDoubleclick(eventInfo: any);
  onClick(eventInfo: any);

  setClickAction(action: any);
  setDoubleclickAction(action: any);
  setLongclickAction(action: any);
  setSwipeAction(action: any);
  setSwipeleftAction(action: any);
  setSwiperightAction(action: any);
  setSwipedownAction(action: any);
  setSwipeupAction(action: any);

  onControlValueChanged(eventInfo: any);
  onControlValueChanging(eventInfo: any);

  setControlValueChangedAction(eventInfo: any);
  setControlValueChangingAction(eventInfo: any);

  setDragAction(action: any);
  setDropAction(action: any);
  setDropAcceptedAction(action: any);
  setDragCanceledAction(action: any);

}


let clickPending = false;

export class UIEditElement implements IEditElement {

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

  setLongclickAction(action: any) {
    // TODO
  }

  setSwipeAction(action: any) {
    // TODO
  }

  setSwipeleftAction(action: any) {
    // TODO
  }

  setSwiperightAction(action: any) {
    // TODO
  }

  setSwipedownAction(action: any) {
    // TODO
  }

  setSwipeupAction(action: any) {
    // TODO
  }

  onControlValueChangedAction = null;
  onControlValueChangingAction = null;

  onControlValueChanged(eventInfo: any) {
    if (this.onControlValueChangedAction) {
      if (typeof(eventInfo.stopPropagation) === 'function') {
        eventInfo.stopPropagation();
      }
      this.onControlValueChangedAction();
    }
  }

  onControlValueChanging(eventInfo: any) {
    if (this.onControlValueChangingAction) {
      this.onControlValueChangingAction();
    }
  }

  setControlValueChangedAction(action: any) {
    this.onControlValueChangedAction = action;
  }
  setControlValueChangingAction(action: any) {
    this.onControlValueChangingAction = action
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

  setfocus() {
    // TODO
  }

}
