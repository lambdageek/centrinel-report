import * as React from 'react';
import anchor from './anchor';
import { TranslationUnitMessage,
         TranslationUnitMessageOpt,
         isTranslationUnitMessage,
         tumFullPath,
         CentrinelAnalysisMessage,
         CentrinelToolFail,
         keyForMessage,
       } from '../model/CentrinelMessage';
import assertNever from '../model/assertNever';

function getTumClass (tum: TranslationUnitMessage): 'normal-tum' | 'elevated-tum' | 'abnormal-tum' {
    switch (tum.message.tag) {
    case 'NormalMessages':
        return tum.message.isAbnormal ? 'elevated-tum' : 'normal-tum';
    case 'ToolFailMessage':
        return 'abnormal-tum';
    default:
        return assertNever (tum.message);
    }
}

export function TranslationUnitMessageView ({tum, tocId}: { tum: TranslationUnitMessage,
                                                            tocId: string | null }): JSX.Element {
  const tumClass = getTumClass (tum);
  const fp = tumFullPath (tum);
  const m = tum.message;
  switch (m.tag) {
  case 'NormalMessages': {
      const ms = m.messages;
      const mess = ms.map((msg, i) => (
                          <CentrinelAnalysisMessageView
                            message={msg}
                            key={keyForMessage(msg, i)}
                          />));
      return (
          <div className={tumClass}>
              <a id={fp} />
              <div>{fp}</div>
              <div>There are {ms.length} messages</div>
              {...mess}
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

export function TranslationUnitMessageOptView ({tum, tocId}: { tum: TranslationUnitMessageOpt,
                                                               tocId: string | null }): JSX.Element | null {
  if (isTranslationUnitMessage (tum)) {
    return <TranslationUnitMessageView tum={tum} tocId={tocId} />;
  } else {
    return null;
  }
}

export function CentrinelAnalysisMessageView ({message}: { message: CentrinelAnalysisMessage }): JSX.Element {
  const lines = message.lines;
  const msg = message.position + ': ' + message.errorLevel + ' '
        + lines.join('\n');
  return (
    <div className="message">
      <code>{msg}</code>
    </div>);
}

export function CentrinelToolFailView ({toolFailure}: { toolFailure: CentrinelToolFail }): JSX.Element {
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
