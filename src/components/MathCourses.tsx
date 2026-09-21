import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Lock, CheckCircle } from 'lucide-react';

export const MathCourses: React.FC = () => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [sectionOpen, setSectionOpen] = useState(false);

  const courses = [
    {
      id: 'math-foundations',
      title: 'Math Foundations',
      description: 'Build confidence with numbers, arithmetic, and core math thinking',
      duration: '3 weeks',
      level: 'Beginner',
      students: 215,
      rating: 4.8,
      price: 'Free',
      isLocked: false,
      chapters: 6,
      category: 'basics',
      to: '/courses/math',
      topics: ['Arithmetic', 'Fractions', 'Decimals', 'Percentages', 'Number Sense', 'Word Problems']
    },
    {
      id: 'pre-algebra',
      title: 'Pre-Algebra',
      description: 'Get ready for algebra with variables, expressions, and equations',
      duration: '4 weeks',
      level: 'Beginner',
      students: 189,
      rating: 4.7,
      price: '$29',
      isLocked: true,
      chapters: 8,
      category: 'beginner',
      to: '/courses/pre-algebra',
      topics: ['Variables', 'Expressions', 'Simple Equations', 'Ratios', 'Proportions', 'Graphing Basics']
    },
    {
      id: 'algebra-geometry',
      title: 'Algebra & Geometry',
      description: 'Master equations, functions, and geometric reasoning',
      duration: '6 weeks',
      level: 'Intermediate',
      students: 142,
      rating: 4.9,
      price: '$49',
      isLocked: true,
      chapters: 12,
      category: 'intermediate',
      to: '/courses/algebra-geometry',
      topics: ['Linear Equations', 'Functions', 'Polynomials', 'Triangles', 'Circles', 'Trigonometry']
    },
    {
      id: 'calculus-statistics',
      title: 'Calculus & Statistics',
      description: 'Explore limits, derivatives, probability, and data analysis',
      duration: '8 weeks',
      level: 'Advanced',
      students: 98,
      rating: 4.7,
      price: '$99',
      isLocked: true,
      chapters: 16,
      category: 'advanced',
      to: '/courses/calculus-statistics',
      topics: ['Limits', 'Derivatives', 'Integrals', 'Probability', 'Distributions', 'Hypothesis Testing']
    }
  ];

  const groups = [
    {
      id: 'basics',
      title: 'Basics & Overview',
      description: 'Start with arithmetic and the foundations of math thinking'
    },
    {
      id: 'beginner',
      title: 'Beginners',
      description: 'Prepare for algebra with variables, expressions, and simple equations'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Dive into algebra, functions, and geometry'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Master calculus, probability, and statistical reasoning'
    }
  ];

  const CourseCard: React.FC<{ course: typeof courses[0] }> = ({ course }) => (
    <div className="p-4 bg-gradient-to-br from-sky-100 to-orange-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-black transition-shadow">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold">{course.title}</h3>
          {course.isLocked && <Lock className="h-5 w-5" />}
        </div>
        <p className="text-green-100 mb-4">{course.description}</p>
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

        {course.isLocked ? (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
          >
            Enroll to Unlock
          </button>
        ) : (
          <Link
            to={course.to}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block"
          >
            Start Course
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div
            className="flex items-center justify-center gap-3 cursor-pointer"
            onClick={() => setSectionOpen(!sectionOpen)}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Math Courses
            </h2>
            <div className={`transform transition-transform ${sectionOpen ? 'rotate-180' : ''}`}>
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {sectionOpen && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore math from the fundamentals through advanced problem solving
            </p>
          )}
        </div>

        {sectionOpen && (
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
      </div>
    </div>
  );
};
