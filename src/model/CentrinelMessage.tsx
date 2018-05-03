// Centrinel message format JSON blobs

import assertNever from './assertNever';
import { CodeZipper,
       } from './CodeZipper';
import { Tagged } from './Tagged';

export interface TranslationUnitMessage {
  readonly workingDirectory: string;
  readonly translationUnit: string;
  readonly message: CentrinelMessage;
}

export type CentrinelMessageNormal = Tagged<'NormalMessages'> & {
  readonly isAbnormal: boolean;
  readonly messages: CentrinelAnalysisMessage[];
};

export type CentrinelMessageToolFail = Tagged<'ToolFailMessage'> & {
  readonly toolFailure: CentrinelToolFail;
};

export type ErrorLevel = 'WARNING' | 'ERROR' | 'FATAL ERROR';

export interface CentrinelAnalysisMessageBase {
  readonly errorLevel: ErrorLevel;
  readonly position: string;
}

export type NakedPointerMessage = Tagged <'nakedPointerMessage'> & CentrinelAnalysisMessageBase & {
  readonly nakedPointerMessage: NakedPointerMessagePayload;
};

export interface NakedPointerMessagePayload {
  readonly inDefinition: boolean;
  readonly victims: NakedPointerVictim[];
}

export interface NakedPointerVictim {
  readonly type: string;
  readonly position: CodeZipper;
}

export type RegionMismatchMessage = Tagged<'regionMismatchMessage'> & CentrinelAnalysisMessageBase & {
  readonly lines: string[];
  readonly regionMismatchMessage: object[];
};

export type CentrinelAnalysisMessage = NakedPointerMessage | RegionMismatchMessage;

export type CentrinelCppToolFail = Tagged<'cppToolFail'> & {
  readonly cppToolFail: string;
};

export type CentrinelParseToolFail = Tagged<'parseToolFail'> & {
  readonly parseToolFail: string;
};

export type CentrinelToolFail = CentrinelCppToolFail | CentrinelParseToolFail;

export type CentrinelMessage = CentrinelMessageNormal | CentrinelMessageToolFail;

export type TranslationUnitMessageOpt = TranslationUnitMessage | {};

export function isTranslationUnitMessage (m: TranslationUnitMessage | {}): m is TranslationUnitMessage {
  return (m as TranslationUnitMessage).workingDirectory !== undefined &&
    (m as TranslationUnitMessage).translationUnit !== undefined &&
    (m as TranslationUnitMessage).message !== undefined;
}

export function tumFullPath(tum: TranslationUnitMessage): string {
  return tum.translationUnit === '' ? 'Translation unit' : (tum.workingDirectory + '/' + tum.translationUnit);
}

export function keyForTranslationUnitMessage (tum: {} | TranslationUnitMessage, i: number): string {
  if (isTranslationUnitMessage (tum)) {
    return tumFullPath (tum);
  } else {
    return i.toString();
  }
}

export function keyForMessage (msg: CentrinelAnalysisMessage, i: number): string {
  switch (msg.tag) {
    case 'nakedPointerMessage':
      return msg.position + '\n' + keyForNakedPointerMessagePayload (msg.nakedPointerMessage);
    case 'regionMismatchMessage':
      return msg.position + '\n' + msg.lines.join ('\n');
    default:
      return assertNever (msg);
  }
}

export function keyForNakedPointerMessagePayload (p: NakedPointerMessagePayload): string {
  return p.toString ();
}
