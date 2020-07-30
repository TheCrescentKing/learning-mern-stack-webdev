import express from 'express';

import data from '../src/testData.json';

const router = express.Router();

const contestsObj = data.contests.reduce((obj, contest) => {
  obj[contest.id] = contest;
  return obj;
}, {});

router.get('/contests', (request, response) => {
  response.send({ contests: contestsObj });
});

router.get('/contests/:id', (request, response) => {
  let contest = contestsObj[request.params.id];
  contest.description = 'Lorem Ipsum';
  response.send(contest);
});

export default router;
