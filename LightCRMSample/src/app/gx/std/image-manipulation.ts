import { rotate } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/rotate';
import { resize } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/resize';
import { scale } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/scale';
import { crop } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/crop';
import { flipHorizontally } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/flipHorizontally';
import { flipVertically } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/flipVertically';
import { imageWidth } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/imageWidth';
import { imageHeight } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/imageHeight';
import { fileSize } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/imageManipulation/fileSize';

import { AppContainer } from 'app/gx/base/app-container';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';


export class ImageManipulation {

  static async imageWidth(image: GxImage): Promise<number> {
    return await imageWidth(image) as number;
  }

  static async imageHeight(image: GxImage): Promise<number> {
    return await imageHeight(image) as number
  }

  static async fileSize(image: GxImage): Promise<number> {
    return await fileSize(image) as number;
  }

  static async resize(image: GxImage, width, height, Keepaspectboolean, app: AppContainer): Promise<GxImage> {

    const file = await resize(image, width, height, Keepaspectboolean);

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();
  }

  static async scale(image: GxImage, percentage, app: AppContainer): Promise<GxImage> {

    const file = await scale(image, percentage);

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();
  }


  static async rotate(image: GxImage, angle, app: AppContainer): Promise<GxImage> {

    const file = await rotate(image, angle);

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();
  }

  static async crop(image: GxImage, left, top, width, height, app: AppContainer): Promise<GxImage> {

    const file = await crop(image, left, top, width, height);

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();
  }

  static async flipHorizontally(image: GxImage, app: AppContainer): Promise<GxImage> {

    const file = await flipHorizontally(image);

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();
  }

  static async flipVertically(image: GxImage, app: AppContainer): Promise<GxImage> {

    const file = await flipVertically(image);

    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();
  }


}