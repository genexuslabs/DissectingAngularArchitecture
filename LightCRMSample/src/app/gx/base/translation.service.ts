import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Settings } from "./../../app.settings";
import { LanguageManager } from "./language-manager";

@Injectable({
  providedIn: "root",
})
export class TranslationService {

  private http = inject(HttpClient);

  translations: { [id: string]: string } = {};
  images: { [id: string]: string } = {};
  loadedImages: { [id: string]: boolean } = {};
  loadedTranslations: { [language: string]: { [id: string]: string } } = {};

  async load(language: string) {
    const lLanguage = language.toLowerCase()
    this.translations = await this.loadTranslations(lLanguage);
    this.loadedTranslations[lLanguage] = this.translations;
  }

  async loadTranslations(language: string): Promise<{ [id: string]: string }> {
    try {
      const response = await this.http
        .get(`translations/${language}.json`)
        .toPromise();
      const data = response as TranslationsData;
      const translations = {};
      data.Translations.forEach((t) => (translations[t.M] = t.T));
      return translations;
    } catch (e) {
      console.log(`Could not load translations definition for ${language}`, e);
      return {};
    }
  }

  translate(name: string): string {
    return this.translateText(this.translations, name);
  }

  async getMessageText(name: string, language?: string): Promise<string> {
    const lLanguage = language?.toLowerCase()
    if (lLanguage && lLanguage !== LanguageManager.getCurrentLanguage()?.toLowerCase()) {
      await this.ensureTranslations(lLanguage);
      const translations = this.loadedTranslations[lLanguage.toLowerCase()];
      return this.translateText(translations, name);
    } else {
      return this.translateText(this.translations, name);
    }
  }

  async ensureTranslations(language: string) {
    if (!this.loadedTranslations[language]) {
      this.loadedTranslations[language] = await this.loadTranslations(language);
    }
  }

  translateText(translations: { [id: string]: string }, name: string): string {
    if (translations && translations[name] !== undefined) {
      return translations[name];
    } else {
      return name;
    }
  }

  getLanguageDirection(language: string): "ltr" | "rtl" {
    for (const appLanguage of Settings.applicationLanguages) {
      if (appLanguage.name.toLowerCase() === language.toLowerCase()) {
        return appLanguage.isRightToLeft ? "rtl" : "ltr";
      }
    }

    return "ltr";
  }
}

export class TranslationsData {
  Translations: TranslationsItemData[];
}

export class TranslationsItemData {
  M: string;
  T: string;
}
