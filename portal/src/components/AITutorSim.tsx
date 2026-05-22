import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'student' | 'ai';
  text: string;
  timestamp: string;
}

let messageCounter = 0;
const generateMessageId = (prefix: string): string => {
  messageCounter++;
  return `${prefix}_${messageCounter}_${Date.now()}`;
};

const getCurrentTimestamp = (): string => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const AITutorSim: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: "Hello! I am your AI Computer Graphics Tutor. I'm trained on Dr. Gouda Ismail's lecture slides. You can ask me questions about line-drawing, circle-drawing, clipping, spline curves, filling, or 2D/3D transformations. How can I help you study today?",
      timestamp: getCurrentTimestamp()
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Pre-configured intelligent knowledge routing
  const knowledgeBase = [
    {
      keywords: ['dda', 'bresenham', 'line', 'difference'],
      answer: "DDA (Digital Differential Analyzer) is a float-based incremental algorithm. It steps along one coordinate by 1 and increments the other by the slope (m) or inverse slope (1/m). It requires floating-point additions and rounding at each step, making it slower. \n\nBresenham's algorithm uses only integer addition and bit-shifting by computing a decision parameter (P_k) to decide which pixel to plot. Since modern GPUs/CPUs handle integer math much faster and without rounding errors, Bresenham's is significantly more efficient."
    },
    {
      keywords: ['symmetry', '8-way', 'eight', 'circle'],
      answer: "A circle is highly symmetrical. 8-way symmetry means we only need to compute the coordinates for one octant (from x=0 to y=r/sqrt(2) or 45 degrees). We can then mirror that computed point (x, y) into the other seven octants: \n1. (x, y) - Octant 1\n2. (y, x) - Octant 2\n3. (-y, x) - Octant 3\n4. (-x, y) - Octant 4\n5. (-x, -y) - Octant 5\n6. (-y, -x) - Octant 6\n7. (y, -x) - Octant 7\n8. (x, -y) - Octant 8\nThis reduces the calculations required by 87.5%!"
    },
    {
      keywords: ['continuity', 'c1', 'g1', 'c2', 'g2', 'spline'],
      answer: "In spline curves, continuity defines how smoothly segments join together:\n- C^0 (Parametric 0) and G^0 (Geometric 0): The curves simply touch at the joint.\n- C^1: The tangent vectors (first derivatives) of both curves are equal at the joint (same direction and magnitude).\n- G^1: The tangent vectors point in the same direction, but their magnitudes can differ. Visually, it looks smooth but mathematically it's less constrained.\n- C^2: The curvature vectors (second derivatives) are equal, creating highly smooth motion curves (useful for camera paths)."
    },
    {
      keywords: ['composite', 'arbitrary', 'rotate', 'pivot', 'scale'],
      answer: "To perform rotation or scaling around an arbitrary point (Xr, Yr) instead of the origin:\n1. Translate the object so the pivot point moves to the origin: T(-Xr, -Yr).\n2. Rotate/Scale relative to the origin: R(theta) or S(Sx, Sy).\n3. Translate the object back to the original position: T(Xr, Yr).\n\nIn homogeneous matrices, this is represented by concatenating: M = T(Xr, Yr) * R(theta) * T(-Xr, -Yr). Remember, matrix multiplication is non-commutative, so order is critical!"
    },
    {
      keywords: ['filling', 'boundary', 'flood', '4-connected', '8-connected'],
      answer: "Boundary-Fill: Fills an area outwards from a seed point until it reaches pixels matching a specific border color.\nFlood-Fill: Replaces a connected region of an old color with a new target color.\n\nConnectivity differences:\n- 4-Connected: Only checks horizontal/vertical cardinal neighbors.\n- 8-Connected: Checks cardinal and diagonal neighbors.\n- Warning: If your boundary contains diagonal lines, 4-connected filling might not leak, but it will also fail to color across diagonal bounds. However, using 4-connected boundary fill on a shape that has diagonal gaps can leave parts uncolored, whereas 8-connected fill traverses diagonals but can 'leak' if the borders themselves have diagonal gaps."
    }
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const studentMsg: Message = {
      id: generateMessageId('msg_stud'),
      sender: 'student',
      text,
      timestamp: getCurrentTimestamp()
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputVal('');

    // Simulate AI thinking and replying
    setTimeout(() => {
      let matchedAns = "";
      const cleanText = text.toLowerCase();

      // Search keywords
      for (const item of knowledgeBase) {
        if (item.keywords.some(kw => cleanText.includes(kw))) {
          matchedAns = item.answer;
          break;
        }
      }

      if (!matchedAns) {
        matchedAns = "That's an interesting computer graphics question! I couldn't find a direct match in my local index. Since we are running in simulation mode on GitHub Pages, I don't have a live cloud backend to call. \n\nHowever, a production AI Agent (integrated with the Gemini API) would search Dr. Gouda's slides, explain the math, and guide you. You can try asking about: 'difference between DDA and Bresenham', '8-way symmetry', 'C1 and G1 continuity', 'composite rotation', or 'boundary vs flood fill'.";
      }

      const aiMsg: Message = {
        id: generateMessageId('msg_ai'),
        sender: 'ai',
        text: matchedAns,
        timestamp: getCurrentTimestamp()
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="grid gap-6 lg:grid-cols-4 animate-fade">
      
      {/* Simulation Notice Banner */}
      <div className="lg:col-span-4 bg-slate-800 text-white p-4 rounded-xl border border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-md">
        <div className="flex items-start space-x-2.5">
          <Sparkles className="h-5 w-5 text-aast-gold mt-0.5 shrink-0" />
          <div className="text-xs">
            <h3 className="font-bold text-aast-gold text-sm">Interactive AI Explainer Simulation</h3>
            <p className="text-slate-300 mt-0.5">This chat simulates a RAG-based LLM tutor. It operates locally with zero server overhead, making it ideal for static GitHub Pages hosting.</p>
          </div>
        </div>
        <a 
          href="./AI_Agent_Analysis.md"
          target="_blank" 
          rel="noreferrer"
          className="text-xs font-bold px-3 py-1.5 bg-aast-gold hover:bg-aast-gold-light text-aast-navy rounded-lg shadow transition-colors"
        >
          Read Implementation Analysis
        </a>
      </div>

      {/* Suggested Topics Sidebar */}
      <div className="lg:col-span-1 space-y-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-3">Quick Prompts</h3>
          <div className="flex flex-col space-y-2">
            {[
              { label: "Bresenham vs DDA Line", query: "Explain the difference between DDA and Bresenham's algorithms." },
              { label: "8-Way Symmetry Use", query: "Why is 8-way symmetry useful in circle drawing?" },
              { label: "C1 vs G1 Continuity", query: "What is the difference between C1 and G1 continuity in spline curves?" },
              { label: "Composite Rotation", query: "How do you perform a composite rotation around an arbitrary pivot point?" },
              { label: "Boundary vs Flood Fill", query: "What is the difference between 4-connected and 8-connected filling?" }
            ].map((topic, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(topic.query)}
                className="text-left text-xs p-2 hover:bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-semibold transition-all hover:border-slate-350"
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-slate-150 flex items-center justify-between bg-slate-50 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-slate-700">Tutor Online</span>
          </div>
          <span className="text-[10px] text-slate-450 uppercase font-black">Knowledge Base: Lectures 1-11</span>
        </div>

        {/* Messages space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 max-w-[85%] ${
                  isAi ? '' : 'ml-auto flex-row-reverse space-x-reverse'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm shrink-0 ${
                    isAi ? 'bg-aast-navy text-aast-gold' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isAi ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed whitespace-pre-line shadow-sm ${
                    isAi
                      ? 'bg-slate-50 border-slate-200 text-slate-800 rounded-tl-none'
                      : 'bg-aast-navy border-aast-navy text-white rounded-tr-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block text-right mt-1.5 ${isAi ? 'text-slate-400' : 'text-slate-300'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="p-3 border-t border-slate-200 flex gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your graphics question (e.g. 'tell me about 8-way symmetry')..."
            className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-aast-navy"
          />
          <button
            type="submit"
            className="p-2 bg-aast-navy hover:bg-aast-navy-light text-aast-gold rounded-lg shadow transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
