import { chooseImage } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/photoLibrary/chooseImage';
import { chooseImages } from '@genexus/web-standard-functions/dist/lib-esm/gxcore/sd/media/photoLibrary/chooseImages';
import { AppContainer } from 'app/gx/base/app-container';
import { GxImage } from '@genexus/web-standard-functions/dist/lib-esm/types/gximage';
import { GxCollectionData } from 'app/gx/base/gxcollection.dt';
import { ISerializable } from "@genexus/web-standard-functions/dist/lib-esm/types/type-serialization";

export class GeneXus__SD__Media__PhotoLibrary {
  static async chooseImage(app: AppContainer): Promise<GxImage> {
    const file = await chooseImage();
    if (file) {
      const fileURL = app.uriCacheService.store(file);
      return app.createImageFromURL(fileURL)
    }
    return new GxImage();
  }

  static async chooseImages(app: AppContainer): Promise<GxCollectionData<IGxImagesCollectionItem>> {
    const files = await chooseImages();
    const arrayImages = []
    for (let i = 0; i < files.length; i++) {
      if (files[i]) {
        const fileURL = app.uriCacheService.store(files[i]);
        arrayImages.push({ Image: app.createImageFromURL(fileURL) });

      }
    }
    return GxCollectionData.fromArray<IGxImagesCollectionItem>(arrayImages);
  }
}

interface IGxImagesCollectionItem extends ISerializable {
  Image: GxImage;
  toJson(): string;
  fromJson(json: string);
  initialize();
}
