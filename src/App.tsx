import * as React from 'react';
import './App.css';
import { CentrinelMessage, TranslationUnitMessageOpt, TranslationUnitMessageOptView,
         keyForTranslationUnitMessage, isTranslationUnitMessage } from './CentrinelMessage';
import * as State from './CentrinelState';
import { CentrinelReport } from './CentrinelReport';
import assertNever from './assertNever';

const expectedReportVersion: string = '2';

const previousReportReleasesURL: string = 'https://github.com/lambdageek/centrinel-report/releases';

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

function anchor(s: string): string {
  return '#' + s;
}

function translationUnitSummary (tum: TranslationUnitMessageOpt, i: number): JSX.Element | null {
  if (isTranslationUnitMessage (tum)) {
    const s = tum.workingDirectory + '/' + tum.translationUnit;
    return (
        <li key={keyForTranslationUnitMessage(tum, i)}>
          <a href={anchor(s)}>{s}</a>: {summaryForCentrinelMessage (tum.message)}
        </li>);
  } else {
    return null;
  }
}

function TranslationUnitTOC ({tums }: {tums: TranslationUnitMessageOpt[] }): JSX.Element {
  const elts = tums.map ((tum, i) =>
                         translationUnitSummary(tum, i));
  return <ul>{...elts}</ul>;
}

function reportLoadedComponent(report: CentrinelReport): JSX.Element {
  const ms = report.messages;
  const tums = ms.map ((tum, i) =>
                       <TranslationUnitMessageOptView tum={tum} key={keyForTranslationUnitMessage(tum, i)}/>);
  return (
    <div>
      <div className="App-intro">Notices</div>
      <div className="TOC">
        <div>There are {ms.length - 1} translation units</div>
        <TranslationUnitTOC tums={ms} />
      </div>
      <div className="translation-units">
      {...tums}
      </div>
    </div>);
}

function payloadComponent(state: State.StateType): JSX.Element {
  switch (state.stateType) {
  case 'Initial':
    return <div>Loading...</div>;
  case 'LoadedReport':
    return reportLoadedComponent(state.report);
  case 'ReportLoadError':
    return <div>Error loading report: {state.errorMessage}</div>;
  case 'IncorrectVersion':
    return (
        <div>
        <p>Error loading the JSON report version <span>{state.actualVersion}</span>,
        because this version of the report viewer can only handle
        report format version <span>{state.expectedVersion}</span>.
        </p>
        <p>For older versions, please use a previous version of the report software
        from <a href={previousReportReleasesURL}>{previousReportReleasesURL}</a></p>
        </div>);
  default: return assertNever(state);
  }
}

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
    const payload = payloadComponent (this.state);
    return (
      <div className="App">
        <div className="App-header">
        Centrinel Report Viewer
        </div>
        {payload}
      </div>
    );
  }

}

export default App;
