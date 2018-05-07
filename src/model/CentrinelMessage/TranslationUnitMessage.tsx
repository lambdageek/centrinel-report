import { Message } from './Message';

export interface TranslationUnitMessage {
  readonly workingDirectory: string;
  readonly translationUnit: string;
  readonly message: Message;
}

export function isTranslationUnitMessage (m: TranslationUnitMessage | {}): m is TranslationUnitMessage {
  return (m as TranslationUnitMessage).workingDirectory !== undefined &&
    (m as TranslationUnitMessage).translationUnit !== undefined &&
    (m as TranslationUnitMessage).message !== undefined;
}

export function tumFullPath(tum: TranslationUnitMessage): string {
  return tum.translationUnit === '' ? 'Translation unit' : (tum.workingDirectory + '/' + tum.translationUnit);
}
