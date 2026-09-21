import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Lock, CheckCircle } from 'lucide-react';
import { ClassSelection } from '../components/ClassSelection';
import { GraphingTool } from '../components/GraphingTool';
import { MathCourses } from '../components/MathCourses';
import { CppCourses } from '../components/CppCourses';
import { JavaCourses } from '../components/JavaCourses';
import { JavaScriptCourses } from '../components/JavaScriptCourses';

export const Courses: React.FC = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [pythonOpen, setPythonOpen] = useState(false);

  const courses = [
    {
      id: 'python-basics',
      title: 'Python Basics',
      description: 'Learn the fundamentals of Python programming',
      duration: '4 weeks',
      level: 'Beginner',
      students: 342,
      rating: 4.8,
      price: 'Free',
      isLocked: false,
      chapters: 8,
      category: 'basics',
      topics: ['Variables', 'Data Types', 'Control Flow', 'Functions', 'Lists', 'Dictionaries', 'File I/O', 'Error Handling']
    },
    {
      id: 'python-intermediate',
      title: 'Python Intermediate',
      description: 'Advance your Python skills with OOP and advanced concepts',
      duration: '6 weeks',
      level: 'Intermediate',
      students: 256,
      rating: 4.9,
      price: '$49',
      isLocked: true,
      chapters: 12,
      category: 'intermediate',
      topics: ['OOP', 'Modules', 'Decorators', 'Generators', 'Async Programming', 'Testing', 'Debugging', 'Performance']
    },
    {
      id: 'python-advanced',
      title: 'Python Advanced',
      description: 'Master advanced Python concepts and best practices',
      duration: '8 weeks',
      level: 'Advanced',
      students: 128,
      rating: 4.7,
      price: '$99',
      isLocked: true,
      chapters: 16,
      category: 'advanced',
      topics: ['Metaclasses', 'Descriptors', 'Concurrency', 'Network Programming', 'Web Development', 'Data Science', 'Machine Learning', 'DevOps']
    }
  ];

  const groups = [
    {
      id: 'basics',
      title: 'Basics & Overview',
      description: 'Start with Python fundamentals and what makes it popular'
    },
    {
      id: 'beginner',
      title: 'Beginners',
      description: 'Build your first useful programs with hands-on practice'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Dive into object-oriented and advanced Python concepts'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Master expert patterns, concurrency, and real-world tools'
    }
  ];

  const CourseCard: React.FC<{ course: typeof courses[0] }> = ({ course }) => (
    <div className="p-4 bg-gradient-to-br from-sky-100 to-orange-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-black transition-shadow">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold">{course.title}</h3>
          {course.isLocked && <Lock className="h-5 w-5" />}
        </div>
        <p className="text-blue-100 mb-4">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {course.level}
          </span>
          <span className="text-2xl font-bold">{course.price}</span>
        </div>
      </div>

      <div className="p-6 bg-white">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{course.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm">{course.students} students</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium">{course.rating}</span>
          <span className="text-sm text-gray-500">({course.students} reviews)</span>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">What you'll learn:</h4>
          <div className="space-y-1">
            {course.topics.slice(0, 3).map((topic, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{topic}</span>
              </div>
            ))}
            {course.topics.length > 3 && (
              <div className="text-sm text-gray-500">
                +{course.topics.length - 3} more topics
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">{course.chapters} chapters</span>
        </div>

        {course.id === 'python-basics' ? (
          <Link
            to="/courses/python"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
          >
            Start Course
          </Link>
        ) : course.isLocked ? (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
          >
            Enroll to Unlock
          </button>
        ) : (
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Continue Learning
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClassSelection />

        <div className="text-center mb-12">
          <div
            className="flex items-center justify-center gap-3 cursor-pointer"
            onClick={() => setPythonOpen(!pythonOpen)}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Python Courses
            </h1>
            <div className={`transform transition-transform ${pythonOpen ? 'rotate-180' : ''}`}>
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {pythonOpen && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comprehensive Python curriculum, from basics to advanced topics
            </p>
          )}
        </div>

        {pythonOpen && (
        <div className="grid grid-cols-1 gap-6">
          {groups.map((group) => {
            const groupCourses = courses.filter(c => c.category === group.id);
            const isOpen = openGroup === group.id;

            return (
              <div key={group.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div
                  className="p-6 cursor-pointer flex items-center justify-between"
                  onClick={() => setOpenGroup(isOpen ? null : group.id)}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{group.title}</h3>
                    <p className="text-gray-600 mt-1">{group.description}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {groupCourses.length} course{groupCourses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-6 pb-6">
                    {groupCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {groupCourses.map((course) => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg text-center text-gray-600">
                        No courses released in this category yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        )}

        <MathCourses />
        <CppCourses />
        <JavaCourses />
        <JavaScriptCourses />

        <GraphingTool />

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want Personalized Python Tutoring?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            Get one-on-one instruction from expert Python developers
          </p>
          <Link
            to="/pricing"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Book a Session - $60/hour
          </Link>
        </div>
      </div>
    </div>
  );
};
