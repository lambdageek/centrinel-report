
import { ErrorLevel } from './ErrorLevel';

export interface AnalysisMessageBase {
  readonly errorLevel: ErrorLevel;
  readonly position: string;
}
