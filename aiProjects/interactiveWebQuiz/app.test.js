const { Configuration, OpenAIApi } = require('openai');
const {
    generateQuestion,
    refreshQuestions,
    getQuestions,
    getNextQuestion,
    checkAnswer,
    updateScore,
    displayQuestion,
    handleUserInput,
    startQuiz,
    endQuiz
} = require('./app');

jest.mock('openai');

describe('Interactive Web Quiz Application', () => {
    let mockOpenAI;

    beforeEach(() => {
        mockOpenAI = {
            createCompletion: jest.fn()
        };
        OpenAIApi.mockImplementation(() => mockOpenAI);
    });
});

test('Should generate a valid multiple choice question with 4 options and a correct answer', async () => {
    const mockResponse = {
        data: {
            choices: [
                {
                    text: JSON.stringify({
                        question: 'What is the capital of France?',
                        options: ['London', 'Berlin', 'Paris', 'Madrid'],
                        answer: 'Paris'
                    })
                }
            ]
        }
    };

    mockOpenAI.createCompletion.mockResolvedValue(mockResponse);

    const question = await generateQuestion();

    expect(question).toHaveProperty('question');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('answer');
    expect(question.options).toHaveLength(4);
    expect(question.options).toContain(question.answer);
});

test('Should refresh questions when the question array is empty', async () => {
    questions = [];
    const mockQuestion = {
        question: 'What is the capital of Japan?',
        options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'],
        answer: 'Tokyo'
    };

    const mockGenerateQuestion = jest.spyOn(global, 'generateQuestion').mockResolvedValue(mockQuestion);

    const result = await getQuestions();

    expect(mockGenerateQuestion).toHaveBeenCalledTimes(1);
    expect(result).toEqual([mockQuestion]);
    expect(questions).toEqual([mockQuestion]);

    mockGenerateQuestion.mockRestore();
});

test('Should return null when all questions have been answered', () => {
    questions = [
        { question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' },
        { question: 'Q2', options: ['A', 'B', 'C', 'D'], answer: 'B' }
    ];
    currentQuestionIndex = 0;

    expect(getNextQuestion()).not.toBeNull();
    expect(getNextQuestion()).not.toBeNull();
    expect(getNextQuestion()).toBeNull();
});

test('Should correctly increment the score when a correct answer is given', () => {
    // Reset score and questions
    score = 0;
    questions = [{ question: 'What is 2+2?', options: ['3', '4', '5', '6'], answer: '4' }];
    currentQuestionIndex = 0;

    // Get the next question
    const question = getNextQuestion();

    // Simulate user input with correct answer
    const userInput = '4';
    const result = handleUserInput(userInput);

    // Check if the result is correct and score is incremented
    expect(result).toBe(true);
    expect(score).toBe(1);
});

test('Should not increment the score when an incorrect answer is given', () => {
    // Reset score and questions
    score = 0;
    questions = [{ question: 'What is 2+2?', options: ['3', '4', '5', '6'], answer: '4' }];
    currentQuestionIndex = 0;

    // Get the next question
    const question = getNextQuestion();

    // Simulate user input with incorrect answer
    const userInput = '5';
    const result = handleUserInput(userInput);

    // Check if the result is incorrect and score remains 0
    expect(result).toBe(false);
    expect(score).toBe(0);
});

test('Should correctly compare user answer with correct answer regardless of case', () => {
    const userAnswers = ['Paris', 'paris', 'PARIS', 'PaRiS'];
    const correctAnswer = 'Paris';

    userAnswers.forEach((userAnswer) => {
        expect(checkAnswer(userAnswer, correctAnswer)).toBe(true);
    });

    expect(checkAnswer('London', correctAnswer)).toBe(false);
});

test('Should display question and options in the correct format', () => {
    const mockQuestion = {
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid']
    };

    const consoleSpy = jest.spyOn(console, 'log');

    displayQuestion(mockQuestion);

    expect(consoleSpy).toHaveBeenCalledTimes(5);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'What is the capital of France?');
    expect(consoleSpy).toHaveBeenNthCalledWith(2, '1. London');
    expect(consoleSpy).toHaveBeenNthCalledWith(3, '2. Berlin');
    expect(consoleSpy).toHaveBeenNthCalledWith(4, '3. Paris');
    expect(consoleSpy).toHaveBeenNthCalledWith(5, '4. Madrid');

    consoleSpy.mockRestore();
});

