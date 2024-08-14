import { UISelectElement } from "./ui-select";

export class UISelectController {
  data: any;
  uiModel: UISelectElement;

  optionsLoader: any;

  constructor(optionsLoader = null) {
    this.optionsLoader = optionsLoader;
  }

  setState(data: any, uiModel: UISelectElement = null) {
    this.data = data;
    this.uiModel = uiModel;
  }
  clear() {
    this.uiModel.items.length = 0;
  }
  addItem(code, description) {
    this.uiModel.items.push([code, description]);
  }

  removeItem(value: any) {
    for (let i = 1; i <= this.uiModel.items.Count; i++) {
      if (this.uiModel.items.item(i)[0] === value) {
        this.uiModel.items.remove(i);
        return;
      }
    }
    this.uiModel.items.remove(value);
  }

  async load(...p) {
    if (this.optionsLoader) {
      this.uiModel.items = await this.optionsLoader(...p);
    }
  }

}
