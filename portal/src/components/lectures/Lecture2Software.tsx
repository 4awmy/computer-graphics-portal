import React, { useState, useMemo, useEffect } from 'react';

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

const OpenGLPrimitivesDemo = () => {
  const [mode, setMode] = useState('GL_LINES');
  const [vertexCount, setVertexCount] = useState(6);
  
  const vertices = useMemo(() => {
    const centers = [
      [5, 5], [15, 5], [15, 15], [5, 15], [10, 10], [2, 10], [18, 10], [10, 2], [10, 18]
    ];
    return centers.slice(0, vertexCount);
  }, [vertexCount]);

  const renderPrimitive = () => {
    const pts = vertices.map(v => v.join(',')).join(' ');
    switch (mode) {
      case 'GL_LINES':
        return vertices.reduce((acc: any[], v, i) => {
          if (i % 2 === 1) {
            acc.push(<line key={i} x1={vertices[i-1][0]} y1={vertices[i-1][1]} x2={v[0]} y2={v[1]} stroke="#eab308" strokeWidth="0.5" />);
          }
          return acc;
        }, []);
      case 'GL_LINE_STRIP':
        return <polyline points={pts} fill="none" stroke="#eab308" strokeWidth="0.5" />;
      case 'GL_LINE_LOOP':
        return <polygon points={pts} fill="none" stroke="#eab308" strokeWidth="0.5" />;
      case 'GL_TRIANGLES':
        return vertices.reduce((acc: any[], v, i) => {
          if (i % 3 === 2) {
            const triPts = [vertices[i-2], vertices[i-1], v].map(p => p.join(',')).join(' ');
            acc.push(<polygon key={i} points={triPts} fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="0.3" />);
          }
          return acc;
        }, []);
      case 'GL_TRIANGLE_STRIP':
        return vertices.reduce((acc: any[], v, i) => {
          if (i >= 2) {
            const triPts = [vertices[i-2], vertices[i-1], v].map(p => p.join(',')).join(' ');
            acc.push(<polygon key={i} points={triPts} fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="0.3" />);
          }
          return acc;
        }, []);
      case 'GL_TRIANGLE_FAN':
        return vertices.reduce((acc: any[], v, i) => {
          if (i >= 2) {
            const triPts = [vertices[0], vertices[i-1], v].map(p => p.join(',')).join(' ');
            acc.push(<polygon key={i} points={triPts} fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="0.3" />);
          }
          return acc;
        }, []);
      case 'GL_QUADS':
        return vertices.reduce((acc: any[], v, i) => {
          if (i % 4 === 3) {
            const quadPts = [vertices[i-3], vertices[i-2], vertices[i-1], v].map(p => p.join(',')).join(' ');
            acc.push(<polygon key={i} points={quadPts} fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="0.3" />);
          }
          return acc;
        }, []);
      case 'GL_POLYGON':
        return <polygon points={pts} fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" strokeWidth="0.5" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <h4 className="font-bold text-aast-navy mb-4 uppercase text-xs tracking-widest">OpenGL Primitive Interpreter</h4>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Primitive Mode</label>
            <select value={mode} onChange={e => setMode(e.target.value)} className="w-full p-2 text-sm border rounded bg-slate-50 font-bold text-aast-navy">
              <option value="GL_LINES">GL_LINES</option>
              <option value="GL_LINE_STRIP">GL_LINE_STRIP</option>
              <option value="GL_LINE_LOOP">GL_LINE_LOOP</option>
              <option value="GL_TRIANGLES">GL_TRIANGLES</option>
              <option value="GL_TRIANGLE_STRIP">GL_TRIANGLE_STRIP</option>
              <option value="GL_TRIANGLE_FAN">GL_TRIANGLE_FAN</option>
              <option value="GL_QUADS">GL_QUADS</option>
              <option value="GL_POLYGON">GL_POLYGON</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase text-center block">Vertex Count: {vertexCount}</label>
            <input type="range" min="2" max="9" value={vertexCount} onChange={e => setVertexCount(Number(e.target.value))} className="w-full" />
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-800 italic">
            {mode === 'GL_LINES' && `Groups vertices in pairs. Renders ${Math.floor(vertexCount/2)} line(s). ${vertexCount % 2 ? 'Discarding 1 vertex.' : ''}`}
            {mode === 'GL_TRIANGLES' && `Groups in triplets. Renders ${Math.floor(vertexCount/3)} triangle(s). ${vertexCount % 3 ? `Discarding ${vertexCount % 3} vertex(es).` : ''}`}
            {mode === 'GL_POLYGON' && `Binds all ${vertexCount} vertices into one closed shape.`}
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 aspect-square flex items-center justify-center relative">
          <svg viewBox="0 0 20 20" className="w-full h-full transform scale-y-[-1]">
             {/* Grid */}
             {Array.from({length: 21}).map((_, i) => (
                <React.Fragment key={i}>
                  <line x1={i} y1={0} x2={i} y2={20} stroke="#1e293b" strokeWidth="0.05" />
                  <line x1={0} y1={i} x2={20} y2={i} stroke="#1e293b" strokeWidth="0.05" />
                </React.Fragment>
             ))}
             {renderPrimitive()}
             {vertices.map((v, i) => (
               <g key={i}>
                 <circle cx={v[0]} cy={v[1]} r="0.3" fill="#ffffff" />
                 <text x={v[0] + 0.5} y={-(v[1] + 0.5)} fill="#94a3b8" fontSize="0.8" transform="scale(1, -1)">v{i}</text>
               </g>
             ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

const FillingDemo = () => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [algo, setMode] = useState<'boundary' | 'flood'>('boundary');
  const [conn, setConn] = useState<4 | 8>(4);
  const size = 15;

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    const newGrid = Array.from({ length: size }, () => Array(size).fill(' '));
    // Create a boundary
    for (let i = 2; i < 13; i++) {
      newGrid[2][i] = 'B';
      newGrid[12][i] = 'B';
      newGrid[i][2] = 'B';
      newGrid[i][12] = 'B';
    }
    // Add a bottleneck
    newGrid[7][5] = 'B';
    newGrid[7][6] = 'B';
    newGrid[7][7] = 'B';
    newGrid[7][8] = 'B';
    newGrid[7][9] = 'B';
    setGrid(newGrid);
  };

  const fill = (startX: number, startY: number) => {
    const newGrid = grid.map(row => [...row]);
    const stack = [[startX, startY]];
    const fillColor = 'F';
    const boundaryColor = 'B';
    const oldColor = ' ';

    const process = () => {
      if (stack.length === 0) return;
      const [x, y] = stack.pop()!;
      
      if (algo === 'boundary') {
        if (newGrid[y][x] !== boundaryColor && newGrid[y][x] !== fillColor) {
          newGrid[y][x] = fillColor;
          const neighbors = conn === 4 
            ? [[x+1, y], [x-1, y], [x, y+1], [x, y-1]]
            : [[x+1, y], [x-1, y], [x, y+1], [x, y-1], [x+1, y+1], [x-1, y-1], [x+1, y-1], [x-1, y+1]];
          
          neighbors.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < size && ny >= 0 && ny < size) stack.push([nx, ny]);
          });
        }
      } else {
        if (newGrid[y][x] === oldColor) {
          newGrid[y][x] = fillColor;
          const neighbors = conn === 4 
            ? [[x+1, y], [x-1, y], [x, y+1], [x, y-1]]
            : [[x+1, y], [x-1, y], [x, y+1], [x, y-1], [x+1, y+1], [x-1, y-1], [x+1, y-1], [x-1, y+1]];
            
          neighbors.forEach(([nx, ny]) => {
            if (nx >= 0 && nx < size && ny >= 0 && ny < size) stack.push([nx, ny]);
          });
        }
      }
      setGrid([...newGrid]);
      setTimeout(process, 10);
    };
    process();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm my-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-aast-navy uppercase text-xs">Interactive Region Filling</h4>
        <button onClick={reset} className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold hover:bg-slate-200 transition">Reset Canvas</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setMode('boundary')} className={`p-2 rounded text-xs font-bold border transition ${algo === 'boundary' ? 'bg-aast-navy text-aast-gold border-aast-navy' : 'bg-white text-slate-500 border-slate-200'}`}>Boundary Fill</button>
            <button onClick={() => setMode('flood')} className={`p-2 rounded text-xs font-bold border transition ${algo === 'flood' ? 'bg-aast-navy text-aast-gold border-aast-navy' : 'bg-white text-slate-500 border-slate-200'}`}>Flood Fill</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setConn(4)} className={`p-2 rounded text-xs font-bold border transition ${conn === 4 ? 'bg-slate-700 text-white' : 'bg-white text-slate-500 border-slate-200'}`}>4-Connected</button>
            <button onClick={() => setConn(8)} className={`p-2 rounded text-xs font-bold border transition ${conn === 8 ? 'bg-slate-700 text-white' : 'bg-white text-slate-500 border-slate-200'}`}>8-Connected</button>
          </div>
          <p className="text-xs text-slate-500 italic">Click inside the boundary to start the fill. 8-connected can leak through diagonal corners!</p>
        </div>
        <div className="bg-slate-100 rounded-lg p-2 flex items-center justify-center">
          <div className="grid grid-cols-15 w-full aspect-square border border-slate-300 bg-white shadow-inner" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {grid.map((row, y) => row.map((cell, x) => (
              <div 
                key={`${x}-${y}`}
                onClick={() => cell === ' ' && fill(x, y)}
                className={`border-[0.5px] border-slate-200/50 flex items-center justify-center cursor-pointer transition-colors duration-200 ${cell === 'B' ? 'bg-slate-800' : cell === 'F' ? 'bg-aast-gold' : 'hover:bg-slate-50'}`}
              >
                {cell === 'B' && <div className="w-full h-full bg-slate-800" />}
              </div>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Lecture2Software: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in font-sans">
      <header className="mb-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-aast-navy/10 text-aast-navy mb-4">
          Week 02
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Graphics Software and Filling Algorithms
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
          Understanding the architecture of graphics packages, the evolution of APIs from OpenGL to WebGL, and the mechanics of area-filling algorithms.
        </p>
      </header>

      <Section title="1. Categories of Graphics Software">
        <p>Graphics software packages generally fall into two distinct functional categories:</p>
        <div className="grid sm:grid-cols-2 gap-6 my-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-black text-aast-navy mb-2">A. Special Purpose Packages</h4>
            <p className="text-sm text-slate-600">Designed for non-programmers or users focused on a specific application domain. Internal graphics are hidden behind a UI.</p>
            <p className="mt-2 text-xs font-bold text-slate-400 uppercase">Examples: CAD, Digital Painting, Architectural Tools.</p>
          </div>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-black text-aast-navy mb-2">B. General Programming Packages</h4>
            <p className="text-sm text-slate-600">Provides a comprehensive library of graphics functions accessible via standard programming languages (C++, Java, etc.).</p>
            <p className="mt-2 text-xs font-bold text-slate-400 uppercase">Examples: OpenGL, VRML, Java2D/3D, GKS.</p>
          </div>
        </div>
        
        <h4 className="font-bold text-lg mb-4 mt-8">Fundamental System Graphic Functions</h4>
        <p>To properly host graphics software, a system must support these baseline capabilities:</p>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 list-decimal pl-6 text-sm text-slate-700">
          <li>Establish a hardware graphic screen mode (EGA, VGA, SVGA).</li>
          <li>Clear the active screen canvas.</li>
          <li>Draw geometric graphic primitives (lines, circles, etc.).</li>
          <li>Fill defined vector/pixel regions with specified colors.</li>
          <li>Render alphanumeric text onto the active graphics screen.</li>
          <li>Safely reset and return to the operating system's default mode.</li>
        </ul>
      </Section>

      <Section title="2. Evolution: OpenGL vs. WebGL">
        <p>While OpenGL is targeted at desktop computer environments, web applications require different architectural traits:</p>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm my-6">
          <table className="w-full text-xs text-left">
            <thead className="bg-aast-navy text-white">
              <tr><th className="p-3">Feature</th><th className="p-3">OpenGL</th><th className="p-3">WebGL</th></tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">Primary Target</td>
                <td className="p-3">Desktop Computing Systems</td>
                <td className="p-3">Web Browsers & Online Contexts</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">Origin / Base</td>
                <td className="p-3">Desktop GPU Drivers</td>
                <td className="p-3">OpenGL ES 2.0 (Embedded)</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">Compilation</td>
                <td className="p-3">Required (Native Binaries)</td>
                <td className="p-3">No compilation (parsed on the fly)</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-bold bg-slate-50">UI Integration</td>
                <td className="p-3">Difficult with OS windows</td>
                <td className="p-3">Direct HTML/DOM/CSS integration</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
          <p className="text-xs text-emerald-800"><strong>Related Technologies:</strong> <code>OpenGL ES</code> for mobile/embedded, <code>JOGL</code> for Java bindings, and <code>GLSL</code> for writing custom programmable shaders.</p>
        </div>
      </Section>

      <Section title="3. Geometric Primitives in OpenGL">
        <p>All geometric shapes in modern graphics are built from an input stream of discrete coordinate <strong>vertices</strong>. OpenGL interprets these based on primitive drawing modes:</p>
        <div className="grid sm:grid-cols-2 gap-4 text-xs mt-4">
          <div className="space-y-2">
            <p><strong>GL_LINES:</strong> Groups vertices in pairs (renders n/2 segments).</p>
            <p><strong>GL_LINE_STRIP:</strong> Continuous line chain (renders n-1 segments).</p>
            <p><strong>GL_LINE_LOOP:</strong> Strip that connects the last vertex back to the first.</p>
          </div>
          <div className="space-y-2">
            <p><strong>GL_TRIANGLES:</strong> Groups vertices in sets of three.</p>
            <p><strong>GL_TRIANGLE_STRIP:</strong> Continuous chain sharing adjacent edges.</p>
            <p><strong>GL_TRIANGLE_FAN:</strong> Hub where all triangles share vertex v0.</p>
          </div>
        </div>
        <OpenGLPrimitivesDemo />
      </Section>

      <Section title="4. Region Filling Algorithms">
        <p><strong>Filling</strong> is the computational process of reassigning display colors to bounded pixel spaces.</p>
        
        <h4 className="font-bold text-lg mt-6 mb-2">A) Basic Rectangle Filling</h4>
        <p className="text-sm">Predictable hulls handled via simple coordinate loops:</p>
        <div className="bg-slate-800 text-slate-100 p-4 rounded-lg font-mono text-xs my-4">
          For (y = ymin to ymax)<br/>
          &nbsp;&nbsp;For (x = xmin to xmax)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;WritePixel(x, y, fillColor)
        </div>

        <h4 className="font-bold text-lg mt-8 mb-2">B) Recursive Seed-Driven Filling</h4>
        <p className="text-sm">For complex shapes, we start from an interior seed coordinate (x,y) and spread outward:</p>
        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <p className="font-black text-aast-navy text-xs mb-2">4-Connected Neighbors</p>
             <p className="text-[10px] text-slate-600">Orthogonal directions only: Above, Below, Left, Right.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
             <p className="font-black text-aast-navy text-xs mb-2">8-Connected Neighbors</p>
             <p className="text-[10px] text-slate-600">Orthogonal + Diagonal directions. More thorough but can leak through corners.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-l-4 border-aast-gold pl-4">
            <h5 className="font-bold text-aast-navy">Boundary-Fill Algorithm</h5>
            <p className="text-sm text-slate-600 mt-1">Used when the region is enclosed by a single, solid border color. Spreads until it hits the specific boundary color.</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h5 className="font-bold text-aast-navy">Flood-Fill Algorithm</h5>
            <p className="text-sm text-slate-600 mt-1">Used when the target area is bounded by multiple colors. Replaces a specific original color with a new fill color.</p>
          </div>
          <div className="border-l-4 border-emerald-500 pl-4">
            <h5 className="font-bold text-aast-navy">Span Flood-Fill (Optimization)</h5>
            <p className="text-sm text-slate-600 mt-1">Avoids high stack overhead by filling entire horizontal rows (spans) at once. It only pushes the leftmost start positions of unpainted spans onto the stack.</p>
          </div>
        </div>

        <FillingDemo />
      </Section>
    </div>
  );
};
