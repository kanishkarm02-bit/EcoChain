import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Leaf, TrendingUp, Cpu, Coins, ShieldCheck, Map, Globe2, Database,
  Link as LinkIcon, CheckCircle2, ArrowRight, Building2, Factory,
  FileText, Lock, BookOpen, ArrowLeft, Share2, Trophy, Zap, Calculator,
  Terminal, Shield, Activity, Server, Bookmark
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- DATA ---
const SECTIONS = [
  { id: 'summary', label: 'Summary' },
  { id: 'problem', label: 'Problem & Solution' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'tokenomics', label: 'Tokenomics' },
  { id: 'compliance', label: 'Compliance' },
  { id: 'roadmap', label: 'Roadmap' },
];

const MODULES = [
  {
    id: 0, title: "The $300B Trade Gap", icon: Factory,
    content: "Southeast Asian SMEs often wait 60-90 days for large buyers to pay their invoices. This creates a massive $300 Billion 'trade finance gap' where small businesses are starved of cash flow, preventing them from growing or paying workers on time.",
    interactiveTitle: "Simulate SME Cashflow Risk",
    quizzes: [
      { q: "What is the primary cause of the trade finance gap for SMEs?", opts: ["Lack of raw materials", "60-90 day invoice payment terms", "High taxes"], a: 1 },
      { q: "What happens to SMEs waiting for payment?", opts: ["They grow faster", "They face bankruptcy risk", "They get tax breaks"], a: 1 }
    ]
  },
  {
    id: 1, title: "Intro to RWAs", icon: Coins,
    content: "Real World Assets (RWAs) involve taking physical assets—like real estate, gold, or in our case, unpaid invoices—and representing them as digital tokens on a blockchain. This allows them to be traded globally, instantly, and fractionally.",
    interactiveTitle: "Tokenize an Asset Pipeline",
    quizzes: [
      { q: "What does RWA stand for in Web3?", opts: ["Real World Assets", "Random Web Algorithms", "Risk Weighted Averages"], a: 0 },
      { q: "What is the benefit of tokenizing an invoice?", opts: ["It makes it heavier", "It allows global, instant, fractional trading", "It hides the invoice from the government"], a: 1 }
    ]
  },
  {
    id: 2, title: "The Green Invoice", icon: Leaf,
    content: "EcoChain specifically targets 'Green Invoices'. We reward suppliers who meet strict ESG (Environmental, Social, and Governance) standards. If a factory uses solar power, their invoice gets a better financing rate.",
    interactiveTitle: "Calculate ESG Score",
    quizzes: [
      { q: "How does EcoChain incentivize sustainable practices?", opts: ["By charging higher fees", "By offering better financing rates for ESG compliance", "By ignoring carbon footprints"], a: 1 },
      { q: "What does ESG stand for?", opts: ["Energy, Solar, Gas", "Environmental, Social, and Governance", "Electronic Signature Guarantee"], a: 1 }
    ]
  },
  {
    id: 3, title: "BNB Chain Scalability", icon: Zap,
    content: "To handle thousands of invoices globally, we need a fast network. BNB Chain provides high throughput (20,000+ TPS) and near-zero gas fees, making micro-financing economically viable.",
    interactiveTitle: "Network Stress Test",
    quizzes: [
      { q: "Why is high TPS (Transactions Per Second) important for EcoChain?", opts: ["To make the logo look cool", "To handle thousands of micro-transactions cheaply", "To slow down the network"], a: 1 },
      { q: "What is a key benefit of BNB Chain for this project?", opts: ["High gas fees", "Near-zero gas fees and high throughput", "It only supports Bitcoin"], a: 1 }
    ]
  },
  {
    id: 4, title: "Decentralized Storage", icon: Database,
    content: "ESG certifications and invoice documents must be tamper-proof to prevent 'greenwashing'. We use BNB Greenfield to store these documents decentrally, ensuring they can never be secretly altered.",
    interactiveTitle: "Shard & Distribute Document",
    quizzes: [
      { q: "What is BNB Greenfield used for in this architecture?", opts: ["Trading tokens", "Immutable, decentralized storage of ESG documents", "Sending emails"], a: 1 },
      { q: "Why is decentralized storage important for ESG?", opts: ["It prevents 'greenwashing' by making records tamper-proof", "It makes documents easier to delete", "It uses more electricity"], a: 0 }
    ]
  },
  {
    id: 5, title: "Oracles & Real Data", icon: LinkIcon,
    content: "How does the blockchain know a shipment actually arrived? We use Decentralized Oracles (like Chainlink) to fetch real-world shipping API data and customs clearances before releasing funds.",
    interactiveTitle: "Fetch Shipping Oracle Data",
    quizzes: [
      { q: "What is the role of an Oracle?", opts: ["To predict token prices", "To bring real-world data (like shipping status) onto the blockchain", "To store images"], a: 1 },
      { q: "Why do we need Oracles for supply chain finance?", opts: ["To verify physical shipments actually arrived before releasing funds", "To mine new coins", "To create a user interface"], a: 0 }
    ]
  },
  {
    id: 6, title: "Dual-Token Model", icon: Coins,
    content: "EcoChain uses two types of tokens: NFTs (ERC-721) represent the unique invoices themselves, while the $ECO utility token is used for governance, staking, and network verification.",
    interactiveTitle: "Fractionalize Invoice NFT",
    quizzes: [
      { q: "Which token standard is best suited for representing a unique invoice?", opts: ["ERC-20 (Fungible)", "ERC-721 (NFT)", "Stablecoins"], a: 1 },
      { q: "What is the $ECO token used for?", opts: ["Buying coffee", "Governance, staking, and network verification", "Paying taxes"], a: 1 }
    ]
  },
  {
    id: 7, title: "Stablecoin Settlement", icon: Calculator,
    content: "Institutional investors in Hong Kong don't want crypto volatility. Therefore, all invoice funding and yield payouts are settled in pegged stablecoins like FDUSD or HKD stablecoins.",
    interactiveTitle: "Project Yield Returns",
    quizzes: [
      { q: "Why are stablecoins used for settlement?", opts: ["To eliminate crypto price volatility for institutions", "Because they are highly volatile", "To increase transaction fees"], a: 0 },
      { q: "Which of these is an example of a stablecoin?", opts: ["Bitcoin (BTC)", "First Digital USD (FDUSD)", "Ethereum (ETH)"], a: 1 }
    ]
  },
  {
    id: 8, title: "zk-KYC Compliance", icon: ShieldCheck,
    content: "To comply with Hong Kong's strict regulations while maintaining privacy, we use Zero-Knowledge Proofs (zk-KYC). This proves a user is verified without revealing their actual sensitive data on-chain.",
    interactiveTitle: "Generate Zero-Knowledge Proof",
    quizzes: [
      { q: "What is the main benefit of zk-KYC?", opts: ["It makes transactions slower", "It proves compliance without revealing underlying private data", "It bypasses regulations"], a: 1 },
      { q: "What does 'Zero-Knowledge' mean in this context?", opts: ["The user knows nothing", "The verifier learns nothing about the data itself, only that the statement is true", "The system has zero data"], a: 1 }
    ]
  },
  {
    id: 9, title: "The EcoChain Vision", icon: Globe2,
    content: "By bridging Southeast Asian SMEs with Hong Kong capital, EcoChain aims to process $50M in Total Value Locked (TVL) by 2027, creating a fairer, greener global trade ecosystem.",
    interactiveTitle: "Deploy Protocol to Mainnet",
    quizzes: [
      { q: "What is EcoChain's ultimate goal?", opts: ["To create a fairer, greener global trade ecosystem", "To build a new social media app", "To mine Bitcoin"], a: 0 },
      { q: "What does TVL stand for?", opts: ["Total Value Locked", "Time Value Ledger", "Token Verification Limit"], a: 0 }
    ]
  }
];

