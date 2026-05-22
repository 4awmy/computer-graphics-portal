import React, { useState, useRef, useMemo } from 'react';
import { Play, RotateCcw, AlertCircle, Compass } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface LineStep {
  k: number;
  pk: string | number;
  x: number;
  y: number;
  plotX?: number;
  plotY?: number;
}

interface CircleStep {
  k: number;
  pk: number;
  x: number;
  y: number;
  points: Point[];
}

interface EllipseStep {
  k: number;
  region: number;
  pk: number;
  x: number;
  y: number;
  points: Point[];
}

export const Demos: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'line' | 'circle' | 'ellipse' | 'fill'>('line');

  // --- Line Drawing Visualizer State ---
  const [lineParams, setLineParams] = useState({ x1: 2, y1: 3, x2: 12, y2: 9 });
  const [lineAlg, setLineAlg] = useState<'dda' | 'bresenham'>('bresenham');

  // --- Circle Drawing State ---
  const [circleParams, setCircleParams] = useState({ xc: 0, yc: 0, r: 8 });

  // --- Ellipse Drawing State ---
  const [ellipseParams, setEllipseParams] = useState({ xc: 0, yc: 0, rx: 8, ry: 5 });

  // --- Region Filling State ---
  const GRID_SIZE = 16;
  const [fillGrid, setFillGrid] = useState<string[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'))
  );
  const [fillType, setFillType] = useState<'boundary' | 'flood'>('boundary');
  const [connectivity, setConnectivity] = useState<4 | 8>(4);
  const [fillSpeed, setFillSpeed] = useState<number>(300); // ms
  const [isFilling, setIsFilling] = useState<boolean>(false);
  const [fillMode, setFillMode] = useState<'draw-wall' | 'set-seed'>('draw-wall');
  const [seedPoint, setSeedPoint] = useState<Point | null>(null);
  const [fillStack, setFillStack] = useState<Point[]>([]);

  const fillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Line Drawing Visualizer Calculations ---
  const lineSteps = useMemo<LineStep[]>(() => {
    const { x1, y1, x2, y2 } = lineParams;
    const steps: LineStep[] = [];
    if (lineAlg === 'dda') {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const stepsCount = Math.max(Math.abs(dx), Math.abs(dy));
      const xInc = stepsCount === 0 ? 0 : dx / stepsCount;
      const yInc = stepsCount === 0 ? 0 : dy / stepsCount;
      let x = x1;
      let y = y1;
      for (let k = 0; k <= stepsCount; k++) {
        steps.push({
          k,
          pk: 'N/A',
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          plotX: Math.round(x),
          plotY: Math.round(y),
        });
        x += xInc;
        y += yInc;
      }
    } else {
      // Bresenham's (Standard 0 <= m <= 1)
      const dx = x2 - x1;
      const dy = y2 - y1;
      
      // Check slope condition for standard display
      const isStandard = dx > 0 && dy >= 0 && dy <= dx;
      
      if (!isStandard) {
        // Fallback robust standard bresenham algorithm
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        const sx = x1 < x2 ? 1 : -1;
        const sy = y1 < y2 ? 1 : -1;
        let err = adx - ady;
        let x = x1;
        let y = y1;
        let k = 0;
        steps.push({ k, pk: 'N/A', x, y });
        while (x !== x2 || y !== y2) {
          k++;
          const e2 = 2 * err;
          if (e2 > -ady) {
            err -= ady;
            x += sx;
          }
          if (e2 < adx) {
            err += adx;
            y += sy;
          }
          steps.push({ k, pk: err, x, y });
          if (k > 50) break;
        }
      } else {
        let x = x1;
        let y = y1;
        let p = 2 * dy - dx;
        let k = 0;
        
        steps.push({
          k,
          pk: p,
          x,
          y
        });

        while (x < x2) {
          k++;
          const pOld = p;
          x++;
          if (p < 0) {
            p = p + 2 * dy;
          } else {
            y++;
            p = p + 2 * dy - 2 * dx;
          }
          steps.push({
            k,
            pk: pOld,
            x,
            y
          });
        }
      }
    }
    return steps;
  }, [lineParams, lineAlg]);

  // --- Circle Drawing Calculations ---
  const circleSteps = useMemo<CircleStep[]>(() => {
    const { r } = circleParams;
    const steps: CircleStep[] = [];
    let x = 0;
    let y = r;
    let p = 1 - r;
    let k = 0;

    const getSymmetricPoints = (cx: number, cy: number): Point[] => [
      { x: cx, y: cy },
      { x: cy, y: cx },
      { x: -cy, y: cx },
      { x: -cx, y: cy },
      { x: -cx, y: -cy },
      { x: -cy, y: -cx },
      { x: cy, y: -cx },
      { x: cx, y: -cy },
    ];

    steps.push({
      k,
      pk: p,
      x,
      y,
      points: getSymmetricPoints(x, y),
    });

    while (x < y) {
      k++;
      const pOld = p;
      x++;
      if (p < 0) {
        p = p + 2 * x + 3;
      } else {
        y--;
        p = p + 2 * x - 2 * y + 5;
      }
      steps.push({
        k,
        pk: pOld,
        x,
        y,
        points: getSymmetricPoints(x, y),
      });
      if (k > 50) break;
    }
    return steps;
  }, [circleParams]);

  // --- Ellipse Drawing Calculations ---
  const ellipseSteps = useMemo<EllipseStep[]>(() => {
    const { rx, ry } = ellipseParams;
    const steps: EllipseStep[] = [];
    let k = 0;
    
    // Region 1
    let x = 0;
    let y = ry;
    let p1 = ry * ry - rx * rx * ry + 0.25 * rx * rx;
    let dx = 2 * ry * ry * x;
    let dy = 2 * rx * rx * y;

    const getSymmetricPoints = (cx: number, cy: number): Point[] => [
      { x: cx, y: cy },
      { x: -cx, y: cy },
      { x: cx, y: -cy },
      { x: -cx, y: -cy }
    ];

    steps.push({
      k,
      region: 1,
      pk: p1,
      x,
      y,
      points: getSymmetricPoints(x, y)
    });

    while (dx < dy) {
      k++;
      const pOld = p1;
      x++;
      dx = dx + 2 * ry * ry;
      if (p1 < 0) {
        p1 = p1 + ry * ry + dx;
      } else {
        y--;
        dy = dy - 2 * rx * rx;
        p1 = p1 + ry * ry + dx - dy;
      }
      steps.push({
        k,
        region: 1,
        pk: pOld,
        x,
        y,
        points: getSymmetricPoints(x, y)
      });
      if (k > 50) break;
    }

    // Region 2
    let p2 = ry * ry * (x + 0.5) * (x + 0.5) + rx * rx * (y - 1) * (y - 1) - rx * rx * ry * ry;
    
    while (y > 0) {
      k++;
      const pOld = p2;
      y--;
      dy = dy - 2 * rx * rx;
      if (p2 > 0) {
        p2 = p2 + rx * rx - dy;
      } else {
        x++;
        dx = dx + 2 * ry * ry;
        p2 = p2 + rx * rx - dy + dx;
      }
      steps.push({
        k,
        region: 2,
        pk: pOld,
        x,
        y,
        points: getSymmetricPoints(x, y)
      });
      if (k > 50) break;
    }
    return steps;
  }, [ellipseParams]);

  // --- Region Filling Functions ---

  const handleGridClick = (x: number, y: number) => {
    if (isFilling) return;
    
    if (fillMode === 'draw-wall') {
      const newGrid = fillGrid.map((row, rIdx) => 
        row.map((val, cIdx) => {
          if (rIdx === y && cIdx === x) {
            return val === 'wall' ? 'empty' : 'wall';
          }
          return val;
        })
      );
      setFillGrid(newGrid);
    } else {
      if (fillGrid[y][x] === 'wall') return;
      setSeedPoint({ x, y });
    }
  };

  const clearFillGrid = () => {
    if (isFilling) {
      setIsFilling(false);
      if (fillTimeoutRef.current) clearTimeout(fillTimeoutRef.current);
    }
    setFillGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty')));
    setSeedPoint(null);
    setFillStack([]);
  };

  const triggerFilling = () => {
    if (!seedPoint) {
      alert("Please select a seed point first!");
      return;
    }
    if (isFilling) return;
    
    setIsFilling(true);
    const gridCopy = fillGrid.map(row => [...row]);
    
    // Boundary vs Flood parameters
    const localStack: Point[] = [{ ...seedPoint }];
    setFillStack([...localStack]);

    const stepFill = () => {
      if (localStack.length === 0) {
        setIsFilling(false);
        return;
      }

      const curr = localStack.pop()!;
      const { x, y } = curr;

      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
        fillTimeoutRef.current = setTimeout(stepFill, fillSpeed);
        return;
      }

      const currentCell = gridCopy[y][x];

      if (fillType === 'boundary') {
        // Fill until hitting boundary (wall) or already filled
        if (currentCell !== 'wall' && currentCell !== 'filled') {
          gridCopy[y][x] = 'filled';
          setFillGrid([...gridCopy]);

          // Get neighbors
          const neighbors = getNeighbors(x, y);
          neighbors.forEach(n => localStack.push(n));
        }
      } else {
        // Flood fill: fill if it matches starting color (empty)
        if (currentCell === 'empty') {
          gridCopy[y][x] = 'filled';
          setFillGrid([...gridCopy]);

          const neighbors = getNeighbors(x, y);
          neighbors.forEach(n => localStack.push(n));
        }
      }

      setFillStack([...localStack]);
      fillTimeoutRef.current = setTimeout(stepFill, fillSpeed);
    };

    fillTimeoutRef.current = setTimeout(stepFill, fillSpeed);
  };

  const getNeighbors = (x: number, y: number) => {
    const list = [];
    // 4 connected
    list.push({ x: x + 1, y });
    list.push({ x: x - 1, y });
    list.push({ x, y: y + 1 });
    list.push({ x, y: y - 1 });

    if (connectivity === 8) {
      list.push({ x: x + 1, y: y + 1 });
      list.push({ x: x - 1, y: y - 1 });
      list.push({ x: x + 1, y: y - 1 });
      list.push({ x: x - 1, y: y + 1 });
    }
    return list;
  };

  // Helper to generate a preconfigured boundary shape in the grid
  const applyPresetShape = () => {
    clearFillGrid();
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('empty'));
    
    // Draw a box inside
    const bounds = { minX: 4, maxX: 11, minY: 4, maxY: 11 };
    
    // Draw horizontal boundaries
    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      newGrid[bounds.minY][x] = 'wall';
      newGrid[bounds.maxY][x] = 'wall';
    }
    // Draw vertical boundaries
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      newGrid[y][bounds.minX] = 'wall';
      newGrid[y][bounds.maxX] = 'wall';
    }

    // Add a diagonal gap if testing 8-connected leakage
    // Let's create an opening on the corner
    newGrid[bounds.minY][bounds.minX] = 'empty';

    setFillGrid(newGrid);
    setSeedPoint({ x: 7, y: 7 }); // Seed in the middle
  };

  // Grid coordinates maps for renderer
  const getLineGridPixels = () => {
    const pixels = Array(20).fill(null).map(() => Array(20).fill(false));
    lineSteps.forEach(s => {
      const px = s.plotX !== undefined ? s.plotX : s.x;
      const py = s.plotY !== undefined ? s.plotY : s.y;
      // Map center-offset of 20x20 grid
      if (px >= 0 && px < 20 && py >= 0 && py < 20) {
        pixels[py][px] = true;
      }
    });
    return pixels;
  };

  const getCircleGridPixels = () => {
    const pixels = Array(25).fill(null).map(() => Array(25).fill(false));
    const cx = 12; // visual center
    const cy = 12;
    circleSteps.forEach(s => {
      if (s.points) {
        s.points.forEach((p: Point) => {
          const px = p.x + cx;
          const py = p.y + cy;
          if (px >= 0 && px < 25 && py >= 0 && py < 25) {
            pixels[py][px] = true;
          }
        });
      }
    });
    return pixels;
  };

  const getEllipseGridPixels = () => {
    const pixels = Array(25).fill(null).map(() => Array(25).fill(false));
    const cx = 12; // visual center
    const cy = 12;
    ellipseSteps.forEach(s => {
      if (s.points) {
        s.points.forEach((p: Point) => {
          const px = p.x + cx;
          const py = p.y + cy;
          if (px >= 0 && px < 25 && py >= 0 && py < 25) {
            pixels[py][px] = true;
          }
        });
      }
    });
    return pixels;
  };

  return (
    <div className="space-y-6 animate-fade">
      
      {/* Sub tabs navigation */}
      <div className="flex border-b border-slate-200 space-x-4">
        {([
          { id: 'line', label: 'Line Drawing' },
          { id: 'circle', label: 'Circle Drawing' },
          { id: 'ellipse', label: 'Ellipse Drawing' },
          { id: 'fill', label: 'Region Filling' }
        ] as const).map((subTab) => (
          <button
            key={subTab.id}
            onClick={() => setActiveSubTab(subTab.id)}
            className={`pb-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeSubTab === subTab.id
                ? 'border-aast-navy text-aast-navy'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {subTab.label}
          </button>
        ))}
      </div>

      {/* --- Visualizers Content --- */}

      {activeSubTab === 'line' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls & Tables */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-aast-navy text-sm">Line Parameters</h3>
              
              <div className="grid grid-cols-4 gap-3">
                {(['x1', 'y1', 'x2', 'y2'] as const).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                    <input
                      type="number"
                      value={lineParams[key]}
                      onChange={(e) => setLineParams({ ...lineParams, [key]: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded focus:border-aast-navy"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <span className="text-xs text-slate-500 font-medium">Algorithm:</span>
                <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    checked={lineAlg === 'bresenham'}
                    onChange={() => setLineAlg('bresenham')}
                    className="text-aast-navy focus:ring-aast-navy"
                  />
                  <span>Bresenham's</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs font-medium cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    checked={lineAlg === 'dda'}
                    onChange={() => setLineAlg('dda')}
                    className="text-aast-navy focus:ring-aast-navy"
                  />
                  <span>DDA</span>
                </label>
              </div>
            </div>

            {/* Trace Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[300px]">
              <h4 className="font-bold text-xs text-slate-700 mb-2">Algorithm Trace Table</h4>
              <div className="overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50">
                      <th className="p-2">k</th>
                      <th className="p-2">{lineAlg === 'bresenham' ? 'P_k' : 'x'}</th>
                      <th className="p-2">{lineAlg === 'bresenham' ? 'x_{k+1}' : 'y'}</th>
                      <th className="p-2">{lineAlg === 'bresenham' ? 'y_{k+1}' : 'Plotted Pixel'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineSteps.map((step, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-2 font-semibold text-slate-500">{step.k}</td>
                        <td className="p-2 font-mono">{lineAlg === 'bresenham' ? step.pk : step.x}</td>
                        <td className="p-2 font-mono">{lineAlg === 'bresenham' ? step.x : step.y}</td>
                        <td className="p-2 font-mono text-aast-navy font-bold">
                          ({lineAlg === 'bresenham' ? step.x : step.plotX}, {lineAlg === 'bresenham' ? step.y : step.plotY})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Grid Render */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Plotted Line (20x20 Frame Buffer)</h4>
            <div className="grid grid-cols-20 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
              {getLineGridPixels().reverse().map((row, rIdx) => 
                row.map((active, cIdx) => {
                  const actualY = 19 - rIdx;
                  const actualX = cIdx;
                  return (
                    <div
                      key={`${actualX}-${actualY}`}
                      title={`Pixel: (${actualX}, ${actualY})`}
                      className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${
                        active 
                          ? 'bg-aast-navy shadow-inner rounded-smScale scale-95 border border-aast-gold' 
                          : 'bg-white hover:bg-slate-100'
                      }`}
                    />
                  );
                })
              )}
            </div>
            <div className="mt-3 flex items-center space-x-4 text-[10px] text-slate-400 font-semibold uppercase">
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-aast-navy border border-aast-gold rounded-sm" />
                <span>Plotted Pixel</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 bg-white border border-slate-200 rounded-sm" />
                <span>Empty Pixel</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Circle Visualizer Tab --- */}
      {activeSubTab === 'circle' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-aast-navy text-sm">Circle Parameters (Midpoint Circle)</h3>
              
              <div className="grid grid-cols-3 gap-3">
                {(['xc', 'yc', 'r'] as const).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                    <input
                      type="number"
                      value={circleParams[key]}
                      onChange={(e) => setCircleParams({ ...circleParams, [key]: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded focus:border-aast-navy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trace Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[300px]">
              <h4 className="font-bold text-xs text-slate-700 mb-2">Symmetric Octant Trace Table</h4>
              <div className="overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50">
                      <th className="p-2">k</th>
                      <th className="p-2">P_k</th>
                      <th className="p-2">Octant 1 (x, y)</th>
                      <th className="p-2">8-way Symmetric Pixels</th>
                    </tr>
                  </thead>
                  <tbody>
                    {circleSteps.map((step, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-2 font-semibold text-slate-500">{step.k}</td>
                        <td className="p-2 font-mono">{step.pk}</td>
                        <td className="p-2 font-mono font-bold text-aast-navy">({step.x}, {step.y})</td>
                        <td className="p-2 font-mono text-[9px] text-slate-500 leading-tight max-w-[200px] truncate" title={step.points.map((p: Point) => `(${p.x},${p.y})`).join(', ')}>
                          {step.points.map((p: Point) => `(${p.x},${p.y})`).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Grid Render */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Plotted Circle (25x25, CenterOffset: 12,12)</h4>
            <div className="grid grid-cols-25 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
              {getCircleGridPixels().reverse().map((row, rIdx) => 
                row.map((active, cIdx) => {
                  const actualY = 24 - rIdx;
                  const actualX = cIdx;
                  return (
                    <div
                      key={`${actualX}-${actualY}`}
                      title={`Pixel: (${actualX - 12}, ${actualY - 12})`}
                      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-300 ${
                        active 
                          ? 'bg-aast-navy shadow-inner rounded-smScale scale-95 border border-aast-gold' 
                          : 'bg-white hover:bg-slate-100'
                      }`}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Ellipse Visualizer Tab --- */}
      {activeSubTab === 'ellipse' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-aast-navy text-sm">Ellipse Parameters (Midpoint Ellipse)</h3>
              
              <div className="grid grid-cols-4 gap-3">
                {(['xc', 'yc', 'rx', 'ry'] as const).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{key}</label>
                    <input
                      type="number"
                      value={ellipseParams[key]}
                      onChange={(e) => setEllipseParams({ ...ellipseParams, [key]: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs font-semibold px-2 py-1 border border-slate-200 rounded focus:border-aast-navy"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trace Table */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[300px]">
              <h4 className="font-bold text-xs text-slate-700 mb-2">Quadrant Trace Table</h4>
              <div className="overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50">
                      <th className="p-2">k</th>
                      <th className="p-2">Reg.</th>
                      <th className="p-2">P_k</th>
                      <th className="p-2">Quadrant 1 (x, y)</th>
                      <th className="p-2">Symmetric Pixels</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ellipseSteps.map((step, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-2 font-semibold text-slate-500">{step.k}</td>
                        <td className="p-2 font-semibold">{step.region}</td>
                        <td className="p-2 font-mono">{step.pk.toFixed(1)}</td>
                        <td className="p-2 font-mono font-bold text-aast-navy">({step.x}, {step.y})</td>
                        <td className="p-2 font-mono text-[9px] text-slate-400 truncate max-w-[150px]">
                          {step.points.map((p: Point) => `(${p.x},${p.y})`).join(' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Grid Render */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Plotted Ellipse (25x25)</h4>
            <div className="grid grid-cols-25 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
              {getEllipseGridPixels().reverse().map((row, rIdx) => 
                row.map((active, cIdx) => {
                  const actualY = 24 - rIdx;
                  const actualX = cIdx;
                  return (
                    <div
                      key={`${actualX}-${actualY}`}
                      title={`Pixel: (${actualX - 12}, ${actualY - 12})`}
                      className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-300 ${
                        active 
                          ? 'bg-aast-navy shadow-inner rounded-smScale scale-95 border border-aast-gold' 
                          : 'bg-white hover:bg-slate-100'
                      }`}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Region Filling Visualizer Tab --- */}
      {activeSubTab === 'fill' && (
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Controls Column */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-aast-navy text-sm">Region Fill Options</h3>
              
              <div className="flex flex-col space-y-2">
                <span className="text-xs text-slate-500 font-medium">Draw Mode:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFillMode('draw-wall')}
                    className={`flex-1 py-1 text-xs font-bold rounded border ${
                      fillMode === 'draw-wall'
                        ? 'bg-aast-navy text-white border-aast-navy'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Draw Wall (Boundary)
                  </button>
                  <button
                    onClick={() => setFillMode('set-seed')}
                    className={`flex-1 py-1 text-xs font-bold rounded border ${
                      fillMode === 'set-seed'
                        ? 'bg-aast-gold text-aast-navy border-aast-gold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Set Seed Point
                  </button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-xs text-slate-500 font-medium">Filling Type:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFillType('boundary')}
                    className={`flex-1 py-1 text-xs font-semibold rounded border ${
                      fillType === 'boundary'
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Boundary Fill
                  </button>
                  <button
                    onClick={() => setFillType('flood')}
                    className={`flex-1 py-1 text-xs font-semibold rounded border ${
                      fillType === 'flood'
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    Flood Fill
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Connectivity:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setConnectivity(4)}
                    className={`px-3 py-1 font-bold rounded border ${
                      connectivity === 4 ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    4-Connected
                  </button>
                  <button
                    onClick={() => setConnectivity(8)}
                    className={`px-3 py-1 font-bold rounded border ${
                      connectivity === 8 ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    8-Connected
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Speed:</span>
                  <span className="font-bold font-mono">{fillSpeed}ms</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={fillSpeed}
                  onChange={(e) => setFillSpeed(parseInt(e.target.value))}
                  className="w-full accent-aast-navy"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={triggerFilling}
                  disabled={isFilling}
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center space-x-1 shadow disabled:opacity-50"
                >
                  <Play className="h-3 w-3" />
                  <span>Start Fill</span>
                </button>
                <button
                  onClick={clearFillGrid}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg"
                  title="Reset Grid"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={applyPresetShape}
                className="w-full py-1.5 border border-dashed border-aast-navy text-aast-navy text-xs font-semibold hover:bg-aast-navy-soft rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Load Diagonal Gap Room Preset</span>
              </button>
            </div>
            
            {/* Context/Explanation alert */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2 text-[11px] text-amber-700 leading-relaxed">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <strong>Diagonal leakage test:</strong> Use the diagonal preset. If you run <strong>4-connected fill</strong>, the color remains enclosed inside the room. If you run <strong>8-connected fill</strong>, the color leaks out through the diagonal gaps!
              </div>
            </div>
          </div>

          {/* Grid visual column */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center lg:col-span-1 select-none">
            <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Interactive Canvas (16x16)</h4>
            <div className="grid grid-cols-16 gap-[1px] bg-slate-200 border border-slate-300 p-1.5 rounded">
              {fillGrid.map((row, y) => 
                row.map((cellType, x) => {
                  const isSeed = seedPoint?.x === x && seedPoint?.y === y;
                  return (
                    <div
                      key={`${x}-${y}`}
                      onClick={() => handleGridClick(x, y)}
                      className={`h-4 w-4 sm:h-5 sm:w-5 cursor-crosshair transition-colors duration-200 relative ${
                        cellType === 'wall'
                          ? 'bg-slate-800'
                          : cellType === 'filled'
                          ? 'bg-aast-navy scale-95 rounded-sm border border-aast-gold animate-pulse-subtle'
                          : 'bg-white hover:bg-slate-100'
                      }`}
                    >
                      {isSeed && (
                        <div className="absolute inset-0 bg-aast-gold rounded-sm flex items-center justify-center text-[9px] font-black text-aast-navy select-none">
                          S
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Stack list visual column */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col max-h-[350px] lg:col-span-1">
            <h4 className="font-bold text-xs text-slate-600 mb-2">Recursion Stack ({fillStack.length} items)</h4>
            <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-100 rounded p-2 bg-slate-50 space-y-1">
              {fillStack.length === 0 ? (
                <span className="text-[10px] text-slate-400 italic">Stack empty. Trigger fill to watch recursion stack push/pop coords.</span>
              ) : (
                fillStack.slice().reverse().map((coord, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 px-2.5 py-1 rounded text-[10px] font-mono flex justify-between text-slate-600 shadow-sm">
                    <span>Stack [{fillStack.length - 1 - idx}]</span>
                    <span className="font-bold text-aast-navy">({coord.x}, {coord.y})</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
