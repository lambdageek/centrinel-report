// The type representing an analysis report from Centrinel

import { CentrinelMessageOpt } from './CentrinelMessage';

export interface CentrinelReport {
    readonly version: string;
    readonly messages: CentrinelMessageOpt[];
}
