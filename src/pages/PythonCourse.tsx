import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Play, BookOpen, Code, Target, Clock, Users, Award } from 'lucide-react';

export const PythonCourse: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const allChapters = [
    {
      id: 1,
      title: 'Introduction to Python',
      description: 'Learn the basics of Python programming and why it\'s popular',
      duration: '45 minutes',
      lessons: [
        { id: '1-1', title: 'What is Python?', duration: '10 min', type: 'video', completed: true },
        { id: '1-2', title: 'Setting up Python Environment', duration: '15 min', type: 'video', completed: true },
        { id: '1-3', title: 'Your First Python Program', duration: '10 min', type: 'interactive', completed: false },
        { id: '1-4', title: 'Chapter Quiz', duration: '10 min', type: 'quiz', completed: false }
      ],
      isLocked: false,
      progress: 50
    },
    {
      id: 2,
      title: 'Variables and Data Types',
      description: 'Understanding variables, numbers, strings, and basic data operations',
      duration: '60 minutes',
      lessons: [
        { id: '2-1', title: 'Variables and Assignment', duration: '12 min', type: 'video', completed: false },
        { id: '2-2', title: 'Numbers and Math Operations', duration: '15 min', type: 'video', completed: false },
        { id: '2-3', title: 'Strings and String Methods', duration: '18 min', type: 'video', completed: false },
        { id: '2-4', title: 'Practice: Data Types', duration: '15 min', type: 'interactive', completed: false }
      ],
      isLocked: false,
      progress: 0
    },
    {
      id: 3,
      title: 'Control Flow',
      description: 'Learn about conditional statements and loops to control program flow',
      duration: '75 minutes',
      lessons: [
        { id: '3-1', title: 'If Statements', duration: '15 min', type: 'video', completed: false },
        { id: '3-2', title: 'Else and Elif', duration: '12 min', type: 'video', completed: false },
        { id: '3-3', title: 'For Loops', duration: '18 min', type: 'video', completed: false },
        { id: '3-4', title: 'While Loops', duration: '15 min', type: 'video', completed: false },
        { id: '3-5', title: 'Practice: Loops and Conditions', duration: '15 min', type: 'interactive', completed: false }
      ],
      isLocked: false,
      progress: 0
    },
    {
      id: 4,
      title: 'Functions',
      description: 'Create reusable code with functions and learn about parameters and return values',
      duration: '90 minutes',
      lessons: [
        { id: '4-1', title: 'Defining Functions', duration: '20 min', type: 'video', completed: false },
        { id: '4-2', title: 'Parameters and Arguments', duration: '18 min', type: 'video', completed: false },
        { id: '4-3', title: 'Return Values', duration: '15 min', type: 'video', completed: false },
        { id: '4-4', title: 'Scope and Lifetime', duration: '17 min', type: 'video', completed: false },
        { id: '4-5', title: 'Practice: Building Functions', duration: '20 min', type: 'interactive', completed: false }
      ],
      isLocked: false,
      progress: 0
    },
    {
      id: 5,
      title: 'Lists and Tuples',
      description: 'Work with collections of data using lists and tuples',
      duration: '80 minutes',
      lessons: [
        { id: '5-1', title: 'Introduction to Lists', duration: '18 min', type: 'video', completed: false },
        { id: '5-2', title: 'List Operations and Methods', duration: '20 min', type: 'video', completed: false },
        { id: '5-3', title: 'List Comprehensions', duration: '15 min', type: 'video', completed: false },
        { id: '5-4', title: 'Tuples and Immutability', duration: '12 min', type: 'video', completed: false },
        { id: '5-5', title: 'Practice: Working with Lists', duration: '15 min', type: 'interactive', completed: false }
      ],
      isLocked: false,
      progress: 0
    },
    {
      id: 6,
      title: 'Dictionaries and Sets',
      description: 'Learn about key-value pairs and unique collections',
      duration: '70 minutes',
      lessons: [
        { id: '6-1', title: 'Introduction to Dictionaries', duration: '18 min', type: 'video', completed: false },
        { id: '6-2', title: 'Dictionary Operations', duration: '15 min', type: 'video', completed: false },
        { id: '6-3', title: 'Sets and Set Operations', duration: '12 min', type: 'video', completed: false },
        { id: '6-4', title: 'Practice: Data Structures', duration: '25 min', type: 'interactive', completed: false }
      ],
      isLocked: false,
      progress: 0
    },
    {
      id: 7,
      title: 'File I/O Operations',
      description: 'Read from and write to files in Python',
      duration: '65 minutes',
      lessons: [
        { id: '7-1', title: 'Reading Files', duration: '18 min', type: 'video', completed: false },
        { id: '7-2', title: 'Writing Files', duration: '15 min', type: 'video', completed: false },
        { id: '7-3', title: 'Working with CSV Files', duration: '17 min', type: 'video', completed: false },
        { id: '7-4', title: 'Practice: File Operations', duration: '15 min', type: 'interactive', completed: false }
      ],
      isLocked: false,
      progress: 0
    },
    {
      id: 8,
      title: 'Error Handling',
      description: 'Learn to handle errors and exceptions gracefully',
      duration: '55 minutes',
      lessons: [
        { id: '8-1', title: 'Understanding Exceptions', duration: '15 min', type: 'video', completed: false },
        { id: '8-2', title: 'Try and Except Blocks', duration: '18 min', type: 'video', completed: false },
        { id: '8-3', title: 'Finally and Else Blocks', duration: '12 min', type: 'video', completed: false },
        { id: '8-4', title: 'Practice: Error Handling', duration: '10 min', type: 'interactive', completed: false }
      ],
      isLocked: false,
      progress: 0
    }
  ];

  const getChapter = (id: number) => allChapters.find(c => c.id === id)!;

  const sections = [
    {
      id: 'basics',
      title: 'Basics & Overview',
      description: 'Get to know Python, set up your environment, and understand core ideas',
      chapterIds: [1, 2]
    },
    {
      id: 'beginner',
      title: 'Beginners',
      description: 'Control flow and functions to write your first useful programs',
      chapterIds: [3, 4]
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Work with collections, dictionaries, sets, and file input/output',
      chapterIds: [5, 6]
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Handle errors and exceptions like an experienced Python developer',
      chapterIds: [7, 8]
    }
  ];

  const handleLessonClick = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'interactive':
        return <Code className="h-4 w-4" />;
      case 'quiz':
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const totalLessons = allChapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);
  const completedCount = completedLessons.length;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/courses" className="hover:text-blue-600">Courses</Link>
            <span>/</span>
            <span className="text-gray-900">Python Basics</span>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">Python Basics Course</h1>
                <p className="text-blue-100 mb-6 max-w-2xl">
                  Master the fundamentals of Python programming through interactive lessons, 
                  hands-on exercises, and real-world projects.
                </p>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>8 chapters • {totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>352 students enrolled</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Certificate included</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{Math.round(progressPercentage)}%</div>
                <div className="text-blue-100 mb-4">Complete</div>
                <div className="bg-white bg-opacity-20 rounded-full h-2 w-32">
                  <div 
                    className="bg-white h-2 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {sections.map((section) => (
                  <div key={section.id} className="p-6">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{section.title}</h3>
                          <p className="text-sm text-gray-600">{section.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{section.chapterIds.length} chapters</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className={`transform transition-transform ${
                          selectedSection === section.id ? 'rotate-180' : ''
                        }`}>
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {selectedSection === section.id && (
                      <div className="mt-4 space-y-2">
                        {section.chapterIds.map((chapterId) => {
                          const chapter = getChapter(chapterId);
                          return (
                            <div key={chapter.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                              <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setSelectedChapter(selectedChapter === chapter.id ? null : chapter.id)}
                              >
                                <div className="flex items-center space-x-3">
                                  {chapter.isLocked ? (
                                    <Lock className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <div className="bg-white rounded-full p-2">
                                      <BookOpen className="h-4 w-4 text-blue-600" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-semibold text-gray-900">
                                      Chapter {chapter.id}: {chapter.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">{chapter.description}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                      <span>{chapter.lessons.length} lessons</span>
                                      <span>{chapter.duration}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900">{chapter.progress}%</div>
                                    <div className="bg-gray-200 rounded-full h-1 w-16">
                                      <div 
                                        className="bg-blue-600 h-1 rounded-full" 
                                        style={{ width: `${chapter.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                  <div className={`transform transition-transform ${
                                    selectedChapter === chapter.id ? 'rotate-180' : ''
                                  }`}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>

                              {selectedChapter === chapter.id && (
                                <div className="mt-4 space-y-2">
                                  {chapter.lessons.map((lesson) => {
                                    const isCompleted = completedLessons.includes(lesson.id);
                                    return (
                                      <div
                                        key={lesson.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${
                                          isCompleted 
                                            ? 'bg-green-50 border-green-200' 
                                            : 'bg-white border-gray-200 hover:bg-gray-100'
                                        } cursor-pointer transition-colors`}
                                        onClick={() => handleLessonClick(lesson.id)}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <div className={`rounded-full p-1.5 ${
                                            isCompleted ? 'bg-green-100' : 'bg-gray-200'
                                          }`}>
                                            {isCompleted ? (
                                              <CheckCircle className="h-3 w-3 text-green-600" />
                                            ) : (
                                              getLessonIcon(lesson.type)
                                            )}
                                          </div>
                                          <div>
                                            <p className={`font-medium ${
                                              isCompleted ? 'text-green-900' : 'text-gray-900'
                                            }`}>
                                              {lesson.title}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                              {lesson.duration} • {lesson.type}
                                            </p>
                                          </div>
                                        </div>
                                        
                                        {chapter.isLocked ? (
                                          <Lock className="h-4 w-4 text-gray-400" />
                                        ) : (
                                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                            {isCompleted ? 'Review' : 'Start'}
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Course Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">8 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate</span>
                  <span className="font-medium text-green-600">Yes</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/ide"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Code className="h-5 w-5" />
                  <span>Practice in IDE</span>
                </Link>
                <Link
                  to="/pricing"
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Get Tutoring Help</span>
                </Link>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="font-medium">{completedCount}/{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters Completed</span>
                  <span className="font-medium">
                    {allChapters.filter(c => c.progress === 100).length}/{allChapters.length}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {Math.round(progressPercentage)}% complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
