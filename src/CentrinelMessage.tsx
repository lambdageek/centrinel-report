import * as React from 'react';

export interface CentrinelMessage {
    readonly tag: 'Normal' | 'Verbose' | 'Abnormal';
    readonly contents: string | [boolean, string];
}

export type CentrinelMessageOpt = CentrinelMessage | {};

function isCentrinelMessage (m: CentrinelMessage | {}): m is CentrinelMessage {
  return (m as CentrinelMessage).contents !== undefined && (m as CentrinelMessage).tag !== undefined;
}

export function CentrinelMessageView ({message}: { message: CentrinelMessage | {} }) {
  if (isCentrinelMessage (message)) {
    if (typeof message.contents === 'string') {
      return <code>{message.contents}</code>;
    } else {
      return <code>{message.contents[1]}</code>;
    }
  } else {
    return null;
  }
}

export function keyForMessage (msg: {} | CentrinelMessage, i: number): string {
    return i.toString();
}