test('Should handle user input correctly and return true for correct answers', () => {
    // Reset score and questions
    score = 0;
    questions = [
        {
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            answer: 'Paris'
        }
    ];
    currentQuestionIndex = 1;

    // Simulate user input with correct answer
    const userInput = 'Paris';
    const result = handleUserInput(userInput);

    // Check if the result is correct and score is incremented
    expect(result).toBe(true);
    expect(score).toBe(1);
});

test('Should handle user input correctly and return false for incorrect answers', () => {
    // Reset score and questions
    score = 0;
    questions = [
        {
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            answer: 'Paris'
        }
    ];
    currentQuestionIndex = 0;

    // Get the next question
    const question = getNextQuestion();

    // Simulate user input with incorrect answer
    const userInput = 'London';
    const result = handleUserInput(userInput);

    // Check if the result is incorrect and score remains 0
    expect(result).toBe(false);
    expect(score).toBe(0);
});

test('Should start the quiz by refreshing questions and displaying the first question', async () => {
    // Mock the necessary functions
    const mockRefreshQuestions = jest.spyOn(global, 'refreshQuestions').mockResolvedValue();
    const mockGetNextQuestion = jest.spyOn(global, 'getNextQuestion').mockReturnValue({
        question: 'Test question?',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A'
    });
    const mockDisplayQuestion = jest.spyOn(global, 'displayQuestion').mockImplementation();

    // Call the startQuiz function
    await startQuiz();

    // Check if refreshQuestions was called
    expect(mockRefreshQuestions).toHaveBeenCalledTimes(1);

    // Check if currentQuestionIndex was reset to 0
    expect(currentQuestionIndex).toBe(0);

    // Check if getNextQuestion was called
    expect(mockGetNextQuestion).toHaveBeenCalledTimes(1);

    // Check if displayQuestion was called with the correct question
    expect(mockDisplayQuestion).toHaveBeenCalledWith({
        question: 'Test question?',
        options: ['A', 'B', 'C', 'D'],
        answer: 'A'
    });

    // Restore the original implementations
    mockRefreshQuestions.mockRestore();
    mockGetNextQuestion.mockRestore();
    mockDisplayQuestion.mockRestore();
});

test('Should end the quiz by displaying the final score', () => {
    // Mock console.log to capture output
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    // Set up test scenario
    questions = [
        { question: 'Q1', options: ['A', 'B', 'C', 'D'], answer: 'A' },
        { question: 'Q2', options: ['A', 'B', 'C', 'D'], answer: 'B' },
        { question: 'Q3', options: ['A', 'B', 'C', 'D'], answer: 'C' }
    ];
    score = 2;

    // Call the function to be tested
    endQuiz();

    // Assert that console.log was called with the correct message
    expect(mockConsoleLog).toHaveBeenCalledWith('Quiz ended. Final score: 2/3');

    // Restore the original console.log
    mockConsoleLog.mockRestore();
});

test('Should handle errors when OpenAI API call fails', async () => {
    const errorMessage = 'API request failed';
    mockOpenAI.createCompletion.mockRejectedValue(new Error(errorMessage));

    await expect(generateQuestion()).rejects.toThrow(errorMessage);

    // Test that refreshQuestions handles the error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await refreshQuestions();
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();

    // Test that getQuestions handles the error
    questions = [];
    await expect(getQuestions()).resolves.toEqual([]);
});
