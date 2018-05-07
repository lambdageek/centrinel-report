import { Tagged } from '../Tagged';
import { CodeZipper } from '../CodeZipper';
import { AnalysisMessageBase } from './AnalysisMessageBase';

export type NakedPointerMessage = Tagged <'nakedPointerMessage'> & AnalysisMessageBase & {
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

export function keyForNakedPointerMessagePayload (p: NakedPointerMessagePayload): string {
  return p.toString ();
}
