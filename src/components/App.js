import React from 'react';
import axios from 'axios';

import Header from './Header';
import ContestList from './ContestList';

const pushState = (obj, url) =>{
  window.history.pushState(obj, '', url);
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageHeader: 'Naming Contests',
      contests: this.props.initialContests,
    };
  }
  componentDidMount() {
    axios
      .get('/api/contests')
      .then((response) => {
        this.setState({
          contests: response.data.contests,
        });
      })
      .catch((error) => {
        console.error(`AXIOS: Couldn't fetch contests data: ${error}`);
      });
  }
  componentWillUnmount() {}
  fetchContest(contestId){
    pushState(
      {currentContestId: contestId},
      `/contest/${contestId}`
    );
  }
  render() {
    return (
      <div className="App">
        <Header message={this.state.pageHeader} />
        <ContestList 
        onContestClick={this.fetchContest}
        contests={this.state.contests} />
      </div>
    );
  }
}

export default App;
