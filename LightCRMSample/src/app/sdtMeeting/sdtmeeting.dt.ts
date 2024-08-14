import { TypeConversions } from 'app/gx/base/type-conversion';
import { Std_TypeConversions } from '@genexus/web-standard-functions/dist/lib-esm/types/std-type-conversion';

import { GxSdtData } from 'app/gx/base/gxsdt.dt';

export class sdtMeetingData extends GxSdtData {
  MeetingId: number;


  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    this.MeetingId = 0;

  }

}

 