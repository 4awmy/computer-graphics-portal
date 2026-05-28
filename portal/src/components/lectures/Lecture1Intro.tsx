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
      <h4 className="font-bold text-aast-navy mb-4">Interactive Demo: Image as a Matrix</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">A digital image is represented as a matrix of intensity values. Hover or change values to see the effect.</p>
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
                className="w-full text-center text-xs p-1 border rounded font-mono"
              />
            )))}
          </div>
        </div>
        <div className="bg-slate-100 rounded-lg p-8 aspect-square flex items-center justify-center border-4 border-white shadow-inner">
           <div className="grid grid-cols-4 w-full h-full">
              {data.map((row, y) => row.map((val, x) => (
                <div 
                  key={`${x}-${y}`} 
                  style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }}
                  className="flex items-center justify-center text-[8px] font-bold group relative"
                >
                   <span className={val > 128 ? 'text-black opacity-0 group-hover:opacity-100' : 'text-white opacity-0 group-hover:opacity-100'}>
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
      <h4 className="font-bold text-aast-navy mb-4">Quantization & Bit Depth</h4>
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Input Intensity (0-255)</label>
          <input type="range" min="0" max="255" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full max-w-md" />
          <span className="font-mono text-xl font-black text-aast-navy">{val}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 text-center">
            <div className="h-24 rounded-lg border-2 border-white shadow-md mx-auto w-24" style={{ backgroundColor: `rgb(${bit1}, ${bit1}, ${bit1})` }} />
            <p className="text-xs font-bold text-aast-navy">1-Bit (Binary)</p>
            <p className="text-[10px] text-slate-500 font-mono">Value: {bit1 === 255 ? '1 (White)' : '0 (Black)'}</p>
          </div>
          <div className="space-y-2 text-center">
            <div className="h-24 rounded-lg border-2 border-white shadow-md mx-auto w-24" style={{ backgroundColor: `rgb(${val}, ${val}, ${val})` }} />
            <p className="text-xs font-bold text-aast-navy">8-Bit (Grayscale)</p>
            <p className="text-[10px] text-slate-500 font-mono">Value: {val}</p>
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
      <h4 className="font-bold text-aast-navy mb-4">Visualizing Spatial Aliasing (Jaggies)</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Aliasing occurs when we sample a continuous shape onto a discrete grid. As resolution (grid size) decreases, the "stair-step" effect becomes more apparent.</p>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Grid Resolution</label>
            <input type="range" min="4" max="40" value={gridSize} onChange={e => setGridSize(Number(e.target.value))} className="w-full" />
            <div className="text-center text-xs font-mono">{gridSize} x {gridSize}</div>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden">
          <svg viewBox={`0 0 ${gridSize} ${gridSize}`} className="w-full h-full">
            {/* Ideal Line */}
            <line x1="0" y1="0" x2={gridSize} y2={gridSize} stroke="#f87171" strokeWidth="0.1" strokeDasharray="0.2" opacity="0.5" />
            
            {/* Aliased Pixels */}
            {Array.from({ length: gridSize }).map((_, y) => 
              Array.from({ length: gridSize }).map((_, x) => {
                const isFilled = x >= y; // Approximate diagonal
                return isFilled ? (
                  <rect key={`${x}-${y}`} x={x} y={y} width="0.9" height="0.9" fill="#eab308" />
                ) : null;
              })
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};


export const Lecture1Intro: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4">
          Week 01
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Introduction to Computer Graphics
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Understanding the fundamentals of generating digital images, the comparison between graphics and vision, and the underlying mathematical representation of light.
        </p>
      </header>

      <Section title="1. Vision vs. Computer Graphics">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p><strong>Vision</strong> is the process of discovering what is present in the world and where it is by looking. <strong>Computer Vision</strong> is the study and analysis of pictures and videos to achieve results similar to human perception.</p>
            <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm border border-slate-200">
              Vision = Geometry + Measurement + Interpretation
            </div>
            <p className="text-sm text-slate-500 italic">
              [Scene] ---&gt; (Camera) ---&gt; [Image] ---&gt; (Computer) ---&gt; [Perception]
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-xs">
              <thead className="bg-aast-navy text-white">
                <tr><th className="p-2">Domain</th><th className="p-2">Input</th><th className="p-2">Output</th></tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-t">
                  <td className="p-2 font-bold bg-aast-gold/10">Computer Graphics</td>
                  <td className="p-2">Description</td>
                  <td className="p-2">Image</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2 font-bold">Pattern Recognition</td>
                  <td className="p-2">Image</td>
                  <td className="p-2">Description</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2 font-bold">Image Processing</td>
                  <td className="p-2">Image</td>
                  <td className="p-2">Image</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section title="2. The Three Main Pillars">
        <p>Computer Graphics is the process of generating 2D images of a 3D world represented inside a computer. This process relies on three core stages:</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <h4 className="font-black text-aast-navy mb-2">Modeling</h4>
            <p className="text-xs text-slate-600">Creating and representing the geometry (shape) of objects.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <h4 className="font-black text-aast-navy mb-2">Rendering</h4>
            <p className="text-xs text-slate-600">Computing light, shading, and projecting 3D to 2D pixels.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <h4 className="font-black text-aast-navy mb-2">Animation</h4>
            <p className="text-xs text-slate-600">Describing how objects and environments change over time.</p>
          </div>
        </div>
      </Section>

      <Section title="3. Digital Image Fundamentals">
        <p>An image can be formally defined as a 2D light intensity function <code>f(x,y)</code>, where x and y denote spatial coordinates. The value of <code>f</code> at any point is proportional to the brightness or gray level.</p>
        <p>A digital image is represented as a compact matrix of size <strong>M × N</strong>:</p>
        <Equation>
          f(x,y) = [ f(0,0) f(0,1) ... f(0,N-1) ]{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ f(1,0) f(1,1) ... f(1,N-1) ]{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[  ...    ...    ...      ...  ]{'\n'}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ f(M-1,0) ...      f(M-1,N-1) ]
        </Equation>
        <MatrixImageDemo />
      </Section>

      <Section title="4. Storage, Bit Depth, and Image Metrics">
        <p>Technical quality is bounded by spatial resolution (sampling rate) and quantization level (allowable gray levels).</p>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 my-6">
          <h4 className="font-bold text-blue-800 mb-4">Important Technical Formulas</h4>
          <ul className="space-y-4">
            <li>
              <span className="font-bold">Memory Storage Size:</span> The total bits <code>b</code> needed to store a digitized image:
              <Equation>b = M × N × k</Equation>
              <p className="text-xs italic">where L = 2ᵏ is the number of gray levels.</p>
            </li>
            <li>
              <span className="font-bold">Aspect Ratio (AR):</span> The ratio of screen width to height:
              <Equation>Aspect Ratio = Width / Height</Equation>
            </li>
          </ul>
        </div>
        <BitDepthDemo />
      </Section>

      <Section title="5. Aliasing and Artifacts">
        <p><strong>Aliasing</strong> is an artifact caused when continuous image data is sampled insufficiently below its structural frequency limit (Nyquist bound), resulting in a loss of high-frequency visual details.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li><strong>Jagged Profiles (Jaggies):</strong> Stair-step distortions along sharp boundaries.</li>
            <li><strong>Loss of Detail:</strong> Tiny features completely dropping out or doubling incorrectly.</li>
            <li><strong>Temporal Aliasing:</strong> Strobing or flickering in motion sequences.</li>
          </ul>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="font-bold text-xs uppercase text-slate-500 mb-2">Remedies</h4>
            <p className="text-xs leading-relaxed"><strong>Super-sampling:</strong> Increasing physical grid sampling frequencies.<br/><strong>Pre-filtering:</strong> Blurring high frequencies before sampling.</p>
          </div>
        </div>
        <AliasingDemo />
      </Section>

      <Section title="6. Sample Problems">
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            <p className="font-bold text-aast-navy">Problem 1: Storage Size</p>
            <p className="text-sm text-slate-600 mt-1">Find the number of bits to store a 128×128 image with 64 gray levels.</p>
            <div className="mt-2 text-xs font-mono text-emerald-600 bg-emerald-50 p-2 rounded">
              L = 64 → 2ᵏ = 64 → k = 6 bits{'\n'}
              b = 128 × 128 × 6 = 98,304 bits.
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            <p className="font-bold text-aast-navy">Problem 2: Color Depth</p>
            <p className="text-sm text-slate-600 mt-1">If direct RGB coding uses 5 bits for Red, 6 for Green, and 5 for Blue (16-bit total), how many simultaneous colors can be displayed?</p>
            <div className="mt-2 text-xs font-mono text-emerald-600 bg-emerald-50 p-2 rounded">
              Total bits = 16{'\n'}
              Simultaneous colors = 2¹⁶ = 65,536 colors.
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
