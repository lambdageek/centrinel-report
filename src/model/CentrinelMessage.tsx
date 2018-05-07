// Centrinel message format JSON blobs

import { TranslationUnitMessage,
         isTranslationUnitMessage,
         tumFullPath,
       } from './CentrinelMessage/TranslationUnitMessage';

export type TranslationUnitMessageOpt = TranslationUnitMessage | {};

export function keyForTranslationUnitMessage (tum: TranslationUnitMessageOpt, i: number): string {
  if (isTranslationUnitMessage (tum)) {
    return tumFullPath (tum);
  } else {
    return i.toString();
  }
}
