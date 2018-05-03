import * as React from 'react';
import './Function.css';

export default function Function({name}: {name: string}): JSX.Element {
  return <span className="function">{name}</span>;
}
