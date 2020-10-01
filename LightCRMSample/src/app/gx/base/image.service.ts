import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Settings } from "../../app.settings";

@Injectable({
  providedIn: "root"
})
export class ImageService {
  constructor(private http: HttpClient) { }

  images: { [id: string]: string } = {};
  loadedImages: { [id: string]: boolean } = {};

  async load(language: string, theme: string) {
    await this.loadImages(language, theme);
  }

  async loadImages(language: string, theme: string) {
    if (!this.loadedImages[language + theme]) {
      try {
        let response = await this.http
          // TODO: Load images from a specific theme/language definition file
          //.get(`images/images.${theme}.${language}.json`)
          .get(`images/images.json`)
          .toPromise();
        const data = response as ImagesData;
        data.images.forEach(
          t =>
            (this.images[
              this.resolveImageKey(t.name, t.lang, t.theme)
            ] = `${t.location}`)
        );
        this.loadedImages[language + theme] = true;
      } catch (e) {
        console.log(
          `Could not load images definition for ${language}/${theme}`,
          e
        );
      }
    }
  }

  getImageSource(name: string, language: string, theme: string): string {
    const imageUrl = this.getImage(name, language, theme);
    if (imageUrl === "") {
      return "";
    }
    return Settings.WEBAPP_BASE + imageUrl;
  }

  private getImage(name: string, language: string, theme: string): string {
    const imageUrl = this.images[this.resolveImageKey(name, language, theme)];
    if (imageUrl === null || imageUrl === undefined) {
      return "";
    }
    return imageUrl;
  }

  private resolveImageKey(name: string, lang: string, theme: string) {
    return `${name.toLowerCase()}_${lang.toLowerCase()}_${theme.toLowerCase()}`;
  }
}

export class ImagesData {
  images: ImageData[];
}

export class ImageData {
  name: string;
  location: string;
  theme: string;
  lang: string;
}