// --- COMPONENTS ---
const CyberPanel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] rounded-2xl relative overflow-hidden ${className}`}>
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
    {children}
  </div>
);

const CyberButton = ({ onClick, disabled, children, active }: any) => (
  <button 
    onClick={onClick} disabled={disabled}
    className={`relative px-6 py-3 rounded-lg font-mono text-sm font-bold tracking-wider uppercase transition-all duration-300 overflow-hidden group
      ${disabled ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 
        active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 
        'bg-slate-900 text-cyan-500 border border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}
  >
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
    {children}
  </button>
);

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon: React.ElementType }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-12">
    <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
      <Icon className="w-8 h-8 text-cyan-400" />
    </div>
    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono tracking-tight">
      {children}
    </h2>
  </motion.div>
);

const InteractiveWidget = ({ module, onComplete }: { module: number, onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [val, setVal] = useState(0);

  // Reset state when module changes
  useEffect(() => { setStep(0); setVal(0); }, [module]);

  const complete = () => { setTimeout(onComplete, 800); };

  switch (module) {
    case 0: // Trade Gap
      return (
        <div className="space-y-6 font-mono">
          <div className="flex justify-between text-sm text-cyan-400"><span>Payment Delay: {val} Days</span><span>Risk: {val > 60 ? 'CRITICAL' : val > 30 ? 'HIGH' : 'LOW'}</span></div>
          <input type="range" min="0" max="90" value={val} onChange={(e) => {
            setVal(parseInt(e.target.value));
            if (parseInt(e.target.value) === 90 && step === 0) { setStep(1); complete(); }
          }} className="w-full accent-cyan-500" />
          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <motion.div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500" style={{ width: `${(val / 90) * 100}%` }} />
          </div>
          {step === 1 && <p className="text-cyan-400 text-xs animate-pulse">System Alert: SME Cashflow Depleted. Bankruptcy Risk Imminent.</p>}
        </div>
      );
    case 1: // RWAs
      return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <CyberButton disabled={step > 0} active={step === 0} onClick={() => setStep(1)}>1. Verify Asset</CyberButton>
          <ArrowRight className={`w-6 h-6 ${step >= 1 ? 'text-cyan-400' : 'text-slate-700'}`} />
          <CyberButton disabled={step !== 1} active={step === 1} onClick={() => setStep(2)}>2. Hash Data</CyberButton>
          <ArrowRight className={`w-6 h-6 ${step >= 2 ? 'text-cyan-400' : 'text-slate-700'}`} />
          <CyberButton disabled={step !== 2} active={step === 2} onClick={() => { setStep(3); complete(); }}>3. Mint NFT</CyberButton>
        </div>
      );
    case 2: // Green Invoice
      return (
        <div className="space-y-6 font-mono">
          <div className="flex gap-4 justify-center">
            {['Solar Energy', 'Fair Trade', 'Carbon Offset'].map((item, i) => (
              <button key={i} onClick={() => {
                const newVal = val ^ (1 << i);
                setVal(newVal);
                if (newVal === 7 && step === 0) { setStep(1); complete(); }
              }} className={`px-4 py-2 rounded border text-xs transition-all ${val & (1 << i) ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">ESG Score: <span className="text-white">{[0,33,33,66,33,66,66,100][val]} / 100</span></span>
            <span className="text-slate-400">Interest Rate: <span className="text-emerald-400 font-bold">{[12,10,10,8,10,8,8,5][val]}%</span></span>
          </div>
        </div>
      );
    case 3: // BNB Chain
      return (
        <div className="space-y-6 font-mono">
          <div>
            <div className="flex justify-between text-xs mb-2"><span className="text-slate-400">Legacy Bank (15 TPS)</span><span>{step === 1 ? 'Processing...' : 'Idle'}</span></div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><motion.div animate={{ width: step === 1 ? '15%' : '0%' }} transition={{ duration: 2 }} className="h-full bg-slate-500" /></div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2"><span className="text-cyan-400">BNB Chain (20,000+ TPS)</span><span>{step === 1 ? 'Complete!' : 'Idle'}</span></div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><motion.div animate={{ width: step === 1 ? '100%' : '0%' }} transition={{ duration: 0.2 }} className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" /></div>
          </div>
          <CyberButton active={step === 0} disabled={step === 1} onClick={() => { setStep(1); complete(); }}>Run 10,000 TX Benchmark</CyberButton>
        </div>
      );
    case 4: // Greenfield
      return (
        <div className="flex flex-col items-center gap-6 font-mono">
          <div className="flex gap-2">
            {[0,1,2].map(i => (
              <motion.div key={i} animate={step > 0 ? { y: [0, -20, 0], opacity: [0.5, 1, 0.5] } : {}} transition={{ repeat: Infinity, delay: i * 0.2 }} className={`w-16 h-20 border rounded flex items-center justify-center ${step > 0 ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>
                Shard {i+1}
              </motion.div>
            ))}
          </div>
          <CyberButton active={step === 0} disabled={step === 1} onClick={() => { setStep(1); complete(); }}>Shard & Distribute Document</CyberButton>
        </div>
      );
    case 5: // Oracles
      return (
        <div className="space-y-4 font-mono">
          <div className="bg-black p-4 rounded-lg border border-slate-800 text-xs text-green-400 h-32 overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />
            {step === 0 ? '> AWAITING COMMAND...' : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {`> CONNECTING TO CHAINLINK NODE...\n> FETCHING API: api.maersk.com/track/123\n> RESPONSE: { "status": "DELIVERED", "port": "HKG" }\n> VERIFYING SIGNATURE...\n> SMART CONTRACT TRIGGERED: FUNDS RELEASED`}
              </motion.div>
            )}
          </div>
          <CyberButton active={step === 0} disabled={step === 1} onClick={() => { setStep(1); complete(); }}>Fetch Shipping Data</CyberButton>
        </div>
      );
    case 6: // Fractionalize
      return (
        <div className="space-y-6 font-mono">
          <div className="flex justify-between text-sm text-cyan-400"><span>1 NFT Invoice</span><span>{val || 1} ERC-20 Fractions</span></div>
          <input type="range" min="1" max="1000" value={val} onChange={(e) => {
            setVal(parseInt(e.target.value));
            if (parseInt(e.target.value) === 1000 && step === 0) { setStep(1); complete(); }
          }} className="w-full accent-cyan-500" />
          <div className="flex flex-wrap gap-1 justify-center h-20 overflow-hidden">
            {Array.from({ length: Math.min(val || 1, 200) }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-cyan-500 rounded-sm shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
            ))}
          </div>
        </div>
      );
    case 7: // Yield
      const chartData = Array.from({ length: 12 }).map((_, i) => {
        const month = i + 1;
        const yieldAmount = (val || 0) * (1 + (0.08 / 12) * month);
        return { month: `M${month}`, value: Math.round(yieldAmount) };
      });

      return (
        <div className="space-y-6 font-mono">
          <div className="flex gap-4">
            <input type="number" placeholder="Investment (FDUSD)" value={val || ''} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-full text-white focus:border-cyan-500 outline-none" onChange={(e) => setVal(Number(e.target.value))} />
            <CyberButton active={step === 0} disabled={step === 1 || val <= 0} onClick={() => { setStep(1); complete(); }}>Confirm</CyberButton>
          </div>
          <div className="h-48 w-full border border-slate-800 rounded-xl p-4 bg-slate-900/50">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} width={60} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#22d3ee' }}
                  formatter={(value: number) => [`$${value}`, 'Projected']}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-slate-500">12 Month Projected Yield (8% APY)</div>
        </div>
      );
    case 8: // zk-Proof
      return (
        <div className="flex flex-col items-center gap-6 font-mono">
          <div className="flex items-center gap-8 w-full justify-center">
            <div className="p-4 bg-slate-800 rounded-lg text-xs text-slate-400 border border-slate-700">Prover (SME)<br/>ID: 12345<br/>Rev: $1M</div>
            <motion.div animate={step === 1 ? { x: [0, 50, 0], opacity: [1, 0, 1] } : {}} transition={{ duration: 1 }} className="text-cyan-400">
              <Shield className="w-8 h-8" />
            </motion.div>
            <div className={`p-4 rounded-lg text-xs border ${step === 1 ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>Verifier (Bank)<br/>Proof: {step === 1 ? 'VALID' : 'WAITING'}<br/>Data: HIDDEN</div>
          </div>
          <CyberButton active={step === 0} disabled={step === 1} onClick={() => { setStep(1); complete(); }}>Generate & Verify zk-Proof</CyberButton>
        </div>
      );
    case 9: // Deploy
      return (
        <div className="flex flex-col items-center gap-6 font-mono">
          <motion.div animate={step === 1 ? { scale: [1, 1.2, 1], rotate: 360 } : {}} transition={{ duration: 1 }} className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${step === 1 ? 'border-cyan-400 bg-cyan-400/20 shadow-[0_0_30px_rgba(6,182,212,0.8)]' : 'border-slate-700 bg-slate-800'}`}>
            <Globe2 className={`w-12 h-12 ${step === 1 ? 'text-cyan-400' : 'text-slate-500'}`} />
          </motion.div>
          <CyberButton active={step === 0} disabled={step === 1} onClick={() => { setStep(1); complete(); }}>Deploy Protocol to Mainnet</CyberButton>
        </div>
      );
    default: return null;
  }
};

