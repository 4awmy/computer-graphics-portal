import React, { useState } from 'react';
import { HelpCircle, Eye, RefreshCw, CheckCircle, ChevronRight, XCircle } from 'lucide-react';

interface ExerciseStep {
  k: number;
  pk: number | string;
  x: number;
  y: number;
}

interface Exercise {
  id: string;
  type: 'line_bresenham' | 'circle_midpoint';
  title: string;
  description: string;
  params: Record<string, number>;
  hint: string;
  steps: ExerciseStep[];
}

interface PracticeZoneProps {
  exercises: Exercise[];
}

interface ExerciseWorkspaceProps {
  exercise: Exercise;
}

const ExerciseWorkspace: React.FC<ExerciseWorkspaceProps> = ({ exercise }) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [revealSolution, setRevealSolution] = useState<boolean>(false);

  const handleInputChange = (stepIdx: number, field: string, val: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [`${stepIdx}-${field}`]: val,
    }));
  };

  const getCellStatus = (stepIdx: number, field: string, expectedVal: number | string) => {
    if (revealSolution) return 'correct';
    
    const key = `${stepIdx}-${field}`;
    const studentVal = studentAnswers[key];
    if (studentVal === undefined || studentVal === '') return 'empty';
    
    // Normalize comparison (e.g. handle floats or string N/A)
    const expectedStr = String(expectedVal).trim().toLowerCase();
    const studentStr = studentVal.trim().toLowerCase();
    
    return expectedStr === studentStr ? 'correct' : 'incorrect';
  };

  const revealAllAnswers = () => {
    setRevealSolution(true);
    // Pre-fill answers in local state
    const prefilled: Record<string, string> = {};
    exercise.steps.forEach((step, idx) => {
      prefilled[`${idx}-pk`] = String(step.pk);
      prefilled[`${idx}-x`] = String(step.x);
      prefilled[`${idx}-y`] = String(step.y);
    });
    setStudentAnswers(prefilled);
  };

  const resetExercise = () => {
    setStudentAnswers({});
    setRevealSolution(false);
    setShowHint(false);
  };

  // Check if entire exercise is solved correctly
  const isFullySolved = () => {
    return exercise.steps.every((step, idx) => {
      const pkStatus = getCellStatus(idx, 'pk', step.pk);
      const xStatus = getCellStatus(idx, 'x', step.x);
      const yStatus = getCellStatus(idx, 'y', step.y);
      return pkStatus === 'correct' && xStatus === 'correct' && yStatus === 'correct';
    });
  };

  // Determine grid pixels from correct coordinates
  const getGridPixels = () => {
    const pixels = Array(20).fill(null).map(() => Array(20).fill('empty'));
    const isCircle = exercise.type === 'circle_midpoint';
    const cx = 10; // visual center offset
    const cy = 10;

    exercise.steps.forEach((step, idx) => {
      // Only plot if coords are correct (or solutions revealed)
      const xCorrect = getCellStatus(idx, 'x', step.x) === 'correct';
      const yCorrect = getCellStatus(idx, 'y', step.y) === 'correct';
      
      if (xCorrect && yCorrect) {
        if (isCircle) {
          // Plot all 8-way symmetric points
          const symPoints = [
            { x: step.x, y: step.y },
            { x: step.y, y: step.x },
            { x: -step.y, y: step.x },
            { x: -step.x, y: step.y },
            { x: -step.x, y: -step.y },
            { x: -step.y, y: -step.x },
            { x: step.y, y: -step.x },
            { x: step.x, y: -step.y },
          ];
          symPoints.forEach((p) => {
            const px = p.x + cx;
            const py = p.y + cy;
            if (px >= 0 && px < 20 && py >= 0 && py < 20) {
              pixels[py][px] = 'plotted';
            }
          });
        } else {
          // Line plotting
          const px = step.x;
          const py = step.y;
          if (px >= 0 && px < 20 && py >= 0 && py < 20) {
            pixels[py][px] = 'plotted';
          }
        }
      }
    });

    return pixels;
  };

  return (
    <div className="space-y-6">
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Action buttons sidebar section */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex-1 py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-lg flex items-center justify-center space-x-1.5"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
              <button
                onClick={revealAllAnswers}
                className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-xs font-bold text-white rounded-lg flex items-center justify-center space-x-1.5 shadow"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Solve For Me</span>
              </button>
            </div>

            <button
              onClick={resetExercise}
              className="w-full py-1.5 border border-dashed border-red-200 text-red-500 text-xs font-bold hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Tracing Table</span>
            </button>
          </div>
        </div>

        {/* Exercises Work Space */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-bold text-aast-navy">{exercise.title}</h2>
              {isFullySolved() && (
                <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-black uppercase">
                  <CheckCircle className="h-3 w-3" />
                  <span>Success</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              {exercise.description}
            </p>

            {/* Hint Panel */}
            {showHint && (
              <div className="bg-aast-gold-soft border-l-4 border-aast-gold p-3 rounded-r-lg text-xs text-aast-gold-dark leading-relaxed animate-fade">
                <strong>Instructor Hint:</strong> {exercise.hint}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Tracing Interactive Table */}
      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Table entries */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-xs text-slate-700 mb-3">Trace Table Calculation Grid</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold bg-slate-50">
                  <th className="p-2">k (Step)</th>
                  <th className="p-2">P_k (Decision Parameter)</th>
                  <th className="p-2">Plot x</th>
                  <th className="p-2">Plot y</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {exercise.steps.map((step, idx) => {
                  const pkStatus = getCellStatus(idx, 'pk', step.pk);
                  const xStatus = getCellStatus(idx, 'x', step.x);
                  const yStatus = getCellStatus(idx, 'y', step.y);
                  
                  const isStepCorrect = pkStatus === 'correct' && xStatus === 'correct' && yStatus === 'correct';
                  
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-2 font-bold text-slate-400">{step.k}</td>
                      
                      {/* Decision Parameter Cell */}
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={revealSolution}
                          value={studentAnswers[`${idx}-pk`] || ''}
                          onChange={(e) => handleInputChange(idx, 'pk', e.target.value)}
                          placeholder="P_k"
                          className={`w-16 px-1.5 py-0.5 border text-xs font-mono rounded font-bold transition-all text-center focus:outline-none focus:ring-1 ${
                            pkStatus === 'correct'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 focus:ring-emerald-400'
                              : pkStatus === 'incorrect'
                              ? 'bg-rose-50 border-rose-300 text-rose-700 focus:ring-rose-400'
                              : 'border-slate-200 focus:border-aast-navy focus:ring-aast-navy'
                          }`}
                        />
                      </td>

                      {/* X Coord Cell */}
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={revealSolution}
                          value={studentAnswers[`${idx}-x`] || ''}
                          onChange={(e) => handleInputChange(idx, 'x', e.target.value)}
                          placeholder="x"
                          className={`w-14 px-1.5 py-0.5 border text-xs font-mono rounded font-bold transition-all text-center focus:outline-none focus:ring-1 ${
                            xStatus === 'correct'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 focus:ring-emerald-400'
                              : xStatus === 'incorrect'
                              ? 'bg-rose-50 border-rose-300 text-rose-700 focus:ring-rose-400'
                              : 'border-slate-200 focus:border-aast-navy focus:ring-aast-navy'
                          }`}
                        />
                      </td>

                      {/* Y Coord Cell */}
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={revealSolution}
                          value={studentAnswers[`${idx}-y`] || ''}
                          onChange={(e) => handleInputChange(idx, 'y', e.target.value)}
                          placeholder="y"
                          className={`w-14 px-1.5 py-0.5 border text-xs font-mono rounded font-bold transition-all text-center focus:outline-none focus:ring-1 ${
                            yStatus === 'correct'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 focus:ring-emerald-400'
                              : yStatus === 'incorrect'
                              ? 'bg-rose-50 border-rose-300 text-rose-700 focus:ring-rose-400'
                              : 'border-slate-200 focus:border-aast-navy focus:ring-aast-navy'
                          }`}
                        />
                      </td>

                      {/* Status Icon */}
                      <td className="p-2 text-center flex items-center justify-center pt-2.5">
                        {isStepCorrect ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : pkStatus === 'incorrect' || xStatus === 'incorrect' || yStatus === 'incorrect' ? (
                          <XCircle className="h-4 w-4 text-rose-500" />
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-slate-100 border border-slate-200" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Dynamic Grid display */}
        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
          <h4 className="font-bold text-xs text-slate-600 mb-3 self-start">Plotted result (Correct entries only)</h4>
          <div className="grid grid-cols-20 gap-[1px] bg-slate-200 border border-slate-300 p-1 rounded">
            {getGridPixels().reverse().map((row, rIdx) => 
              row.map((status, cIdx) => {
                const actualY = 19 - rIdx;
                const actualX = cIdx;
                const isCircle = exercise.type === 'circle_midpoint';
                
                // Set offset display for circle
                const label = isCircle 
                  ? `(${actualX - 10}, ${actualY - 10})` 
                  : `(${actualX}, ${actualY})`;
                
                return (
                  <div
                    key={`${actualX}-${actualY}`}
                    title={`Pixel coordinates: ${label}`}
                    className={`h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300 ${
                      status === 'plotted'
                        ? 'bg-emerald-600 border border-emerald-400 shadow-inner rounded-sm scale-95'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  />
                );
              })
            )}
          </div>
          <div className="mt-3 flex items-center space-x-4 text-[10px] text-slate-400 font-bold uppercase">
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 bg-emerald-600 border border-emerald-400 rounded-sm" />
              <span>Correctly Plotted</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 bg-white border border-slate-200 rounded-sm" />
              <span>Empty Pixel</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export const PracticeZone: React.FC<PracticeZoneProps> = ({ exercises }) => {
  const [selectedExId, setSelectedExId] = useState<string>(exercises[0]?.id || '');
  const activeExercise = exercises.find((ex) => ex.id === selectedExId) || exercises[0];

  if (!activeExercise) {
    return <div className="text-center py-8 text-slate-500">No exercises loaded.</div>;
  }

  return (
    <div className="space-y-6 animate-fade">
      
      {/* Selector and problem statement */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Exercises Select Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-aast-navy text-xs uppercase tracking-wider">Select Exercise</h3>
            <div className="flex flex-col space-y-1">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExId(ex.id)}
                  className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all flex justify-between items-center ${
                    selectedExId === ex.id
                      ? 'bg-aast-navy text-aast-gold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{ex.title}</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exercises Work Space */}
        <div className="md:col-span-2">
          <ExerciseWorkspace key={activeExercise.id} exercise={activeExercise} />
        </div>

      </div>

    </div>
  );
};
