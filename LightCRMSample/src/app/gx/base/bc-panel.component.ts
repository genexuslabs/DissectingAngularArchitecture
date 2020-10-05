import { Directive } from '@angular/core';
import { PanelComponent } from './panel.component';
import { BusinessComponent, BusinessComponentService } from './business-component';
import { msg } from '@genexus/web-standard-functions/dist/lib-esm/misc/msg';


@Directive()
export class BcPanelComponent<D, S extends BusinessComponentService<D>> extends PanelComponent {

  bcInstance: BusinessComponent<D, S>;

  async initBC(defaultBc, ...args: any[]) {
    if (this.Mode === 'INS') {
      await this.bcInstance.initialize(defaultBc);
    } else {
      await this.bcInstance.load(...args);
    }
    this.bcToEntity();
  }

  async loadBC(...args: any[]) {
    if (this.Mode === 'INS') {
      await this.bcInstance.initialize();
    } else {
      await this.bcInstance.load(...args);
    }
    this.bcToEntity();
  }

  async saveBC() {
    this.entityToBc();
    try {
      if (this.Mode === 'DLT') {
        await this.bcInstance.delete();
        await msg(this.translate('GXM_sucdeleted'), 'status');
      } else if (this.Mode === 'INS') {
        await this.bcInstance.insert();
        await msg(this.translate('GXM_sucadded'), 'status');
      } else {
        await this.bcInstance.update();
        await msg(this.translate('GXM_sucupdated'), 'status');
      }
    }
    catch (error) {
      await msg(error.message);
      throw new Error(error);
    }
  }

  entityToBc(): void {
  }

  bcToEntity(): void {
  }
}
