// State for the centrinel app

import { CentrinelReport } from './CentrinelReport';

export interface StateTypeBase {
  stateType: 'Initial' | 'LoadedReport' | 'ReportLoadError' | 'IncorrectVersion';
}

export interface InitialState extends StateTypeBase {
  stateType: 'Initial';
}

export function initialState(): InitialState {
  return { stateType: 'Initial' };
}

export interface CentrinelReportState extends StateTypeBase {
  stateType: 'LoadedReport';
  report: CentrinelReport;
}

export function centrinelReportState(r: CentrinelReport): CentrinelReportState {
  return { stateType: 'LoadedReport',
           report: r };
}

export interface ReportLoadErrorState extends StateTypeBase {
  stateType: 'ReportLoadError';
  errorMessage: string;
}

export function reportLoadErrorState(msg: string): ReportLoadErrorState {
  return { stateType: 'ReportLoadError',
           errorMessage: msg };
}

export interface IncorrectVersionState extends StateTypeBase {
  stateType: 'IncorrectVersion';
  expectedVersion: string;
  actualVersion: string;
}

export function incorrectVersionState(expectedVersion: string, actualVersion: string): IncorrectVersionState {
  return { stateType: 'IncorrectVersion',
           expectedVersion: expectedVersion,
           actualVersion: actualVersion };
}

export type StateType = InitialState | CentrinelReportState | ReportLoadErrorState | IncorrectVersionState;
