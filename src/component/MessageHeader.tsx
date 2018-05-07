import * as React from 'react';
import { ErrorLevel,
       } from '../model/CentrinelMessage/ErrorLevel';

export let MessageHeader: React.SFC<{position: string, errorLevel: ErrorLevel}> =
  ({position, errorLevel}) => <span>{position + ': ' + errorLevel + ' '}</span>;
