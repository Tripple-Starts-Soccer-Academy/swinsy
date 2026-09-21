import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

type TestScore = {
  date: string;
  score: number;
  total: number;
  percent: number;
};

const getColor = (p: number) => {
  if (p >= 80) return 'text-green-500';
  if (p >= 60) return 'text-amber-500';
  return 'text-red-500';
};

type MemoryCubeProps = {
  shortTerm: number;
  size: number;
};

const MemoryCube: React.FC<MemoryCubeProps> = ({ shortTerm, size }) => {
  const half = size / 2;
  const textClass = size >= 100 ? 'text-lg' : 'text-[6px]';
  const faceBase: React.CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 8,
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        perspective: 600,
      }}
      className="relative"
    >
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          animation: 'spin3d 10s linear infinite',
        }}
      >
        {/* Front - Brain */}
        <div
          style={{
            ...faceBase,
            transform: `translateZ(${half}px)`,
            background: 'white',
          }}
        >
          <Brain
            className={`w-full h-full p-1 ${getColor(shortTerm)}`}
            style={{ width: size, height: size }}
          />
        </div>

        {/* Right - C++ */}
        <div
          style={{
            ...faceBase,
            transform: `rotateY(90deg) translateZ(${half}px)`,
            background: '#eff6ff',
          }}
          className={`font-bold text-blue-600 ${textClass}`}
        >
          C++
        </div>

        {/* Back - Java */}
        <div
          style={{
            ...faceBase,
            transform: `rotateY(180deg) translateZ(${half}px)`,
            background: '#fff1f2',
          }}
          className={`font-bold text-red-600 ${textClass}`}
        >
          Java
        </div>

        {/* Left - Unity */}
        <div
          style={{
            ...faceBase,
            transform: `rotateY(-90deg) translateZ(${half}px)`,
            background: '#f3f4f6',
          }}
          className={`font-bold text-gray-900 ${textClass}`}
        >
          Unity
        </div>

        {/* Top - Short-term */}
        <div
          style={{
            ...faceBase,
            transform: `rotateX(90deg) translateZ(${half}px)`,
            background: '#f0fdf4',
          }}
          className={`font-bold text-green-600 ${textClass}`}
        >
          STM
        </div>

        {/* Bottom - Long-term */}
        <div
          style={{
            ...faceBase,
            transform: `rotateX(-90deg) translateZ(${half}px)`,
            background: '#fffbeb',
          }}
          className={`font-bold text-amber-600 ${textClass}`}
        >
          LTM
        </div>
      </div>
    </div>
  );
};

export const BrainRender: React.FC = () => {
  const [enlarged, setEnlarged] = useState(false);
  const [scores, setScores] = useState<TestScore[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('yarichard-test-scores');
    setScores(raw ? (JSON.parse(raw) as TestScore[]) : []);
  }, []);

  const shortTerm = scores.length ? scores[scores.length - 1].percent : 0;
  const longTerm = scores.length
    ? Math.round(scores.reduce((a, s) => a + s.percent, 0) / scores.length)
    : 0;

  return (
    <div className="absolute right-0 top-0 z-10">
      <style>{`
        @keyframes spin3d {
          from { transform: rotateY(0deg) rotateX(15deg); }
          to { transform: rotateY(360deg) rotateX(15deg); }
        }
      `}</style>
      <button
        onClick={() => setEnlarged(true)}
        className="p-2 rounded-full bg-white shadow hover:shadow-md transition-transform transform hover:scale-110"
        title="View memory perception from your tests"
      >
        <MemoryCube shortTerm={shortTerm} size={48} />
      </button>

      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setEnlarged(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4" style={{ width: 128, height: 128 }}>
              <MemoryCube shortTerm={shortTerm} size={128} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Memory Perception
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Unity / C++ / Java memory simulation
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-700">Short-term</span>
                <span className="font-bold text-lg">{shortTerm}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <span className="font-medium text-gray-700">Long-term</span>
                <span className="font-bold text-lg">{longTerm}%</span>
              </div>
            </div>
            <button
              onClick={() => setEnlarged(false)}
              className="mt-6 w-full bg-amber-700 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
