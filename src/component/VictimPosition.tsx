import * as React from 'react';

import * as CodeZipper from '../model/CodeZipper';
import Function from './Function';
import Position from './Position';
import assertNever from '../model/assertNever';

function ArgumentView ({index, next}: CodeZipper.Arg): JSX.Element {
  return (
      <span>
        {'\t'}argument {index} of{'\n'}
        <CodeZipperView {... next}/>
      </span>);
}

function DeclView ({fname}: CodeZipper.Decl) {
  return <span>{'\t'}the declaration of <Function name={fname}/></span>;
}

function RetView ({next}: CodeZipper.Ret): JSX.Element {
  return (
      <span>
        {'\t'}the return type of{'\n'}
        <CodeZipperView {... next}/>
      </span>);
}

function TypeOfExprView ({position, next}: CodeZipper.TypeOfExpr): JSX.Element {
  return (
      <span>
        {'\t'}the type of the expression at <Position position={position}/> in{'\n'}
        <CodeZipperView {... next}/>
      </span>);
}

function StmtView ({position, next}: CodeZipper.Stmt): JSX.Element {
  return (
      <span>
        {'\t'}the statement at <Position position={position}/> in{'\n'}
        <CodeZipperView {... next}/>
      </span>);
}

function DefnView ({fname}: CodeZipper.Defn): JSX.Element {
  return <span>{'\t'}the definition of <Function name={fname} /></span>;
}

function TypeDefDefView ({position, next}: CodeZipper.TypeDefDef): JSX.Element {
  return (
      <span>
        {'\t'}the type defined at <Position position={position} /> in{'\n'}
        <CodeZipperView {... next}/>
      </span>);
}

function TypeDefRefView ({position, next}: CodeZipper.TypeDefRef): JSX.Element {
  return (
      <span>
        {'\t'}the type referenced at <Position position={position} /> in{'\n'}
        <CodeZipperView {... next}/>
      </span>);
}

export default function CodeZipperView (p: CodeZipper.Zipper): JSX.Element {
    switch (p.tag) {
      case 'arg':
        return <ArgumentView {... p} />;
      case 'decl':
        return <DeclView {... p} />;
      case 'defn':
        return <DefnView {... p} />;
      case 'ret':
        return <RetView {... p} />;
      case 'typeOfExpr':
        return <TypeOfExprView {... p} />;
      case 'typedef':
        return <TypeDefDefView {... p} />;
      case 'typedefRef':
        return <TypeDefRefView {... p} />;
      case 'stmt':
        return <StmtView {... p} />;
      default:
        return assertNever (p);
    }
}
