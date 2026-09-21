import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { loadBooks, saveBook, deleteBook, StoredBook } from '../utils/booksStore';

type Book = {
  id: string;
  name: string;
  url: string;
  size: number;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const storedToBook = (b: StoredBook): Book => ({
  id: b.id,
  name: b.name,
  url: URL.createObjectURL(new Blob([b.data], { type: b.type })),
  size: b.size,
});

export const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const booksRef = useRef<Book[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const pdfFiles = Array.from(files).filter((f) => f.type === 'application/pdf');
    if (pdfFiles.length === 0) return;

    setIsLoading(true);
    const newBooks: Book[] = [];
    await Promise.all(
      pdfFiles.map(async (file) => {
        const id = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        try {
          const data = await file.arrayBuffer();
          const stored: StoredBook = { id, name: file.name, size: file.size, type: file.type, data };
          await saveBook(stored);
          newBooks.push(storedToBook(stored));
        } catch (err) {
          console.error('Failed to save book', file.name, err);
        }
      })
    );
    setBooks((prev) => [...prev, ...newBooks]);
    setIsLoading(false);
  };

  const removeBook = async (id: string) => {
    const removed = books.find((b) => b.id === id);
    if (removed) URL.revokeObjectURL(removed.url);
    try {
      await deleteBook(id);
    } catch (err) {
      console.error('Failed to delete book', err);
    }
    setBooks((prev) => prev.filter((b) => b.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  useEffect(() => {
    booksRef.current = books;
  });

  useEffect(() => {
    return () => {
      booksRef.current.forEach((b) => URL.revokeObjectURL(b.url));
    };
  }, []);

  useEffect(() => {
    if (typeof indexedDB === 'undefined') return;
    let mounted = true;
    setIsLoading(true);
    loadBooks()
      .then((stored) => {
        if (!mounted) return;
        setBooks(stored.map(storedToBook));
      })
      .catch((err) => console.error('Failed to load books', err))
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const selected = books.find((b) => b.id === selectedId);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">My Books</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Library */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Library</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors mb-4"
              >
                <Plus className="h-4 w-4" />
                <span>Load PDF Books</span>
              </button>

              {books.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">
                  {isLoading ? 'Loading your books...' : 'No books loaded yet.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => setSelectedId(book.id)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedId === book.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{book.name}</p>
                          <p className="text-xs text-gray-500">{formatSize(book.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBook(book.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reader */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full min-h-[600px] flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reader</h3>
              {selected ? (
                <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden min-h-[520px]">
                  <object
                    data={selected.url}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="w-full h-full min-h-[520px]"
                    title={selected.name}
                  >
                    <p className="p-4 text-sm text-gray-600">
                      Your browser does not support PDFs. You can download the file to read it.
                    </p>
                  </object>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[520px]">
                  <p className="text-gray-500 text-sm">Select a book from the library to start reading.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
