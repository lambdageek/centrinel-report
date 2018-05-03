import * as React from 'react';
import './Position.css';

export default function Position({position}: {position: string}): JSX.Element {
  return <span className="position">{position}</span>;
}
