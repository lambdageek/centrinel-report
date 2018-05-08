
import assertNever from '../assertNever';
import { Tagged } from '../Tagged';
import { AnalysisMessageBase } from './AnalysisMessageBase';
import { NakedPointerMessage,
         keyForNakedPointerMessagePayload,
       } from './NakedPointerMessage';

import * as ToolFail from './ToolFail';

export type MessageNormal = Tagged<'NormalMessages'> & {
  readonly isAbnormal: boolean;
  readonly messages: AnalysisMessage[];
};

export type MessageToolFail = Tagged<'ToolFailMessage'> & {
  readonly toolFailure: ToolFail.ToolFail;
};

export type Message = MessageNormal | MessageToolFail;

export type AnalysisMessage = NakedPointerMessage | RegionMismatchMessage | CErrorMessage ;

export type RegionMismatchMessage = Tagged<'regionMismatchMessage'> & AnalysisMessageBase & {
  readonly lines: string[];
  readonly regionMismatchMessage: object[];
};

export type CErrorMessage = Tagged<'cerrorMessage'> & AnalysisMessageBase & {
  readonly lines: string[];
};

export function keyForAnalysisMessage (msg: AnalysisMessage, i: number): string {
  switch (msg.tag) {
    case 'nakedPointerMessage':
      return msg.position + '\n' + keyForNakedPointerMessagePayload (msg.nakedPointerMessage);
    case 'regionMismatchMessage':
      return msg.position + '\n' + msg.lines.join ('\n');
    case 'cerrorMessage':
      return msg.position + '\n' + msg.lines.join ('\n');
    default:
      return assertNever (msg);
  }
}
