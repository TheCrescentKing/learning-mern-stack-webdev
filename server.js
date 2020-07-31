import config from './config';
import apiRouter from './api';
import express from 'express';
import path from 'path';

import sassMiddleware from 'node-sass-middleware';
import bodyParser from 'body-parser';

const server = express();

server.use(
  sassMiddleware({
    src: path.join(__dirname, 'sass'),
    dest: path.join(__dirname, 'public'),
  })
);

// Parse JSON in request bodies
server.use(bodyParser.json());

server.set('view engine', 'ejs');

import serverRender from './serverRender';

server.get(['/', '/contest/:contestId'], (request, response) => {
  serverRender(request.params.contestId)
    .then(({ initialMarkup, initialData }) => {
      response.render('index', { initialMarkup, initialData });
    })
    .catch((error) => {
      console.error(error);
      response.status(404).send('Bad Request');
    });
});

server.use(express.static('public'));
server.use('/api', apiRouter);

server.listen(config.port, config.host, () => {
  console.log(`Express listening on port: ${config.port}`);
});
