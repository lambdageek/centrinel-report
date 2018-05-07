import * as React from 'react';
import * as Model from '../model/CentrinelReport';
import { keyForTranslationUnitMessage } from '../model/CentrinelMessage';

import Every from './Every';
import tocId from './tocId';
import { TranslationUnitTOC } from './TranslationUnitTOC';
import { TranslationUnitMessageOptView } from './CentrinelMessage';

export let CentrinelReport: React.SFC<{report: Model.CentrinelReport}> =
({report}) => {
  const ms = report.messages;
  return (
    <div>
      <div className="App-intro">Notices</div>
      <div className="TOC">
        <div>There are {ms.length - 1} translation units</div>
        <TranslationUnitTOC tums={ms} />
      </div>
      <div className="translation-units">
      <Every items={ms}>{
        (tum, i) =>
          <TranslationUnitMessageOptView
           tum={tum}
           tocId={tocId}
           key={keyForTranslationUnitMessage(tum, i)}
          />
      }
      </Every>
      </div>
    </div>);
};
