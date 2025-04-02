/**
 * Interactive Web Quiz Application
 * This application generates multiple choice questions using OpenAI's API and serves them to a web interface.
 */

require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

/**
 * note: generate a new multiple choice question using openAI's API.
 * return: {question: 'text', options: ['a','b','c','d'], answer: 'correct'}
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
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        return questions[currentQuestionIndex];
    } else {
        console.log(`Quiz complete! Final score: ${score}`);
        process.exit(0);
    }
}

/**
 * Get the current question and its options
 * @param {} userAnswer
 * @returns {object} current question and options
 */
function checkAnswer(userAnswer) {
    const currentQuestion = questions[0];
    return currentQuestion.answer === userAnswer;
}

function updateScore(isCorrect) {
    if (isCorrect) {
        score++;
    }
}

function displayQuestion(question) {
    console.log(`Question: ${question.question}`);
    question.options.forEach((option, index) => {
        console.log(`${index + 1}. ${option}`);
    });
}

function handleUserInput(input) {
    const userAnswer = parseInt(input) - 1;
    const isCorrect = checkAnswer(question.options[userAnswer]);
    updateScore(isCorrect);
    console.log(`Your answer: ${question.options[userAnswer]}`);
    console.log(`Correct answer: ${question.answer}`);
    console.log(`Score: ${score}`);
    questions.shift();
}

startQuiz = async () => {
    const question = await getQuestions();
    displayQuestion(question[0]);
    // Simulate user input
    const userInput = prompt('Enter your answer (1-4): ');
    handleUserInput(userInput);
};

function endQuiz() {
    console.log('Quiz ended. Final score: ' + score);
    process.exit(0);
}

refreshQuestions().catch(console.error);
