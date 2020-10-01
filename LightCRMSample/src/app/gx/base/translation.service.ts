import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Settings } from "./../../app.settings";

@Injectable({
  providedIn: "root"
})
export class TranslationService {
  constructor(private http: HttpClient) { }

  translations: { [id: string]: string } = {};
  images: { [id: string]: string } = {};
  loadedTranslations: { [id: string]: boolean } = {};
  loadedImages: { [id: string]: boolean } = {};

  async load(language: string) {
    await this.loadTranslations(language);
  }

  async loadTranslations(language: string) {
    if (!this.loadedTranslations[language]) {
      try {
        let response = await this.http
          .get(`translations/${language}.json`)
          .toPromise();
        const data = response as TranslationsData;
        data.Translations.forEach(t => (this.translations[t.M] = t.T));
        this.loadedTranslations[language] = true;
      } catch (e) {
        console.log(
          `Could not load translations definition for ${language}`,
          e
        );
      }
    }
  }

  translate(name: string): string {
    if (this.translations[name] !== undefined) {
      return this.translations[name];
    } else {
      return name;
    }
  }
}

export class TranslationsData {
  Translations: TranslationsItemData[];
}

export class TranslationsItemData {
  M: string;
  T: string;
}