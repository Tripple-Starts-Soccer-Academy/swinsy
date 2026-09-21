import React, { useEffect, useRef, useState } from 'react';
import { Clock, Play, CheckCircle, XCircle, RotateCcw, ChevronRight, Search } from 'lucide-react';
import { BookTestGenerator } from './BookTestGenerator';
import type { Question, SampleTest } from '../types/tests';

const LEVELS = ['Easy', 'Medium', 'Hard'];
const TOPICS = ['Python', 'OOP', 'Math', 'Data Science', 'Machine Learning', 'Web Development'];
const SCHOOLS = ['Elementary', 'Middle School', 'High School', 'College'];

const SAMPLE_TESTS: SampleTest[] = [
  {
    id: 'python-basics',
    title: 'Python Basics',
    category: 'Python',
    topic: 'Python',
    schoolLevel: 'Middle School',
    description: 'Test your understanding of Python fundamentals.',
    level: 'Easy',
    questions: [
      {
        question: 'What is the output of print(2 + 3 * 4)?',
        options: ['20', '14', '24', '18'],
        answer: 1,
      },
      {
        question: 'Which keyword is used to define a function in Python?',
        options: ['func', 'function', 'def', 'define'],
        answer: 2,
      },
      {
        question: 'What does the len() function do?',
        options: ['Returns the type', 'Returns the length', 'Converts to a list', 'Sorts a list'],
        answer: 1,
      },
      {
        question: 'How do you start a for loop in Python?',
        options: ['for i in range:', 'for (i = 0; i < 10; i++)', 'for i in range(10):', 'foreach i in range:'],
        answer: 2,
      },
      {
        question: 'Which data type is used to store a sequence of characters?',
        options: ['int', 'list', 'str', 'bool'],
        answer: 2,
      },
    ],
  },
  {
    id: 'python-intermediate',
    title: 'Python Intermediate',
    category: 'Python',
    topic: 'OOP',
    schoolLevel: 'High School',
    description: 'OOP, list comprehensions, and more advanced topics.',
    level: 'Medium',
    questions: [
      {
        question: 'Which symbol is used to define a class in Python?',
        options: ['function', 'class', 'def', 'object'],
        answer: 1,
      },
      {
        question: 'What is the output of [x for x in range(3)]?',
        options: ['[0, 1, 2]', '[1, 2, 3]', '[0, 1, 2, 3]', 'range(0, 3)'],
        answer: 0,
      },
      {
        question: 'What does the @staticmethod decorator do?',
        options: ['Makes a method a property', 'Defines a class variable', 'Creates a method that does not take self', 'Converts a method to a string'],
        answer: 2,
      },
      {
        question: 'Which of these is a mutable built-in type?',
        options: ['tuple', 'str', 'list', 'int'],
        answer: 2,
      },
      {
        question: 'What is the correct way to import only sqrt from the math module?',
        options: ['import sqrt from math', 'from math import sqrt', 'import math.sqrt', 'include math.sqrt'],
        answer: 1,
      },
    ],
  },
  {
    id: 'math-fundamentals',
    title: 'Math Fundamentals',
    category: 'Math',
    topic: 'Math',
    schoolLevel: 'Elementary',
    description: 'Review arithmetic, algebra, and basic problem solving.',
    level: 'Easy',
    questions: [
      {
        question: 'What is 7 × 8?',
        options: ['54', '56', '48', '64'],
        answer: 1,
      },
      {
        question: 'What is the value of x in 2x + 4 = 10?',
        options: ['2', '3', '4', '7'],
        answer: 1,
      },
      {
        question: 'What is the area of a rectangle with length 5 and width 3?',
        options: ['8', '15', '16', '10'],
        answer: 1,
      },
      {
        question: 'Which is the largest?',
        options: ['1/2', '2/3', '1/3', '3/4'],
        answer: 3,
      },
      {
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '14'],
        answer: 2,
      },
    ],
  },
];

