const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//localStorage init
if (typeof localStorage === "undefined" || localStorage === null) {
	  var LocalStorage = require('node-localstorage').LocalStorage;
	  localStorage = new LocalStorage('./scratch');
	}

//eightball answers
var answerpool = [
	'Not in a million years.',
	'Good luck getting a straight answer out of a magic 8 ball.',
	'You must be desperate to come to me for help.',
	'Legally we have to say no, but should you do it anyway, send pictures.',
	'Do what jesus would do, take a 3 day nap, and then do it.',
	'The power of YES compells you',
	'Maybe you should do something else.',
	'DO THE THING!!!'
];

var newAnswers = answerpool;

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000');
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

//redirect to main page
app.get('/', (req, res) => {
	   res.redirect('/eightball');
	});

//render eightball page
app.get('/eightball', (req, res) => {
	
	res.render('eightball.ejs', { question: '' });
	
});

app.post('/eightball', (req, res) => {
	localStorage.clear();
	console.log(req.body.question);
	var question = {question: req.body.question};
	var answer = '';
	var questionExists = localStorage.getItem(question);
	console.log(localStorage.getItem(question));
	if(questionExists != null){
		answer = questionExists;
	}
	else{
		if (newAnswers.length > 0) {
			var index = Math.floor(Math.random()*newAnswers.length);
			var answer = newAnswers[index];
			delete newAnswers[index];
			localStorage.setItem(question, answer);
		}
		else {
			newAnswers = answerpool;
			var index = Math.floor(Math.random()*newAnswers.length);
			var answer = newAnswers[index];
			delete newAnswers[index];
			localStorage.setItem(question, answer);
		}
		
	}

	
	res.render('eightball_answer.ejs', {question: question, answer: answer})
})