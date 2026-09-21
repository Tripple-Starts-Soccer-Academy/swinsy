import React, { useEffect, useRef, useState } from 'react';
import { Plus, X, RefreshCw, Play } from 'lucide-react';

type Equation = {
  id: number;
  expr: string;
  color: string;
};

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const evaluate = (expr: string, x: number): number | null => {
  let code = expr
    .replace(/\^/g, '**')
    .replace(/\bsin\b/g, 'Math.sin')
    .replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan')
    .replace(/\bsqrt\b/g, 'Math.sqrt')
    .replace(/\blog\b/g, 'Math.log')
    .replace(/\babs\b/g, 'Math.abs')
    .replace(/\bpi\b/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E');

  try {
    const fn = new Function('x', `return ${code}`);
    const y = fn(x);
    return typeof y === 'number' && isFinite(y) ? y : null;
  } catch {
    return null;
  }
};

export const GraphingTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [equations, setEquations] = useState<Equation[]>([
    { id: 1, expr: 'x**2', color: COLORS[0] },
  ]);
  const [renderedEquations, setRenderedEquations] = useState<Equation[]>(equations);
  const [input, setInput] = useState('x**2');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);

  const insertSymbol = (symbol: string) => {
    const el = inputRef.current;
    if (!el) {
      setInput((prev) => prev + symbol);
      return;
    }
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? start;
    const before = input.slice(0, start);
    const after = input.slice(end);
    const next = before + symbol + after;
    setInput(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + symbol.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const addEquation = () => {
    if (!input.trim()) return;
    const y = evaluate(input, 1);
    if (y === null) return;
    setEquations((prev) => [
      ...prev,
      { id: Date.now(), expr: input, color: COLORS[prev.length % COLORS.length] },
    ]);
    setInput('');
  };

  const removeEquation = (id: number) => {
    setEquations((prev) => {
      const next = prev.filter((e) => e.id !== id);
      setRenderedEquations(next);
      return next;
    });
  };

  const reset = () => {
    const defaultEq = { id: Date.now(), expr: 'x**2', color: COLORS[0] };
    setEquations([defaultEq]);
    setRenderedEquations([defaultEq]);
    setInput('x**2');
    setXMin(-10);
    setXMax(10);
    setYMin(-10);
    setYMax(10);
  };

  const renderGraph = () => {
    setRenderedEquations([...equations]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;

    const toCanvasX = (x: number) => ((x - xMin) / xRange) * width;
    const toCanvasY = (y: number) => height - ((y - yMin) / yRange) * height;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      const cx = toCanvasX(x);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      const cy = toCanvasY(y);
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
    }
    ctx.stroke();

    // Axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const originX = toCanvasX(0);
    const originY = toCanvasY(0);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Equations
    renderedEquations.forEach((eq) => {
      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px < width; px++) {
        const x = xMin + (px / width) * xRange;
        const y = evaluate(eq.expr, x);
        if (y === null) {
          started = false;
          continue;
        }
        const py = toCanvasY(y);
        if (py < -1000 || py > height + 1000) {
          started = false;
          continue;
        }
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    });
  }, [renderedEquations, xMin, xMax, yMin, yMax]);

  const symbols = [
    { label: 'x', symbol: 'x' },
    { label: 'y', symbol: 'y' },
    { label: 'π', symbol: 'pi' },
    { label: 'e', symbol: 'e' },
    { label: '+', symbol: '+' },
    { label: '−', symbol: '-' },
    { label: '×', symbol: '*' },
    { label: '÷', symbol: '/' },
    { label: '^', symbol: '^' },
    { label: '.', symbol: '.' },
    { label: '(', symbol: '(' },
    { label: ')', symbol: ')' },
    { label: 'sin', symbol: 'sin(' },
    { label: 'cos', symbol: 'cos(' },
    { label: 'tan', symbol: 'tan(' },
    { label: '√', symbol: 'sqrt(' },
    { label: 'log', symbol: 'log(' },
    { label: 'abs', symbol: 'abs(' },
  ];

  const symbolGroups = [
    { name: 'Variables & Constants', items: symbols.slice(0, 4) },
    { name: 'Operators', items: symbols.slice(4, 12) },
    { name: 'Functions', items: symbols.slice(12) },
  ];

  const notation = [
    { symbol: 'f(x)', name: 'function' },
    { symbol: 'g(x)', name: 'another function' },
    { symbol: '→', name: 'approaches / maps to' },
    { symbol: '↦', name: 'maps to (function mapping)' },
    { symbol: 'f⁻¹(x)', name: 'inverse function' },
    { symbol: 'Δx', name: 'change in x' },
    { symbol: 'Δy', name: 'change in y' },
    { symbol: 'm', name: 'slope' },
    { symbol: 'b', name: 'y-intercept' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Graphing Tool</h3>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Controls */}
        <div className="md:w-1/3 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter an equation in x</label>
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEquation()}
                placeholder="e.g. x^2 + 2*x + 1"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addEquation}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Add equation"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {symbolGroups.map((group) => (
            <div key={group.name}>
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">{group.name}</p>
              <div className="grid grid-cols-4 gap-2">
                {group.items.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => insertSymbol(s.symbol)}
                    className="text-sm bg-gray-100 hover:bg-blue-100 border border-gray-200 rounded-lg py-1.5 transition-colors font-mono"
                    type="button"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-2">
            {equations.map((eq) => (
              <div key={eq.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: eq.color }} />
                  <span className="text-sm text-gray-800 font-mono">y = {eq.expr}</span>
                </div>
                <button
                  onClick={() => removeEquation(eq.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove equation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={renderGraph}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Render Graph</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600">X Min</label>
              <input
                type="number"
                value={xMin}
                onChange={(e) => setXMin(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600">X Max</label>
              <input
                type="number"
                value={xMax}
                onChange={(e) => setXMax(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Y Min</label>
              <input
                type="number"
                value={yMin}
                onChange={(e) => setYMin(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600">Y Max</label>
              <input
                type="number"
                value={yMax}
                onChange={(e) => setYMax(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </div>
          </div>

          <button
            onClick={reset}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Canvas */}
        <div className="md:w-2/3">
          <canvas
            ref={canvasRef}
            width={720}
            height={420}
            className="w-full h-auto border border-gray-200 rounded-lg bg-white"
          />
          <p className="text-xs text-gray-500 mt-2">
            Tip: Type or tap symbols to build an equation, then press Render Graph.
          </p>

          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Math Notation</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {notation.map((n) => (
                <div key={n.symbol} className="bg-white border border-gray-200 rounded p-2 text-center">
                  <div className="font-mono text-lg text-blue-700">{n.symbol}</div>
                  <div className="text-xs text-gray-600">{n.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
