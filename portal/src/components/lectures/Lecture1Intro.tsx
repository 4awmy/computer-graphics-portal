import React, { useState } from 'react';

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

const MatrixImageDemo = () => {
  const [data, setData] = useState([
    [15, 92, 240, 0],
    [180, 45, 12, 105],
    [9, 255, 67, 88],
    [120, 3, 99, 144]
  ]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Interactive: Image as a Matrix</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">Digital images are represented as a matrix of intensity values. Try changing the numbers below!</p>
          <div className="grid grid-cols-4 gap-2">
            {data.map((row, y) => row.map((val, x) => (
              <input 
                key={`${x}-${y}`}
                type="number"
                min="0"
                max="255"
                value={val}
                onChange={e => {
                  const newData = [...data];
                  newData[y][x] = Math.min(255, Math.max(0, Number(e.target.value)));
                  setData(newData);
                }}
                className="w-full text-center text-xs p-1 border rounded font-mono bg-slate-50 text-aast-navy focus:ring-1 focus:ring-aast-gold focus:outline-none"
              />
            )))}
          </div>
        </div>
        <div className="bg-slate-100 rounded-lg p-8 aspect-square flex items-center justify-center border-4 border-white shadow-inner relative overflow-hidden">
           <div className="grid grid-cols-4 w-full h-full">
              {data.map((row, y) => row.map((val, x) => (
                <div 
                  key={`${x}-${y}`} 
                  style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }}
                  className="flex items-center justify-center text-[10px] font-bold group"
                >
                   <span className={`transition-opacity duration-300 ${val > 128 ? 'text-black' : 'text-white'} opacity-0 group-hover:opacity-100 bg-black/20 px-1 rounded`}>
                     {val}
                   </span>
                </div>
              )))}
           </div>
        </div>
      </div>
    </div>
  );
};

const BitDepthDemo = () => {
  const [val, setVal] = useState(178);
  const bit1 = val > 127 ? 255 : 0;
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Quantization & Bit Depth Simulator</h4>
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Source Intensity (0-255)</label>
          <input type="range" min="0" max="255" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full max-w-md accent-aast-gold" />
          <span className="font-mono text-2xl font-black text-aast-navy">{val}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3 text-center">
            <div className="h-24 rounded-2xl border-4 border-white shadow-lg mx-auto w-24 transition-colors duration-200" style={{ backgroundColor: `rgb(${bit1}, ${bit1}, ${bit1})` }} />
            <p className="text-xs font-black text-aast-navy uppercase">1-Bit (Binary)</p>
            <p className="text-[10px] text-slate-500 font-medium italic">Memory: 1 bit per pixel</p>
          </div>
          <div className="space-y-3 text-center">
            <div className="h-24 rounded-2xl border-4 border-white shadow-lg mx-auto w-24 transition-colors duration-200" style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }} />
            <p className="text-xs font-black text-aast-navy uppercase">8-Bit (Grayscale)</p>
            <p className="text-[10px] text-slate-500 font-medium italic">Memory: 8 bits per pixel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AliasingDemo = () => {
  const [gridSize, setGridSize] = useState(10);
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-[10px] tracking-widest">Spatial Aliasing: The "Jaggies" Effect</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Aliasing occurs when continuous image data is sampled insufficiently below its frequency limit. Slide to see how resolution affects shape quality!</p>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Sampling Frequency (Resolution)</label>
            <input type="range" min="4" max="40" value={gridSize} onChange={e => setGridSize(Number(e.target.value))} className="w-full accent-aast-navy" />
            <div className="text-center text-xs font-mono mt-2 bg-slate-100 py-1 rounded">{gridSize} x {gridSize} grid</div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden border-8 border-slate-800">
          <svg viewBox={`0 0 ${gridSize} ${gridSize}`} className="w-full h-full">
            {/* Ideal Line */}
            <line x1="0" y1="0" x2={gridSize} y2={gridSize} stroke="#ef4444" strokeWidth="0.1" strokeDasharray="0.2" opacity="0.4" />
            
            {/* Aliased Pixels */}
            {Array.from({ length: gridSize }).map((_, y) => 
              Array.from({ length: gridSize }).map((_, x) => {
                const isFilled = x >= y; 
                return isFilled ? (
                  <rect key={`${x}-${y}`} x={x} y={y} width="0.9" height="0.9" fill="#eab308" className="transition-all duration-300" />
                ) : null;
              })
            )}
          </svg>
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-[8px] font-bold uppercase rounded border border-red-500/30">Rasterized</div>
        </div>
      </div>
    </div>
  );
};


