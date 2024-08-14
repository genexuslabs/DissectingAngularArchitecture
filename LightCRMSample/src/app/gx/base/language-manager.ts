import { ClientStorage } from 'app/gx/std/client-storage';
import { Settings } from 'app/app.settings';

export class LanguageManager {

  static getCurrentLanguage() {
    return ClientStorage.Get('gx.APP.language') || '';
  }

  static setCurrentLanguage(lang: string) {
    // Normalize name
    for (const l of Settings.applicationLanguages) {
      if (l.name.toLowerCase() === lang.toLowerCase()) {
        ClientStorage.Set('gx.APP.language', l.gxName);
        return;
      }
    }
    ClientStorage.Set('gx.APP.language', lang);
  }
}

export class ApplicationLanguageDefinition {
  name: string;
  gxName: string;
  isRightToLeft: boolean;
  dateFormat: string;
  timeFormat: number;
}