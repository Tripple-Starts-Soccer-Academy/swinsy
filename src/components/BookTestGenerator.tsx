import React, { useEffect, useRef, useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { loadBooks, StoredBook } from '../utils/booksStore';
import { extractTextFromPdf } from '../utils/pdfExtractor';
import { generateQuestions } from '../utils/questionGenerator';
import type { SampleTest } from '../types/tests';

type BookTestGeneratorProps = {
  onStart: (test: SampleTest) => void;
  levels: string[];
  topics: string[];
  schools: string[];
};

const MIN_QUESTIONS = 10;
const MAX_QUESTIONS = 500;

export const BookTestGenerator: React.FC<BookTestGeneratorProps> = ({
  onStart,
  levels,
  topics,
  schools,
}) => {
  const [books, setBooks] = useState<StoredBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [level, setLevel] = useState<string>(levels[0] || 'Easy');
  const [topic, setTopic] = useState<string>(topics[0] || 'Python');
  const [school, setSchool] = useState<string>(schools[0] || 'Middle School');
  const [count, setCount] = useState<number>(100);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    setLoadingBooks(true);
    loadBooks()
      .then((stored) => {
        if (mounted) setBooks(stored);
      })
      .catch(() => {
        if (mounted) setError('Failed to load your books.');
      })
      .finally(() => {
        if (mounted) setLoadingBooks(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleGenerate = async () => {
    setError(null);
    let data: ArrayBuffer | null = null;
    let name = '';

    if (newFile) {
      data = await newFile.arrayBuffer();
      name = newFile.name;
    } else if (selectedBookId) {
      const book = books.find((b) => b.id === selectedBookId);
      if (book) {
        data = book.data;
        name = book.name;
      }
    }

    if (!data) {
      setError('Select an existing book or upload a PDF first.');
      return;
    }

    setAnalyzing(true);
    try {
      const text = await extractTextFromPdf(data);
      if (!text.trim()) {
        setError('Could not extract text from this PDF. Try a text-based PDF.');
        return;
      }
      const questions = generateQuestions(text, count);
      const test: SampleTest = {
        id: `custom-${Date.now()}`,
        title: `Custom: ${name}`,
        category: 'Custom',
        topic,
        schoolLevel: school,
        description: `Generated ${questions.length} questions from ${name}`,
        level: level as 'Easy' | 'Medium' | 'Hard',
        questions,
      };
      onStart(test);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">School level</label>
          <select
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {schools.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Questions ({count})</label>
          <input
            type="range"
            min={MIN_QUESTIONS}
            max={MAX_QUESTIONS}
            step={10}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <div className="text-right text-sm text-gray-500">{count} questions</div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Book source</label>
        {loadingBooks ? (
          <p className="text-sm text-gray-500">Loading your books...</p>
        ) : (
          <>
            <select
              value={selectedBookId}
              onChange={(e) => {
                setSelectedBookId(e.target.value);
                setNewFile(null);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
            >
              <option value="">Choose a saved book...</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-500 text-center">or</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setNewFile(e.target.files?.[0] || null);
                setSelectedBookId('');
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {newFile ? newFile.name : 'Upload a new PDF'}
            </button>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleGenerate}
        disabled={analyzing}
        className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-2.5 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
      >
        {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        <span>{analyzing ? 'Analyzing...' : 'Generate & Start Test'}</span>
      </button>
    </div>
  );
};
