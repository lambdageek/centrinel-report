// The type representing an analysis report from Centrinel

import { TranslationUnitMessageOpt } from './CentrinelMessage';

export interface CentrinelReport {
    readonly version: string;
    readonly messages: TranslationUnitMessageOpt[];
}
