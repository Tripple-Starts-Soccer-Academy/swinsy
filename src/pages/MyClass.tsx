import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, BookOpen, GraduationCap } from 'lucide-react';

export const MyClass: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const classes = [
    { id: 'python', title: 'Python', description: 'Python programming from basics to advanced' },
    { id: 'math', title: 'Math', description: 'Math courses from arithmetic to statistics' },
    { id: 'cpp', title: 'C++', description: 'C++ from syntax through advanced patterns' },
    { id: 'java', title: 'Java', description: 'Java from fundamentals to enterprise' },
    { id: 'javascript', title: 'JavaScript', description: 'JavaScript from browser basics to full stack' }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('enrolledClasses');
    if (stored) {
      const parsed = JSON.parse(stored);
      setEnrolled(parsed);
      setSelected(parsed);
    }
  }, []);

  const toggleClass = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setSaved(false);
  };

  const handleEnroll = () => {
    localStorage.setItem('enrolledClasses', JSON.stringify(selected));
    setEnrolled(selected);
    setSaved(true);
  };

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            My Class
          </h1>
          <p className="text-xl text-gray-600">
            Select the courses you want to take and enroll
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Available Classes
          </h2>

          <div className="space-y-4">
            {classes.map((cls) => {
              const isSelected = selected.includes(cls.id);
              return (
                <label
                  key={cls.id}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    checked={isSelected}
                    onChange={() => toggleClass(cls.id)}
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{cls.title}</h3>
                    <p className="text-gray-600">{cls.description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <button
            onClick={handleEnroll}
            disabled={selected.length === 0}
            className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
              selected.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Enroll in {selected.length === 0 ? 'Classes' : `${selected.length} Class${selected.length !== 1 ? 'es' : ''}`}
          </button>

          {saved && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Enrollment saved successfully!
            </div>
          )}
        </div>

        {enrolled.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Enrolled Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolled.map((id) => {
                const cls = classes.find((c) => c.id === id);
                return (
                  <Link
                    key={id}
                    to={`/courses/${id === 'javascript' ? 'javascript' : id}`}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{cls?.title}</h3>
                    <p className="text-sm text-gray-600">{cls?.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
