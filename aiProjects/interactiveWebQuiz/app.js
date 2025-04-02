/**
 * INTERACTIVE WEB QUIZ APPLICATION
 * note: this application generates multiple choice questions using openAI's API.
 */

require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

/**
 * note: generate a new multiple choice question using openAI's API.
 * @returns {question: 'text', options: ['a','b','c','d'], answer: 'correct'} a new question object
 */
async function generateQuestion() {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: "Generate a multiple choice question with 4 options and the correct answer in JSON format like: {question: 'text', options: ['a','b','c','d'], answer: 'correct'}",
        max_tokens: 150
    });

    return JSON.parse(response.data.choices[0].text);
}

let questions = [];

async function refreshQuestions() {
    const newQuestion = await generateQuestion();
    questions = [newQuestion];
}

async function getQuestions() {
    if (questions.length === 0) {
        await refreshQuestions();
    }
    return questions;
}

let currentQuestionIndex = 0;
let score = 0;

function getNextQuestion() {
    if (currentQuestionIndex < questions.length) {
        return questions[currentQuestionIndex++];
    }

    return null;
}

/**
 * note: get the current question and its options
 * @param {} userAnswer
 * @param {} correctAnswer
 * @returns {object} current question and options
 */
function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer.toLwerCase() === correctAnswer.toLowerCase();
}

/**
 * note: update the score based on whether the user answered correctly or not
 * @param {boolean} isCorrect
 */
function updateScore(isCorrect) {
    if (isCorrect) {
        score++;
    }
}

/**
 * note: display the current question and its options
 * @param {object} question
 */
function displayQuestion(question) {
    console.log(question.question);
    question.options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
    });
}

/**
 * note: handle user input and update the score
 * @param {string} input
 * @returns {boolean} true if the answer is correct, false otherwise
 */
function handleUserInput(input) {
    const currentQuestion = questions[currentQuestionIndex - 1];
    const isCorrect = checkAnswer(input, currentQuestion.answer);
    updateScore(isCorrect);
    console.log(isCorrect ? 'Correct!' : 'Wrong!');
    return isCorrect;
}

/**
 * note: start the quiz and handle user input
 * @param {string} userInput
 * @returns {boolean} true if the answer is correct, false otherwise
 */
async function startQuiz() {
    await refreshQuestions();
    currentQuestionIndex = 0;
    const question = getNextQuestion();
    if (question) {
        displayQuestion(question);
    } else {
        console.log('No more questions available.');
    }
}

function endQuiz() {
    console.log(`Quiz ended. Final score: ${score}/${questions.length}`);
}

refreshQuestions().catch(console.error);
