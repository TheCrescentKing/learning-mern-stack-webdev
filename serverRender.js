// To render React Components from on server
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// React componen to render
import App from './src/components/App';

// fetch the data from the API
import axios from 'axios';
import config from './config';

const serverRender = () => {
  return axios
    .get(`${config.serverUrl}/api/contests`)
    .then((response) => {
      return ReactDOMServer.renderToString(<App initialContests={response.data.contests} />);
    })
    .catch((error) => {
      console.error(error);
    });
};

export default serverRender;
