import { Pipe, PipeTransform, inject } from "@angular/core";

import { AppContainer } from "../base/app-container";
import { GxAudio } from "@genexus/web-standard-functions/dist/lib-esm/types/gxaudio";

@Pipe({
  name: 'audioToURL',
  standalone: true
})
export class AudioToURLPipe implements PipeTransform {

  private app = inject(AppContainer);

  transform(audio: GxAudio, context: any): string {
    return this.app.audioToURL(audio);
  }
}