const TIME_LIMIT = 300; // 5 minutes

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const PracticeTests: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [query, setQuery] = useState('');
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [customTest, setCustomTest] = useState<SampleTest | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedSchool, setSelectedSchool] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'sample' | 'book'>('sample');
  const intervalRef = useRef<number | null>(null);

  const finish = () => {
    setFinished(true);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const finalScore = answers.reduce(
      (acc, a, i) => (a === questions[i].answer ? acc + 1 : acc),
      0
    );
    const finalPercent = questions.length
      ? Math.round((finalScore / questions.length) * 100)
      : 0;
    const history: { date: string; score: number; total: number; percent: number }[] = JSON.parse(
      localStorage.getItem('yarichard-test-scores') || '[]'
    );
    history.push({
      date: new Date().toISOString(),
      score: finalScore,
      total: questions.length,
      percent: finalPercent,
    });
    localStorage.setItem('yarichard-test-scores', JSON.stringify(history));
  };

  const start = (test?: SampleTest | string) => {
    let qs: Question[] = [];

    if (typeof test === 'object' && test !== null) {
      setCustomTest(test);
      setActiveTestId(null);
      qs = test.questions;
    } else if (typeof test === 'string') {
      setCustomTest(null);
      setActiveTestId(test);
      const sample = SAMPLE_TESTS.find((t) => t.id === test);
      qs = sample?.questions || [];
    } else {
      if (customTest) {
        qs = customTest.questions;
      } else if (activeTestId) {
        const sample = SAMPLE_TESTS.find((t) => t.id === activeTestId);
        qs = sample?.questions || [];
      } else {
        return;
      }
    }

    const timeLimit = Math.max(TIME_LIMIT, qs.length * 45);
    setStarted(true);
    setFinished(false);
    setCurrent(0);
    setAnswers([]);
    setTimeLeft(timeLimit);
  };

  const backToTests = () => {
    setStarted(false);
    setFinished(false);
    setActiveTestId(null);
    setCustomTest(null);
    setCurrent(0);
    setAnswers([]);
  };

  useEffect(() => {
    if (started && !finished) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [started, finished]);

  const select = (index: number) => {
    const next = [...answers];
    next[current] = index;
    setAnswers(next);
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      finish();
    }
  };

  const activeTest = customTest ?? SAMPLE_TESTS.find((t) => t.id === activeTestId);
  const questions = activeTest?.questions || [];
  const filteredTests = SAMPLE_TESTS.filter(
    (t) =>
      (selectedLevel === 'All' || t.level === selectedLevel) &&
      (selectedTopic === 'All' || t.topic === selectedTopic) &&
      (selectedSchool === 'All' || t.schoolLevel === selectedSchool) &&
      (t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase()) ||
        t.topic.toLowerCase().includes(query.toLowerCase()) ||
        t.schoolLevel.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.level.toLowerCase().includes(query.toLowerCase()))
  );

  const score = answers.reduce((acc, a, i) => (a === questions[i].answer ? acc + 1 : acc), 0);
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const grade = percent >= 90 ? 'A' : percent >= 80 ? 'B' : percent >= 70 ? 'C' : percent >= 60 ? 'D' : 'F';
  const passed = percent >= 70;

  return (
    <div className="bg-white rounded-lg shadow p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Practice Tests</h2>
        {started && !finished && (
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {!started && !finished ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All levels</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All topics</option>
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All school levels</option>
              {SCHOOLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('sample')}
              className={`pb-2 text-sm font-medium ${activeTab === 'sample' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sample Tests
            </button>
            <button
              onClick={() => setActiveTab('book')}
              className={`pb-2 text-sm font-medium ${activeTab === 'book' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              From My Book
            </button>
          </div>

          {activeTab === 'sample' ? (
            <div>
              {filteredTests.length === 0 ? (
                <p className="text-gray-600">No sample tests match your filters.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{test.title}</h3>
                        <div className="flex space-x-2">
                          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {test.category}
                          </span>
                          <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                            {test.level}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{test.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {test.questions.length} questions • {TIME_LIMIT / 60} min
                        </span>
                        <button
                          onClick={() => start(test.id)}
                          className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                          <span>Start</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <BookTestGenerator
              onStart={start}
              levels={LEVELS}
              topics={TOPICS}
              schools={SCHOOLS}
            />
          )}
        </div>
      ) : finished ? (
        <div className="text-center py-8">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {score} / {questions.length}
          </div>
          <p className="text-gray-600 mb-2">
            You got {score} out of {questions.length} correct.
          </p>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            Grade: <span className={passed ? 'text-green-600' : 'text-red-600'}>{grade}</span>
          </div>
          <p className={`text-sm mb-6 ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {percent}% — {passed ? 'You passed!' : 'Keep practicing to improve.'}
          </p>
          <div className="flex justify-center space-x-3 mb-6">
            <button
              onClick={() => start()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake</span>
            </button>
            <button
              onClick={backToTests}
              className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span>Back to Tests</span>
            </button>
          </div>
          <div className="space-y-3 max-w-xl mx-auto text-left">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.answer;
              return (
                <div key={i} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-start space-x-3">
                    {isCorrect ? <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" /> : <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                    <div>
                      <p className="font-medium text-gray-900">{q.question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your answer: {answers[i] !== undefined ? q.options[answers[i]] : '—'}<br />
                        Correct answer: {q.options[q.answer]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              Question {current + 1} of {questions.length}
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mt-1">{questions[current].question}</h3>
          </div>
          <div className="space-y-3 mb-6">
            {questions[current].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => select(idx)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  answers[current] === idx
                    ? 'bg-blue-50 border-blue-500 text-blue-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={nextQuestion}
              disabled={answers[current] === undefined}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{current === questions.length - 1 ? 'Finish' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
