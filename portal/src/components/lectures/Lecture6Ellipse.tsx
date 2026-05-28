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

const RegionAnalysisDemo = () => {
  const [rx, setRx] = useState(12);
  const [ry, setRy] = useState(8);

  const points = useMemo(() => {
    const pts = [];
    let x = 0;
    let y = ry;
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    
    // Region 1
    let p1 = ry2 - rx2 * ry + 0.25 * rx2;
    let dx = 2 * ry2 * x;
    let dy = 2 * rx2 * y;
    
    while (dx < dy) {
      pts.push({ x, y, region: 1, dx, dy });
      x++;
      dx += 2 * ry2;
      if (p1 < 0) {
        p1 += dx + ry2;
      } else {
        y--;
        dy -= 2 * rx2;
        p1 += dx - dy + ry2;
      }
    }
    
    // Region 2
    let p2 = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
    while (y >= 0) {
      pts.push({ x, y, region: 2, dx, dy });
      y--;
      dy -= 2 * rx2;
      if (p2 > 0) {
        p2 += rx2 - dy;
      } else {
        x++;
        dx += 2 * ry2;
        p2 += dx - dy + rx2;
      }
    }
    return pts;
  }, [rx, ry]);

  const gs = Math.max(rx, ry) + 2;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4">Interactive Demo: Two-Region Analysis</h4>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">rx</label>
              <input type="range" min="4" max="20" value={rx} onChange={e => setRx(Number(e.target.value))} className="w-full" />
              <div className="text-center text-xs font-mono">{rx}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">ry</label>
              <input type="range" min="4" max="20" value={ry} onChange={e => setRy(Number(e.target.value))} className="w-full" />
              <div className="text-center text-xs font-mono">{ry}</div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 aspect-square relative flex items-center justify-center">
            <svg viewBox={`-2 -2 ${gs + 2} ${gs + 2}`} className="w-full h-full transform scale-y-[-1]">
              <line x1="-2" y1="0" x2={gs} y2="0" stroke="#334155" strokeWidth="0.1" />
              <line x1="0" y1="-2" x2="0" y2={gs} stroke="#334155" strokeWidth="0.1" />
              
              <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="none" stroke="#334155" strokeWidth="0.1" />
              
              {points.map((p, i) => (
                <rect key={i} x={p.x - 0.4} y={p.y - 0.4} width="0.8" height="0.8" fill={p.region === 1 ? '#ef4444' : '#3b82f6'} />
              ))}
              
              {/* Highlight transition point */}
              {points.filter(p => p.region === 2).length > 0 && (
                <circle cx={points.find(p => p.region === 2)?.x || 0} cy={points.find(p => p.region === 2)?.y || 0} r="0.6" fill="none" stroke="#eab308" strokeWidth="0.2" className="animate-pulse" />
              )}
            </svg>
            <div className="absolute bottom-4 left-4 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs text-white font-bold">Region 1 (slope &lt; 1)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs text-white font-bold">Region 2 (slope &gt; 1)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col h-[400px]">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-200 sticky top-0">
              <tr>
                <th className="p-2">Point</th>
                <th className="p-2 text-red-600">2r_y²x</th>
                <th className="p-2 text-blue-600">2r_x²y</th>
                <th className="p-2">Condition</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p, i) => {
                const r1 = p.dx < p.dy;
                return (
                  <tr key={i} className={`border-t border-slate-200 ${p.region === 1 ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <td className="p-2 font-bold text-slate-700">({p.x}, {p.y})</td>
                    <td className="p-2 font-mono text-red-600">{p.dx}</td>
                    <td className="p-2 font-mono text-blue-600">{p.dy}</td>
                    <td className="p-2 font-bold">
                      {r1 ? '< (Reg 1)' : '>= (Reg 2)'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const EllipseTraceDemo = () => {
  const rx = 8;
  const ry = 6;
  const [step, setStep] = useState(0);

  const fullTrace = useMemo(() => {
    const pts = [];
    let x = 0;
    let y = ry;
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    
    // Region 1
    let p1 = ry2 - rx2 * ry + 0.25 * rx2;
    let dx = 2 * ry2 * x;
    let dy = 2 * rx2 * y;
    
    while (dx < dy) {
      pts.push({ step: x, region: 1, p: p1, x, y, chosen: p1 < 0 ? 'E' : 'SE' });
      x++;
      dx += 2 * ry2;
      if (p1 < 0) {
        p1 += dx + ry2;
      } else {
        y--;
        dy -= 2 * rx2;
        p1 += dx - dy + ry2;
      }
    }
    
    // Region 2
    let p2 = ry2 * (x + 0.5) * (x + 0.5) + rx2 * (y - 1) * (y - 1) - rx2 * ry2;
    let k = 0;
    while (y >= 0) {
      pts.push({ step: k++, region: 2, p: p2, x, y, chosen: p2 > 0 ? 'S' : 'SE' });
      y--;
      dy -= 2 * rx2;
      if (p2 > 0) {
        p2 += rx2 - dy;
      } else {
        x++;
        dx += 2 * ry2;
        p2 += dx - dy + rx2;
      }
    }
    return pts;
  }, [rx, ry]);


  const currentTrace = fullTrace.slice(0, step + 1);
  const isDone = step >= fullTrace.length - 1;

  const gs = Math.max(rx, ry) + 2;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-aast-navy">Interactive Trace: rx={rx}, ry={ry}</h4>
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
              <tr>
                <th className="p-2">Reg</th>
                <th className="p-2">P_k</th>
                <th className="p-2">Plot (x,y)</th>
                <th className="p-2">Choice</th>
              </tr>
            </thead>
            <tbody>
              {currentTrace.map((row, i) => (
                <tr key={i} className={`border-t border-slate-200 ${i === step ? 'bg-yellow-100' : ''}`}>
                  <td className={`p-2 font-bold ${row.region === 1 ? 'text-red-500' : 'text-blue-500'}`}>R{row.region}</td>
                  <td className="p-2 font-mono">{Math.round(row.p)}</td>
                  <td className="p-2 font-bold text-aast-navy">({row.x}, {row.y})</td>
                  <td className="p-2 font-bold text-slate-600">{row.chosen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-4 aspect-square">
          <svg viewBox={`-2 -2 ${gs + 2} ${gs + 2}`} className="w-full h-full transform scale-y-[-1]">
             {/* Grid */}
             {Array.from({length: gs}).map((_, i) => (
              <React.Fragment key={i}>
                <line x1={i} y1={0} x2={i} y2={gs} stroke="#1e293b" strokeWidth="0.05" />
                <line x1={0} y1={i} x2={gs} y2={i} stroke="#1e293b" strokeWidth="0.05" />
              </React.Fragment>
            ))}
            <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="none" stroke="#334155" strokeWidth="0.1" />
            
            {currentTrace.map((p, i) => (
              <rect key={i} x={p.x - 0.4} y={p.y - 0.4} width="0.8" height="0.8" fill={i === step ? "#eab308" : (p.region === 1 ? '#ef4444' : '#3b82f6')} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};


export const Lecture6Ellipse: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4">
          Week 06
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Design of Ellipse Algorithms
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          An in-depth exploration of scan-converting ellipses, utilizing the Midpoint Algorithm, two-region analysis, and 4-quadrant symmetry.
        </p>
      </header>

      <Section title="1. Equation of an Ellipse">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p>Consider an ellipse centered at the origin, <code className="bg-slate-100 px-1 rounded">(x_c, y_c) = (0,0)</code>:</p>
            <Equation>(x / a)² + (y / b)² = 1</Equation>
            <p>In most graphics literature, we denote the semi-major and semi-minor axes as <code>rx</code> and <code>ry</code> (or <code>a</code> and <code>b</code>).</p>
            <p className="mt-4">We can define the implicit ellipse function as:</p>
            <Equation>f_ellipse(x, y) = ry² x² + rx² y² - rx² ry²</Equation>
            <ul className="list-disc pl-6 space-y-1 text-slate-700 mt-2">
              <li><span className="text-emerald-500 font-bold">f(x, y) {"<"} 0:</span> (x,y) is inside the ellipse.</li>
              <li><span className="text-yellow-500 font-bold">f(x, y) {"=="} 0:</span> (x,y) is exactly on the ellipse boundary.</li>
              <li><span className="text-blue-500 font-bold">f(x, y) {">"} 0:</span> (x,y) is outside the ellipse.</li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 aspect-video flex items-center justify-center relative shadow-inner">
            <svg viewBox="-20 -15 40 30" className="w-full h-full transform scale-y-[-1]">
              <ellipse cx="0" cy="0" rx="15" ry="10" fill="none" stroke="#eab308" strokeWidth="0.5" />
              {/* Inside */}
              <circle cx="-5" cy="4" r="1" fill="#10b981" />
              <text x="-5" y="-6" fill="#10b981" fontSize="3" textAnchor="middle" transform="scale(1, -1)">f{"<"}0</text>
              {/* On boundary */}
              <circle cx="15" cy="0" r="1" fill="#eab308" />
              <text x="15" y="4" fill="#eab308" fontSize="3" textAnchor="middle" transform="scale(1, -1)">f=0</text>
              {/* Outside */}
              <circle cx="10" cy="12" r="1" fill="#3b82f6" />
              <text x="10" y="-14" fill="#3b82f6" fontSize="3" textAnchor="middle" transform="scale(1, -1)">f{">"}0</text>
            </svg>
          </div>
        </div>
      </Section>

      <Section title="2. Properties & Parametric Form">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <p>The equation is simplified if the ellipse axis is parallel to the coordinate axis:</p>
            <Equation>((x - x_c) / rx)² + ((y - y_c) / ry)² = 1</Equation>
            <p className="mt-4">The parametric form is:</p>
            <Equation>x = x_c + rx · cos(θ){'\n'}y = y_c + ry · sin(θ)</Equation>
            <p className="mt-4 text-slate-700">Just like circles, calculating trigonometric functions (cos, sin) at each step is computationally expensive. Therefore, we use an incremental integer approach.</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 aspect-video flex items-center justify-center relative shadow-inner">
            <svg viewBox="-20 -15 40 30" className="w-full h-full transform scale-y-[-1]">
              <ellipse cx="0" cy="0" rx="15" ry="10" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="1 1" />
              {/* Polar points */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(theta => {
                const rad = theta * Math.PI / 180;
                const x = 15 * Math.cos(rad);
                const y = 10 * Math.sin(rad);
                return <circle key={theta} cx={x} cy={y} r="1" fill="#ec4899" />;
              })}
              <line x1="0" y1="0" x2={15 * Math.cos(Math.PI/6)} y2={10 * Math.sin(Math.PI/6)} stroke="#475569" strokeWidth="0.3" />
              <text x="5" y="-2" fill="#94a3b8" fontSize="3" transform="scale(1, -1)">θ</text>
            </svg>
          </div>
        </div>
      </Section>

      <Section title="3. Two-Region Analysis">
        <p>Unlike a circle, which has 8-way symmetry, an ellipse only has <strong>4-quadrant symmetry</strong>. We compute points in the first quadrant, then mirror them to the other three.</p>
        <p>However, the slope of the curve changes dramatically across the first quadrant. To maintain a connected sequence of pixels, we must divide the quadrant into two regions:</p>
        
        <div className="grid sm:grid-cols-2 gap-4 my-6">
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <h4 className="font-black text-red-600 mb-2">Region 1</h4>
            <p className="text-sm text-slate-700">The slope of the tangent is less than 1 (flat). We step consistently in the <strong>X direction</strong>.</p>
            <p className="text-xs font-mono bg-white p-2 mt-2 rounded border border-red-100">Condition: 2ry² x {"<"} 2rx² y</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
            <h4 className="font-black text-blue-600 mb-2">Region 2</h4>
            <p className="text-sm text-slate-700">The slope of the tangent is greater than 1 (steep). We step consistently in the <strong>Y direction</strong>.</p>
            <p className="text-xs font-mono bg-white p-2 mt-2 rounded border border-blue-100">Condition: 2ry² x {">="} 2rx² y</p>
          </div>
        </div>

        <RegionAnalysisDemo />
      </Section>

      <Section title="4. Midpoint Ellipse Algorithm">
        <p>Similar to the Midpoint Circle Algorithm, we evaluate the function <code>f_ellipse</code> at the midpoint between two candidate pixels.</p>
        
        <h4 className="font-bold text-lg mt-6 mb-2 text-red-600 border-l-4 border-red-600 pl-2">Region 1 Logic</h4>
        <p>We start at <code>(0, ry)</code>. Our candidates are East <code>(x+1, y)</code> and South-East <code>(x+1, y-1)</code>.</p>
        <p>Midpoint: <code>(x_k + 1, y_k - 1/2)</code></p>
        <Equation>p1_k = f_ellipse(x_k + 1, y_k - 1/2)</Equation>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>If p1_k {"<"} 0:</strong> Midpoint is inside. Choose E pixel. <br/><code className="bg-slate-100 px-1 rounded">p1_k+1 = p1_k + 2ry² x_k+1 + ry²</code></li>
          <li><strong>If p1_k {">="} 0:</strong> Midpoint is outside. Choose SE pixel. <br/><code className="bg-slate-100 px-1 rounded">p1_k+1 = p1_k + 2ry² x_k+1 - 2rx² y_k+1 + ry²</code></li>
        </ul>
        <p className="mt-2 text-sm text-slate-500">Initial parameter: <code>p1_0 = ry² - rx² ry + 0.25 rx²</code></p>

        <h4 className="font-bold text-lg mt-8 mb-2 text-blue-600 border-l-4 border-blue-600 pl-2">Region 2 Logic</h4>
        <p>We start at the last point calculated in Region 1. Our candidates are South <code>(x, y-1)</code> and South-East <code>(x+1, y-1)</code>.</p>
        <p>Midpoint: <code>(x_k + 1/2, y_k - 1)</code></p>
        <Equation>p2_k = f_ellipse(x_k + 1/2, y_k - 1)</Equation>
        <ul className="list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>If p2_k {">"} 0:</strong> Midpoint is outside. Choose S pixel. <br/><code className="bg-slate-100 px-1 rounded">p2_k+1 = p2_k - 2rx² y_k+1 + rx²</code></li>
          <li><strong>If p2_k {"<="} 0:</strong> Midpoint is inside. Choose SE pixel. <br/><code className="bg-slate-100 px-1 rounded">p2_k+1 = p2_k + 2ry² x_k+1 - 2rx² y_k+1 + rx²</code></li>
        </ul>
        <p className="mt-2 text-sm text-slate-500">Initial parameter: <code>p2_0 = ry² (x0 + 0.5)² + rx² (y0 - 1)² - rx² ry²</code></p>
      </Section>

      <Section title="5. Solved Example">
        <p>Trace the Midpoint Ellipse Algorithm for <code>rx = 8</code> and <code>ry = 6</code>.</p>
        <ul className="list-disc pl-6 space-y-1 mb-6 text-slate-700">
          <li><code>rx² = 64</code>, <code>ry² = 36</code></li>
          <li>Region 1 initial point: <code>(0, 6)</code></li>
          <li>Stop Region 1 when: <code>2ry² x &gt;= 2rx² y</code> (i.e., <code>72x &gt;= 128y</code>)</li>
        </ul>
        <EllipseTraceDemo />
      </Section>
    </div>
  );
};
