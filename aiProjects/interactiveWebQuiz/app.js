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

function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach((button) => {
        button.addEventListener('click', function () {
            categoryButtons.forEach((btn) => btn.classList.remove('active'));
            this.classList.add('active');

            const selectedCategory = this.dataset.value;
            console.log('Selected category:', selectedCategory);

            startQuiz(selectedCategory);
        });
    });
}

/**
 * Generate a new multiple choice question using OpenAI's API.
 * @param {string} category
 * @returns {Promise<Object>}
 */
async function generateQuestion(category) {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate a multiple choice question about ${category} with 4 options and the correct answer in JSON format like: {question: 'text', options: ['a','b','c','d'], answer: 'correct'}`,
        max_tokens: 150
    });

    return JSON.parse(response.data.choices[0].text);
}

/**
 * Display the current question and its options
 * @param {object} question
 */
async function displayQuestion(question) {
    const questionElement = document.getElementById('question-container');
    const answerContainer = document.getElementById('answer-container');

    questionElement.textContent = question.question;
    answerContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('answer-option');
        button.addEventListener('click', () => handleUserInput(option, question.answer));
        answerContainer.appendChild(button);
    });
}

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

/**
 * Starts the quiz by generating a question for the selected category.
 * @param {string} category
 */
async function startQuiz(category) {
    await refreshQuestions(category);
    currentQuestionIndex = 0;
    score = 0;
    displayNextQuestion();
}

/**
 * Refresh questions based on the selected category.
 * @param {string} category
 */
async function refreshQuestions(category) {
    const newQuestion = await generateQuestion(category);
    questions = [newQuestion];
}

/**
 * Get the next question in the quiz.
 * @returns {Object|null}
 */
function getNextQuestion() {
    if (currentQuestionIndex < questions.length) {
        return questions[currentQuestionIndex++];
    }
    return null;
}

async function displayNextQuestion() {
    const question = getNextQuestion();
    if (question) {
        await displayQuestion(question);
    } else {
        endQuiz();
    }
}

/**
 * Check the answer provided by the user.
 * @param {string} userAnswer
 * @param {string} correctAnswer
 * @returns {boolean}
 */
function checkAnswer(userAnswer, correctAnswer) {
    return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
}

/**
 * Update the score and display the result.
 * @param {boolean} isCorrect
 */
function updateScore(isCorrect) {
    if (isCorrect) {
        score++;
    }
}

/**
 * Handle user input for the answer and show whether it's correct.
 * @param {string} userAnswer
 * @param {string} correctAnswer
 */
function handleUserInput(userAnswer, correctAnswer) {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    updateScore(isCorrect);

    const resultElement = document.getElementById('feedback');
    resultElement.textContent = isCorrect ? 'Correct!' : 'Wrong!';

    setTimeout(() => {
        resultElement.textContent = '';
        displayNextQuestion();
    }, 1000);
}

function endQuiz() {
    const quizElement = document.getElementById('quiz-container');
    quizElement.innerHTML = `<h2>Quiz ended. Final score: ${score}/${questions.length}</h2>`;
}

window.addEventListener('load', () => {
    setupCategoryButtons();
});
