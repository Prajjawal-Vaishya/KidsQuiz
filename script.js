document.addEventListener('DOMContentLoaded', () => {

    // --- DATA ---
    const quizzes = [
        { id: 'creative', title: 'Creative Mind Quiz', description: 'Test your imagination and creative thinking skills', icon: 'fa-palette', color: 'from-purple-600 to-blue-600', difficulty: 'Medium', questions: 8, time: '5 min' },
        { id: 'science', title: 'Science Explorer', description: 'Journey through fascinating scientific discoveries', icon: 'fa-rocket', color: 'from-blue-600 to-cyan-600', difficulty: 'Hard', questions: 10, time: '8 min' },
        { id: 'literature', title: 'Literary Legends', description: 'Explore the world of books and famous authors', icon: 'fa-book-open', color: 'from-green-600 to-emerald-600', difficulty: 'Medium', questions: 7, time: '4 min' },
        { id: 'geography', title: 'World Explorer', description: 'Test your knowledge of countries, capitals, and cultures', icon: 'fa-globe', color: 'from-orange-600 to-red-600', difficulty: 'Easy', questions: 12, time: '6 min' },
        { id: 'music', title: 'Musical Genius', description: 'From classical to modern - test your music knowledge', icon: 'fa-music', color: 'from-pink-600 to-purple-600', difficulty: 'Medium', questions: 9, time: '5 min' },
        { id: 'psychology', title: 'Mind Matters', description: 'Explore human behavior and psychological concepts', icon: 'fa-brain', color: 'from-indigo-600 to-blue-600', difficulty: 'Hard', questions: 8, time: '7 min' }
    ];

    const allQuestions = {
        creative: [ { question: "If you could time travel to any era...", options: ["Renaissance Italy...", "Ancient Greece...", "Industrial Revolution...", "Digital Age..."], correct: 0, explanation: "The Renaissance was a golden age of creativity..." }, { question: "What's the most creative way to solve plastic pollution?", options: ["Giant ocean vacuum cleaners", "Plastic-eating bacteria...", "Converting plastic to fuel", "All of the above..."], correct: 3, explanation: "The most creative solutions often combine multiple approaches..." } /*...Add all creative questions here */ ],
        science: [ { question: "What happens to your body in zero gravity...?", options: ["Bones become stronger", "Muscles and bones weaken...", "You grow taller...", "Brain function improves"], correct: 1, explanation: "Without gravity's constant pull, astronauts lose bone density..." }, { question: "Which discovery revolutionized our understanding of the universe's expansion?", options: ["Hubble's observation...", "Einstein's theory...", "Discovery of cosmic microwave...", "Identification of dark matter"], correct: 0, explanation: "Hubble's discovery that galaxies are moving away from us proved the universe is expanding!"} /*...Add all science questions here */ ],
        literature: [ { question: "Which opening line belongs to '1984'?", options: ["It was the best of times...", "Call me Ishmael", "It was a bright cold day in April...", "In a hole in the ground..."], correct: 2, explanation: "This iconic opening immediately establishes the dystopian world..." } /*...Add all literature questions here */ ]
        // NOTE: Fill in the rest of the questions from the React code for full functionality
    };

    // --- DOM ELEMENTS ---
    const homeView = document.getElementById('home-view');
    const quizView = document.getElementById('quiz-view');
    const completionView = document.getElementById('completion-view');
    const quizGrid = document.getElementById('quiz-grid');
    const quizHeader = document.getElementById('quiz-header');
    const progressBar = document.getElementById('progress-bar');
    const quizContent = document.getElementById('quiz-content');
    const finalScoreDisplay = document.getElementById('final-score-display');
    const scoreMessageEl = document.getElementById('score-message');
    const answerReviewEl = document.getElementById('answer-review');
    const retakeQuizBtn = document.getElementById('retake-quiz-btn');
    const backToHubBtn = document.getElementById('back-to-hub-btn');

    // --- STATE ---
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswerIndex = null;
    let userAnswers = [];


    // --- FUNCTIONS ---
    function showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    }

    function resetState() {
        currentQuestionIndex = 0;
        score = 0;
        selectedAnswerIndex = null;
        userAnswers = [];
    }
    
    function handleQuizSelect(quizId) {
        currentQuiz = quizzes.find(q => q.id === quizId);
        resetState();
        showView('quiz-view');
        renderQuiz();
    }

    function handleBackToHome() {
        currentQuiz = null;
        showView('home-view');
    }
    
    function renderHomePage() {
        quizGrid.innerHTML = '';
        quizzes.forEach(quiz => {
            const card = document.createElement('div');
            card.className = 'quiz-card';
            card.dataset.id = quiz.id;
            card.innerHTML = `
                <div class="quiz-card-header" style="background: linear-gradient(to right, var(--${quiz.color.split(' ')[0].replace('from-', '')}), var(--${quiz.color.split(' ')[1].replace('to-', '')}))">
                    <i class="fa-solid ${quiz.icon}"></i>
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                </div>
                <div class="quiz-card-body">
                    <div class="card-meta">
                        <span class="difficulty-badge difficulty-${quiz.difficulty}">${quiz.difficulty}</span>
                        <div class="card-time">${quiz.time}</div>
                    </div>
                    <div class="card-details">
                        <span class="card-info"><i class="fa-solid fa-book-open"></i> ${quiz.questions} questions</span>
                        <span class="card-info"><i class="fa-solid fa-trophy"></i> Score tracking</span>
                    </div>
                    <button class="start-quiz-btn" style="background: linear-gradient(to right, var(--${quiz.color.split(' ')[0].replace('from-', '')}), var(--${quiz.color.split(' ')[1].replace('to-', '')}))">Start Quiz</button>
                </div>
            `;
            card.addEventListener('click', () => handleQuizSelect(quiz.id));
            quizGrid.appendChild(card);
        });
    }

    function renderQuiz() {
        renderQuizHeader();
        updateProgressBar();
        renderQuestion();
    }
    
    function renderQuizHeader() {
        quizHeader.innerHTML = `
            <div class="quiz-header-top">
                <div class="quiz-title-container">
                    <i class="fa-solid ${currentQuiz.icon}"></i>
                    <h1>${currentQuiz.title}</h1>
                </div>
                <div class="quiz-header-info">
                    <button class="back-to-hub-btn-quiz">← Back to Hub</button>
                    <div class="quiz-stat">
                        <div class="label">Score</div>
                        <div class="value">${score}/${allQuestions[currentQuiz.id].length}</div>
                    </div>
                    <div class="quiz-stat">
                        <div class="label">Question</div>
                        <div class="value">${currentQuestionIndex + 1}/${allQuestions[currentQuiz.id].length}</div>
                    </div>
                </div>
            </div>
        `;
        quizHeader.querySelector('.back-to-hub-btn-quiz').addEventListener('click', handleBackToHome);
        quizHeader.style.background = `linear-gradient(to right, var(--${currentQuiz.color.split(' ')[0].replace('from-', '')}), var(--${currentQuiz.color.split(' ')[1].replace('to-', '')}))`;
    }
    
    function updateProgressBar() {
        const progress = ((currentQuestionIndex) / allQuestions[currentQuiz.id].length) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.style.background = `linear-gradient(to right, var(--${currentQuiz.color.split(' ')[0].replace('from-', '')}), var(--${currentQuiz.color.split(' ')[1].replace('to-', '')}))`;
    }

    function renderQuestion() {
        const questionData = allQuestions[currentQuiz.id][currentQuestionIndex];
        quizContent.innerHTML = `
            <h2 class="question-text">${questionData.question}</h2>
            <div class="options-grid">
                ${questionData.options.map((option, index) => `
                    <button class="option-btn" data-index="${index}">
                        <div class="option-btn-content">
                            <div class="option-circle">
                                ${selectedAnswerIndex === index ? '<i class="fa-solid fa-star"></i>' : ''}
                            </div>
                            <span class="option-text">${option}</span>
                        </div>
                    </button>
                `).join('')}
            </div>
            ${selectedAnswerIndex !== null ? `
                <div class="next-btn-container">
                    <button class="next-btn">${currentQuestionIndex + 1 === allQuestions[currentQuiz.id].length ? 'Finish Quiz' : 'Next Question'}</button>
                </div>
            ` : ''}
        `;

        // Add event listeners
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                selectedAnswerIndex = parseInt(e.currentTarget.dataset.index);
                renderQuestion(); // Re-render to show selection and Next button
            });
        });

        if (selectedAnswerIndex !== null) {
            document.querySelector('.next-btn').style.background = `linear-gradient(to right, var(--${currentQuiz.color.split(' ')[0].replace('from-', '')}), var(--${currentQuiz.color.split(' ')[1].replace('to-', '')}))`;
            document.querySelector('.next-btn').addEventListener('click', handleNextQuestion);
        }
    }
    
    function handleNextQuestion() {
        const questionData = allQuestions[currentQuiz.id][currentQuestionIndex];
        const isCorrect = selectedAnswerIndex === questionData.correct;

        userAnswers.push({
            question: questionData.question,
            selected: selectedAnswerIndex,
            correct: questionData.correct,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            score++;
        }

        renderResultFeedback(isCorrect);
        
        setTimeout(() => {
            if (currentQuestionIndex + 1 < allQuestions[currentQuiz.id].length) {
                currentQuestionIndex++;
                selectedAnswerIndex = null;
                renderQuiz();
            } else {
                showCompletionView();
            }
        }, 2500);
    }
    
    function renderResultFeedback(isCorrect) {
        const questionData = allQuestions[currentQuiz.id][currentQuestionIndex];
        let feedbackHTML = '';
        if (isCorrect) {
            feedbackHTML = `
                <div class="result-feedback">
                    <i class="fa-solid fa-check-circle correct"></i>
                    <h2 class="correct">Correct! ✨</h2>
                    <p class="explanation">${questionData.explanation}</p>
                </div>
            `;
        } else {
            feedbackHTML = `
                <div class="result-feedback">
                    <i class="fa-solid fa-times-circle incorrect"></i>
                    <h2 class="incorrect">Not quite! 💭</h2>
                    <p class="explanation">${questionData.explanation}</p>
                    <p class="correct-answer">The correct answer was: <strong>${questionData.options[questionData.correct]}</strong></p>
                </div>
            `;
        }
        quizContent.innerHTML = feedbackHTML;
    }

    function getScoreMessage(percentage) {
        if (percentage >= 90) return "🎉 Amazing! You're a true expert!";
        if (percentage >= 70) return "✨ Great job! Impressive knowledge!";
        if (percentage >= 50) return "🎯 Good work! You're on the right track!";
        return "🌱 Keep learning! Every expert was once a beginner!";
    }

    function getScoreColorClass(percentage) {
        if (percentage >= 90) return "score-value-purple-600";
        if (percentage >= 70) return "score-value-blue-600";
        if (percentage >= 50) return "score-value-green-600";
        return "score-value-orange-600";
    }

    function showCompletionView() {
        showView('completion-view');
        const questions = allQuestions[currentQuiz.id];
        const percentage = (score / questions.length) * 100;

        finalScoreDisplay.innerHTML = `<span class="${getScoreColorClass(percentage)}">${score}</span><span class="total-value">/${questions.length}</span>`;
        scoreMessageEl.textContent = getScoreMessage(percentage);

        let reviewHTML = '<h3 class="review-title">Your Answers:</h3>';
        userAnswers.forEach((answer, index) => {
            reviewHTML += `
                <div class="review-item">
                    <span class="question-label">Question ${index + 1}</span>
                    <i class="fa-solid ${answer.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                </div>
            `;
        });
        answerReviewEl.innerHTML = reviewHTML;
    }
    
    // --- INITIALIZATION ---
    renderHomePage();
    showView('home-view');

    // Event listeners for completion screen
    retakeQuizBtn.addEventListener('click', () => handleQuizSelect(currentQuiz.id));
    backToHubBtn.addEventListener('click', handleBackToHome);
});