import React, { useState } from 'react';
import { ShieldCheck, Lock, Save, Download, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  pinned: boolean;
}

interface LectureDetail {
  title: string;
  content: string;
}

interface Lecture {
  id: string;
  week: string;
  title: string;
  description: string;
  pdfUrl: string;
  concepts: string[];
  keyDetails: LectureDetail[];
}

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
  params: any;
  hint: string;
  steps: ExerciseStep[];
}

interface InstructorDashboardProps {
  lectures: Lecture[];
  setLectures: React.Dispatch<React.SetStateAction<Lecture[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  lectures,
  setLectures,
  announcements,
  setAnnouncements,
  exercises,
  setExercises,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  
  // Dashboard state
  const [activePanel, setActivePanel] = useState<'announcements' | 'lectures' | 'exercises'>('announcements');
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'local_fallback'; message?: string }>({ type: 'idle' });

  // Announcement form state
  const [annForm, setAnnForm] = useState({ title: '', content: '', pinned: false });
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  const CORRECT_PIN = 'aast2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CORRECT_PIN) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid Instructor Credentials Pin. Try: aast2026');
    }
  };

  const handleSaveToDisk = async (filename: string, data: any) => {
    setSaveStatus({ type: 'idle' });
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, data }),
      });
      const result = await response.json();
      if (result.success) {
        setSaveStatus({ type: 'success', message: `Saved changes directly to dev server disk: ${filename}!` });
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      // Fallback for static GitHub Pages environments
      setSaveStatus({ 
        type: 'local_fallback', 
        message: `Saved changes locally in your browser. Since we are in static hosting mode, click 'Download ${filename}' below to update the source code file.` 
      });
    }
  };

  const triggerFileDownload = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Announcements Actions ---
  const saveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editingAnnId) {
      updated = announcements.map(ann => 
        ann.id === editingAnnId 
          ? { ...ann, title: annForm.title, content: annForm.content, pinned: annForm.pinned }
          : ann
      );
      setEditingAnnId(null);
    } else {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: annForm.title,
        content: annForm.content,
        pinned: annForm.pinned
      };
      updated = [newAnn, ...announcements];
    }
    setAnnouncements(updated);
    setAnnForm({ title: '', content: '', pinned: false });
    handleSaveToDisk('announcements.json', updated);
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter(ann => ann.id !== id);
    setAnnouncements(updated);
    handleSaveToDisk('announcements.json', updated);
  };

  const startEditAnnouncement = (ann: Announcement) => {
    setEditingAnnId(ann.id);
    setAnnForm({ title: ann.title, content: ann.content, pinned: ann.pinned });
  };

  // --- Lectures Actions ---
  const handleLectureFieldChange = (lecId: string, field: keyof Lecture, val: any) => {
    const updated = lectures.map(lec => 
      lec.id === lecId ? { ...lec, [field]: val } : lec
    );
    setLectures(updated);
  };

  const saveLecturesList = () => {
    handleSaveToDisk('lectures.json', lectures);
  };

  // --- Exercises Actions ---
  const handleExerciseFieldChange = (exId: string, field: keyof Exercise, val: any) => {
    const updated = exercises.map(ex => 
      ex.id === exId ? { ...ex, [field]: val } : ex
    );
    setExercises(updated);
  };

  const saveExercisesList = () => {
    handleSaveToDisk('exercises.json', exercises);
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md my-12 p-6 bg-white border border-slate-200 shadow-xl rounded-2xl animate-fade">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-aast-navy/10 text-aast-navy flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-slate-800">Instructor Dashboard Access</h2>
            <p className="text-xs text-slate-500 mt-1">Please enter the security PIN credentials to toggle editor dashboards.</p>
          </div>
          
          <form onSubmit={handleLogin} className="w-full space-y-3">
            <div>
              <input
                type="password"
                placeholder="Instructor Security PIN (aast2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-xs text-center font-semibold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
              />
              {passwordError && (
                <span className="text-[10px] text-rose-500 font-bold block mt-1.5 text-center">{passwordError}</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 text-xs font-bold text-white bg-aast-navy hover:bg-aast-navy-light rounded-lg shadow transition-colors flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verify credentials</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade">
      
      {/* Save Notification Banner */}
      {saveStatus.type !== 'idle' && (
        <div 
          className={`p-4 rounded-xl border flex items-start space-x-2 text-xs animate-fade ${
            saveStatus.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-250 text-amber-800'
          }`}
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold">{saveStatus.type === 'success' ? 'Changes Saved!' : 'Static Mode Notice'}</p>
            <p className="mt-0.5 leading-relaxed">{saveStatus.message}</p>
          </div>
        </div>
      )}

      {/* Editor Panel Navigation tabs */}
      <div className="flex justify-between items-center bg-white p-3.5 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex space-x-2">
          {[
            { id: 'announcements', label: 'Announcements Board' },
            { id: 'lectures', label: 'Lecture Timeline' },
            { id: 'exercises', label: 'Student Practice Exercises' }
          ].map((panel) => (
            <button
              key={panel.id}
              onClick={() => {
                setActivePanel(panel.id as any);
                setSaveStatus({ type: 'idle' });
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activePanel === panel.id
                  ? 'bg-aast-navy text-aast-gold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {panel.label}
            </button>
          ))}
        </div>
        
        {/* Bulk download database files */}
        <div className="flex space-x-2">
          <button
            onClick={() => triggerFileDownload('announcements.json', announcements)}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
            title="Download announcements database"
          >
            <Download className="h-3 w-3" />
            <span>Ann.json</span>
          </button>
          <button
            onClick={() => triggerFileDownload('lectures.json', lectures)}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
            title="Download lectures database"
          >
            <Download className="h-3 w-3" />
            <span>Lec.json</span>
          </button>
          <button
            onClick={() => triggerFileDownload('exercises.json', exercises)}
            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-700 rounded flex items-center space-x-1"
            title="Download exercises database"
          >
            <Download className="h-3 w-3" />
            <span>Ex.json</span>
          </button>
        </div>
      </div>

      {/* --- Announcements Editor Tab --- */}
      {activePanel === 'announcements' && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Announcement Edit Form */}
          <div className="md:col-span-1 bg-white p-4 border border-slate-200 rounded-xl shadow-sm space-y-3 h-fit">
            <h3 className="font-bold text-slate-800 text-sm">{editingAnnId ? 'Edit Announcement' : 'Post Announcement'}</h3>
            <form onSubmit={saveAnnouncement} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="Announcements subject"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Content</label>
                <textarea
                  required
                  rows={4}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Post content..."
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
                />
              </div>

              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={annForm.pinned}
                  onChange={(e) => setAnnForm({ ...annForm, pinned: e.target.checked })}
                  className="text-aast-navy focus:ring-aast-navy h-4 w-4 rounded"
                />
                <label htmlFor="pinned" className="text-xs font-semibold text-slate-650 cursor-pointer">Pin to top of board</label>
              </div>

              <button
                type="submit"
                className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center space-x-1.5 shadow"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{editingAnnId ? 'Save Announcement' : 'Publish Announcement'}</span>
              </button>
            </form>
          </div>

          {/* Announcements list & delete triggers */}
          <div className="md:col-span-2 space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex justify-between items-start">
                <div className="space-y-1 pr-4">
                  <span className="text-[9px] font-mono text-slate-400 block">{ann.date} {ann.pinned && '• Pinned'}</span>
                  <h4 className="font-bold text-xs text-slate-800">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{ann.content}</p>
                </div>
                
                <div className="flex space-x-1 shrink-0">
                  <button
                    onClick={() => startEditAnnouncement(ann)}
                    className="p-1 text-slate-400 hover:bg-slate-50 hover:text-aast-navy rounded"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Lectures Editor Tab --- */}
      {activePanel === 'lectures' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-850 text-sm">Lecture Slide Database</h3>
            <button
              onClick={saveLecturesList}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-lg flex items-center space-x-1.5 shadow"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Slide Settings</span>
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
            {lectures.map((lec) => (
              <div key={lec.id} className="p-4 border border-slate-150 rounded-xl bg-slate-50 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Week</label>
                    <input
                      type="text"
                      value={lec.week}
                      onChange={(e) => handleLectureFieldChange(lec.id, 'week', e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Title</label>
                    <input
                      type="text"
                      value={lec.title}
                      onChange={(e) => handleLectureFieldChange(lec.id, 'title', e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">PDF File Path</label>
                    <input
                      type="text"
                      value={lec.pdfUrl}
                      onChange={(e) => handleLectureFieldChange(lec.id, 'pdfUrl', e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Description / Notes</label>
                  <textarea
                    rows={2}
                    value={lec.description}
                    onChange={(e) => handleLectureFieldChange(lec.id, 'description', e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Exercises Editor Tab --- */}
      {activePanel === 'exercises' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-850 text-sm">Homework & Tracing Exercises</h3>
            <button
              onClick={saveExercisesList}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-lg flex items-center space-x-1.5 shadow"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Exercises</span>
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[500px] custom-scrollbar pr-2">
            {exercises.map((ex) => (
              <div key={ex.id} className="p-4 border border-slate-150 rounded-xl bg-slate-50 space-y-3">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Title</label>
                    <input
                      type="text"
                      value={ex.title}
                      onChange={(e) => handleExerciseFieldChange(ex.id, 'title', e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Algorithm Category</label>
                    <select
                      value={ex.type}
                      onChange={(e) => handleExerciseFieldChange(ex.id, 'type', e.target.value as any)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded font-semibold"
                    >
                      <option value="line_bresenham">Bresenham's Line</option>
                      <option value="circle_midpoint">Midpoint Circle</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Hint for Students</label>
                    <input
                      type="text"
                      value={ex.hint}
                      onChange={(e) => handleExerciseFieldChange(ex.id, 'hint', e.target.value)}
                      className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-450 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={ex.description}
                    onChange={(e) => handleExerciseFieldChange(ex.id, 'description', e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
