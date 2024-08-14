import { Pipe, PipeTransform, inject } from "@angular/core";

import { AppContainer } from "../base/app-container";
import { GxVideo } from "@genexus/web-standard-functions/dist/lib-esm/types/gxvideo";

@Pipe({
  name: 'videoToURL',
  standalone: true
})
export class VideoToURLPipe implements PipeTransform {

  private app = inject(AppContainer);

  transform(video: GxVideo, context: any): string {
    return this.app.videoToURL(video);
  }
}