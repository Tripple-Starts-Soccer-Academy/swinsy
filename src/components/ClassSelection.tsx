import React, { useState } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';

const classes = ['High School', 'College', 'Masters', 'PhD'];

const collegeClasses = [
  { code: 'EE 101', title: 'Introduction to Electrical Engineering', credits: 3 },
  { code: 'EE 201', title: 'Circuit Analysis I', credits: 3 },
  { code: 'EE 202', title: 'Circuit Analysis II', credits: 3 },
  { code: 'EE 211', title: 'Signals and Systems', credits: 3 },
  { code: 'EE 230', title: 'Digital Logic Design', credits: 3 },
  { code: 'EE 301', title: 'Electronics I', credits: 3 },
  { code: 'EE 310', title: 'Electromagnetic Fields', credits: 3 },
  { code: 'EE 320', title: 'Microprocessors', credits: 3 },
  { code: 'EE 340', title: 'Power Systems', credits: 3 },
  { code: 'EE 350', title: 'Control Systems', credits: 3 },
];

const highSchoolMath = [
  {
    level: 'Pre-Algebra (Foundation Level)',
    topics: ['Integers', 'Fractions', 'Decimals', 'Ratios & proportions', 'Basic equations', 'Order of operations (PEMDAS)', 'Factors & multiples', 'Basic graphing'],
  },
  {
    level: 'Algebra I (Core Level)',
    topics: ['Linear equations', 'Linear functions', 'Slope & intercepts', 'Systems of equations', 'Inequalities', 'Exponents', 'Polynomials (intro)', 'Square roots', 'Function notation'],
  },
  {
    level: 'Geometry (Core Level)',
    topics: ['Logic & proofs', 'Lines, angles', 'Triangles (congruence, similarity)', 'Circles', 'Polygons', 'Area & perimeter', 'Volume & surface area', 'Coordinate geometry', 'Transformations'],
  },
  {
    level: 'Algebra II (Advanced Core Level)',
    topics: ['Quadratic functions', 'Polynomial functions', 'Rational expressions', 'Radical expressions', 'Exponential & logarithmic functions', 'Complex numbers', 'Systems (advanced)', 'Sequences & series', 'Probability (intro)'],
  },
  {
    level: 'Trigonometry (Bridge Level)',
    topics: ['Trig ratios (sin, cos, tan)', 'Unit circle', 'Radian measure', 'Graphs of trig functions', 'Identities', 'Inverse trig functions', 'Law of Sines', 'Law of Cosines'],
  },
  {
    level: 'Pre-Calculus (College-Prep Level)',
    topics: ['Advanced functions', 'Trigonometry (full)', 'Limits (intro)', 'Conics', 'Matrices (intro)', 'Vectors (intro)', 'Sequences & series', 'Combinatorics (intro)', 'Probability (expanded)'],
  },
  {
    level: 'Calculus (AP Calculus AB/BC)',
    topics: ['AB Level: Limits', 'Derivatives', 'Integrals', 'Fundamental Theorem of Calculus', 'Applications of derivatives', 'Applications of integrals', 'BC Level: Series & convergence', 'Parametric equations', 'Polar coordinates', 'Differential equations (intro)'],
  },
  {
    level: 'Optional High School Electives',
    topics: ['Statistics', 'Data science foundations', 'Computer science math', 'Discrete math (intro)', 'Financial math', 'Math modeling'],
  },
];

export const ClassSelection: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [renderCollege, setRenderCollege] = useState(false);
  const [renderHighSchool, setRenderHighSchool] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Class Selection</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {classes.map((level) => (
          <div
            key={level}
            onClick={() => setSelected(level)}
            className={`p-4 rounded-lg border transition-all text-center cursor-pointer ${
              selected === level
                ? 'border-blue-500 shadow-md bg-blue-50'
                : 'border-gray-200 hover:border-blue-500 hover:shadow-md bg-gray-50'
            }`}
          >
            <GraduationCap className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">{level}</span>
          </div>
        ))}
      </div>

      {selected === 'College' && (
        <button
          onClick={() => setRenderCollege(r => !r)}
          className="mt-6 mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {renderCollege ? 'Hide' : 'Render'} Electrical Engineering Degree
        </button>
      )}

      {renderCollege && (
        <div className="mt-4">
          <h4 className="text-md font-bold text-gray-900 mb-3">Electrical Engineering Degree</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collegeClasses.map((cls) => (
              <div key={cls.code} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{cls.code}</p>
                    <p className="text-sm text-gray-700">{cls.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{cls.credits} credits</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected === 'High School' && (
        <button
          onClick={() => setRenderHighSchool(r => !r)}
          className="mt-6 mb-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {renderHighSchool ? 'Hide' : 'Render'} Math
        </button>
      )}

      {renderHighSchool && (
        <div className="mt-4">
          <h4 className="text-md font-bold text-gray-900 mb-3">High School Math</h4>
          <div className="grid grid-cols-1 gap-4">
            {highSchoolMath.map((section) => (
              <div key={section.level} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h5 className="font-semibold text-gray-900 mb-2">{section.level}</h5>
                <div className="flex flex-wrap gap-2">
                  {section.topics.map((topic) => (
                    <span key={topic} className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-gray-700">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
