import * as React from 'react';

export interface TranslationUnitMessage {
  readonly translationUnit: string;
  readonly isAbnormal: boolean;
  readonly messages: CentrinelMessage[];
}

export type CentrinelMessage = string;

export type TranslationUnitMessageOpt = TranslationUnitMessage | {};

function isTranslationUnitMessage (m: TranslationUnitMessage | {}): m is TranslationUnitMessage {
  return (m as TranslationUnitMessage).translationUnit !== undefined &&
    (m as TranslationUnitMessage).isAbnormal !== undefined &&
    (m as TranslationUnitMessage).messages !== undefined;
}

export function TranslationUnitMessageView ({tum}: { tum: TranslationUnitMessage}): JSX.Element {
  const tumClass = tum.isAbnormal ? 'abnormal-tum' : 'normal-tum';
  const ms = tum.messages;
  const mess = ms.map((msg, i) =>
                      <CentrinelMessageView message={msg} key={keyForMessage(msg, i)}/>);
  const fp = tum.translationUnit === '' ? 'Translation unit' : tum.translationUnit;
  return (
      <div className={tumClass}>
        <div>{fp}</div>
        <div>There are {ms.length} messages</div>
        {...mess}
      </div>);
}

export function TranslationUnitMessageOptView ({tum}: { tum: TranslationUnitMessageOpt }): JSX.Element | null {
  if (isTranslationUnitMessage (tum)) {
    return <TranslationUnitMessageView tum={tum} />;
  } else {
    return null;
  }
}

export function keyForTranslationUnitMessage (tum: {} | TranslationUnitMessage, i: number): string {
  if (isTranslationUnitMessage (tum)) {
    return tum.translationUnit;
  } else {
    return i.toString();
  }
}

export function CentrinelMessageView ({message}: { message: CentrinelMessage}): JSX.Element {
    return <div className="message"><code>{message}</code></div>;
}

export function keyForMessage (msg: {} | CentrinelMessage, i: number): string {
    return i.toString();
}
