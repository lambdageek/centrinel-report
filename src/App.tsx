import * as React from 'react';
import './App.css';
import { CentrinelMessage, CentrinelMessageView, keyForMessage } from './CentrinelMessage';

type CentrinelMessageOpt = CentrinelMessage | {};

interface CentrinelReport {
    readonly version: string;
    readonly messages: CentrinelMessageOpt[];
}

interface CentrinelReportProps {
}

interface CentrinelReportState {
    report: CentrinelReport;
}

const nilReport: CentrinelReport = {
  version: '0',
  messages: []
};

class App extends React.Component<CentrinelReportProps, CentrinelReportState> {
  constructor(props: CentrinelReportProps) {
      super(props);
      this.state = {
          report: nilReport
      };
  }

  componentDidMount() {
      this.fetchReport('./centrinel-report.json').then((report) => {
          this.setState((prevState, props) => {
              return {report : report };
          });
      });
  }

  componentWillUnmount() {
    this.setState((prevState, props) => {
      return { report : nilReport };
    });
  }

  async fetchReport(url: string): Promise<CentrinelReport> {
    const response = await fetch (url);
    const j = await response.json();
    return { version: j.version as string,
             messages: j.messages as CentrinelMessageOpt[]
             };
  }

  render() {
    const ms = this.state.report.messages;
    const mess = ms.map((msg, i) =>
        <CentrinelMessageView message={msg} key={keyForMessage(msg, i)}/>);
    return (
      <div className="App">
        <div className="App-header">
            Centrinel Report Viewer
        </div>
        <div className="App-intro">Notices</div>
        <div>There are {ms.length} messages</div>
        <div className="messages">
            {...mess}
        </div>
      </div>
    );
  }
}

export default App;
