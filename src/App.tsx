import * as React from 'react';
import './App.css';
import { CentrinelMessageOpt, CentrinelMessageView, keyForMessage } from './CentrinelMessage';
import * as State from './CentrinelState';
import { CentrinelReport } from './CentrinelReport';

const expectedReportVersion: string = '0';

const previousReportReleasesURL: string = 'https://github.com/lambdageek/centrinel-report/releases';

interface CentrinelReportProps {
}

function assertNever(x: never): never {
    throw new Error('Unexpected object: ' + x);
}

function reportLoadedComponent(report: CentrinelReport): JSX.Element {
  const ms = report.messages;
  const mess = ms.map((msg, i) =>
                      <CentrinelMessageView message={msg} key={keyForMessage(msg, i)}/>);
  return (
      <div>
        <div className="App-intro">Notices</div>
        <div>There are {ms.length} messages</div>
        <div className="messages">
        {...mess}
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
      messages: j.messages as CentrinelMessageOpt[]
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
