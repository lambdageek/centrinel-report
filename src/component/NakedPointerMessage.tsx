import * as React from 'react';

import * as CM from '../model/CentrinelMessage/NakedPointerMessage';

import Every from './Every';
import VictimPositionView from './VictimPosition';

let NakedPointerVictimView: React.SFC<CM.NakedPointerVictim> =
  ({type, position}) => (
  <span>
    <span>Pointer to managed heap {type}</span> in{'\n'}
    <VictimPositionView {... position} />
    {'\n'}
  </span>);

export let NakedPointerMessagePayloadView: React.SFC<CM.NakedPointerMessagePayload> =
  ({inDefinition, victims}) => {
    const msghead = 'Naked pointer(s) to managed object(s) found in ' + (inDefinition ? 'definition' : 'declarataion');
    return (
        <>
        <span>{msghead}</span>{'\n'}
        <Every items={victims}>
        {(victim) => <NakedPointerVictimView {... victim} />}
        </Every>
        </>
        );
  };
