
import { Tagged } from './Tagged';

type Positioned = { readonly position: string };
type Zipped = { readonly next: Zipper };

export type Arg = Tagged<'arg'> & Positioned & Zipped & {
  readonly index: number;
  readonly 'var': string;
};

export type Ret = Tagged<'ret'> & Zipped;

export type Decl = Tagged<'decl'> & { readonly fname: string; };

export type TypeDefRef = Tagged<'typedefRef'> & Positioned & Zipped;

export type TypeDefDef = Tagged<'typedef'> & Positioned & Zipped;

export type Defn = Tagged<'defn'> & { readonly fname: string; };

export type Stmt = Tagged<'stmt'> & Positioned & Zipped;

export type TypeOfExpr = Tagged<'typeOfExpr'> & Positioned & Zipped;

export type Zipper = Arg | Ret | Decl | TypeDefRef | TypeDefDef | Defn | Stmt | TypeOfExpr;
  
export type CodeZipper = Zipper;
