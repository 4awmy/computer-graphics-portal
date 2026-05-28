import React, { useState, useEffect } from 'react';

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

const RasterVsRandomDemo = () => {
  const [type, setType] = useState<'raster' | 'random'>('raster');
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % 60);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-aast-navy uppercase text-xs tracking-wider">Display Technology Comparison</h4>
        <div className="flex gap-2">
          <button onClick={() => setType('raster')} className={`px-3 py-1 rounded text-xs font-bold transition ${type === 'raster' ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-500'}`}>Raster Scan</button>
          <button onClick={() => setType('random')} className={`px-3 py-1 rounded text-xs font-bold transition ${type === 'random' ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-500'}`}>Random Scan</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {type === 'raster' 
              ? 'The electron beam sweeps the entire screen row-by-row (scan lines). Even empty areas are visited.' 
              : 'The electron beam is directed only to parts of the screen where a picture is being drawn (vector lines).'}
          </p>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono">
            {type === 'raster' ? (
              <ul className="space-y-1">
                <li className="flex justify-between"><span>Horizontal Retrace:</span> <span className="text-red-500 font-bold">ACTIVE</span></li>
                <li className="flex justify-between"><span>Vertical Retrace:</span> <span className="text-blue-500">Wait...</span></li>
              </ul>
            ) : (
              <ul className="space-y-1">
                <li className="flex justify-between"><span>Display List:</span> <span className="text-emerald-500 font-bold">PROCESSING</span></li>
                <li className="flex justify-between"><span>Vector Count:</span> <span>3 lines</span></li>
              </ul>
            )}
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-video flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 100 60" className="w-full h-full">
            {/* Raster Background Grid */}
            {type === 'raster' && (
              <g opacity="0.3">
                {Array.from({length: 12}).map((_, i) => (
                  <line key={i} x1="0" y1={i*5} x2="100" y2={i*5} stroke="#334155" strokeWidth="0.5" />
                ))}
              </g>
            )}
            
            {/* Ideal Image (Triangle) */}
            <polygon points="50,10 20,50 80,50" fill="none" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" />

            {type === 'raster' ? (
              <g>
                <line x1="0" y1={(frame % 12) * 5} x2="100" y2={(frame % 12) * 5} stroke="#eab308" strokeWidth="1" className="animate-pulse" />
                <circle cx={(frame % 20) * 5} cy={(frame % 12) * 5} r="1.5" fill="#fef08a" />
              </g>
            ) : (
              <g>
                <line x1="50" y1="10" x2="20" y2="50" stroke="#eab308" strokeWidth="1" strokeDasharray="1 1" />
                <line x1="20" y1="50" x2="80" y2="50" stroke="#eab308" strokeWidth="1" strokeDasharray="1 1" />
                <line x1="80" y1="50" x2="50" y2="10" stroke="#eab308" strokeWidth="1" strokeDasharray="1 1" />
                <circle cx={50} cy={10} r="1" fill="white" className="animate-ping" />
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export const Lecture3Hardware: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans text-slate-700">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4">
          Week 03
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Overview of Graphics Hardware
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Exploring the physical components of a graphics system, from input devices and frame buffers to the engineering of CRT and flat-panel displays.
        </p>
      </header>

      <Section title="1. Architectural Overview">
        <p>A complete graphics hardware system acts as an interconnected data pipeline running from physical input devices to a final display unit.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-8">
           {[
             { name: 'Input', desc: 'Mouse, Keyboard, Haptic' },
             { name: 'CPU', desc: 'Model Dynamics' },
             { name: 'GPU Pipeline', desc: 'Rendering Math' },
             { name: 'Frame Buffer', desc: 'Digital Matrix' },
             { name: 'Display', desc: 'CRT, LED, LCD' }
           ].map((step, i) => (
             <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-aast-navy text-aast-gold flex items-center justify-center font-black mb-2 shadow-sm">{i+1}</div>
                <p className="font-bold text-xs text-aast-navy leading-tight">{step.name}</p>
                <p className="text-[10px] text-slate-400 mt-1">{step.desc}</p>
             </div>
           ))}
        </div>
      </Section>

      <Section title="2. Core Frame Buffer Mechanics">
        <p>The <strong>Frame Buffer</strong> holds the digital definition of the image canvas currently being processed by the system.</p>
        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-aast-navy text-sm mb-2">Storage Concept</h5>
            <ul className="text-xs space-y-2 list-disc pl-4">
              <li><strong>Resolution:</strong> Total separate pixels available.</li>
              <li><strong>Bit Depth:</strong> Bits allocated per individual pixel.</li>
              <li><strong>VRAM:</strong> Dedicated high-speed memory for real-time graphics.</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-aast-navy text-sm mb-2">Scan Lines</h5>
            <p className="text-xs leading-relaxed">The video controller sequentially reads intensity values and paints them row-by-row. Each row is called a <strong>scan line</strong>.</p>
          </div>
        </div>
      </Section>

      <Section title="3. CRT Display Engineering">
        <p>Cathode-Ray Tube (CRT) monitors function by firing a focused stream of electrons to strike a phosphor-coated screen, causing it to glow.</p>
        <RasterVsRandomDemo />
        
        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div className="border-l-4 border-aast-gold pl-4">
            <h5 className="font-bold text-aast-navy mb-1">Raster-Scan Displays</h5>
            <p className="text-xs">Sweeps across the screen in a fixed repeating path. Includes <strong>Horizontal Retrace</strong> (moving to the next row) and <strong>Vertical Retrace</strong> (returning to the top left).</p>
          </div>
          <div className="border-l-4 border-aast-navy pl-4">
            <h5 className="font-bold text-aast-navy mb-1">Random-Scan Displays</h5>
            <p className="text-xs">Directs the beam only where lines are drawn. Uses a <strong>Display List</strong> of coordinate commands to refresh vectors fast enough to avoid flickering.</p>
          </div>
        </div>
      </Section>

      <Section title="4. Modern Flat-Panel Comparison">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm my-6">
          <table className="w-full text-[10px] sm:text-xs text-left">
            <thead className="bg-aast-navy text-white">
              <tr><th className="p-3">Parameter</th><th className="p-3">LCD Technology</th><th className="p-3">LED Technology</th></tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">Backlight</td>
                <td className="p-3">Cold-Cathode (CCFL)</td>
                <td className="p-3">Arrays of LED Diodes</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">Power</td>
                <td className="p-3">Higher Draw</td>
                <td className="p-3">Highly Efficient</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">Picture Quality</td>
                <td className="p-3">Good Baseline</td>
                <td className="p-3">Better Contrast / Blacks</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">Response Time</td>
                <td className="p-3">Slower</td>
                <td className="p-3">Fast (Low Blur)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="5. Touch Panel Sensing Technologies">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-aast-navy text-sm mb-1">1. Resistive Touchscreens</h5>
            <p className="text-xs">Flexible plastic/glass layers with conductive coating. Pressure forces contact, creating a voltage change. Mechanical, like a keyboard.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-aast-navy text-sm mb-1">2. Capacitive Touchscreens</h5>
            <p className="text-xs">Insulated glass with conductive layer. Finger interaction creates a capacitor, drawing a small charge to pinpoint coordinates.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h5 className="font-bold text-aast-navy text-sm mb-1">3. Infrared Touchscreens</h5>
            <p className="text-xs">Border frame with LEDs and detectors. Projects an invisible grid of beams. Touch breaks the light path to identify coordinates.</p>
          </div>
        </div>
      </Section>
    </div>
  );
};
