import React, { useState, useMemo } from 'react';

const Equation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-4 bg-slate-50 px-4 py-3 rounded-lg font-mono text-[13px] text-aast-navy border border-slate-200 shadow-inner flex justify-center overflow-x-auto whitespace-pre">
    {children}
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-4 mb-10">
    <h3 className="text-xl font-black text-aast-navy border-b-2 border-aast-gold pb-2 inline-block mb-2">
      {title}
    </h3>
    <div className="text-slate-700 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

// --- Demos ---

const DirectScanDemo = () => {
  const [x1, setX1] = useState(2);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(14);
  const [y2, setY2] = useState(6);

  const points = useMemo(() => {
    const pts = [];
    const m = (y2 - y1) / (x2 - x1 || 1);
    const b = y1 - m * x1;
    for (let x = x1; x <= x2; x++) {
      const yExact = m * x + b;
      pts.push({ x, yExact: yExact.toFixed(2), y: Math.round(yExact) });
    }
    return pts;
  }, [x1, y1, x2, y2]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4">Interactive Demo: Direct Scan Conversion</h4>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">x1, y1</label><div className="flex gap-1"><input type="number" value={x1} onChange={e => setX1(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /><input type="number" value={y1} onChange={e => setY1(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /></div></div>
            <div><label className="text-[10px] font-bold text-slate-500 uppercase">x2, y2</label><div className="flex gap-1"><input type="number" value={x2} onChange={e => setX2(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /><input type="number" value={y2} onChange={e => setY2(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /></div></div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 aspect-video flex items-center justify-center relative shadow-inner">
            <svg viewBox="0 0 20 20" className="w-full h-full transform scale-y-[-1]">
              {points.map((p, i) => <rect key={i} x={p.x - 0.4} y={p.y - 0.4} width="0.8" height="0.8" fill="#eab308" />)}
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f87171" strokeWidth="0.1" strokeDasharray="0.2" />
            </svg>
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col h-[300px]">
          <table className="w-full text-[10px] text-left">
            <thead className="bg-slate-200 sticky top-0">
              <tr><th className="p-2">x</th><th className="p-2">y = m·x + b</th><th className="p-2">Plot (round)</th></tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="p-2 font-mono">{p.x}</td>
                  <td className="p-2 font-mono text-slate-500">{p.yExact}</td>
                  <td className="p-2 font-bold text-aast-navy">({p.x}, {p.y})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DDABresenhamComparison = () => {
  const [x1, setX1] = useState(2);
  const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(14);
  const [y2, setY2] = useState(10);

  const ddaPoints = useMemo(() => {
    const pts = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy)) || 1;
    const xInc = dx / steps;
    const yInc = dy / steps;
    let x = x1, y = y1;
    for (let i = 0; i <= steps; i++) {
      pts.push({ x: Math.round(x), y: Math.round(y) });
      x += xInc; y += yInc;
    }
    return pts;
  }, [x1, y1, x2, y2]);

  const bresenhamPoints = useMemo(() => {
    const pts = [];
    let curX = x1, curY = y1;
    const dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;
    while (true) {
      pts.push({ x: curX, y: curY });
      if (curX === x2 && curY === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; curX += sx; }
      if (e2 < dx) { err += dx; curY += sy; }
      if (pts.length > 100) break;
    }
    return pts;
  }, [x1, y1, x2, y2]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4">DDA vs. Bresenham Algorithm Comparison</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div><label className="text-[10px] font-bold text-slate-500 uppercase">Start (x1, y1)</label><div className="flex gap-1"><input type="number" value={x1} onChange={e => setX1(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /><input type="number" value={y1} onChange={e => setY1(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /></div></div>
        <div><label className="text-[10px] font-bold text-slate-500 uppercase">End (x2, y2)</label><div className="flex gap-1"><input type="number" value={x2} onChange={e => setX2(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /><input type="number" value={y2} onChange={e => setY2(Number(e.target.value))} className="w-1/2 px-1 py-1 text-xs border rounded" /></div></div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-center uppercase text-slate-500">DDA (Fractional Addition)</p>
          <div className="bg-slate-900 rounded-lg p-2 aspect-square flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-full h-full transform scale-y-[-1]">
               {ddaPoints.map((p, i) => <rect key={i} x={p.x - 0.4} y={p.y - 0.4} width="0.8" height="0.8" fill="#ec4899" />)}
               <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.05" strokeDasharray="0.1" />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-center uppercase text-slate-500">Bresenham (Integer Decision)</p>
          <div className="bg-slate-900 rounded-lg p-2 aspect-square flex items-center justify-center">
            <svg viewBox="0 0 20 20" className="w-full h-full transform scale-y-[-1]">
               {bresenhamPoints.map((p, i) => <rect key={i} x={p.x - 0.4} y={p.y - 0.4} width="0.8" height="0.8" fill="#eab308" />)}
               <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.05" strokeDasharray="0.1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};


export const Lecture4Line: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans text-slate-700">
      <header className="mb-12 text-center sm:text-left">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4">
          Week 04
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Design of Line Algorithms
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Converting mathematical line segments into discrete pixel grids using DDA and Bresenham's algorithms.
        </p>
      </header>

      <Section title="1. Introduction to Output Primitives">
        <p>Graphics programming packages provide functions to describe a visual scene using basic geometric structures known as <strong>Output Primitives</strong>. These serve as the basic building blocks that can be combined to construct more complex objects.</p>
        <p>The most fundamental output primitives include:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
           {['Points', 'Lines', 'Circles', 'Spline curves'].map(p => (
             <div key={p} className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center font-bold text-aast-navy text-sm shadow-sm">{p}</div>
           ))}
        </div>
        <p className="mt-6">The core challenge is calculating each subsequent pixel coordinate <code>(x, y)</code> as quickly as possible, minimizing floating-point computations.</p>
      </Section>

      <Section title="2. Mathematical Foundations">
        <h4 className="font-bold text-aast-navy mb-2">A. Parametric Equation Form</h4>
        <p>Given endpoints P1=(x1,y1) and P2=(x2,y2), any point along the segment can be defined using parameter <code>t</code> (from 0 to 1):</p>
        <Equation>x = x1 + t(x2 - x1){'\n'}y = y1 + t(y2 - y1)</Equation>

        <h4 className="font-bold text-aast-navy mb-2 mt-6">B. Slope-Intercept Form</h4>
        <p>The standard Cartesian equation:</p>
        <Equation>y = m · x + b</Equation>
        <p>Where <code>m = Δy / Δx</code> is the slope and <code>b = y1 - m·x1</code> is the y-intercept.</p>
      </Section>

      <Section title="3. Direct Scan Conversion Algorithm">
        <p>The simplest approach: calculate <code>y = m·x + b</code> for every <code>x</code> and round the result.</p>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4 rounded-r-lg">
          <p className="text-xs font-bold text-red-800 uppercase mb-1">Computational Limitation</p>
          <p className="text-xs text-red-700">Highly inefficient for hardware. Each step requires a <strong>floating-point multiplication</strong> and addition, which slows down rendering pipelines.</p>
        </div>
        <DirectScanDemo />
      </Section>

      <Section title="4. DDA (Digital Differential Analyzer)">
        <p>DDA optimizes line drawing using an <strong>incremental approach</strong>. Instead of recalculating the product, it adds a precomputed offset to the previous coordinate.</p>
        <div className="grid sm:grid-cols-2 gap-4 my-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-xs uppercase mb-2">Case 1: Gentle Slope (|m| ≤ 1)</h5>
            <p className="text-xs font-mono">Δx = 1{'\n'}Δy = m{'\n\n'}x_{'{k+1}'} = x_k + 1{'\n'}y_{'{k+1}'} = y_k + m</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-xs uppercase mb-2">Case 2: Steep Slope (|m| &gt; 1)</h5>
            <p className="text-xs font-mono">Δy = 1{'\n'}Δx = 1/m{'\n\n'}y_{'{k+1}'} = y_k + 1{'\n'}x_{'{k+1}'} = x_k + 1/m</p>
          </div>
        </div>
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-xs text-emerald-800">
           <strong>Performance Note:</strong> Replaces multiplication with addition. However, still requires floating-point variables and round-off operations.
        </div>
      </Section>

      <Section title="5. Bresenham's Line Algorithm">
        <p>The industry standard. It computes accurate raster lines using <strong>purely integer arithmetic</strong>, completely eliminating floating-point math and rounding.</p>
        
        <h4 className="font-bold text-lg mt-6 mb-2">The Decision Parameter (Pk)</h4>
        <p>Bresenham evaluates the distance between the actual line and the two nearest pixels (d1 and d2). The difference <code>d1 - d2</code> is used to derive <code>p_k</code>.</p>
        <Equation>p_k = 2Δy·x_k - 2Δx·y_k + C</Equation>
        
        <div className="space-y-4 my-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-bold text-blue-800 mb-1 text-sm">If p_k {"<"} 0:</p>
            <p className="text-xs">Line is closer to the lower pixel. Choose <strong>y_k</strong>.<br/><code>p_{'{k+1}'} = p_k + 2Δy</code></p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="font-bold text-yellow-800 mb-1 text-sm">If p_k ≥ 0:</p>
            <p className="text-xs">Line is closer to the upper pixel. Choose <strong>y_k + 1</strong>.<br/><code>p_{'{k+1}'} = p_k + 2Δy - 2Δx</code></p>
          </div>
        </div>

        <h4 className="font-bold text-aast-navy mb-2">Initial Parameter</h4>
        <Equation>p_0 = 2Δy - Δx</Equation>
      </Section>

      <Section title="6. Comparison & Sandbox">
        <p className="text-sm text-slate-600 mb-4 italic">Adjust the coordinates below to see how both algorithms approximate the ideal mathematical line.</p>
        <DDABresenhamComparison />
      </Section>
    </div>
  );
};
