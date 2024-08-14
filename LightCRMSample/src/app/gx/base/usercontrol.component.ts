import { inject } from '@angular/core';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { PanelComponent } from './panel.component';
import { CompositeNavigation } from '../navigation/composite-navigation';

export class UserControlComponent {

  _nvg = inject(CompositeNavigation);

  arrayify(value): any[] {
    if (!value) {
      return EMPTY_ARRAY;
    }

    if (value instanceof Array) {
      return value;
    }

    return [value];
  }

  resolveVariable(variableName, context) {
    for (const contextObject of context) {
      if (
        contextObject[variableName] !== undefined &&
        contextObject[variableName] !== null
      ) {
        return contextObject[variableName];
      }
    }

    return undefined;
  }

  getImageFromId(id: string) {
    return GxImage.createFromID(id);

  }

  async dynamicCall(url) {
    const __aSt = PanelComponent.activePanel.startAction();
    const navigationURL = this._nvg.linkToNavigationUrl(url);
    if (navigationURL) {
      await this._nvg.dynamicNavigate(__aSt, navigationURL);
    } else {
      return await this._nvg.link(url);
    }
    this._nvg.endAction(__aSt);
  }
}

const EMPTY_ARRAY = [];
