import * as React from 'react';
import anchor from './anchor';
import assertNever from './assertNever';

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

function getTumClass (tum: TranslationUnitMessage): 'normal-tum' | 'elevated-tum' | 'abnormal-tum' {
    switch (tum.message.tag) {
    case 'NormalMessages':
        return tum.message.isAbnormal ? 'elevated-tum' : 'normal-tum';
    case 'ToolFailMessage':
        return 'abnormal-tum';
    default:
        return assertNever (tum.message);
    }
}

function tumFullPath(tum: TranslationUnitMessage): string {
  return tum.translationUnit === '' ? 'Translation unit' : (tum.workingDirectory + '/' + tum.translationUnit);
}

export function TranslationUnitMessageView ({tum, tocId}: { tum: TranslationUnitMessage,
                                                            tocId: string | null }): JSX.Element {
  const tumClass = getTumClass (tum);
  const fp = tumFullPath (tum);
  const m = tum.message;
  switch (m.tag) {
  case 'NormalMessages': {
      const ms = m.messages;
      const mess = ms.map((msg, i) => (
                          <CentrinelAnalysisMessageView
                            message={msg}
                            key={keyForMessage(msg, i)}
                          />));
      return (
          <div className={tumClass}>
              <a id={fp} />
              <div>{fp}</div>
              <div>There are {ms.length} messages</div>
              {...mess}
              <BackToTOC tocId={tocId} />
          </div>);

  }
  case 'ToolFailMessage':
      return (
        <div className={tumClass}>
          <div>{fp}</div>
          <CentrinelToolFailView toolFailure={m.toolFailure} />
          <BackToTOC tocId={tocId} />
        </div>); // TODO describe the tool failure
  default:
    return assertNever (m);
  }
}

export function TranslationUnitMessageOptView ({tum, tocId}: { tum: TranslationUnitMessageOpt,
                                                               tocId: string | null }): JSX.Element | null {
  if (isTranslationUnitMessage (tum)) {
    return <TranslationUnitMessageView tum={tum} tocId={tocId} />;
  } else {
    return null;
  }
}

export function keyForTranslationUnitMessage (tum: {} | TranslationUnitMessage, i: number): string {
  if (isTranslationUnitMessage (tum)) {
    return tumFullPath (tum);
  } else {
    return i.toString();
  }
}

export function CentrinelAnalysisMessageView ({message}: { message: CentrinelAnalysisMessage }): JSX.Element {
  const lines = message.lines;
  const msg = message.position + ': ' + message.errorLevel + ' '
        + lines.join('\n');
  return (
    <div className="message">
      <code>{msg}</code>
    </div>);
}

export function keyForMessage (msg: CentrinelAnalysisMessage, i: number): string {
    return msg.position + '\n' + msg.lines.join ('\n');
}

export function CentrinelToolFailView ({toolFailure}: { toolFailure: CentrinelToolFail }): JSX.Element {
  switch (toolFailure.tag) {
  case 'cppToolFail':
    return (
        <div className="message">
          <p>C preprocessor failed with {toolFailure.cppToolFail}.</p>
        </div>);
  case 'parseToolFail':
    return (
        <div className="message">
          Parser error:<code>{toolFailure.parseToolFail}</code>
        </div>);
  default:
    return assertNever (toolFailure);
  }
}

function BackToTOC ({tocId }: {tocId: string | null}): JSX.Element | null {
  if (tocId === null) {
    return null;
  } else {
    return <div className="back-to-toc"><a href={anchor(tocId)}>Back to top</a></div>;
  }
}
