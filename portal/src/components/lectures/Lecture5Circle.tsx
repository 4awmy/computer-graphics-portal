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

const NaiveDemo = () => {
  const [radius, setRadius] = useState(15);
  const points = useMemo(() => {
    const pts = [];
    for (let x = 0; x <= radius; x++) {
      const y = Math.sqrt(radius * radius - x * x);
      pts.push({ x, y: Math.round(y), exact: y.toFixed(2) });
    }
    return pts;
  }, [radius]);
  const gs = radius + 2;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4">Interactive Demo: Naïve Algorithm</h4>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Radius</label>
            <input type="range" min="5" max="30" value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full" />
            <div className="text-center text-xs font-mono">{radius}</div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 aspect-square relative flex items-center justify-center">
            <svg viewBox={`0 0 ${gs} ${gs}`} className="w-full h-full transform scale-y-[-1]">
              <path d={`M ${radius} 0 A ${radius} ${radius} 0 0 1 0 ${radius}`} fill="none" stroke="#334155" strokeWidth="0.1" />
              {points.map((p, i) => (
                <rect key={i} x={p.x - 0.4} y={p.y - 0.4} width="0.8" height="0.8" fill="#ef4444" />
              ))}
            </svg>
            <div className="absolute bottom-4 right-4 bg-red-500/20 text-red-400 text-[10px] p-2 rounded font-bold border border-red-500/30">
              Notice the gaps at steep slopes (right side)
            </div>
          </div>
        </div>
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col h-[350px]">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-200 sticky top-0">
              <tr><th className="p-2">x</th><th className="p-2">Exact y = √(r²-x²)</th><th className="p-2">Plotted (x,y)</th></tr>
            </thead>
            <tbody>
              {points.map((p, i) => (
                <tr key={i} className="border-t border-slate-200">
                  <td className="p-2 font-mono">{p.x}</td>
                  <td className="p-2 font-mono text-slate-500">{p.exact}</td>
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

const SymmetryDemo = () => {
  const [x, setX] = useState(8);
  const [y, setY] = useState(3);
  const [showAll, setShowAll] = useState(false);

  const points = [
    { pt: [x, y], label: '(x,y)', color: '#eab308' },
    { pt: [y, x], label: '(y,x)', color: '#ec4899' },
    { pt: [-y, x], label: '(-y,x)', color: '#8b5cf6' },
    { pt: [-x, y], label: '(-x,y)', color: '#3b82f6' },
    { pt: [-x, -y], label: '(-x,-y)', color: '#10b981' },
    { pt: [-y, -x], label: '(-y,-x)', color: '#f59e0b' },
    { pt: [y, -x], label: '(y,-x)', color: '#ef4444' },
    { pt: [x, -y], label: '(x,-y)', color: '#6366f1' }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-aast-navy">Interactive Demo: 8-Way Symmetry</h4>
        <button onClick={() => setShowAll(!showAll)} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${showAll ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
          {showAll ? 'Hide Symmetry' : 'Show All 8 Octants'}
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div><label className="text-xs font-bold text-slate-500">x (Octant 1)</label><input type="range" min="0" max="10" value={x} onChange={e => setX(Number(e.target.value))} className="w-full" /></div>
          <div><label className="text-xs font-bold text-slate-500">y (Octant 1)</label><input type="range" min="0" max="10" value={y} onChange={e => setY(Number(e.target.value))} className="w-full" /></div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono space-y-2">
             {points.map((p, i) => (
               <div key={i} className={`flex items-center space-x-2 ${!showAll && i > 0 ? 'opacity-30' : ''}`}>
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                 <span>{p.label} = ({p.pt[0]}, {p.pt[1]})</span>
               </div>
             ))}
          </div>
        </div>
        <div className="col-span-2 bg-slate-900 rounded-lg p-4 aspect-square relative">
          <svg viewBox="-12 -12 24 24" className="w-full h-full transform scale-y-[-1]">
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#334155" strokeWidth="0.1" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#334155" strokeWidth="0.1" />
            <line x1="-12" y1="-12" x2="12" y2="12" stroke="#1e293b" strokeWidth="0.1" strokeDasharray="0.2" />
            <line x1="-12" y1="12" x2="12" y2="-12" stroke="#1e293b" strokeWidth="0.1" strokeDasharray="0.2" />
            <circle cx="0" cy="0" r={Math.sqrt(x*x + y*y)} stroke="#334155" strokeWidth="0.05" fill="none" />
            {points.map((p, i) => (showAll || i === 0) && (
              <circle key={i} cx={p.pt[0]} cy={p.pt[1]} r="0.4" fill={p.color} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

const MidpointDerivationDemo = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4">Visualizing the Midpoint Decision</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="bg-slate-900 rounded-lg p-4 aspect-square">
          <svg viewBox="0 8 10 10" className="w-full h-full transform scale-y-[-1]">
            {/* Grid */}
            {Array.from({length: 11}).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i} y1={8} x2={i} y2={18} stroke="#1e293b" strokeWidth="0.05" />
                <line x1={0} y1={i+8} x2={10} y2={i+8} stroke="#1e293b" strokeWidth="0.05" />
              </React.Fragment>
            ))}
            {/* Ideal Circle Arc */}
            <path d="M 0 16 A 16 16 0 0 1 16 0" fill="none" stroke="#334155" strokeWidth="0.1" />
            
            {/* Previous pixel */}
            <rect x="2.6" y="14.6" width="0.8" height="0.8" fill="#64748b" />
            <text x="3" y="-15.6" fill="#94a3b8" fontSize="0.5" textAnchor="middle" transform="scale(1, -1)">(x_k, y_k)</text>
            
            {/* Candidates */}
            <rect x="3.6" y="14.6" width="0.8" height="0.8" fill="none" stroke="#eab308" strokeWidth="0.1" />
            <text x="4" y="-15.6" fill="#eab308" fontSize="0.5" textAnchor="middle" transform="scale(1, -1)">E (x_k+1, y_k)</text>
            
            <rect x="3.6" y="13.6" width="0.8" height="0.8" fill="none" stroke="#3b82f6" strokeWidth="0.1" />
            <text x="4" y="-13.2" fill="#3b82f6" fontSize="0.5" textAnchor="middle" transform="scale(1, -1)">SE (x_k+1, y_k-1)</text>

            {/* Midpoint */}
            <circle cx="4" cy="14.5" r="0.15" fill="#ef4444" />
            <text x="4.5" y="-14.4" fill="#ef4444" fontSize="0.5" transform="scale(1, -1)">M</text>

            {/* Indicator */}
            <circle cx="0" cy="0" r="16" stroke="#f87171" strokeWidth="0.05" fill="none" strokeDasharray="0.1" />
          </svg>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <p>We are at pixel <strong className="text-slate-800">(x_k, y_k)</strong>.</p>
          <p>We must choose between two pixels for the next step:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li className="text-aast-gold font-bold">East (E): (x_k + 1, y_k)</li>
            <li className="text-blue-500 font-bold">South-East (SE): (x_k + 1, y_k - 1)</li>
          </ul>
          <p>We evaluate the circle function <code className="bg-slate-100 px-1 rounded text-red-500">f(x,y)</code> at the <strong className="text-red-500">Midpoint M</strong> between E and SE.</p>
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg font-mono text-xs">
            M = (x_k + 1, y_k - 1/2)<br/><br/>
            If f(M) {"<"} 0: M is inside the circle. E is closer to the boundary.<br/>
            If f(M) {">="} 0: M is outside the circle. SE is closer to the boundary.
          </div>
        </div>
      </div>
    </div>
  );
};

const MidpointTraceDemo = () => {
  const radius = 10;
  const [step, setStep] = useState(0);

  const fullTrace = useMemo(() => {
    const pts = [];
    let x = 0;
    let y = radius;
    let p = 1 - radius;

    while (x <= y) {
      pts.push({ step: x, p, x, y, chosen: p < 0 ? 'E' : 'SE' });
      if (p < 0) {
        x++;
        p += 2 * x + 1;
      } else {
        x++;
        y--;
        p += 2 * x + 1 - 2 * (y + 1); // Note: y is already decremented, so we use (y+1) for the formula, or just standard form
      }
    }
    return pts;
  }, [radius]);


  const currentTrace = fullTrace.slice(0, step + 1);
  const isDone = step >= fullTrace.length - 1;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-aast-navy">Interactive Demo: Midpoint Trace Table</h4>
        <div className="flex gap-2">
          <button onClick={() => setStep(0)} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded">Reset</button>
          <button onClick={() => !isDone && setStep(s => s + 1)} disabled={isDone} className="px-4 py-1 bg-aast-navy hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded shadow-sm">
            {isDone ? 'Finished' : 'Next Step'}
          </button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col h-[350px]">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-200 sticky top-0">
              <tr><th className="p-2">k</th><th className="p-2">P_k</th><th className="p-2">Plot (x,y)</th><th className="p-2">Choice</th></tr>
            </thead>
            <tbody>
              {currentTrace.map((row, i) => (
                <tr key={i} className={`border-t border-slate-200 ${i === step ? 'bg-blue-50' : ''}`}>
                  <td className="p-2 font-mono">{i}</td>
                  <td className="p-2 font-mono">{row.p}</td>
                  <td className="p-2 font-bold text-aast-navy">({row.x}, {row.y})</td>
                  <td className="p-2 font-bold">{row.chosen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4 aspect-square">
          <svg viewBox={`-2 -2 ${radius + 4} ${radius + 4}`} className="w-full h-full transform scale-y-[-1]">
             {/* Grid */}
             {Array.from({length: radius + 2}).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i} y1={0} x2={i} y2={radius + 2} stroke="#1e293b" strokeWidth="0.05" />
                <line x1={0} y1={i} x2={radius + 2} y2={i} stroke="#1e293b" strokeWidth="0.05" />
              </React.Fragment>
            ))}
            <path d={`M ${radius} 0 A ${radius} ${radius} 0 0 1 0 ${radius}`} fill="none" stroke="#334155" strokeWidth="0.1" />
            <line x1="0" y1="0" x2={radius+2} y2={radius+2} stroke="#1e293b" strokeWidth="0.1" strokeDasharray="0.2" />
            
            {currentTrace.map((p, i) => (
              <rect key={i} x={p.x - 0.4} y={p.y - 0.4} width="0.8" height="0.8" fill={i === step ? "#eab308" : "#3b82f6"} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};


export const Lecture5Circle: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4">
          Week 05
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Design of Circle Algorithms
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          A comprehensive exploration of circle generation, from naïve coordinate-based methods to highly efficient incremental integer arithmetic.
        </p>
      </header>

      <Section title="1. Output Primitives">
        <p>Graphics programming packages provide functions to describe a scene in terms of basic geometric structures referred to as <strong>Output Primitives</strong>.</p>
        <p>Output primitives include:</p>
        <ul className="list-disc pl-6 space-y-1 text-slate-700">
          <li>Points</li>
          <li>Lines</li>
          <li><strong>Circles</strong></li>
          <li>Spline curves</li>
        </ul>
        <p>Output primitives can be used to present more complex objects on the screen.</p>
      </Section>

      <Section title="2. Simple Circle Drawing: Naïve Algorithm">
        <p>The equation for a circle centered at <code className="bg-slate-100 px-1 rounded">(xc, yc)</code> is:</p>
        <Equation>(x - xc)² + (y - yc)² = r²</Equation>
        <p>If we center the circle at the origin (0,0), the equation simplifies to:</p>
        <Equation>x² + y² = r²</Equation>
        <p>We can solve for <code>y</code> to write a simple circle drawing algorithm:</p>
        <Equation>y = ±√(r² - x²)</Equation>
        
        <div className="bg-slate-100 border-l-4 border-slate-400 p-4 my-4 rounded-r-lg">
          <strong>Naïve Algorithm Logic:</strong><br />
          <code className="text-sm">
            for x = xmin to xmax<br/>
            &nbsp;&nbsp;y = sqrt(r*r - x*x)<br/>
            &nbsp;&nbsp;draw pixel(x,y)<br/>
          </code>
        </div>

        <p className="font-bold mt-6">Why is this not a brilliant solution?</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Visual Artifacts:</strong> The resulting circle has large gaps where the slope approaches the vertical. As x increases, y drops faster, meaning unit steps in x lead to huge jumps in y.</li>
          <li><strong>Computational Inefficiency:</strong> The calculations are not very efficient. It requires square (multiply) operations and the highly expensive square root operation. We try really hard to avoid these in computer graphics!</li>
        </ol>

        <NaiveDemo />
      </Section>

      <Section title="3. Polar Coordinates Algorithm">
        <p>Another approach is to use parametric polar equations:</p>
        <Equation>x = xc + r·cos(θ){'\n'}y = yc + r·sin(θ)</Equation>
        <p><strong>Disadvantage:</strong> This is extremely time consuming due to the trigonometric computations (sin, cos) required for every single point along the perimeter. Furthermore, uniform step sizes in θ result in non-uniform pixel spacing.</p>
      </Section>

      <Section title="4. Eight-Way Symmetry">
        <p>Computation can be drastically reduced by considering the symmetry of circles. A circle is highly symmetric. If we calculate a point (x, y) in one octant (e.g., from 0 to 45 degrees), we can plot 7 other points by mirroring it.</p>
        <div className="bg-slate-100 border-l-4 border-aast-gold p-4 my-4 rounded-r-lg">
          <strong>Procedure Circle_Points(x, y):</strong><br />
          <code className="text-sm text-slate-700">
            Plot(x,y); Plot(y,x);<br/>
            Plot(y,-x); Plot(x,-y);<br/>
            Plot(-x,-y); Plot(-y,-x);<br/>
            Plot(-y,x); Plot(-x,y);<br/>
          </code>
        </div>
        <p>We only need to calculate the values on the border of the circle in the first octant. The other values are determined by symmetry.</p>
        <SymmetryDemo />
      </Section>

      <Section title="5. Midpoint Circle Algorithm Derivation">
        <p>Similarly to the case with lines, there is an incremental algorithm for drawing circles — the <strong>Mid-point Circle Algorithm</strong>.</p>
        <p>We use eight-way symmetry, so we only ever calculate the points for the top right eighth of a circle (first octant, starting at <code>(0, r)</code> and ending when <code>x &gt;= y</code>), and then use symmetry to get the rest of the points.</p>

        <MidpointDerivationDemo />

        <h4 className="font-bold text-lg mt-8 mb-4">The Math</h4>
        <p>Define the circle function:</p>
        <Equation>f_circle(x,y) = x² + y² - r²</Equation>
        <p>If we just plotted point <code>(x_k, y_k)</code>, the next point is a choice between <code>(x_k + 1, y_k)</code> and <code>(x_k + 1, y_k - 1)</code>. We evaluate the function at the midpoint between them:</p>
        <Equation>
          p_k = f_circle(x_k + 1, y_k - 1/2){'\n'}
          p_k = (x_k + 1)² + (y_k - 1/2)² - r²{'\n'}
          p_k = x_k² + 2x_k + 1 + y_k² - y_k + 1/4 - r²
        </Equation>

        <p className="mt-4 font-bold">Recursive Steps:</p>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 my-4 space-y-2">
          <p><strong>If p_k {"<"} 0:</strong> Midpoint is inside the circle. Choose East pixel <code>(x_k + 1, y_k)</code>.</p>
          <Equation>p_{'{k+1}'} = p_k + 2x_{'{k+1}'} + 1</Equation>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 my-4 space-y-2">
          <p><strong>If p_k {">="} 0:</strong> Midpoint is outside the circle. Choose South-East pixel <code>(x_k + 1, y_k - 1)</code>.</p>
          <Equation>p_{'{k+1}'} = p_k + 2x_{'{k+1}'} + 1 - 2y_{'{k+1}'}</Equation>
        </div>

        <h4 className="font-bold text-lg mt-8 mb-4">Initial Decision Parameter (p_0)</h4>
        <p>Starting at <code>(0, r)</code>, we evaluate the first midpoint at <code>(0+1, r-1/2)</code>:</p>
        <Equation>
          p_0 = f_circle(1, r - 1/2){'\n'}
          p_0 = 1 + (r - 1/2)² - r²{'\n'}
          p_0 = 1 + r² - r + 1/4 - r²{'\n'}
          p_0 = 5/4 - r
        </Equation>
        <p>For integer radii, we can round this to <strong>p_0 = 1 - r</strong>.</p>
      </Section>

      <Section title="6. Solved Example: Radius 10">
        <p>Given the center point coordinates (0, 0) and radius as 10, generate all the points to form a circle in the first octant.</p>
        <ul className="list-disc pl-6 space-y-1 mb-6 text-slate-700">
          <li>Start point: <code>X_0 = 0, Y_0 = 10</code></li>
          <li>Initial parameter: <code>P_0 = 1 - 10 = -9</code></li>
        </ul>
        <MidpointTraceDemo />
        <p className="mt-6">After calculating the first octant, you apply the 8-way symmetry mirroring to obtain all points for Quadrant 1, and so on. If the center was <code>(4, 4)</code> instead of <code>(0, 0)</code>, you would simply add 4 to every calculated X and Y coordinate before plotting.</p>
      </Section>
    </div>
  );
};
