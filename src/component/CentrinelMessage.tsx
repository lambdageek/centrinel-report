import * as React from 'react';
import anchor from './anchor';
import { TranslationUnitMessage,
         tumFullPath,
         isTranslationUnitMessage,
       } from '../model/CentrinelMessage/TranslationUnitMessage';
import { TranslationUnitMessageOpt,
       } from '../model/CentrinelMessage';
import assertNever from '../model/assertNever';
import Every from './Every';
import * as CM from '../model/CentrinelMessage/Message';
import * as ToolFail from '../model/CentrinelMessage/ToolFail';
import { NakedPointerMessagePayloadView } from './NakedPointerMessage';
import { MessageHeader } from './MessageHeader';

type TUM_CLASS = 'normal-tum' | 'elevated-tum' | 'abnormal-tum';

export function TranslationUnitMessageView ({tum, tocId}: { tum: TranslationUnitMessage,
                                                            tocId: string | null }): JSX.Element {
  const tumClass = getTumClass (tum);
  const fp = tumFullPath (tum);
  const m = tum.message;
  switch (m.tag) {
  case 'NormalMessages': {
      const ms = m.messages;
      return (
          <div className={tumClass}>
            <a id={fp} />
            <div>{fp}</div>
            <div>There are {ms.length} messages</div>
            <Every items={ms}>{
              (msg: CM.AnalysisMessage, i: number) =>
                <CentrinelAnalysisMessageView message={msg} key={CM.keyForAnalysisMessage(msg, i)} />}
            </Every>
            <BackToTOC tocId={tocId} />
          </div>);

  }
  case 'ToolFailMessage':
      return (
        <div className={tumClass}>
          <div>{fp}</div>
          <CentrinelToolFailView toolFailure={m.toolFailure} />
          <BackToTOC tocId={tocId} />
        </div>); // TODO describe the tool failure
  default:
    return assertNever (m);
  }
}

function getTumClass (tum: TranslationUnitMessage): TUM_CLASS {
    switch (tum.message.tag) {
    case 'NormalMessages':
        return tum.message.isAbnormal ? 'elevated-tum' : 'normal-tum';
    case 'ToolFailMessage':
        return 'abnormal-tum';
    default:
        return assertNever (tum.message);
    }
}

export function TranslationUnitMessageOptView ({tum, tocId}: { tum: TranslationUnitMessageOpt,
                                                               tocId: string | null }): JSX.Element | null {
  if (isTranslationUnitMessage (tum)) {
    return <TranslationUnitMessageView tum={tum} tocId={tocId} />;
  } else {
    return null;
  }
}

export function RegionMismatchMessageView ({tag, lines}: {tag: 'regionMismatchMessage'; lines: string[]}): JSX.Element {
  const msg = ' ' + lines.join ('\n');
  return <span>{msg}</span>;
}

export function CentrinelAnalysisMessageView ({message}: { message: CM.AnalysisMessage }): JSX.Element {
  return (
      <div className="message">
      <code>
      <MessageHeader position={message.position} errorLevel={message.errorLevel} />
      {
        message.tag === 'nakedPointerMessage' ?
          <NakedPointerMessagePayloadView {... message.nakedPointerMessage} /> :
          <RegionMismatchMessageView tag={message.tag} lines={message.lines} />
      }
      </code>
      </div>);
}
  
export function CentrinelToolFailView ({toolFailure}: { toolFailure: ToolFail.ToolFail }): JSX.Element {
  switch (toolFailure.tag) {
  case 'cppToolFail':
    return (
        <div className="message">
          <p>C preprocessor failed with {toolFailure.cppToolFail}.</p>
        </div>);
  case 'parseToolFail':
    return (
        <div className="message">
          Parser error:<code>{toolFailure.parseToolFail}</code>
        </div>);
  default:
    return assertNever (toolFailure);
  }
}

function BackToTOC ({tocId }: {tocId: string | null}): JSX.Element | null {
  if (tocId === null) {
    return null;
  } else {
    return <div className="back-to-toc"><a href={anchor(tocId)}>Back to top</a></div>;
  }
}
