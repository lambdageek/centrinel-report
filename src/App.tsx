import * as React from 'react';
import './App.css';
import { CentrinelMessageOpt, CentrinelMessageView, keyForMessage } from './CentrinelMessage';
import * as State from './CentrinelState';
import { CentrinelReport } from './CentrinelReport';

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
  default: return assertNever(state);
  }
}

async function fetchReport(url: string): Promise<CentrinelReport> {
  const response = await fetch (url);
  const j = await response.json();
  return { version: j.version as string,
           messages: j.messages as CentrinelMessageOpt[]
         };
}

class App extends React.Component<{}, State.StateType> {
  constructor(props: CentrinelReportProps) {
      super(props);
      this.state = State.initialState ();
  }

  componentDidMount() {
    fetchReport('./centrinel-report.json').then((report) => {
      this.setState((prevState, props) => {
        return State.centrinelReportState (report);
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
