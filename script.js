const questions = [
    {
        question: "What is the correct syntax for referencing an external script called 'xxx.js'?",
        answers: ["<script href='xxx.js'>", "<script name='xxx.js'>", "<script src='xxx.js'>", "<script file='xxx.js'>"],
        correct: 2
    },
    {
        question: "Which attribute is used to state that an input field must be filled out?",
        answers: ["validate", "required", "placeholder", "form-required"],
        correct: 1
    },
    {
        question: "How do you select an element with id 'demo' in JavaScript?",
        answers: ["document.getElementsById('demo')", "document.querySelector('.demo')", "document.getElementById('demo')", "document.getElementById('demo')"],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timerId = null;

// Lấy các element màn hình
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

// Lấy các component tương tác
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const timerDisplay = document.getElementById('timer-display');
const questionCounter = document.getElementById('question-counter');
const finalScore = document.getElementById('final-score');

function showScreen(screen) {
    startScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    screen.classList.remove('hidden');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    nextBtn.classList.add('hidden');
    answerButtons.innerHTML = '';
    
    const currentQuestion = questions[currentQuestionIndex];
    questionCounter.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    questionText.innerText = currentQuestion.question;

    // Sinh các nút đáp án
    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer;
        button.className = 'btn';
        button.addEventListener('click', () => selectAnswer(button, index));
        answerButtons.appendChild(button);
    });

    // Reset và bắt đầu chạy Timer
    timeLeft = 60;
    timerDisplay.innerText = `Time Left: ${timeLeft}s`;
    clearInterval(timerId);
    
    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `Time Left: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            handleTimeout();
        }
    }, 1000);
}

function selectAnswer(selectedButton, index) {
    clearInterval(timerId); // Dừng đếm ngược ngay khi bấm chọn
    const currentQuestion = questions[currentQuestionIndex];
    
    // Vô hiệu hóa tất cả các nút để không cho bấm lại
    const buttons = answerButtons.querySelectorAll('.btn');
    buttons.forEach(btn => btn.disabled = true);

    // Kiểm tra đúng hay sai
    if (index === currentQuestion.correct) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
        // Cho người dùng biết đáp án đúng bằng cách tô xanh nó lên
        buttons[currentQuestion.correct].classList.add('correct');
    }

    nextBtn.classList.remove('hidden');
}

function handleTimeout() {
    const currentQuestion = questions[currentQuestionIndex];
    const buttons = answerButtons.querySelectorAll('.btn');
    buttons.forEach(btn => btn.disabled = true);
    
    // Đề bài yêu cầu: If user doesn't attempt in time, score decremented by 1
    score--; 
    
    // Hiện đáp án đúng để người dùng học tập
    buttons[currentQuestion.correct].classList.add('correct');
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        clearInterval(timerId);
        finalScore.innerText = score;
        showScreen(resultScreen);
    }
});

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', startQuiz);