import * as React from 'react';
import './App.css';
import { CentrinelMessage, CentrinelMessageView, keyForMessage } from './CentrinelMessage';

interface CentrinelReport {
    version: string;
    messages: CentrinelMessage[];
}

interface CentrinelReportState {
    report: CentrinelReport;
}

class App extends React.Component<{}, CentrinelReportState> {
  constructor() {
      super();
      this.state = {
          report: {
              version: '0',
              messages: []
          }
      };
      fetch('./centrinel-report.json').then((response) => {
          return response.json();
      }).then ((j) => {
          this.setState((prevState, props) => {
              return {report : { version: j.version as string,
                                 messages: j.messages as CentrinelMessage[]
                               } };
          });
      });
  }
  render() {
    const mess = this.state.report.messages.map((msg, i) =>
        <CentrinelMessageView message={msg} key={keyForMessage(msg, i)}/>);
    return (
      <div className="App">
        <div className="App-header">
            Centrinel Report Viewer
        </div>
        <div className="App-intro">Notices</div>
        <div className="messages">
            {mess}
        </div>
      </div>
    );
  }
}

export default App;