// --- VIEWS ---
const PresentationView = ({ onStartLearning }: { onStartLearning: () => void }) => {
  const [activeSection, setActiveSection] = useState('summary');

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 relative">
      <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 scanlines" />

      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('summary')}>
            <Leaf className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold text-white tracking-tight font-mono">EcoChain <span className="text-cyan-400">RWA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-full border border-cyan-500/20">
            {SECTIONS.map((section) => (
              <button key={section.id} onClick={() => scrollTo(section.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 font-mono ${activeSection === section.id ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-32 relative z-10">
        {/* 1. SUMMARY */}
        <section id="summary" className="min-h-[70vh] flex flex-col justify-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10" />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono mb-8 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(6,182,212,1)]" /> SYSTEM ONLINE • HK WEB3 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-4 tracking-tight font-mono">
              The Protocol for <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">Sustainable Trade.</span>
            </h1>
            <h2 className="text-xl md:text-3xl font-bold text-cyan-300 mb-8 font-mono italic">
              Green invoices paid fast, stable yields built to last.
            </h2>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mb-12">
              Welcome to the EcoChain interactive simulation. Discover how we tokenize real-world assets (RWAs) on the BNB Chain to solve the $300B trade finance gap—providing instant liquidity to SMEs and secure, ESG-compliant returns for investors.
            </p>
            <CyberButton onClick={() => scrollTo('problem')} active={true}>
              <span className="flex items-center gap-2">Initialize Protocol <ArrowRight className="w-5 h-5" /></span>
            </CyberButton>
          </motion.div>
        </section>

        {/* 2. PROBLEM */}
        <section id="problem" className="scroll-mt-32">
          <SectionHeading icon={TrendingUp}>The Liquidity Gap</SectionHeading>
          <div className="grid md:grid-cols-2 gap-8">
            <CyberPanel className="p-8 border-red-500/30 shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-mono"><span className="text-red-400">ERROR: System Inefficient</span></h3>
              <ul className="space-y-6">
                <li className="flex gap-4"><div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20"><Factory className="w-6 h-6 text-red-400" /></div><div><h4 className="text-white font-semibold mb-1 font-mono">$300B Trade Gap</h4><p className="text-slate-400 text-sm">SMEs struggle with 60-90 day payment terms, crippling cash flow.</p></div></li>
                <li className="flex gap-4"><div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20"><Building2 className="w-6 h-6 text-red-400" /></div><div><h4 className="text-white font-semibold mb-1 font-mono">Capital Starvation</h4><p className="text-slate-400 text-sm">HK capital seeks yield but lacks verified ESG investment vehicles.</p></div></li>
              </ul>
            </CyberPanel>
            <CyberPanel className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 font-mono"><span className="text-cyan-400">SOLUTION: EcoChain</span></h3>
              <ul className="space-y-6">
                <li className="flex gap-4"><div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20"><FileText className="w-6 h-6 text-cyan-400" /></div><div><h4 className="text-white font-semibold mb-1 font-mono">Tokenized Invoices</h4><p className="text-slate-400 text-sm">We tokenize verified invoices into fractionalized, yield-bearing NFTs.</p></div></li>
                <li className="flex gap-4"><div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20"><Coins className="w-6 h-6 text-cyan-400" /></div><div><h4 className="text-white font-semibold mb-1 font-mono">Instant Liquidity</h4><p className="text-slate-400 text-sm">SMEs receive instant capital; investors earn low-risk yield.</p></div></li>
              </ul>
            </CyberPanel>
          </div>
        </section>

        {/* 3. ARCHITECTURE */}
        <section id="architecture" className="scroll-mt-32">
          <SectionHeading icon={Cpu}>Technical Architecture</SectionHeading>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe2, title: "BNB Chain", desc: "High-throughput (20k+ TPS) for micro-transactions and near-zero gas fees." },
              { icon: Database, title: "Greenfield", desc: "Immutable, decentralized storage for all ESG certifications and data." },
              { icon: LinkIcon, title: "Oracles", desc: "Integrating IoT APIs via Chainlink to verify real-world shipping data." }
            ].map((item, i) => (
              <CyberPanel key={i} className="p-8 hover:border-cyan-400 transition-colors group">
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all"><item.icon className="w-7 h-7 text-cyan-400" /></div>
                <h3 className="text-xl font-semibold text-white mb-3 font-mono">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </CyberPanel>
            ))}
          </div>
        </section>

        {/* 4. TOKENOMICS */}
        <section id="tokenomics" className="scroll-mt-32">
          <SectionHeading icon={Coins}>Dual-Token Model</SectionHeading>
          <CyberPanel className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30"><FileText className="w-6 h-6 text-blue-400" /></div><h3 className="text-2xl font-bold text-white font-mono">Invoice NFTs</h3></div>
                <p className="text-slate-400 mb-6">Each verified green invoice is minted as an ERC-721 NFT containing rich metadata: yield rate, maturity date, and ESG score.</p>
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-center justify-between mb-4 font-mono"><span className="text-slate-400">Settlement</span><span className="text-cyan-400 font-medium">Stablecoins (FDUSD)</span></div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6"><div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30"><Leaf className="w-6 h-6 text-emerald-400" /></div><h3 className="text-2xl font-bold text-white font-mono">$ECO Token</h3></div>
                <p className="text-slate-400 mb-6">The native utility and governance token powering the EcoChain ecosystem verification network.</p>
                <ul className="space-y-4">
                  {["Staking by suppliers for lower rates.", "Staking by auditors for network verification.", "Protocol governance."].map((text, i) => (
                    <li key={i} className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" /><span className="text-slate-300">{text}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </CyberPanel>
        </section>

        {/* 5. COMPLIANCE */}
        <section id="compliance" className="scroll-mt-32">
          <SectionHeading icon={ShieldCheck}>Regulatory Compliance</SectionHeading>
          <div className="grid md:grid-cols-2 gap-6">
            <CyberPanel className="p-8">
              <Building2 className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4 font-mono">HKMA & SFC Alignment</h3>
              <p className="text-slate-400 leading-relaxed">Fully compliant with the HKMA 2026 stablecoin licensing regime and SFC guidelines on tokenized securities.</p>
            </CyberPanel>
            <CyberPanel className="p-8">
              <Lock className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4 font-mono">zk-KYC & AML</h3>
              <p className="text-slate-400 leading-relaxed">Integrated institutional-grade KYC/KYB. We utilize Zero-Knowledge Proofs (zk-KYC) to maintain commercial privacy.</p>
            </CyberPanel>
          </div>
        </section>

        {/* 6. ROADMAP */}
        <section id="roadmap" className="scroll-mt-32">
          <SectionHeading icon={Map}>12-Month Roadmap</SectionHeading>
          <div className="max-w-3xl mx-auto mt-12">
            {[
              { quarter: "Q2 2026", title: "RWA Demo Day & MVP", items: ["Launch at HK Web3 Festival", "MVP on BNB Chain Testnet"] },
              { quarter: "Q3 2026", title: "Mainnet & Greenfield", items: ["Mainnet Launch", "BNB Greenfield integration"] },
              { quarter: "Q4 2026", title: "Institutional Onboarding", items: ["Integration with HK custodians", "zk-KYC compliance modules"] },
              { quarter: "Q1 2027", title: "Scale & Decentralization", items: ["Launch $ECO Utility Token", "Targeting $50M TVL"] }
            ].map((phase, i, arr) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-8 md:pl-0 mb-8 last:mb-0">
                <div className="md:hidden absolute left-0 top-2 w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                {i !== arr.length - 1 && <div className="md:hidden absolute left-1.5 top-5 w-px h-full bg-slate-800" />}
                <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                  <div className="md:col-span-1 md:text-right mb-2 md:mb-0 pt-1"><span className="text-cyan-400 font-bold text-lg font-mono">{phase.quarter}</span></div>
                  <div className="hidden md:flex flex-col items-center justify-center relative col-span-1 h-full pt-2">
                    <div className="w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] z-10" />
                    {i !== arr.length - 1 && <div className="absolute top-6 w-px h-[calc(100%+1rem)] bg-gradient-to-b from-cyan-500/50 to-transparent" />}
                  </div>
                  <CyberPanel className="md:col-span-3 p-6">
                    <h4 className="text-lg font-semibold text-white mb-4 font-mono">{phase.title}</h4>
                    <ul className="space-y-3">
                      {phase.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-sm text-slate-400"><CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" /><span className="leading-relaxed">{item}</span></li>
                      ))}
                    </ul>
                  </CyberPanel>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. CTA */}
        <section className="py-20 text-center border-t border-cyan-500/20 mt-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <h2 className="text-4xl font-bold text-white mb-6 font-mono">System Ready for Training</h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Engage with the interactive simulation modules to test your knowledge of the EcoChain protocol architecture.
          </p>
          <CyberButton onClick={onStartLearning} active={true}>
            <span className="flex items-center gap-2 text-lg px-4 py-2"><Terminal className="w-6 h-6" /> Start Simulation</span>
          </CyberButton>
        </section>
      </main>
    </div>
  );
};

const LearningView = ({ onBack }: { onBack: () => void }) => {
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [bookmarkedModules, setBookmarkedModules] = useState<number[]>([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  
  // Partial Progress State
  const [widgetsDone, setWidgetsDone] = useState<Record<number, boolean>>({});
  const [quizzesDone, setQuizzesDone] = useState<Record<number, number[]>>({});
  
  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [showError, setShowError] = useState(false);
  const [failedAnswerIdx, setFailedAnswerIdx] = useState<number | null>(null);

  const currentMod = MODULES[activeModule];
  const progress = (completedModules.length / MODULES.length) * 100;

  const isWidgetDone = widgetsDone[activeModule] || completedModules.includes(activeModule);
  const currentAnswers = completedModules.includes(activeModule) 
    ? currentMod.quizzes.map(q => q.a) 
    : (quizzesDone[activeModule] || []);

  useEffect(() => {
    const isCompleted = completedModules.includes(activeModule);
    const answers = quizzesDone[activeModule] || [];
    setCurrentQuizIdx(isCompleted ? MODULES[activeModule].quizzes.length - 1 : answers.length);
    setShowError(false);
    setFailedAnswerIdx(null);
  }, [activeModule]);

  const handleQuizAnswer = (selectedIdx: number) => {
    const currentQ = currentMod.quizzes[currentQuizIdx];
    if (selectedIdx === currentQ.a) {
      const newAnswers = [...(quizzesDone[activeModule] || []), selectedIdx];
      setQuizzesDone(prev => ({ ...prev, [activeModule]: newAnswers }));
      setShowError(false);
      setFailedAnswerIdx(null);
      
      if (currentQuizIdx < currentMod.quizzes.length - 1) {
        setTimeout(() => setCurrentQuizIdx(prev => prev + 1), 500);
      } else {
        if (!completedModules.includes(activeModule)) {
          setCompletedModules(prev => [...prev, activeModule]);
        }
      }
    } else {
      setFailedAnswerIdx(selectedIdx);
      setShowError(true);
    }
  };

  const handleRetry = () => {
    setFailedAnswerIdx(null);
    setShowError(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans flex flex-col md:flex-row relative">
      <div className="fixed inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="fixed inset-0 scanlines" />

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-80 bg-slate-900/80 backdrop-blur-xl border-r border-cyan-500/20 h-screen sticky top-0 p-6 overflow-y-auto z-20">
        <button onClick={onBack} className="flex items-center gap-2 text-cyan-500 hover:text-cyan-300 mb-8 transition-colors text-sm font-mono uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Terminate Sim
        </button>
        <div className="flex items-center gap-2 mb-8">
          <Terminal className="w-6 h-6 text-cyan-400" />
          <span className="text-xl font-bold text-white tracking-tight font-mono">EcoChain <span className="text-cyan-400">Sim</span></span>
        </div>
        <div className="mb-6 font-mono">
          <div className={`flex justify-between text-xs mb-2 ${progress === 100 ? 'text-emerald-400 font-bold' : 'text-cyan-400'}`}>
            <span>{progress === 100 ? 'System Complete' : 'System Progress'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-4">
            <motion.div className={`h-full ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]'}`} initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
          </div>
          <button 
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs transition-colors border ${showBookmarkedOnly ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-300'}`}
          >
            <Bookmark className="w-3 h-3" /> {showBookmarkedOnly ? 'Show All Modules' : 'Show Bookmarked Only'}
          </button>
        </div>
        <div className="space-y-2 flex-1">
          {MODULES.filter(mod => !showBookmarkedOnly || bookmarkedModules.includes(mod.id)).map((mod) => {
            const isCompleted = completedModules.includes(mod.id);
            const isActive = activeModule === mod.id;
            const isLocked = mod.id > 0 && !completedModules.includes(mod.id - 1) && !isCompleted;
            
            let modProgress = 0;
            if (isCompleted) {
              modProgress = 100;
            } else if (!isLocked) {
              const wDone = widgetsDone[mod.id] ? 1 : 0;
              const qDone = (quizzesDone[mod.id] || []).length;
              modProgress = (wDone * 50) + (qDone / mod.quizzes.length * 50);
            }

            return (
              <button key={mod.id} disabled={isLocked} onClick={() => setActiveModule(mod.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all font-mono ${isActive ? 'bg-cyan-500/20 border border-cyan-500/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.2)]' : isCompleted ? 'bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' : isLocked ? 'opacity-30 cursor-not-allowed border border-transparent' : 'hover:bg-white/5 border border-transparent'}`}>
                <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-cyan-500/20 text-cyan-400' : isCompleted ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-500'}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-4 h-4" /> : <mod.icon className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className={`text-xs font-bold tracking-wider ${isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : isLocked ? 'text-slate-500' : 'text-slate-300'}`}>MOD_{mod.id.toString().padStart(2, '0')}</div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setBookmarkedModules(prev => prev.includes(mod.id) ? prev.filter(id => id !== mod.id) : [...prev, mod.id]);
                        }}
                        className={`p-1 rounded hover:bg-white/10 transition-colors ${bookmarkedModules.includes(mod.id) ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
                      >
                        <Bookmark className="w-3 h-3" fill={bookmarkedModules.includes(mod.id) ? "currentColor" : "none"} />
                      </button>
                      {!isLocked && <span className={`text-[10px] ${isCompleted ? 'text-emerald-500' : 'text-cyan-500'}`}>{Math.round(modProgress)}%</span>}
                    </div>
                  </div>
                  <div className={`text-xs truncate ${isCompleted && !isActive ? 'text-emerald-500/70' : 'text-slate-400'}`}>{mod.title}</div>
                  {!isLocked && (
                    <div className="mt-2 h-1 w-full bg-slate-800/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${isCompleted ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${modProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-slate-900/90 backdrop-blur-xl border-b border-cyan-500/20 p-4 sticky top-0 z-50 font-mono">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-cyan-500"><ArrowLeft className="w-5 h-5" /></button>
          <span className={`text-xs font-bold ${progress === 100 ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {progress === 100 ? 'SIMULATION COMPLETE' : `SIM PROGRESS: ${completedModules.length}/10`}
          </span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div className={`h-full ${progress === 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-cyan-500'}`} animate={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto relative z-10">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeModule} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono tracking-wider mb-6 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  <Activity className="w-3 h-3" /> MODULE_{currentMod.id.toString().padStart(2, '0')}
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-mono uppercase">{currentMod.title}</h1>
                  {completedModules.includes(currentMod.id) && (
                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-full text-sm font-bold tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] self-start md:self-auto">
                      <CheckCircle2 className="w-4 h-4" /> COMPLETED
                    </motion.div>
                  )}
                </div>
                <p className="text-lg text-slate-400 leading-relaxed">{currentMod.content}</p>
              </div>

              <CyberPanel className="p-6 md:p-8">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2 font-mono"><Server className="w-4 h-4" /> Interactive Task: {currentMod.interactiveTitle}</h3>
                <InteractiveWidget module={currentMod.id} onComplete={() => setWidgetsDone(prev => ({ ...prev, [currentMod.id]: true }))} />
              </CyberPanel>

              <AnimatePresence>
                {isWidgetDone && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-900/60 backdrop-blur-md border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] rounded-2xl p-6 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 font-mono"><ShieldCheck className="w-4 h-4" /> Verification Required</h3>
                      <span className="text-xs font-mono text-slate-500">Q {currentQuizIdx + 1} / {currentMod.quizzes.length}</span>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div key={currentQuizIdx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                        <p className="text-lg text-white mb-6 font-mono">{currentMod.quizzes[currentQuizIdx].q}</p>
                        <div className="space-y-3 font-mono text-sm">
                          {currentMod.quizzes[currentQuizIdx].opts.map((opt, idx) => {
                            const isAnswered = currentAnswers.length > currentQuizIdx;
                            const isFailed = failedAnswerIdx !== null;
                            const isCorrect = idx === currentMod.quizzes[currentQuizIdx].a;
                            const isSelected = currentAnswers[currentQuizIdx] === idx || failedAnswerIdx === idx;
                            
                            let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";
                            if (isAnswered) {
                              if (isCorrect) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                              else if (isSelected) btnClass += "bg-red-500/20 border-red-500 text-red-300";
                              else btnClass += "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50";
                            } else if (isFailed) {
                              if (failedAnswerIdx === idx) btnClass += "bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]";
                              else btnClass += "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50";
                            } else {
                              btnClass += "bg-slate-900/80 border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300";
                            }
                            return <button key={idx} disabled={isAnswered || isFailed} onClick={() => handleQuizAnswer(idx)} className={btnClass}>[ {idx + 1} ] {opt}</button>;
                          })}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <AnimatePresence>
                      {failedAnswerIdx !== null && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 flex items-center justify-between overflow-hidden">
                          <p className="text-red-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                            <Shield className="w-4 h-4" /> Error: Invalid Response
                          </p>
                          <button onClick={handleRetry} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors">
                            Retry Question
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-8 border-t border-cyan-500/20 font-mono">
                <button onClick={() => { if (activeModule > 0) setActiveModule(activeModule - 1); }} disabled={activeModule === 0} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-cyan-400 disabled:opacity-30 disabled:hover:text-slate-500 transition uppercase text-sm font-bold tracking-wider"><ArrowLeft className="w-4 h-4" /> Prev</button>
                {activeModule === MODULES.length - 1 && completedModules.includes(activeModule) ? (
                  <CyberButton onClick={onBack} active={true}>
                    <span className="text-emerald-400 flex items-center gap-2"><Trophy className="w-4 h-4" /> Finish Sim</span>
                  </CyberButton>
                ) : (
                  <CyberButton onClick={() => { if (activeModule < MODULES.length - 1) setActiveModule(activeModule + 1); }} disabled={activeModule === MODULES.length - 1 || currentAnswers.length < currentMod.quizzes.length} active={currentAnswers.length === currentMod.quizzes.length}>
                    Next Mod <ArrowRight className="w-4 h-4 inline" />
                  </CyberButton>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [view, setView] = useState<'presentation' | 'learning'>('presentation');

  return (
    <AnimatePresence mode="wait">
      {view === 'presentation' ? (
        <motion.div key="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <PresentationView onStartLearning={() => { setView('learning'); window.scrollTo(0, 0); }} />
        </motion.div>
      ) : (
        <motion.div key="learning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LearningView onBack={() => { setView('presentation'); window.scrollTo(0, 0); }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
