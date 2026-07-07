import { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Globe, BarChart2, Brain, Palette, Shield, Smartphone,
  BookOpen, Video, FileText, Award, Trophy, Star,
  CheckCircle, Lock, Play, ChevronRight, ArrowRight,
  TrendingUp, Clock, Target, Zap, Bell, Map,
  User, Code2, Eye, EyeOff, Mail, KeyRound,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────
type Screen = "login" | "welcome" | "assessment" | "result" | "dashboard";
type TabId = "roadmap" | "materials" | "achievements" | "report";
type Level = "beginner" | "intermediate" | "advanced";

// ─── Static Data ─────────────────────────────────────────
const FIELDS = [
  { id: "webdev",   label: "Web Development",      sub: "HTML, CSS, JavaScript, React",      icon: Globe,       hue: "violet"  },
  { id: "data",     label: "Data Science",          sub: "Python, Pandas, Visualization",     icon: BarChart2,   hue: "cyan"    },
  { id: "ai",       label: "AI & Machine Learning", sub: "Neural Nets, NLP, PyTorch",         icon: Brain,       hue: "purple"  },
  { id: "design",   label: "UI/UX Design",          sub: "Figma, Prototyping, Research",      icon: Palette,     hue: "rose"    },
  { id: "security", label: "Cybersecurity",          sub: "Networking, Pen Testing, CTF",      icon: Shield,      hue: "emerald" },
  { id: "mobile",  label: "Mobile Development",    sub: "React Native, Swift, Kotlin",       icon: Smartphone,  hue: "amber"   },
];

const FIELD_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  violet:  { bg: "#ede9fe", text: "#5b21b6", border: "#c4b5fd", dot: "#7c3aed" },
  cyan:    { bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc", dot: "#06b6d4" },
  purple:  { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe", dot: "#8b5cf6" },
  rose:    { bg: "#fff1f2", text: "#be123c", border: "#fecdd3", dot: "#f43f5e" },
  emerald: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", dot: "#10b981" },
  amber:   { bg: "#fffbeb", text: "#92400e", border: "#fde68a", dot: "#f59e0b" },
};

const QUESTIONS = [
  {
    q: "You need a webpage to look great on both mobile and desktop. What is the most effective approach?",
    opts: [
      "Set fixed pixel widths for all containers",
      "Use responsive units (%, rem, vw) and CSS media queries",
      "Create two separate HTML files for each device",
      "Use JavaScript to detect screen size and reload the page",
    ],
    correct: 1,
  },
  {
    q: "What does an HTTP 404 status code mean?",
    opts: [
      "The server is still processing the request",
      "The resource was successfully created",
      "The requested resource was not found",
      "The server requires authentication",
    ],
    correct: 2,
  },
  {
    q: "Which concept best describes bundling data and behavior together in a single unit?",
    opts: ["Recursion", "Object-Oriented Programming", "Functional Programming", "Event-driven Architecture"],
    correct: 1,
  },
  {
    q: "A React component re-renders far too often. What is the best first optimization step?",
    opts: [
      "Rewrite the component as a class component",
      "Apply React.memo and useMemo to memoize expensive computations",
      "Move all state to a global Redux store",
      "Increase the server memory allocation",
    ],
    correct: 1,
  },
  {
    q: "Your API must handle 50,000 concurrent requests reliably. Which architecture is most appropriate?",
    opts: [
      "Add more conditional branches in the request handler",
      "Spawn a new OS thread per incoming request",
      "Use an event-loop with async I/O plus horizontal load balancing",
      "Cache all responses in browser cookies",
    ],
    correct: 2,
  },
];

const ROADMAP: Record<Level, Array<{ week: number; title: string; topics: string[]; status: "done" | "current" | "locked"; xp: number }>> = {
  beginner: [
    { week: 1, title: "Foundations & Dev Setup",   topics: ["Environment", "Core Syntax", "First App"],      status: "done",    xp: 150 },
    { week: 2, title: "Core Concepts I",            topics: ["Data Types", "Control Flow", "Functions"],      status: "done",    xp: 200 },
    { week: 3, title: "Core Concepts II",           topics: ["Modules", "Error Handling", "Debugging"],       status: "current", xp: 250 },
    { week: 4, title: "Practical Mini-Project",     topics: ["App Build", "Code Review", "Refactoring"],      status: "locked",  xp: 300 },
    { week: 5, title: "Intermediate Bridge",        topics: ["OOP Patterns", "Async Basics", "Testing 101"],  status: "locked",  xp: 350 },
    { week: 6, title: "Certification Sprint",       topics: ["Mock Exam", "Final Project", "Certificate"],    status: "locked",  xp: 500 },
  ],
  intermediate: [
    { week: 1, title: "Advanced Patterns",          topics: ["Design Patterns", "SOLID Principles", "Architecture"], status: "done",    xp: 300 },
    { week: 2, title: "Frameworks & Tooling",       topics: ["Modern Frameworks", "Build Tools", "CI/CD"],           status: "current", xp: 400 },
    { week: 3, title: "Backend Integration",        topics: ["REST & GraphQL", "Databases", "Auth"],                 status: "locked",  xp: 450 },
    { week: 4, title: "Full-Stack Capstone",        topics: ["Capstone Build", "Deployment", "Monitoring"],          status: "locked",  xp: 600 },
  ],
  advanced: [
    { week: 1, title: "System Design",              topics: ["Distributed Systems", "CAP Theorem", "Trade-offs"],    status: "done",    xp: 500 },
    { week: 2, title: "Performance Mastery",        topics: ["Profiling", "Caching Layers", "CDN Strategy"],         status: "current", xp: 600 },
    { week: 3, title: "Leadership & Craft",         topics: ["Code Review Culture", "Technical Docs", "Mentoring"],  status: "locked",  xp: 700 },
  ],
};

const MATERIALS = [
  { type: "video"    as const, title: "Async JavaScript & the Event Loop",   meta: "24 min",  progress: 100, img: "photo-1516321318423-f06f85e504b3" },
  { type: "video"    as const, title: "Building Scalable REST APIs",          meta: "38 min",  progress: 60,  img: "photo-1555066931-4365d14bab8c"  },
  { type: "article"  as const, title: "CSS Grid vs Flexbox: When to Use Each", meta: "9 min read", progress: 100 },
  { type: "video"    as const, title: "React 18 Concurrent Features",         meta: "45 min",  progress: 0,   img: "photo-1633356122544-f134324a6cee" },
  { type: "article"  as const, title: "The 12 Principles of Clean Code",      meta: "14 min read", progress: 30 },
  { type: "exercise" as const, title: "Build a Real-Time Chat App",           meta: "Medium",  progress: 0 },
];

const CERTS = [
  { title: "Web Fundamentals",    issued: "Jun 15, 2025", grade: "A+", skills: ["HTML5", "CSS3", "Flexbox"],     earned: true  },
  { title: "JavaScript Mastery",  issued: "Jun 29, 2025", grade: "A",  skills: ["ES6+", "Async/Await", "DOM"],   earned: true  },
  { title: "React & Ecosystem",   issued: null,           grade: null,  skills: ["Hooks", "Context", "Router"],   earned: false },
  { title: "Full-Stack Capstone", issued: null,           grade: null,  skills: ["Node.js", "Database", "Deploy"], earned: false },
];

const WEEKLY_DATA = [
  { week: "Wk 1", score: 72, hours: 4.5, tasks: 8  },
  { week: "Wk 2", score: 78, hours: 5.2, tasks: 10 },
  { week: "Wk 3", score: 68, hours: 3.8, tasks: 7  },
  { week: "Wk 4", score: 85, hours: 6.1, tasks: 12 },
  { week: "Wk 5", score: 82, hours: 5.5, tasks: 11 },
  { week: "Wk 6", score: 91, hours: 7.0, tasks: 14 },
];

const RADAR_DATA = [
  { skill: "Syntax",  value: 88 },
  { skill: "Logic",   value: 72 },
  { skill: "Design",  value: 65 },
  { skill: "Testing", value: 58 },
  { skill: "APIs",    value: 80 },
  { skill: "Debug",   value: 84 },
];

const LEVEL_META: Record<Level, { label: string; color: string; bg: string; tagline: string; weeks: number }> = {
  beginner:     { label: "Beginner",     color: "#10b981", bg: "#d1fae5", tagline: "Building your foundation, concept by concept.", weeks: 12 },
  intermediate: { label: "Intermediate", color: "#f59e0b", bg: "#fef3c7", tagline: "Accelerating your skills with real-world projects.", weeks: 8 },
  advanced:     { label: "Advanced",     color: "#7c3aed", bg: "#ede9fe", tagline: "Mastery-level depth — architecture, scale, leadership.", weeks: 6 },
};

const MONO = { fontFamily: "'JetBrains Mono', monospace" };
const SANS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const BODY = { fontFamily: "'Inter', sans-serif" };

// ─── Demo accounts ───────────────────────────────────────
const DEMO_USERS = [
  { email: "alex.chen@student.edu", password: "learn123", name: "Alex Chen" },
  { email: "demo@learnpath.io",     password: "demo",     name: "Demo Student" },
];

// ─── App ─────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]   = useState<Screen>("login");
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [qIdx, setQIdx]       = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [picked, setPicked]   = useState<number | null>(null);
  const [level, setLevel]     = useState<Level>("intermediate");
  const [tab, setTab]         = useState<TabId>("roadmap");
  const [studentName, setStudentName] = useState("Alex Chen");

  const field = FIELDS.find(f => f.id === fieldId) ?? FIELDS[0];
  const fc    = FIELD_COLORS[field.hue];
  const lvl   = LEVEL_META[level];
  const mods  = ROADMAP[level];
  const earnedXP = mods.filter(m => m.status !== "locked").reduce((s, m) => s + m.xp, 0);

  const handleLogin = (email: string, name: string) => {
    setStudentName(name);
    setScreen("welcome");
  };

  const handleNext = () => {
    if (picked === null) return;
    const next = [...answers, picked];
    setAnswers(next);
    setPicked(null);
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      const pct = (next.filter((a, i) => a === QUESTIONS[i].correct).length / QUESTIONS.length) * 100;
      setLevel(pct <= 40 ? "beginner" : pct <= 75 ? "intermediate" : "advanced");
      setScreen("result");
    }
  };

  // ── Login ─────────────────────────────────────────────
  if (screen === "login") return <LoginScreen onLogin={handleLogin} users={DEMO_USERS} />;

  // ── Welcome ───────────────────────────────────────────
  if (screen === "welcome") return (
    <div className="min-h-screen bg-[#faf9ff]" style={SANS}>
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-[#ede9fe]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <span className="text-sm text-[#6d6b8a]" style={BODY}>Personalized Learning Platform</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-[#ede9fe] text-[#5b21b6] text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
          <Star size={10} /> AI-Powered Personalized Learning
        </div>
        <h1 className="text-5xl font-extrabold text-[#1e1b4b] leading-[1.1] mb-4">
          Your learning path,<br />
          <span className="text-[#7c3aed]">built around you.</span>
        </h1>
        <p className="text-[#6d6b8a] text-lg leading-relaxed mb-8 max-w-xl" style={BODY}>
          Choose your field, take a 5-minute skill assessment, and receive a fully
          personalized roadmap — from beginner to advanced.
        </p>
        <div className="flex items-center gap-8 text-sm text-[#6d6b8a]" style={BODY}>
          {[["5 min", "Assessment"], ["6", "Fields to explore"], ["Weekly", "Progress reports"]].map(([v, l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <span className="font-bold text-[#1e1b4b] text-base" style={MONO}>{v}</span>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Field grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs font-bold text-[#6d6b8a] uppercase tracking-widest mb-5">Choose your field of interest</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {FIELDS.map(f => {
            const c = FIELD_COLORS[f.hue];
            const Icon = f.icon;
            const sel = fieldId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFieldId(f.id)}
                className={`text-left p-5 rounded-2xl border-2 bg-white transition-all duration-200 ${
                  sel
                    ? "border-[#5b21b6] shadow-xl shadow-[#5b21b6]/10"
                    : "border-[#ede9fe] hover:border-[#c4b5fd] hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                    <Icon size={20} style={{ color: c.dot }} />
                  </div>
                  {sel && <CheckCircle size={18} className="text-[#5b21b6]" />}
                </div>
                <div className="font-bold text-[#1e1b4b] mb-1">{f.label}</div>
                <div className="text-xs text-[#6d6b8a]" style={BODY}>{f.sub}</div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => fieldId && setScreen("assessment")}
            disabled={!fieldId}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all ${
              fieldId
                ? "bg-[#5b21b6] text-white hover:bg-[#4c1d95] shadow-lg shadow-[#5b21b6]/30"
                : "bg-[#e9e7f5] text-[#9d9bb8] cursor-not-allowed"
            }`}
          >
            Start Assessment <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  // ── Assessment ────────────────────────────────────────
  if (screen === "assessment") {
    const q = QUESTIONS[qIdx];
    return (
      <div className="min-h-screen bg-[#faf9ff] flex flex-col" style={SANS}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-[#ede9fe]">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#9d9bb8]" style={MONO}>{qIdx + 1} / {QUESTIONS.length}</span>
              <div className="w-32 h-1.5 bg-[#ede9fe] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7c3aed] rounded-full transition-all duration-500"
                  style={{ width: `${((qIdx + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: fc.bg, color: fc.text }}>
                {field.label}
              </span>
              <span className="text-[#9d9bb8] text-xs" style={BODY}>Skill Assessment</span>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-3xl border border-[#ede9fe] p-8 mb-5 shadow-sm">
              <span className="text-xs font-bold text-[#9d9bb8] uppercase tracking-widest block mb-4" style={MONO}>
                Question {qIdx + 1}
              </span>
              <p className="text-xl font-bold text-[#1e1b4b] leading-relaxed mb-8">{q.q}</p>
              <div className="space-y-3">
                {q.opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setPicked(i)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${
                      picked === i
                        ? "border-[#7c3aed] bg-[#f5f3ff] text-[#4c1d95]"
                        : "border-[#ede9fe] text-[#3d3b5a] hover:border-[#c4b5fd] bg-white"
                    }`}
                    style={BODY}
                  >
                    <span
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-bold"
                      style={{
                        background: picked === i ? "#7c3aed" : "#f0effe",
                        color: picked === i ? "#fff" : "#7c3aed",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-[#9d9bb8]" style={BODY}>Select an answer to continue</span>
              <button
                onClick={handleNext}
                disabled={picked === null}
                className={`flex items-center gap-2 px-7 py-3 rounded-full font-bold text-sm transition-all ${
                  picked !== null
                    ? "bg-[#5b21b6] text-white hover:bg-[#4c1d95]"
                    : "bg-[#e9e7f5] text-[#9d9bb8] cursor-not-allowed"
                }`}
              >
                {qIdx < QUESTIONS.length - 1 ? "Next Question" : "Submit & See Results"}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Result ────────────────────────────────────────────
  if (screen === "result") {
    const resultLvl = LEVEL_META[level];
    const resultMods = ROADMAP[level];
    return (
      <div className="min-h-screen bg-[#faf9ff] flex flex-col items-center justify-center px-6 py-16" style={SANS}>
        <div className="w-full max-w-lg text-center">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: resultLvl.bg }}>
            <Trophy size={36} style={{ color: resultLvl.color }} />
          </div>
          <p className="text-sm text-[#9d9bb8] mb-2" style={MONO}>Assessment Complete</p>
          <h1 className="text-4xl font-extrabold text-[#1e1b4b] mb-1">You&apos;re an</h1>
          <div className="text-5xl font-extrabold mb-4" style={{ color: resultLvl.color }}>{resultLvl.label}</div>
          <p className="text-[#6d6b8a] mb-8 leading-relaxed max-w-sm mx-auto" style={BODY}>{resultLvl.tagline}</p>

          {/* Plan preview */}
          <div className="bg-white rounded-2xl border border-[#ede9fe] p-6 mb-8 text-left">
            <h3 className="font-bold text-[#1e1b4b] mb-4">Your Personalized Plan</h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Duration",  value: `${resultLvl.weeks}w` },
                { label: "Field",     value: field.label.split(" ")[0] },
                { label: "Modules",   value: `${resultMods.length * 3}+` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-[#faf9ff]">
                  <div className="font-bold text-[#1e1b4b] text-xl" style={MONO}>{value}</div>
                  <div className="text-xs text-[#6d6b8a]">{label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2.5">
              {resultMods.slice(0, 3).map(m => (
                <div key={m.week} className="flex items-center gap-3 text-sm">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: resultLvl.bg, color: resultLvl.color }}
                  >
                    {m.week}
                  </div>
                  <span className="font-medium text-[#1e1b4b] flex-1">{m.title}</span>
                  <span className="text-[#9d9bb8] text-xs" style={MONO}>+{m.xp} XP</span>
                </div>
              ))}
              {resultMods.length > 3 && (
                <p className="text-xs text-[#9d9bb8] pl-9">+ {resultMods.length - 3} more modules…</p>
              )}
            </div>
          </div>

          <button
            onClick={() => setScreen("dashboard")}
            className="w-full py-4 rounded-2xl bg-[#5b21b6] text-white font-bold text-lg hover:bg-[#4c1d95] transition-colors shadow-lg shadow-[#5b21b6]/20 flex items-center justify-center gap-2"
          >
            Enter My Dashboard <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────
  const FieldIcon = field.icon;

  return (
    <div className="min-h-screen bg-[#faf9ff] flex" style={SANS}>
      {/* Sidebar */}
      <aside className="w-60 bg-[#1e1b4b] flex flex-col py-6 sticky top-0 h-screen flex-shrink-0">
        <div className="px-5 mb-8">
          <Logo light />
          {/* Student card */}
          <div className="bg-[#2d2963] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {studentName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-bold truncate">{studentName}</div>
                <div className="text-[#9d9bb8] text-xs truncate">{field.label}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-[#1e1b4b] rounded-full overflow-hidden">
                <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: "43%" }} />
              </div>
              <span className="text-[#9d9bb8] text-xs flex-shrink-0" style={MONO}>{earnedXP} XP</span>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {([
            { id: "roadmap"      as TabId, label: "My Roadmap",    icon: Map      },
            { id: "materials"    as TabId, label: "Materials",      icon: BookOpen },
            { id: "achievements" as TabId, label: "Achievements",   icon: Award    },
            { id: "report"       as TabId, label: "Weekly Report",  icon: BarChart2 },
          ]).map(({ id, label, icon: NavIcon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                tab === id
                  ? "bg-[#7c3aed] text-white"
                  : "text-[#9d9bb8] hover:text-white hover:bg-[#2d2963]"
              }`}
            >
              <NavIcon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Level badge */}
        <div className="px-5 mt-4">
          <div className="p-3 rounded-xl bg-[#2d2963]">
            <div className="text-[#9d9bb8] text-xs mb-0.5">Your Level</div>
            <div className="font-extrabold text-lg" style={{ color: lvl.color }}>{lvl.label}</div>
            <div className="text-[#9d9bb8] text-xs">{lvl.weeks}-week program</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#ede9fe] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-[#1e1b4b] text-lg">
              {tab === "roadmap"      && "My Course Roadmap"}
              {tab === "materials"    && "Learning Materials"}
              {tab === "achievements" && "Achievements & Certificates"}
              {tab === "report"       && "Weekly Progress Report"}
            </h1>
            <p className="text-xs text-[#6d6b8a]" style={BODY}>
              {field.label} · {lvl.label} Track · Week 3 of {lvl.weeks}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed] hover:bg-[#ede9fe] transition-colors">
              <Bell size={16} />
            </button>
            <div className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-xs font-bold">
              {studentName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="px-8 py-8">

          {/* ── Roadmap ── */}
          {tab === "roadmap" && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Current Week",    value: "3",                                              icon: Clock,        color: "#7c3aed", bg: "#f5f3ff"  },
                  { label: "XP Earned",       value: `${earnedXP}`,                                   icon: Zap,          color: "#f59e0b", bg: "#fffbeb"  },
                  { label: "Modules Done",    value: `${mods.filter(m => m.status === "done").length}/${mods.length}`, icon: CheckCircle, color: "#10b981", bg: "#ecfdf5" },
                  { label: "Next Assessment", value: "3 days",                                         icon: Target,       color: "#06b6d4", bg: "#ecfeff"  },
                ].map(({ label, value, icon: Ico, color, bg }) => (
                  <div key={label} className="bg-white rounded-2xl border border-[#ede9fe] p-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                      <Ico size={18} style={{ color }} />
                    </div>
                    <div className="font-extrabold text-2xl text-[#1e1b4b] mb-0.5" style={MONO}>{value}</div>
                    <div className="text-xs text-[#6d6b8a]">{label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[#ede9fe] p-7">
                <h2 className="font-bold text-[#1e1b4b] mb-6">
                  Course Roadmap — <span style={{ color: lvl.color }}>{lvl.label}</span> Track
                </h2>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-[#ede9fe]" />
                  <div className="space-y-5">
                    {mods.map(mod => (
                      <div key={mod.week} className="flex gap-5">
                        {/* Status dot */}
                        <div
                          className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center z-10 border-4 border-white shadow-sm ${
                            mod.status === "done"    ? "bg-[#10b981]" :
                            mod.status === "current" ? "bg-[#7c3aed]" : "bg-[#e9e7f5]"
                          }`}
                        >
                          {mod.status === "done"    ? <CheckCircle size={16} className="text-white" /> :
                           mod.status === "current" ? <Play size={13} className="text-white ml-0.5" /> :
                           <Lock size={14} className="text-[#9d9bb8]" />}
                        </div>
                        {/* Card */}
                        <div
                          className={`flex-1 rounded-xl border p-4 transition-all ${
                            mod.status === "done"    ? "border-[#a7f3d0] bg-[#f0fdf9]" :
                            mod.status === "current" ? "border-[#c4b5fd] bg-white shadow-lg shadow-[#7c3aed]/8" :
                            "border-[#ede9fe] bg-white/50 opacity-55"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#9d9bb8]" style={MONO}>WEEK {mod.week}</span>
                              {mod.status === "done" && (
                                <span className="px-2 py-0.5 bg-[#d1fae5] text-[#065f46] text-xs rounded-full font-semibold">Complete</span>
                              )}
                              {mod.status === "current" && (
                                <span className="px-2 py-0.5 bg-[#7c3aed] text-white text-xs rounded-full font-semibold">In Progress</span>
                              )}
                            </div>
                            <span
                              className="text-xs font-bold"
                              style={{ ...MONO, color: mod.status === "locked" ? "#9d9bb8" : "#f59e0b" }}
                            >
                              +{mod.xp} XP
                            </span>
                          </div>
                          <div className="font-bold text-[#1e1b4b] mb-2.5">{mod.title}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {mod.topics.map(t => (
                              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#f0effe] text-[#7c3aed]">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Materials ── */}
          {tab === "materials" && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Completed",    value: "2", icon: CheckCircle, color: "#10b981", bg: "#ecfdf5" },
                  { label: "In Progress",  value: "2", icon: Clock,       color: "#f59e0b", bg: "#fffbeb" },
                  { label: "Not Started",  value: "2", icon: Target,      color: "#7c3aed", bg: "#f5f3ff" },
                ].map(({ label, value, icon: Ico, color, bg }) => (
                  <div key={label} className="bg-white rounded-2xl border border-[#ede9fe] p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                      <Ico size={18} style={{ color }} />
                    </div>
                    <div>
                      <div className="font-extrabold text-2xl text-[#1e1b4b]" style={MONO}>{value}</div>
                      <div className="text-xs text-[#6d6b8a]">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {MATERIALS.map((mat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-[#ede9fe] p-5 flex gap-4 items-center hover:border-[#c4b5fd] transition-colors group"
                  >
                    {mat.type === "video" ? (
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-[#1e1b4b] flex-shrink-0 relative">
                        <img
                          src={`https://images.unsplash.com/${mat.img}?w=160&h=112&fit=crop&auto=format`}
                          alt={mat.title}
                          className="w-full h-full object-cover opacity-75"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                            <Play size={11} className="text-[#5b21b6] ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : mat.type === "article" ? (
                      <div className="w-20 h-14 rounded-xl bg-[#f5f3ff] flex items-center justify-center flex-shrink-0">
                        <FileText size={22} className="text-[#7c3aed]" />
                      </div>
                    ) : (
                      <div className="w-20 h-14 rounded-xl bg-[#fffbeb] flex items-center justify-center flex-shrink-0">
                        <Code2 size={22} className="text-[#f59e0b]" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#1e1b4b] text-sm mb-1 group-hover:text-[#5b21b6] transition-colors truncate">
                        {mat.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6d6b8a]" style={BODY}>
                        <span className="capitalize">{mat.type}</span>
                        <span>·</span>
                        <span>{mat.meta}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-[#6d6b8a] mb-1.5">
                        {mat.progress === 100 ? "Complete" : mat.progress > 0 ? `${mat.progress}%` : "Not started"}
                      </div>
                      <div className="w-20 h-1.5 bg-[#ede9fe] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${mat.progress}%`,
                            background: mat.progress === 100 ? "#10b981" : "#7c3aed",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className={`ml-2 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        mat.progress === 100
                          ? "bg-[#ecfdf5] text-[#10b981]"
                          : "bg-[#f5f3ff] text-[#7c3aed] hover:bg-[#ede9fe]"
                      }`}
                    >
                      {mat.progress === 100 ? <CheckCircle size={16} /> : <Play size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Achievements ── */}
          {tab === "achievements" && (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Certificates Earned", value: "2",         icon: Award,  color: "#f59e0b", bg: "#fffbeb" },
                  { label: "Total XP",             value: `${earnedXP}`, icon: Zap,    color: "#7c3aed", bg: "#f5f3ff" },
                  { label: "Skills Unlocked",      value: "9",         icon: Star,   color: "#10b981", bg: "#ecfdf5" },
                ].map(({ label, value, icon: Ico, color, bg }) => (
                  <div key={label} className="bg-white rounded-2xl border border-[#ede9fe] p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                      <Ico size={18} style={{ color }} />
                    </div>
                    <div>
                      <div className="font-extrabold text-2xl text-[#1e1b4b]" style={MONO}>{value}</div>
                      <div className="text-xs text-[#6d6b8a]">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CERTS.map((cert, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-6 relative overflow-hidden ${
                      cert.earned
                        ? "bg-white border-[#ede9fe]"
                        : "bg-[#faf9ff] border-dashed border-[#c4b5fd]"
                    }`}
                  >
                    {cert.earned && (
                      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#f5f3ff] to-transparent pointer-events-none" />
                    )}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: cert.earned ? "#fffbeb" : "#f0effe" }}
                      >
                        {cert.earned
                          ? <Trophy size={24} className="text-[#f59e0b]" />
                          : <Lock size={24} className="text-[#c4b5fd]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#1e1b4b] mb-0.5">{cert.title}</div>
                        {cert.earned
                          ? <div className="text-xs text-[#6d6b8a]" style={MONO}>{cert.issued}</div>
                          : <div className="text-xs text-[#9d9bb8]">Complete the module to unlock</div>}
                      </div>
                      {cert.earned && (
                        <div className="font-extrabold text-xl text-[#f59e0b]" style={MONO}>{cert.grade}</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cert.skills.map(s => (
                        <span
                          key={s}
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: cert.earned ? "#ede9fe" : "#f0effe",
                            color:      cert.earned ? "#5b21b6" : "#c4b5fd",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    {cert.earned && (
                      <button className="w-full py-2 rounded-xl border border-[#ede9fe] text-xs font-bold text-[#5b21b6] hover:bg-[#f5f3ff] transition-colors">
                        Download Certificate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Report ── */}
          {tab === "report" && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Avg Score",   value: "79%",  icon: TrendingUp,  color: "#7c3aed", bg: "#f5f3ff",  delta: "+11%" },
                  { label: "Study Hours", value: "32h",  icon: Clock,       color: "#06b6d4", bg: "#ecfeff",  delta: "+2.5h" },
                  { label: "Tasks Done",  value: "54",   icon: CheckCircle, color: "#10b981", bg: "#ecfdf5",  delta: "+8" },
                  { label: "Day Streak",  value: "14",   icon: Zap,         color: "#f59e0b", bg: "#fffbeb",  delta: "Best!" },
                ].map(({ label, value, icon: Ico, color, bg, delta }) => (
                  <div key={label} className="bg-white rounded-2xl border border-[#ede9fe] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                        <Ico size={16} style={{ color }} />
                      </div>
                      <span className="text-xs text-[#10b981] font-bold">{delta}</span>
                    </div>
                    <div className="font-extrabold text-2xl text-[#1e1b4b] mb-0.5" style={MONO}>{value}</div>
                    <div className="text-xs text-[#6d6b8a]">{label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Score trend */}
                <div className="col-span-2 bg-white rounded-2xl border border-[#ede9fe] p-6">
                  <h3 className="font-bold text-[#1e1b4b] mb-1">Assessment Score Trend</h3>
                  <p className="text-xs text-[#6d6b8a] mb-4" style={BODY}>6-week rolling average</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={WEEKLY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9d9bb8", fontFamily: "JetBrains Mono" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#9d9bb8", fontFamily: "JetBrains Mono" }} domain={[55, 100]} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: "1px solid #ede9fe", fontFamily: "Plus Jakarta Sans", fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#7c3aed"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Skill radar */}
                <div className="bg-white rounded-2xl border border-[#ede9fe] p-6">
                  <h3 className="font-bold text-[#1e1b4b] mb-1">Skill Profile</h3>
                  <p className="text-xs text-[#6d6b8a] mb-4" style={BODY}>Current week snapshot</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={RADAR_DATA} outerRadius="70%">
                      <PolarGrid stroke="#ede9fe" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "#9d9bb8", fontFamily: "JetBrains Mono" }} />
                      <Radar dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.18} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Study hours */}
              <div className="bg-white rounded-2xl border border-[#ede9fe] p-6">
                <h3 className="font-bold text-[#1e1b4b] mb-1">Weekly Study Hours</h3>
                <p className="text-xs text-[#6d6b8a] mb-4" style={BODY}>Target: 6h/week</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={WEEKLY_DATA} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9d9bb8", fontFamily: "JetBrains Mono" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#9d9bb8", fontFamily: "JetBrains Mono" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #ede9fe", fontFamily: "Plus Jakarta Sans", fontSize: 12 }}
                    />
                    <Bar dataKey="hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// ─── LoginScreen ─────────────────────────────────────────
function LoginScreen({
  onLogin,
  users,
}: {
  onLogin: (email: string, name: string) => void;
  users: { email: string; password: string; name: string }[];
}) {
  const [mode, setMode]         = useState<"login" | "signup">("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        const match = users.find(u => u.email === email && u.password === password);
        if (match) {
          onLogin(match.email, match.name);
        } else {
          setError("Invalid email or password. Try demo@learnpath.io / demo");
        }
      } else {
        if (!name.trim()) { setError("Please enter your full name."); return; }
        if (!email.includes("@")) { setError("Enter a valid email address."); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
        onLogin(email, name.trim());
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] flex" style={SANS}>
      {/* Left panel — branding */}
      <div className="hidden md:flex w-[46%] bg-[#1e1b4b] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#7c3aed]/20" />
        <div className="absolute bottom-10 -left-16 w-56 h-56 rounded-full bg-[#06b6d4]/15" />
        <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full bg-[#f59e0b]/10" />

        <Logo light />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#7c3aed]/30 text-[#c4b5fd] text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Zap size={10} /> Personalized Learning
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Learn at your<br />own pace, on<br />
            <span className="text-[#a78bfa]">your own path.</span>
          </h2>
          <p className="text-[#9d9bb8] leading-relaxed text-sm" style={BODY}>
            Take a skill assessment, get a custom roadmap, earn certificates — all tailored exactly to where you are right now.
          </p>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: Target,      text: "Personalized skill assessment" },
            { icon: Map,         text: "Custom course roadmap" },
            { icon: Award,       text: "Certificates & achievements" },
            { icon: BarChart2,   text: "Weekly progress monitoring" },
          ].map(({ icon: Ico, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#7c3aed]/30 flex items-center justify-center flex-shrink-0">
                <Ico size={14} className="text-[#a78bfa]" />
              </div>
              <span className="text-[#9d9bb8] text-sm" style={BODY}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Logo />
          </div>

          <h1 className="text-2xl font-extrabold text-[#1e1b4b] mb-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-[#6d6b8a] mb-8" style={BODY}>
            {mode === "login"
              ? "Sign in to continue your learning journey."
              : "Join LearnPath and start your personalized course."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-bold text-[#3d3b5a] mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9d9bb8]" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#ede9fe] bg-white text-[#1e1b4b] text-sm placeholder:text-[#c4b5fd] focus:outline-none focus:border-[#7c3aed] transition-colors"
                    style={BODY}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#3d3b5a] mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9d9bb8]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#ede9fe] bg-white text-[#1e1b4b] text-sm placeholder:text-[#c4b5fd] focus:outline-none focus:border-[#7c3aed] transition-colors"
                  style={BODY}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#3d3b5a] uppercase tracking-wide">
                  Password
                </label>
                {mode === "login" && (
                  <button type="button" className="text-xs text-[#7c3aed] font-semibold hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9d9bb8]" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border-2 border-[#ede9fe] bg-white text-[#1e1b4b] text-sm placeholder:text-[#c4b5fd] focus:outline-none focus:border-[#7c3aed] transition-colors"
                  style={BODY}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9d9bb8] hover:text-[#7c3aed] transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-[#f43f5e] bg-[#fff1f2] border border-[#fecdd3] rounded-xl px-4 py-3" style={BODY}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#5b21b6] text-white font-bold text-sm hover:bg-[#4c1d95] transition-colors shadow-lg shadow-[#5b21b6]/25 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Demo hint */}
          {mode === "login" && (
            <div className="mt-5 p-3 rounded-xl bg-[#f5f3ff] border border-[#ede9fe]">
              <p className="text-xs text-[#6d6b8a] mb-1 font-semibold" style={MONO}>Demo credentials</p>
              <p className="text-xs text-[#7c3aed]" style={MONO}>demo@learnpath.io / demo</p>
            </div>
          )}

          {/* Toggle mode */}
          <p className="text-center text-sm text-[#6d6b8a] mt-6" style={BODY}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="text-[#7c3aed] font-bold hover:underline"
            >
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Logo ─────────────────────────────────────────────────
function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center">
        <Zap size={13} className="text-white" />
      </div>
      <span
        className="font-extrabold"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: light ? "#ffffff" : "#1e1b4b" }}
      >
        LearnPath
      </span>
    </div>
  );
}
