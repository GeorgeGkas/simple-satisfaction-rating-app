const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Define constants (page title and questions) used in the app.
const constants = require('./constants.json');

// Number of total voters.
let totalVotes = 0;

// Object with each key representing a distinct question.
// The value of this key is again an object representing the
// rating given by the voters.
const votes = {};

constants.questions.forEach((question) => {
  votes[question.replace(/\s/g, '_')] = {
    bad: 0,
    poor: 0,
    neutral: 0,
    good: 0,
    excellent: 0
  };
});

// Extract the entire body portion of an incoming request stream 
// as JSON object.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define the public app folder.
app.use(express.static(path.join(__dirname, 'public')));

// Define the location of the template files.
app.set('views', path.join(__dirname, 'views/pages'));

// Set Pug as template engine.
app.set('view engine', 'pug');

// Set the root path of the app as the question page.
app.get('/', (req, res) => {
  res.render('question', {
    __TITLE__: constants.title,
    __QUESTIONS__: constants.questions
  });
});

// Render the results of the questionnaire.
app.get('/results', (req, res) => {
  // We need to show each vote as percentage value.
  const votesAsPercentages = {};

  // Object with each key representing the question
  // and the corresponding value representing the 
  // highest rating.
  const highestRatingForEachQuestion = {};

  for (question in votes) {
    votesAsPercentages[question] = {
      bad: votes[question].bad / totalVotes * 100,
      poor: votes[question].poor / totalVotes * 100,
      neutral: votes[question].neutral / totalVotes * 100,
      good: votes[question].good / totalVotes * 100,
      excellent: votes[question].excellent / totalVotes * 100
    }

    highestRatingForEachQuestion[question] = Math.max(
      votesAsPercentages[question].bad,
      votesAsPercentages[question].poor,
      votesAsPercentages[question].neutral,
      votesAsPercentages[question].good,
      votesAsPercentages[question].excellent,
    );
  }

  res.render('results', {
    __TITLE__: constants.title,
    __RESULTS__: votesAsPercentages,
    __HIGHEST_RATING__: highestRatingForEachQuestion
  });
});

// Used by AJAX calls to register the answers.
app.post('/post-answers', (req, res) => {
  const answers = req.body.answers;
  let encounterError = false;

  if (!answers) {
    console.error('Answers are not object.');
    encounterError = true;
    res.sendStatus(400);
  }

  constants.questions.forEach((question) => {
    switch (answers[question.replace(/\s/g, '_')]) {
      case 'bad':
        votes[question.replace(/\s/g, '_')].bad += 1;
        break;
      case 'poor':
        votes[question.replace(/\s/g, '_')].poor += 1;
        break;
      case 'neutral':
        votes[question.replace(/\s/g, '_')].neutral += 1;
        break;
      case 'good':
        votes[question.replace(/\s/g, '_')].good += 1;
        break;
      case 'excellent':
        votes[question.replace(/\s/g, '_')].excellent += 1;
        break;
      default:
        console.error('Invalid answer type');
        encounterError = true;
        res.sendStatus(400);
    }
  });

  if (!encounterError) {
    totalVotes += 1;
    res.sendStatus(200);
  }
});

// Start the app.
app.listen(process.env.PORT || 3000);