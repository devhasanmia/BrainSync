import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Plus, Trash2 } from 'lucide-react';
import type { Question } from '../types';

interface QuizSettings {
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionType: 'mcq' | 'short' | 'truefalse' | 'mixed';
  numberOfQuestions: number;
}

interface QuizState {
  currentQuestion: number;
  answers: string[];
  score: number;
  showResults: boolean;
}

const SUBJECTS = ['Mathematics', 'Science', 'History', 'Literature', 'Geography', 'Computer Science', 'Other'];

export function QuizGenerator() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [isCreatingQuestion, setIsCreatingQuestion] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    subject: 'Mathematics',
    difficulty: 'medium',
    questionType: 'mixed',
    numberOfQuestions: 5,
  });
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    score: 0,
    showResults: false,
  });
  const [activeQuiz, setActiveQuiz] = useState<Question[]>([]);

  const [newQuestion, setNewQuestion] = useState({
    type: 'mcq' as 'mcq' | 'short' | 'truefalse',
    subject: 'Mathematics',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
  });

  
  const fetchCustomQuestions = async () => {
   
  };

  const generateSampleQuestions = (settings: QuizSettings): Question[] => {
    const sampleQuestions: { [key: string]: Question[] } = {
      Mathematics: [
        {
          id: '1',
          type: 'mcq',
          subject: 'Mathematics',
          difficulty: 'easy',
          question: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '4',
          explanation: 'Basic addition: 2 + 2 = 4',
        },
        {
          id: '2',
          type: 'mcq',
          subject: 'Mathematics',
          difficulty: 'medium',
          question: 'What is the derivative of x²?',
          options: ['x', '2x', '2x²', 'x²'],
          correctAnswer: '2x',
          explanation: 'Using power rule: d/dx(x²) = 2x',
        },
      ],
      Science: [
        {
          id: '3',
          type: 'truefalse',
          subject: 'Science',
          difficulty: 'easy',
          question: 'Water boils at 100°C at sea level.',
          correctAnswer: 'True',
          explanation: 'Water boils at 100°C (212°F) at standard atmospheric pressure.',
        },
      ],
    };

    const subjectQuestions = sampleQuestions[settings.subject] || [];
    const filteredQuestions = subjectQuestions.filter(q => q.difficulty === settings.difficulty);
    
    // Combine with custom questions
    const userQuestions = customQuestions.filter(q => 
      q.subject === settings.subject && q.difficulty === settings.difficulty
    );

    const allQuestions = [...filteredQuestions, ...userQuestions];
    
    return allQuestions.slice(0, settings.numberOfQuestions);
  };

  const startQuiz = () => {
    
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answer;
    setQuizState({ ...quizState, answers: newAnswers });
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < activeQuiz.length - 1) {
      setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion + 1 });
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let score = 0;
    activeQuiz.forEach((question, index) => {
      if (quizState.answers[index] === question.correctAnswer) {
        score++;
      }
    });

    setQuizState({ ...quizState, score, showResults: true });
  };

  const resetQuiz = () => {
    setActiveQuiz([]);
    setQuizState({
      currentQuestion: 0,
      answers: [],
      score: 0,
      showResults: false,
    });
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

  };

  const deleteCustomQuestion = async (questionId: string) => {
   
  };

  if (activeQuiz.length > 0 && !quizState.showResults) {
    const currentQuestion = activeQuiz[quizState.currentQuestion];
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Question {quizState.currentQuestion + 1} of {activeQuiz.length}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {currentQuestion.subject}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>

            {currentQuestion.type === 'mcq' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border transition-colors ${
                      quizState.answers[quizState.currentQuestion] === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'truefalse' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-lg border transition-colors ${
                      quizState.answers[quizState.currentQuestion] === option
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'short' && (
              <textarea
                value={quizState.answers[quizState.currentQuestion]}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Type your answer here..."
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={resetQuiz}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Restart Quiz</span>
            </button>

            <button
              onClick={nextQuestion}
              disabled={!quizState.answers[quizState.currentQuestion]}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {quizState.currentQuestion < activeQuiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizState.showResults) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
              quizState.score / activeQuiz.length >= 0.7 ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              {quizState.score / activeQuiz.length >= 0.7 ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-orange-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-gray-600">
              You scored {quizState.score} out of {activeQuiz.length}
            </p>
            <p className="text-lg font-semibold mt-2 text-gray-800">
              {Math.round((quizState.score / activeQuiz.length) * 100)}%
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {activeQuiz.map((question, index) => (
              <div key={index} className="text-left p-4 border rounded-lg">
                <p className="font-medium text-gray-800 mb-2">{question.question}</p>
                <p className="text-sm text-gray-600 mb-1">
                  Your answer: <span className={quizState.answers[index] === question.correctAnswer ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {quizState.answers[index] || 'Not answered'}
                  </span>
                </p>
                <p className="text-sm text-green-600">
                  Correct answer: <span className="font-medium">{question.correctAnswer}</span>
                </p>
                {question.explanation && (
                  <p className="text-sm text-gray-500 mt-2 italic">{question.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={resetQuiz}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quiz Generator</h1>
          <p className="text-gray-600 mt-1">Generate practice quizzes to test your knowledge</p>
        </div>
        <button
          onClick={() => setIsCreatingQuestion(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Question</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quiz Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={quizSettings.subject}
                onChange={(e) => setQuizSettings({ ...quizSettings, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={quizSettings.difficulty}
                onChange={(e) => setQuizSettings({ ...quizSettings, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select
                value={quizSettings.questionType}
                onChange={(e) => setQuizSettings({ ...quizSettings, questionType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="mixed">Mixed</option>
                <option value="mcq">Multiple Choice</option>
                <option value="truefalse">True/False</option>
                <option value="short">Short Answer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={quizSettings.numberOfQuestions}
                onChange={(e) => setQuizSettings({ ...quizSettings, numberOfQuestions: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <HelpCircle className="h-4 w-4 inline mr-2" />
              Generate Quiz
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Custom Questions</h3>
          
          {customQuestions.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No custom questions yet</p>
              <p className="text-sm text-gray-400">Click "Add Question" to create your first question</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customQuestions.map((question) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-gray-800 text-sm">{question.question}</p>
                    <button
                      onClick={() => deleteCustomQuestion(question.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {question.subject}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      {question.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Question Modal */}
      {isCreatingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Question</h3>
            
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ 
                      ...newQuestion, 
                      type: e.target.value as 'mcq' | 'short' | 'truefalse',
                      options: e.target.value === 'mcq' ? ['', '', '', ''] : ['']
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="truefalse">True/False</option>
                    <option value="short">Short Answer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={newQuestion.subject}
                  onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>

              {newQuestion.type === 'mcq' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: newOptions });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        required
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                {newQuestion.type === 'truefalse' ? (
                  <select
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select correct answer</option>
                    <option value="True">True</option>
                    <option value="False">False</option>
                  </select>
                ) : newQuestion.type === 'mcq' ? (
                  <select
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select correct answer</option>
                    {newQuestion.options.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                <textarea
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Explain why this is the correct answer..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Question
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingQuestion(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}