export const Lecture1Intro: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans text-slate-800">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4">
          CS352 — Week 01
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Introduction to Computer Graphics
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl border-l-4 border-aast-gold pl-4">
          Understanding the fundamentals of generating digital images, the comparison between graphics and vision, and the underlying mathematical representation of light.
        </p>
      </header>

      <Section title="1. Vision vs. Computer Graphics">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <p><strong>Vision</strong> is the process of discovering what is present in the world and where it is by looking. <strong>Computer Vision</strong> Study and analysis of pictures/videos to achieve results similar to human perception.</p>
            <div className="bg-aast-navy p-5 rounded-2xl text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-aast-gold/10 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
               <p className="text-sm font-black text-aast-gold uppercase tracking-widest mb-2">The Formula</p>
               <p className="text-lg font-mono tracking-tight leading-tight">Vision = Geometry + Measurement + Interpretation</p>
            </div>
            <p className="text-xs text-slate-400 italic font-medium flex items-center gap-2">
              <span className="w-4 h-[1px] bg-slate-300" />
              [Scene] → (Camera) → [Image] → (Computer) → [Perception]
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest">
                <tr><th className="p-3 text-left">Domain</th><th className="p-3 text-left">Input</th><th className="p-3 text-left">Output</th></tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-t">
                  <td className="p-3 font-black text-aast-navy">Computer Graphics</td>
                  <td className="p-3 text-slate-500 italic">Description</td>
                  <td className="p-3 font-bold text-emerald-600">Image</td>
                </tr>
                <tr className="border-t bg-slate-50/50">
                  <td className="p-3 font-black text-aast-navy">Pattern Recognition</td>
                  <td className="p-3 text-slate-500 italic">Image</td>
                  <td className="p-3 font-bold text-blue-600">Description</td>
                </tr>
                <tr className="border-t">
                  <td className="p-3 font-black text-aast-navy">Image Processing</td>
                  <td className="p-3 text-slate-500 italic">Image</td>
                  <td className="p-3 font-bold text-purple-600">Image</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="2. The Three Main Pillars">
        <p>Computer Graphics is the process of generating 2D images of a 3D world represented inside a computer. This process relies on three core stages:</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          {[
            { title: 'Modeling', color: 'bg-blue-50 text-blue-700', desc: 'Creating and representing the geometry (shape) of objects.' },
            { title: 'Rendering', color: 'bg-emerald-50 text-emerald-700', desc: 'Computing light, shading, and projecting 3D to 2D pixels.' },
            { title: 'Animation', color: 'bg-purple-50 text-purple-700', desc: 'Describing how objects and environments change over time.' }
          ].map(p => (
            <div key={p.title} className={`${p.color} p-5 rounded-2xl border-2 border-white shadow-sm hover:shadow-md transition-shadow`}>
              <h4 className="font-black uppercase text-xs tracking-widest mb-2">{p.title}</h4>
              <p className="text-xs leading-relaxed opacity-80">{p.desc}</p>
            </div>
          ))}
        </div>
        
        <h4 className="font-bold text-lg mb-4 mt-8">Operation Modes</h4>
        <div className="grid grid-cols-2 gap-4 mt-2">
           <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-lg">
             <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mode 1</h5>
             <p className="font-black text-lg">Passive Graphics</p>
             <p className="text-[10px] text-slate-400 mt-2">Application data is directly mapped to a display surface with zero user intervention.</p>
           </div>
           <div className="bg-aast-navy text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-1 bg-aast-gold text-aast-navy text-[8px] font-black uppercase tracking-tighter rounded-bl-lg">Most Common</div>
             <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mode 2</h5>
             <p className="font-black text-lg text-aast-gold">Interactive Graphics</p>
             <p className="text-[10px] text-slate-300 mt-2">The system allows users to dynamically modify visual components via input devices (mice, styluses).</p>
           </div>
        </div>
      </Section>


      <Section title="3. Digital Image Fundamentals">
        <p>An image is formally defined as a 2D light intensity function <code>f(x,y)</code>, where x and y denote spatial coordinates. The value of <code>f</code> at any point is proportional to the brightness or gray level.</p>
        <p>A digital image is represented as a compact matrix of size <strong>M × N</strong>:</p>
        <Equation>
          f(x,y) = [ f(0,0)  f(0,1)  ...  f(0,N-1) ]{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ f(1,0)  f(1,1)  ...  f(1,N-1) ]{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[  ...     ...     ...     ...   ]{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ f(M-1,0) ...      f(M-1,N-1) ]
        </Equation>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
           <div className="bg-white border border-slate-200 p-4 rounded-xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Binary</p>
              <p className="text-xs font-bold">1-bit depth</p>
              <p className="text-[10px] text-slate-500 mt-1">g(x,y) ∈ {'{0,1}'}</p>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded-xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Grayscale</p>
              <p className="text-xs font-bold">8-bit depth</p>
              <p className="text-[10px] text-slate-500 mt-1">g(x,y) ∈ {'{0...255}'}</p>
           </div>
           <div className="bg-white border border-slate-200 p-4 rounded-xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Color (RGB)</p>
              <p className="text-xs font-bold">24-bit depth</p>
              <p className="text-[10px] text-slate-500 mt-1">Three independent channels</p>
           </div>
        </div>
        <MatrixImageDemo />
      </Section>

      <Section title="4. Technical Metrics & Formulas">
        <p>Technical quality is bounded by spatial resolution (sampling rate) and quantization level (allowable gray levels).</p>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 my-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <h4 className="font-black text-blue-900 mb-4 uppercase text-xs tracking-widest">Mathematical Reference</h4>
          <ul className="space-y-6">
            <li>
              <span className="font-bold text-sm block mb-1">Memory Storage Size (b):</span> 
              <p className="text-xs text-slate-600 mb-2">Total bits needed to store a digitized image.</p>
              <Equation>b = M × N × k</Equation>
              <p className="text-[10px] italic text-slate-500">Note: L = 2ᵏ where L is the number of gray levels.</p>
            </li>
            <div className="grid grid-cols-2 gap-4">
              <li>
                <span className="font-bold text-sm block mb-1">Aspect Ratio (AR):</span> 
                <Equation>Width / Height</Equation>
              </li>
              <li>
                <span className="font-bold text-sm block mb-1">Pixel Aspect Ratio (PAR):</span> 
                <Equation>x_width / y_height</Equation>
              </li>
            </div>
          </ul>
        </div>
        <BitDepthDemo />
      </Section>

      <Section title="5. Image Formats & Formats Comparison">
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-800 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">Raster Formats (Pixel Based)</div>
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {[
                 { name: 'GIF', desc: '256 colors max, LZW lossless compression. Best for logos/simple anims.' },
                 { name: 'JPEG', desc: 'Continuous color. Lossy compression. Poor for sharp text.' },
                 { name: 'PNG', desc: 'True color + Alpha transparency. Best for crisp web UI elements.' },
                 { name: 'BMP', desc: 'Standard uncompressed RGB model. Device independent but huge files.' },
                 { name: 'TIFF', desc: 'Extensible tagging. Supports many color levels. Used in printing/archival.' }
               ].map(f => (
                 <div key={f.name} className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <p className="font-black text-aast-navy text-xs">{f.name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-1">{f.desc}</p>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 text-sm font-medium">
             <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
               <h5 className="font-black text-emerald-800 uppercase text-[10px] tracking-widest mb-2">Vector Formats</h5>
               <p className="text-emerald-900/70 text-xs">.AI, .SVG, .DXF. Scales infinitely using math primitives instead of pixels.</p>
             </div>
             <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl">
               <h5 className="font-black text-blue-800 uppercase text-[10px] tracking-widest mb-2">Compound Formats</h5>
               <p className="text-blue-900/70 text-xs">.PDF, .EPS, .PS. Encapsulates both raster and vector properties.</p>
             </div>
          </div>
        </div>
      </Section>

      <Section title="6. Aliasing and Remedies">
        <p><strong>Aliasing</strong> is an artifact caused when continuous image data is sampled insufficiently below its structural frequency limit (Nyquist bound).</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <ul className="space-y-3">
             {[
               { title: 'Jagged Profiles', sub: 'Visible "stair-steps" along contrast boundaries.' },
               { title: 'Loss of Detail', sub: 'Tiny features dropping out or doubling incorrectly.' },
               { title: 'Temporal Aliasing', sub: 'Strobing or flickering in motion sequences.' }
             ].map(a => (
               <li key={a.title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                  <div>
                    <p className="font-black text-xs text-slate-800">{a.title}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{a.sub}</p>
                  </div>
               </li>
             ))}
          </ul>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h4 className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Engineering Remedies</h4>
            <div className="space-y-3">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-aast-navy shadow-sm">1</div>
                 <p className="text-[10px] font-bold text-slate-700 leading-tight">Super-sampling: Increase grid sampling frequency.</p>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-aast-navy shadow-sm">2</div>
                 <p className="text-[10px] font-bold text-slate-700 leading-tight">Pre-filtering: Blur high frequencies before sampling.</p>
               </div>
            </div>
          </div>
        </div>
        <AliasingDemo />
      </Section>

      <Section title="7. Sample Problems">
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-aast-navy text-sm uppercase tracking-wider">Example 1: Storage Size</p>
              <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Solved</div>
            </div>
            <p className="text-sm text-slate-600 mb-4">Find the number of bits to store a <strong>128×128</strong> image with <strong>64 gray levels</strong>.</p>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 space-y-1">
              <p>M = 128, N = 128</p>
              <p>L = 64 ⇒ 2ᵏ = 64 ⇒ k = 6 bits</p>
              <p className="text-sm font-black mt-2">b = 128 × 128 × 6 = 98,304 bits.</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-aast-navy text-sm uppercase tracking-wider">Example 2: RGB Coding</p>
              <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Solved</div>
            </div>
            <p className="text-sm text-slate-600 mb-4">If direct RGB coding uses <strong>5 bits for Red</strong>, <strong>6 bits for Green</strong>, and <strong>5 bits for Blue</strong> (16-bit total), how many simultaneous colors can be displayed?</p>
            <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
              <p>Total bits = 5 + 6 + 5 = 16</p>
              <p className="text-sm font-black mt-2">Simultaneous colors = 2¹⁶ = 65,536 colors.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="8. Primary Applications">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
           {[
             'Building Design', 'Electronics', 'Mechanical', 'Entertainment',
             'Aerospace', 'Medical Tech', 'Cartography', 'UI Design'
           ].map(app => (
             <div key={app} className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center shadow-sm hover:bg-aast-navy hover:text-aast-gold transition-colors cursor-default">
               <p className="font-bold text-[10px] uppercase tracking-tighter">{app}</p>
             </div>
           ))}
        </div>
      </Section>
    </div>
  );
};
