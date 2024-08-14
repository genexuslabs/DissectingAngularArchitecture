export interface ITabElement {
  class: string;
  visible: boolean;
  enabled: boolean;
  pages: Array<ITabPageElement>;
  activePage: number;

  select(page: number);
}

export class UITabElement implements ITabElement {
  class = null;
  visible = null;
  enabled = null;
  pages = new Array<ITabPageElement>();

  private _activePage = 0;
  get activePage(): number {
    return this._activePage;
  }

  set activePage(ix: number) {
    for (let i = 0; i < this.pages.length; i++) {
      if (i === ix - 1) {
        this.pages[i].selected = true;
        this.pages[i].active = true;
      } else {
        this.pages[i].selected = false;
      }
    }
    this._activePage = ix;
  }

  select(ix: number) {
    this.activePage = ix;
  }
}

export interface ITabPageElement {
  class: string;
  selectedClass: string;
  caption: string;
  visible: boolean;
  enabled: boolean;

  selected: boolean;
  active: boolean;
}

export class UITabpageElement implements ITabPageElement {
  class = null;
  selectedClass = null;
  caption = null;
  visible = null;
  enabled = null;

  selected = false;
  active = false;

  _parent = null;

  set parent(parent: ITabElement) {
    parent.pages.push(this);
    this._parent = parent;
  }
  get parent() {
    return this._parent;
  }
}
