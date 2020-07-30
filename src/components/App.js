import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import * as api from '../api';

import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';

const pushState = (obj, url) => {
  window.history.pushState(obj, '', url);
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.props.initialData;
    this.fetchContest = this.fetchContest.bind(this);
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

  pageHeader() {
    if(this.state.currentContestId){
      return this.currentContest().contestName;
    }else{
      return 'Naming Contests';
    }
  }

  fetchContest(contestId) {
    pushState({ currentContestId: contestId }, `/contest/${contestId}`);

    // lookup the contest
    api.fetchContest(contestId).then((contest) => {
      this.setState({
        currentContestId: contest.id,
        contests: {
          ...this.state.contests,
          [contest.id]: contest
        }
      });
    });
  }

  currentContest(){
    return this.state.contests[this.state.currentContestId];
  }

  currentContent() {
    if (this.state.currentContestId) {
      return <Contest {...this.currentContest()} />;
    } else {
      return <ContestList onContestClick={this.fetchContest} contests={this.state.contests} />;
    }
  }

  render() {
    return (
      <div className="App">
        <Header message={this.pageHeader()} />
        {this.currentContent()}
      </div>
    );
  }
}

App.propTypes = {
  initialData: PropTypes.object.isRequired,
};

export default App;
