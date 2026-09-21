import type { Question } from '../types/tests';

const STOP_WORDS = new Set([
  'the', 'and', 'a', 'an', 'in', 'of', 'to', 'is', 'it', 'that', 'for', 'on', 'with', 'as',
  'this', 'but', 'are', 'was', 'be', 'by', 'or', 'from', 'at', 'which', 'has', 'have', 'had',
  'not', 'been', 'their', 'they', 'them', 'there', 'than', 'then', 'these', 'those', 'will',
  'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'do', 'does', 'did', 'so', 'if',
  'no', 'yes', 'into', 'about', 'such', 'only', 'other', 'after', 'first', 'also', 'any', 'many',
  'more', 'most', 'some', 'time', 'very', 'when', 'where', 'who', 'why', 'how', 'all', 'each',
  'every', 'its', 'our', 'out', 'up', 'down', 'what', 'which', 'while', 'during', 'before',
  'following', 'use', 'used', 'using', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten', 'new', 'way', 'make', 'made', 'over', 'well', 'much', 'know', 'take',
  'work', 'come', 'good', 'great', 'long', 'little', 'own', 'just', 'old', 'right', 'big', 'high',
  'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad',
  'same', 'able', 'etc', 'ie', 'eg',
]);

export const generateQuestions = (text: string, count: number): Question[] => {
  const questions: Question[] = [];
  const rawSentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const sentences = rawSentences.map((s) => s.trim().replace(/\s+/g, ' ')).filter((s) => s.length > 20);

  const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const stripPunctuation = (w: string) => w.replace(/[.,!?;:;\)\]\'\"\-\—]+$/, '');

  const sentenceWords: string[][] = [];
  const allWords = new Set<string>();

  for (const sentence of sentences) {
    const words = sentence
      .split(' ')
      .map(stripPunctuation)
      .filter((w) => w.length > 4 && !STOP_WORDS.has(clean(w)));
    sentenceWords.push(words);
    for (const w of words) {
      allWords.add(w);
    }
  }

  const distractorPool = Array.from(allWords).sort((a, b) => a.localeCompare(b));

  for (let i = 0; i < sentenceWords.length && questions.length < count; i++) {
    const words = sentenceWords[i];
    if (words.length === 0) continue;

    const target = words[0];
    const sentence = sentences[i];
    const blanked = sentence.replace(target, '_____');

    const distractors: string[] = [];
    for (const word of distractorPool) {
      if (word !== target && clean(word) !== clean(target)) {
        distractors.push(word);
      }
      if (distractors.length >= 3) break;
    }

    if (distractors.length < 3) continue;

    const options = [target, ...distractors].sort((a, b) => a.localeCompare(b));
    const answer = options.findIndex((o) => o === target);
    if (answer === -1) continue;

    questions.push({
      question: `Which word fits the blank? "${blanked}"`,
      options,
      answer,
    });
  }

  return questions;
};
