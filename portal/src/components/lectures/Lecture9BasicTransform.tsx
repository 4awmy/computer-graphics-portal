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

const CoordinateSystemDemo = () => {
  const [x, setX] = useState(8);
  const [y, setY] = useState(6);
  
  const r = Math.sqrt(x*x + y*y).toFixed(2);
  const theta = (Math.atan2(y, x) * 180 / Math.PI).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Cartesian (x,y) to Polar (r, θ)</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><label className="font-bold text-slate-500">x</label><input type="range" min="1" max="15" value={x} onChange={e => setX(Number(e.target.value))} className="w-full" /></div>
            <div><label className="font-bold text-slate-500">y</label><input type="range" min="1" max="15" value={y} onChange={e => setY(Number(e.target.value))} className="w-full" /></div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs space-y-2">
             <p className="text-aast-navy font-bold">Cartesian: ({x}, {y})</p>
             <div className="h-[1px] bg-slate-200" />
             <p className="text-emerald-600 font-black italic">Polar Result:</p>
             <p>Radius r = √({x}² + {y}²) = {r}</p>
             <p>Angle θ = tan⁻¹({y}/{x}) = {theta}°</p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden border-4 border-slate-800">
           <svg viewBox="-2 -2 20 20" className="w-full h-full transform scale-y-[-1]">
              <line x1="-2" y1="0" x2="20" y2="0" stroke="#334155" strokeWidth="0.1" />
              <line x1="0" y1="-2" x2="0" y2="20" stroke="#334155" strokeWidth="0.1" />
              {/* Radius line */}
              <line x1="0" y1="0" x2={x} y2={y} stroke="#eab308" strokeWidth="0.3" />
              {/* Components */}
              <line x1={x} y1="0" x2={x} y2={y} stroke="#3b82f6" strokeWidth="0.2" strokeDasharray="0.5" />
              <line x1="0" y1={y} x2={x} y2={y} stroke="#ef4444" strokeWidth="0.2" strokeDasharray="0.5" />
              
              <circle cx={x} cy={y} r="0.5" fill="white" />
              {/* Arc */}
              <path d={`M 3 0 A 3 3 0 0 1 ${3 * Math.cos(Math.atan2(y,x))} ${3 * Math.sin(Math.atan2(y,x))}`} fill="none" stroke="#eab308" strokeWidth="0.2" />
           </svg>
        </div>
      </div>
    </div>
  );
};

const ShearDemo = () => {
  const [shx, setShx] = useState(1);
  const [shy, setShy] = useState(0);
  const shape = [[0, 0], [4, 0], [4, 4], [0, 4]];

  const sheared = useMemo(() => {
    return shape.map(([x, y]) => [
      x + shx * y,
      y + shy * x
    ]);
  }, [shx, shy]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Shear Distortion Visualizer</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">X-Shear Factor (shx): {shx}</label>
            <input type="range" min="-2" max="2" step="0.1" value={shx} onChange={e => setShx(Number(e.target.value))} className="w-full" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Y-Shear Factor (shy): {shy}</label>
            <input type="range" min="-2" max="2" step="0.1" value={shy} onChange={e => setShy(Number(e.target.value))} className="w-full" />
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px] space-y-1">
             <p>x' = x + {shx} · y</p>
             <p>y' = y + {shy} · x</p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden border-4 border-slate-800">
           <svg viewBox="-10 -10 25 25" className="w-full h-full transform scale-y-[-1]">
              <line x1="-10" y1="0" x2="15" y2="0" stroke="#334155" strokeWidth="0.1" />
              <line x1="0" y1="-10" x2="0" y2="15" stroke="#334155" strokeWidth="0.1" />
              <polygon points={shape.map(p => p.join(',')).join(' ')} fill="none" stroke="#475569" strokeWidth="0.2" strokeDasharray="0.5" />
              <polygon points={sheared.map(p => p.join(',')).join(' ')} fill="rgba(234, 179, 8, 0.3)" stroke="#eab308" strokeWidth="0.4" />
           </svg>
        </div>
      </div>
    </div>
  );
};

