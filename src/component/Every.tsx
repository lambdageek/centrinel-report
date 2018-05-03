import * as React from 'react';

export default function Every<T>({items, children}:
                                 {items: T[], children: (arg: T, idx: number) => JSX.Element}): JSX.Element {
  const r = items.map ((x, i) => children (x, i));
  return <>{r}</>;
}
