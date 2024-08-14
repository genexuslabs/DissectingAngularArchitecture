import { takePhoto } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/camera/takePhoto';
import { recordVideo } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/camera/recordVideo';

import { AppContainer } from 'app/gx/base/app-container';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { GxVideo } from '@genexus/web-standard-functions/dist/lib-esm/types/gxvideo';


export class GeneXus__SD__Media__Camera {

  static async takePhoto(app: AppContainer): Promise<GxImage> {

    const file = await takePhoto();

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();

  }

  static async recordVideo(app: AppContainer): Promise<GxVideo> {

    const file = await recordVideo();

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return GxVideo.createVideo(fileURL);
    }
    return new GxVideo();

  }
  
}