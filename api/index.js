import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import config from '../config';

const dbName = 'test';

let mdb;
MongoClient.connect(config.mongodbUri, { useUnifiedTopology: true }, (error, client) => {
  assert.equal(null, error);

  //Success upon connection
  mdb = client.db(dbName);
});

const router = express.Router();

router.get('/contests', (request, response) => {
  let contests = {};

  mdb
    .collection('contests')
    .find({})
    .project({
      id: 1,
      categoryName: 1,
      contestName: 1,
    })
    .each((error, contest) => {
      assert.equal(null, error);
      if (!contest) {
        response.send({contests});
        return;
      } else {
        contests[contest.id] = contest;
      }
    });
});

router.get('/contests/:contestId', (request, response) => {
  mdb
    .collection('contests')
    .findOne({ id: Number(request.params.contestId) })
    .then((contest) => response.send(contest))
    .catch(console.error);
});

router.get('/names/:nameIds', (request, response) => {
  const nameIds = request.params.nameIds.split(',').map(Number);
  let names = {};

  mdb
    .collection('names')
    .find({ id: {$in: nameIds}})
    .each((error, contest) => {
      assert.equal(null, error);
      if (!contest) {
        response.send({ names });
        return;
      } else {
        names[contest.id] = contest;
      }
    });
});

export default router;
