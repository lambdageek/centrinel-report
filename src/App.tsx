import * as React from 'react';
import './App.css';
import * as State from './model/CentrinelState';
import * as Model from './model/CentrinelReport';
import { TranslationUnitMessageOpt } from './model/CentrinelMessage';
import assertNever from './model/assertNever';
import { CentrinelReport } from './component/CentrinelReport';

const expectedReportVersion: string = '3';

const previousReportReleasesURL: string = 'https://github.com/lambdageek/centrinel-report/releases';

interface CentrinelReportProps {
}

let PayloadComponent: React.SFC<{loadState: State.StateType}> =
({loadState}) => {
  switch (loadState.stateType) {
  case 'Initial':
    return <div>Loading...</div>;
  case 'LoadedReport':
    return <CentrinelReport report={loadState.report} />;
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
    const report: Model.CentrinelReport = {
      version: j.centrinel_report_version as string,
      messages: j.messages as TranslationUnitMessageOpt[]
    };
    return State.centrinelReportState (report);
  }
}

class App extends React.Component<CentrinelReportProps, State.StateType> {
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
