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

const ScaleTranslateOrderDemo = () => {
  const [order, setOrder] = useState<'st' | 'ts'>('ts'); // Scale then Translate vs Translate then Scale
  const tx = 3, ty = 1, s = 2;
  const shape = [[0, 0], [1, 0], [1, 1], [0, 1]];

  const transformed = useMemo(() => {
    return shape.map(([x, y]) => {
      if (order === 'st') {
        // Scale(2) then Translate(3,1)
        const x1 = x * s, y1 = y * s;
        return [x1 + tx, y1 + ty];
      } else {
        // Translate(3,1) then Scale(2)
        const x1 = x + tx, y1 = y + ty;
        return [x1 * s, y1 * s];
      }
    });
  }, [order]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-aast-navy uppercase text-[10px] tracking-widest">Order of Operations (Non-Commutativity)</h4>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => setOrder('st')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition ${order === 'st' ? 'bg-aast-navy text-white shadow-sm' : 'text-slate-500'}`}>Scale → Translate</button>
          <button onClick={() => setOrder('ts')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition ${order === 'ts' ? 'bg-aast-navy text-white shadow-sm' : 'text-slate-500'}`}>Translate → Scale</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Because matrix multiplication is not commutative, the result of <strong>S · T</strong> is different from <strong>T · S</strong>.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-[11px] space-y-1">
             <p className="font-bold text-aast-navy mb-2">Final Position for (1,1):</p>
             {order === 'st' ? (
               <><p>1. Scale (1,1) by 2 → (2,2)</p><p>2. Translate by (3,1) → <span className="text-emerald-600 font-black">(5, 3)</span></p></>
             ) : (
               <><p>1. Translate (1,1) by (3,1) → (4,2)</p><p>2. Scale by 2 → <span className="text-emerald-600 font-black">(8, 4)</span></p></>
             )}
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden border-4 border-slate-800">
           <svg viewBox="-2 -2 12 12" className="w-full h-full transform scale-y-[-1]">
              <line x1="-2" y1="0" x2="12" y2="0" stroke="#334155" strokeWidth="0.1" />
              <line x1="0" y1="-2" x2="0" y2="12" stroke="#334155" strokeWidth="0.1" />
              <polygon points={shape.map(p => p.join(',')).join(' ')} fill="none" stroke="#475569" strokeWidth="0.1" strokeDasharray="0.3" />
              <polygon points={transformed.map(p => p.join(',')).join(' ')} fill="rgba(234, 179, 8, 0.3)" stroke="#eab308" strokeWidth="0.2" />
              {transformed.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="0.2" fill="#ffffff" />)}
           </svg>
        </div>
      </div>
    </div>
  );
};

const ArbitraryPivotDemo = () => {
  const [angle, setAngle] = useState(45);
  const px = 2, py = 2; // Pivot point
  const shape = [[2, 2], [5, 2], [5, 4], [2, 4]];

  const transformed = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const c = Math.cos(rad), s = Math.sin(rad);
    return shape.map(([x, y]) => {
      // 1. Translate pivot to origin
      const x1 = x - px, y1 = y - py;
      // 2. Rotate around origin
      const x2 = x1 * c - y1 * s, y2 = x1 * s + y1 * c;
      // 3. Translate back
      return [x2 + px, y2 + py];
    });
  }, [angle]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Rotation about Arbitrary Pivot (xr, yr)</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">To rotate about a point other than the origin, we must translate the point to the origin first.</p>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Rotation Angle: {angle}°</label>
            <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-aast-navy" />
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] leading-tight">
             <p className="text-blue-600 font-bold mb-1">M_composite = T(xp, yp) · R(θ) · T(-xp, -yp)</p>
             <p className="text-slate-400 italic">Pivot at (2, 2)</p>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden border-4 border-slate-800">
           <svg viewBox="-2 -2 12 12" className="w-full h-full transform scale-y-[-1]">
              <line x1="-2" y1="0" x2="12" y2="0" stroke="#334155" strokeWidth="0.1" />
              <line x1="0" y1="-2" x2="0" y2="12" stroke="#334155" strokeWidth="0.1" />
              <circle cx={px} cy={py} r="0.3" fill="#ef4444" className="animate-pulse" />
              <polygon points={shape.map(p => p.join(',')).join(' ')} fill="none" stroke="#475569" strokeWidth="0.1" strokeDasharray="0.3" />
              <polygon points={transformed.map(p => p.join(',')).join(' ')} fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="0.2" />
           </svg>
        </div>
      </div>
    </div>
  );
};


export const Lecture10CompositeTransform: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans text-slate-800">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4 uppercase">
          CS352 — Week 10
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Composite 2D Transformations
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-4 border-aast-gold pl-4">
          Optimizing complex scene layouts by unifying multiple operations into single matrices using Homogeneous Coordinates.
        </p>
      </header>

      <Section title="1. Introduction to Composite Transformations">
        <p>Complex scenes require a sequence of transformations. To optimize performance, individual operations are consolidated into a single matrix.</p>
        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl my-6">
           <h5 className="font-black text-red-800 uppercase text-xs mb-2">The Limitation</h5>
           <p className="text-xs text-red-900/70 leading-relaxed">
             Basic Translation uses matrix <strong>Addition</strong>, while Rotation/Scaling use matrix <strong>Multiplication</strong>. This inconsistency prevents mathematical nesting.
           </p>
        </div>
      </Section>

      <Section title="2. The Solution: Homogeneous Coordinates">
        <p>To unify all transformations, we convert 2D coordinates to a 3-element representation <code>(x, y, 1)</code>.</p>
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl my-6">
           <p className="font-black text-aast-gold text-xs uppercase mb-4 tracking-widest text-center">3x3 Unification Matrix</p>
           <Equation>
              [ x' ] &nbsp;&nbsp;&nbsp; [ m11 m12 m13 ] &nbsp;&nbsp;&nbsp; [ x ]{'\n'}
              [ y' ] = [ m21 m22 m23 ] · [ y ]{'\n'}
              [ 1  ] &nbsp;&nbsp;&nbsp; [ 0   0   1   ] &nbsp;&nbsp;&nbsp; [ 1 ]
           </Equation>
        </div>
        <p className="text-sm text-slate-600">Translation factors <code>(tx, ty)</code> now live in the third column, allowing them to be multiplied just like rotation and scaling.</p>
      </Section>

      <Section title="3. Successive Multiplications">
        <div className="grid sm:grid-cols-3 gap-4 my-8">
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <h5 className="font-black text-[10px] text-slate-400 uppercase mb-2">Translations</h5>
              <p className="text-xs font-bold text-emerald-600">Additive</p>
              <p className="text-[10px] text-slate-500 mt-1">T(t1) · T(t2) = T(t1+t2)</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <h5 className="font-black text-[10px] text-slate-400 uppercase mb-2">Scaling</h5>
              <p className="text-xs font-bold text-blue-600">Multiplicative</p>
              <p className="text-[10px] text-slate-500 mt-1">S(s1) · S(s2) = S(s1·s2)</p>
           </div>
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <h5 className="font-black text-[10px] text-slate-400 uppercase mb-2">Rotations</h5>
              <p className="text-xs font-bold text-purple-600">Additive</p>
              <p className="text-[10px] text-slate-500 mt-1">R(α) · R(θ) = R(α+θ)</p>
           </div>
        </div>
        <ScaleTranslateOrderDemo />
      </Section>

      <Section title="4. Arbitrary Pivot Point Transformations">
        <p>Executing modifications like rotation or scaling relative to an arbitrary reference coordinate spot <code>(xr, yr)</code> requires a multi-step composite path:</p>
        <div className="bg-slate-100 p-6 rounded-2xl my-6 flex flex-col items-center">
           <div className="flex gap-4 items-center">
              <div className="text-[10px] font-bold bg-white px-2 py-1 border rounded shadow-sm">1. Translate to Origin</div>
              <span className="text-slate-400">→</span>
              <div className="text-[10px] font-bold bg-white px-2 py-1 border rounded shadow-sm">2. Core Transform</div>
              <span className="text-slate-400">→</span>
              <div className="text-[10px] font-bold bg-white px-2 py-1 border rounded shadow-sm">3. Translate Back</div>
           </div>
        </div>
        <ArbitraryPivotDemo />
      </Section>

      <Section title="5. Reference Point Shearing">
        <p>Shearing distortions can also be calculated relative to an arbitrary reference frame location <code>(xr, yr)</code>.</p>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-[11px] leading-loose">
           <p className="font-black text-aast-navy uppercase mb-2 tracking-widest border-b pb-2">X-Reference Shear Matrix</p>
           <p>[ 1 &nbsp; shx &nbsp; -shx·yr ]</p>
           <p>[ 0 &nbsp; 1 &nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</p>
           <p>[ 0 &nbsp; 0 &nbsp;&nbsp;&nbsp; 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</p>
        </div>
      </Section>

      <Section title="6. Numerical Problem Case Study">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm group">
           <div className="flex justify-between items-center mb-6">
              <p className="font-black text-aast-navy text-sm uppercase tracking-wider">Example: Scale about Fixed Point</p>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase">Matrix Math</span>
           </div>
           <p className="text-sm text-slate-600 mb-6 italic">Scale triangle A(0,0), B(5,1), C(3,4) by sx=2, sy=1 about pivot (2,3).</p>
           <div className="bg-slate-50 p-5 rounded-2xl space-y-6">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">1. Composite Matrix Calculation</p>
                 <Equation>M = [ 2 0 2(1-2) ] = [ 2 0 2 ]{'\n'}    [ 0 1 3(1-1) ] = [ 0 1 0 ]{'\n'}    [ 0 0 1      ] = [ 0 0 1 ]</Equation>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase mb-2">2. Vertex Mapping</p>
                 <div className="text-[11px] font-mono leading-relaxed space-y-1">
                    <p>A'(2,0)</p>
                    <p>B'(12,1)</p>
                    <p>C'(8,4)</p>
                 </div>
              </div>
           </div>
        </div>
      </Section>
    </div>
  );
};
