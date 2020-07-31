// To render React Components from on server
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// React componen to render
import App from './src/components/App';

// fetch the data from the API
import axios from 'axios';
import config from './config';

const getApiUrl = (contestId) => {
  if (contestId) {
    return `${config.serverUrl}/api/contests/${contestId}`;
  } else {
    return `${config.serverUrl}/api/contests`;
  }
};

const getInitialData = (contestId, apiData) => {
  if (contestId) {
    return {
      currentContestId: apiData._id,
      contests: {
        [apiData._id]: apiData,
      },
    };
  } else {
    return apiData;
  }
};

const serverRender = (contestId) => {
  let url = getApiUrl(contestId);
  return axios
    .get(url)
    .then((response) => {
      const initialData = getInitialData(contestId, response.data);
      return {
        initialMarkup: ReactDOMServer.renderToString(<App initialData={initialData} />),
        initialData,
      };
    })
    .catch((error) => {
      console.error(error);
    });
};

export default serverRender;
