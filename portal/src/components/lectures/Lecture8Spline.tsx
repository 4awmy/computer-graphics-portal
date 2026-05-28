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

const InterpolationVsApproximationDemo = () => {
  const [type, setType] = useState<'interpolating' | 'approximating'>('interpolating');
  const points = [[2, 10], [6, 18], [14, 2], [18, 10]];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-aast-navy uppercase text-[10px] tracking-widest">Interpolation vs. Approximation</h4>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setType('interpolating')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition ${type === 'interpolating' ? 'bg-aast-navy text-white shadow-sm' : 'text-slate-500'}`}>Interpolating</button>
          <button onClick={() => setType('approximating')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition ${type === 'approximating' ? 'bg-aast-navy text-white shadow-sm' : 'text-slate-500'}`}>Approximating</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            {type === 'interpolating' 
              ? 'The curve passes exactly through every specified control point.' 
              : 'The curve is pulled toward the control points but does not necessarily pass through them.'}
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
             <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-tighter">Legend</div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-400" /><span className="text-[10px] text-slate-500">Control Points</span></div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-[2px] bg-aast-gold" /><span className="text-[10px] text-slate-500">Resulting Spline</span></div>
             </div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-video flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 20 20" className="w-full h-full transform scale-y-[-1]">
            {/* Control Points */}
            <polyline points={points.map(p => p.join(',')).join(' ')} fill="none" stroke="#334155" strokeWidth="0.1" strokeDasharray="0.2" />
            {points.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="0.3" fill="#64748b" />)}
            
            {/* The Curve */}
            {type === 'interpolating' ? (
              <path d="M 2 10 C 4 15, 5 18, 6 18 S 12 2, 14 2 S 16 5, 18 10" fill="none" stroke="#eab308" strokeWidth="0.4" />
            ) : (
              <path d="M 2 10 Q 6 18, 10 10 T 18 10" fill="none" stroke="#eab308" strokeWidth="0.4" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

const BezierBasisDemo = () => {
  const [degree, setDegree] = useState(3);
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Bernstein Basis Functions (Blending Weights)</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4 text-sm text-slate-600">
           <p>Each control point <code>P_i</code> is weighted by a Bernstein polynomial <code>b_{'{i,n}'}(t)</code>. These weights determine how much each point "pulls" the curve at time <code>t</code>.</p>
           <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(d => (
                <button key={d} onClick={() => setDegree(d)} className={`px-2 py-1 rounded border text-[10px] font-black transition ${degree === d ? 'bg-aast-navy text-aast-gold border-aast-navy' : 'bg-white border-slate-200'}`}>Degree {d}</button>
              ))}
           </div>
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-[10px] space-y-1">
             {degree === 1 && <><p>b0,1 = 1 - t</p><p>b1,1 = t</p></>}
             {degree === 2 && <><p>b0,2 = (1-t)²</p><p>b1,2 = 2t(1-t)</p><p>b2,2 = t²</p></>}
             {degree === 3 && <><p>b0,3 = (1-t)³</p><p>b1,3 = 3t(1-t)²</p><p>b2,3 = 3t²(1-t)</p><p>b3,3 = t³</p></>}
           </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden border-4 border-slate-800">
           <svg viewBox="0 0 100 100" className="w-full h-full transform scale-y-[-1]">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#334155" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="100" stroke="#334155" strokeWidth="0.5" />
              {/* Polynomial Curves */}
              {Array.from({length: degree + 1}).map((_, i) => {
                const colors = ['#ef4444', '#3b82f6', '#10b981', '#eab308'];
                const pts = [];
                for (let t = 0; t <= 1; t += 0.05) {
                   let val = 0;
                   if (degree === 1) val = i === 0 ? (1-t) : t;
                   else if (degree === 2) val = i === 0 ? Math.pow(1-t, 2) : i === 1 ? 2*t*(1-t) : t*t;
                   else if (degree === 3) val = i === 0 ? Math.pow(1-t, 3) : i === 1 ? 3*t*Math.pow(1-t, 2) : i === 2 ? 3*t*t*(1-t) : t*t*t;
                   pts.push(`${t*100},${val*100}`);
                }
                return <polyline key={i} points={pts.join(' ')} fill="none" stroke={colors[i]} strokeWidth="1" />;
              })}
           </svg>
           <div className="absolute top-2 right-2 text-[8px] text-slate-400 font-mono">Weight (0.0 to 1.0)</div>
           <div className="absolute bottom-2 right-2 text-[8px] text-slate-400 font-mono">Parameter t (0 to 1)</div>
        </div>
      </div>
    </div>
  );
};

const BezierSandbox = () => {
  const [p0, setP0] = useState({ x: 2, y: 2 });
  const [p1, setP1] = useState({ x: 6, y: 16 });
  const [p2, setP2] = useState({ x: 14, y: 16 });
  const [p3, setP3] = useState({ x: 18, y: 2 });
  const pts = [p0, p1, p2, p3];

  const curvePoints = useMemo(() => {
    const res = [];
    for (let t = 0; t <= 1; t += 0.02) {
      const x = Math.pow(1 - t, 3) * p0.x + 3 * t * Math.pow(1 - t, 2) * p1.x + 3 * t * t * (1 - t) * p2.x + Math.pow(t, 3) * p3.x;
      const y = Math.pow(1 - t, 3) * p0.y + 3 * t * Math.pow(1 - t, 2) * p1.y + 3 * t * t * (1 - t) * p2.y + Math.pow(t, 3) * p3.y;
      res.push([x, y]);
    }
    return res;
  }, [p0, p1, p2, p3]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Interactive Bézier Sandbox (Cubic)</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {pts.map((p, i) => (
          <div key={i} className="space-y-1">
             <label className="text-[10px] font-black text-slate-400 uppercase">P{i} (x,y)</label>
             <div className="flex gap-1">
                <input type="number" value={p.x} onChange={e => [setP0, setP1, setP2, setP3][i]({ ...p, x: Number(e.target.value) })} className="w-1/2 p-1 text-[10px] border rounded bg-slate-50" />
                <input type="number" value={p.y} onChange={e => [setP0, setP1, setP2, setP3][i]({ ...p, y: Number(e.target.value) })} className="w-1/2 p-1 text-[10px] border rounded bg-slate-50" />
             </div>
          </div>
        ))}
      </div>
      <div className="bg-slate-900 rounded-lg p-4 aspect-video flex items-center justify-center relative overflow-hidden">
        <svg viewBox="0 0 20 20" className="w-full h-full transform scale-y-[-1]">
          <polyline points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#334155" strokeWidth="0.1" strokeDasharray="0.2" />
          <polyline points={curvePoints.map(p => p.join(',')).join(' ')} fill="none" stroke="#eab308" strokeWidth="0.4" />
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="0.4" fill={i === 0 || i === 3 ? '#ef4444' : '#64748b'} className="cursor-move" />)}
        </svg>
        <div className="absolute bottom-4 right-4 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold p-2 border border-emerald-500/30 rounded uppercase tracking-widest">
           Convex Hull Control
        </div>
      </div>
    </div>
  );
};


export const Lecture8Spline: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans text-slate-800">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4 uppercase">
          CS352 — Week 08
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Design of Spline Algorithms
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-4 border-aast-gold pl-4 font-medium italic">
          Mastering smooth curve representation through piecewise polynomials and control point mapping.
        </p>
      </header>

      <Section title="1. Introduction to Splines">
        <p>A <strong>spline</strong> is a smooth curve defined mathematically using piecewise polynomial curves. In computer graphics, splines are powerful tools used to represent smooth, flexible, and intricate shapes.</p>
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 my-6 shadow-sm flex items-center gap-6">
           <div className="w-16 h-16 rounded-2xl bg-aast-navy flex items-center justify-center text-aast-gold font-black text-2xl">P_i</div>
           <div>
              <p className="font-black text-aast-navy text-sm uppercase mb-1">Control Points</p>
              <p className="text-xs text-slate-600 leading-relaxed">Segments are structurally connected at designated coordinates called control points. Manipulating these points allows for a wide range of geometric variations.</p>
           </div>
        </div>
      </Section>

      <Section title="2. Key Operational Classifications">
        <p>Splines are categorized into two primary structural formats depending on how they interact with their control points:</p>
        <ul className="space-y-4 my-6">
           <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                 <p className="font-bold text-slate-800">Interpolating Splines</p>
                 <p className="text-sm text-slate-500">The generated curve passes <strong>exactly through</strong> every specified control point.</p>
              </div>
           </li>
           <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
              <div>
                 <p className="font-bold text-slate-800">Approximating Splines</p>
                 <p className="text-sm text-slate-500">The curve is pulled toward the points, coming close but <strong>not necessarily passing through</strong> them.</p>
              </div>
           </li>
        </ul>
        <InterpolationVsApproximationDemo />
      </Section>

      <Section title="3. Analytical Representations">
        <p>Curves in standard viewport math fall into three major explicit or structural domains:</p>
        <div className="grid sm:grid-cols-3 gap-4 my-6 text-center">
           <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <h5 className="font-black text-[10px] uppercase text-slate-400 mb-2">Explicit</h5>
              <p className="text-xs font-mono bg-slate-50 py-2 rounded">y = mx + b</p>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <h5 className="font-black text-[10px] uppercase text-slate-400 mb-2">Implicit</h5>
              <p className="text-xs font-mono bg-slate-50 py-2 rounded">x² + y² - r² = 0</p>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
              <h5 className="font-black text-[10px] uppercase text-slate-400 mb-2">Parametric</h5>
              <p className="text-xs font-mono bg-slate-50 py-2 rounded">x=f(t), y=g(t)</p>
           </div>
        </div>
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-2xl">
           <h5 className="font-black text-emerald-800 text-xs uppercase mb-2">Why use Parametric?</h5>
           <ol className="list-decimal pl-6 space-y-2 text-xs text-emerald-900/70">
              <li><strong>Extreme Flexibility:</strong> Handles multi-valued forms that break vertical line tests.</li>
              <li><strong>Dimension Mapping:</strong> Parameter count matches target dimension (1=curve, 2=surface).</li>
              <li><strong>Independence:</strong> Coordinate paths stay completely uncoupled.</li>
           </ol>
        </div>
      </Section>

      <Section title="4. Mathematical Foundations of Bézier Curves">
        <p>Bézier curves (pioneered by Pierre Bézier) utilize a specific class of approximation splines constructed out of <strong>Bernstein Polynomials</strong> acting as blending weights.</p>
        <div className="bg-slate-800 text-white p-6 rounded-2xl my-6 shadow-xl">
           <p className="font-black text-aast-gold uppercase text-xs mb-4 tracking-widest">General Formula (Degree n)</p>
           <Equation>B(t) = Σ P_i · b_{'{i,n}'}(t)</Equation>
           <p className="text-center text-[10px] text-slate-400 mt-2 font-mono">b_{'{i,n}'}(t) = (n! / (i!(n-i)!)) · tⁱ · (1-t)^{'{n-i}'}</p>
        </div>
        <BezierBasisDemo />
      </Section>

      <Section title="5. Cubic Bézier Curves (Standard Order)">
        <p>The standard layout for scalable fonts and complex vector assets. It uses 4 distinct control coordinates: P0, P1, P2, and P3.</p>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl my-4">
           <h5 className="font-black text-blue-900 uppercase text-xs mb-3">Parametric Formula</h5>
           <p className="text-xs font-mono leading-relaxed text-blue-800">
              P(t) = (1-t)³ P0 + 3t(1-t)² P1 + 3t²(1-t) P2 + t³ P3
           </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500 uppercase tracking-tighter italic">
           <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400" /> Start: P(0) = P0</p>
           <p className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-400" /> End: P(1) = P3</p>
        </div>
        <BezierSandbox />
      </Section>

      <Section title="6. Numerical Problem Solving">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <p className="font-black text-aast-navy text-sm uppercase">Example: Cubic Evaluation</p>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded">Step-by-Step</span>
           </div>
           <div className="space-y-6">
              <div>
                 <p className="text-xs font-black text-slate-400 mb-2 uppercase">Input Coordinates</p>
                 <p className="text-xs font-mono text-slate-700">P0(1,1), P1(2,8), P2(6,0), P3(8,7)</p>
              </div>
              <div>
                 <p className="text-xs font-black text-slate-400 mb-2 uppercase">Simplified Polynomials</p>
                 <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                    <p className="text-xs font-mono text-emerald-700 font-bold">X(t) = -5t³ + 9t² + 3t + 1</p>
                    <p className="text-xs font-mono text-emerald-700 font-bold">Y(t) = 30t³ - 45t² + 21t + 1</p>
                 </div>
              </div>
              <table className="w-full text-[10px] border-collapse">
                 <thead className="bg-slate-50">
                    <tr className="border-b border-slate-100"><th className="p-2 text-left">t</th><th className="p-2 text-left">X(t)</th><th className="p-2 text-left">Y(t)</th></tr>
                 </thead>
                 <tbody>
                    <tr className="border-b border-slate-50"><td className="p-2 font-black">0.0</td><td className="p-2">1.00</td><td className="p-2">1.00</td></tr>
                    <tr className="border-b border-slate-50"><td className="p-2 font-black">0.5</td><td className="p-2">4.125</td><td className="p-2">4.00</td></tr>
                    <tr className="border-b border-slate-50"><td className="p-2 font-black">1.0</td><td className="p-2">8.00</td><td className="p-2">7.00</td></tr>
                 </tbody>
              </table>
           </div>
        </div>
      </Section>
    </div>
  );
};
