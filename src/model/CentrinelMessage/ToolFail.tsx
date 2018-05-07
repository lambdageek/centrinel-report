import { Tagged } from '../Tagged';

export type CppToolFail = Tagged<'cppToolFail'> & {
  readonly cppToolFail: string;
};

export type ParseToolFail = Tagged<'parseToolFail'> & {
  readonly parseToolFail: string;
};

export type ToolFail = CppToolFail | ParseToolFail;
