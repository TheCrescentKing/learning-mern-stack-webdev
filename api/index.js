import express from 'express';
import { MongoClient, ObjectID } from 'mongodb';
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
      categoryName: 1,
      contestName: 1,
    })
    .each((error, contest) => {
      assert.equal(null, error);
      if (!contest) {
        response.send({ contests });
        return;
      } else {
        contests[contest._id] = contest;
      }
    });
});

router.get('/contests/:contestId', (request, response) => {
  mdb
    .collection('contests')
    .findOne({ _id: ObjectID(request.params.contestId) })
    .then((contest) => response.send(contest))
    .catch((error) => {
      console.error(error);
      response.status(404).send('Bad Request');
    });
});

router.get('/names/:nameIds', (request, response) => {
  const nameIds = request.params.nameIds.split(',').map(ObjectID);
  let names = {};

  mdb
    .collection('names')
    .find({ _id: { $in: nameIds } })
    .each((error, contest) => {
      assert.equal(null, error);
      if (!contest) {
        response.send({ names });
        return;
      } else {
        names[contest._id] = contest;
      }
    });
});

router.post('/names', (request, response) => {
  const contestId = ObjectID(request.body.contestId);
  const name = request.body.name;
  // TODO validation
  mdb
    .collection('names')
    .insertOne({ name })
    .then((result) => {
      mdb
        .collection('contests')
        .findAndModify(
          { _id: contestId },
          [],
          { $push: { nameIds: result.insertedId } },
          { new: true }
        )
        .then((document) => {
          response.send({
            updatedContests: document.value,
            newName: { _id: result.insertedId, name },
          });
        });
    })
    .catch((error) => {
      console.error(error);
      response.status(404).send('Bad Request');
    });
});

export default router;
