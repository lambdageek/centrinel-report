// Centrinel message format JSON blobs

export interface TranslationUnitMessage {
  readonly workingDirectory: string;
  readonly translationUnit: string;
  readonly message: CentrinelMessage;
}

export interface CentrinelMessageNormal {
  readonly tag: 'NormalMessages';
  readonly isAbnormal: boolean;
  readonly messages: CentrinelAnalysisMessage[];
}

export interface CentrinelMessageToolFail {
  readonly tag: 'ToolFailMessage';
  readonly toolFailure: CentrinelToolFail;
}

export interface CentrinelAnalysisMessageBase {
  readonly errorLevel: 'WARNING' | 'ERROR' | 'FATAL ERROR';
  readonly position: string;
  readonly lines: string[];
}

export interface NakedPointerMessage extends CentrinelAnalysisMessageBase {
  tag: 'nakedPointerMessage';
  readonly nakedPointerMessage: object[];
}

export interface RegionMismatchMessage extends CentrinelAnalysisMessageBase {
  tag: 'regionMismatchMessage';
  readonly regionMismatchMessage: object[];
}

export type CentrinelAnalysisMessage = NakedPointerMessage | RegionMismatchMessage;

export interface CentrinelCppToolFail {
  tag: 'cppToolFail';
  readonly cppToolFail: string;
}

export interface CentrinelParseToolFail {
  tag: 'parseToolFail';
  readonly parseToolFail: string;
}

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
    return msg.position + '\n' + msg.lines.join ('\n');
}
