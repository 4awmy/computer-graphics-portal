import React, { useState } from 'react';
import { FileText, Megaphone, Pin, ChevronDown, ChevronUp, ExternalLink, Library } from 'lucide-react';

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

interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  pinned: boolean;
}

interface LecturesViewProps {
  lectures: Lecture[];
  announcements: Announcement[];
}

export const LecturesView: React.FC<LecturesViewProps> = ({ lectures, announcements }) => {
  const [expandedLec, setExpandedLec] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedLec(expandedLec === id ? null : id);
  };

  // Section Sheets info
  const sheets = [
    { id: 'sheet1', title: 'Sheet I - Line Drawing Algorithms', topics: ['DDA Line Drawing', 'Bresenham Line Drawing (m < 1)', 'Bresenham Line Drawing (m > 1)'], pdf: 'Section/Section/Sheet I - Line Drawing Algorithms.pdf' },
    { id: 'sheet2', title: 'Sheet II - Circle Drawing Algorithm', topics: ['Midpoint Circle Derivations', 'Graphical Intersections'], pdf: 'Section/Section/Sheet II - Circle Drawing Algorithm.pdf' },
    { id: 'sheet3', title: 'Sheet III - Elipse Drawing Algorithm', topics: ['Midpoint Ellipse Algorithm', 'Quadrant Boundary Transitions'], pdf: 'Section/Section/Sheet III - Elipse Drawing Algorithm.pdf' },
    { id: 'sheet4', title: 'Sheet IV - Region Filling', topics: ['Scan-Line Fill', 'Boundary Fill (4-connected & 8-connected)', 'Flood Fill'], pdf: 'Section/Section/Sheet IV - Region Filling.pdf' }
  ];

  return (
    <div className="space-y-8 animate-fade">
      
      {/* Announcements Board */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <Megaphone className="h-5 w-5 text-aast-navy" />
          <h2 className="text-xl font-bold text-aast-navy">Announcements Board</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {announcements.map((ann) => (
            <div 
              key={ann.id} 
              className={`p-4 rounded-xl border relative shadow-sm transition-all duration-300 hover:shadow-md ${
                ann.pinned 
                  ? 'bg-aast-navy text-white border-aast-gold' 
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {ann.pinned && (
                <div className="absolute top-3 right-3 flex items-center space-x-1 text-aast-gold text-xs font-semibold">
                  <Pin className="h-3 w-3 fill-aast-gold text-aast-gold" />
                  <span>Pinned</span>
                </div>
              )}
              <span className={`text-[10px] block mb-1 font-mono ${ann.pinned ? 'text-aast-gold' : 'text-slate-400'}`}>
                {ann.date}
              </span>
              <h3 className={`font-bold mb-2 ${ann.pinned ? 'text-aast-gold text-md' : 'text-slate-800'}`}>
                {ann.title}
              </h3>
              <p className="text-xs leading-relaxed opacity-90">{ann.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lectures & Sheets split layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Main Lectures Timeline */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-aast-navy" />
            <h2 className="text-xl font-bold text-aast-navy">Lecture Syllabus Timeline</h2>
          </div>

          <div className="relative border-l-2 border-slate-200 pl-4 ml-3 space-y-6">
            {lectures.map((lec) => {
              const isExpanded = expandedLec === lec.id;
              return (
                <div key={lec.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[25px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-aast-navy group-hover:bg-aast-gold transition-colors duration-200" />
                  
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:border-slate-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-aast-navy-soft text-aast-navy mr-2">
                          {lec.week}
                        </span>
                        <h3 className="inline font-bold text-slate-800 text-sm sm:text-base group-hover:text-aast-navy transition-colors">
                          {lec.title}
                        </h3>
                      </div>
                      
                      {/* PDF slide direct open */}
                      <a 
                        href={`./${lec.pdfUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        title="Open slides PDF"
                        className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-aast-navy transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {lec.description}
                    </p>

                    {/* Quick concepts tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {lec.concepts.map((concept, index) => (
                        <span key={index} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {concept}
                        </span>
                      ))}
                    </div>

                    {/* Toggle expand details */}
                    <button
                      onClick={() => toggleExpand(lec.id)}
                      className="mt-4 flex items-center space-x-1 text-xs text-aast-navy font-semibold hover:text-aast-navy-light transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>Hide Key Equations & Facts</span>
                          <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          <span>Show Key Equations & Facts</span>
                          <ChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>

                    {/* Expanded details details */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-slate-100 pt-4 space-y-3 animate-fade">
                        {lec.keyDetails.map((detail, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-150">
                            <h4 className="text-xs font-bold text-aast-navy mb-1">{detail.title}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{detail.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section sheets column */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Library className="h-5 w-5 text-aast-navy" />
            <h2 className="text-xl font-bold text-aast-navy">Laboratory Sheets</h2>
          </div>

          <div className="space-y-4">
            {sheets.map((sheet) => (
              <div key={sheet.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xs text-slate-800 leading-tight">
                    {sheet.title}
                  </h3>
                  <a
                    href={`./${sheet.pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    title="Open sheet PDF"
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-aast-navy"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                
                <ul className="space-y-1">
                  {sheet.topics.map((topic, i) => (
                    <li key={i} className="text-slate-500 text-[11px] flex items-center space-x-1.5">
                      <span className="w-1 h-1 rounded-full bg-aast-gold" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