const ReflectionDemo = () => {
  const [axis, setAxis] = useState<'x' | 'y' | 'origin' | 'diagonal'>('x');
  const shape = [[2, 2], [6, 2], [4, 6]];

  const reflected = useMemo(() => {
    return shape.map(([x, y]) => {
      if (axis === 'x') return [x, -y];
      if (axis === 'y') return [-x, y];
      if (axis === 'origin') return [-x, -y];
      if (axis === 'diagonal') return [y, x];
      return [x, y];
    });
  }, [axis]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Axis Reflection (Mirroring)</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-2">
           {['x', 'y', 'origin', 'diagonal'].map(a => (
             <button 
               key={a}
               onClick={() => setAxis(a as any)}
               className={`w-full text-left p-3 rounded-xl border text-xs font-black transition-all ${axis === a ? 'bg-aast-navy text-aast-gold border-aast-navy shadow-md translate-x-2' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
             >
               {a === 'x' && 'Across X-Axis (y = 0)'}
               {a === 'y' && 'Across Y-Axis (x = 0)'}
               {a === 'origin' && 'Across Origin (0,0)'}
               {a === 'diagonal' && 'Across Diagonal (y = x)'}
             </button>
           ))}
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden border-4 border-slate-800">
           <svg viewBox="-10 -10 20 20" className="w-full h-full transform scale-y-[-1]">
              <line x1="-10" y1="0" x2="10" y2="0" stroke={axis === 'x' ? '#eab308' : '#334155'} strokeWidth={axis === 'x' ? '0.3' : '0.1'} />
              <line x1="0" y1="-10" x2="0" y2="10" stroke={axis === 'y' ? '#eab308' : '#334155'} strokeWidth={axis === 'y' ? '0.3' : '0.1'} />
              {axis === 'diagonal' && <line x1="-10" y1="-10" x2="10" y2="10" stroke="#eab308" strokeWidth="0.2" strokeDasharray="0.5" />}
              
              <polygon points={shape.map(p => p.join(',')).join(' ')} fill="none" stroke="#475569" strokeWidth="0.2" strokeDasharray="0.5" />
              <polygon points={reflected.map(p => p.join(',')).join(' ')} fill="rgba(236, 72, 153, 0.3)" stroke="#ec4899" strokeWidth="0.4" />
           </svg>
        </div>
      </div>
    </div>
  );
};


export const Lecture9BasicTransform: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans text-slate-800">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4 uppercase">
          CS352 — Week 09
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Basic 2D Transformations
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-4 border-aast-gold pl-4">
          Fundamental operations for manipulating and positioning objects: Translation, Rotation, Scaling, Reflection, and Shear.
        </p>
      </header>

      <Section title="1. Introduction to Geometric Transformations">
        <p>Geometric transformations are the backbone of object manipulation and animation in graphics pipelines.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
           {[
             'Coordinate Mapping', 'Shape Modification', 'Object Positioning',
             'Object Replication', 'Virtual Cameras', 'Dynamic Animation'
           ].map(u => (
             <div key={u} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-2 h-2 rounded-full bg-aast-gold" />
                <span className="text-xs font-black text-aast-navy uppercase tracking-tighter">{u}</span>
             </div>
           ))}
        </div>
      </Section>

      <Section title="2. Coordinate Systems: Cartesian vs. Polar">
        <p>Understanding the relationship between Cartesian <code>(x, y)</code> and Polar <code>(r, θ)</code> is critical for rotation math.</p>
        <div className="grid sm:grid-cols-2 gap-4 my-4">
           <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h5 className="font-black text-aast-navy uppercase text-[10px] mb-3">Cartesian to Polar</h5>
              <div className="space-y-1 font-mono text-xs">
                 <p className="text-blue-600">r = √(x² + y²)</p>
                 <p className="text-emerald-600">θ = tan⁻¹(y / x)</p>
              </div>
           </div>
           <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h5 className="font-black text-aast-navy uppercase text-[10px] mb-3">Polar to Cartesian</h5>
              <div className="space-y-1 font-mono text-xs">
                 <p className="text-blue-600">x = r · cos(θ)</p>
                 <p className="text-emerald-600">y = r · sin(θ)</p>
              </div>
           </div>
        </div>
        <CoordinateSystemDemo />
      </Section>

      <Section title="3. Basic Transformations (TRS)">
        <div className="space-y-12">
          <div>
            <h4 className="text-lg font-black text-aast-navy mb-3 border-l-4 border-aast-gold pl-3">Translation</h4>
            <p className="text-sm leading-relaxed mb-4">Moves an object along a straight path by adding displacement factors <code>(tx, ty)</code>.</p>
            <Equation>x' = x + t_x {'\n'}y' = y + t_y</Equation>
          </div>

          <div>
            <h4 className="text-lg font-black text-aast-navy mb-3 border-l-4 border-aast-gold pl-3">2D Rotation</h4>
            <p className="text-sm leading-relaxed mb-4">Spins an object along a circular path. Positive angles rotate Counterclockwise (CCW).</p>
            <div className="bg-slate-800 text-slate-100 p-6 rounded-2xl shadow-xl font-mono text-xs mb-4">
               <p className="text-aast-gold font-black mb-2 uppercase">Derivation Matrix:</p>
               <p>x' = x cosθ - y sinθ</p>
               <p>y' = x sinθ + y cosθ</p>
            </div>
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
               <p className="text-[10px] text-emerald-800 uppercase font-black mb-1">Rotation Proof</p>
               <p className="text-xs italic text-emerald-900/70">A matrix represents a pure rotation if and only if its <strong>Determinant = 1</strong>.</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black text-aast-navy mb-3 border-l-4 border-aast-gold pl-3">Scaling</h4>
            <p className="text-sm leading-relaxed mb-4">Resizes an object by multiplying coordinates by factors <code>(sx, sy)</code>.</p>
            <ul className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-tighter">
               <li className="bg-slate-50 p-3 rounded-lg text-center">0 &lt; s &lt; 1 : Reduction</li>
               <li className="bg-slate-50 p-3 rounded-lg text-center">s &gt; 1 : Enlargement</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title="4. Shear & Reflection">
        <p>Beyond TRS, shear and reflection provide specialized shape distortions.</p>
        <h4 className="font-bold text-aast-navy mt-6 mb-2">Shearing</h4>
        <p className="text-sm mb-4 italic">Distorts an object as if internal layers are sliding past each other.</p>
        <ShearDemo />
        
        <h4 className="font-bold text-aast-navy mt-10 mb-2">Reflection</h4>
        <p className="text-sm mb-4 italic">Generates a standard mirror image across a selected axis line.</p>
        <ReflectionDemo />
      </Section>

      <Section title="5. Finding an Unknown Matrix">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-bl-lg">Advanced Problem</div>
           <p className="font-bold text-aast-navy text-sm mb-4">Identifying Transformation from Output</p>
           <p className="text-xs text-slate-600 mb-6 leading-relaxed">
             If a unit square maps to a new set of vectors <code>[0 2 8 6; 0 3 4 1]</code>, we can solve for the 2x2 matrix <code>M</code> column-by-column.
           </p>
           <div className="bg-slate-50 p-4 rounded-xl font-mono text-[10px] space-y-4">
              <div>
                <p className="text-slate-400 mb-1">// Step 1: Map (1,0) to Output Col 2</p>
                <p className="font-bold">[a c; b d] · [1; 0] = [a; b] = [2; 3] → <span className="text-blue-600">a=2, b=3</span></p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">// Step 2: Map (0,1) to Output Col 4</p>
                <p className="font-bold">[a c; b d] · [0; 1] = [c; d] = [6; 1] → <span className="text-blue-600">c=6, d=1</span></p>
              </div>
              <div className="border-t pt-3">
                 <p className="font-black text-aast-navy">Final Result: M = [2 6; 3 1]</p>
              </div>
           </div>
        </div>
      </Section>
    </div>
  );
};
