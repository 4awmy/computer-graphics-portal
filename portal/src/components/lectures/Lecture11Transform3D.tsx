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

// --- 3D Projection Helpers ---

const project = (x: number, y: number, z: number, angle: number = 45) => {
  // Simple Cavalier/Cabinet-style Oblique Projection
  const rad = (angle * Math.PI) / 180;
  const factor = 0.5; // Depth shortening
  return {
    px: x + z * factor * Math.cos(rad),
    py: y + z * factor * Math.sin(rad)
  };
};

// --- Demos ---

const Transform3DVisualizer = () => {
  const [type, setType] = useState<'translate' | 'rotate' | 'scale' | 'shear'>('translate');
  const [val, setVal] = useState(2);
  const [axis, setAxis] = useState<'x' | 'y' | 'z'>('x');

  const cube = [
    [0,0,0], [2,0,0], [2,2,0], [0,2,0],
    [0,0,2], [2,0,2], [2,2,2], [0,2,2]
  ];
  
  const edges = [
    [0,1], [1,2], [2,3], [3,0],
    [4,5], [5,6], [6,7], [7,4],
    [0,4], [1,5], [2,6], [3,7]
  ];

  const transformed = useMemo(() => {
    return cube.map(([x, y, z]) => {
      if (type === 'translate') {
        if (axis === 'x') return [x + val, y, z];
        if (axis === 'y') return [x, y + val, z];
        return [x, y, z + val];
      }
      if (type === 'scale') {
        if (axis === 'x') return [x * val, y, z];
        if (axis === 'y') return [x, y * val, z];
        return [x, y, z * val];
      }
      if (type === 'rotate') {
        const rad = (val * 30 * Math.PI) / 180;
        const c = Math.cos(rad), s = Math.sin(rad);
        if (axis === 'x') return [x, y * c - z * s, y * s + z * c];
        if (axis === 'y') return [x * c + z * s, y, -x * s + z * c];
        return [x * c - y * s, x * s + y * c, z];
      }
      if (type === 'shear') {
        // x-shear w.r.t z
        return [x + z * (val/2), y, z];
      }
      return [x, y, z];
    });
  }, [type, val, axis]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h4 className="font-bold text-aast-navy uppercase text-[10px] tracking-widest">3D Transformation Matrix Demo</h4>
        <div className="flex bg-slate-100 p-1 rounded-lg self-stretch sm:self-auto overflow-x-auto">
          {['translate', 'rotate', 'scale', 'shear'].map(t => (
            <button key={t} onClick={() => { setType(t as any); setVal(t === 'scale' ? 1.5 : 2); }} className={`px-3 py-1 rounded-md text-[10px] font-bold transition whitespace-nowrap ${type === t ? 'bg-aast-navy text-white shadow-sm' : 'text-slate-500'}`}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="flex-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Axis Control</label>
                <div className="flex gap-2">
                   {['x', 'y', 'z'].map(a => (
                     <button key={a} onClick={() => setAxis(a as any)} className={`flex-1 py-1 rounded border font-mono text-xs transition ${axis === a ? 'bg-aast-gold text-aast-navy border-aast-gold font-black' : 'bg-white border-slate-200 text-slate-400'}`}>{a.toUpperCase()}</button>
                   ))}
                </div>
             </div>
             <div className="flex-1">
                <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Factor / Angle</label>
                <input type="range" min={type === 'scale' ? 0.5 : -5} max={type === 'scale' ? 3 : 10} step="0.1" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full accent-aast-navy" />
             </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl shadow-inner font-mono text-[10px] text-slate-300 leading-relaxed overflow-x-auto">
             <p className="text-aast-gold font-black mb-2 uppercase tracking-tighter">Current Transformation Matrix (4x4)</p>
             {type === 'translate' && (
               <pre>
                {`[ 1  0  0  ${axis === 'x' ? val.toFixed(1) : 0} ]\n[ 0  1  0  ${axis === 'y' ? val.toFixed(1) : 0} ]\n[ 0  0  1  ${axis === 'z' ? val.toFixed(1) : 0} ]\n[ 0  0  0   1  ]`}
               </pre>
             )}
             {type === 'scale' && (
               <pre>
                {`[ ${axis === 'x' ? val.toFixed(1) : 1}  0  0  0 ]\n[ 0  ${axis === 'y' ? val.toFixed(1) : 1}  0  0 ]\n[ 0  0  ${axis === 'z' ? val.toFixed(1) : 1}  0 ]\n[ 0  0  0  1 ]`}
               </pre>
             )}
             {type === 'rotate' && <p className="italic opacity-60">// Rotation matrices involving sin/cos trigonometric terms...</p>}
             {type === 'shear' && <pre>{`[ 1  0  ${val.toFixed(1)}  0 ]\n[ 0  1  0  0 ]\n[ 0  0  1  0 ]\n[ 0  0  0  1 ]`}</pre>}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 aspect-square flex items-center justify-center relative shadow-2xl border-4 border-slate-800">
           <svg viewBox="-5 -5 20 20" className="w-full h-full transform scale-y-[-1]">
              {/* Axes */}
              <line x1="0" y1="0" x2="15" y2="0" stroke="#334155" strokeWidth="0.1" />
              <line x1="0" y1="0" x2="0" y2="15" stroke="#334155" strokeWidth="0.1" />
              <line x1="0" y1="0" x2="-5" y2="-5" stroke="#334155" strokeWidth="0.1" />
              
              {/* Original Cube (Ghost) */}
              {edges.map(([i1, i2], idx) => {
                const p1 = project(cube[i1][0], cube[i1][1], cube[i1][2]);
                const p2 = project(cube[i2][0], cube[i2][1], cube[i2][2]);
                return <line key={`orig-${idx}`} x1={p1.px} y1={p1.py} x2={p2.px} y2={p2.py} stroke="#1e293b" strokeWidth="0.1" strokeDasharray="0.2" />;
              })}

              {/* Transformed Cube */}
              {edges.map(([i1, i2], idx) => {
                const p1 = project(transformed[i1][0], transformed[i1][1], transformed[i1][2]);
                const p2 = project(transformed[i2][0], transformed[i2][1], transformed[i2][2]);
                return (
                  <line 
                    key={`trans-${idx}`} 
                    x1={p1.px} y1={p1.py} x2={p2.px} y2={p2.py} 
                    stroke={type === 'translate' ? '#eab308' : type === 'rotate' ? '#3b82f6' : '#ec4899'} 
                    strokeWidth="0.2" 
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                );
              })}
              
              {transformed.map((p, i) => {
                const proj = project(p[0], p[1], p[2]);
                return <circle key={i} cx={proj.px} cy={proj.py} r="0.2" fill="white" />;
              })}
           </svg>
           <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10">
              <p className="text-[8px] font-black text-white uppercase mb-1">Projection: Oblique</p>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-aast-gold" /><span className="text-[6px] text-white">X</span></div>
                 <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /><span className="text-[6px] text-white">Y</span></div>
                 <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-pink-500" /><span className="text-[6px] text-white">Z</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};


export const Lecture11Transform3D: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans text-slate-800">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4 uppercase tracking-wider">
          CS352 — Week 11
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          3D Geometric Transformations
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-4 border-aast-gold pl-4">
          Extending coordinate manipulation into spatial volumes using 4x4 homogeneous matrices.
        </p>
      </header>

      <Section title="1. Introduction to 3D Transformations">
        <p>Geometric transformations allow us to manipulate the position, size, orientation, and shape of 3D objects within a virtual scene.</p>
        <p>In computer graphics, we utilize <strong>4×4 homogeneous coordinate matrices</strong> to represent these operations in a unified manner. This makes it efficient to combine multiple transformations into a single composite matrix.</p>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-6">
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Translation', 'Scaling', 'Rotation', 'Shearing'].map(t => (
                <div key={t} className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                   <p className="text-[10px] font-black text-aast-navy uppercase mb-1">{t}</p>
                   <p className="text-[8px] text-slate-400 font-bold uppercase italic">
                     {t === 'Translation' ? 'Position' : t === 'Scaling' ? 'Size' : t === 'Rotation' ? 'Orientation' : 'Shape'}
                   </p>
                </div>
              ))}
           </div>
        </div>
      </Section>

      <Section title="2. 3D Translation">
        <p>Translation moves an object from one position to another by adding translation distances <code>(tx, ty, tz)</code> to its coordinate values.</p>
        <Equation>
           [ x' ] &nbsp; [ 1 0 0 tx ] &nbsp; [ x ]{'\n'}
           [ y' ] = [ 0 1 0 ty ] · [ y ]{'\n'}
           [ z' ] &nbsp; [ 0 0 1 tz ] &nbsp; [ z ]{'\n'}
           [ 1  ] &nbsp; [ 0 0 0 1  ] &nbsp; [ 1 ]
        </Equation>
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm my-6">
           <p className="font-black text-aast-navy text-xs uppercase mb-4 tracking-widest">Example: Vertex A(0,3,1) with t=(1,1,2)</p>
           <div className="font-mono text-xs text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p>x_new = 0 + 1 = 1</p>
              <p>y_new = 3 + 1 = 4</p>
              <p>z_new = 1 + 2 = 3</p>
              <p className="font-black mt-2">A' = (1, 4, 3)</p>
           </div>
        </div>
      </Section>

      <Section title="3. 3D Rotation (Flight Dynamics)">
        <p>Unlike 2D systems, 3D graphics allows rotation around any line in space. The three primary coordinate rotations are defined using aerospace terminology:</p>
        
        <div className="grid sm:grid-cols-3 gap-4 my-6">
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <h5 className="font-black text-aast-navy text-xs mb-2">X-Axis (Pitch)</h5>
              <p className="text-[10px] text-slate-500">Nose dipping down or rising up.</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <h5 className="font-black text-aast-navy text-xs mb-2">Y-Axis (Yaw)</h5>
              <p className="text-[10px] text-slate-500">Turning left or right during flight.</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <h5 className="font-black text-aast-navy text-xs mb-2">Z-Axis (Roll)</h5>
              <p className="text-[10px] text-slate-500">Dipping or rising of the wings.</p>
           </div>
        </div>

        <h4 className="font-bold text-slate-800 mb-2 mt-8">X-Axis Rotation Matrix [Rx(θ)]</h4>
        <Equation>
           [ 1 &nbsp; 0 &nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp; 0 ]{'\n'}
           [ 0  cosθ -sinθ  0 ]{'\n'}
           [ 0  sinθ  cosθ  0 ]{'\n'}
           [ 0 &nbsp; 0 &nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp; 1 ]
        </Equation>

        <h4 className="font-bold text-slate-800 mb-2 mt-8">Y-Axis Rotation Matrix [Ry(θ)]</h4>
        <Equation>
           [  cosθ  0  sinθ  0 ]{'\n'}
           [  0 &nbsp;&nbsp; 1  0 &nbsp;&nbsp; 0 ]{'\n'}
           [ -sinθ  0  cosθ  0 ]{'\n'}
           [  0 &nbsp;&nbsp; 0  0 &nbsp;&nbsp; 1 ]
        </Equation>
      </Section>

      <Section title="4. 3D Scaling">
        <p>Resizes an object using parameters <code>(sx, sy, sz)</code>. To resize relative to a fixed reference point <code>(xf, yf, zf)</code>:</p>
        <Equation>M_composite = T(xf, yf, zf) · S(sx, sy, sz) · T(-xf, -yf, -zf)</Equation>
        <Transform3DVisualizer />
      </Section>

      <Section title="5. 3D Reflection & Shearing">
        <div className="grid sm:grid-cols-2 gap-6 my-6">
           <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h5 className="font-black text-aast-navy text-xs uppercase mb-3">Reflection Planes</h5>
              <ul className="text-xs space-y-2 text-slate-600">
                 <li><strong>XY-Plane:</strong> Negates Z coordinate.</li>
                 <li><strong>XZ-Plane:</strong> Negates Y coordinate.</li>
                 <li><strong>YZ-Plane:</strong> Negates X coordinate.</li>
              </ul>
           </div>
           <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h5 className="font-black text-aast-navy text-xs uppercase mb-3">Shearing Matrix</h5>
              <p className="text-xs text-slate-600 mb-2">Distorts x and y paths as a factor of distance up/down the Z axis:</p>
              <div className="bg-slate-50 p-2 rounded font-mono text-[10px]">
                 [ 1 0 shx 0 ]{'\n'}
                 [ 0 1 shy 0 ]{'\n'}
                 [ 0 0  1  0 ]{'\n'}
                 [ 0 0  0  1 ]
              </div>
           </div>
        </div>
      </Section>

      <Section title="6. Composite 3D Transformations">
        <p>Composite transformations consolidate successive matrix changes into a singular matrix structure via sequential matrix multiplication.</p>
        <div className="bg-aast-navy text-white p-6 rounded-2xl shadow-xl my-6 relative overflow-hidden">
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-aast-gold/5 rounded-full -mb-16 -mr-16" />
           <p className="font-black text-aast-gold uppercase text-xs mb-3 tracking-widest">Order of Application (Right-to-Left)</p>
           <Equation>P' = (Mn · ... · M2 · M1) · P</Equation>
           <p className="text-xs text-slate-300 italic">M1 is applied first, Mn is applied last.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm group">
           <div className="flex justify-between items-center mb-6">
              <p className="font-black text-aast-navy text-sm uppercase tracking-wider">Sample Pipeline Problem</p>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-black rounded uppercase">Exam Style</span>
           </div>
           <p className="text-sm text-slate-600 mb-4 font-bold">Construct the composite transformation matrix for the following sequence:</p>
           <ol className="list-decimal pl-6 text-xs text-slate-500 space-y-1 mb-6">
              <li>Translate along Y by distance <code>a</code>: <code>T(0, a, 0)</code></li>
              <li>Rotate around X-axis by <code>90°</code>: <code>Rx(90°)</code></li>
              <li>Translate along Z by distance <code>a</code>: <code>T(0, 0, a)</code></li>
              <li>Rotate around Y-axis by <code>90°</code>: <code>Ry(90°)</code></li>
           </ol>
           <div className="bg-slate-50 p-5 rounded-2xl">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 text-center">Mathematical Ordering Expression</p>
              <Equation>M_composite = Ry(90°) · T(0, 0, a) · Rx(90°) · T(0, a, 0)</Equation>
              <p className="text-[10px] text-slate-400 mt-4 italic leading-relaxed text-center">Evaluating this sequence from right to left combines translation vectors and rotational coefficients into a unified matrix.</p>
           </div>
        </div>
      </Section>

    </div>
  );
};
