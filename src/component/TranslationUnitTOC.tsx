import * as React from 'react';

import assertNever from '../model/assertNever';

import { TranslationUnitMessageOpt, keyForTranslationUnitMessage } from '../model/CentrinelMessage';
import * as CM from '../model/CentrinelMessage/Message';
import * as TUM from '../model/CentrinelMessage/TranslationUnitMessage';

import anchor from './anchor';
import Every from './Every';
import tocId from './tocId';

function summaryForCentrinelMessage (message: CM.Message): string {
  switch (message.tag) {
  case 'NormalMessages':
    return message.messages.length.toString () + ' notices';
  case 'ToolFailMessage':
    return 'tool failure';
  default:
    return assertNever (message);
  }
}

let TranslationUnitSummary: React.SFC <{tum: TranslationUnitMessageOpt}> =
({tum}) => {
  if (TUM.isTranslationUnitMessage (tum)) {
    const s = tum.workingDirectory + '/' + tum.translationUnit;
    return (
        <li>
          <a href={anchor(s)}>{s}</a>: {summaryForCentrinelMessage (tum.message)}
        </li>);
  } else {
    return null;
  }
};

export let TranslationUnitTOC: React.SFC<{tums: TranslationUnitMessageOpt[] }> =
({tums}) => {
  const k = keyForTranslationUnitMessage;
  return (
      <div id={tocId}>
      <ul>
      <Every items={tums}>{
        (tum: TranslationUnitMessageOpt, idx) =>
          <TranslationUnitSummary tum={tum} key={k (tum, idx)} />}
      </Every>
      </ul>
      </div>
  );
};
