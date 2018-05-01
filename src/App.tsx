import * as React from 'react';
import './App.css';
import { CentrinelMessage, TranslationUnitMessageOpt,
         keyForTranslationUnitMessage, isTranslationUnitMessage } from './model/CentrinelMessage';
import { TranslationUnitMessageOptView } from './component/CentrinelMessage';
import * as State from './model/CentrinelState';
import { CentrinelReport } from './model/CentrinelReport';
import anchor from './component/anchor';
import assertNever from './model/assertNever';

const expectedReportVersion: string = '2';

const previousReportReleasesURL: string = 'https://github.com/lambdageek/centrinel-report/releases';

const tocId: string = 'table-of-contents';

interface CentrinelReportProps {
}

function summaryForCentrinelMessage (message: CentrinelMessage): string {
  switch (message.tag) {
  case 'NormalMessages':
    return message.messages.length.toString () + ' notices';
  case 'ToolFailMessage':
    return 'tool failure';
  default:
    return assertNever (message);
  }
}

function Every<T>({items, children}: {items: T[], children: (arg: T, idx: number) => JSX.Element}): JSX.Element {
  const r = items.map ((x, i) => children (x, i));
  return <>{r}</>;
}

let TranslationUnitSummary: React.SFC <{tum: TranslationUnitMessageOpt}> =
({tum}) => {
  if (isTranslationUnitMessage (tum)) {
    const s = tum.workingDirectory + '/' + tum.translationUnit;
    return (
        <li>
          <a href={anchor(s)}>{s}</a>: {summaryForCentrinelMessage (tum.message)}
        </li>);
  } else {
    return null;
  }
};

let TranslationUnitTOC: React.SFC<{tums: TranslationUnitMessageOpt[] }> =
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

let ReportLoadedComponent: React.SFC<{report: CentrinelReport}> =
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

let PayloadComponent: React.SFC<{loadState: State.StateType}> =
({loadState}) => {
  switch (loadState.stateType) {
  case 'Initial':
    return <div>Loading...</div>;
  case 'LoadedReport':
    return <ReportLoadedComponent report={loadState.report} />;
  case 'ReportLoadError':
    return <div>Error loading report: {loadState.errorMessage}</div>;
  case 'IncorrectVersion':
    return (
        <div>
        <p>Error loading the JSON report version <span>{loadState.actualVersion}</span>,
        because this version of the report viewer can only handle
        report format version <span>{loadState.expectedVersion}</span>.
        </p>
        <p>For older versions, please use a previous version of the report software
        from <a href={previousReportReleasesURL}>{previousReportReleasesURL}</a></p>
        </div>);
  default: return assertNever(loadState);
  }
};

async function fetchReport(url: string): Promise<State.StateType> {
  const response = await fetch (url);
  const j = await response.json();
  if (j.centrinel_report_version !== expectedReportVersion) {
    return State.incorrectVersionState (expectedReportVersion, j.centrinel_report_version as string);
  } else {
    const report: CentrinelReport = {
      version: j.centrinel_report_version as string,
      messages: j.messages as TranslationUnitMessageOpt[]
    };
    return State.centrinelReportState (report);
  }
}

class App extends React.Component<{}, State.StateType> {
  constructor(props: CentrinelReportProps) {
      super(props);
      this.state = State.initialState ();
  }

  componentDidMount() {
    fetchReport('./centrinel-report.json').then((newState) => {
      this.setState((prevState, props) => {
        return newState;
      });
    }).catch((oops) => {
      this.setState ((prevState, props) => {
        return State.reportLoadErrorState (oops.toString ());
      });
    });
  }

  componentWillUnmount() {
    this.setState((prevState, props) => {
      return State.initialState ();
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
        Centrinel Report Viewer
        </div>
        <PayloadComponent loadState={this.state} />
      </div>
    );
  }

}

export default App;
