import { Injectable } from '@angular/core';
import { publish as gxPublish, subscribe as gxSubscribe, unSubscribe as gxUnSubscribe } from '@genexus/web-standard-functions/dist/lib-esm/web/GlobalEvents';
import EventSubscription from '@genexus/web-standard-functions/dist/lib-esm/pubSub/pubSubscription';

@Injectable({
  providedIn: 'root',
})

export class GlobalEvents {

  subscribe(eventName: string, event: Function): EventSubscription {
    return gxSubscribe(eventName.toLowerCase(), event);
  }

  unsubscribe(eventSubscription: EventSubscription) {
    gxUnSubscribe(eventSubscription);
  }

  async publish(eventName: string, ...parameters: any[]) {
    return gxPublish.apply(this, [eventName.toLowerCase()].concat(parameters));
  }

}
