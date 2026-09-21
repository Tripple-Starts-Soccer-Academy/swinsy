import React, { useState } from 'react';
import { BookOpen, Code } from 'lucide-react';
import { BrainRender } from '../components/BrainRender';
import { PracticeTests } from '../components/PracticeTests';

export const Home: React.FC = () => {
  const stats = [
    { label: 'Students', value: '1000+' },
    { label: 'Lessons', value: '50+' },
    { label: 'Success Rate', value: '95%' },
    { label: 'IDE Access', value: '24/7' },
  ];

  const [showAssessments, setShowAssessments] = useState(false);

  return (
    <div className="py-8">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrainRender />
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">yarichard-international</h1>
          <p className="text-gray-600">Learn Python at your own pace. First 8 weeks free.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-start">
          {/* Why Choose yarichard-international */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose yarichard-international?</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Interactive Courses</h3>
                  <p className="text-sm text-gray-600">
                    Learn Python through hands-on exercises and real-world projects
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Code className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Online IDE</h3>
                  <p className="text-sm text-gray-600">
                    Practice coding in your browser with our powerful multi-language IDE
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Stats on the right */}
          <div className="space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-lg hover:shadow-orange-200 transition-all cursor-pointer"
              >
                <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                <span className="text-xl font-bold text-blue-600">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowAssessments((s) => !s)}
            className="bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            {showAssessments ? 'Hide Assessments' : 'Assessments'}
          </button>
        </div>

        {showAssessments && <PracticeTests />}
      </div>
    </div>
  );
};
