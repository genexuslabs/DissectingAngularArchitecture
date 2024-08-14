import { UISelectController } from "./ui-select-controller";

export class UIHidecodeController extends UISelectController {
  valueLoader: any;

  constructor(valueLoader, optionsLoader = null) {
    super(optionsLoader);
    this.valueLoader = valueLoader;
  }

  async retrieveValue(...p) {
    if (this.valueLoader) {
      return await this.valueLoader(...p);
    }
  }
}
