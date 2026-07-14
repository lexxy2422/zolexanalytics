import { useState, useEffect, useRef } from "react";

const T = {
  bg0:"#060a0e", bg1:"#0b1017", bg2:"#101720", bg3:"#16202e",
  border:"#1c2e42", borderHi:"#274460",
  cyan:"#00d4ff", cyanDim:"#0077aa",
  green:"#00ff9d", amber:"#ffb300", red:"#ff3b5c", purple:"#bd5aff", orange:"#f46800",
  text:"#c4d6e8", textDim:"#4e708a", textBright:"#e6f2ff", gold:"#ffd700",
};

const useInterval = (fn, ms) => {
  const ref = useRef(fn);
  useEffect(() => { ref.current = fn; }, [fn]);
  useEffect(() => { const id = setInterval(() => ref.current(), ms); return () => clearInterval(id); }, [ms]);
};
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
const fmtExp  = v => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Rajdhani:wght@400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html,body{background:${T.bg0};color:${T.text};font-family:'Rajdhani',sans-serif;height:100%;overflow-x:hidden}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:${T.bg0}}
    ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px}
    ::-webkit-scrollbar-thumb:hover{background:${T.borderHi}}
    ::-webkit-scrollbar-corner{background:${T.bg0}}
    input::placeholder{color:${T.textDim}}
    input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px ${T.bg2} inset!important;-webkit-text-fill-color:${T.text}!important}
    textarea,select{color-scheme:dark}
    button{outline:none;font-family:'Rajdhani',sans-serif}
    a{color:${T.cyan};text-decoration:none}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
    @keyframes glow{0%,100%{box-shadow:0 0 4px ${T.cyan}33}50%{box-shadow:0 0 22px ${T.cyan}66}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
    @keyframes slideIn{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:none}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes scanline{0%{transform:translateX(-120%)}100%{transform:translateX(120vw)}}
    @keyframes checkmark{0%{stroke-dashoffset:50}100%{stroke-dashoffset:0}}
    @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
    @keyframes barRise{from{transform:scaleY(0)}to{transform:scaleY(1)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .fadeIn{animation:fadeIn .28s ease both}
    .slideUp{animation:slideUp .35s cubic-bezier(.16,1,.3,1) both}
    .slideIn{animation:slideIn .3s cubic-bezier(.16,1,.3,1) both}
    .cursor-blink::after{content:"█";animation:blink 1s step-end infinite;opacity:.7;font-size:.8em}
    .shimmer{background:linear-gradient(90deg,${T.bg2} 0%,${T.bg3} 50%,${T.bg2} 100%);background-size:200% 100%;animation:shimmer 1.8s infinite linear}
    select option{background:${T.bg2};color:${T.text}}
  `}</style>
);

const Card = ({ children, style, glow, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>onClick&&setHov(true)}
      onMouseLeave={()=>setHov(false)}
      style={{ background:T.bg1, border:`1px solid ${glow?T.cyanDim:hov?T.borderHi:T.border}`, borderRadius:8, padding:"18px 20px", animation:glow?"glow 3s ease infinite":"none", cursor:onClick?"pointer":"default", transition:"border-color .15s", ...style }}>
      {children}
    </div>
  );
};
const SectionHeader = ({ label, accent=T.cyan, action }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
    <div style={{ width:3, height:18, background:accent, borderRadius:2, flexShrink:0 }} />
    <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, textTransform:"uppercase", color:accent, flex:1 }}>{label}</span>
    {action && <div style={{ marginLeft:"auto" }}>{action}</div>}
  </div>
);
const Badge = ({ children, color=T.cyan }) => (
  <span style={{ background:color+"1a", border:`1px solid ${color}44`, color, borderRadius:3, padding:"2px 8px", fontSize:11, fontFamily:"'JetBrains Mono',monospace", fontWeight:500, whiteSpace:"nowrap" }}>{children}</span>
);
const StatusDot = ({ status }) => {
  const c={ok:T.green,warn:T.amber,critical:T.red,info:T.cyan};
  return <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:c[status]||T.textDim, marginRight:6, animation:status==="ok"?"pulse 2s infinite":"none" }} />;
};
const ProgressBar = ({ value, color=T.cyan, label }) => (
  <div style={{ marginBottom:8 }}>
    {label && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
      <span style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{label}</span>
      <span style={{ fontSize:12, color, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{value}%</span>
    </div>}
    <div style={{ background:T.bg3, borderRadius:2, height:4, overflow:"hidden" }}>
      <div style={{ width:`${Math.min(value,100)}%`, height:"100%", background:`linear-gradient(90deg,${color}88,${color})`, borderRadius:2, transition:"width .6s ease" }} />
    </div>
  </div>
);
const MetricCard = ({ label, value, unit, delta, color=T.cyan, icon, style:sx={} }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ flex:1, minWidth:130, background:T.bg1, border:`1px solid ${hov?color+"44":T.border}`, borderRadius:8, padding:"14px 16px", transition:"border-color .2s, box-shadow .2s", boxShadow:hov?`0 0 18px ${color}14`:"none", ...sx }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ fontSize:10, fontFamily:"'JetBrains Mono',monospace", color:T.textDim, letterSpacing:1 }}>{label}</span>
        <span style={{ fontSize:17, opacity:.65 }}>{icon}</span>
      </div>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color, lineHeight:1 }}>
        {value}<span style={{ fontSize:12, fontWeight:400, marginLeft:3, color:T.textDim }}>{unit}</span>
      </div>
      {delta!==undefined && (
        <div style={{ marginTop:6, fontSize:11, color:delta>=0?T.red:T.green, fontFamily:"'JetBrains Mono',monospace" }}>
          {delta>=0?"▲":"▼"} {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
};
const Sparkline = ({ data, color=T.cyan, height=40 }) => {
  const max=Math.max(...data,1), min=Math.min(...data,0);
  const pts=data.map((v,i)=>`${(i/(data.length-1))*100},${height-((v-min)/(max-min||1))*height}`).join(" ");
  return (<svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none">
    <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points={`0,${height} ${pts} 100,${height}`} fill={`${color}14`}/>
  </svg>);
};

const Input = ({ label, type="text", value, onChange, placeholder, icon, error, hint, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPass = type==="password";
  return (
    <div style={{ marginBottom:16 }}>
      {label && <div style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:6 }}>{label}</div>}
      <div style={{ position:"relative" }}>
        {icon && <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:focused?T.cyan:T.textDim, transition:"color .15s" }}>{icon}</span>}
        <input type={isPass&&!show?"password":isPass?"text":type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{ width:"100%", padding:`11px ${isPass?"40px":"14px"} 11px ${icon?"40px":"14px"}`, background:T.bg2, border:`1px solid ${error?T.red:focused?T.cyan:T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:13, outline:"none", transition:"border-color .15s" }} />
        {isPass && <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.textDim, fontSize:12 }}>{show?"◑":"○"}</button>}
      </div>
      {error && <div style={{ marginTop:5, fontSize:11, color:T.red, fontFamily:"'JetBrains Mono',monospace" }}>⚠ {error}</div>}
      {hint && !error && <div style={{ marginTop:5, fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{hint}</div>}
    </div>
  );
};

const Btn = ({ children, onClick, color=T.cyan, disabled, loading, variant="filled", style:sx={} }) => {
  const [hov, setHov] = useState(false);
  const filled = variant==="filled";
  return (
    <button onClick={onClick} disabled={disabled||loading}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ padding:"12px 24px", background:filled?(disabled||loading?T.bg3:hov?color+"dd":color):"transparent", border:`1px solid ${disabled?T.border:color}`, borderRadius:6, color:filled?(disabled||loading?T.textDim:"#000"):(hov?color:T.textDim), fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, letterSpacing:1, cursor:disabled||loading?"default":"pointer", transition:"all .15s", display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", ...sx }}>
      {loading?<><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Processing...</>:children}
    </button>
  );
};

const NAV_ITEMS = [
  { id:"dashboard",  label:"Dashboard",          icon:"◈" },
  { id:"__sec1__",   section:"SECURITY OPS" },
  { id:"cicd",       label:"CI/CD Pipeline",     icon:"⌬" },
  { id:"iac",        label:"Infrastructure",     icon:"⬡" },
  { id:"scanning",   label:"Security Scan",      icon:"◉" },
  { id:"vuln",       label:"Vulnerability Mgmt", icon:"◎" },
  { id:"cloud",      label:"Cloud Posture",      icon:"☁" },
  { id:"pentest",    label:"Pen Test",           icon:"🎯" },
  { id:"__sec2__",   section:"MONITORING" },
  { id:"siem",       label:"SIEM & Logs",        icon:"⟁", live:true },
  { id:"threat",     label:"Threat Hunt",        icon:"⊕" },
  { id:"incident",   label:"Incidents",          icon:"🚨", live:true },
  { id:"network",    label:"Network Map",        icon:"◫" },
  { id:"assets",     label:"Asset Inventory",    icon:"◧" },
  { id:"__sec3__",   section:"GOVERNANCE" },
  { id:"compliance", label:"Compliance",         icon:"❑" },
  { id:"risk",       label:"Risk Register",      icon:"⬡" },
  { id:"audit",      label:"Audit & Logging",    icon:"◧" },
  { id:"__sec4__",   section:"PLATFORM" },
  { id:"grafana",    label:"Grafana Plugin",     icon:"▣" },
  { id:"ai",         label:"AI Analyst",         icon:"✦", badge:"AI" },
  { id:"events",     label:"Live Events",        icon:"⟁", live:true },
  { id:"docker",     label:"Services",           icon:"🐳" },
  { id:"reports",    label:"Reports",            icon:"◧" },
  { id:"team",       label:"Team",               icon:"⊞" },
  { id:"devportal",  label:"Dev Portal",         icon:"⌬", badge:"API" },
  { id:"__sec5__",   section:"ACCOUNT" },
  { id:"billing",    label:"Billing & Plans",    icon:"◎" },
  { id:"settings",   label:"Settings",           icon:"⚙" },
  { id:"account",    label:"My Account",         icon:"⊗" },
];

const Sidebar = ({ active, setActive, wsStatus, user, onLogout }) => (
  <div style={{ width:224, minHeight:"100vh", background:T.bg1, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", position:"fixed", top:0, left:0, zIndex:100 }}>
    {/* Logo */}
    <div style={{ padding:"18px 20px 14px", borderBottom:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <img src="/logo.svg" alt="ZolexTech Security" style={{ width:36, height:36, filter:`drop-shadow(0 0 7px ${T.cyan}66)` }} />
        <div>
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:T.textBright, letterSpacing:1 }}>ZolexTech Security</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:T.cyanDim, letterSpacing:2 }}>v3.0 · Enterprise</div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ flex:1, padding:"8px 0", overflowY:"auto" }}>
      {NAV_ITEMS.map((item, idx) => {
        // Section header
        if (item.section) return (
          <div key={idx} style={{ padding:"10px 18px 4px", fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2, userSelect:"none" }}>
            {item.section}
          </div>
        );
        // Legacy divider or section id fallback
        if (!item.label) return <div key={idx} style={{ height:1, background:T.border, margin:"4px 12px" }} />;

        const isActive = active === item.id;
        const itemColor = item.id==="billing" ? (isActive?T.gold:T.amber) : item.id==="ai" ? (isActive?T.purple:T.textDim) : isActive?T.cyan:T.textDim;

        return (
          <button key={item.id} onClick={()=>setActive(item.id)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10, padding:"8px 18px",
            background:isActive?`${T.cyan}0f`:"transparent",
            borderLeft:isActive?`2px solid ${T.cyan}`:"2px solid transparent",
            border:"none", cursor:"pointer", color:itemColor,
            fontFamily:"'Rajdhani',sans-serif", fontWeight:isActive?700:500, fontSize:12.5, letterSpacing:.3,
            textAlign:"left", transition:"all .12s",
          }}
            onMouseEnter={e=>{ if(!isActive){e.currentTarget.style.background=T.bg2;e.currentTarget.style.color=T.text;} }}
            onMouseLeave={e=>{ if(!isActive){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.textDim;} }}>
            <span style={{ fontSize:13, width:17, flexShrink:0, opacity:isActive?1:.7 }}>{item.icon}</span>
            <span style={{ flex:1 }}>{item.label}</span>
            {item.badge==="AI" && <span style={{ fontSize:8, background:`${T.purple}22`, border:`1px solid ${T.purple}44`, color:T.purple, borderRadius:10, padding:"1px 5px", fontFamily:"'JetBrains Mono',monospace" }}>AI</span>}
            {item.badge==="API" && <span style={{ fontSize:8, background:`${T.orange}18`, border:`1px solid ${T.orange}44`, color:T.orange, borderRadius:10, padding:"1px 5px", fontFamily:"'JetBrains Mono',monospace" }}>API</span>}
            {item.live && <span style={{ width:5, height:5, borderRadius:"50%", background:T.green, animation:"pulse 2s infinite", display:"inline-block", flexShrink:0 }} />}
            {item.id==="billing" && !item.badge && <span style={{ fontSize:8, background:T.amber+"22", border:`1px solid ${T.amber}44`, color:T.amber, borderRadius:10, padding:"1px 5px", fontFamily:"'JetBrains Mono',monospace" }}>PRO</span>}
          </button>
        );
      })}
    </nav>

    {/* User footer */}
    <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
        <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${T.cyan},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#000", flexShrink:0 }}>{user?.name?.[0]||"A"}</div>
        <div style={{ overflow:"hidden", flex:1 }}>
          <div style={{ fontSize:11.5, color:T.textBright, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name||"Adebayo Paul Oke"}</div>
          <div style={{ fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{user?.role||"Security Engineer"} · Pro</div>
        </div>
      </div>
      {/* API usage bar */}
      <div style={{ marginBottom:8 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
          <span style={{ fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>API USAGE</span>
          <span style={{ fontSize:9, color:T.cyan, fontFamily:"'JetBrains Mono',monospace" }}>68%</span>
        </div>
        <div style={{ height:3, background:T.bg3, borderRadius:2 }}>
          <div style={{ width:"68%", height:"100%", background:`linear-gradient(90deg,${T.cyan},${T.purple})`, borderRadius:2 }}/>
        </div>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:8, alignItems:"center" }}>
        <div style={{ width:5, height:5, borderRadius:"50%", background:T.green, animation:"pulse 2s infinite", flexShrink:0 }} />
        <span style={{ fontSize:9, fontFamily:"'JetBrains Mono',monospace", color:T.textDim }}>WS: {wsStatus} · 1 P1 ACTIVE</span>
      </div>
      <button onClick={onLogout}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=T.red;e.currentTarget.style.color=T.red;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textDim;}}
        style={{ width:"100%", padding:"5px 0", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontSize:9, cursor:"pointer", letterSpacing:1, transition:"all .15s" }}>
        ⎋ SIGN OUT
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════
const LoginScreen = ({ onAuth }) => {
  const [mode, setMode]   = useState("login");
  const [loading, setLoading] = useState(false);
  const [done, setDone]   = useState(false);
  const [form, setForm]   = useState({ email:"", password:"", name:"", confirm:"", mfa:"" });
  const [errors, setErrors] = useState({});
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); };

  const validate = () => {
    const e={};
    if(!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email="Valid email required";
    if(mode!=="forgot" && form.password.length<8) e.password="Minimum 8 characters";
    if(mode==="signup"){ if(!form.name.trim()) e.name="Full name required"; if(form.confirm!==form.password) e.confirm="Passwords don't match"; }
    setErrors(e); return !Object.keys(e).length;
  };
  const handleSubmit = () => {
    if(!validate()) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); mode==="forgot"?setDone(true):setMode("mfa"); },1600);
  };
  const handleMFA = () => {
    if(form.mfa.length<6){ setErrors({mfa:"Enter 6-digit code"}); return; }
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onAuth({ name:form.name||"Adebayo Paul Oke", email:form.email||"adebayo@zolextech.com", plan:"Pro Plan", role:"Security Engineer" }); },1200);
  };

  const SOCIAL=[{label:"Continue with Google",icon:"G",color:"#ea4335"},{label:"Continue with Microsoft",icon:"M",color:"#00a4ef"},{label:"Continue with GitHub",icon:"⌥",color:"#aaa"}];
  const DEMO={email:"demo@zolextech.com",password:"Demo@2026!"};

  return (
    <div style={{ minHeight:"100vh", background:T.bg0, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <GlobalStyle />
      <div style={{ position:"fixed", inset:0, backgroundImage:`linear-gradient(${T.border}20 1px,transparent 1px),linear-gradient(90deg,${T.border}20 1px,transparent 1px)`, backgroundSize:"48px 48px", pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:"-15%", left:"-8%", width:"50vw", height:"50vw", borderRadius:"50%", background:`radial-gradient(circle,${T.cyan}07 0%,transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"fixed", bottom:"-15%", right:"-8%", width:"45vw", height:"45vw", borderRadius:"50%", background:`radial-gradient(circle,${T.purple}07 0%,transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"fixed", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg,transparent,${T.cyan}44,transparent)`, animation:"scanline 8s linear infinite", pointerEvents:"none" }} />

      <div style={{ display:"flex", width:"100%", maxWidth:980, minHeight:580, borderRadius:16, overflow:"hidden", border:`1px solid ${T.border}`, boxShadow:`0 0 80px ${T.cyan}0e`, position:"relative", zIndex:1 }}>
        {/* Hero panel */}
        <div style={{ flex:1, background:`linear-gradient(145deg,${T.bg1},${T.bg0})`, padding:"44px 40px", display:"flex", flexDirection:"column", justifyContent:"space-between", borderRight:`1px solid ${T.border}`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`radial-gradient(${T.cyan}06 1px,transparent 1px)`, backgroundSize:"26px 26px" }} />
          <div style={{ position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:36 }}>
              <img src="/logo.svg" alt="ZolexTech Security" style={{ width:48, height:48, filter:`drop-shadow(0 0 12px ${T.cyan}66)` }} />
              <div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.textBright, letterSpacing:2 }}>ZolexTech Security</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.cyanDim, letterSpacing:3 }}>PLATFORM v3.0</div>
              </div>
            </div>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:28, color:T.textBright, lineHeight:1.35, marginBottom:14 }}>
              Enterprise-Grade<br /><span style={{ color:T.cyan }}>Security Operations</span><br />in One Platform
            </div>
            <div style={{ fontSize:14, color:T.textDim, lineHeight:1.8, fontFamily:"'Rajdhani',sans-serif", marginBottom:28 }}>
              Unified security intelligence, CI/CD hardening, compliance automation, and real-time threat hunting — powered by ZolexTech Security.
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:32 }}>
              {["CI/CD Security","IaC Scanning","SOC 2","Threat Hunting","Grafana Plugin","JWT + 2FA"].map(f=>(
                <div key={f} style={{ padding:"5px 12px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:20, fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>✓ {f}</div>
              ))}
            </div>
          </div>
          <div style={{ position:"relative", display:"flex", gap:24 }}>
            {[{v:"99.98%",l:"Uptime"},{v:"4.2ms",l:"Latency"},{v:"SOC2",l:"Certified"},{v:"ISO 27001",l:"Compliant"}].map(s=>(
              <div key={s.l}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:15, fontWeight:700, color:T.cyan }}>{s.v}</div>
                <div style={{ fontSize:10, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Auth panel */}
        <div style={{ width:430, background:T.bg1, padding:"40px 38px", display:"flex", flexDirection:"column", justifyContent:"center" }}>

          {/* MFA */}
          {mode==="mfa" && (
            <div className="slideUp">
              <div style={{ textAlign:"center", marginBottom:24 }}>
                <div style={{ fontSize:44, marginBottom:10 }}>🔐</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.textBright, marginBottom:6 }}>Two-Factor Auth</div>
                <div style={{ fontSize:13, color:T.textDim }}>Enter the 6-digit code from your authenticator</div>
              </div>
              <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:20 }}>
                {[0,1,2,3,4,5].map(i=>(
                  <div key={i} style={{ width:44, height:52, borderRadius:8, border:`1.5px solid ${form.mfa[i]?T.cyan:T.border}`, background:T.bg2, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:T.cyan }}>
                    {form.mfa[i]||""}
                  </div>
                ))}
              </div>
              <input type="text" maxLength={6} value={form.mfa} onChange={e=>set("mfa",e.target.value.replace(/\D/g,""))} autoFocus
                style={{ width:"100%", padding:"10px 14px", background:T.bg0, border:`1px solid ${T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:18, textAlign:"center", letterSpacing:8, outline:"none", marginBottom:errors.mfa?4:14 }} />
              {errors.mfa && <div style={{ fontSize:11, color:T.red, textAlign:"center", marginBottom:10, fontFamily:"'JetBrains Mono',monospace" }}>⚠ {errors.mfa}</div>}
              <Btn onClick={handleMFA} loading={loading} color={T.cyan}>Verify Identity →</Btn>
              <div style={{ marginTop:14, padding:"10px 14px", background:T.bg0, borderRadius:6, border:`1px dashed ${T.amber}44`, textAlign:"center" }}>
                <span style={{ fontSize:11, color:T.amber, fontFamily:"'JetBrains Mono',monospace" }}>Demo: enter any 6 digits to continue</span>
              </div>
            </div>
          )}

          {/* Forgot done */}
          {mode==="forgot" && done && (
            <div className="slideUp" style={{ textAlign:"center" }}>
              <svg width="68" height="68" viewBox="0 0 68 68" style={{ margin:"0 auto 16px" }}>
                <circle cx="34" cy="34" r="31" fill="none" stroke={T.green} strokeWidth="2.5"/>
                <path d="M20 34l10 10 18-18" fill="none" stroke={T.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset="0"/>
              </svg>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.textBright, marginBottom:8 }}>Check Your Inbox</div>
              <div style={{ fontSize:13, color:T.textDim, marginBottom:24 }}>Recovery link sent to<br/><strong style={{ color:T.cyan }}>{form.email}</strong></div>
              <Btn onClick={()=>{setMode("login");setDone(false);}} color={T.cyan} variant="outline">← Back to Login</Btn>
            </div>
          )}

          {/* Main form */}
          {mode!=="mfa" && !done && (
            <div className="slideUp">
              {(mode==="login"||mode==="signup") && <div style={{ display:"flex", marginBottom:24, background:T.bg0, borderRadius:8, padding:3, border:`1px solid ${T.border}` }}>
                {["login","signup"].map(m=>(
                  <button key={m} onClick={()=>{setMode(m);setErrors({});}} style={{ flex:1, padding:"9px 0", borderRadius:6, border:"none", cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, letterSpacing:.5, background:mode===m?T.cyan:"transparent", color:mode===m?"#000":T.textDim, transition:"all .15s" }}>
                    {m==="login"?"Sign In":"Create Account"}
                  </button>
                ))}
              </div>}

              {mode==="login"  && <><div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.textBright, marginBottom:4 }}>Welcome back</div><div style={{ fontSize:13, color:T.textDim, marginBottom:22 }}>Sign in to your ZolexTech Security workspace</div></>}
              {mode==="signup" && <><div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.textBright, marginBottom:4 }}>Create account</div><div style={{ fontSize:13, color:T.textDim, marginBottom:22 }}>14-day free trial — no credit card required</div></>}
              {mode==="forgot" && <div style={{ textAlign:"center", marginBottom:24 }}>
                <div style={{ width:56, height:56, borderRadius:14, background:`linear-gradient(135deg,${T.cyan}22,${T.purple}22)`, border:`1.5px solid ${T.cyanDim}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 14px" }}>🔒</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.textBright, marginBottom:4 }}>Reset Password</div>
                <div style={{ fontSize:13, color:T.textDim }}>We&apos;ll send you a secure recovery link</div>
              </div>}

              {mode!=="forgot" && (
                <>
                  <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:18 }}>
                    {SOCIAL.map(s=>(
                      <button key={s.label} onClick={()=>onAuth({name:"Adebayo Paul Oke",email:"adebayo@zolextech.com",plan:"Pro Plan",role:"Security Engineer"})}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=s.color}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
                        style={{ width:"100%", padding:"10px 14px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.text, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"border-color .15s" }}>
                        <span style={{ width:22, height:22, borderRadius:4, background:s.color+"22", border:`1px solid ${s.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:s.color, fontWeight:700, flexShrink:0 }}>{s.icon}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                    <div style={{ flex:1, height:1, background:T.border }} />
                    <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>or email</span>
                    <div style={{ flex:1, height:1, background:T.border }} />
                  </div>
                </>
              )}

              {mode==="signup" && <Input label="FULL NAME" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Adebayo Paul Oke" icon="◎" error={errors.name} autoComplete="name" />}
              <Input label="EMAIL ADDRESS" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="you@zolextech.com" icon="@" error={errors.email} autoComplete="email" />
              {mode!=="forgot" && <Input label="PASSWORD" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="••••••••••" icon="🔑" error={errors.password} hint={mode==="signup"?"Min 8 chars, 1 uppercase, 1 number":""} autoComplete={mode==="login"?"current-password":"new-password"} />}
              {mode==="signup" && <Input label="CONFIRM PASSWORD" type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="••••••••••" icon="🔑" error={errors.confirm} autoComplete="new-password" />}

              {mode==="login" && <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16, marginTop:-8 }}>
                <button onClick={()=>{setMode("forgot");setErrors({});}} style={{ background:"none", border:"none", color:T.cyanDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}>Forgot password?</button>
              </div>}

              <Btn onClick={handleSubmit} loading={loading} color={T.cyan}>
                {mode==="login"?"Sign In →":mode==="signup"?"Create Account →":"Send Recovery Link →"}
              </Btn>

              {mode==="login" && <div style={{ marginTop:14, padding:"10px 14px", background:T.bg0, borderRadius:6, border:`1px dashed ${T.amber}44` }}>
                <div style={{ fontSize:11, color:T.amber, fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>⚡ DEMO CREDENTIALS</div>
                <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Email: {DEMO.email}</div>
                <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginBottom:6 }}>Pass: {DEMO.password}</div>
                <button onClick={()=>{set("email",DEMO.email);set("password",DEMO.password);}} style={{ background:"none", border:"none", color:T.amber, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:11, textDecoration:"underline" }}>Auto-fill credentials</button>
              </div>}

              {mode==="forgot" && <div style={{ textAlign:"center", marginTop:16 }}>
                <button onClick={()=>setMode("login")}
                  onMouseEnter={e=>e.currentTarget.style.color=T.cyan}
                  onMouseLeave={e=>e.currentTarget.style.color=T.textDim}
                  style={{ background:"none", border:"none", color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:1, transition:"color .15s" }}>← BACK TO SIGN IN</button>
              </div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BILLING VIEW
// ═══════════════════════════════════════════════════════════════════════
const BillingView = () => {
  const [tab, setTab]   = useState("plans");
  const [period, setPeriod] = useState("annual");
  const [sel, setSel]   = useState("pro");
  const [payStep, setPayStep] = useState("form");
  const [card, setCard] = useState({ number:"", name:"", exp:"", cvc:"", zip:"" });
  const [cardErr, setCardErr] = useState({});
  const [payLoad, setPayLoad] = useState(false);
  const [focused, setFocused] = useState(null);
  const setC = (k,v) => { setCard(c=>({...c,[k]:v})); setCardErr(e=>({...e,[k]:""})); };

  const PLANS = [
    { id:"starter", name:"Starter", icon:"◇", color:T.textDim,  monthly:49,  annual:39,
      features:["5 CI/CD pipelines","Basic SAST","SOC2 lite","Community support","1 workspace","5 GB storage"],
      limits:{pipelines:5,users:3,scans:"5/day"} },
    { id:"pro",     name:"Pro",     icon:"◈", color:T.cyan,     monthly:149, annual:119, popular:true,
      features:["Unlimited pipelines","SAST+DAST+SCA","SOC2 + ISO 27001","Priority support","5 workspaces","100 GB storage","Grafana integration","Threat hunting","Real-time WebSocket"],
      limits:{pipelines:"∞",users:25,scans:"∞"} },
    { id:"enterprise", name:"Enterprise", icon:"◆", color:T.purple, monthly:499, annual:399,
      features:["Everything in Pro","Azure Sentinel","Custom compliance","24/7 SOC support","Unlimited workspaces","1 TB storage","SLA 99.99%","Custom SSO/SAML","Audit logs + SIEM","On-prem option"],
      limits:{pipelines:"∞",users:"∞",scans:"∞"} },
  ];
  const INVOICES=[
    {id:"INV-2026-05",date:"Jun 1, 2026",plan:"Pro Plan",amount:"$119.00",status:"paid",period:"May 2026"},
    {id:"INV-2026-04",date:"May 1, 2026",plan:"Pro Plan",amount:"$119.00",status:"paid",period:"Apr 2026"},
    {id:"INV-2026-03",date:"Mar 1, 2026",plan:"Pro Plan",amount:"$119.00",status:"paid",period:"Mar 2026"},
    {id:"INV-2026-02",date:"Feb 1, 2026",plan:"Pro Plan",amount:"$119.00",status:"paid",period:"Feb 2026"},
    {id:"INV-2026-01",date:"Jan 1, 2026",plan:"Pro Plan",amount:"$119.00",status:"paid",period:"Jan 2026"},
    {id:"INV-2025-12",date:"Dec 1, 2025",plan:"Starter", amount:"$39.00", status:"paid",period:"Dec 2025"},
  ];
  const METHODS=[
    {id:"pm1",brand:"Visa",      last4:"4242",exp:"12/27",default:true},
    {id:"pm2",brand:"Mastercard",last4:"8210",exp:"08/26",default:false},
  ];

  const validateCard = () => {
    const e={};
    if(card.number.replace(/\s/g,"").length<16) e.number="Valid 16-digit number required";
    if(!card.name.trim()) e.name="Cardholder name required";
    if(!card.exp.match(/^\d{2}\/\d{2}$/)) e.exp="Format MM/YY";
    if(card.cvc.length<3) e.cvc="3–4 digits";
    if(card.zip.length<5) e.zip="ZIP code required";
    setCardErr(e); return !Object.keys(e).length;
  };
  const handlePay = () => {
    if(!validateCard()) return;
    setPayLoad(true); setPayStep("processing");
    setTimeout(()=>{ setPayLoad(false); setPayStep("success"); },2800);
  };

  const plan = PLANS.find(p=>p.id===sel);
  const price = period==="annual"?plan.annual:plan.monthly;
  const brand = () => {
    const n=card.number.replace(/\s/g,"");
    if(n[0]==="4") return {name:"VISA",color:"#1a1f71"};
    if(n[0]==="5") return {name:"MC",color:"#eb001b"};
    if(n[0]==="3") return {name:"AMEX",color:"#2671b2"};
    return {name:"CARD",color:T.border};
  };

  const TABS=["plans","payment","invoices","methods"];
  const TL={plans:"⬡ Plans",payment:"◎ Checkout",invoices:"❑ Invoices",methods:"◈ Cards"};

  return (
    <div className="fadeIn">
      <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="CURRENT PLAN"  value="Pro"   icon="◈" color={T.cyan} />
        <MetricCard label="NEXT BILLING"  value="Jul 1" icon="◎" color={T.amber} />
        <MetricCard label="TEAM SEATS"    value={8}     icon="⊗" color={T.green} />
        <MetricCard label="SPEND / MO"    value="$119"  icon="$" color={T.purple} />
      </div>

      <div style={{ display:"flex", marginBottom:18, borderBottom:`1px solid ${T.border}` }}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{ padding:"9px 20px", background:"transparent", borderBottom:tab===t?`2px solid ${T.gold}`:"2px solid transparent", border:"none", cursor:"pointer", color:tab===t?T.gold:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>{TL[t]}</button>)}
      </div>

      {/* PLANS */}
      {tab==="plans" && (
        <div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, marginBottom:26 }}>
            <span style={{ fontSize:13, color:period==="monthly"?T.textBright:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>Monthly</span>
            <div onClick={()=>setPeriod(p=>p==="monthly"?"annual":"monthly")} style={{ width:46, height:24, borderRadius:12, background:T.bg3, border:`1px solid ${T.border}`, cursor:"pointer", position:"relative" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:T.cyan, position:"absolute", top:2, left:period==="annual"?26:2, transition:"left .2s", boxShadow:`0 0 8px ${T.cyan}66` }} />
            </div>
            <span style={{ fontSize:13, color:period==="annual"?T.textBright:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>Annual</span>
            {period==="annual" && <Badge color={T.green}>Save 20%</Badge>}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:18 }}>
            {PLANS.map(p=>(
              <div key={p.id} onClick={()=>{setSel(p.id);setTab("payment");}}
                style={{ background:sel===p.id?`${p.color}0a`:T.bg1, border:`1.5px solid ${sel===p.id?p.color:T.border}`, borderRadius:10, padding:"24px 20px", cursor:"pointer", transition:"all .2s", position:"relative", transform:p.popular?"scale(1.03)":"none", boxShadow:p.popular?`0 0 28px ${T.cyan}14`:"none" }}>
                {p.popular && <div style={{ position:"absolute", top:-11, left:"50%", transform:"translateX(-50%)", background:T.cyan, color:"#000", fontSize:10, fontWeight:700, padding:"2px 14px", borderRadius:10, fontFamily:"'Rajdhani',sans-serif", letterSpacing:1, whiteSpace:"nowrap" }}>MOST POPULAR</div>}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <span style={{ fontSize:20, color:p.color }}>{p.icon}</span>
                  <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:19, color:T.textBright }}>{p.name}</span>
                </div>
                <div style={{ marginBottom:14 }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:34, fontWeight:700, color:p.color }}>${period==="annual"?p.annual:p.monthly}</span>
                  <span style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>/user/mo</span>
                </div>
                <div style={{ height:1, background:T.border, marginBottom:14 }} />
                {p.features.map(f=>(
                  <div key={f} style={{ display:"flex", gap:8, marginBottom:7 }}>
                    <span style={{ color:p.color, fontSize:12 }}>✓</span>
                    <span style={{ fontSize:12, color:T.text, fontFamily:"'Rajdhani',sans-serif" }}>{f}</span>
                  </div>
                ))}
                <div style={{ marginTop:14, padding:"8px 14px", background:sel===p.id?p.color:"transparent", border:`1px solid ${p.color}`, borderRadius:6, textAlign:"center", color:sel===p.id?"#000":p.color, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13 }}>
                  {sel===p.id?"✓ SELECTED":"SELECT PLAN →"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:"18px 24px", background:T.bg1, border:`1px solid ${T.purple}44`, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:16, color:T.textBright, marginBottom:3 }}>Need a custom enterprise contract?</div>
              <div style={{ fontSize:13, color:T.textDim }}>Volume discounts, dedicated infra, custom SLAs, and on-prem deployment available.</div>
            </div>
            <button style={{ padding:"10px 20px", background:`${T.purple}18`, border:`1px solid ${T.purple}`, borderRadius:6, color:T.purple, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", marginLeft:20 }}>Contact Sales →</button>
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {tab==="payment" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:18, alignItems:"start" }}>
          <Card>
            {payStep==="success" ? (
              <div className="slideUp" style={{ textAlign:"center", padding:"28px 0" }}>
                <svg width="72" height="72" viewBox="0 0 72 72" style={{ margin:"0 auto 16px" }}>
                  <circle cx="36" cy="36" r="32" fill={T.green+"18"} stroke={T.green} strokeWidth="2.5"/>
                  <path d="M22 36l10 10 18-18" fill="none" stroke={T.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:26, color:T.green, marginBottom:8 }}>Payment Successful!</div>
                <div style={{ fontSize:14, color:T.textDim, marginBottom:6 }}>Upgraded to <strong style={{ color:T.cyan }}>{plan.name} Plan</strong></div>
                <div style={{ fontSize:13, color:T.textDim, marginBottom:24 }}>Receipt sent to adebayo@zolextech.com</div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  <button onClick={()=>{setPayStep("form");setTab("invoices");}} style={{ padding:"10px 20px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.text, cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>View Invoice</button>
                  <button onClick={()=>{setPayStep("form");setTab("plans");}} style={{ padding:"10px 20px", background:T.cyan, border:"none", borderRadius:6, color:"#000", cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13 }}>Back to Plans</button>
                </div>
              </div>
            ) : payStep==="processing" ? (
              <div style={{ textAlign:"center", padding:"44px 0" }}>
                <div style={{ fontSize:50, animation:"spin 2s linear infinite", display:"inline-block", marginBottom:16 }}>⟳</div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:20, color:T.cyan, marginBottom:8 }}>Processing Payment</div>
                <div style={{ fontSize:13, color:T.textDim, marginBottom:20 }}>Securely charging via Stripe...</div>
                {["Verifying card details","Contacting payment network","Authorizing transaction","Activating plan features"].map((s,i)=>(
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:10, maxWidth:260, margin:"0 auto 8px", opacity:i<3?1:.4 }}>
                    <span style={{ color:i<3?T.green:T.textDim }}>{i<3?"✓":"○"}</span>
                    <span style={{ fontSize:12, color:i<3?T.text:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <SectionHeader label="Payment Details" accent={T.gold} />
                {/* Card visual */}
                <div style={{ marginBottom:22, padding:"20px 22px", background:`linear-gradient(135deg,${T.bg3},${T.bg2})`, borderRadius:12, border:`1px solid ${T.border}`, position:"relative", overflow:"hidden", minHeight:130 }}>
                  <div style={{ position:"absolute", top:-20, right:-20, width:90, height:90, borderRadius:"50%", background:T.cyan+"09" }} />
                  <div style={{ position:"absolute", bottom:-25, right:50, width:70, height:70, borderRadius:"50%", background:T.purple+"09" }} />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                    <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, color:T.cyan, letterSpacing:2 }}>ZOLEXTECH</div>
                    <div style={{ padding:"2px 8px", background:brand().color+"33", border:`1px solid ${brand().color}55`, borderRadius:3, fontSize:11, fontWeight:700, color:"#fff", fontFamily:"'JetBrains Mono',monospace" }}>{brand().name}</div>
                  </div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:17, color:T.textBright, letterSpacing:3, marginBottom:14 }}>
                    {card.number ? card.number.padEnd(19," ") : "•••• •••• •••• ••••"}
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div><div style={{ fontSize:9, color:T.textDim, letterSpacing:1, fontFamily:"'JetBrains Mono',monospace" }}>CARDHOLDER</div><div style={{ fontSize:12, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>{card.name||"YOUR NAME"}</div></div>
                    <div><div style={{ fontSize:9, color:T.textDim, letterSpacing:1, fontFamily:"'JetBrains Mono',monospace" }}>EXPIRES</div><div style={{ fontSize:12, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>{card.exp||"MM/YY"}</div></div>
                  </div>
                </div>

                {/* Card number */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:6 }}>CARD NUMBER</div>
                  <div style={{ position:"relative" }}>
                    <input value={card.number} onChange={e=>setC("number",fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" maxLength={19}
                      onFocus={()=>setFocused("number")} onBlur={()=>setFocused(null)}
                      style={{ width:"100%", padding:"11px 50px 11px 14px", background:T.bg2, border:`1px solid ${cardErr.number?T.red:focused==="number"?T.cyan:T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:14, letterSpacing:2, outline:"none" }} />
                    <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:11, fontWeight:700, color:brand().color, fontFamily:"'JetBrains Mono',monospace" }}>{brand().name}</span>
                  </div>
                  {cardErr.number && <div style={{ marginTop:4, fontSize:11, color:T.red, fontFamily:"'JetBrains Mono',monospace" }}>⚠ {cardErr.number}</div>}
                </div>

                {/* Name */}
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:6 }}>CARDHOLDER NAME</div>
                  <input value={card.name} onChange={e=>setC("name",e.target.value)} placeholder="Adebayo Paul Oke"
                    onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)}
                    style={{ width:"100%", padding:"11px 14px", background:T.bg2, border:`1px solid ${cardErr.name?T.red:focused==="name"?T.cyan:T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:13, outline:"none" }} />
                  {cardErr.name && <div style={{ marginTop:4, fontSize:11, color:T.red, fontFamily:"'JetBrains Mono',monospace" }}>⚠ {cardErr.name}</div>}
                </div>

                {/* Exp / CVC / ZIP */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
                  {[{k:"exp",ph:"MM/YY",lbl:"EXPIRY",max:5,fmt:fmtExp},{k:"cvc",ph:"CVV",lbl:"CVC",max:4},{k:"zip",ph:"30339",lbl:"ZIP CODE",max:10}].map(f=>(
                    <div key={f.k}>
                      <div style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:6 }}>{f.lbl}</div>
                      <input value={card[f.k]} onChange={e=>setC(f.k,f.fmt?f.fmt(e.target.value):e.target.value.replace(/\D/g,"").slice(0,f.max))} placeholder={f.ph} maxLength={f.max}
                        onFocus={()=>setFocused(f.k)} onBlur={()=>setFocused(null)}
                        style={{ width:"100%", padding:"11px 8px", background:T.bg2, border:`1px solid ${cardErr[f.k]?T.red:focused===f.k?T.cyan:T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:13, outline:"none", textAlign:"center", letterSpacing:f.k==="cvc"?4:1 }} />
                      {cardErr[f.k] && <div style={{ marginTop:3, fontSize:10, color:T.red, fontFamily:"'JetBrains Mono',monospace" }}>{cardErr[f.k]}</div>}
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                  {["🔒 SSL Encrypted","◈ PCI DSS v4","⚡ Powered by Stripe"].map(b=>(
                    <div key={b} style={{ padding:"4px 10px", background:T.bg0, border:`1px solid ${T.border}`, borderRadius:4, fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{b}</div>
                  ))}
                </div>
                <Btn onClick={handlePay} loading={payLoad} color={T.gold}>Pay ${price}.00 · Upgrade to {plan.name} →</Btn>
                <div style={{ marginTop:8, textAlign:"center", fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Cancel anytime · No setup fees · Instant activation</div>
              </>
            )}
          </Card>

          {/* Order summary sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Card>
              <SectionHeader label="Order Summary" accent={T.gold} />
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:`1px solid ${T.border}`, marginBottom:14 }}>
                <div style={{ width:40, height:40, borderRadius:8, background:plan.color+"16", border:`1px solid ${plan.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:plan.color }}>{plan.icon}</div>
                <div>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:T.textBright }}>{plan.name} Plan</div>
                  <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{period==="annual"?"Annual (save 20%)":"Monthly"}</div>
                </div>
              </div>
              {[["Subtotal",`$${price}.00`],["Tax (0%)","$0.00"],["Promo","—"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontSize:13, color:T.textDim }}>{k}</span>
                  <span style={{ fontSize:13, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
                </div>
              ))}
              <div style={{ height:1, background:T.border, margin:"10px 0" }} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:16, color:T.textBright }}>Total</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:22, fontWeight:700, color:T.gold }}>${price}.00</span>
              </div>
            </Card>
            <Card>
              <SectionHeader label="Includes" accent={plan.color} />
              {plan.features.slice(0,5).map(f=>(
                <div key={f} style={{ display:"flex", gap:8, marginBottom:7 }}>
                  <span style={{ color:plan.color, fontSize:12 }}>✓</span>
                  <span style={{ fontSize:12, color:T.text }}>{f}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader label="Limits" accent={T.amber} />
              {[["Pipelines",plan.limits.pipelines],["Users",plan.limits.users],["Scans/day",plan.limits.scans]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{k}</span>
                  <span style={{ fontSize:12, color:T.cyan, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* INVOICES */}
      {tab==="invoices" && (
        <Card>
          <SectionHeader label="Billing History" accent={T.gold} />
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["Invoice","Date","Plan","Period","Amount","Status",""].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontWeight:400 }}>{h}</th>)}
            </tr></thead>
            <tbody>{INVOICES.map((inv,i)=>(
              <tr key={inv.id} style={{ borderBottom:`1px solid ${T.border}`, background:i%2===0?"transparent":T.bg0+"66" }}>
                <td style={{ padding:"12px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.cyan }}>{inv.id}</td>
                <td style={{ padding:"12px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.text }}>{inv.date}</td>
                <td style={{ padding:"12px", fontFamily:"'Rajdhani',sans-serif", fontSize:13, color:T.textBright }}>{inv.plan}</td>
                <td style={{ padding:"12px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textDim }}>{inv.period}</td>
                <td style={{ padding:"12px", fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:T.gold }}>{inv.amount}</td>
                <td style={{ padding:"12px" }}><Badge color={T.green}>PAID</Badge></td>
                <td style={{ padding:"12px" }}><button style={{ padding:"4px 12px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>↓ PDF</button></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* PAYMENT METHODS */}
      {tab==="methods" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card>
            <SectionHeader label="Saved Cards" accent={T.gold} />
            {METHODS.map(m=>(
              <div key={m.id} style={{ padding:"14px 16px", background:T.bg2, borderRadius:8, border:`1.5px solid ${m.default?T.gold:T.border}`, marginBottom:10, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:48, height:32, background:m.brand==="Visa"?"#1a1f71":"#252525", borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", fontFamily:"'JetBrains Mono',monospace", flexShrink:0 }}>{m.brand.slice(0,4).toUpperCase()}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:T.textBright }}>•••• •••• •••• {m.last4}</div>
                  <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Expires {m.exp}</div>
                </div>
                {m.default?<Badge color={T.gold}>DEFAULT</Badge>:<button style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>Set default</button>}
              </div>
            ))}
            <button onClick={()=>setTab("payment")} style={{ width:"100%", marginTop:6, padding:"10px 0", background:"transparent", border:`1px dashed ${T.border}`, borderRadius:6, color:T.textDim, cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>+ Add New Card</button>
          </Card>
          <Card>
            <SectionHeader label="Billing Contact" accent={T.gold} />
            {[["Name","Adebayo Paul Oke"],["Email","adebayo@zolextech.com"],["Company","ZolexTech & Consultant"],["Address","Atlanta, Georgia, US"],["Tax ID","—"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{k}</span>
                <span style={{ fontSize:12, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
              </div>
            ))}
            <button style={{ marginTop:14, width:"100%", padding:"9px 0", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textDim, cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>Edit Billing Info</button>
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ACCOUNT VIEW
// ═══════════════════════════════════════════════════════════════════════
const NotifPrefsPanel = () => {
  const NOTIF_PREFS = [
    {cat:"Security Alerts",items:[{l:"Critical threat",k:"sec_crit"},{l:"New IOC",k:"sec_ioc"},{l:"Failed logins",k:"sec_login"},{l:"Compliance violation",k:"sec_comp"}]},
    {cat:"Pipeline Events",items:[{l:"Build failure",k:"pipe_fail"},{l:"Scan failed",k:"pipe_scan"},{l:"Deploy to prod",k:"pipe_dep"},{l:"SLA breach",k:"pipe_sla"}]},
    {cat:"Billing",        items:[{l:"Payment processed",k:"bill_pay"},{l:"Invoice ready",k:"bill_inv"},{l:"Plan expiry",k:"bill_exp"},{l:"Usage limit",k:"bill_use"}]},
    {cat:"Team",           items:[{l:"Member joined",k:"team_join"},{l:"Role changed",k:"team_role"},{l:"API key created",k:"team_api"},{l:"Data export",k:"team_exp"}]},
  ];
  const defaults = {sec_crit:true,sec_ioc:true,sec_login:true,sec_comp:true,pipe_fail:true,pipe_scan:false,pipe_dep:true,pipe_sla:true,bill_pay:true,bill_inv:true,bill_exp:true,bill_use:false,team_join:false,team_role:true,team_api:true,team_exp:true};
  const [prefs, setPrefs] = useState(defaults);
  const [saved, setSaved] = useState(false);
  const toggle = (k) => setPrefs(p=>({...p,[k]:!p[k]}));
  return (
    <Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <SectionHeader label="Notification Preferences"/>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}} style={{padding:"7px 16px",background:saved?`${T.green}18`:`${T.cyan}18`,border:`1px solid ${saved?T.green:T.cyan}`,borderRadius:5,color:saved?T.green:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
          {saved?"✓ Saved":"Save Preferences"}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {NOTIF_PREFS.map(cat=>(
          <div key={cat.cat} style={{padding:"16px 18px",background:T.bg2,borderRadius:8,border:`1px solid ${T.border}`}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:12}}>{cat.cat}</div>
            {cat.items.map(item=>(
              <div key={item.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{item.l}</span>
                <div onClick={()=>toggle(item.k)} style={{width:36,height:20,borderRadius:10,background:prefs[item.k]?`${T.cyan}33`:T.bg3,border:`1px solid ${prefs[item.k]?T.cyan:T.border}`,cursor:"pointer",position:"relative",transition:"background .15s"}}>
                  <div style={{width:14,height:14,borderRadius:"50%",background:prefs[item.k]?T.cyan:T.textDim,position:"absolute",top:2,left:prefs[item.k]?18:2,transition:"left .15s"}}/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

const AccountView = ({ user }) => {
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const TABS=["profile","security","notifications","api"];
  const TL={profile:"◎ Profile",security:"🔐 Security",notifications:"◉ Alerts",api:"⌬ API Keys"};
  const SESSIONS=[
    {device:"Chrome — macOS Ventura", ip:"72.34.201.18", loc:"Atlanta, GA", time:"Now (current)", active:true},
    {device:"Firefox — Windows 11",   ip:"72.34.201.19", loc:"Atlanta, GA", time:"2 hours ago",  active:false},
    {device:"SecureOps Mobile — iOS", ip:"184.56.102.44",loc:"Atlanta, GA", time:"Yesterday 11:42 PM",active:false},
  ];
  const API_KEYS=[
    {name:"Production CI",  key:"sk_live_zolex_4xk9...a8f2",created:"Jan 15",last:"2 min ago",perms:["pipelines:read","scan:write"]},
    {name:"Grafana Plugin", key:"sk_live_zolex_7mb2...c391",created:"Mar 3", last:"1 hour ago",perms:["metrics:read"]},
    {name:"Terraform CLI",  key:"sk_live_zolex_9qr1...d04a",created:"Feb 20",last:"3 days ago",perms:["iac:read","iac:write"]},
  ];

  return (
    <div className="fadeIn">
      <Card style={{ marginBottom:18, padding:"22px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:18 }}>
          <div style={{ width:62, height:62, borderRadius:"50%", background:`linear-gradient(135deg,${T.cyan},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700, color:"#000", flexShrink:0, boxShadow:`0 0 22px ${T.cyan}33` }}>{user?.name?.[0]||"A"}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:22, color:T.textBright }}>{user?.name||"Adebayo Paul Oke"}</div>
            <div style={{ fontSize:13, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{user?.email||"adebayo@zolextech.com"}</div>
            <div style={{ display:"flex", gap:8, marginTop:8 }}><Badge color={T.cyan}>Security Engineer</Badge><Badge color={T.gold}>Pro Plan</Badge><Badge color={T.green}>● Active</Badge></div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>MEMBER SINCE</div>
            <div style={{ fontSize:13, color:T.text, fontFamily:"'JetBrains Mono',monospace" }}>Jan 2025</div>
          </div>
        </div>
      </Card>

      <div style={{ display:"flex", marginBottom:18, borderBottom:`1px solid ${T.border}` }}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{ padding:"9px 20px", background:"transparent", borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent", border:"none", cursor:"pointer", color:tab===t?T.cyan:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>{TL[t]}</button>)}
      </div>

      {tab==="profile" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card>
            <SectionHeader label="Personal Information" />
            {[{l:"FULL NAME",v:"Adebayo Paul Oke"},{l:"EMAIL",v:"adebayo@zolextech.com"},{l:"PHONE",v:"+1 (404) 555-0198"},{l:"TITLE",v:"Cybersecurity Specialist"},{l:"COMPANY",v:"ZolexTech & Consultant"},{l:"LOCATION",v:"Atlanta, Georgia, US"}].map(f=>(
              <div key={f.l} style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>{f.l}</div>
                <input defaultValue={f.v} style={{ width:"100%", padding:"10px 12px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:13, outline:"none" }}
                  onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border} />
              </div>
            ))}
            <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);}} color={T.cyan} style={{ maxWidth:180 }}>{saved?"✓ Saved!":"Save Changes"}</Btn>
          </Card>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Card>
              <SectionHeader label="Role & Permissions" accent={T.purple} />
              {[["Role","Security Engineer"],["Workspace","ZolexTech — Production"],["2FA","Enabled (TOTP)"],["SSO","Disabled"],["API Access","Full"],["Audit Logs","Enabled"]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{k}</span>
                  <span style={{ fontSize:12, color:T.cyan, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader label="Activity Overview" accent={T.green} />
              {[{l:"Scans this month",v:142,c:T.cyan},{l:"Pipelines triggered",v:38,c:T.amber},{l:"Threats detected",v:7,c:T.red},{l:"Compliance checks",v:29,c:T.green}].map(s=>(
                <div key={s.l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${T.border}` }}>
                  <span style={{ fontSize:12, color:T.textDim }}>{s.l}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:16, fontWeight:700, color:s.c }}>{s.v}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {tab==="security" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Card>
              <SectionHeader label="Change Password" />
              {[{l:"CURRENT PASSWORD"},{l:"NEW PASSWORD",hint:true},{l:"CONFIRM NEW"}].map(f=>(
                <div key={f.l} style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:5 }}>{f.l}</div>
                  <input type="password" placeholder="••••••••••" style={{ width:"100%", padding:"10px 12px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:13, outline:"none", letterSpacing:3 }}
                    onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border} />
                  {f.hint && <div style={{ marginTop:4, fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Min 8 chars, 1 uppercase, 1 number</div>}
                </div>
              ))}
              <Btn color={T.cyan} onClick={()=>{}} style={{ maxWidth:200 }}>Update Password</Btn>
            </Card>
            <Card>
              <SectionHeader label="Two-Factor Auth" accent={T.green} />
              {[{l:"Authenticator App (TOTP)",d:"Google Authenticator / Authy",enabled:true},{l:"Hardware Security Key",d:"YubiKey / FIDO2",enabled:false}].map(m=>(
                <div key={m.l} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div><div style={{ fontSize:14, color:T.textBright, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>{m.l}</div><div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{m.d}</div></div>
                  {m.enabled?<Badge color={T.green}>ENABLED</Badge>:<button style={{ padding:"5px 14px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>CONFIGURE</button>}
                </div>
              ))}
            </Card>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Card>
              <SectionHeader label="Active Sessions" accent={T.amber} />
              {SESSIONS.map((s,i)=>(
                <div key={i} style={{ padding:"12px 14px", background:T.bg2, borderRadius:6, marginBottom:8, borderLeft:`3px solid ${s.active?T.green:T.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                    <div style={{ fontSize:13, color:T.textBright, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>{s.device}</div>
                    {s.active?<Badge color={T.green}>Current</Badge>:<button style={{ padding:"3px 8px", background:"transparent", border:`1px solid ${T.red}44`, borderRadius:3, color:T.red, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>Revoke</button>}
                  </div>
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>📍 {s.loc}</span>
                    <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>IP: {s.ip}</span>
                    <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>⏱ {s.time}</span>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader label="Security Score" accent={T.cyan} />
              {[{l:"Strong password",v:100},{l:"2FA enabled",v:100},{l:"Activity reviewed",v:80},{l:"No suspicious logins",v:100},{l:"Email verified",v:100}].map(s=>(
                <ProgressBar key={s.l} label={s.l} value={s.v} color={s.v===100?T.green:T.amber} />
              ))}
              <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:26, fontWeight:700, color:T.green }}>96</span>
                <div><div style={{ fontSize:13, color:T.textBright, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>Excellent</div><div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Security score</div></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab==="notifications" && <NotifPrefsPanel />}

      {tab==="api" && (
        <Card>
          <SectionHeader label="API Keys" accent={T.cyan} />
          {API_KEYS.map(k=>(
            <div key={k.name} style={{ padding:"14px 16px", background:T.bg2, borderRadius:8, border:`1px solid ${T.border}`, marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <div>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, color:T.textBright, marginBottom:4 }}>{k.name}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.cyan, background:T.bg0, padding:"3px 8px", borderRadius:4, display:"inline-block" }}>{k.key}</div>
                </div>
                <button style={{ padding:"5px 12px", background:`${T.red}14`, border:`1px solid ${T.red}44`, borderRadius:4, color:T.red, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>Revoke</button>
              </div>
              <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Created {k.created}</span>
                <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Last used {k.last}</span>
                {k.perms.map(p=><Badge key={p} color={T.purple}>{p}</Badge>)}
              </div>
            </div>
          ))}
          <button style={{ width:"100%", marginTop:6, padding:"10px 0", background:"transparent", border:`1px dashed ${T.border}`, borderRadius:6, color:T.textDim, cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>+ Generate New API Key</button>
        </Card>
      )}
    </div>
  );
};

const DashboardView = () => {
  const [metrics, setMetrics] = useState({ threats:4, vulns:23, compliance:94, events:1284, blocked:847, mttr:14 });
  const [history, setHistory] = useState({
    threats: Array.from({length:24},()=>rand(1,8)),
    events:  Array.from({length:24},()=>rand(900,1500)),
    blocked: Array.from({length:24},()=>rand(400,900)),
  });
  const [heatmap]  = useState(()=> Array.from({length:7},()=>Array.from({length:24},()=>rand(0,10))));
  const [alerts]   = useState([
    {id:1,sev:"critical",msg:"Lateral movement detected — 10.0.2.45 → 10.0.3.12 (SMB)",       time:"00:42",ack:false},
    {id:2,sev:"warn",    msg:"SSH brute-force from 185.220.101.8 (Tor exit) — 847 attempts",    time:"02:17",ack:false},
    {id:3,sev:"info",    msg:"EC2 launched in us-east-1 without approved AMI tag",               time:"04:05",ack:true },
    {id:4,sev:"critical",msg:"S3 bucket zolextech-prod — public ACL re-enabled",                time:"06:33",ack:false},
    {id:5,sev:"warn",    msg:"IAM user adebayo_dev — MFA disabled, 90d inactive credentials",   time:"08:11",ack:true },
  ]);
  const [topThreats] = useState([
    {name:"Brute Force SSH",       count:847, trend:+12, color:T.red},
    {name:"Port Scan",             count:312, trend:-5,  color:T.amber},
    {name:"Crypto Mining",         count:94,  trend:+3,  color:T.amber},
    {name:"SQL Injection Attempt", count:61,  trend:-8,  color:T.red},
    {name:"XSS Probe",             count:44,  trend:+1,  color:T.textDim},
  ]);

  useInterval(()=>{
    setMetrics(m=>({...m, events:m.events+rand(1,6), threats:rand(2,7), blocked:m.blocked+rand(0,3)}));
    setHistory(h=>({
      threats:[...h.threats.slice(1), rand(1,8)],
      events: [...h.events.slice(1),  rand(900,1500)],
      blocked:[...h.blocked.slice(1), rand(400,900)],
    }));
  }, 2000);

  const sc={critical:T.red,warn:T.amber,info:T.cyan};
  const heatColor = v => v===0?T.bg2:v<4?T.green+"44":v<7?T.amber+"66":T.red+"99";
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const maxEvent = Math.max(...history.events);

  // Mini bar chart
  const BarChart = ({ data, color, height=50 }) => {
    const mx = Math.max(...data, 1);
    return (
      <div style={{display:"flex",alignItems:"flex-end",gap:2,height}}>
        {data.map((v,i)=>(
          <div key={i} style={{flex:1,background: i===data.length-1?color:`${color}66`, borderRadius:"2px 2px 0 0", height:`${(v/mx)*100}%`, minHeight:2, transition:"height .3s"}}/>
        ))}
      </div>
    );
  };

  return (
    <div className="fadeIn">
      {/* KPI row */}
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        {[
          {label:"ACTIVE THREATS",  value:metrics.threats,              icon:"⚠", color:T.red,    delta:2},
          {label:"OPEN VULNS",      value:metrics.vulns,                icon:"◎", color:T.amber,  delta:-3},
          {label:"COMPLIANCE",      value:metrics.compliance, unit:"%", icon:"✓", color:T.green,  delta:-1},
          {label:"EVENTS / HR",     value:metrics.events.toLocaleString(),icon:"⟁",color:T.cyan},
          {label:"REQUESTS BLOCKED",value:metrics.blocked.toLocaleString(),icon:"⊘",color:T.purple},
          {label:"MTTR (MIN)",      value:metrics.mttr,                 icon:"⏱", color:T.orange, delta:-2},
        ].map(m=><MetricCard key={m.label} {...m} style={{minWidth:130}}/>)}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>
        {/* Event volume bar chart */}
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <SectionHeader label="Event Volume — Last 24 Intervals" accent={T.cyan}/>
            <div style={{display:"flex",gap:8}}>
              <Badge color={T.cyan}>Events</Badge>
              <Badge color={T.red}>Threats</Badge>
              <Badge color={T.purple}>Blocked</Badge>
            </div>
          </div>
          {/* Stacked area approximation */}
          <div style={{position:"relative",height:100}}>
            <svg viewBox={`0 0 240 100`} preserveAspectRatio="none" style={{width:"100%",height:"100%",position:"absolute",inset:0}}>
              {/* Blocked area */}
              <polygon points={`0,100 ${history.blocked.map((v,i)=>`${(i/23)*240},${100-(v/Math.max(...history.blocked,1))*60}`).join(" ")} 240,100`} fill={`${T.purple}18`}/>
              <polyline points={history.blocked.map((v,i)=>`${(i/23)*240},${100-(v/Math.max(...history.blocked,1))*60}`).join(" ")} fill="none" stroke={`${T.purple}88`} strokeWidth="1.2"/>
              {/* Events area */}
              <polygon points={`0,100 ${history.events.map((v,i)=>`${(i/23)*240},${100-(v/maxEvent)*55}`).join(" ")} 240,100`} fill={`${T.cyan}10`}/>
              <polyline points={history.events.map((v,i)=>`${(i/23)*240},${100-(v/maxEvent)*55}`).join(" ")} fill="none" stroke={T.cyan} strokeWidth="1.5"/>
              {/* Threats line */}
              <polyline points={history.threats.map((v,i)=>`${(i/23)*240},${100-(v/10)*80}`).join(" ")} fill="none" stroke={T.red} strokeWidth="1.5" strokeDasharray="3 2"/>
            </svg>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>-24 intervals</span>
            <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>now</span>
          </div>
        </Card>

        {/* Top threats */}
        <Card>
          <SectionHeader label="Top Threat Types" accent={T.red}/>
          {topThreats.map((t,_i)=>{
            const pct = Math.round((t.count/topThreats[0].count)*100);
            return (
              <div key={t.name} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{t.name}</span>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:10,color:t.trend>0?T.red:T.green,fontFamily:"'JetBrains Mono',monospace"}}>{t.trend>0?"▲":"▼"}{Math.abs(t.trend)}%</span>
                    <span style={{fontSize:12,fontWeight:700,color:t.color,fontFamily:"'JetBrains Mono',monospace"}}>{t.count}</span>
                  </div>
                </div>
                <div style={{height:4,background:T.bg3,borderRadius:2}}>
                  <div style={{width:`${pct}%`,height:"100%",background:t.color,borderRadius:2,transition:"width .5s"}}/>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
        {/* Mini bar charts */}
        <Card>
          <SectionHeader label="Threats — 24h" accent={T.red}/>
          <BarChart data={history.threats} color={T.red} height={55}/>
          <div style={{marginTop:8,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Peak: {Math.max(...history.threats)}</span>
            <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Avg: {Math.round(history.threats.reduce((a,b)=>a+b,0)/history.threats.length)}</span>
          </div>
        </Card>
        <Card>
          <SectionHeader label="Blocked Requests" accent={T.purple}/>
          <BarChart data={history.blocked} color={T.purple} height={55}/>
          <div style={{marginTop:8,display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Peak: {Math.max(...history.blocked).toLocaleString()}</span>
            <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Total: {history.blocked.reduce((a,b)=>a+b,0).toLocaleString()}</span>
          </div>
        </Card>
        <Card>
          <SectionHeader label="Attack Heatmap — 7d" accent={T.amber}/>
          <div style={{display:"grid",gridTemplateColumns:"28px 1fr",gap:2,alignItems:"center"}}>
            {DAYS.map((day,di)=>(
              <div key={day} style={{display:"contents"}}>
                <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",textAlign:"right",paddingRight:4}}>{day}</span>
                <div style={{display:"flex",gap:2}}>
                  {heatmap[di].slice(0,12).map((v,hi)=>(
                    <div key={hi} title={`${v} events`} style={{flex:1,height:10,borderRadius:1,background:heatColor(v),transition:"background .3s"}}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:6,marginTop:6,alignItems:"center"}}>
            <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Low</span>
            {[T.green+"44",T.amber+"66",T.red+"99"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:1,background:c}}/>)}
            <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>High</span>
          </div>
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14}}>
        {/* Alerts */}
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label="Security Alerts" accent={T.red}/>
            <div style={{display:"flex",gap:6}}>
              <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{alerts.filter(a=>!a.ack).length} unacknowledged</span>
              <Badge color={T.red}>{alerts.filter(a=>a.sev==="critical"&&!a.ack).length} CRITICAL</Badge>
            </div>
          </div>
          {alerts.map(a=>(
            <div key={a.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 12px",background:T.bg2,borderRadius:5,borderLeft:`3px solid ${sc[a.sev]}`,marginBottom:8,opacity:a.ack?.5:1,transition:"opacity .2s"}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
                <Badge color={sc[a.sev]}>{a.sev.toUpperCase()}</Badge>
                <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.time}s</span>
              </div>
              <span style={{flex:1,fontSize:12,color:a.ack?T.textDim:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.6}}>{a.msg}</span>
              {!a.ack && <div style={{width:6,height:6,borderRadius:"50%",background:sc[a.sev],animation:"pulse 2s infinite",flexShrink:0,marginTop:4}}/>}
            </div>
          ))}
        </Card>

        {/* Service health + quick stats */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <SectionHeader label="Service Health" accent={T.green}/>
            {[
              {name:"PostgreSQL",     status:"ok",   latency:"2ms",  note:""},
              {name:"Redis Cache",    status:"warn", latency:"—",    note:"1/2 nodes — degraded"},
              {name:"FastAPI",        status:"ok",   latency:"14ms", note:""},
              {name:"NGINX Proxy",    status:"ok",   latency:"1ms",  note:""},
              {name:"WebSocket",      status:"ok",   latency:"—",    note:""},
              {name:"JWT Auth",       status:"ok",   latency:"8ms",  note:""},
              {name:"Docker Engine",  status:"ok",   latency:"—",    note:""},
              {name:"Azure Sentinel", status:"warn", latency:"—",    note:"403 — Shared key expired"},
            ].map(s=>(
              <div key={s.name} style={{padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <StatusDot status={s.status==="ok"?"ok":"warn"}/>
                    <span style={{fontSize:12,fontFamily:"'JetBrains Mono',monospace",color:s.status!=="ok"?T.amber:T.text}}>{s.name}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{s.latency}</span>
                    <span style={{fontSize:10,color:s.status==="ok"?T.green:T.amber,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{s.status==="ok"?"UP":"WARN"}</span>
                  </div>
                </div>
                {s.note && <div style={{fontSize:9,color:T.amber,fontFamily:"'JetBrains Mono',monospace",marginLeft:18,marginTop:1}}>{s.note}</div>}
              </div>
            ))}
          </Card>
          <Card style={{padding:"14px 16px"}}>
            <SectionHeader label="Platform Stats" accent={T.purple}/>
            {[
              {l:"Uptime (30d)",      v:"99.98%", c:T.green},
              {l:"Cert expires",      v:"187d",   c:T.green},
              {l:"Last backup",       v:"4m ago", c:T.green},
              {l:"Log retention",     v:"90d",    c:T.cyan},
              {l:"WAF rules active",  v:"1,247",  c:T.amber},
            ].map(s=>(
              <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{s.l}</span>
                <span style={{fontSize:12,color:s.c,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{s.v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

const CICDView = () => {
  const [tab, setTab]       = useState("pipelines");
  const [selPL, setSelPL]   = useState("pl-001");
  const [triggerRunning, setTriggerRunning] = useState(false);
  const [connTesting, setConnTesting] = useState(null);
  const [connResults, setConnResults] = useState({});

  const PL = [
    {
      id:"pl-001", name:"zolextech/backend",  branch:"main",          status:"success",
      dur:"4m 12s", commit:"a3f9c1d", author:"Adebayo Paul", trigger:"push",
      started:"09:34:18", finished:"09:38:30",
      steps:[
        {name:"Checkout",      status:"success", dur:"2s",   output:"Cloned zolextech/backend @ a3f9c1d"},
        {name:"Install Deps",  status:"success", dur:"28s",  output:"847 packages installed (npm ci)"},
        {name:"Lint",          status:"success", dur:"8s",   output:"ESLint: 0 errors, 2 warnings"},
        {name:"Unit Tests",    status:"success", dur:"42s",  output:"Tests: 148 passed, 0 failed (coverage: 87%)"},
        {name:"SAST (Bandit)", status:"success", dur:"31s",  output:"Bandit: 0 HIGH, 2 MEDIUM, 3 LOW"},
        {name:"Docker Build",  status:"success", dur:"54s",  output:"Image: zolextech/api:a3f9c1d (312 MB)"},
        {name:"Trivy Scan",    status:"success", dur:"18s",  output:"Trivy: 0 CRITICAL, 1 HIGH, 4 MEDIUM"},
        {name:"Push ECR",      status:"success", dur:"22s",  output:"Pushed to 123456789.dkr.ecr.us-east-1.amazonaws.com"},
        {name:"Deploy Staging",status:"success", dur:"38s",  output:"EKS rollout: 3/3 replicas healthy"},
        {name:"Smoke Tests",   status:"success", dur:"12s",  output:"5/5 health endpoints passed"},
        {name:"Deploy Prod",   status:"success", dur:"47s",  output:"EKS rollout complete. Version: 2.4.1"},
      ],
    },
    {
      id:"pl-002", name:"zolextech/frontend", branch:"feature/auth",   status:"running",
      dur:"2m 07s", commit:"b82e44f", author:"Chidera Okonkwo", trigger:"push",
      started:"09:40:11", finished:null,
      steps:[
        {name:"Checkout",      status:"success", dur:"2s",   output:"Cloned @ b82e44f"},
        {name:"Install Deps",  status:"success", dur:"34s",  output:"Packages installed"},
        {name:"Lint",          status:"success", dur:"9s",   output:"0 errors"},
        {name:"Unit Tests",    status:"success", dur:"51s",  output:"92 passed, 0 failed"},
        {name:"Build",         status:"running", dur:"—",    output:"Webpack compiling…"},
        {name:"Sec Scan",      status:"pending", dur:"—",    output:""},
        {name:"Deploy Preview",status:"pending", dur:"—",    output:""},
      ],
    },
    {
      id:"pl-003", name:"zolextech/infra",    branch:"terraform-aws",  status:"failed",
      dur:"1m 33s", commit:"c19d770", author:"Adebayo Paul", trigger:"pr",
      started:"09:22:04", finished:"09:23:37",
      steps:[
        {name:"Checkout",      status:"success", dur:"2s",   output:"Cloned @ c19d770"},
        {name:"TF Init",       status:"success", dur:"12s",  output:"Terraform initialized"},
        {name:"TF Validate",   status:"success", dur:"4s",   output:"Configuration valid"},
        {name:"TF Plan",       status:"failed",  dur:"75s",  output:"Error: Insufficient permissions to modify aws_iam_role.eks_node"},
        {name:"TF Apply",      status:"pending", dur:"—",    output:""},
        {name:"Compliance Chk",status:"pending", dur:"—",    output:""},
      ],
    },
    {
      id:"pl-004", name:"zolextech/worker",   branch:"main",           status:"success",
      dur:"3m 02s", commit:"d94e881", author:"Funke Adeyemi", trigger:"schedule",
      started:"09:00:00", finished:"09:03:02",
      steps:[
        {name:"Checkout",   status:"success", dur:"2s",  output:"Cloned @ d94e881"},
        {name:"Tests",      status:"success", dur:"78s", output:"64 passed, 0 failed"},
        {name:"SAST",       status:"success", dur:"22s", output:"0 HIGH findings"},
        {name:"Docker",     status:"success", dur:"61s", output:"Image built and scanned"},
        {name:"Deploy",     status:"success", dur:"19s", output:"Worker replicas: 2/2 healthy"},
      ],
    },
  ];

  const TESTS = [
    {suite:"API Unit Tests",         total:148, pass:148, fail:0,  skip:0,  cov:"87%", dur:"42s", status:"pass"},
    {suite:"Frontend Unit Tests",    total:92,  pass:92,  fail:0,  skip:2,  cov:"79%", dur:"51s", status:"pass"},
    {suite:"Worker Unit Tests",      total:64,  pass:64,  fail:0,  skip:0,  cov:"91%", dur:"78s", status:"pass"},
    {suite:"Integration Tests",      total:38,  pass:35,  fail:3,  skip:0,  cov:"—",   dur:"2m4s",status:"fail"},
    {suite:"E2E (Playwright)",        total:24,  pass:24,  fail:0,  skip:4,  cov:"—",   dur:"5m12s",status:"pass"},
    {suite:"Security Tests (OWASP)", total:18,  pass:16,  fail:2,  skip:0,  cov:"—",   dur:"3m8s", status:"fail"},
  ];

  const ARTIFACTS = [
    {name:"secureops-api:2.4.1",     type:"Docker Image", size:"312 MB", registry:"ECR",     pipeline:"pl-001", date:"09:38:24", signed:true },
    {name:"secureops-ui:2.4.1",      type:"Docker Image", size:"148 MB", registry:"ECR",     pipeline:"pl-002", date:"—",        signed:false},
    {name:"secureops-worker:2.4.1",  type:"Docker Image", size:"290 MB", registry:"ECR",     pipeline:"pl-004", date:"09:02:58", signed:true },
    {name:"api-coverage-report.html",type:"HTML Report",  size:"2.4 MB", registry:"S3",      pipeline:"pl-001", date:"09:37:52", signed:false},
    {name:"sast-findings.sarif",     type:"SARIF",        size:"128 KB", registry:"S3",      pipeline:"pl-001", date:"09:36:21", signed:false},
    {name:"trivy-report.json",       type:"JSON",         size:"84 KB",  registry:"S3",      pipeline:"pl-001", date:"09:37:08", signed:false},
  ];

  const SEC_GATES = [
    {name:"No CRITICAL SAST findings",     status:"pass", pipeline:"pl-001", rule:"bandit severity < CRITICAL"},
    {name:"No CRITICAL CVEs in image",     status:"pass", pipeline:"pl-001", rule:"trivy severity < CRITICAL"},
    {name:"Test coverage ≥ 80%",           status:"pass", pipeline:"pl-001", rule:"coverage >= 80"},
    {name:"All unit tests pass",           status:"pass", pipeline:"pl-001", rule:"fail_count == 0"},
    {name:"IaC policy compliant",          status:"fail", pipeline:"pl-003", rule:"checkov pass_rate >= 95"},
    {name:"No hardcoded secrets",          status:"pass", pipeline:"pl-001", rule:"gitleaks exit_code == 0"},
    {name:"Dependency vulnerabilities",    status:"warn", pipeline:"pl-002", rule:"npm audit severity < HIGH"},
    {name:"OWASP ZAP clean",              status:"fail", pipeline:"pl-001", rule:"zap_high_count == 0"},
  ];

  const sc  = {success:T.green, running:T.cyan, failed:T.red, pending:T.textDim, pass:T.green, fail:T.red, warn:T.amber};
  const si  = {success:"✓", running:"●", failed:"✗", pending:"○"};
  const pl  = PL.find(p=>p.id===selPL) || PL[0];

  const TABS = ["pipelines","tests","artifacts","security","connections"];
  const TL   = {pipelines:"⌬ Pipelines", tests:"◎ Test Results", artifacts:"⊕ Artifacts", security:"◉ Security Gates", connections:"⊕ Connections"};

  const StepRow = ({step}) => (
    <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"10px 14px",borderBottom:`1px solid ${T.border}22`,transition:"background .15s"}}
      onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <div style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${sc[step.status]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:sc[step.status],background:`${sc[step.status]}10`,animation:step.status==="running"?"pulse 1s infinite":"none",flexShrink:0}}>{si[step.status]}</div>
      <div style={{flex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:step.output?4:0}}>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:step.status==="pending"?T.textDim:T.textBright}}>{step.name}</span>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{step.dur}</span>
        </div>
        {step.output && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:step.status==="failed"?T.red:step.status==="running"?T.amber:T.textDim}}>{step.output}</div>}
      </div>
    </div>
  );

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="RUNS TODAY"   value={38}  icon="⌬" color={T.cyan}/>
        <MetricCard label="SUCCESS RATE" value={91} unit="%" icon="✓" color={T.green}/>
        <MetricCard label="AVG DURATION" value="4.2" unit="min" icon="⏱" color={T.amber}/>
        <MetricCard label="FAILED"       value={3}   icon="✗" color={T.red} delta={1}/>
        <MetricCard label="QUEUED"       value={2}   icon="⏳" color={T.textDim}/>
        <MetricCard label="SEC GATES"    value={`${SEC_GATES.filter(g=>g.status==="pass").length}/${SEC_GATES.length}`} icon="◉" color={T.green}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            {TL[t]}
            {t==="security" && SEC_GATES.filter(g=>g.status!=="pass").length>0 && <span style={{background:T.red,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 6px",fontFamily:"'JetBrains Mono',monospace"}}>{SEC_GATES.filter(g=>g.status!=="pass").length}</span>}
          </button>
        ))}
      </div>

      {/* PIPELINES */}
      {tab==="pipelines" && (
        <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:14,alignItems:"start"}}>
          {/* Pipeline list */}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",gap:8,marginBottom:4}}>
              <button onClick={()=>{setTriggerRunning(true);setTimeout(()=>setTriggerRunning(false),2000);}} style={{flex:1,padding:"7px 0",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                {triggerRunning?"⟳ Triggering…":"▶ Trigger Pipeline"}
              </button>
              <button style={{padding:"7px 14px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>Filter ▾</button>
            </div>
            {PL.map(p=>(
              <div key={p.id} onClick={()=>setSelPL(p.id)} style={{padding:"12px 14px",background:selPL===p.id?`${T.cyan}0a`:T.bg1,border:`1.5px solid ${selPL===p.id?T.cyan:T.border}`,borderRadius:7,cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:9,height:9,borderRadius:"50%",background:sc[p.status],animation:p.status==="running"?"pulse 1s infinite":"none",flexShrink:0}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.textBright,fontWeight:600}}>{p.name}</span>
                  </div>
                  <Badge color={sc[p.status]}>{p.status.toUpperCase()}</Badge>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>#{p.commit} · {p.branch}</span>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{p.author}</span>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>⏱ {p.dur}</span>
                </div>
                {/* Mini step pills */}
                <div style={{display:"flex",gap:3,marginTop:8,flexWrap:"wrap"}}>
                  {p.steps.map((s,i)=>(
                    <div key={i} style={{width:18,height:4,borderRadius:2,background:sc[s.status]+(s.status==="pending"?"44":"cc")}} title={s.name}/>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline detail */}
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,background:T.bg0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,color:T.textBright,marginBottom:4}}>{pl.name}</div>
                  <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>#{pl.commit}</span>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{pl.branch}</span>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>by {pl.author}</span>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>trigger: {pl.trigger}</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <Badge color={sc[pl.status]}>{pl.status.toUpperCase()}</Badge>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:6}}>
                    {pl.started} → {pl.finished||"running"}
                  </div>
                </div>
              </div>
              {/* Step progress bar */}
              <div style={{display:"flex",gap:3,marginTop:12}}>
                {pl.steps.map((s,i)=>(
                  <div key={i} style={{flex:1,height:6,borderRadius:3,background:sc[s.status]+(s.status==="pending"?"33":"cc"),position:"relative"}} title={`${s.name}: ${s.status}`}/>
                ))}
              </div>
            </div>
            <div style={{maxHeight:460,overflowY:"auto"}}>
              {pl.steps.map((step,i)=><StepRow key={i} step={step}/>)}
            </div>
          </Card>
        </div>
      )}

      {/* TEST RESULTS */}
      {tab==="tests" && (
        <div>
          <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
            {["pass","fail","warn"].map(s=>({pass:{label:"Suites Passing",count:TESTS.filter(t=>t.status==="pass").length,color:T.green},fail:{label:"Suites Failing",count:TESTS.filter(t=>t.status==="fail").length,color:T.red},warn:{label:"Total Tests",count:TESTS.reduce((a,t)=>a+t.total,0),color:T.cyan}}[s])).map(({label,count,color})=>(
              <Card key={label} style={{flex:1,minWidth:140}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>{label}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color}}>{count}</div>
              </Card>
            ))}
            <Card style={{flex:1,minWidth:140}}>
              <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>AVG COVERAGE</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:T.green}}>86%</div>
            </Card>
          </div>
          <Card>
            <SectionHeader label="Test Suite Results — Latest Run"/>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["Suite","Total","Pass","Fail","Skip","Coverage","Duration","Status"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{TESTS.map((t,i)=>(
                <tr key={t.suite} style={{borderBottom:`1px solid ${T.border}22`,background:i%2===0?"transparent":T.bg0+"55"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":T.bg0+"55"}>
                  <td style={{padding:"10px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,color:T.textBright}}>{t.suite}</td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.textDim}}>{t.total}</td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.green,fontWeight:700}}>{t.pass}</td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:t.fail>0?T.red:T.textDim,fontWeight:t.fail>0?700:400}}>{t.fail}</td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.textDim}}>{t.skip}</td>
                  <td style={{padding:"10px 12px"}}>
                    {t.cov!=="—"?(
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:50,height:4,background:T.bg3,borderRadius:2}}><div style={{width:t.cov,height:"100%",background:parseInt(t.cov)>=80?T.green:T.amber,borderRadius:2}}/></div>
                        <span style={{fontSize:11,color:parseInt(t.cov||0)>=80?T.green:T.amber,fontFamily:"'JetBrains Mono',monospace"}}>{t.cov}</span>
                      </div>
                    ):<span style={{fontSize:11,color:T.textDim}}>—</span>}
                  </td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{t.dur}</td>
                  <td style={{padding:"10px 12px"}}><Badge color={sc[t.status]}>{t.status.toUpperCase()}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
        </div>
      )}

      {/* ARTIFACTS */}
      {tab==="artifacts" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label="Build Artifacts & Registries"/>
            <Badge color={T.cyan}>{ARTIFACTS.length} artifacts</Badge>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {ARTIFACTS.map((a,i)=>(
              <div key={i} style={{padding:"14px 16px",background:T.bg2,borderRadius:7,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:40,height:40,borderRadius:8,background:a.type==="Docker Image"?T.cyan+"14":T.amber+"14",border:`1px solid ${a.type==="Docker Image"?T.cyan:T.amber}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                  {a.type==="Docker Image"?"🐳":a.type==="SARIF"?"◉":a.type==="HTML Report"?"◧":"📄"}
                </div>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.textBright,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.type}</span>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.size}</span>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.registry}</span>
                  </div>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{a.pipeline} · {a.date}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:4,flexShrink:0}}>
                  {a.signed && <Badge color={T.green}>✓ Signed</Badge>}
                  <button style={{padding:"3px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>↓ Pull</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SECURITY GATES */}
      {tab==="security" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {SEC_GATES.map((g,i)=>(
            <div key={i} style={{padding:"14px 16px",background:T.bg1,border:`1.5px solid ${sc[g.status]}44`,borderLeft:`4px solid ${sc[g.status]}`,borderRadius:7,display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:`${sc[g.status]}14`,border:`2px solid ${sc[g.status]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:sc[g.status],flexShrink:0}}>
                {g.status==="pass"?"✓":g.status==="warn"?"⚠":"✗"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:4}}>{g.name}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,marginBottom:4}}>{g.pipeline} · {g.rule}</div>
                <Badge color={sc[g.status]}>{g.status.toUpperCase()}</Badge>
              </div>
            </div>
          ))}
          <div style={{gridColumn:"1/-1",padding:"14px 18px",background:SEC_GATES.every(g=>g.status==="pass")?`${T.green}0a`:`${T.red}0a`,border:`1px solid ${SEC_GATES.every(g=>g.status==="pass")?T.green:T.red}33`,borderRadius:8}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:SEC_GATES.every(g=>g.status==="pass")?T.green:T.red,marginBottom:4}}>
              {SEC_GATES.filter(g=>g.status==="pass").length}/{SEC_GATES.length} security gates passing — {SEC_GATES.filter(g=>g.status!=="pass").length>0?"deployment BLOCKED":"deployment APPROVED"}
            </div>
            <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>All security gates must pass before production deployment is permitted. Fix failing gates and re-run the pipeline.</div>
          </div>
        </div>
      )}

      {/* CONNECTIONS */}
      {tab==="connections" && (() => {
        const CONNS = [
          { id:"gh",    group:"Source Control",   name:"GitHub",             icon:"⌥", url:"github.com/zolextech",               status:"ok",       lastSync:"2m ago",   branch:"main",    token:"ghp_••••••••••••••••4f2a",    cors: null },
          { id:"gl",    group:"Source Control",   name:"GitLab (self-hosted)",icon:"⬡", url:"gitlab.zolextech.com",               status:"ok",       lastSync:"12m ago",  branch:"main",    token:"glpat-••••••••••6c9d",          cors: null },
          { id:"ecr",   group:"Container Registry",name:"AWS ECR",            icon:"📦", url:"123456789.dkr.ecr.us-east-1.amazonaws.com", status:"ok", lastSync:"38m ago", branch:null,   token:"iam-role-irsa",                 cors: null },
          { id:"hub",   group:"Container Registry",name:"Docker Hub",         icon:"🐳", url:"hub.docker.com/u/zolextech",         status:"warn",     lastSync:"2d ago",   branch:null,    token:"dkr_pat_••••••••••••••7b3e",    cors: { code:"401", msg:"Token expired — regenerate in Docker Hub → Account Settings → Security" } },
          { id:"eks",   group:"Deploy Target",    name:"EKS — zolextech-prod",icon:"☸", url:"eks.us-east-1.amazonaws.com (cluster: zolextech-prod)", status:"ok", lastSync:"5m ago", branch:null, token:"iam-role-irsa", cors: null },
          { id:"eks_s", group:"Deploy Target",    name:"EKS — zolextech-staging",icon:"☸",url:"eks.us-east-1.amazonaws.com (cluster: zolextech-staging)",status:"ok",lastSync:"3h ago",branch:null,token:"iam-role-irsa", cors: null },
          { id:"slack", group:"Notifications",    name:"Slack",              icon:"💬", url:"hooks.slack.com → #ci-alerts",       status:"ok",       lastSync:"Just now", branch:null,    token:"xoxb-••••••••••••••••••••",     cors: null },
          { id:"pd",    group:"Notifications",    name:"PagerDuty",          icon:"🔔", url:"events.pagerduty.com (svc: ZT-SECOPS)", status:"ok",    lastSync:"14m ago",  branch:null,    token:"pdkey-••••••••••",              cors: null },
          { id:"sonar", group:"Code Quality",     name:"SonarCloud",         icon:"◎", url:"sonarcloud.io/organizations/zolextech", status:"warn",   lastSync:"—",        branch:null,    token:"sqa_••••••••••••••3d1f",        cors: { code:"CORS", msg:"Browser calls to SonarCloud API blocked — use the API proxy or a backend integration token" } },
        ];

        const groups = [...new Set(CONNS.map(c=>c.group))];
        const sc2 = {ok:T.green, warn:T.amber, error:T.red};

        const testConn = (id) => {
          if (connTesting) return;
          setConnTesting(id);
          const conn = CONNS.find(c=>c.id===id);
          setTimeout(()=>{
            setConnResults(r=>({...r,[id]: conn.cors ? {ok:false, msg:conn.cors.msg} : {ok:true, msg:"Connection successful — endpoint reachable, credentials valid."}}));
            setConnTesting(null);
          }, 1400);
        };

        return (
          <div style={{display:"flex",flexDirection:"column",gap:22}}>
            {groups.map(grp => (
              <div key={grp}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.textDim,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>{grp}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {CONNS.filter(c=>c.group===grp).map(c=>(
                    <div key={c.id} style={{padding:"14px 16px",background:T.bg1,border:`1.5px solid ${c.cors?T.amber:c.status==="ok"?T.border:T.amber}`,borderLeft:`4px solid ${sc2[c.status]}`,borderRadius:7}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                        <div style={{width:34,height:34,borderRadius:8,background:`${sc2[c.status]}14`,border:`1px solid ${sc2[c.status]}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{c.icon}</div>
                        <div style={{flex:1,overflow:"hidden"}}>
                          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:1}}>{c.name}</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.url}</div>
                        </div>
                        <Badge color={sc2[c.status]}>{c.status.toUpperCase()}</Badge>
                      </div>
                      <div style={{display:"flex",gap:14,marginBottom:c.cors?10:12,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Last sync: <span style={{color:T.text}}>{c.lastSync}</span></span>
                        {c.branch && <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Branch: <span style={{color:T.cyan}}>{c.branch}</span></span>}
                        <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Auth: <span style={{color:T.purple}}>{c.token}</span></span>
                      </div>
                      {c.cors && (
                        <div style={{padding:"7px 10px",background:`${T.amber}0c`,border:`1px solid ${T.amber}33`,borderRadius:5,marginBottom:10}}>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                            <span style={{fontSize:10,color:T.amber,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>⚠ {c.cors.code}</span>
                          </div>
                          <div style={{fontSize:11,color:T.amber,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.5}}>{c.cors.msg}</div>
                        </div>
                      )}
                      {connResults[c.id] && (
                        <div style={{padding:"6px 10px",background:connResults[c.id].ok?`${T.green}0a`:`${T.red}0a`,border:`1px solid ${connResults[c.id].ok?T.green:T.red}33`,borderRadius:5,marginBottom:10}}>
                          <span style={{fontSize:11,color:connResults[c.id].ok?T.green:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{connResults[c.id].ok?"✓":"✗"} {connResults[c.id].msg}</span>
                        </div>
                      )}
                      <div style={{display:"flex",gap:7}}>
                        <button onClick={()=>testConn(c.id)} disabled={!!connTesting} style={{flex:1,padding:"6px 0",background:connTesting===c.id?`${T.cyan}14`:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:connTesting===c.id?T.cyan:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:connTesting?"default":"pointer",letterSpacing:.5,transition:"all .15s"}}
                          onMouseEnter={e=>{if(!connTesting)e.currentTarget.style.borderColor=T.cyan;}}
                          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;}}>
                          {connTesting===c.id?"⟳ Testing…":"⟳ Test"}
                        </button>
                        <button style={{flex:1,padding:"6px 0",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:.5}}
                          onMouseEnter={e=>e.currentTarget.style.borderColor=T.purple}
                          onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                          ⚙ Configure
                        </button>
                        {c.status!=="ok" && <button style={{flex:1,padding:"6px 0",background:`${T.amber}14`,border:`1px solid ${T.amber}44`,borderRadius:4,color:T.amber,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer",letterSpacing:.5}}>↺ Reconnect</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
};

const IaCView = () => {
  const [tab, setTab]         = useState("overview");
  const [selFile, setSelFile] = useState("main.tf");
  const [workspace, setWorkspace] = useState("prod");
  const [planRunning, setPlanRunning] = useState(false);
  const [planDone, setPlanDone]     = useState(false);
  const [applyRunning, setApplyRunning] = useState(false);
  const [applyDone, setApplyDone]   = useState(false);
  const [planLines, setPlanLines]   = useState([]);
  const [applyLines, setApplyLines] = useState([]);
  const [expandedDirs, setExpandedDirs] = useState(["root","modules"]);
  const [applyConfirm, setApplyConfirm] = useState(false);
  const planRef  = useRef();
  const applyRef = useRef();
  useEffect(() => { if (planRef.current)  planRef.current.scrollTop  = planRef.current.scrollHeight;  }, [planLines]);
  useEffect(() => { if (applyRef.current) applyRef.current.scrollTop = applyRef.current.scrollHeight; }, [applyLines]);

  const WORKSPACES = [
    { id:"dev",     label:"Development", color:"#00ff9d", resources:34, cost:"$142/mo",   status:"ok",   drifts:0, lastApply:"1d ago"  },
    { id:"staging", label:"Staging",     color:"#ffb300", resources:61, cost:"$389/mo",   status:"warn", drifts:1, lastApply:"3h ago"  },
    { id:"prod",    label:"Production",  color:"#00d4ff", resources:98, cost:"$1,240/mo", status:"ok",   drifts:2, lastApply:"2h ago"  },
  ];

  const FILE_TREE = [
    { id:"root", type:"dir", name:"zolextech-infra/", children:[
      { id:"main.tf",      type:"file", name:"main.tf",             size:"3.2 KB", changed:false },
      { id:"variables.tf", type:"file", name:"variables.tf",        size:"1.8 KB", changed:true  },
      { id:"outputs.tf",   type:"file", name:"outputs.tf",          size:"0.9 KB", changed:false },
      { id:"versions.tf",  type:"file", name:"versions.tf",         size:"0.4 KB", changed:false },
      { id:"modules",      type:"dir",  name:"modules/",            children:[
        { id:"vpc.tf",     type:"file", name:"vpc/main.tf",         size:"4.1 KB", changed:false },
        { id:"eks.tf",     type:"file", name:"eks/main.tf",         size:"6.8 KB", changed:true  },
        { id:"rds.tf",     type:"file", name:"rds/main.tf",         size:"2.4 KB", changed:false },
        { id:"sg.tf",      type:"file", name:"security_groups.tf",  size:"1.6 KB", changed:false },
        { id:"iam.tf",     type:"file", name:"iam.tf",              size:"3.1 KB", changed:true  },
        { id:"s3.tf",      type:"file", name:"s3.tf",               size:"1.2 KB", changed:false },
        { id:"lambda.tf",  type:"file", name:"lambda.tf",           size:"2.0 KB", changed:false },
      ]},
    ]},
  ];

  const FILES_MAP = {
    "main.tf":
`# ZolexTech & Consultant — AWS Production Infrastructure
# Managed by Terraform 1.7 | Owner: Adebayo Paul Oke
# Last applied: 2026-04-30

terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
  }
  backend "s3" {
    bucket         = "zolextech-tfstate-prod"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "zolextech-tf-locks"
    kms_key_id     = "alias/zolextech-tfstate-key"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "ZolexTech"
      Environment = var.environment
      ManagedBy   = "Terraform"
      Owner       = "adebayo.paul@zolextech.com"
    }
  }
}

module "vpc" {
  source  = "./modules/vpc"
  version = "3.19.0"
  name             = "zolextech-\${var.environment}"
  cidr             = var.vpc_cidr
  azs              = var.availability_zones
  private_subnets  = var.private_subnet_cidrs
  public_subnets   = var.public_subnet_cidrs
  enable_nat_gateway   = true
  single_nat_gateway   = var.environment != "prod"
  enable_dns_hostnames = true
  enable_flow_log      = true
}

module "eks" {
  source  = "./modules/eks"
  version = "20.8.3"
  cluster_name                   = "zolextech-\${var.environment}"
  cluster_version                = "1.29"
  vpc_id                         = module.vpc.vpc_id
  subnet_ids                     = module.vpc.private_subnets
  cluster_endpoint_public_access = false
  eks_managed_node_groups = {
    general = {
      instance_types = ["t3.medium"]
      min_size       = 2
      max_size       = 8
      desired_size   = 3
      disk_size      = 50
    }
  }
}

module "rds" {
  source            = "./modules/rds"
  identifier        = "zolextech-\${var.environment}"
  engine            = "postgres"
  engine_version    = "15.5"
  instance_class    = var.db_instance_class
  allocated_storage = 100
  storage_encrypted = true
  kms_key_id        = aws_kms_key.rds.arn
  multi_az          = var.environment == "prod"
  db_name           = "secureops"
  username          = "zt_admin"
  backup_retention_period = 30
  deletion_protection     = true
}`,

    "variables.tf":
`# Input Variables — ZolexTech Infrastructure
# Sensitive values sourced from AWS Secrets Manager

variable "aws_region" {
  description = "Primary AWS deployment region"
  type        = string
  default     = "us-east-1"
  validation {
    condition     = can(regex("^[a-z]+-[a-z]+-[0-9]$", var.aws_region))
    error_message = "Must be a valid AWS region identifier."
  }
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  validation {
    condition     = contains(["dev","staging","prod"], var.environment)
    error_message = "Must be dev, staging, or prod."
  }
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "private_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

variable "db_instance_class" {
  type    = string
  default = "db.t3.medium"
}`,

    "versions.tf":
`# Provider Version Constraints — pinned for reproducibility

terraform {
  required_version = ">= 1.7.0, < 2.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.27"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.13"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}`,

    "outputs.tf":
`# Infrastructure Outputs
# Referenced by CI/CD pipelines and application configs

output "vpc_id" {
  description = "VPC identifier"
  value       = module.vpc.vpc_id
}

output "eks_cluster_endpoint" {
  description = "EKS API server endpoint"
  value       = module.eks.cluster_endpoint
  sensitive   = true
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "rds_endpoint" {
  description = "PostgreSQL connection endpoint"
  value       = module.rds.db_instance_endpoint
  sensitive   = true
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}`,

    "security_groups.tf":
`# Security Groups — Zero-Trust Network Perimeter
# Compliance: SOC2-CC6.1, CIS AWS Foundations v2.0

resource "aws_security_group" "alb" {
  name        = "zolextech-alb-sg"
  description = "ALB — HTTPS inbound only"
  vpc_id      = module.vpc.vpc_id
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    description     = "To application tier"
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
  tags = { Name = "zolextech-alb-sg", Tier = "edge" }
}

resource "aws_security_group" "app" {
  name        = "zolextech-app-sg"
  description = "App tier — ALB only"
  vpc_id      = module.vpc.vpc_id
  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  egress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.db.id]
  }
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = { Name = "zolextech-app-sg", Tier = "application" }
}

resource "aws_security_group" "db" {
  name        = "zolextech-db-sg"
  description = "DB tier — app only"
  vpc_id      = module.vpc.vpc_id
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }
  tags = { Name = "zolextech-db-sg", Tier = "data" }
}`,

    "iam.tf":
`# IAM — Least Privilege (SOC2-CC6.3, CIS AWS 1.4)

resource "aws_iam_role" "eks_node" {
  name = "zolextech-eks-node-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
  tags = { Compliance = "SOC2-CC6.3" }
}

resource "aws_iam_role_policy_attachment" "eks_node_policies" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
  ])
  role       = aws_iam_role.eks_node.name
  policy_arn = each.value
}

# ── IRSA Application Role ──────────────────────────────────────
resource "aws_iam_role" "app" {
  name = "zolextech-app-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = module.eks.oidc_provider_arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "\${module.eks.oidc_provider}:sub" =
            "system:serviceaccount:default:secureops"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy" "app_s3" {
  name = "zolextech-app-s3-policy"
  role = aws_iam_role.app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = ["s3:GetObject","s3:PutObject","s3:ListBucket"]
        Resource = [
          aws_s3_bucket.app.arn,
          "\${aws_s3_bucket.app.arn}/*"
        ]
      },
      {
        Effect   = "Deny"
        Action   = ["s3:DeleteObject","s3:DeleteBucket"]
        Resource = "*"
      }
    ]
  })
}

resource "aws_kms_key" "rds" {
  description             = "ZolexTech RDS encryption key"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  tags = { Compliance = "SOC2-CC6.7" }
}`,
  };

  const PLAN_OUTPUT = [
    "Initializing the backend...",
    "  Acquiring state lock. This may take a few moments...",
    "",
    "Initializing provider plugins...",
    "  - Finding hashicorp/aws versions matching '~> 5.40'...",
    "  - Installing hashicorp/aws v5.40.0...",
    "  - Installed hashicorp/aws v5.40.0 (signed by HashiCorp)",
    "",
    "Terraform has been successfully initialized!",
    "",
    "Terraform will perform the following actions:",
    "",
    "  # module.eks.aws_eks_node_group.general will be updated in-place",
    "  ~ resource \"aws_eks_node_group\" \"general\" {",
    "    ~ scaling_config {",
    "      ~ desired_size = 3 -> 4",
    "        max_size     = 8",
    "        min_size     = 2",
    "    }",
    "  }",
    "",
    "  # aws_iam_role_policy.app_s3 will be updated in-place",
    "  ~ resource \"aws_iam_role_policy\" \"app_s3\" {",
    "    ~ policy = jsonencode({",
    "        + \"s3:ListBucket\" added to allowed actions",
    "    })",
    "  }",
    "",
    "  # module.vpc.aws_flow_log.this will be created",
    "  + resource \"aws_flow_log\" \"this\" {",
    "    + log_group_name = \"/aws/vpc/zolextech-prod\"",
    "    + traffic_type   = \"ALL\"",
    "    + vpc_id         = \"vpc-0a3f9b8c7d1e2f456\"",
    "  }",
    "",
    "Plan: 1 to add, 2 to change, 0 to destroy.",
    "",
    "Cost estimate: +$12.40/mo for VPC flow logs",
    "─────────────────────────────────────────────────────",
    "Saved plan to: /tmp/tfplan-20260507.bin",
  ];

  const APPLY_OUTPUT = [
    "module.eks.aws_eks_node_group.general: Modifying...",
    "module.eks.aws_eks_node_group.general: Still modifying... (5s elapsed)",
    "module.eks.aws_eks_node_group.general: Modifications complete after 8s",
    "",
    "aws_iam_role_policy.app_s3: Modifying...",
    "aws_iam_role_policy.app_s3: Modifications complete after 1s",
    "",
    "module.vpc.aws_flow_log.this: Creating...",
    "module.vpc.aws_flow_log.this: Creation complete after 3s",
    "  id = \"fl-0b8c9d1e2f3a4567\"",
    "",
    "Apply complete! Resources: 1 added, 2 changed, 0 destroyed.",
    "",
    "Outputs:",
    "  vpc_flow_log_id = \"fl-0b8c9d1e2f3a4567\"",
    "",
    "State written to: s3://zolextech-tfstate-prod/prod/terraform.tfstate",
    "DynamoDB lock released.",
  ];

  const runPlan = () => {
    if (planRunning) return;
    setPlanRunning(true); setPlanDone(false); setPlanLines([]); setApplyConfirm(false);
    let i = 0;
    const iv = setInterval(() => {
      setPlanLines(p => [...p, PLAN_OUTPUT[i]]);
      i++;
      if (i >= PLAN_OUTPUT.length) { clearInterval(iv); setPlanRunning(false); setPlanDone(true); }
    }, 80);
  };

  const runApply = () => {
    if (applyRunning || !planDone) return;
    setApplyRunning(true); setApplyDone(false); setApplyLines([]); setApplyConfirm(false);
    let i = 0;
    const iv = setInterval(() => {
      setApplyLines(p => [...p, APPLY_OUTPUT[i]]);
      i++;
      if (i >= APPLY_OUTPUT.length) { clearInterval(iv); setApplyRunning(false); setApplyDone(true); }
    }, 120);
  };

  const highlight = (code) => code.split("\n").map((line, i) => {
    let segments = [];
    if (line.trim().startsWith("#")) {
      segments = [{ text:line, color:T.textDim, italic:true }];
    } else {
      const kw = /\b(terraform|resource|module|variable|output|provider|locals|data|backend|required_providers|required_version|source|version|for_each|count|depends_on|lifecycle|validation|default|description|sensitive)\b/g;
      const tw = /\b(string|number|bool|list|map|set|object|tuple|any)\b/g;
      const bn = /\b(true|false|null)\b/g;
      let col = line
        .replace(/("(?:[^"\\]|\\.)*")/g, m => `§G§${m}§E§`)
        .replace(kw,  m => `§C§${m}§E§`)
        .replace(tw,  m => `§P§${m}§E§`)
        .replace(bn,  m => `§A§${m}§E§`)
        .replace(/\$\{[^}]+\}/g, m => `§A§${m}§E§`)
        .replace(/\b(aws_[a-z_]+|kubernetes_[a-z_]+)\b/g, m => `§O§${m}§E§`);
      const cmap = { G:T.green, C:T.cyan, P:T.purple, A:T.amber, O:T.orange };
      segments = col.split(/(§[A-Z]§[^§]*§E§)/g).map(part => {
        const m = part.match(/^§([A-Z])§(.*)§E§$/);
        if (m) return { text:m[2], color:cmap[m[1]]||T.text };
        return { text:part, color:T.text };
      });
    }
    return (
      <div key={i} style={{ display:"flex", minHeight:18 }}>
        <span style={{ color:T.bg3, fontFamily:"'JetBrains Mono',monospace", fontSize:11, minWidth:34, textAlign:"right", userSelect:"none", paddingRight:12, borderRight:`1px solid ${T.border}22`, marginRight:12 }}>{i+1}</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, whiteSpace:"pre", flex:1 }}>
          {segments.map((s,si) => <span key={si} style={{ color:s.color, fontStyle:s.italic?"italic":"normal" }}>{s.text}</span>)}
        </span>
      </div>
    );
  });

  const RESOURCES = [
    { type:"aws_vpc",                  icon:"◫",  name:"zolextech-prod",      region:"us-east-1", status:"ok",   cost:"—",       id:"vpc-0a3f9b8c"  },
    { type:"aws_internet_gateway",     icon:"🌐", name:"zolextech-igw",       region:"us-east-1", status:"ok",   cost:"—",       id:"igw-0b1c2d3e"  },
    { type:"aws_eks_cluster",          icon:"☸",  name:"zolextech-prod",      region:"us-east-1", status:"ok",   cost:"$144/mo", id:"zolextech-prod"},
    { type:"aws_eks_node_group",       icon:"⚡", name:"general",             region:"us-east-1", status:"ok",   cost:"$218/mo", id:"general"       },
    { type:"aws_db_instance",          icon:"🗄", name:"zolextech-prod",      region:"us-east-1", status:"ok",   cost:"$130/mo", id:"db-prod-pg15"  },
    { type:"aws_elasticache_cluster",  icon:"⚡", name:"zt-redis",            region:"us-east-1", status:"warn", cost:"$54/mo",  id:"zt-redis"      },
    { type:"aws_lb",                   icon:"⚖",  name:"zolextech-prod-alb",  region:"us-east-1", status:"ok",   cost:"$22/mo",  id:"alb-prod"      },
    { type:"aws_wafv2_web_acl",        icon:"🛡",  name:"zolextech-waf",       region:"us-east-1", status:"ok",   cost:"$6/mo",   id:"waf-prod"      },
    { type:"aws_s3_bucket",            icon:"🪣", name:"zolextech-app",       region:"us-east-1", status:"ok",   cost:"$14/mo",  id:"zt-app"        },
    { type:"aws_s3_bucket",            icon:"🪣", name:"zolextech-tfstate",   region:"us-east-1", status:"ok",   cost:"$2/mo",   id:"zt-tfstate"    },
    { type:"aws_ecr_repository",       icon:"📦", name:"secureops",           region:"us-east-1", status:"ok",   cost:"$8/mo",   id:"secureops"     },
    { type:"aws_cloudwatch_log_group", icon:"◎",  name:"/aws/eks/prod",       region:"us-east-1", status:"ok",   cost:"$12/mo",  id:"eks-logs"      },
    { type:"aws_kms_key",              icon:"🔑", name:"rds-encryption",      region:"us-east-1", status:"ok",   cost:"$1/mo",   id:"kms-rds"       },
    { type:"aws_secretsmanager_secret",icon:"🔐", name:"secureops/db-creds",  region:"us-east-1", status:"ok",   cost:"$0.40/mo",id:"sm-db"         },
    { type:"aws_iam_role",             icon:"◈",  name:"eks-node-role",       region:"global",    status:"ok",   cost:"—",       id:"zt-eks-node"   },
    { type:"aws_iam_role",             icon:"◈",  name:"app-role-irsa",       region:"global",    status:"ok",   cost:"—",       id:"zt-app-irsa"   },
    { type:"aws_security_group",       icon:"🛡",  name:"alb-sg",              region:"us-east-1", status:"ok",   cost:"—",       id:"sg-alb"        },
    { type:"aws_security_group",       icon:"🛡",  name:"app-sg",              region:"us-east-1", status:"ok",   cost:"—",       id:"sg-app"        },
    { type:"aws_security_group",       icon:"🛡",  name:"db-sg",               region:"us-east-1", status:"ok",   cost:"—",       id:"sg-db"         },
  ];

  const DRIFT = [
    { resource:"aws_security_group.app",        field:"ingress.from_port",  expected:"8080",    actual:"8080,9090",  severity:"high",   detected:"2h ago", desc:"Port 9090 (Prometheus) added outside Terraform. Reconcile or accept." },
    { resource:"aws_elasticache_cluster.redis",  field:"num_cache_nodes",    expected:"2",       actual:"1",          severity:"medium", detected:"2d ago", desc:"Redis replica failure reduced node count. Restore to 2 for Multi-AZ." },
    { resource:"aws_s3_bucket.app",             field:"versioning.status",  expected:"Enabled", actual:"Suspended",  severity:"high",   detected:"6h ago", desc:"S3 versioning manually disabled. Re-enable to protect against deletion." },
  ];

  const MODULES = [
    { name:"terraform-aws-vpc",       version:"3.19.0", latest:"3.19.0", ok:true,  downloads:"8.2M" },
    { name:"terraform-aws-eks",       version:"20.8.3", latest:"20.11.0",ok:false, downloads:"4.1M" },
    { name:"terraform-aws-rds",       version:"6.5.2",  latest:"6.5.2",  ok:true,  downloads:"5.7M" },
    { name:"terraform-aws-s3-bucket", version:"4.1.0",  latest:"4.1.1",  ok:false, downloads:"9.3M" },
  ];

  const COST_ITEMS = [
    { service:"EKS (cluster+nodes)", cost:362,  color:"#00d4ff", trend:"+$12" },
    { service:"RDS PostgreSQL",      cost:130,  color:"#bd5aff", trend:"stable" },
    { service:"Data Transfer",       cost:42,   color:"#4e708a", trend:"+$8" },
    { service:"ElastiCache Redis",   cost:54,   color:"#ffb300", trend:"-$27" },
    { service:"S3 (all)",            cost:16,   color:"#00ff9d", trend:"stable" },
    { service:"CloudWatch",          cost:12,   color:"#4e708a", trend:"stable" },
    { service:"WAF",                 cost:6,    color:"#ff3b5c", trend:"stable" },
    { service:"ECR",                 cost:8,    color:"#f46800", trend:"stable" },
    { service:"KMS + SM",            cost:2.4,  color:"#ffd700", trend:"stable" },
    { service:"ALB",                 cost:22,   color:"#ffb300", trend:"stable" },
    { service:"Other",               cost:586,  color:"#4e708a", trend:"+$22" },
  ];

  const ws  = WORKSPACES.find(w => w.id === workspace);
  const TABS = ["overview","editor","plan","resources","drift","modules","cost"];
  const TL   = { overview:"⬡ Overview", editor:"📝 Editor", plan:"⚡ Plan/Apply", resources:"◈ Resources", drift:"⚠ Drift", modules:"⊕ Modules", cost:"💰 Cost" };
  const statusC = { ok:T.green, warn:T.amber, error:T.red };

  const flatFiles = (tree) => {
    let out = [];
    tree.forEach(n => {
      if (n.type === "file") out.push(n);
      if (n.children) out = out.concat(flatFiles(n.children));
    });
    return out;
  };

  const FileNode = ({ node, depth=0 }) => {
    const isDir = node.type === "dir";
    const open  = expandedDirs.includes(node.id);
    const isSel = !isDir && selFile === node.name;
    return (
      <div>
        <button onClick={() => {
          if (isDir) setExpandedDirs(d => open ? d.filter(x=>x!==node.id) : [...d,node.id]);
          else setSelFile(node.name);
        }} style={{ width:"100%", display:"flex", alignItems:"center", gap:5, padding:`5px 10px 5px ${10+depth*12}px`, background:isSel?T.cyan+"12":"transparent", borderLeft:isSel?`2px solid ${T.cyan}`:"2px solid transparent", border:"none", cursor:"pointer", color:isSel?T.cyan:isDir?T.textBright:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontSize:10, textAlign:"left", transition:"all .1s" }}
          onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background=T.bg2; }}
          onMouseLeave={e=>{ if(!isSel) e.currentTarget.style.background="transparent"; }}>
          <span style={{flexShrink:0,opacity:.7}}>{isDir?(open?"▾":"▸"):"  "}</span>
          <span style={{flexShrink:0}}>{isDir?"📁":"📄"}</span>
          <span style={{ flex:1, marginLeft:4 }}>{node.name}</span>
          {node.changed && <span style={{ width:6, height:6, borderRadius:"50%", background:T.amber, display:"inline-block", flexShrink:0 }} />}
          {!isDir && <span style={{ fontSize:9, color:T.textDim, marginLeft:4 }}>{node.size}</span>}
        </button>
        {isDir && open && node.children?.map(child => <FileNode key={child.id} node={child} depth={depth+1} />)}
      </div>
    );
  };

  const termC = (l) => {
    if (l.startsWith("  +") || l.includes("complete") || l.includes("successfully") || l.startsWith("Apply complete") || l.includes("released")) return T.green;
    if (l.startsWith("  -")) return T.red;
    if (l.startsWith("  ~") || l.includes("Creating") || l.includes("Modifying") || l.includes("Still")) return T.amber;
    if (l.startsWith("Plan:") || l.startsWith("Terraform") || l.startsWith("Outputs:") || l.startsWith("Saved") || l.startsWith("State written")) return T.cyan;
    if (l.startsWith("  - Find") || l.startsWith("  - Install") || l.startsWith("Initializing")) return T.textDim;
    if (l.startsWith("Cost")) return T.gold;
    if (l.includes("Error")) return T.red;
    return T.text;
  };

  return (
    <div className="fadeIn">
      {/* Workspace selector */}
      <div style={{ display:"flex", gap:12, marginBottom:18 }}>
        {WORKSPACES.map(w => (
          <div key={w.id} onClick={() => setWorkspace(w.id)}
            style={{ flex:1, padding:"14px 18px", background:workspace===w.id?`${w.color}0e`:T.bg1, border:`1.5px solid ${workspace===w.id?w.color:T.border}`, borderRadius:8, cursor:"pointer", transition:"all .15s" }}
            onMouseEnter={e=>{ if(workspace!==w.id) e.currentTarget.style.borderColor=w.color+"55"; }}
            onMouseLeave={e=>{ if(workspace!==w.id) e.currentTarget.style.borderColor=T.border; }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <StatusDot status={w.status} />
                <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, color:workspace===w.id?w.color:T.textBright }}>{w.label}</span>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                {w.drifts>0 && <Badge color={T.amber}>{w.drifts} drift{w.drifts>1?"s":""}</Badge>}
                {workspace===w.id && <Badge color={w.color}>ACTIVE</Badge>}
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>RESOURCES</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, fontWeight:700, color:w.color }}>{w.resources}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>EST COST</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:T.gold }}>{w.cost}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>LAST APPLY</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.textDim }}>{w.lastApply}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", marginBottom:16, borderBottom:`1px solid ${T.border}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"9px 15px", background:"transparent", borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent", border:"none", cursor:"pointer", color:tab===t?T.cyan:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:12.5, display:"flex", alignItems:"center", gap:5 }}>
            {TL[t]}
            {t==="drift" && DRIFT.length>0 && <span style={{ background:T.red, color:"#fff", borderRadius:10, fontSize:9, padding:"1px 5px", fontFamily:"'JetBrains Mono',monospace" }}>{DRIFT.length}</span>}
            {t==="plan" && planDone && !applyDone && <span style={{ background:T.amber, color:"#000", borderRadius:10, fontSize:9, padding:"1px 5px", fontFamily:"'JetBrains Mono',monospace" }}>READY</span>}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card style={{ gridColumn:"1/-1", padding:"14px 18px" }}>
            <SectionHeader label={`AWS Architecture — ZolexTech ${ws.label} (us-east-1)`} accent={T.cyan} />
            <svg viewBox="0 0 880 310" style={{ width:"100%", fontFamily:"'JetBrains Mono',monospace" }}>
              <defs>
                <marker id="arr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <path d="M0,0.5 L5,2.5 L0,4.5 Z" fill={T.textDim+"bb"}/>
                </marker>
                <marker id="arr-c" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <path d="M0,0.5 L5,2.5 L0,4.5 Z" fill={T.cyan+"cc"}/>
                </marker>
                <marker id="arr-r" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                  <path d="M0,0.5 L5,2.5 L0,4.5 Z" fill={T.red+"cc"}/>
                </marker>
              </defs>
              <rect x="2" y="2" width="876" height="306" rx="8" fill={T.bg0} stroke={T.border} strokeWidth="1"/>
              {/* Zones */}
              <rect x="10" y="10" width="100" height="290" rx="5" fill={T.cyan+"07"} stroke={T.cyan+"33"} strokeDasharray="4 3" strokeWidth="1"/>
              <text x="60" y="26" textAnchor="middle" fill={T.cyan+"66"} fontSize="8" letterSpacing="1.5">INTERNET</text>
              <rect x="120" y="10" width="748" height="290" rx="5" fill={T.purple+"05"} stroke={T.purple+"2a"} strokeDasharray="4 3" strokeWidth="1"/>
              <text x="494" y="24" textAnchor="middle" fill={T.purple+"66"} fontSize="8" letterSpacing="1.5">VPC — 10.0.0.0/16 · us-east-1 · 3 AZs</text>
              {/* Subnets */}
              <rect x="128" y="30" width="200" height="262" rx="4" fill={T.amber+"07"} stroke={T.amber+"2a"} strokeDasharray="3 3" strokeWidth="1"/>
              <text x="228" y="44" textAnchor="middle" fill={T.amber+"66"} fontSize="7" letterSpacing="1">PUBLIC SUBNETS</text>
              <rect x="342" y="30" width="230" height="262" rx="4" fill={T.green+"05"} stroke={T.green+"1a"} strokeDasharray="3 3" strokeWidth="1"/>
              <text x="457" y="44" textAnchor="middle" fill={T.green+"66"} fontSize="7" letterSpacing="1">PRIVATE — APP</text>
              <rect x="586" y="30" width="192" height="130" rx="4" fill={T.purple+"05"} stroke={T.purple+"22"} strokeDasharray="3 3" strokeWidth="1"/>
              <text x="682" y="44" textAnchor="middle" fill={T.purple+"66"} fontSize="7" letterSpacing="1">PRIVATE — DATA</text>
              <rect x="586" y="172" width="192" height="120" rx="4" fill={T.orange+"05"} stroke={T.orange+"1a"} strokeDasharray="3 3" strokeWidth="1"/>
              <text x="682" y="186" textAnchor="middle" fill={T.orange+"66"} fontSize="7" letterSpacing="1">SERVICES</text>
              {/* Users */}
              <rect x="15" y="120" width="80" height="36" rx="4" fill={T.bg2} stroke={T.cyan} strokeWidth="1.5"/>
              <text x="55" y="134" textAnchor="middle" fill={T.cyan} fontSize="9" fontWeight="700">🌐 USERS</text>
              <text x="55" y="147" textAnchor="middle" fill={T.textDim} fontSize="7">HTTPS TLS 1.3</text>
              {/* WAF */}
              <rect x="136" y="52" width="84" height="30" rx="4" fill={T.bg2} stroke={T.red} strokeWidth="1.5"/>
              <text x="178" y="65" textAnchor="middle" fill={T.red} fontSize="8" fontWeight="700">🛡 WAF v2</text>
              <text x="178" y="76" textAnchor="middle" fill={T.textDim} fontSize="7">Shield Advanced</text>
              {/* ALB */}
              <rect x="136" y="100" width="84" height="30" rx="4" fill={T.bg2} stroke={T.amber} strokeWidth="1.5"/>
              <text x="178" y="113" textAnchor="middle" fill={T.amber} fontSize="8" fontWeight="700">⚖ ALB</text>
              <text x="178" y="124" textAnchor="middle" fill={T.textDim} fontSize="7">:443 HTTPS</text>
              {/* NAT */}
              <rect x="136" y="150" width="84" height="28" rx="4" fill={T.bg2} stroke={T.amber} strokeWidth="1"/>
              <text x="178" y="163" textAnchor="middle" fill={T.amber} fontSize="7" fontWeight="700">NAT GW × 3AZ</text>
              <text x="178" y="173" textAnchor="middle" fill={T.textDim} fontSize="6">Elastic IP</text>
              {/* Bastion */}
              <rect x="136" y="196" width="84" height="28" rx="4" fill={T.bg2} stroke={T.textDim} strokeWidth="1"/>
              <text x="178" y="209" textAnchor="middle" fill={T.textDim} fontSize="8">Bastion</text>
              <text x="178" y="220" textAnchor="middle" fill={T.textDim} fontSize="7">SSH jump</text>
              {/* IGW */}
              <rect x="136" y="242" width="84" height="28" rx="4" fill={T.bg2} stroke={T.cyan} strokeWidth="1"/>
              <text x="178" y="255" textAnchor="middle" fill={T.cyan} fontSize="8">IGW</text>
              <text x="178" y="266" textAnchor="middle" fill={T.textDim} fontSize="7">Internet GW</text>
              {/* EKS */}
              <rect x="350" y="52" width="116" height="56" rx="4" fill={T.bg2} stroke={T.cyan} strokeWidth="2"/>
              <text x="408" y="70" textAnchor="middle" fill={T.cyan} fontSize="9" fontWeight="700">☸ EKS 1.29</text>
              <text x="408" y="83" textAnchor="middle" fill={T.textDim} fontSize="7">3× t3.medium nodes</text>
              <text x="408" y="96" textAnchor="middle" fill={T.green} fontSize="7">● 3/3 healthy pods</text>
              {/* Workers */}
              <rect x="350" y="122" width="116" height="36" rx="4" fill={T.bg2} stroke={T.orange} strokeWidth="1"/>
              <text x="408" y="136" textAnchor="middle" fill={T.orange} fontSize="8" fontWeight="700">⚙ Celery Workers</text>
              <text x="408" y="148" textAnchor="middle" fill={T.textDim} fontSize="7">2× replicas</text>
              {/* Prometheus */}
              <rect x="350" y="172" width="116" height="36" rx="4" fill={T.bg2} stroke={T.orange} strokeWidth="1"/>
              <text x="408" y="186" textAnchor="middle" fill={T.orange} fontSize="8" fontWeight="700">▣ Grafana + Prom</text>
              <text x="408" y="198" textAnchor="middle" fill={T.textDim} fontSize="7">metrics + dashboards</text>
              {/* ECR */}
              <rect x="350" y="222" width="116" height="36" rx="4" fill={T.bg2} stroke={T.orange} strokeWidth="1"/>
              <text x="408" y="237" textAnchor="middle" fill={T.orange} fontSize="8" fontWeight="700">📦 ECR</text>
              <text x="408" y="249" textAnchor="middle" fill={T.textDim} fontSize="7">container registry</text>
              {/* RDS */}
              <rect x="594" y="48" width="96" height="48" rx="4" fill={T.bg2} stroke={T.purple} strokeWidth="2"/>
              <text x="642" y="65" textAnchor="middle" fill={T.purple} fontSize="9" fontWeight="700">🗄 RDS PG 15</text>
              <text x="642" y="78" textAnchor="middle" fill={T.green} fontSize="7">Multi-AZ ✓</text>
              <text x="642" y="88" textAnchor="middle" fill={T.textDim} fontSize="7">db.t3.medium</text>
              {/* Redis — with drift indicator */}
              <rect x="594" y="110" width="96" height="44" rx="4" fill={T.bg2} stroke={T.amber} strokeWidth="1.5"/>
              <text x="642" y="126" textAnchor="middle" fill={T.amber} fontSize="8" fontWeight="700">⚡ Redis 7.2</text>
              <text x="642" y="138" textAnchor="middle" fill={T.red} fontSize="7">⚠ 1/2 nodes DRIFT</text>
              <text x="642" y="148" textAnchor="middle" fill={T.textDim} fontSize="7">ElastiCache</text>
              <circle cx="688" cy="110" r="5" fill={T.amber}>
                <animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              {/* S3 */}
              <rect x="594" y="186" width="96" height="36" rx="4" fill={T.bg2} stroke={T.green} strokeWidth="1"/>
              <text x="642" y="201" textAnchor="middle" fill={T.green} fontSize="8" fontWeight="700">🪣 S3 Buckets</text>
              <text x="642" y="213" textAnchor="middle" fill={T.textDim} fontSize="7">encrypted · versioned</text>
              {/* KMS */}
              <rect x="594" y="236" width="96" height="36" rx="4" fill={T.bg2} stroke={T.gold} strokeWidth="1"/>
              <text x="642" y="251" textAnchor="middle" fill={T.gold} fontSize="8" fontWeight="700">🔑 KMS + SM</text>
              <text x="642" y="263" textAnchor="middle" fill={T.textDim} fontSize="7">rotation ✓</text>
              {/* CloudWatch */}
              <rect x="796" y="48" width="78" height="40" rx="4" fill={T.bg2} stroke={T.textDim} strokeWidth="1"/>
              <text x="835" y="64" textAnchor="middle" fill={T.textDim} fontSize="8">CloudWatch</text>
              <text x="835" y="76" textAnchor="middle" fill={T.textDim} fontSize="7">Logs 90d</text>
              {/* IAM */}
              <rect x="796" y="100" width="78" height="40" rx="4" fill={T.bg2} stroke={T.red} strokeWidth="1"/>
              <text x="835" y="116" textAnchor="middle" fill={T.red} fontSize="8">◈ IAM</text>
              <text x="835" y="128" textAnchor="middle" fill={T.textDim} fontSize="7">least privilege</text>
              {/* Arrows */}
              <line x1="95" y1="138" x2="134" y2="115" stroke={T.cyan} strokeWidth="1.5" markerEnd="url(#arr-c)"/>
              <line x1="220" y1="67" x2="220" y2="98" stroke={T.red+"88"} strokeWidth="1" markerEnd="url(#arr-r)"/>
              <line x1="220" y1="115" x2="348" y2="80" stroke={T.amber} strokeWidth="1.5" markerEnd="url(#arr)"/>
              <line x1="466" y1="80" x2="592" y2="72" stroke={T.purple+"88"} strokeWidth="1.2" markerEnd="url(#arr)"/>
              <line x1="466" y1="80" x2="592" y2="132" stroke={T.amber+"66"} strokeWidth="1" markerEnd="url(#arr)"/>
              <line x1="466" y1="80" x2="592" y2="204" stroke={T.green+"66"} strokeWidth="1" markerEnd="url(#arr)"/>
              <line x1="466" y1="80" x2="794" y2="68" stroke={T.textDim+"44"} strokeWidth="1" markerEnd="url(#arr)"/>
              <line x1="690" y1="96" x2="794" y2="120" stroke={T.textDim+"33"} strokeWidth="1" markerEnd="url(#arr)"/>
            </svg>
          </Card>

          <Card>
            <SectionHeader label="Resource Summary" accent={T.cyan} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              {[
                {l:"Total Resources",  v:ws.resources, c:T.cyan},
                {l:"Running Pods",     v:5,            c:T.green},
                {l:"RDS Instances",    v:1,            c:T.purple},
                {l:"Security Groups",  v:3,            c:T.red},
                {l:"IAM Roles",        v:8,            c:T.orange},
                {l:"KMS Keys",         v:3,            c:T.gold},
                {l:"S3 Buckets",       v:2,            c:T.amber},
                {l:"Est. Monthly",     v:ws.cost,      c:T.gold},
              ].map(r => (
                <div key={r.l} style={{ padding:"9px 12px", background:T.bg2, borderRadius:6, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>{r.l}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:r.c }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:"10px 12px", background:T.green+"0a", border:`1px solid ${T.green}33`, borderRadius:6 }}>
              <div style={{ fontSize:12, color:T.green, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, marginBottom:2 }}>✓ State synced 2 minutes ago</div>
              <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>s3://zolextech-tfstate-prod/prod/terraform.tfstate</div>
            </div>
          </Card>

          <Card>
            <SectionHeader label="CIS AWS Compliance" accent={T.green} />
            {[
              {label:"CIS AWS Benchmark v3.0",  score:94,  color:T.green},
              {label:"Encryption at Rest",       score:100, color:T.green},
              {label:"Encryption in Transit",    score:100, color:T.green},
              {label:"MFA on Root Account",      score:100, color:T.green},
              {label:"CloudTrail All Regions",   score:100, color:T.green},
              {label:"S3 Block Public Access",   score:100, color:T.green},
              {label:"VPC Flow Logs",            score:50,  color:T.amber},
              {label:"AWS GuardDuty",            score:0,   color:T.red},
            ].map(c => (
              <div key={c.label} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:12, color:T.text, fontFamily:"'Rajdhani',sans-serif" }}>{c.label}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:c.color, fontFamily:"'JetBrains Mono',monospace" }}>{c.score}%</span>
                </div>
                <div style={{ height:3, background:T.bg3, borderRadius:2 }}>
                  <div style={{ width:`${c.score}%`, height:"100%", background:c.color, borderRadius:2, transition:"width .6s" }} />
                </div>
              </div>
            ))}
            {ws.drifts > 0 && (
              <div style={{ marginTop:12, padding:"9px 12px", background:T.amber+"09", border:`1px solid ${T.amber}33`, borderRadius:5 }}>
                <div style={{ fontSize:12, color:T.amber, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>⚠ {ws.drifts} resource{ws.drifts>1?"s":""} drifted from IaC state</div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* EDITOR */}
      {tab==="editor" && (
        <div style={{ display:"grid", gridTemplateColumns:"210px 1fr", gap:14, alignItems:"start" }}>
          <Card style={{ padding:"8px 0" }}>
            <div style={{ padding:"0 12px 8px", borderBottom:`1px solid ${T.border}`, marginBottom:4 }}>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, color:T.textBright, marginBottom:2 }}>Explorer</div>
              <div style={{ fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>ws: {workspace}</div>
            </div>
            {FILE_TREE.map(n => <FileNode key={n.id} node={n} />)}
            <div style={{ margin:"10px 10px 0", padding:"8px 10px", background:T.bg2, borderRadius:5, border:`1px solid ${T.amber}33` }}>
              <div style={{ fontSize:9, color:T.amber, fontFamily:"'JetBrains Mono',monospace", marginBottom:4, letterSpacing:1 }}>● MODIFIED</div>
              {flatFiles(FILE_TREE).filter(f=>f.changed).map(f=>(
                <div key={f.id} onClick={()=>setSelFile(f.name)} style={{ fontSize:10, color:T.amber, fontFamily:"'JetBrains Mono',monospace", cursor:"pointer", padding:"2px 0", display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:T.amber, display:"inline-block", flexShrink:0 }}/>
                  {f.name}
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding:0, overflow:"hidden" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 16px", borderBottom:`1px solid ${T.border}`, background:T.bg0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:12 }}>📄</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.textBright }}>{selFile}</span>
                {flatFiles(FILE_TREE).find(f=>f.name===selFile)?.changed && <Badge color={T.amber}>Modified</Badge>}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Badge color={T.cyan}>HCL</Badge>
                <Badge color={T.purple}>ws: {workspace}</Badge>
              </div>
            </div>
            <div style={{ background:T.bg0, overflowX:"auto", overflowY:"auto", maxHeight:560, padding:"10px 0", lineHeight:1.9 }}>
              {highlight(FILES_MAP[selFile] || `# File: ${selFile}\n# Content not loaded`)}
            </div>
          </Card>
        </div>
      )}

      {/* PLAN/APPLY */}
      {tab==="plan" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:T.bg0 }}>
              <div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:T.textBright }}>terraform plan</div>
                <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>ws: {workspace} · 3 files changed</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {planDone && <Badge color={T.green}>1 add · 2 change · 0 destroy</Badge>}
                <button onClick={runPlan} disabled={planRunning}
                  style={{ padding:"7px 16px", background:planRunning?T.bg3:T.cyan+"18", border:`1px solid ${planRunning?T.border:T.cyan}`, borderRadius:5, color:planRunning?T.textDim:T.cyan, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:planRunning?"default":"pointer", display:"flex", alignItems:"center", gap:7 }}>
                  {planRunning?<><span style={{ animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Planning…</>:"▶ Run Plan"}
                </button>
              </div>
            </div>
            <div ref={planRef} style={{ background:"#030608", padding:"12px 14px", height:460, overflowY:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:11, lineHeight:1.9 }}>
              {planLines.length===0 && <div style={{ color:T.textDim }}>▸ Click &quot;Run Plan&quot; to preview infrastructure changes…</div>}
              {planLines.map((l, i) => <div key={i} style={{ color:termC(l), whiteSpace:"pre" }}>{l || " "}</div>)}
              {planRunning && <div style={{ color:T.amber, animation:"pulse 1s infinite" }}>█</div>}
            </div>
          </Card>

          <Card style={{ padding:0, overflow:"hidden" }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", background:T.bg0 }}>
              <div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:T.textBright }}>terraform apply</div>
                <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{planDone?"plan complete — ready to apply":"run plan first"}</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                {applyDone && <Badge color={T.green}>✓ Applied Successfully</Badge>}
                {planDone && !applyDone && !applyConfirm && (
                  <button onClick={()=>setApplyConfirm(true)}
                    style={{ padding:"7px 16px", background:T.amber+"18", border:`1px solid ${T.amber}`, borderRadius:5, color:T.amber, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>
                    ▶ Apply
                  </button>
                )}
                {applyConfirm && !applyDone && !applyRunning && (
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <span style={{ fontSize:10, color:T.red, fontFamily:"'JetBrains Mono',monospace" }}>Apply to {workspace}?</span>
                    <button onClick={runApply} style={{ padding:"5px 10px", background:T.red+"18", border:`1px solid ${T.red}`, borderRadius:4, color:T.red, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:11, cursor:"pointer" }}>Yes</button>
                    <button onClick={()=>setApplyConfirm(false)} style={{ padding:"5px 8px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:11, cursor:"pointer" }}>No</button>
                  </div>
                )}
              </div>
            </div>
            <div ref={applyRef} style={{ background:"#030608", padding:"12px 14px", height:460, overflowY:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:11, lineHeight:1.9 }}>
              {!planDone && <div style={{ color:T.textDim }}>▸ Run terraform plan first to preview changes.</div>}
              {planDone && applyLines.length===0 && !applyConfirm && <div style={{ color:T.textDim }}>▸ Plan is ready. Click &quot;Apply&quot; to provision the changes.</div>}
              {applyConfirm && applyLines.length===0 && <div style={{ color:T.amber }}>▸ Awaiting confirmation…</div>}
              {applyLines.map((l, i) => <div key={i} style={{ color:termC(l), whiteSpace:"pre" }}>{l || " "}</div>)}
              {applyRunning && <div style={{ color:T.green, animation:"pulse 1s infinite" }}>█</div>}
            </div>
          </Card>
        </div>
      )}

      {/* RESOURCES */}
      {tab==="resources" && (
        <Card style={{ padding:0 }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <SectionHeader label={`Managed Resources — ${ws.label} (${RESOURCES.length})`} accent={T.cyan} />
            <div style={{ display:"flex", gap:8 }}>
              <Badge color={T.gold}>{ws.cost}</Badge>
              {RESOURCES.filter(r=>r.status==="warn").length>0 && <Badge color={T.amber}>{RESOURCES.filter(r=>r.status==="warn").length} warn</Badge>}
            </div>
          </div>
          <div style={{ overflowY:"auto", maxHeight:540 }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead style={{ position:"sticky", top:0, background:T.bg1, zIndex:2 }}>
                <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                  {["","Resource Type","Name","Region","Status","Est. Cost","ID",""].map(h=>(
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontWeight:400, letterSpacing:1, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{RESOURCES.map((r, i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${T.border}11` }}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":T.bg0+"55"}>
                  <td style={{ padding:"9px 12px", fontSize:15 }}>{r.icon}</td>
                  <td style={{ padding:"9px 12px" }}>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.purple, background:T.purple+"10", padding:"2px 6px", borderRadius:3 }}>{r.type}</span>
                  </td>
                  <td style={{ padding:"9px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.textBright, fontWeight:600 }}>{r.name}</td>
                  <td style={{ padding:"9px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.textDim }}>{r.region}</td>
                  <td style={{ padding:"9px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <StatusDot status={r.status}/>
                      <span style={{ fontSize:10, color:statusC[r.status], fontFamily:"'JetBrains Mono',monospace" }}>{r.status.toUpperCase()}</span>
                    </div>
                  </td>
                  <td style={{ padding:"9px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:700, color:r.cost==="—"?T.textDim:T.gold }}>{r.cost}</td>
                  <td style={{ padding:"9px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.textDim }}>{r.id}</td>
                  <td style={{ padding:"9px 12px" }}>
                    <button style={{ padding:"3px 8px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:3, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:9 }}>Inspect</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
            <div style={{ padding:"8px 14px", borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", background:T.bg0 }}>
              <span style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{RESOURCES.length} resources · {RESOURCES.filter(r=>r.cost!=="—").length} billable</span>
              <span style={{ fontSize:11, color:T.gold, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>Total: {ws.cost}</span>
            </div>
          </div>
        </Card>
      )}

      {/* DRIFT */}
      {tab==="drift" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div>
            <Card style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <SectionHeader label="Active Drift Detections" accent={T.red} />
                <div style={{ display:"flex", gap:8 }}>
                  <Badge color={T.red}>{DRIFT.length} drifted</Badge>
                  <button onClick={()=>setTab("plan")} style={{ padding:"6px 14px", background:T.cyan+"14", border:`1px solid ${T.cyan}44`, borderRadius:5, color:T.cyan, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>⚡ Reconcile All</button>
                </div>
              </div>
              {DRIFT.map((d, i) => (
                <div key={i} style={{ padding:"14px 16px", background:T.bg2, borderRadius:6, border:`1px solid ${d.severity==="high"?T.red:T.amber}33`, borderLeft:`3px solid ${d.severity==="high"?T.red:T.amber}`, marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.textBright, fontWeight:600 }}>{d.resource}</div>
                      <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>
                        field: <span style={{ color:T.cyan }}>{d.field}</span> · detected {d.detected}
                      </div>
                    </div>
                    <Badge color={d.severity==="high"?T.red:T.amber}>{d.severity.toUpperCase()}</Badge>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                    <div style={{ padding:"8px 12px", background:T.bg0, borderRadius:5, border:`1px solid ${T.green}33` }}>
                      <div style={{ fontSize:9, color:T.green, fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>DESIRED (IaC)</div>
                      <div style={{ fontSize:14, color:T.green, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{d.expected}</div>
                    </div>
                    <div style={{ padding:"8px 12px", background:T.bg0, borderRadius:5, border:`1px solid ${T.red}33` }}>
                      <div style={{ fontSize:9, color:T.red, fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>ACTUAL (AWS)</div>
                      <div style={{ fontSize:14, color:T.red, fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{d.actual}</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", marginBottom:10, lineHeight:1.6 }}>{d.desc}</div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setTab("plan")} style={{ flex:1, padding:"7px 0", background:T.cyan+"12", border:`1px solid ${T.cyan}44`, borderRadius:5, color:T.cyan, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>⚡ Reconcile with Plan</button>
                    <button style={{ flex:1, padding:"7px 0", background:"transparent", border:`1px solid ${T.border}`, borderRadius:5, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:12, cursor:"pointer" }}>Accept Drift</button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <Card>
            <SectionHeader label="Drift History — Last 30 Days" accent={T.amber} />
            {[
              {resource:"aws_s3_bucket.tfstate",   field:"versioning",    date:"Apr 29 11:32", resolved:true,  sev:"medium"},
              {resource:"aws_iam_role.app",         field:"max_session",   date:"Apr 27 09:18", resolved:true,  sev:"low"},
              {resource:"aws_security_group.app",   field:"ingress.port",  date:"Apr 25 14:05", resolved:false, sev:"high"},
              {resource:"module.eks.node_group",    field:"desired_size",  date:"Apr 22 08:44", resolved:true,  sev:"low"},
              {resource:"aws_elasticache.redis",    field:"num_nodes",     date:"Apr 21 17:30", resolved:false, sev:"medium"},
              {resource:"aws_cloudwatch_alarm.cpu", field:"threshold",     date:"Apr 18 10:12", resolved:true,  sev:"low"},
              {resource:"aws_s3_bucket.app",        field:"lifecycle_rule", date:"Apr 14 14:55", resolved:true,  sev:"low"},
            ].map((h, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:`1px solid ${T.border}` }}>
                <span style={{ fontSize:14, color:h.resolved?T.green:T.amber, width:16 }}>{h.resolved?"✓":"⚠"}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.text }}>{h.resource}</div>
                  <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{h.field} · {h.date}</div>
                </div>
                <Badge color={h.resolved?T.green:h.sev==="high"?T.red:T.amber}>{h.resolved?"RESOLVED":h.sev.toUpperCase()}</Badge>
              </div>
            ))}
            <div style={{ marginTop:14, padding:"10px 12px", background:T.amber+"08", border:`1px solid ${T.amber}33`, borderRadius:6 }}>
              <div style={{ fontSize:12, color:T.amber, fontFamily:"'Rajdhani',sans-serif", fontWeight:600 }}>⚠ Drift scan runs every 6 hours</div>
              <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>Next scan: 3h 22m · Last scan: 2m ago</div>
            </div>
          </Card>
        </div>
      )}

      {/* MODULES */}
      {tab==="modules" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          {MODULES.map(m => (
            <Card key={m.name}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:T.textBright, fontWeight:700, marginBottom:3 }}>{m.name}</div>
                  <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>registry.terraform.io · ↓ {m.downloads}</div>
                </div>
                <Badge color={m.ok?T.green:T.amber}>{m.ok?"CURRENT":"UPDATE AVAIL"}</Badge>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
                {[["INSTALLED", m.version, m.ok?T.green:T.amber], ["LATEST", m.latest, T.green]].map(([k,v,c]) => (
                  <div key={k} style={{ padding:"9px 12px", background:T.bg2, borderRadius:6 }}>
                    <div style={{ fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginBottom:3, letterSpacing:1 }}>{k}</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:17, fontWeight:700, color:c }}>v{v}</div>
                  </div>
                ))}
              </div>
              {!m.ok && <button style={{ width:"100%", padding:"8px 0", background:T.amber+"12", border:`1px solid ${T.amber}44`, borderRadius:5, color:T.amber, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>↑ Upgrade to v{m.latest}</button>}
            </Card>
          ))}
          <Card style={{ gridColumn:"1/-1" }}>
            <SectionHeader label=".terraform.lock.hcl — Provider Lock File" accent={T.textDim} />
            <div style={{ background:T.bg0, borderRadius:6, padding:"14px 18px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, lineHeight:2.0, border:`1px solid ${T.border}` }}>
              {[
                [T.text,   `provider "registry.terraform.io/hashicorp/aws" {`],
                [T.purple, `  version     = "5.40.0"`],
                [T.purple, `  constraints = "~> 5.40"`],
                [T.purple, `  hashes      = [`],
                [T.green,  `    "h1:7xHuNKy/x5kLYwDXuvBx4fMH3xbJHM4DdKPxnhWuBlo=",`],
                [T.green,  `    "zh:0845c0f6c3df8c573673d0a2f7c8c3e3e7823e5ad8ceef0a76de07c9edd81b65",`],
                [T.textDim,`  ]`],
                [T.text,   `}`],
                [T.text,   ``],
                [T.text,   `provider "registry.terraform.io/hashicorp/kubernetes" {`],
                [T.purple, `  version     = "2.27.0"`],
                [T.purple, `  constraints = "~> 2.27"`],
                [T.text,   `}`],
              ].map(([c, txt], i) => (
                <div key={i} style={{ color:c, whiteSpace:"pre" }}>{txt}</div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* COST */}
      {tab==="cost" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card>
            <SectionHeader label="Cost Breakdown — Current Month" accent={T.gold} />
            <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:18 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:40, fontWeight:700, color:T.gold, lineHeight:1 }}>$1,240</div>
                <div style={{ fontSize:11, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>est. / month</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>vs last month ($1,198)</span>
                  <span style={{ fontSize:12, color:T.red, fontFamily:"'JetBrains Mono',monospace" }}>▲ +3.5%</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>Budget: $1,500/mo</span>
                  <span style={{ fontSize:12, color:T.green, fontFamily:"'JetBrains Mono',monospace" }}>83% used</span>
                </div>
                <div style={{ height:6, background:T.bg3, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ width:"83%", height:"100%", background:`linear-gradient(90deg,${T.green},${T.amber})`, borderRadius:3 }}/>
                </div>
              </div>
            </div>
            {COST_ITEMS.map(c => (
              <div key={c.service} style={{ marginBottom:9 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:12, color:T.text, fontFamily:"'Rajdhani',sans-serif" }}>{c.service}</span>
                  <div style={{ display:"flex", gap:10 }}>
                    <span style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{c.trend}</span>
                    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:c.color }}>${c.cost.toFixed(0)}</span>
                  </div>
                </div>
                <div style={{ height:4, background:T.bg3, borderRadius:2 }}>
                  <div style={{ width:`${Math.min((c.cost/1240)*100,100)}%`, height:"100%", background:c.color, borderRadius:2 }}/>
                </div>
              </div>
            ))}
          </Card>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Card>
              <SectionHeader label="Savings Opportunities" accent={T.green} />
              {[
                {title:"Right-size EKS nodes",      saving:"$72/mo", effort:"Low",    desc:"3× t3.medium at 18% avg CPU. Downsize to t3.small."},
                {title:"Reserved Instances (RDS)",   saving:"$42/mo", effort:"Medium", desc:"1-year RI would save ~34% on db.t3.medium."},
                {title:"Spot EKS dev nodes",         saving:"$88/mo", effort:"Medium", desc:"Dev cluster on Spot saves ~60% vs on-demand."},
                {title:"S3 Intelligent-Tiering",     saving:"$6/mo",  effort:"Low",    desc:"Auto-move infrequent objects to cheaper tiers."},
              ].map((op, i) => (
                <div key={i} style={{ padding:"10px 13px", background:T.bg2, borderRadius:6, marginBottom:8, border:`1px solid ${T.green}22` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                    <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, color:T.textBright }}>{op.title}</div>
                    <div style={{ display:"flex", gap:6 }}>
                      <Badge color={op.effort==="Low"?T.green:T.amber}>{op.effort}</Badge>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, fontWeight:700, color:T.green }}>{op.saving}</span>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>{op.desc}</div>
                </div>
              ))}
              <div style={{ padding:"9px 12px", background:T.green+"08", border:`1px solid ${T.green}33`, borderRadius:6 }}>
                <div style={{ fontSize:13, color:T.green, fontFamily:"'Rajdhani',sans-serif", fontWeight:700 }}>Total potential: $208/mo savings (17%)</div>
              </div>
            </Card>
            <Card>
              <SectionHeader label="Cost by Workspace" accent={T.gold} />
              {WORKSPACES.map(w => {
                const costs = {prod:1240, staging:389, dev:142};
                const total = 1771;
                const c = costs[w.id];
                return (
                  <div key={w.id} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13, color:w.color }}>{w.label}</span>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:T.gold }}>${c}/mo</span>
                    </div>
                    <div style={{ height:6, background:T.bg3, borderRadius:3 }}>
                      <div style={{ width:`${(c/total)*100}%`, height:"100%", background:w.color, borderRadius:3 }}/>
                    </div>
                    <div style={{ fontSize:9, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>{Math.round((c/total)*100)}% of total spend</div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};


const ScanningView = () => {
  const [tab, setTab]         = useState("overview");
  const [selFinding, setSelFinding] = useState(null);
  const [scanning, setScanning]     = useState(null);
  const [progress, setProgress]     = useState({});

  const start = (id) => {
    setScanning(id); setProgress({[id]:0});
    let p=0; const iv=setInterval(()=>{ p+=rand(6,14); setProgress(prev=>({...prev,[id]:Math.min(p,100)})); if(p>=100){clearInterval(iv);setScanning(null);} },200);
  };

  const FINDINGS = [
    {id:"F-001",tool:"Trivy",    sev:"CRITICAL",cvss:9.8, cve:"CVE-2023-44487",title:"HTTP/2 Rapid Reset Attack",              component:"nginx:1.24.0",           file:"Dockerfile:3",  status:"open",   fix:"Upgrade to nginx ≥ 1.25.3",  desc:"A flaw in HTTP/2 protocol allows a remote attacker to send a large number of RST_STREAM frames, causing a denial of service. CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:H"},
    {id:"F-002",tool:"Bandit",   sev:"HIGH",   cvss:7.5, cve:"B105",            title:"Hardcoded Password String",              component:"app/auth.py",            file:"app/auth.py:42",status:"open",   fix:"Use environment variable or secrets manager", desc:"A hardcoded password string was found. This exposes sensitive credentials in source code and version control. Rotate the secret immediately and use AWS Secrets Manager."},
    {id:"F-003",tool:"ZAP",      sev:"HIGH",   cvss:7.2, cve:"CWE-352",         title:"Missing Anti-CSRF Token",                component:"POST /api/v1/update",    file:"routes/user.py",status:"open",   fix:"Implement CSRF middleware",   desc:"The application does not include CSRF tokens in state-changing requests. An attacker could trick authenticated users into submitting malicious requests."},
    {id:"F-004",tool:"Trivy",    sev:"HIGH",   cvss:7.8, cve:"CVE-2024-0232",   title:"SQLite Use-After-Free",                  component:"python:3.11.4",          file:"requirements.txt",status:"in_progress",fix:"Upgrade to Python ≥ 3.11.8", desc:"A use-after-free vulnerability in SQLite bundled with Python. Under certain conditions this could lead to arbitrary code execution. Upgrade immediately."},
    {id:"F-005",tool:"Checkov",  sev:"HIGH",   cvss:6.8, cve:"CKV_AWS_18",      title:"S3 Access Logging Disabled",             component:"aws_s3_bucket.app",      file:"main.tf:88",    status:"open",   fix:"Enable access logging on bucket", desc:"S3 bucket does not have access logging enabled. This violates SOC2 CC7.2 and makes forensic investigation of unauthorized access impossible."},
    {id:"F-006",tool:"Bandit",   sev:"MEDIUM", cvss:5.3, cve:"B311",            title:"Non-Cryptographic Random Generator",     component:"utils/token.py",         file:"utils/token.py:18",status:"open",fix:"Use secrets.token_hex() instead", desc:"The standard random module is not suitable for security-sensitive operations. Use the secrets module for generating tokens, passwords, and nonces."},
    {id:"F-007",tool:"ZAP",      sev:"MEDIUM", cvss:4.3, cve:"CWE-79",          title:"Reflected Cross-Site Scripting",         component:"GET /search",            file:"routes/search.py",status:"open",fix:"Sanitize and encode user input", desc:"The 'q' parameter is reflected in the response without proper encoding. An attacker could inject malicious scripts executed in victims' browsers."},
    {id:"F-008",tool:"Checkov",  sev:"MEDIUM", cvss:4.0, cve:"CKV_AWS_116",     title:"Lambda Missing Dead Letter Queue",        component:"aws_lambda_function",    file:"lambda.tf:23",  status:"open",   fix:"Configure DLQ for Lambda function", desc:"Lambda function has no dead-letter queue configured. Failed invocations will be silently dropped, leading to data loss and reduced observability."},
    {id:"F-009",tool:"Trivy",    sev:"MEDIUM", cvss:4.7, cve:"CVE-2024-1086",   title:"Linux Kernel Privilege Escalation",      component:"base image",             file:"Dockerfile:1",  status:"resolved",fix:"Update base image",        desc:"A vulnerability in the Linux kernel netfilter nf_tables subsystem. Local attackers may be able to escalate privileges. Update base image to latest."},
    {id:"F-010",tool:"Bandit",   sev:"LOW",    cvss:2.1, cve:"B101",            title:"Assert Used for Security Check",         component:"tests/",                 file:"tests/test_api.py:7",status:"resolved",fix:"Replace with explicit check", desc:"Use of assert statements for security validation. These are stripped in optimized Python (-O flag) and should not be relied upon for security decisions."},
  ];

  const TOOLS = [
    {id:"bandit",  name:"Bandit",     desc:"Python SAST",       icon:"🐍", color:T.amber,  version:"1.7.8",  lastRun:"9 min ago", findings:FINDINGS.filter(f=>f.tool==="Bandit").length},
    {id:"zap",     name:"OWASP ZAP",  desc:"DAST",              icon:"🔍", color:T.red,    version:"2.14.0", lastRun:"2 hr ago",  findings:FINDINGS.filter(f=>f.tool==="ZAP").length},
    {id:"trivy",   name:"Trivy",      desc:"Container & IaC",   icon:"🐳", color:T.cyan,   version:"0.51.0", lastRun:"9 min ago", findings:FINDINGS.filter(f=>f.tool==="Trivy").length},
    {id:"checkov", name:"Checkov",    desc:"IaC Policy",        icon:"✅", color:T.green,  version:"3.2.2",  lastRun:"9 min ago", findings:FINDINGS.filter(f=>f.tool==="Checkov").length},
  ];

  const sevC = {CRITICAL:T.red, HIGH:T.red, MEDIUM:T.amber, LOW:T.textDim, INFO:T.cyan};
  const statC = {open:T.red, in_progress:T.amber, resolved:T.green};

  const openFindings   = FINDINGS.filter(f=>f.status!=="resolved");
  const criticalCount  = FINDINGS.filter(f=>f.sev==="CRITICAL"&&f.status!=="resolved").length;
  const riskScore      = Math.min(100, criticalCount*20 + openFindings.filter(f=>f.sev==="HIGH").length*8 + openFindings.filter(f=>f.sev==="MEDIUM").length*2);

  const CVSS_COLOR = s => s>=9?"#ff3b5c":s>=7?"#ff6b35":s>=4?"#ffb300":"#00ff9d";

  const TABS = ["overview","findings","tools","trends"];
  const TL = {overview:"◉ Overview", findings:"⚠ Findings", tools:"⚙ Tools", trends:"◧ Trends"};

  const FindingDetail = ({f}) => (
    <div style={{position:"fixed",top:0,right:0,bottom:0,width:460,background:T.bg1,borderLeft:`1px solid ${T.border}`,zIndex:200,overflowY:"auto",boxShadow:"-8px 0 40px #00000066"}} className="slideUp">
      <div style={{padding:"18px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,marginBottom:4}}>{f.id} · {f.tool} · {f.cve}</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,color:T.textBright,marginBottom:6}}>{f.title}</div>
          <div style={{display:"flex",gap:6}}><Badge color={sevC[f.sev]}>{f.sev}</Badge><Badge color={statC[f.status]}>{f.status.replace("_"," ").toUpperCase()}</Badge></div>
        </div>
        <button onClick={()=>setSelFinding(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:20,padding:"0 4px"}}>✕</button>
      </div>
      <div style={{padding:"18px 20px"}}>
        {/* CVSS gauge */}
        <div style={{padding:"14px 16px",background:T.bg2,borderRadius:8,border:`1px solid ${T.border}`,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright}}>CVSS Score</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:700,color:CVSS_COLOR(f.cvss)}}>{f.cvss}</span>
          </div>
          <div style={{height:8,background:T.bg3,borderRadius:4}}>
            <div style={{width:`${(f.cvss/10)*100}%`,height:"100%",background:`linear-gradient(90deg,${T.green},${T.amber},${T.red})`,borderRadius:4}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
            <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>0 — None</span>
            <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>10 — Critical</span>
          </div>
        </div>
        {/* Detail grid */}
        {[["Component",f.component],["File",f.file],["Tool",f.tool],["CVE / Rule",f.cve]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{k}</span>
            <span style={{fontSize:12,color:T.cyan,fontFamily:"'JetBrains Mono',monospace",maxWidth:260,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis"}}>{v}</span>
          </div>
        ))}
        <div style={{margin:"14px 0"}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:8}}>Description</div>
          <div style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.7}}>{f.desc}</div>
        </div>
        <div style={{padding:"12px 14px",background:`${T.green}0a`,border:`1px solid ${T.green}33`,borderRadius:6,marginBottom:16}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.green,marginBottom:4}}>✓ Recommended Fix</div>
          <div style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{f.fix}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:"9px 0",background:`${T.amber}14`,border:`1px solid ${T.amber}44`,borderRadius:5,color:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Mark In Progress</button>
          <button style={{flex:1,padding:"9px 0",background:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:5,color:T.green,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Mark Resolved ✓</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fadeIn" style={{position:"relative"}}>
      {selFinding && <FindingDetail f={FINDINGS.find(f=>f.id===selFinding)}/>}
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="CRITICAL"    value={FINDINGS.filter(f=>f.sev==="CRITICAL").length}  icon="◉" color={T.red} delta={0}/>
        <MetricCard label="HIGH"        value={FINDINGS.filter(f=>f.sev==="HIGH").length}      icon="▲" color={T.amber} delta={1}/>
        <MetricCard label="OPEN"        value={openFindings.length}                             icon="⚠" color={T.amber}/>
        <MetricCard label="RESOLVED"    value={FINDINGS.filter(f=>f.status==="resolved").length} icon="✓" color={T.green}/>
        <MetricCard label="RISK SCORE"  value={riskScore} unit="/100"                          icon="⬡" color={riskScore>60?T.red:riskScore>30?T.amber:T.green}/>
        <MetricCard label="TOOLS ACTIVE" value={TOOLS.length}                                  icon="⚙" color={T.cyan}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            {TL[t]}
            {t==="findings" && openFindings.length>0 && <span style={{background:criticalCount>0?T.red:T.amber,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 6px",fontFamily:"'JetBrains Mono',monospace"}}>{openFindings.length}</span>}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Severity Breakdown" accent={T.red}/>
            {["CRITICAL","HIGH","MEDIUM","LOW"].map(sev=>{
              const count = FINDINGS.filter(f=>f.sev===sev).length;
              const open  = FINDINGS.filter(f=>f.sev===sev&&f.status!=="resolved").length;
              return (
                <div key={sev} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <Badge color={sevC[sev]}>{sev}</Badge>
                      <span style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{open} open / {count} total</span>
                    </div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:sevC[sev]}}>{count}</span>
                  </div>
                  <div style={{height:6,background:T.bg3,borderRadius:3}}>
                    <div style={{width:`${(count/FINDINGS.length)*100}%`,height:"100%",background:sevC[sev],borderRadius:3,transition:"width .5s"}}/>
                  </div>
                </div>
              );
            })}
          </Card>
          <Card>
            <SectionHeader label="Findings by Tool" accent={T.purple}/>
            {TOOLS.map(t=>(
              <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:20}}>{t.icon}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright}}>{t.name}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:t.color}}>{t.findings}</span>
                  </div>
                  <div style={{height:4,background:T.bg3,borderRadius:2}}>
                    <div style={{width:`${(t.findings/Math.max(...TOOLS.map(x=>x.findings),1))*100}%`,height:"100%",background:t.color,borderRadius:2}}/>
                  </div>
                </div>
              </div>
            ))}
          </Card>
          <Card style={{gridColumn:"1/-1"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <SectionHeader label="Recent Critical & High Findings"/>
              <button onClick={()=>setTab("findings")} style={{background:"none",border:"none",color:T.cyan,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>View all →</button>
            </div>
            {FINDINGS.filter(f=>f.sev==="CRITICAL"||f.sev==="HIGH").slice(0,4).map(f=>(
              <div key={f.id} onClick={()=>setSelFinding(f.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 14px",background:T.bg2,borderRadius:6,marginBottom:8,cursor:"pointer",borderLeft:`3px solid ${sevC[f.sev]}`,transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                onMouseLeave={e=>e.currentTarget.style.background=T.bg2}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,minWidth:50}}>{f.id}</div>
                <Badge color={sevC[f.sev]}>{f.sev}</Badge>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{f.title}</div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{f.component} · {f.cve}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:CVSS_COLOR(f.cvss)}}>CVSS {f.cvss}</span>
                  <span style={{fontSize:11,color:T.textDim}}>→</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* FINDINGS TABLE */}
      {tab==="findings" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label={`All Findings (${FINDINGS.length})`}/>
            <div style={{display:"flex",gap:8}}>
              {["ALL","CRITICAL","HIGH","MEDIUM"].map(f=>(
                <button key={f} style={{padding:"5px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer"}}>{f}</button>
              ))}
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["ID","Severity","CVSS","Title","Component","Tool","Status",""].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{FINDINGS.map((f,_i)=>(
              <tr key={f.id} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer",opacity:f.status==="resolved"?.6:1,transition:"background .12s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                onClick={()=>setSelFinding(f.id)}>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{f.id}</td>
                <td style={{padding:"10px 12px"}}><Badge color={sevC[f.sev]}>{f.sev}</Badge></td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:CVSS_COLOR(f.cvss)}}>{f.cvss}</td>
                <td style={{padding:"10px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.textBright,fontWeight:600,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.title}</td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.component}</td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{f.tool}</td>
                <td style={{padding:"10px 12px"}}><Badge color={statC[f.status]}>{f.status.replace("_"," ").toUpperCase()}</Badge></td>
                <td style={{padding:"10px 12px",fontSize:11,color:T.textDim}}>→</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* TOOLS */}
      {tab==="tools" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {TOOLS.map(tool=>(
            <Card key={tool.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:24}}>{tool.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright}}>{tool.name}</div>
                    <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>v{tool.version} · {tool.desc}</div>
                  </div>
                </div>
                <button onClick={()=>start(tool.id)} disabled={scanning===tool.id} style={{padding:"6px 14px",background:scanning===tool.id?T.bg3:`${tool.color}14`,border:`1px solid ${tool.color}44`,borderRadius:4,color:scanning===tool.id?T.textDim:tool.color,cursor:scanning===tool.id?"default":"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12}}>
                  {scanning===tool.id?`${progress[tool.id]||0}%`:"▶ Scan Now"}
                </button>
              </div>
              {scanning===tool.id && <ProgressBar value={progress[tool.id]||0} color={tool.color}/>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                {[["Findings",tool.findings,tool.color],["Last Run",tool.lastRun,T.textDim],["Status","Active",T.green]].map(([k,v,c])=>(
                  <div key={k} style={{padding:"8px 10px",background:T.bg2,borderRadius:5}}>
                    <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:3,letterSpacing:1}}>{k.toUpperCase()}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              {FINDINGS.filter(f=>f.tool===tool.name).map(f=>(
                <div key={f.id} onClick={()=>{setSelFinding(f.id);setTab("findings");}} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:T.bg2,borderRadius:4,marginBottom:5,cursor:"pointer",transition:"background .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                  onMouseLeave={e=>e.currentTarget.style.background=T.bg2}>
                  <Badge color={sevC[f.sev]}>{f.sev}</Badge>
                  <span style={{flex:1,fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{f.title}</span>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{f.file}</span>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}

      {/* TRENDS */}
      {tab==="trends" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Finding Trend — Last 8 Scans" accent={T.cyan}/>
            {[{label:"Critical",data:[2,1,3,2,1,2,1,1],color:T.red},{label:"High",data:[5,6,4,5,4,5,4,4],color:T.amber},{label:"Medium",data:[8,9,7,8,6,7,6,4],color:T.textDim}].map(({label,data,color})=>(
              <div key={label} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{label}</span>
                  <span style={{fontSize:12,color,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{data[data.length-1]}</span>
                </div>
                <Sparkline data={data} color={color} height={30}/>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader label="Mean Time to Remediate" accent={T.green}/>
            {[
              {sev:"CRITICAL",actual:2.4,target:1,  label:"2.4d", ok:false},
              {sev:"HIGH",    actual:6.1,target:7,  label:"6.1d", ok:true },
              {sev:"MEDIUM",  actual:18, target:30, label:"18d",  ok:true },
              {sev:"LOW",     actual:45, target:90, label:"45d",  ok:true },
            ].map(r=>(
              <div key={r.sev} style={{padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <Badge color={sevC[r.sev]}>{r.sev}</Badge>
                    <span style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>target: {r.target}d</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:15,fontWeight:700,color:r.ok?T.green:T.red}}>{r.label}</span>
                    <span style={{fontSize:13,color:r.ok?T.green:T.red}}>{r.ok?"✓":"⚠"}</span>
                  </div>
                </div>
                <ProgressBar value={Math.min(Math.round((r.actual/r.target)*100),100)} color={r.ok?T.green:T.red}/>
              </div>
            ))}
          </Card>
          <Card style={{gridColumn:"1/-1"}}>
            <SectionHeader label="Compliance Coverage by Framework" accent={T.purple}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
              {[{name:"OWASP Top 10",covered:8,total:10,color:T.red},{name:"CIS AWS",covered:47,total:53,color:T.amber},{name:"SOC2 CC",covered:12,total:13,color:T.cyan},{name:"NIST CSF",covered:18,total:23,color:T.purple}].map(fw=>(
                <div key={fw.name} style={{padding:"14px 16px",background:T.bg2,borderRadius:7,border:`1px solid ${T.border}`,textAlign:"center"}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.textBright,marginBottom:8}}>{fw.name}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:fw.color,marginBottom:4}}>{fw.covered}<span style={{fontSize:13,color:T.textDim}}>/{fw.total}</span></div>
                  <ProgressBar value={Math.round((fw.covered/fw.total)*100)} color={fw.color}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const ComplianceView = () => {
  const [tab, setTab]         = useState("dashboard");
  const [selControl, setSelControl] = useState(null);
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditPct, setAuditPct]       = useState(0);
  const [auditDone, setAuditDone]     = useState(false);

  const runAudit = () => {
    setAuditRunning(true); setAuditPct(0); setAuditDone(false);
    let p = 0;
    const iv = setInterval(() => {
      p += rand(4, 10);
      setAuditPct(Math.min(p, 100));
      if (p >= 100) { clearInterval(iv); setAuditRunning(false); setAuditDone(true); }
    }, 150);
  };

  const FRAMEWORKS = [
    {
      id:"soc2", name:"SOC 2 Type II", icon:"🔐", color:T.cyan, overall:94, auditor:"Deloitte & Touche", nextAudit:"Sep 2026",
      categories:[
        {name:"Security (CC)",       score:96, controls:6, failing:1},
        {name:"Availability (A)",    score:78, controls:3, failing:1},
        {name:"Confidentiality (C)", score:100,controls:2, failing:0},
        {name:"Processing (PI)",     score:92, controls:4, failing:0},
      ],
      controls:[
        {id:"CC6.1",name:"Logical Access",           status:"pass",score:100,evidence:["IAM policy audit log","MFA enforcement report"],owner:"Adebayo Paul"},
        {id:"CC6.2",name:"Access Provisioning",      status:"pass",score:98, evidence:["Onboarding checklist","Role assignment log"],owner:"Chidera Okonkwo"},
        {id:"CC6.3",name:"Least Privilege",          status:"pass",score:96, evidence:["IAM analysis report","Permission review"],owner:"Adebayo Paul"},
        {id:"CC7.1",name:"Threat Detection",         status:"pass",score:95, evidence:["SIEM alert log","Threat hunting report"],owner:"Amaka Obi"},
        {id:"CC7.2",name:"Incident Response",        status:"warn",score:82, evidence:["Partial runbook","2 open incidents"],owner:"Adebayo Paul"},
        {id:"CC8.1",name:"Change Management",        status:"pass",score:96, evidence:["CI/CD audit trail","PR reviews"],owner:"Funke Adeyemi"},
        {id:"CC9.1",name:"Risk Assessment",          status:"pass",score:91, evidence:["Q1 risk register","Vendor assessments"],owner:"Adebayo Paul"},
        {id:"A1.1", name:"Availability Monitoring",  status:"warn",score:78, evidence:["Uptime reports (partial)","SLA data"],owner:"Emeka Nwachukwu"},
        {id:"A1.2", name:"Recovery Testing",         status:"pass",score:88, evidence:["DR test results Apr 2026"],owner:"Emeka Nwachukwu"},
        {id:"C1.1", name:"Confidentiality Policy",   status:"pass",score:100,evidence:["Data classification policy","DLP logs"],owner:"Adebayo Paul"},
        {id:"PI1.1",name:"Data Processing Integrity",status:"pass",score:95, evidence:["Audit logs","Hash verification"],owner:"Chidera Okonkwo"},
      ],
    },
    {
      id:"iso27001", name:"ISO 27001:2022", icon:"🌐", color:T.purple, overall:89, auditor:"BSI Group", nextAudit:"Dec 2026",
      categories:[
        {name:"Information Security Policies",score:100,controls:2,failing:0},
        {name:"Organisation & People",        score:92, controls:3,failing:0},
        {name:"Asset Management",             score:74, controls:3,failing:1},
        {name:"Cryptography",                 score:100,controls:2,failing:0},
        {name:"Access Control",               score:96, controls:3,failing:0},
        {name:"Operations Security",          score:91, controls:4,failing:0},
        {name:"Incident Management",          score:61, controls:2,failing:1},
      ],
      controls:[
        {id:"A.5.1", name:"Information Security Policies",status:"pass",score:100,evidence:["Policy document v2.4"],owner:"Adebayo Paul"},
        {id:"A.6.1", name:"Internal Organisation",        status:"pass",score:94, evidence:["Org chart","Role definitions"],owner:"Chidera Okonkwo"},
        {id:"A.7.2", name:"Information Classification",   status:"pass",score:92, evidence:["Data classification scheme"],owner:"Adebayo Paul"},
        {id:"A.8.1", name:"Asset Inventory",              status:"warn",score:74, evidence:["Partial CMDB","AWS Config"],owner:"Emeka Nwachukwu"},
        {id:"A.9.1", name:"Access Control Policy",        status:"pass",score:98, evidence:["IAM policy","ZTA design"],owner:"Adebayo Paul"},
        {id:"A.10.1","name":"Cryptographic Controls",     status:"pass",score:100,evidence:["KMS key audit","TLS 1.3 config"],owner:"Adebayo Paul"},
        {id:"A.12.1","name":"Operational Procedures",     status:"pass",score:91, evidence:["Runbook library","DR plan"],owner:"Funke Adeyemi"},
        {id:"A.16.1","name":"Incident Response",          status:"fail",score:61, evidence:["Outdated plan (2024)","3 open P1s"],owner:"Adebayo Paul"},
      ],
    },
    {
      id:"nist", name:"NIST CSF 2.0", icon:"🏛", color:T.amber, overall:87, auditor:"Internal", nextAudit:"Jun 2026",
      categories:[
        {name:"Govern",   score:91,controls:4,failing:0},
        {name:"Identify", score:84,controls:5,failing:1},
        {name:"Protect",  score:93,controls:6,failing:0},
        {name:"Detect",   score:88,controls:4,failing:0},
        {name:"Respond",  score:72,controls:3,failing:1},
        {name:"Recover",  score:79,controls:3,failing:0},
      ],
      controls:[
        {id:"GV.OC",name:"Organizational Context",status:"pass",score:94,evidence:["Risk register"],owner:"Adebayo Paul"},
        {id:"ID.AM",name:"Asset Management",      status:"warn",score:76,evidence:["Partial CMDB"],owner:"Emeka Nwachukwu"},
        {id:"PR.AA",name:"Identity & Auth",       status:"pass",score:98,evidence:["IAM + MFA reports"],owner:"Adebayo Paul"},
        {id:"DE.CM",name:"Continuous Monitoring", status:"pass",score:91,evidence:["SIEM dashboards"],owner:"Amaka Obi"},
        {id:"RS.MA",name:"Incident Management",   status:"fail",score:68,evidence:["Plan needs update"],owner:"Adebayo Paul"},
        {id:"RC.RP",name:"Recovery Planning",     status:"pass",score:82,evidence:["DR tested Apr 2026"],owner:"Emeka Nwachukwu"},
      ],
    },
  ];

  const EVIDENCE = [
    {name:"IAM Policy Audit Report",      framework:"SOC2",     control:"CC6.1",date:"May 1, 2026",  size:"1.2 MB",status:"approved"},
    {name:"MFA Enforcement Screenshot",   framework:"SOC2",     control:"CC6.1",date:"May 1, 2026",  size:"284 KB", status:"approved"},
    {name:"Penetration Test Report Q1",   framework:"ISO27001", control:"A.12.1",date:"Apr 15, 2026",size:"4.8 MB",status:"approved"},
    {name:"DR Test Results April 2026",   framework:"NIST CSF", control:"RC.RP", date:"Apr 22, 2026",size:"2.1 MB",status:"pending"},
    {name:"Vendor Risk Assessment v2",    framework:"ISO27001", control:"A.6.1", date:"Mar 30, 2026",size:"890 KB",status:"approved"},
    {name:"Data Classification Policy",   framework:"ISO27001", control:"A.7.2", date:"Jan 10, 2026",size:"340 KB",status:"approved"},
    {name:"SIEM Alert Log Export",        framework:"SOC2",     control:"CC7.1", date:"May 3, 2026",  size:"18 MB", status:"approved"},
    {name:"Incident Response Plan",       framework:"ISO27001", control:"A.16.1",date:"Jun 10, 2024", size:"1.4 MB",status:"expired"},
  ];

  const scoreC  = s => s >= 90 ? T.green : s >= 75 ? T.amber : T.red;
  const statusC = {pass:T.green, warn:T.amber, fail:T.red};
  const statusI = {pass:"✓", warn:"⚠", fail:"✗"};
  const evidC   = {approved:T.green, pending:T.amber, expired:T.red};

  const TABS = ["dashboard","controls","evidence","audit"];
  const TL   = {dashboard:"◈ Dashboard", controls:"❑ Controls", evidence:"◧ Evidence", audit:"⊕ Audit Trail"};

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="FRAMEWORKS"  value={FRAMEWORKS.length} icon="❑" color={T.cyan}/>
        <MetricCard label="CONTROLS"    value={FRAMEWORKS.reduce((a,f)=>a+f.controls.length,0)} icon="✓" color={T.green}/>
        <MetricCard label="FAILING"     value={FRAMEWORKS.reduce((a,f)=>a+f.controls.filter(c=>c.status==="fail").length,0)} icon="✗" color={T.red} delta={0}/>
        <MetricCard label="WARNINGS"    value={FRAMEWORKS.reduce((a,f)=>a+f.controls.filter(c=>c.status==="warn").length,0)} icon="⚠" color={T.amber}/>
        <MetricCard label="AVG SCORE"   value={Math.round(FRAMEWORKS.reduce((a,f)=>a+f.overall,0)/FRAMEWORKS.length)} unit="%" icon="◈" color={T.cyan}/>
        <MetricCard label="EVIDENCE"    value={EVIDENCE.length} icon="◧" color={T.purple}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,paddingBottom:4}}>
          {auditDone && <Badge color={T.green}>✓ Audit Complete</Badge>}
          <button onClick={runAudit} disabled={auditRunning} style={{padding:"6px 16px",background:auditRunning?T.bg3:`${T.cyan}14`,border:`1px solid ${auditRunning?T.border:T.cyan}`,borderRadius:5,color:auditRunning?T.textDim:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:auditRunning?"default":"pointer"}}>
            {auditRunning?`⟳ Running ${auditPct}%`:"▶ Run Audit Scan"}
          </button>
        </div>
      </div>

      {/* DASHBOARD */}
      {tab==="dashboard" && (
        <div>
          {auditRunning && (
            <Card style={{marginBottom:14,border:`1px solid ${T.cyan}44`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
                <div style={{animation:"spin 2s linear infinite",display:"inline-block",fontSize:18}}>⟳</div>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:T.cyan}}>Audit scan in progress — checking {FRAMEWORKS.reduce((a,f)=>a+f.controls.length,0)} controls across {FRAMEWORKS.length} frameworks…</span>
              </div>
              <ProgressBar value={auditPct} color={T.cyan}/>
            </Card>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:14}}>
            {FRAMEWORKS.map(fw=>(
              <Card key={fw.id} style={{cursor:"pointer"}} onClick={()=>setTab("controls")}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>{fw.icon}</span>
                    <div>
                      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright}}>{fw.name}</div>
                      <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Next audit: {fw.nextAudit}</div>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:700,color:scoreC(fw.overall)}}>{fw.overall}%</div>
                    <div style={{fontSize:9,color:T.textDim,letterSpacing:1}}>SCORE</div>
                  </div>
                </div>
                <ProgressBar value={fw.overall} color={fw.color}/>
                <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:10}}>
                  {fw.categories.map(cat=>(
                    <div key={cat.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
                      <span style={{fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.name}</span>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        {cat.failing>0 && <span style={{fontSize:9,color:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{cat.failing} fail</span>}
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:scoreC(cat.score)}}>{cat.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:12,padding:"8px 10px",background:T.bg2,borderRadius:5,display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Auditor: {fw.auditor}</span>
                  <Badge color={fw.color}>{fw.overall>=90?"COMPLIANT":"IN PROGRESS"}</Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Risk heatmap */}
          <Card>
            <SectionHeader label="Control Status Heatmap" accent={T.amber}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              {FRAMEWORKS.map(fw=>(
                <div key={fw.id}>
                  <div style={{fontSize:12,color:fw.color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,marginBottom:8}}>{fw.name}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {fw.controls.map(c=>(
                      <div key={c.id} onClick={()=>{setSelControl({...c,framework:fw.name});setTab("controls");}} title={`${c.id}: ${c.name} (${c.score}%)`}
                        style={{width:28,height:28,borderRadius:4,background:statusC[c.status]+"22",border:`1.5px solid ${statusC[c.status]}66`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11,color:statusC[c.status],fontWeight:700,transition:"all .15s"}}
                        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15)"}
                        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                        {statusI[c.status]}
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    {["pass","warn","fail"].map(s=>(
                      <div key={s} style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:8,height:8,borderRadius:2,background:statusC[s]}}/>
                        <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{fw.controls.filter(c=>c.status===s).length} {s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CONTROLS */}
      {tab==="controls" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {FRAMEWORKS.map(fw=>(
            <Card key={fw.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:20}}>{fw.icon}</span>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright}}>{fw.name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <ProgressBar value={fw.overall} color={fw.color} style={{width:120,marginBottom:0}}/>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:scoreC(fw.overall)}}>{fw.overall}%</span>
                </div>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                  {["Control ID","Name","Owner","Score","Evidence","Status"].map(h=>(
                    <th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400}}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{fw.controls.map((c,_i)=>(
                  <tr key={c.id} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                    onClick={()=>setSelControl({...c,framework:fw.name})}>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:fw.color}}>{c.id}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.textBright,fontWeight:600}}>{c.name}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{c.owner}</td>
                    <td style={{padding:"9px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:40,height:4,background:T.bg3,borderRadius:2}}><div style={{width:`${c.score}%`,height:"100%",background:scoreC(c.score),borderRadius:2}}/></div>
                        <span style={{fontSize:11,color:scoreC(c.score),fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{c.score}%</span>
                      </div>
                    </td>
                    <td style={{padding:"9px 12px",fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{c.evidence?.length||0} items</td>
                    <td style={{padding:"9px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{color:statusC[c.status],fontSize:14}}>{statusI[c.status]}</span>
                        <span style={{fontSize:11,color:statusC[c.status],fontFamily:"'JetBrains Mono',monospace"}}>{c.status.toUpperCase()}</span>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </Card>
          ))}

          {/* Control detail drawer */}
          {selControl && (
            <Card style={{border:`1px solid ${statusC[selControl.status]}44`,background:`${statusC[selControl.status]}06`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,marginBottom:4}}>{selControl.framework} · {selControl.id}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,color:T.textBright,marginBottom:6}}>{selControl.name}</div>
                  <div style={{display:"flex",gap:8}}>
                    <Badge color={statusC[selControl.status]}>{selControl.status.toUpperCase()}</Badge>
                    <Badge color={scoreC(selControl.score)}>{selControl.score}% Score</Badge>
                  </div>
                </div>
                <button onClick={()=>setSelControl(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:18}}>✕</button>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6,letterSpacing:1}}>EVIDENCE ITEMS</div>
                {selControl.evidence?.map((ev,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:T.bg2,borderRadius:4,marginBottom:5}}>
                    <span style={{color:T.green,fontSize:12}}>✓</span>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.text}}>{ev}</span>
                    <button style={{marginLeft:"auto",padding:"3px 8px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>View</button>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={{padding:"8px 16px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add Evidence</button>
                <button style={{padding:"8px 16px",background:`${T.amber}14`,border:`1px solid ${T.amber}44`,borderRadius:5,color:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Assign Owner</button>
                <button style={{padding:"8px 16px",background:`${T.purple}14`,border:`1px solid ${T.purple}44`,borderRadius:5,color:T.purple,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Export Control</button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* EVIDENCE */}
      {tab==="evidence" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label="Evidence Library"/>
            <button style={{padding:"7px 16px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Upload Evidence</button>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["Document","Framework","Control","Collected","Size","Status",""].map(h=>(
                <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{EVIDENCE.map((e,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${T.border}22`}}
                onMouseEnter={ev=>ev.currentTarget.style.background=T.bg2}
                onMouseLeave={ev=>ev.currentTarget.style.background=i%2===0?"transparent":T.bg0+"44"}>
                <td style={{padding:"11px 14px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,color:T.textBright}}>{e.name}</td>
                <td style={{padding:"11px 14px"}}><Badge color={T.cyan}>{e.framework}</Badge></td>
                <td style={{padding:"11px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{e.control}</td>
                <td style={{padding:"11px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{e.date}</td>
                <td style={{padding:"11px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{e.size}</td>
                <td style={{padding:"11px 14px"}}><Badge color={evidC[e.status]}>{e.status.toUpperCase()}</Badge></td>
                <td style={{padding:"11px 14px",display:"flex",gap:6}}>
                  <button style={{padding:"4px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>↓ Download</button>
                  <button style={{padding:"4px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Share</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* AUDIT TRAIL */}
      {tab==="audit" && (
        <Card>
          <SectionHeader label="Compliance Audit Trail" accent={T.gold}/>
          {[
            {action:"SOC2 Audit scan completed",    framework:"SOC2",      score:"94%",  user:"System",          time:"Just now",   type:"scan"},
            {action:"Evidence uploaded",            framework:"NIST CSF",  score:"—",    user:"Adebayo Paul",    time:"2h ago",     type:"upload"},
            {action:"Control CC7.2 marked warn",   framework:"SOC2",      score:"82%",  user:"Amaka Obi",       time:"1d ago",     type:"update"},
            {action:"ISO 27001 scan initiated",     framework:"ISO27001",  score:"89%",  user:"System",          time:"2d ago",     type:"scan"},
            {action:"Incident response plan expired",framework:"ISO27001", score:"—",    user:"System",          time:"3d ago",     type:"alert"},
            {action:"New control owner assigned",   framework:"SOC2",      score:"—",    user:"Chidera Okonkwo", time:"5d ago",     type:"update"},
            {action:"DR test evidence added",       framework:"NIST CSF",  score:"—",    user:"Emeka Nwachukwu", time:"1w ago",     type:"upload"},
            {action:"Quarterly compliance report",  framework:"All",       score:"91%",  user:"System",          time:"Apr 1",      type:"report"},
          ].map((ev,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:ev.type==="scan"?`${T.cyan}14`:ev.type==="alert"?`${T.red}14`:ev.type==="report"?`${T.gold}14`:`${T.green}14`,border:`1px solid ${ev.type==="scan"?T.cyan:ev.type==="alert"?T.red:ev.type==="report"?T.gold:T.green}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
                {ev.type==="scan"?"◎":ev.type==="alert"?"⚠":ev.type==="report"?"◧":"✓"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:T.textBright,fontWeight:600}}>{ev.action}</div>
                <div style={{display:"flex",gap:12,marginTop:2}}>
                  <Badge color={T.cyan}>{ev.framework}</Badge>
                  <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>by {ev.user}</span>
                  {ev.score!=="—" && <span style={{fontSize:11,color:scoreC(parseInt(ev.score)),fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{ev.score}</span>}
                </div>
              </div>
              <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{ev.time}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

const ThreatView = () => {
  const [tab, setTab]       = useState("hunt");
  const [query, setQuery]   = useState(`-- ZolexTech Threat Hunt Query\n-- Detect lateral movement via SMB\nSELECT\n  src_ip,\n  dst_ip,\n  COUNT(*)        AS connection_count,\n  MAX(timestamp)  AS last_seen,\n  array_agg(DISTINCT dst_port) AS ports\nFROM network_events\nWHERE\n  timestamp > NOW() - INTERVAL '1 hour'\n  AND dst_port IN (445, 22, 3389, 5985, 5986)\n  AND src_ip NOT IN (SELECT ip FROM trusted_hosts)\n  AND bytes_sent > 1024\nGROUP BY src_ip, dst_ip\nHAVING COUNT(*) > 5\nORDER BY connection_count DESC\nLIMIT 50;`);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [selIOC,  setSelIOC]  = useState(null);

  const HUNT_RESULTS = [
    {src:"185.220.101.8",  dst:"10.0.2.45", count:847, last:"09:41:58", ports:[22,445],    geo:"🇳🇱",country:"Netherlands",as:"AS4134",threat:"Tor Exit Node"},
    {src:"45.142.212.100", dst:"10.0.2.12", count:312, last:"09:40:22", ports:[22],        geo:"🇷🇺",country:"Russia",    as:"AS9123",threat:"Known Scanner"},
    {src:"194.165.16.78",  dst:"10.0.3.55", count:198, last:"09:38:11", ports:[3389,5985], geo:"🇩🇪",country:"Germany",   as:"AS8220",threat:"RDP Brute Force"},
    {src:"192.168.1.104",  dst:"10.0.2.45", count:44,  last:"09:35:04", ports:[445],       geo:"🏠",country:"Internal",   as:"—",     threat:"Internal — Review"},
    {src:"103.89.21.14",   dst:"10.0.4.11", count:31,  last:"09:30:17", ports:[22],        geo:"🇨🇳",country:"China",     as:"AS4837",threat:"SSH Scanner"},
  ];

  const IOCS = [
    {id:"IOC-001",type:"IPv4",     value:"185.220.101.8",        confidence:95,sev:"critical",tags:["Tor","BruteForce","Malicious"],first:"Apr 15",last:"09:41",feeds:["AbuseIPDB","Shodan","AlienVault"],seen:847},
    {id:"IOC-002",type:"Domain",   value:"d4rk-c2.malware.to",   confidence:99,sev:"critical",tags:["C2","Malware","DGA"],first:"Apr 28",last:"08:12",feeds:["ThreatFox","URLHaus","VirusTotal"],seen:3},
    {id:"IOC-003",type:"SHA256",   value:"e3b0c44298fc1c14...",  confidence:88,sev:"high",    tags:["Ransomware","Dropper","LockBit"],first:"Apr 22",last:"07:44",feeds:["MalwareBazaar","VirusTotal"],seen:1},
    {id:"IOC-004",type:"IPv4",     value:"45.142.212.100",       confidence:82,sev:"high",    tags:["Scanner","Recon","RU-AS9123"],first:"Apr 20",last:"09:40",feeds:["AbuseIPDB","Greynoise"],seen:312},
    {id:"IOC-005",type:"URL",      value:"http://103.89.21.14/sh",confidence:91,sev:"high",   tags:["Dropper","C2","SSH"],first:"May 1",last:"09:30",feeds:["URLHaus","ThreatFox"],seen:31},
    {id:"IOC-006",type:"IPv4",     value:"194.165.16.78",        confidence:74,sev:"medium",  tags:["RDP","BruteForce","DE-AS8220"],first:"May 2",last:"09:38",feeds:["AbuseIPDB"],seen:198},
  ];

  const ACTORS = [
    {
      name:"APT-ZX41",  alias:"SilentReaper", origin:"🇷🇺 Russia", active:true,  sev:"critical",
      tactics:["Spear Phishing","Lateral Movement","Credential Dumping","Data Exfiltration"],
      malware:["Cobalt Strike","Mimikatz","BloodHound"],
      targets:["Financial","Government","Healthcare"],
      mitre:["T1566","T1021","T1003","T1041"],
      last:"2h ago", confidence:87,
    },
    {
      name:"CRIME-BR91", alias:"RansomWeb",   origin:"🇨🇳 China",  active:true,  sev:"high",
      tactics:["Port Scanning","Exploitation","Ransomware Deployment"],
      malware:["LockBit 3.0","Cobalt Strike Beacon"],
      targets:["SMB","Critical Infrastructure"],
      mitre:["T1595","T1190","T1486"],
      last:"14h ago", confidence:72,
    },
    {
      name:"APT-FN18",  alias:"GhostWriter",  origin:"🇮🇷 Iran",   active:false, sev:"medium",
      tactics:["Phishing","Credential Access","Web Shell"],
      malware:["CharmPower","PowerShell Empire"],
      targets:["Defense","Tech Sector"],
      mitre:["T1566.001","T1110","T1505.003"],
      last:"4d ago", confidence:61,
    },
  ];

  const TIMELINE = [
    {time:"09:41:58",event:"Tor exit node 185.220.101.8 initiated 847 SSH connections",sev:"critical",src:"185.220.101.8",dst:"10.0.2.45"},
    {time:"09:40:22",event:"Known scanner 45.142.212.100 port scanning range 10.0.2.0/24",sev:"high",src:"45.142.212.100",dst:"10.0.2.0/24"},
    {time:"09:38:11",event:"RDP brute force from 194.165.16.78 — 198 attempts in 4 minutes",sev:"high",src:"194.165.16.78",dst:"10.0.3.55"},
    {time:"09:35:04",event:"Unusual internal SMB traffic — 10.0.1.104 → 10.0.2.45 (lateral movement indicator)",sev:"warn",src:"192.168.1.104",dst:"10.0.2.45"},
    {time:"09:30:17",event:"SSH connection attempt from 103.89.21.14 with payload 'curl http://103.89.21.14/sh'",sev:"high",src:"103.89.21.14",dst:"10.0.4.11"},
    {time:"09:22:04",event:"DNS query for known C2 domain d4rk-c2.malware.to from internal host",sev:"critical",src:"10.0.2.45",dst:"8.8.8.8"},
    {time:"08:12:44",event:"SHA256 IOC match in file upload to S3: e3b0c44298fc1c14...",sev:"high",src:"10.0.3.22",dst:"S3"},
    {time:"07:44:00",event:"PowerShell encoded command execution detected via Sysmon event 1",sev:"warn",src:"10.0.2.45",dst:"local"},
  ];

  const MITRE_MATRIX = [
    {tactic:"Reconnaissance",    covered:true,  techniques:["T1595","T1592","T1589"]},
    {tactic:"Resource Dev.",     covered:false, techniques:["T1583","T1586"]},
    {tactic:"Initial Access",    covered:true,  techniques:["T1566","T1190","T1133"]},
    {tactic:"Execution",         covered:true,  techniques:["T1059","T1203"]},
    {tactic:"Persistence",       covered:true,  techniques:["T1547","T1505"]},
    {tactic:"Privilege Esc.",    covered:true,  techniques:["T1548","T1134"]},
    {tactic:"Defense Evasion",   covered:false, techniques:["T1027","T1562"]},
    {tactic:"Credential Access", covered:true,  techniques:["T1003","T1110"]},
    {tactic:"Discovery",         covered:false, techniques:["T1083","T1057"]},
    {tactic:"Lateral Movement",  covered:true,  techniques:["T1021","T1563"]},
    {tactic:"Collection",        covered:false, techniques:["T1074","T1114"]},
    {tactic:"C2",                covered:true,  techniques:["T1071","T1095"]},
    {tactic:"Exfiltration",      covered:true,  techniques:["T1041","T1048"]},
    {tactic:"Impact",            covered:false, techniques:["T1486","T1485"]},
  ];

  const sevC  = {critical:T.red, high:T.amber, medium:T.amber, warn:T.amber, low:T.textDim};
  const TABS  = ["hunt","ioc","actors","timeline","mitre"];
  const TL    = {hunt:"⊕ Hunt Query", ioc:"◎ IOC Feed", actors:"⊞ Threat Actors", timeline:"⟁ Attack Timeline", mitre:"⬡ MITRE ATT&CK"};

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="ACTIVE HUNTS"  value={3}  icon="⊕" color={T.cyan}/>
        <MetricCard label="IOCs TRACKED"  value={IOCS.length} icon="◎" color={T.red} delta={2}/>
        <MetricCard label="THREAT ACTORS" value={ACTORS.filter(a=>a.active).length} icon="⊞" color={T.amber}/>
        <MetricCard label="MITRE TACTICS" value={`${MITRE_MATRIX.filter(m=>m.covered).length}/${MITRE_MATRIX.length}`} icon="⬡" color={T.purple}/>
        <MetricCard label="COVERAGE"      value={Math.round(MITRE_MATRIX.filter(m=>m.covered).length/MITRE_MATRIX.length*100)} unit="%" icon="✓" color={T.green}/>
        <MetricCard label="ALERTS TODAY"  value={TIMELINE.length} icon="⚠" color={T.amber}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 16px",background:"transparent",borderBottom:tab===t?`2px solid ${T.purple}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.purple:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
      </div>

      {/* HUNT QUERY */}
      {tab==="hunt" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <SectionHeader label="Threat Hunt Query — SQL / KQL" accent={T.purple}/>
                <div style={{display:"flex",gap:8}}>
                  {["Lateral Movement","Brute Force","DNS Beacon","Data Exfil"].map(t=>(
                    <button key={t} onClick={()=>{}} style={{padding:"4px 10px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>{t}</button>
                  ))}
                </div>
              </div>
              <textarea value={query} onChange={e=>setQuery(e.target.value)} style={{width:"100%",minHeight:200,background:T.bg0,border:`1px solid ${T.border}`,borderRadius:5,padding:"14px 16px",color:T.green,fontFamily:"'JetBrains Mono',monospace",fontSize:11,resize:"vertical",lineHeight:1.8,outline:"none",transition:"border-color .15s"}}
                onFocus={e=>e.target.style.borderColor=T.purple} onBlur={e=>e.target.style.borderColor=T.border}/>
              <div style={{display:"flex",gap:10,marginTop:10}}>
                <button onClick={()=>{setRunning(true);setResults(null);setTimeout(()=>{setRunning(false);setResults(HUNT_RESULTS);},1800);}} disabled={running}
                  style={{padding:"9px 22px",background:running?T.bg3:`linear-gradient(135deg,${T.purple}22,${T.cyanDim}22)`,border:`1px solid ${T.purple}`,borderRadius:5,color:running?T.textDim:T.purple,cursor:running?"default":"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                  {running?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span>Executing…</>:"▶ Run Hunt"}
                </button>
                <button style={{padding:"9px 16px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>Save Query</button>
                <button style={{padding:"9px 16px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>Schedule</button>
              </div>
            </Card>

            {results && (
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:12,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>✓ {results.length} rows · 0.34s · network_events (2.4M rows scanned)</div>
                  <button style={{padding:"4px 12px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>↓ Export CSV</button>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>
                  <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                    {["SRC_IP","DST_IP","CONNS","LAST_SEEN","PORTS","GEO","THREAT",""].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",color:T.textDim,fontWeight:400,fontSize:10}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{results.map((r,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer"}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"8px 10px",color:T.red,fontWeight:700}}>{r.src}</td>
                      <td style={{padding:"8px 10px",color:T.cyan}}>{r.dst}</td>
                      <td style={{padding:"8px 10px",color:T.amber,fontWeight:700}}>{r.count}</td>
                      <td style={{padding:"8px 10px",color:T.textDim}}>{r.last}</td>
                      <td style={{padding:"8px 10px",color:T.textDim}}>{r.ports.join(",")}</td>
                      <td style={{padding:"8px 10px"}}>{r.geo} {r.country}</td>
                      <td style={{padding:"8px 10px"}}><span style={{color:sevC[r.threat?.includes("Tor")||r.threat?.includes("Force")?"critical":"high"]||T.amber,fontSize:10}}>{r.threat}</span></td>
                      <td style={{padding:"8px 10px"}}><button style={{padding:"3px 8px",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:3,color:T.red,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Block IP</button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </Card>
            )}
          </div>

          {/* Saved hunts sidebar */}
          <Card>
            <SectionHeader label="Saved Hunt Queries" accent={T.purple}/>
            {[
              {name:"Lateral Movement SMB",   updated:"2h ago",  runs:14,hits:3},
              {name:"DNS Beaconing Detection", updated:"1d ago",  runs:24,hits:1},
              {name:"Credential Dumping",      updated:"2d ago",  runs:8, hits:0},
              {name:"Unusual Outbound Traffic",updated:"3d ago",  runs:18,hits:2},
              {name:"PowerShell Encoded Cmds", updated:"1w ago",  runs:7, hits:1},
            ].map((q,i)=>(
              <div key={i} onClick={()=>{}} style={{padding:"10px 12px",background:T.bg2,borderRadius:5,marginBottom:8,cursor:"pointer",border:`1px solid ${T.border}`,transition:"border-color .15s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=T.purple}
                onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright,marginBottom:4}}>{q.name}</div>
                <div style={{display:"flex",gap:10}}>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Updated {q.updated}</span>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{q.runs} runs</span>
                  {q.hits>0 && <span style={{fontSize:10,color:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{q.hits} hits</span>}
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* IOC FEED */}
      {tab==="ioc" && (
        <div style={{display:"grid",gridTemplateColumns:selIOC?"1fr 380px":"1fr",gap:14}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <SectionHeader label="IOC Intelligence Feed" accent={T.red}/>
              <div style={{display:"flex",gap:8}}>
                <Badge color={T.green}>AbuseIPDB</Badge>
                <Badge color={T.cyan}>AlienVault OTX</Badge>
                <Badge color={T.amber}>ThreatFox</Badge>
                <Badge color={T.purple}>VirusTotal</Badge>
              </div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["ID","Type","Indicator","Confidence","Severity","Tags","Feeds","Last Seen","Actions"].map(h=>(
                  <th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{IOCS.map((ioc,_i)=>(
                <tr key={ioc.id} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  onClick={()=>setSelIOC(selIOC===ioc.id?null:ioc.id)}>
                  <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{ioc.id}</td>
                  <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.purple,background:`${T.purple}14`,padding:"2px 7px",borderRadius:3}}>{ioc.type}</span></td>
                  <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textBright,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ioc.value}</td>
                  <td style={{padding:"9px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:36,height:4,background:T.bg3,borderRadius:2}}><div style={{width:`${ioc.confidence}%`,height:"100%",background:ioc.confidence>80?T.red:T.amber,borderRadius:2}}/></div>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:ioc.confidence>80?T.red:T.amber}}>{ioc.confidence}%</span>
                    </div>
                  </td>
                  <td style={{padding:"9px 12px"}}><Badge color={sevC[ioc.sev]}>{ioc.sev.toUpperCase()}</Badge></td>
                  <td style={{padding:"9px 12px"}}>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {ioc.tags.slice(0,2).map(t=><span key={t} style={{fontSize:9,color:T.textDim,background:T.bg3,padding:"1px 6px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}
                    </div>
                  </td>
                  <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{ioc.feeds.length} sources</td>
                  <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{ioc.last}</td>
                  <td style={{padding:"9px 12px"}}>
                    <div style={{display:"flex",gap:4}}>
                      <button style={{padding:"3px 7px",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:3,color:T.red,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Block</button>
                      <button style={{padding:"3px 7px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Hunt</button>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
          {selIOC && (() => {
            const ioc = IOCS.find(i=>i.id===selIOC);
            return (
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,marginBottom:4}}>{ioc.id} · {ioc.type}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:T.textBright,fontWeight:600,wordBreak:"break-all",marginBottom:6}}>{ioc.value}</div>
                    <div style={{display:"flex",gap:6}}><Badge color={sevC[ioc.sev]}>{ioc.sev.toUpperCase()}</Badge><Badge color={T.purple}>{ioc.confidence}% confidence</Badge></div>
                  </div>
                  <button onClick={()=>setSelIOC(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:18}}>✕</button>
                </div>
                {[["Observed",`${ioc.seen} events`],["First seen",ioc.first],["Last seen",ioc.last]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{k}</span>
                    <span style={{fontSize:11,color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                  </div>
                ))}
                <div style={{marginTop:12}}>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>INTELLIGENCE FEEDS</div>
                  {ioc.feeds.map(f=><div key={f} style={{padding:"6px 10px",background:T.bg2,borderRadius:4,marginBottom:4,fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.text}}>✓ {f}</div>)}
                </div>
                <div style={{marginTop:12}}>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>TAGS</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {ioc.tags.map(t=><Badge key={t} color={T.purple}>{t}</Badge>)}
                  </div>
                </div>
                <div style={{display:"flex",gap:8,marginTop:16}}>
                  <button style={{flex:1,padding:"8px 0",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:5,color:T.red,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Block Indicator</button>
                  <button style={{flex:1,padding:"8px 0",background:`${T.amber}14`,border:`1px solid ${T.amber}44`,borderRadius:5,color:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Create Hunt</button>
                </div>
              </Card>
            );
          })()}
        </div>
      )}

      {/* THREAT ACTORS */}
      {tab==="actors" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {ACTORS.map(actor=>(
            <Card key={actor.name} style={{border:`1px solid ${actor.active?sevC[actor.sev]:T.border}33`}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:8,background:`${sevC[actor.sev]}14`,border:`1px solid ${sevC[actor.sev]}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>☠</div>
                    <div>
                      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright}}>{actor.name}</div>
                      <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{actor.alias} · {actor.origin}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <Badge color={sevC[actor.sev]}>{actor.sev.toUpperCase()}</Badge>
                    <Badge color={actor.active?T.red:T.textDim}>{actor.active?"ACTIVE":"DORMANT"}</Badge>
                  </div>
                  <div style={{marginTop:8,fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Confidence: <span style={{color:actor.confidence>80?T.red:T.amber}}>{actor.confidence}%</span></div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Last activity: {actor.last}</div>
                </div>
                <div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6,letterSpacing:1}}>KNOWN TACTICS</div>
                  {actor.tactics.map(t=><div key={t} style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",marginBottom:3}}>▸ {t}</div>)}
                </div>
                <div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6,letterSpacing:1}}>KNOWN MALWARE</div>
                  {actor.malware.map(m=><div key={m} style={{padding:"4px 8px",background:`${T.red}10`,border:`1px solid ${T.red}33`,borderRadius:3,marginBottom:4,fontSize:11,color:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{m}</div>)}
                </div>
                <div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6,letterSpacing:1}}>MITRE TECHNIQUES</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                    {actor.mitre.map(t=><span key={t} style={{fontSize:10,color:T.purple,background:`${T.purple}14`,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}
                  </div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>TARGETED SECTORS</div>
                  {actor.targets.map(s=><div key={s} style={{fontSize:12,color:T.amber,fontFamily:"'Rajdhani',sans-serif"}}>• {s}</div>)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TIMELINE */}
      {tab==="timeline" && (
        <Card>
          <SectionHeader label="Attack Event Timeline — Last 4 Hours" accent={T.amber}/>
          <div style={{position:"relative",paddingLeft:24}}>
            <div style={{position:"absolute",left:8,top:0,bottom:0,width:2,background:`linear-gradient(${T.red},${T.amber},${T.border})`}}/>
            {TIMELINE.map((ev,i)=>(
              <div key={i} style={{position:"relative",marginBottom:20}}>
                <div style={{position:"absolute",left:-20,top:4,width:12,height:12,borderRadius:"50%",background:sevC[ev.sev],border:`2px solid ${T.bg1}`,boxShadow:`0 0 8px ${sevC[ev.sev]}66`}}/>
                <div style={{padding:"12px 14px",background:T.bg2,borderRadius:6,border:`1px solid ${sevC[ev.sev]}22`,borderLeft:`3px solid ${sevC[ev.sev]}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <Badge color={sevC[ev.sev]}>{ev.sev.toUpperCase()}</Badge>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{ev.time}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      <button style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Investigate</button>
                      <button style={{padding:"3px 8px",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:3,color:T.red,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Block</button>
                    </div>
                  </div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:T.textBright,marginBottom:4}}>{ev.event}</div>
                  <div style={{display:"flex",gap:14}}>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>SRC: <span style={{color:T.red}}>{ev.src}</span></span>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>DST: <span style={{color:T.cyan}}>{ev.dst}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MITRE ATT&CK */}
      {tab==="mitre" && (
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <SectionHeader label="MITRE ATT&CK Coverage Matrix" accent={T.purple}/>
              <div style={{display:"flex",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:12,height:12,borderRadius:2,background:T.green}}/><span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Covered</span></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:12,height:12,borderRadius:2,background:T.bg3}}/><span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Gap</span></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
              {MITRE_MATRIX.map(m=>(
                <div key={m.tactic} style={{padding:"10px 8px",background:m.covered?`${T.green}0a`:T.bg2,border:`1px solid ${m.covered?T.green:T.border}44`,borderRadius:6,textAlign:"center"}}>
                  <div style={{fontSize:16,marginBottom:4}}>{m.covered?"✓":"○"}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,color:m.covered?T.green:T.textDim,lineHeight:1.3}}>{m.tactic}</div>
                  <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{m.techniques.length} techniques</div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <SectionHeader label="Coverage Gaps — Priority Remediation" accent={T.red}/>
              {MITRE_MATRIX.filter(m=>!m.covered).map(m=>(
                <div key={m.tactic} style={{padding:"10px 12px",background:T.bg2,borderRadius:5,marginBottom:8,border:`1px solid ${T.red}22`}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:4}}>{m.tactic}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {m.techniques.map(t=><span key={t} style={{fontSize:10,color:T.textDim,background:T.bg3,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader label="Hunt Coverage by Tactic" accent={T.green}/>
              {MITRE_MATRIX.map(m=>(
                <div key={m.tactic} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{m.tactic}</span>
                    <span style={{fontSize:11,color:m.covered?T.green:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{m.covered?"COVERED":"GAP"}</span>
                  </div>
                  <div style={{height:4,background:T.bg3,borderRadius:2}}>
                    <div style={{width:m.covered?"100%":"0%",height:"100%",background:T.green,borderRadius:2,transition:"width .5s"}}/>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

const GrafanaView = () => {
  const [tab,setTab]=useState("scaffold");
  const [step,setStep]=useState(0);
  const [running,setRunning]=useState(false);
  const [lines,setLines]=useState([]);
  const [pType,setPType]=useState("panel");
  const [pName,setPName]=useState("zolextech-secops");
  const [selFile,setSelFile]=useState("module.tsx");
  const [pd,setPd]=useState(()=>Array.from({length:12},()=>({threats:rand(2,14),events:rand(800,1500),cpu:rand(20,85)})));
  useInterval(()=>setPd(d=>[...d.slice(1),{threats:rand(2,14),events:rand(800,1500),cpu:rand(20,85)}]),2500);
  const termRef=useRef();
  useEffect(()=>{if(termRef.current)termRef.current.scrollTop=termRef.current.scrollHeight;},[lines]);
  const STEPS=[
    {label:"Scaffold",cmd:"npx @grafana/create-plugin@latest",out:["  ╔═══════════════════════════════════╗","  ║ @grafana/create-plugin  v5.14.2  ║","  ╚═══════════════════════════════════╝","","  ✔ Plugin name  »  zolextech-secops","  ✔ Type         »  Panel","  ✔ Backend (Go) »  Yes","","  ✔ Scaffolded successfully!"]},
    {label:"Install", cmd:"npm install",                       out:["  added 847 packages in 34.2s","  ├── @grafana/data     ^11.1.0","  ├── @grafana/ui       ^11.1.0","  └── react             18.3.1"]},
    {label:"Dev",     cmd:"npm run dev",                       out:["  asset module.js  148 KiB","  ✔ Compiled in 3.4s","  ◉ http://localhost:3000"]},
    {label:"Docker",  cmd:"docker run -d -p 3000:3000 grafana/grafana:11.1.0",out:["  ✔ Container started","  ✔ Plugin loaded","  ✔ Ready at http://localhost:3000"]},
    {label:"Build",   cmd:"npx @grafana/create-plugin@latest build",out:["  lint ✔  typecheck ✔  tests ✔","  ✔ dist/zolextech-secops-panel.zip (142 KB)","  ✔ Ready to publish"]},
  ];
  const runStep=(idx)=>{
    if(running)return;
    setRunning(true);setStep(idx);setLines([]);
    const ls=[`$ ${STEPS[idx].cmd}`,"",...STEPS[idx].out,""];
    let i=0;const iv=setInterval(()=>{setLines(p=>[...p,ls[i]]);i++;if(i>=ls.length){clearInterval(iv);setRunning(false);}},100);
  };
  const FILES={"module.tsx":`import { PanelPlugin } from '@grafana/data';\nimport { SimplePanel } from './components/SimplePanel';\n\nexport const plugin = new PanelPlugin(SimplePanel)\n  .setPanelOptions(builder => {\n    builder\n      .addRadio({ path:'colorScheme', defaultValue:'dark', name:'Color Scheme',\n        settings:{ options:[{value:'dark',label:'Dark'},{value:'light',label:'Light'}] } })\n      .addBooleanSwitch({ path:'showLegend', name:'Show Legend', defaultValue:true });\n  });`,"SimplePanel.tsx":`import React from 'react';\nimport { PanelProps } from '@grafana/data';\nimport { useTheme2 } from '@grafana/ui';\n\nexport const SimplePanel: React.FC<PanelProps> = ({ options, data, width, height }) => {\n  const theme = useTheme2();\n  return (\n    <div style={{ width, height, background: theme.colors.background.primary,\n      padding: theme.spacing(2) }}>\n      <ThreatTimeline values={data.series[0]?.fields[1]?.values.toArray()}\n        showLegend={options.showLegend} />\n    </div>\n  );\n};`,"plugin.json":`{\n  "type": "panel",\n  "name": "ZolexTech SecOps Panel",\n  "id": "zolextech-secops-panel",\n  "info": {\n    "description": "Real-time SecOps for ZolexTech",\n    "author": { "name": "Adebayo Paul Oke", "url": "https://zolextech.com" },\n    "version": "1.0.0"\n  },\n  "dependencies": { "grafanaDependency": ">=10.0.0" }\n}`};
  const maxT=Math.max(...pd.map(d=>d.threats)),maxE=Math.max(...pd.map(d=>d.events));
  const Bars=({kn,color,maxV})=>(<div style={{display:"flex",alignItems:"flex-end",gap:2,height:60}}>{pd.map((d,i)=><div key={i} style={{flex:1,background:`${color}bb`,borderRadius:"2px 2px 0 0",height:`${(d[kn]/maxV)*100}%`,transition:"height .4s",minHeight:2}}/>)}</div>);
  const Gauge=({value,max,color})=>{ const pct=value/max,r=35,cx=46,cy=48; const xy=deg=>({x:cx+r*Math.cos(deg*Math.PI/180),y:cy+r*Math.sin(deg*Math.PI/180)}); const s=xy(-135),e=xy(-135+pct*270),lg=pct>.5?1:0; return(<svg width="92" height="62" viewBox="0 0 92 62"><path d={`M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${xy(135).x} ${xy(135).y}`} fill="none" stroke={T.bg3} strokeWidth="7" strokeLinecap="round"/><path d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" style={{transition:"all .5s"}}/><text x={cx} y={cy-2} textAnchor="middle" fill={color} fontSize="13" fontFamily="'JetBrains Mono',monospace" fontWeight="700">{value}</text></svg>); };
  const TABS=["scaffold","panels","code","publish"];
  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:14,marginBottom:20,flexWrap:"wrap"}}>
        <MetricCard label="GRAFANA" value="11.1" unit=".0" icon="▣" color={T.orange}/>
        <MetricCard label="TYPE"    value="Panel" icon="◫" color={T.purple}/>
        <MetricCard label="BUILD"   value="✓ OK" icon="⚙" color={T.green}/>
        <MetricCard label="SCORE"   value={97} unit="%" icon="★" color={T.amber}/>
      </div>
      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.orange}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.orange:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>{({scaffold:"🔧 Scaffold",panels:"📊 Panels",code:"📝 Code",publish:"🚀 Publish"})[t]}</button>)}
      </div>
      {tab==="scaffold" && (
        <div style={{display:"grid",gridTemplateColumns:"230px 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Config" accent={T.orange}/>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>PLUGIN NAME</div>
              <input value={pName} onChange={e=>setPName(e.target.value)} style={{width:"100%",background:T.bg0,border:`1px solid ${T.border}`,borderRadius:3,padding:"6px 10px",color:T.cyan,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none"}}/>
            </div>
            <div style={{marginBottom:14}}>
              {["panel","datasource","app"].map(pt=>(
                <label key={pt} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,cursor:"pointer"}} onClick={()=>setPType(pt)}>
                  <div style={{width:12,height:12,borderRadius:"50%",border:`2px solid ${pType===pt?T.orange:T.border}`,background:pType===pt?T.orange:"transparent"}}/>
                  <span style={{fontSize:12,color:pType===pt?T.orange:T.textDim,fontFamily:"'JetBrains Mono',monospace",textTransform:"capitalize"}}>{pt}</span>
                </label>
              ))}
            </div>
            <SectionHeader label="CLI Steps" accent={T.orange}/>
            {STEPS.map((s,i)=>(
              <button key={i} onClick={()=>runStep(i)} disabled={running} style={{width:"100%",marginBottom:5,padding:"7px 10px",textAlign:"left",background:step===i&&!running?`${T.orange}12`:T.bg2,border:`1px solid ${step===i?T.orange:T.border}`,borderRadius:3,cursor:running?"default":"pointer",color:step===i?T.orange:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>
                {running&&step===i?"⟳ ":i<step?"✓ ":"▶ "}Step {i+1}: {s.label}
              </button>
            ))}
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <SectionHeader label="Terminal — Grafana CLI" accent={T.orange}/>
              <Badge color={T.orange}>@grafana/create-plugin</Badge>
            </div>
            <div ref={termRef} style={{background:"#080808",borderRadius:4,padding:"14px 16px",minHeight:300,maxHeight:360,overflowY:"auto",border:`1px solid ${T.border}`,fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.8}}>
              {lines.length===0?<div style={{color:T.textDim}}>▸ Click a step to execute...</div>:lines.map((l,i)=><div key={i} style={{color:l.startsWith("$")?T.cyan:l.includes("✔")?T.green:l.includes("├")||l.includes("└")?T.textDim:T.text,whiteSpace:"pre"}}>{l}</div>)}
              {running&&<div style={{color:T.amber,animation:"pulse 1s infinite"}}>█</div>}
            </div>
            <div style={{marginTop:10,padding:"10px 14px",background:T.bg0,borderRadius:4,border:`1px dashed ${T.orange}55`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.orange}}>$ npx @grafana/create-plugin@latest</span>
              <Badge color={T.orange}>QUICK START</Badge>
            </div>
          </Card>
        </div>
      )}
      {tab==="panels" && (
        <div>
          <div style={{background:"#161620",border:"1px solid #2a2a40",borderRadius:"6px 6px 0 0",padding:"8px 16px",display:"flex",alignItems:"center",gap:16}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.orange}}>▣ Grafana 11</span>
            <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>ZolexTech SecOps Live</span>
            <div style={{marginLeft:"auto",display:"flex",gap:8}}><Badge color={T.orange}>Last 30s</Badge><Badge color={T.green}>● Live</Badge></div>
          </div>
          <div style={{background:"#111116",border:"1px solid #2a2a40",borderTop:"none",borderRadius:"0 0 6px 6px",padding:14}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
              {[{l:"Threats",v:pd[pd.length-1].threats,max:20,c:T.red},{l:"CPU %",v:pd[pd.length-1].cpu,max:100,c:T.amber},{l:"Compliance %",v:94,max:100,c:T.green}].map(g=>(
                <div key={g.l} style={{background:"#1a1a2e",border:"1px solid #2a2a4a",borderRadius:4,padding:"12px",textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#ccc",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,marginBottom:6}}>{g.l}</div>
                  <div style={{display:"flex",justifyContent:"center"}}><Gauge value={g.v} max={g.max} color={g.c}/></div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={{background:"#1a1a2e",border:"1px solid #2a2a4a",borderRadius:4,padding:"12px"}}><div style={{fontSize:11,color:"#ccc",marginBottom:8,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>Active Threats</div><Bars kn="threats" color={T.red} maxV={maxT}/></div>
              <div style={{background:"#1a1a2e",border:"1px solid #2a2a4a",borderRadius:4,padding:"12px"}}><div style={{fontSize:11,color:"#ccc",marginBottom:8,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>Event Volume</div><Bars kn="events" color={T.cyan} maxV={maxE}/></div>
            </div>
          </div>
        </div>
      )}
      {tab==="code" && (
        <div style={{display:"grid",gridTemplateColumns:"170px 1fr",gap:14}}>
          <Card style={{padding:"12px 0"}}>
            <div style={{padding:"0 14px 10px"}}><SectionHeader label="Files" accent={T.orange}/></div>
            {Object.keys(FILES).map(f=><button key={f} onClick={()=>setSelFile(f)} style={{width:"100%",padding:"8px 14px",textAlign:"left",background:selFile===f?`${T.orange}10`:"transparent",borderLeft:selFile===f?`2px solid ${T.orange}`:"2px solid transparent",border:"none",cursor:"pointer",color:selFile===f?T.orange:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>📄 {f}</button>)}
          </Card>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <SectionHeader label={selFile} accent={T.orange}/><Badge color={T.orange}>SDK v11</Badge>
            </div>
            <div style={{background:T.bg0,borderRadius:4,padding:"12px 14px",overflowX:"auto",lineHeight:1.8}}>
              {FILES[selFile].split("\n").map((line,i)=>{
                let c=T.text;
                if(line.trim().startsWith("//")) c=T.textDim;
                else if(line.includes("import")||line.includes("export")) c=T.purple;
                else if(line.includes("const")||line.includes("interface")) c=T.cyan;
                else if(line.match(/'[^']*'|"[^"]*"/)) c=T.green;
                return <div key={i} style={{display:"flex",gap:14}}><span style={{color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:11,minWidth:22,textAlign:"right",userSelect:"none"}}>{i+1}</span><span style={{color:c,fontFamily:"'JetBrains Mono',monospace",fontSize:11,whiteSpace:"pre"}}>{line}</span></div>;
              })}
            </div>
          </Card>
        </div>
      )}
      {tab==="publish" && (
        <Card>
          <SectionHeader label="Publish to Grafana Catalog" accent={T.orange}/>
          {[{s:"01",l:"Sign Plugin",d:"npx @grafana/sign-plugin@latest --rootUrls https://zolextech.com",done:true},{s:"02",l:"Run Validator",d:"npx @grafana/plugin-validator-cli@latest ./dist",done:true},{s:"03",l:"GitHub Release",d:"git tag v1.0.0 && git push --tags",done:true},{s:"04",l:"Submit PR",d:"github.com/grafana/grafana-plugin-repository",done:false},{s:"05",l:"Grafana Review",d:"Security review (3–5 business days)",done:false}].map(s=>(
            <div key={s.s} style={{padding:"11px 14px",background:T.bg2,borderRadius:4,borderLeft:`3px solid ${s.done?T.green:T.border}`,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>STEP {s.s}</span>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:s.done?T.green:T.textBright}}>{s.l}</span>
                <span style={{marginLeft:"auto",fontSize:11,color:s.done?T.green:T.textDim}}>{s.done?"✓ Done":"⏳ Pending"}</span>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{s.d}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// AI SECURITY ANALYST — Powered by Claude API
// ═══════════════════════════════════════════════════════════════════════
// Env var embedded at build time — used as the fallback key throughout the component.
const ENV_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

const AIAnalystView = () => {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hello! I'm your AI Security Analyst powered by Claude. I can analyze threats, review code for vulnerabilities, explain CVEs, generate incident reports, or help with compliance questions. What would you like to investigate today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("general");
  const [apiKey, setApiKey] = useState(() => {
    const stored = localStorage.getItem("anthropic_api_key");
    if (stored) return stored;
    if (ENV_API_KEY) { localStorage.setItem("anthropic_api_key", ENV_API_KEY); return ENV_API_KEY; }
    return "";
  });
  const [keyDraft, setKeyDraft] = useState("");
  const [showKeySetup, setShowKeySetup] = useState(false);
  const bottomRef = useRef();

  const saveKey = () => {
    const k = keyDraft.trim();
    if (!k) return;
    localStorage.setItem("anthropic_api_key", k);
    setApiKey(k);
    setKeyDraft("");
    setShowKeySetup(false);
  };
  // Removing the manual override restores the env-var key rather than disconnecting.
  const clearKey = () => {
    localStorage.removeItem("anthropic_api_key");
    if (ENV_API_KEY) { localStorage.setItem("anthropic_api_key", ENV_API_KEY); }
    setApiKey(ENV_API_KEY);
  };
  const openKeyModal = () => {
    setKeyDraft(apiKey || ENV_API_KEY);
    setShowKeySetup(true);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const CONTEXTS = [
    { id:"general",    label:"General Security",    icon:"◈" },
    { id:"threat",     label:"Threat Analysis",     icon:"⊕" },
    { id:"code",       label:"Code Review",         icon:"⌬" },
    { id:"compliance", label:"Compliance",          icon:"❑" },
    { id:"incident",   label:"Incident Response",   icon:"⚠" },
  ];

  const PROMPTS = [
    "Analyze the lateral movement pattern: 10.0.2.45 → 10.0.3.12 via SMB",
    "Explain CVE-2023-44487 HTTP/2 Rapid Reset and mitigation steps",
    "Review this Terraform IAM policy for security issues",
    "Generate a SOC 2 incident report template for a data exposure event",
    "What MITRE ATT&CK techniques map to credential dumping attacks?",
    "How should I harden an AWS EC2 instance running NGINX?",
  ];

  const systemPrompts = {
    general:    "You are a senior cybersecurity analyst at ZolexTech. Provide concise, actionable security guidance. Use technical terminology appropriately. Format responses with clear sections when helpful.",
    threat:     "You are a threat intelligence analyst. Analyze IOCs, TTPs, and attack patterns. Reference MITRE ATT&CK when relevant. Be precise about confidence levels.",
    code:       "You are a secure code reviewer specializing in OWASP Top 10, SAST findings, and secure architecture patterns. Identify vulnerabilities and provide specific remediation code.",
    compliance: "You are a compliance expert covering SOC 2, ISO 27001, NIST CSF, and CIS Controls. Map findings to control frameworks and provide audit-ready language.",
    incident:   "You are an incident response lead. Follow NIST SP 800-61 phases. Provide structured runbooks, containment steps, and post-incident documentation templates.",
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!apiKey) { openKeyModal(); return; }

    const userMsg = { role:"user", content: input.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    // Anthropic API requires conversations to start with a user message —
    // strip any leading assistant messages (e.g. the welcome prompt).
    const allApiMsgs = newHistory
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role, content: m.content }));
    const firstUserIdx = allApiMsgs.findIndex(m => m.role === "user");
    const apiMessages = firstUserIdx > 0 ? allApiMsgs.slice(firstUserIdx) : allApiMsgs;

    // In dev the Vite proxy forwards /api/claude → api.anthropic.com (no CORS).
    // In production we call Anthropic directly with the browser-call permission header.
    const ANTHROPIC_ENDPOINT = import.meta.env.DEV
      ? "/api/claude/v1/messages"
      : "https://api.anthropic.com/v1/messages";

    try {
      const response = await fetch(ANTHROPIC_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          ...(import.meta.env.PROD && { "anthropic-dangerous-direct-browser-calls": "true" }),
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 2048,
          stream: true,
          system: systemPrompts[context],
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(()=>({}));
        const errMsg = response.status === 401
          ? "⚠ Invalid API key — click the key icon above to update it."
          : response.status === 429
          ? "⚠ Rate limited — please wait a moment and try again."
          : response.status === 529
          ? "⚠ Claude API is temporarily overloaded — try again shortly."
          : `⚠ API error ${response.status}: ${errData?.error?.message || "Unknown error"}`;
        setMessages(m => [...m, { role:"assistant", content: errMsg }]);
        setLoading(false);
        return;
      }

      // Add streaming placeholder and fill it token-by-token
      setMessages(m => [...m, { role:"assistant", content:"", streaming:true }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop(); // keep any incomplete trailing line
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const evt = JSON.parse(payload);
            if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
              const token = evt.delta.text;
              setMessages(m => {
                const arr = [...m];
                const last = arr[arr.length - 1];
                if (last?.streaming) arr[arr.length - 1] = { ...last, content: last.content + token };
                return arr;
              });
            }
          } catch { /* ignore partial-event parse errors */ }
        }
      }

      // Mark streaming complete
      setMessages(m => {
        const arr = [...m];
        const last = arr[arr.length - 1];
        if (last?.streaming) arr[arr.length - 1] = { ...last, streaming: false };
        return arr;
      });
    } catch (err) {
      const isNetErr = err instanceof TypeError && err.message.includes("fetch");
      const errContent = isNetErr
        ? "⚠ Network error — check your connection or CORS policy."
        : "⚠ Unexpected error. Please try again.";
      setMessages(m => {
        const arr = [...m];
        const last = arr[arr.length - 1];
        // Replace streaming placeholder if it exists, otherwise append
        if (last?.streaming) { arr[arr.length - 1] = { role:"assistant", content: errContent }; return arr; }
        return [...m, { role:"assistant", content: errContent }];
      });
    }
    setLoading(false);
  };

  const parseInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((p, idx) => {
      if (p.startsWith("`") && p.endsWith("`"))
        return <code key={idx} style={{ background:T.bg0, border:`1px solid ${T.border}33`, borderRadius:3, padding:"1px 5px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.green }}>{p.slice(1,-1)}</code>;
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={idx} style={{ color:T.amber, fontWeight:700 }}>{p.slice(2,-2)}</strong>;
      return p;
    });
  };

  const renderMsg = (text) => {
    const segments = text.split(/(```[\s\S]*?```)/g);
    return segments.map((seg, si) => {
      if (seg.startsWith("```") && seg.endsWith("```")) {
        const code = seg.replace(/^```[^\n]*\n?/, "").replace(/\n?```$/, "");
        return (
          <pre key={si} style={{ background:T.bg0, border:`1px solid ${T.border}`, borderRadius:6, padding:"10px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.green, margin:"6px 0", overflowX:"auto", lineHeight:1.5, whiteSpace:"pre-wrap" }}>
            {code}
          </pre>
        );
      }
      return seg.split("\n").map((line, i) => {
        const k = `${si}-${i}`;
        if (line.startsWith("###")) return <div key={k} style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:T.cyan, marginTop:10, marginBottom:4 }}>{parseInline(line.replace(/^###\s*/,""))}</div>;
        if (line.startsWith("##"))  return <div key={k} style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:16, color:T.textBright, marginTop:12, marginBottom:4 }}>{parseInline(line.replace(/^##\s*/,""))}</div>;
        if (line.startsWith("**") && line.endsWith("**")) return <div key={k} style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, color:T.amber, marginTop:6 }}>{line.replace(/\*\*/g,"")}</div>;
        if (line.startsWith("- ") || line.startsWith("• ")) return <div key={k} style={{ display:"flex", gap:8, marginBottom:3, marginLeft:8 }}><span style={{ color:T.cyan, flexShrink:0 }}>▸</span><span style={{ fontSize:13, color:T.text, fontFamily:"'Rajdhani',sans-serif", lineHeight:1.6 }}>{parseInline(line.slice(2))}</span></div>;
        if (line.match(/^\d+\.\s/)) return <div key={k} style={{ display:"flex", gap:8, marginBottom:3, marginLeft:8 }}><span style={{ color:T.purple, flexShrink:0, fontFamily:"'JetBrains Mono',monospace", fontSize:11, minWidth:16 }}>{line.match(/^\d+/)[0]}.</span><span style={{ fontSize:13, color:T.text, fontFamily:"'Rajdhani',sans-serif", lineHeight:1.6 }}>{parseInline(line.replace(/^\d+\.\s/,""))}</span></div>;
        if (line.startsWith("`") && line.endsWith("`")) return <code key={k} style={{ display:"block", background:T.bg0, border:`1px solid ${T.border}`, borderRadius:4, padding:"2px 8px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.green, margin:"2px 0" }}>{line.replace(/`/g,"")}</code>;
        if (!line.trim()) return <div key={k} style={{ height:8 }} />;
        return <div key={k} style={{ fontSize:13, color:T.text, fontFamily:"'Rajdhani',sans-serif", lineHeight:1.7, marginBottom:2 }}>{parseInline(line)}</div>;
      });
    });
  };

  return (
    <div className="fadeIn" style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:14, height:"calc(100vh - 140px)", maxHeight:780 }}>
      {/* API key setup modal */}
      {showKeySetup && (
        <div style={{ position:"fixed", inset:0, background:"rgba(6,10,14,.85)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:440, background:T.bg1, border:`1px solid ${T.border}`, borderRadius:12, padding:"28px 32px", boxShadow:`0 0 60px rgba(0,0,0,.7)` }} className="slideUp">
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`linear-gradient(135deg,${T.purple},${T.cyan})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>✦</div>
              <div>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:17, color:T.textBright }}>Connect AI Analyst</div>
                <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>Anthropic API key required</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", lineHeight:1.7, marginBottom:18 }}>
              Your key is stored only in this browser&apos;s localStorage — it is never sent to any server other than <span style={{ color:T.cyan }}>api.anthropic.com</span>.
            </div>
            <div style={{ marginBottom:6, fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1 }}>ANTHROPIC API KEY</div>
            <input
              type="password"
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveKey()}
              placeholder="sk-ant-api03-..."
              style={{ width:"100%", padding:"11px 14px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:13, outline:"none", marginBottom:14, boxSizing:"border-box" }}
              onFocus={e => e.target.style.borderColor = T.purple}
              onBlur={e => e.target.style.borderColor = T.border}
            />
            <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginBottom:18 }}>
              Get your key at <span style={{ color:T.cyan }}>console.anthropic.com</span> → API Keys
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={saveKey} disabled={!keyDraft.trim()} style={{ flex:1, padding:"11px 0", background:keyDraft.trim()?`linear-gradient(135deg,${T.purple},${T.cyanDim})`:"T.bg3", border:"none", borderRadius:6, color:"#000", fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, cursor:keyDraft.trim()?"pointer":"default" }}>
                Save & Connect
              </button>
              <button onClick={() => setShowKeySetup(false)} style={{ padding:"11px 20px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:6, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:14, cursor:"pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat area */}
      <Card style={{ display:"flex", flexDirection:"column", padding:0, overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${T.purple},${T.cyan})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow:`0 0 14px ${T.purple}44` }}>✦</div>
          <div>
            <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:T.textBright }}>AI Security Analyst</div>
            <div style={{ fontSize:11, color:apiKey?T.green:T.amber, fontFamily:"'JetBrains Mono',monospace" }}>
              {apiKey ? `● Connected · claude-sonnet-4-6 · ${context} mode` : "⚠ No API key — click Configure to connect"}
            </div>
          </div>
          <div style={{ marginLeft:"auto", display:"flex", gap:6, alignItems:"center" }}>
            {CONTEXTS.map(c => (
              <button key={c.id} onClick={() => setContext(c.id)} title={c.label}
                style={{ width:28, height:28, background:context===c.id?`${T.purple}22`:"transparent", border:`1px solid ${context===c.id?T.purple:T.border}`, borderRadius:4, color:context===c.id?T.purple:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontSize:13, cursor:"pointer", transition:"all .15s", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
                onMouseEnter={e=>{if(context!==c.id){e.currentTarget.style.borderColor=T.purple;e.currentTarget.style.color=T.purple;}}}
                onMouseLeave={e=>{if(context!==c.id){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textDim;}}}>
                {c.icon}
              </button>
            ))}
            <button onClick={openKeyModal}
              title={apiKey ? "Change API key" : "Configure API key"}
              style={{ padding:"4px 10px", background:apiKey?`${T.green}14`:`${T.amber}14`, border:`1px solid ${apiKey?T.green:T.amber}44`, borderRadius:4, color:apiKey?T.green:T.amber, fontFamily:"'JetBrains Mono',monospace", fontSize:10, cursor:"pointer", transition:"all .15s", whiteSpace:"nowrap" }}>
              {apiKey ? "🔑 Key set" : "🔑 Configure"}
            </button>
            {apiKey && <button onClick={clearKey} title="Remove API key" style={{ padding:"4px 8px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontSize:10, cursor:"pointer" }}>✕</button>}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 20px", display:"flex", flexDirection:"column", gap:14 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", flexDirection: msg.role==="user"?"row-reverse":"row" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background: msg.role==="user"?`linear-gradient(135deg,${T.cyan},${T.purple})`:`linear-gradient(135deg,${T.purple},${T.red})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#000", flexShrink:0, boxShadow:`0 0 10px ${msg.role==="user"?T.cyan:T.purple}44` }}>
                {msg.role==="user"?"A":"✦"}
              </div>
              <div style={{ maxWidth:"82%", padding:"12px 16px", background: msg.role==="user"?`${T.cyan}0e`:T.bg2, border:`1px solid ${msg.role==="user"?T.cyanDim:msg.streaming?T.purple:T.border}`, borderRadius: msg.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px", transition:"border-color .2s" }}>
                {msg.streaming && !msg.content ? (
                  <div style={{ display:"flex", gap:5, padding:"2px 0" }}>
                    {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:T.purple, animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />)}
                  </div>
                ) : (
                  <>
                    {renderMsg(msg.content)}
                    {msg.streaming && <span className="cursor-blink" style={{ color:T.purple }} />}
                  </>
                )}
              </div>
            </div>
          ))}
          {/* Separate dots only while waiting for the first streaming chunk */}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${T.purple},${T.red})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#000" }}>✦</div>
              <div style={{ padding:"14px 18px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:"12px 12px 12px 4px" }}>
                <div style={{ display:"flex", gap:5 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:T.purple, animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding:"14px 18px", borderTop:`1px solid ${T.border}`, display:"flex", gap:10 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()} placeholder={`Ask your ${context} security question...`}
            style={{ flex:1, padding:"11px 14px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'Rajdhani',sans-serif", fontSize:14, outline:"none", transition:"border-color .15s" }}
            onFocus={e=>e.target.style.borderColor=T.purple} onBlur={e=>e.target.style.borderColor=T.border} />
          <button onClick={sendMessage} disabled={loading||!input.trim()} style={{ padding:"10px 20px", background:loading||!input.trim()?T.bg3:`linear-gradient(135deg,${T.purple},${T.cyanDim})`, border:"none", borderRadius:6, color:loading||!input.trim()?T.textDim:"#000", fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, cursor:loading||!input.trim()?"default":"pointer", transition:"all .15s" }}>
            {loading ? "⟳" : "▶ Send"}
          </button>
        </div>
      </Card>

      {/* Sidebar: context + prompts + info */}
      <div style={{ display:"flex", flexDirection:"column", gap:12, overflowY:"auto" }}>
        <Card>
          <SectionHeader label="Context Mode" accent={T.purple} />
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {CONTEXTS.map(c => (
              <button key={c.id} onClick={() => setContext(c.id)}
                style={{ padding:"8px 10px", background:context===c.id?`${T.purple}18`:"transparent", border:`1px solid ${context===c.id?T.purple:T.border}`, borderRadius:5, color:context===c.id?T.purple:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:context===c.id?700:500, fontSize:12.5, cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:8, transition:"all .15s" }}
                onMouseEnter={e=>{if(context!==c.id){e.currentTarget.style.borderColor=T.purple;e.currentTarget.style.color=T.text;}}}
                onMouseLeave={e=>{if(context!==c.id){e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textDim;}}}>
                <span style={{ fontSize:14, width:18, flexShrink:0, textAlign:"center" }}>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader label="Quick Prompts" accent={T.cyan} />
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {PROMPTS.map((p,i) => (
              <button key={i} onClick={() => setInput(p)} style={{ padding:"8px 10px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:5, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontSize:12, cursor:"pointer", textAlign:"left", lineHeight:1.4, transition:"all .15s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.cyan;e.currentTarget.style.color=T.text;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textDim;}}>
                {p}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <SectionHeader label="Session Info" accent={T.cyan} />
          {[["Model","claude-sonnet-4-6"],["Mode","Streaming SSE"],["Context",context],["Max tokens","2,048"],["Status",apiKey?"● Connected":"⚠ No key"],["Messages",messages.length]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{k}</span>
              <span style={{ fontSize:11, color:k==="Status"?(apiKey?T.green:T.amber):T.cyan, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
            </div>
          ))}
          <button onClick={()=>setMessages([{role:"assistant",content:"Session cleared. How can I help with your security investigation?"}])} style={{ marginTop:12, width:"100%", padding:"7px 0", background:"transparent", border:`1px solid ${T.red}44`, borderRadius:4, color:T.red, fontFamily:"'JetBrains Mono',monospace", fontSize:11, cursor:"pointer", letterSpacing:1 }}>⎋ Clear Session</button>
        </Card>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// LIVE EVENTS FEED
// ═══════════════════════════════════════════════════════════════════════
const EventsView = () => {
  const TYPES = ["AUTH","NETWORK","SCAN","DEPLOY","THREAT","AUDIT","API","SYSTEM"];
  const _SEVS = ["INFO","WARN","HIGH","CRITICAL"];
  const SRCS  = ["10.0.2.45","10.0.3.12","185.220.101.8","172.16.0.4","AWS-ECS","NGINX","FastAPI","PostgreSQL","Redis","GitLab-CI"];
  const MSGS  = [
    "Successful SSH login from authorized IP",
    "SAST scan completed — 2 findings",
    "Pipeline zolextech/backend triggered",
    "JWT token issued for adebayo@zolextech.com",
    "Suspicious port scan detected from 185.220.101.8",
    "S3 PutObject: zolextech-prod/backups/db-2026.sql",
    "Container health check failed — restarting",
    "TLS certificate renewed: *.zolextech.com",
    "IAM policy change detected in us-east-1",
    "Redis cache hit ratio dropped to 61%",
    "New EC2 instance launched: i-0a3f9b8c7d",
    "DDoS mitigation triggered: 42k req/s",
    "Database query time exceeded 2s SLA",
    "NGINX 403 spike +340% from 45.142.212.100",
    "Compliance scan completed: 94% SOC2 coverage",
    "SSH brute force: 847 attempts from 185.220.101.8",
    "CloudTrail: PutBucketAcl detected — s3://prod",
    "WAF BLOCK: SQL injection attempt dropped",
    "JWT validation failed: expired token reuse attempt",
    "EKS node scale-out triggered: CPU 94%",
  ];

  const mkEvent = (id) => ({
    id, ts: new Date().toISOString(),
    type: TYPES[rand(0,TYPES.length-1)],
    sev:  rand(0,10) < 6 ? "INFO" : rand(0,10) < 4 ? "WARN" : rand(0,10) < 7 ? "HIGH" : "CRITICAL",
    src:  SRCS[rand(0,SRCS.length-1)],
    msg:  MSGS[rand(0,MSGS.length-1)],
    ack:  false,
  });

  const [events, setEvents]         = useState(()=> Array.from({length:30}, (_,i)=>mkEvent(1000-i)));
  const [paused, setPaused]         = useState(false);
  const [filter, setFilter]         = useState("ALL");
  const [srcFilter, setSrcFilter]   = useState("ALL");
  const [search, setSearch]         = useState("");
  const [ackedIds, setAckedIds]     = useState(new Set());
  const [histogram, setHistogram]   = useState(Array.from({length:30},()=>rand(5,40)));
  const [rate, setRate]             = useState(0);
  const countRef                    = useRef(0);

  useInterval(()=>{
    if(paused) return;
    setEvents(ev=>[mkEvent(Date.now()), ...ev.slice(0,499)]);
    countRef.current++;
    setHistogram(h=>[...h.slice(1), rand(5,60)]);
  }, 1200);

  useInterval(()=>{ setRate(countRef.current*5); countRef.current=0; }, 5000);

  const sevColor = { INFO:T.cyan, WARN:T.amber, HIGH:T.red, CRITICAL:T.red };
  const typeColor = { AUTH:T.purple, NETWORK:T.cyan, SCAN:T.amber, DEPLOY:T.green, THREAT:T.red, AUDIT:T.orange, API:T.orange, SYSTEM:T.textDim };

  const _srcs = ["ALL", ...new Set(SRCS)];

  const filtered = events.filter(e=>
    (filter==="ALL" || e.sev===filter || e.type===filter) &&
    (srcFilter==="ALL" || e.src===srcFilter) &&
    (!search || e.msg.toLowerCase().includes(search.toLowerCase()) || e.src.includes(search))
  );

  const ack = (id) => setAckedIds(s=>{ const n=new Set(s); n.add(id); return n; });

  const critCount = events.filter(e=>e.sev==="CRITICAL"&&!ackedIds.has(e.id)).length;
  const highCount = events.filter(e=>e.sev==="HIGH"&&!ackedIds.has(e.id)).length;
  const histMax   = Math.max(...histogram, 1);

  return (
    <div className="fadeIn">
      {/* KPI row */}
      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <MetricCard label="BUFFER"       value={events.length}         icon="⬡" color={T.cyan}/>
        <MetricCard label="CRITICAL"     value={critCount}             icon="⚠" color={T.red} delta={critCount>0?critCount:undefined}/>
        <MetricCard label="HIGH"         value={highCount}             icon="▲" color={T.amber}/>
        <MetricCard label="EVT / MIN"    value={rate}                  icon="⏱" color={T.green}/>
        <MetricCard label="ACKNOWLEDGED" value={ackedIds.size}         icon="✓" color={T.textDim}/>
        <MetricCard label="STATUS"       value={paused?"PAUSED":"LIVE"} icon="●" color={paused?T.amber:T.green}/>
      </div>

      {/* Histogram */}
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {!paused && <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 1s infinite"}}/>}
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{paused?"⏸ PAUSED":"● STREAMING"}</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>· {filtered.length} visible · {events.filter(e=>e.sev==="CRITICAL").length} critical</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Event rate — last 30 intervals</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:2,height:44}}>
          {histogram.map((v,i)=>(
            <div key={i} style={{flex:1,borderRadius:"2px 2px 0 0",background:i===histogram.length-1?T.cyan:`${T.cyan}55`,height:`${(v/histMax)*100}%`,minHeight:2,transition:"height .3s"}}/>
          ))}
        </div>
      </Card>

      {/* Filter bar */}
      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>SEVERITY</span>
          {["ALL","INFO","WARN","HIGH","CRITICAL"].map(f=>{
            const fc = f==="ALL"?T.cyan:f==="INFO"?T.cyan:f==="WARN"?T.amber:T.red;
            return <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 10px",background:filter===f?`${fc}18`:"transparent",border:`1px solid ${filter===f?fc:T.border}`,borderRadius:4,color:filter===f?fc:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>{f}</button>;
          })}
          <div style={{width:1,height:18,background:T.border,margin:"0 4px"}}/>
          <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",flexShrink:0}}>TYPE</span>
          {["THREAT","AUTH","DEPLOY","SCAN"].map(f=>(
            <button key={f} onClick={()=>setFilter(prev=>prev===f?"ALL":f)} style={{padding:"5px 10px",background:filter===f?`${typeColor[f]||T.textDim}18`:"transparent",border:`1px solid ${filter===f?typeColor[f]||T.textDim:T.border}`,borderRadius:4,color:filter===f?typeColor[f]||T.textDim:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>{f}</button>
          ))}
          <div style={{width:1,height:18,background:T.border,margin:"0 4px"}}/>
          <select value={srcFilter} onChange={e=>setSrcFilter(e.target.value)}
            style={{padding:"5px 8px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,outline:"none",cursor:"pointer"}}>
            {["ALL",...new Set(SRCS)].map(s=><option key={s} value={s}>{s==="ALL"?"All Sources":s}</option>)}
          </select>
          <div style={{width:1,height:18,background:T.border,margin:"0 4px"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events…"
            style={{padding:"6px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",width:180,marginLeft:2}}
            onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border}/>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button onClick={()=>setPaused(p=>!p)} style={{padding:"6px 14px",background:paused?`${T.green}18`:`${T.amber}18`,border:`1px solid ${paused?T.green:T.amber}`,borderRadius:5,color:paused?T.green:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
              {paused?"▶ RESUME":"⏸ PAUSE"}
            </button>
            <button onClick={()=>{ setEvents([]); setAckedIds(new Set()); }} style={{padding:"6px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer"}}>⎋ Clear</button>
          </div>
        </div>
      </Card>

      {/* Event table */}
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{maxHeight:520,overflowY:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead style={{position:"sticky",top:0,background:T.bg1,zIndex:1}}>
              <tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["TIMESTAMP","SEV","TYPE","SOURCE","MESSAGE",""].map(h=>(
                  <th key={h} style={{padding:"8px 14px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,120).map((ev,i)=>{
                const isAcked = ackedIds.has(ev.id);
                const rowBg   = isAcked?T.bg0+"66":ev.sev==="CRITICAL"?`${T.red}08`:ev.sev==="HIGH"?`${T.amber}06`:i===0&&!paused?`${T.cyan}05`:"transparent";
                return (
                  <tr key={ev.id} style={{borderBottom:`1px solid ${T.border}11`,background:rowBg,transition:"background .3s",opacity:isAcked?.5:1}}>
                    <td style={{padding:"8px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,whiteSpace:"nowrap"}}>{new Date(ev.ts).toLocaleTimeString()}</td>
                    <td style={{padding:"8px 14px"}}><Badge color={sevColor[ev.sev]}>{ev.sev}</Badge></td>
                    <td style={{padding:"8px 14px"}}><span style={{fontSize:10,color:typeColor[ev.type]||T.textDim,background:(typeColor[ev.type]||T.textDim)+"14",padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{ev.type}</span></td>
                    <td style={{padding:"8px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:ev.src==="185.220.101.8"?T.red:T.cyan,whiteSpace:"nowrap"}}>{ev.src}</td>
                    <td style={{padding:"8px 14px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:ev.sev==="CRITICAL"?T.red:ev.sev==="HIGH"?T.amber:isAcked?T.textDim:T.text,maxWidth:380}}>{ev.msg}</td>
                    <td style={{padding:"8px 14px"}}>
                      {!isAcked
                        ? <button onClick={()=>ack(ev.id)} style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9,transition:"all .12s"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.green;e.currentTarget.style.color=T.green;}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textDim;}}>ACK</button>
                        : <span style={{fontSize:11,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>✓</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{padding:"7px 16px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:T.bg0}}>
          <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Showing {Math.min(filtered.length,120)} of {filtered.length} · Buffer: {events.length}/500</span>
          <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{events.filter(e=>e.sev==="CRITICAL").length} CRITICAL · {events.filter(e=>e.sev==="HIGH").length} HIGH unacknowledged</span>
        </div>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// REPORTS VIEW
// ═══════════════════════════════════════════════════════════════════════
const ReportsView = () => {
  const [generating, setGenerating] = useState(null);
  const [progress, setProgress]     = useState({});
  const [done, setDone]             = useState({});

  const REPORTS = [
    { id:"executive",   name:"Executive Security Summary",   icon:"◈", color:T.cyan,   desc:"C-suite risk overview with threat KPIs, compliance posture, and remediation roadmap.", pages:8,  freq:"Weekly" },
    { id:"soc2",        name:"SOC 2 Type II Evidence Pack",  icon:"🔐", color:T.green,  desc:"Audit-ready control evidence, exception log, and auditor commentary for all CC controls.", pages:42, freq:"Quarterly" },
    { id:"pentest",     name:"Penetration Test Report",      icon:"◉", color:T.red,    desc:"Full scope vulnerability findings, CVSS scores, exploitation evidence, and remediation SLAs.", pages:28, freq:"Bi-annual" },
    { id:"cicd",        name:"CI/CD Security Posture",       icon:"⌬", color:T.amber,  desc:"Pipeline hardening analysis, SAST/DAST trends, dependency risks, and secure coding metrics.", pages:14, freq:"Monthly" },
    { id:"threat",      name:"Threat Intelligence Digest",   icon:"⊕", color:T.purple, desc:"IOC feeds, MITRE ATT&CK coverage gaps, emerging threat actors, and hunt recommendations.", pages:12, freq:"Weekly" },
    { id:"cloud",       name:"Cloud Security Assessment",    icon:"⬡", color:T.orange, desc:"AWS infrastructure posture, IAM policy audit, misconfiguration findings, and CIS benchmarks.", pages:20, freq:"Monthly" },
  ];

  const RECENT = [
    { name:"Executive Summary — Apr 2026",   date:"Apr 30, 2026", type:"executive", size:"2.4 MB", status:"ready" },
    { name:"SOC 2 Evidence Pack — Q1 2026",  date:"Apr 1, 2026",  type:"soc2",      size:"18.7 MB",status:"ready" },
    { name:"CI/CD Security — Mar 2026",      date:"Mar 31, 2026", type:"cicd",      size:"4.1 MB", status:"ready" },
    { name:"Threat Digest — Apr 28, 2026",   date:"Apr 28, 2026", type:"threat",    size:"3.2 MB", status:"ready" },
    { name:"Cloud Assessment — Q1 2026",     date:"Mar 15, 2026", type:"cloud",     size:"6.8 MB", status:"ready" },
  ];

  const generate = (id) => {
    if (generating) return;
    setGenerating(id); setProgress({[id]:0}); setDone(d=>({...d,[id]:false}));
    let p = 0;
    const iv = setInterval(() => {
      p += rand(3, 9);
      setProgress(prev => ({...prev, [id]: Math.min(p, 100)}));
      if (p >= 100) { clearInterval(iv); setGenerating(null); setDone(d=>({...d,[id]:true})); }
    }, 150);
  };

  const typeColor = { executive:T.cyan, soc2:T.green, pentest:T.red, cicd:T.amber, threat:T.purple, cloud:T.orange };

  return (
    <div className="fadeIn">
      <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="REPORT TYPES"   value={6}           icon="◧" color={T.cyan} />
        <MetricCard label="GENERATED"      value={23}          icon="✓" color={T.green} />
        <MetricCard label="PENDING REVIEW" value={2}           icon="⏳" color={T.amber} />
        <MetricCard label="STORAGE USED"   value="34.2" unit="MB" icon="⬡" color={T.purple} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:20 }}>
        {REPORTS.map(r => (
          <Card key={r.id} style={{ position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, right:0, width:60, height:60, background:`${r.color}08`, borderRadius:"0 8px 0 100%", pointerEvents:"none" }} />
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:20 }}>{r.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, color:T.textBright, lineHeight:1.3 }}>{r.name}</div>
                <div style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{r.pages} pages · {r.freq}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", lineHeight:1.5, marginBottom:14, minHeight:50 }}>{r.desc}</div>
            {generating===r.id && (
              <div style={{ marginBottom:10 }}>
                <ProgressBar value={progress[r.id]||0} color={r.color} label="Generating..." />
              </div>
            )}
            {done[r.id] && (
              <div style={{ marginBottom:10, padding:"6px 10px", background:`${T.green}14`, border:`1px solid ${T.green}44`, borderRadius:4, fontSize:11, color:T.green, fontFamily:"'JetBrains Mono',monospace" }}>✓ Report ready — click Download</div>
            )}
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>generate(r.id)} disabled={!!generating} style={{ flex:1, padding:"8px 0", background:generating===r.id?T.bg3:`${r.color}18`, border:`1px solid ${r.color}44`, borderRadius:5, color:generating===r.id?T.textDim:r.color, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:generating?"default":"pointer" }}>
                {generating===r.id?"⟳ Building…":"⊕ Generate"}
              </button>
              {done[r.id] && <button style={{ padding:"8px 14px", background:`${T.green}22`, border:`1px solid ${T.green}`, borderRadius:5, color:T.green, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>↓ PDF</button>}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHeader label="Recent Reports" accent={T.gold} />
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:`1px solid ${T.border}` }}>
            {["Report Name","Generated","Type","Size","Status",""].map(h=><th key={h} style={{ padding:"8px 14px", textAlign:"left", fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontWeight:400 }}>{h}</th>)}
          </tr></thead>
          <tbody>{RECENT.map((r,i)=>(
            <tr key={i} style={{ borderBottom:`1px solid ${T.border}22`, background:i%2===0?"transparent":T.bg0+"55" }}>
              <td style={{ padding:"11px 14px", fontFamily:"'Rajdhani',sans-serif", fontSize:13, fontWeight:600, color:T.textBright }}>{r.name}</td>
              <td style={{ padding:"11px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textDim }}>{r.date}</td>
              <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, color:typeColor[r.type], fontFamily:"'JetBrains Mono',monospace", background:typeColor[r.type]+"14", padding:"2px 8px", borderRadius:3 }}>{r.type}</span></td>
              <td style={{ padding:"11px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textDim }}>{r.size}</td>
              <td style={{ padding:"11px 14px" }}><Badge color={T.green}>READY</Badge></td>
              <td style={{ padding:"11px 14px", display:"flex", gap:6 }}>
                <button style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:3, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>↓ PDF</button>
                <button style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:3, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>Share</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// TEAM MANAGEMENT VIEW
// ═══════════════════════════════════════════════════════════════════════
const TeamView = () => {
  const [tab, setTab]         = useState("members");
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole]   = useState("analyst");
  const [invSent, setInvSent]   = useState(false);
  const [search, setSearch]     = useState("");

  const MEMBERS = [
    { id:1, name:"Adebayo Paul Oke",    email:"adebayo@zolextech.com", role:"Owner",         avatar:"A", status:"online", joined:"Jan 2025",  last:"Just now",    mfa:true,  scans:142, pipelines:38 },
    { id:2, name:"Chidera Okonkwo",     email:"chidera@zolextech.com", role:"Admin",          avatar:"C", status:"online", joined:"Feb 2025",  last:"5 min ago",   mfa:true,  scans:87,  pipelines:24 },
    { id:3, name:"Funke Adeyemi",       email:"funke@zolextech.com",   role:"Security Eng",   avatar:"F", status:"away",   joined:"Mar 2025",  last:"2 hours ago", mfa:true,  scans:63,  pipelines:15 },
    { id:4, name:"Emeka Nwachukwu",     email:"emeka@zolextech.com",   role:"DevOps Eng",     avatar:"E", status:"offline",joined:"Apr 2025",  last:"Yesterday",   mfa:false, scans:29,  pipelines:41 },
    { id:5, name:"Amaka Obi",           email:"amaka@zolextech.com",   role:"Analyst",        avatar:"A", status:"online", joined:"May 2025",  last:"1 hour ago",  mfa:true,  scans:44,  pipelines:8  },
    { id:6, name:"Tunde Bakare",        email:"tunde@zolextech.com",   role:"Analyst",        avatar:"T", status:"away",   joined:"Jun 2025",  last:"3 hours ago", mfa:false, scans:31,  pipelines:12 },
    { id:7, name:"Ngozi Eze",           email:"ngozi@zolextech.com",   role:"Viewer",         avatar:"N", status:"offline",joined:"Aug 2025",  last:"3 days ago",  mfa:false, scans:5,   pipelines:0  },
    { id:8, name:"Ayo Olatunji",        email:"ayo@zolextech.com",     role:"Security Eng",   avatar:"A", status:"online", joined:"Sep 2025",  last:"20 min ago",  mfa:true,  scans:78,  pipelines:19 },
  ];

  const ROLES = [
    { id:"owner",    name:"Owner",        color:T.gold,   desc:"Full platform access, billing, team management" },
    { id:"admin",    name:"Admin",        color:T.red,    desc:"All features except billing and ownership transfer" },
    { id:"engineer", name:"Security Eng", color:T.cyan,   desc:"Full security features, no team or billing" },
    { id:"devops",   name:"DevOps Eng",   color:T.amber,  desc:"CI/CD, IaC, and infrastructure features" },
    { id:"analyst",  name:"Analyst",      color:T.purple, desc:"Read-only dashboards, reports, and compliance" },
    { id:"viewer",   name:"Viewer",       color:T.textDim,desc:"Dashboard and report viewing only" },
  ];

  const INVITES = [
    { email:"oluwaseun@zolextech.com", role:"Security Eng", sent:"Apr 28", expires:"May 5", status:"pending" },
    { email:"contractor@external.io",  role:"Viewer",       sent:"Apr 25", expires:"May 2", status:"expired" },
  ];

  const statusColor = { online:T.green, away:T.amber, offline:T.textDim };
  const roleColor   = { Owner:T.gold, Admin:T.red, "Security Eng":T.cyan, "DevOps Eng":T.amber, Analyst:T.purple, Viewer:T.textDim };

  const filtered = MEMBERS.filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.includes(search) || m.role.toLowerCase().includes(search.toLowerCase()));

  const sendInvite = () => {
    if (!invEmail.trim()) return;
    setInvSent(true); setTimeout(() => { setInvSent(false); setInvEmail(""); }, 2500);
  };

  const TABS = ["members","roles","invites","activity"];
  const TL   = { members:"⊞ Members", roles:"◈ Roles", invites:"⊕ Invites", activity:"⟁ Activity" };

  return (
    <div className="fadeIn">
      <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
        <MetricCard label="TOTAL MEMBERS" value={MEMBERS.length} icon="⊞" color={T.cyan} />
        <MetricCard label="ONLINE NOW"    value={MEMBERS.filter(m=>m.status==="online").length} icon="●" color={T.green} />
        <MetricCard label="MFA ENABLED"   value={`${MEMBERS.filter(m=>m.mfa).length}/${MEMBERS.length}`} icon="🔐" color={T.amber} />
        <MetricCard label="SEATS USED"    value={`${MEMBERS.length}/25`} icon="◎" color={T.purple} />
      </div>

      <div style={{ display:"flex", marginBottom:18, borderBottom:`1px solid ${T.border}` }}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{ padding:"9px 20px", background:"transparent", borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent", border:"none", cursor:"pointer", color:tab===t?T.cyan:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>{TL[t]}</button>)}
      </div>

      {/* MEMBERS */}
      {tab==="members" && (
        <Card>
          <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
            <SectionHeader label="Team Members" />
            <div style={{ marginLeft:"auto", display:"flex", gap:10 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search members…"
                style={{ padding:"7px 12px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:5, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:12, outline:"none", width:200 }}
                onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border} />
              <button onClick={()=>setTab("invites")} style={{ padding:"7px 16px", background:`${T.cyan}18`, border:`1px solid ${T.cyan}44`, borderRadius:5, color:T.cyan, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Invite</button>
            </div>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ borderBottom:`1px solid ${T.border}` }}>
              {["Member","Role","Status","MFA","Scans","Pipelines","Joined","Last Active",""].map(h=><th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", fontWeight:400 }}>{h}</th>)}
            </tr></thead>
            <tbody>{filtered.map(m=>(
              <tr key={m.id} style={{ borderBottom:`1px solid ${T.border}22` }}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"10px 12px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ position:"relative" }}>
                      <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${T.cyan},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#000", flexShrink:0 }}>{m.avatar}</div>
                      <div style={{ position:"absolute", bottom:0, right:0, width:9, height:9, borderRadius:"50%", background:statusColor[m.status], border:`2px solid ${T.bg1}` }} />
                    </div>
                    <div>
                      <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13, color:T.textBright }}>{m.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.textDim }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:"10px 12px" }}><Badge color={roleColor[m.role]||T.textDim}>{m.role}</Badge></td>
                <td style={{ padding:"10px 12px" }}><div style={{ display:"flex", alignItems:"center", gap:5 }}><StatusDot status={m.status==="online"?"ok":m.status==="away"?"warn":"info"}/><span style={{ fontSize:11, color:statusColor[m.status], fontFamily:"'JetBrains Mono',monospace" }}>{m.status}</span></div></td>
                <td style={{ padding:"10px 12px", textAlign:"center" }}><span style={{ fontSize:14 }}>{m.mfa?"🔐":"⚠️"}</span></td>
                <td style={{ padding:"10px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.cyan }}>{m.scans}</td>
                <td style={{ padding:"10px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.amber }}>{m.pipelines}</td>
                <td style={{ padding:"10px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textDim }}>{m.joined}</td>
                <td style={{ padding:"10px 12px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textDim }}>{m.last}</td>
                <td style={{ padding:"10px 12px" }}>
                  {m.role!=="Owner" && <button style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:3, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>Edit</button>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* ROLES */}
      {tab==="roles" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>
          {ROLES.map(r=>(
            <Card key={r.id}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:r.color }} />
                <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:16, color:T.textBright }}>{r.name}</div>
                <span style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.textDim }}>{MEMBERS.filter(m=>m.role===r.name).length} users</span>
              </div>
              <div style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", marginBottom:14 }}>{r.desc}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {( r.id==="owner"?["All permissions","Billing","Team mgmt","Transfer ownership"]: r.id==="admin"?["All features","Team mgmt","Audit logs","No billing"]: r.id==="engineer"?["Scanning","Pipelines","IaC","Compliance"]: r.id==="devops"?["CI/CD","IaC","Deployments","Infra"]: r.id==="analyst"?["View dashboards","Reports","Read-only"]: ["View dashboards","Read-only"] ).map(p=>(
                  <div key={p} style={{ padding:"3px 8px", background:`${r.color}14`, border:`1px solid ${r.color}33`, borderRadius:3, fontSize:10, color:r.color, fontFamily:"'JetBrains Mono',monospace" }}>{p}</div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* INVITES */}
      {tab==="invites" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Card>
            <SectionHeader label="Send Invitation" accent={T.cyan} />
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:6 }}>EMAIL ADDRESS</div>
              <input value={invEmail} onChange={e=>setInvEmail(e.target.value)} placeholder="colleague@company.com"
                style={{ width:"100%", padding:"10px 12px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textBright, fontFamily:"'JetBrains Mono',monospace", fontSize:13, outline:"none" }}
                onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border} />
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:6 }}>ASSIGN ROLE</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {ROLES.filter(r=>r.id!=="owner").map(r=>(
                  <label key={r.id} onClick={()=>setInvRole(r.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", background:invRole===r.id?`${r.color}14`:T.bg2, border:`1px solid ${invRole===r.id?r.color:T.border}`, borderRadius:5, cursor:"pointer", transition:"all .15s" }}>
                    <div style={{ width:10, height:10, borderRadius:"50%", border:`2px solid ${r.color}`, background:invRole===r.id?r.color:"transparent", flexShrink:0 }} />
                    <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:12, color:invRole===r.id?r.color:T.textDim }}>{r.name}</span>
                  </label>
                ))}
              </div>
            </div>
            {invSent ? (
              <div style={{ padding:"12px 14px", background:`${T.green}14`, border:`1px solid ${T.green}44`, borderRadius:6, textAlign:"center", color:T.green, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14 }}>✓ Invitation sent to {invEmail}</div>
            ) : (
              <Btn onClick={sendInvite} color={T.cyan} disabled={!invEmail.trim()}>Send Invitation →</Btn>
            )}
          </Card>
          <Card>
            <SectionHeader label="Pending Invitations" accent={T.amber} />
            {INVITES.map((inv,i)=>(
              <div key={i} style={{ padding:"12px 14px", background:T.bg2, borderRadius:6, border:`1px solid ${inv.status==="expired"?T.red:T.amber}44`, marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:T.textBright }}>{inv.email}</div>
                    <Badge color={roleColor[ROLES.find(r=>r.id===inv.role.toLowerCase().replace(/ /g,""))?.id]||T.textDim}>{inv.role}</Badge>
                  </div>
                  <Badge color={inv.status==="pending"?T.amber:T.red}>{inv.status.toUpperCase()}</Badge>
                </div>
                <div style={{ display:"flex", gap:14, fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>
                  <span>Sent: {inv.sent}</span><span>Expires: {inv.expires}</span>
                </div>
                {inv.status==="pending" && (
                  <div style={{ display:"flex", gap:6, marginTop:8 }}>
                    <button style={{ flex:1, padding:"5px 0", background:"transparent", border:`1px solid ${T.amber}44`, borderRadius:4, color:T.amber, fontFamily:"'JetBrains Mono',monospace", fontSize:10, cursor:"pointer" }}>Resend</button>
                    <button style={{ flex:1, padding:"5px 0", background:"transparent", border:`1px solid ${T.red}44`, borderRadius:4, color:T.red, fontFamily:"'JetBrains Mono',monospace", fontSize:10, cursor:"pointer" }}>Revoke</button>
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop:8, padding:"10px 14px", background:T.bg2, borderRadius:6, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginBottom:4 }}>INVITE LINK</div>
              <div style={{ display:"flex", gap:8 }}>
                <div style={{ flex:1, padding:"7px 10px", background:T.bg0, borderRadius:4, fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:T.textDim, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>https://app.secureops.io/invite/zt_8fx2k9...</div>
                <button style={{ padding:"7px 12px", background:`${T.cyan}18`, border:`1px solid ${T.cyan}44`, borderRadius:4, color:T.cyan, fontFamily:"'JetBrains Mono',monospace", fontSize:10, cursor:"pointer", whiteSpace:"nowrap" }}>Copy</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ACTIVITY */}
      {tab==="activity" && (
        <Card>
          <SectionHeader label="Team Audit Log" accent={T.cyan} />
          {[
            {user:"Adebayo Paul Oke",action:"Updated IAM policy",target:"zolextech-app-role",time:"2m ago",sev:"warn"},
            {user:"Chidera Okonkwo",  action:"Triggered pipeline",  target:"zolextech/backend:main", time:"14m ago",sev:"info"},
            {user:"Funke Adeyemi",   action:"Exported report",     target:"SOC2 Evidence Pack Q1",  time:"1h ago",sev:"info"},
            {user:"Emeka Nwachukwu", action:"Deployed to prod",    target:"zolextech/infra:v2.4.1", time:"2h ago",sev:"warn"},
            {user:"Amaka Obi",       action:"Ran SAST scan",       target:"zolextech/frontend",     time:"3h ago",sev:"info"},
            {user:"Adebayo Paul Oke",action:"Added team member",   target:"ngozi@zolextech.com",    time:"5h ago",sev:"info"},
            {user:"Tunde Bakare",    action:"API key created",     target:"Terraform CLI key",      time:"1d ago",sev:"warn"},
            {user:"Ayo Olatunji",    action:"Compliance scan",     target:"ISO 27001 check",        time:"1d ago",sev:"info"},
          ].map((ev,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 12px", background:i%2===0?"transparent":T.bg2+"66", borderRadius:4, marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${T.cyan},${T.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#000", flexShrink:0 }}>{ev.user[0]}</div>
              <div style={{ flex:1 }}>
                <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13, color:T.textBright }}>{ev.user}</span>
                <span style={{ fontSize:13, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}> {ev.action} </span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:T.cyan }}>{ev.target}</span>
              </div>
              <Badge color={ev.sev==="warn"?T.amber:T.cyan}>{ev.sev.toUpperCase()}</Badge>
              <span style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", whiteSpace:"nowrap" }}>{ev.time}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// DOCKER / SERVICES VIEW
// ═══════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════
// SERVICES & CONTAINERS VIEW  (DockerView)
// ═══════════════════════════════════════════════════════════════════════
const DockerView = () => {
  const [tab, setTab]           = useState("services");
  const [selSvc, setSelSvc]     = useState(null);
  const [logSvc, setLogSvc]     = useState(null);
  const [logLines, setLogLines] = useState([]);
  const [logRunning, setLogRunning] = useState(false);
  const [actionState, setActionState] = useState({});   // {svcName: "restarting"|"starting"|"stopping"|"done"}
  const [globalAction, setGlobalAction] = useState(null); // "starting"|"restarting"|"stopping"
  const logRef  = useRef();
  const logIvRef = useRef(null);

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; },[logLines]);
  // Cleanup log interval on unmount
  useEffect(()=>()=>{ if(logIvRef.current) clearInterval(logIvRef.current); },[]);

  // Live service metrics state
  const [metrics, setMetrics] = useState({
    api:       {cpu:12, mem:284},
    frontend:  {cpu:3,  mem:112},
    nginx:     {cpu:1,  mem:18 },
    postgres:  {cpu:8,  mem:512},
    redis:     {cpu:2,  mem:96 },
    worker:    {cpu:22, mem:340},
    celery:    {cpu:18, mem:290},
    grafana:   {cpu:4,  mem:198},
    prometheus:{cpu:3,  mem:156},
    loki:      {cpu:0,  mem:0  },
  });

  useInterval(()=>{
    setMetrics(m=>({
      ...m,
      api:        {cpu:Math.max(1,  m.api.cpu       + rand(-3,4)),  mem:Math.max(200, m.api.mem       + rand(-8,10))},
      worker:     {cpu:Math.max(1,  m.worker.cpu    + rand(-5,7)),  mem:Math.max(200, m.worker.mem    + rand(-5,8)) },
      celery:     {cpu:Math.max(1,  m.celery.cpu    + rand(-4,6)),  mem:Math.max(180, m.celery.mem    + rand(-4,7)) },
      postgres:   {cpu:Math.max(1,  m.postgres.cpu  + rand(-2,3)),  mem:Math.max(400, m.postgres.mem  + rand(-4,6)) },
      redis:      {cpu:Math.max(1,  m.redis.cpu     + rand(-1,2)),  mem:Math.max(80,  m.redis.mem     + rand(-3,4)) },
      prometheus: {cpu:Math.max(1,  m.prometheus.cpu+ rand(-1,2)),  mem:Math.max(120, m.prometheus.mem+ rand(-3,4)) },
    }));
  }, 2000);

  const SERVICES_BASE = [
    { name:"api",        image:"zolextech/secureops-api:2.4.1",    status:"running", health:"healthy",  ports:"8080→8080",  replicas:"3/3", uptime:"14d 6h",  color:T.cyan,    network:"frontend+backend", envFile:".env",      restart:"unless-stopped" },
    { name:"frontend",   image:"zolextech/secureops-ui:2.4.1",     status:"running", health:"healthy",  ports:"3000(int)",  replicas:"2/2", uptime:"14d 6h",  color:T.cyan,    network:"frontend",         envFile:".env",      restart:"unless-stopped" },
    { name:"nginx",      image:"nginx:1.25.4-alpine",               status:"running", health:"healthy",  ports:"80,443",     replicas:"1/1", uptime:"14d 6h",  color:T.green,   network:"frontend",         envFile:"—",         restart:"unless-stopped" },
    { name:"postgres",   image:"postgres:15.5-alpine",              status:"running", health:"healthy",  ports:"5432(int)",  replicas:"1/1", uptime:"30d 2h",  color:T.purple,  network:"backend",          envFile:".env",      restart:"unless-stopped" },
    { name:"redis",      image:"redis:7.2.4-alpine",                status:"running", health:"degraded", ports:"6379(int)",  replicas:"1/2", uptime:"2d 3h",   color:T.amber,   network:"backend",          envFile:".env",      restart:"unless-stopped" },
    { name:"worker",     image:"zolextech/secureops-worker:2.4.1",  status:"running", health:"healthy",  ports:"—",          replicas:"2/2", uptime:"14d 6h",  color:T.cyan,    network:"backend",          envFile:".env",      restart:"unless-stopped" },
    { name:"celery",     image:"zolextech/secureops-worker:2.4.1",  status:"running", health:"healthy",  ports:"—",          replicas:"2/2", uptime:"14d 6h",  color:T.cyan,    network:"backend",          envFile:".env",      restart:"unless-stopped" },
    { name:"grafana",    image:"grafana/grafana:11.1.0",             status:"running", health:"healthy",  ports:"3001→3000",  replicas:"1/1", uptime:"7d 12h",  color:T.orange,  network:"backend",          envFile:".env",      restart:"unless-stopped" },
    { name:"prometheus", image:"prom/prometheus:v2.51.2",           status:"running", health:"healthy",  ports:"9090(int)",  replicas:"1/1", uptime:"7d 12h",  color:T.red,     network:"backend",          envFile:"—",         restart:"unless-stopped" },
    { name:"loki",       image:"grafana/loki:2.9.7",                status:"stopped", health:"—",        ports:"3100(int)",  replicas:"0/1", uptime:"—",       color:T.textDim, network:"backend",          envFile:"—",         restart:"unless-stopped" },
  ];

  const COMPOSE = `# docker-compose.yml — ZolexTech SecureOps Platform v2.4
# Managed by ZolexTech & Consultant | Adebayo Paul Oke

version: "3.9"

x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

x-api-env: &api-env
  DATABASE_URL: postgresql+asyncpg://zt_admin:\${DB_PASSWORD}@postgres:5432/secureops
  REDIS_URL: redis://:\${REDIS_PASSWORD}@redis:6379/0
  JWT_SECRET: \${JWT_SECRET}
  JWT_ALGORITHM: HS256
  ANTHROPIC_API_KEY: \${ANTHROPIC_API_KEY}

networks:
  frontend_net:
    driver: bridge
  backend_net:
    driver: bridge
    internal: true

volumes:
  postgres_data:
  redis_data:
  grafana_data:
  prometheus_data:

services:

  # ── Reverse Proxy ───────────────────────────────────────────
  nginx:
    image: nginx:1.25.4-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on: [api, frontend]
    networks: [frontend_net]
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    logging: *default-logging

  # ── React Frontend ──────────────────────────────────────────
  frontend:
    image: zolextech/secureops-ui:2.4.1
    restart: unless-stopped
    environment:
      NODE_ENV: production
      VITE_API_URL: https://api.zolextech.com
      VITE_WS_URL: wss://ws.zolextech.com
    expose: ["3000"]
    networks: [frontend_net]
    depends_on: [api]
    logging: *default-logging

  # ── FastAPI Backend ─────────────────────────────────────────
  api:
    image: zolextech/secureops-api:2.4.1
    restart: unless-stopped
    environment:
      <<: *api-env
      ENVIRONMENT: production
      STRIPE_SECRET_KEY: \${STRIPE_SECRET_KEY}
    expose: ["8080"]
    networks: [frontend_net, backend_net]
    depends_on:
      postgres: { condition: service_healthy }
      redis:    { condition: service_healthy }
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 30s
    deploy:
      replicas: 3
      resources:
        limits: { cpus: "0.5", memory: 512M }
    logging: *default-logging

  # ── Celery Worker ───────────────────────────────────────────
  worker:
    image: zolextech/secureops-worker:2.4.1
    restart: unless-stopped
    command: celery -A app.tasks worker --loglevel=info --concurrency=4
    environment:
      <<: *api-env
      CELERY_BROKER_URL: redis://:\${REDIS_PASSWORD}@redis:6379/1
    networks: [backend_net]
    depends_on: [redis, postgres]
    deploy:
      replicas: 2
    logging: *default-logging

  # ── PostgreSQL ──────────────────────────────────────────────
  postgres:
    image: postgres:15.5-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: secureops
      POSTGRES_USER: zt_admin
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    expose: ["5432"]
    networks: [backend_net]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U zt_admin -d secureops"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging: *default-logging

  # ── Redis ───────────────────────────────────────────────────
  redis:
    image: redis:7.2.4-alpine
    restart: unless-stopped
    command: >
      redis-server
      --requirepass \${REDIS_PASSWORD}
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
      --appendonly yes
      --save 900 1
    volumes:
      - redis_data:/data
    expose: ["6379"]
    networks: [backend_net]
    healthcheck:
      test: ["CMD", "redis-cli", "--no-auth-warning", "-a", "\${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    logging: *default-logging

  # ── Grafana ─────────────────────────────────────────────────
  grafana:
    image: grafana/grafana:11.1.0
    restart: unless-stopped
    environment:
      GF_SECURITY_ADMIN_PASSWORD: \${GRAFANA_PASSWORD}
      GF_SERVER_ROOT_URL: https://metrics.zolextech.com
      GF_INSTALL_PLUGINS: grafana-clock-panel
      GF_AUTH_DISABLE_LOGIN_FORM: "false"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
    ports: ["3001:3000"]
    networks: [backend_net]
    logging: *default-logging

  # ── Prometheus ──────────────────────────────────────────────
  prometheus:
    image: prom/prometheus:v2.51.2
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    expose: ["9090"]
    networks: [backend_net]
    logging: *default-logging

  # ── Loki (Log Aggregation) — currently stopped ──────────────
  loki:
    image: grafana/loki:2.9.7
    restart: unless-stopped
    command: -config.file=/etc/loki/local-config.yaml
    expose: ["3100"]
    networks: [backend_net]
    profiles: ["logging"]
    logging: *default-logging`;

  const NGINX_CONF = `# nginx/nginx.conf — ZolexTech Production
# CIS Nginx Benchmark v1.0 hardened

user  nginx;
worker_processes  auto;
worker_rlimit_nofile 65535;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections 4096;
    multi_accept on;
    use epoll;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Security: hide server version
    server_tokens off;

    # Security headers (applied to all vhosts)
    add_header X-Frame-Options          "SAMEORIGIN"               always;
    add_header X-Content-Type-Options   "nosniff"                  always;
    add_header X-XSS-Protection         "1; mode=block"            always;
    add_header Referrer-Policy          "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy       "geolocation=(), camera=()" always;
    add_header Strict-Transport-Security
        "max-age=63072000; includeSubDomains; preload"              always;

    # TLS — only 1.2/1.3
    ssl_protocols        TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:!aNULL:!eNULL;
    ssl_session_cache    shared:SSL:10m;
    ssl_session_timeout  10m;
    ssl_session_tickets  off;
    ssl_stapling         on;
    ssl_stapling_verify  on;

    # Rate limiting zones
    limit_req_zone  $binary_remote_addr  zone=api:10m    rate=30r/m;
    limit_req_zone  $binary_remote_addr  zone=login:10m  rate=5r/m;
    limit_conn_zone $binary_remote_addr  zone=perip:10m;

    # Logging
    log_format main
        '$remote_addr [$time_local] "$request" $status '
        '$body_bytes_sent "$http_referer" rt=$request_time';
    access_log  /var/log/nginx/access.log  main;

    # Performance
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout 65;
    client_max_body_size 16M;
    gzip            on;
    gzip_vary       on;
    gzip_proxied    any;
    gzip_types      text/plain application/json application/javascript text/css image/svg+xml;

    # Block bad user-agents
    if ($http_user_agent ~* (sqlmap|nikto|nmap|masscan|zgrab)) {
        return 444;
    }

    include /etc/nginx/conf.d/*.conf;
}`;

  // Log templates per service — level properly distinguished
  const LOG_TEMPLATES = {
    api: [
      { text:`INFO     uvicorn.access: 10.0.1.12:51204 - "GET /api/v1/health HTTP/1.1" 200 OK`, level:"info" },
      { text:`INFO     app.auth: JWT issued — adebayo@zolextech.com (exp: 1440min, roles: owner)`, level:"info" },
      { text:`INFO     app.scan: SAST scan triggered — repo zolextech/backend, commit a3f9c1d`, level:"info" },
      { text:`WARNING  app.ratelimit: Rate limit exceeded — 185.220.101.8 (31/min, zone=api)`, level:"warn" },
      { text:`INFO     app.pipeline: Pipeline pl-001 triggered — branch main`, level:"info" },
      { text:`INFO     app.auth: MFA verified — adebayo@zolextech.com (TOTP)`, level:"info" },
      { text:`ERROR    app.db: Connection pool exhausted (10/10) — retrying in 2s`, level:"error" },
      { text:`INFO     app.db: Connection pool restored (10/10 available)`, level:"info" },
      { text:`INFO     app.compliance: SOC2 scan complete — 94% coverage, 1 warning`, level:"info" },
      { text:`WARNING  app.security: Suspicious IP blocked — 45.142.212.100 (WAF rule #1089)`, level:"warn" },
      { text:`INFO     app.scan: Container scan complete — 0 critical, 2 high CVEs`, level:"info" },
      { text:`ERROR    app.auth: JWT validation failed — expired token reuse attempt from 10.0.2.45`, level:"error" },
    ],
    nginx: [
      { text:`10.0.1.12     - "GET /api/v1/health HTTP/2.0" 200 48 rt=0.002`, level:"info" },
      { text:`185.220.101.8 - "POST /api/v1/auth/login HTTP/2.0" 429 0 rt=0.000`, level:"warn" },
      { text:`10.0.1.22     - "GET /dashboard HTTP/2.0" 200 24813 rt=0.018`, level:"info" },
      { text:`10.0.2.45     - "POST /api/v1/scan HTTP/2.0" 202 128 rt=0.044`, level:"info" },
      { text:`45.142.212.100- "GET /../etc/passwd HTTP/1.1" 400 0 rt=0.000`, level:"warn" },
      { text:`10.0.1.10     - "GET /api/v1/reports HTTP/2.0" 200 4096 rt=0.021`, level:"info" },
      { text:`ERROR    nginx: upstream timed out (110) connecting to api:8080`, level:"error" },
      { text:`10.0.1.12     - "GET /metrics HTTP/2.0" 403 0 rt=0.000`, level:"warn" },
      { text:`10.0.1.22     - "POST /api/v1/incidents HTTP/2.0" 201 512 rt=0.088`, level:"info" },
    ],
    postgres: [
      { text:`LOG:  database system is ready to accept connections`, level:"info" },
      { text:`LOG:  connection received: host=10.0.1.5 user=zt_admin db=secureops`, level:"info" },
      { text:`LOG:  duration: 1842.231 ms  statement: SELECT * FROM pipeline_runs ORDER BY created_at DESC LIMIT 100`, level:"warn" },
      { text:`LOG:  checkpoint starting: time`, level:"info" },
      { text:`LOG:  checkpoint complete: wrote 124 buffers (0.8%); 0 WAL file(s) added`, level:"info" },
      { text:`LOG:  autovacuum: found 1042 removable, 8801 nonremovable row versions in table "secureops.public.events"`, level:"info" },
      { text:`ERROR: deadlock detected — process 1847 waits for ShareLock on transaction 31092`, level:"error" },
      { text:`LOG:  connection authorized: user=zt_admin database=secureops SSL enabled`, level:"info" },
      { text:`WARNING:  out of shared memory — consider increasing max_locks_per_transaction`, level:"warn" },
    ],
    redis: [
      { text:`* Ready to accept connections on port 6379`, level:"info" },
      { text:`* Background saving started by pid 32`, level:"info" },
      { text:`# WARNING: Memory usage above 80% threshold (205MB / 256MB)`, level:"warn" },
      { text:`* Background saving terminated with success`, level:"info" },
      { text:`* 1 changes in 900 seconds. Saving...`, level:"info" },
      { text:`# WARNING: Replica #2 disconnected — cluster degraded (1/2 nodes)`, level:"warn" },
      { text:`# ERROR: MISCONF Redis is configured to save RDB snapshots, but is currently not able to persist on disk`, level:"error" },
      { text:`* MASTER <-> REPLICA sync started`, level:"info" },
      { text:`* Replica 10.0.2.21:6379 asks for synchronization`, level:"info" },
    ],
    worker: [
      { text:`[2026-05-03 09:42:11] [INFO] celery@worker-1 ready.`, level:"info" },
      { text:`[2026-05-03 09:42:12] [INFO] Task app.tasks.run_sast_scan[a3f9c1d] received`, level:"info" },
      { text:`[2026-05-03 09:42:18] [INFO] Task app.tasks.run_sast_scan[a3f9c1d] succeeded in 6.2s`, level:"info" },
      { text:`[2026-05-03 09:42:22] [WARNING] Task app.tasks.sync_compliance received late delivery (SLA breach)`, level:"warn" },
      { text:`[2026-05-03 09:42:25] [ERROR] Task app.tasks.send_alert[b7e2d1a] raised exception: ConnectionRefusedError`, level:"error" },
      { text:`[2026-05-03 09:42:30] [INFO] Task app.tasks.send_alert[b7e2d1a] retrying in 30s (attempt 2/3)`, level:"info" },
      { text:`[2026-05-03 09:42:44] [INFO] Task app.tasks.generate_report[c9f3a2b] received`, level:"info" },
    ],
    grafana: [
      { text:`INFO  logger=settings Starting Grafana v11.1.0`, level:"info" },
      { text:`INFO  logger=plugin.manager Loading plugins...`, level:"info" },
      { text:`INFO  logger=server.flow Listening on port 3000`, level:"info" },
      { text:`INFO  logger=sqlstore.transactions[postgres] migrated 0 tables`, level:"info" },
      { text:`WARN  logger=live.push.http Broadcast to channel: grafana/dashboard/uid/secops — no active subscribers`, level:"warn" },
      { text:`INFO  logger=provisioning.dashboard starting to provision`, level:"info" },
      { text:`ERROR logger=datasources Could not find datasource with uid "prometheus-prod"`, level:"error" },
    ],
    prometheus: [
      { text:`level=info ts=2026-05-03T09:42:11Z msg="Starting Prometheus" version="2.51.2"`, level:"info" },
      { text:`level=info ts=2026-05-03T09:42:11Z msg="Loading configuration file" filename=/etc/prometheus/prometheus.yml`, level:"info" },
      { text:`level=info ts=2026-05-03T09:42:12Z msg="Completed loading of configuration file"`, level:"info" },
      { text:`level=info ts=2026-05-03T09:42:15Z msg="Server is ready to receive web requests."`, level:"info" },
      { text:`level=warn ts=2026-05-03T09:42:44Z msg="Error scraping target" target="http://loki:3100/metrics" err="connection refused"`, level:"warn" },
      { text:`level=info ts=2026-05-03T09:43:11Z msg="TSDB GC done" duration=22.4ms`, level:"info" },
      { text:`level=warn ts=2026-05-03T09:44:01Z msg="WAL segment too large, truncating"`, level:"warn" },
    ],
    loki: [
      { text:`level=info msg="Loki started"`, level:"info" },
      { text:`ERROR  msg="failed to start" err="listen tcp :3100: bind: address already in use"`, level:"error" },
      { text:`level=warn msg="Service is stopped — start with: docker compose --profile logging up loki"`, level:"warn" },
    ],
  };

  const doAction = (svcName, action) => {
    setActionState(a=>({...a,[svcName]:action}));
    setTimeout(()=>setActionState(a=>({...a,[svcName]:"done"})), 2200);
    setTimeout(()=>setActionState(a=>{const n={...a};delete n[svcName];return n;}), 4000);
  };

  const doGlobal = (action) => {
    setGlobalAction(action);
    setTimeout(()=>setGlobalAction(null), 3000);
  };

  const streamLogs = (svc) => {
    // Clear any running stream
    if (logIvRef.current) { clearInterval(logIvRef.current); logIvRef.current=null; }
    setLogSvc(svc);
    setLogLines([]);
    setLogRunning(true);
    const src = LOG_TEMPLATES[svc] || LOG_TEMPLATES.api;
    let i = 0;
    logIvRef.current = setInterval(()=>{
      const entry = src[i % src.length];
      setLogLines(p=>[...p, {
        ts:   new Date().toISOString().slice(11,23),
        text: entry.text,
        level: entry.level,     // ← correct: pre-classified, no guessing
      }]);
      i++;
      if(i >= 60) { clearInterval(logIvRef.current); logIvRef.current=null; setLogRunning(false); }
    }, 200);
  };

  const stopLogs = () => {
    if(logIvRef.current) { clearInterval(logIvRef.current); logIvRef.current=null; }
    setLogRunning(false);
  };

  const hColor  = { healthy:T.green, degraded:T.amber, "—":T.textDim };
  const sColor  = { running:T.green, stopped:T.red };
  const lvlC    = { error:T.red, warn:T.amber, info:T.textDim };
  const lvlTC   = { error:T.red, warn:T.amber, info:T.text };

  const TABS    = ["services","compose","nginx","logs"];
  const TL      = { services:"🐳 Services", compose:"📄 docker-compose.yml", nginx:"⚙ NGINX Config", logs:"📋 Log Viewer" };

  // Syntax highlighter for YAML/NGINX config
  const hlYaml = (code) => code.split("\n").map((line,i)=>{
    let segs;
    if (line.trim().startsWith("#")) {
      segs = [{t:line, c:T.textDim, it:true}];
    } else {
      const keyMatch = line.match(/^(\s*)([\w.-]+)(\s*:)(.*)$/);
      if (keyMatch) {
        const [,indent,key,colon,rest] = keyMatch;
        const valColor = rest.trim().startsWith("*") ? T.purple
          : rest.includes("${") ? T.amber
          : rest.trim().startsWith('"') || rest.trim().startsWith("'") ? T.green
          : rest.trim() === "true" || rest.trim() === "false" ? T.amber
          : /^\s+\d+$/.test(rest) ? T.amber
          : T.text;
        segs = [
          {t:indent, c:T.text},
          {t:key,    c:T.cyan},
          {t:colon,  c:T.textDim},
          {t:rest,   c:valColor},
        ];
      } else if (line.trim().startsWith("- ")) {
        const val = line.trim().slice(2);
        segs = [
          {t:line.slice(0,line.indexOf("-")+2), c:T.textDim},
          {t:val, c:val.startsWith('"') || val.startsWith("'") ? T.green : T.text},
        ];
      } else {
        segs = [{t:line, c:T.green}];
      }
    }
    return (
      <div key={i} style={{display:"flex",minHeight:17}}>
        <span style={{color:T.bg3,fontFamily:"'JetBrains Mono',monospace",fontSize:10,minWidth:32,textAlign:"right",userSelect:"none",paddingRight:10,borderRight:`1px solid ${T.border}22`,marginRight:12}}>{i+1}</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,whiteSpace:"pre",flex:1}}>
          {segs.map((s,si)=><span key={si} style={{color:s.c,fontStyle:s.it?"italic":"normal"}}>{s.t}</span>)}
        </span>
      </div>
    );
  });

  const totalCpu = Object.values(metrics).reduce((a,m)=>a+m.cpu,0);
  const selDetail = selSvc ? SERVICES_BASE.find(s=>s.name===selSvc) : null;

  return (
    <div className="fadeIn">
      {/* KPI row */}
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="SERVICES"   value={SERVICES_BASE.length}                                         icon="🐳" color={T.cyan}/>
        <MetricCard label="RUNNING"    value={SERVICES_BASE.filter(s=>s.status==="running").length}         icon="●"  color={T.green}/>
        <MetricCard label="STOPPED"    value={SERVICES_BASE.filter(s=>s.status==="stopped").length}         icon="⏹"  color={T.red}/>
        <MetricCard label="DEGRADED"   value={SERVICES_BASE.filter(s=>s.health==="degraded").length}        icon="⚠"  color={T.amber} delta={1}/>
        <MetricCard label="TOTAL CPU"  value={totalCpu} unit="%" icon="⚙" color={totalCpu>80?T.red:T.orange}/>
        <MetricCard label="STACK"      value="v3.0.0"   icon="⌬" color={T.textDim}/>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
            {t==="logs" && logRunning && <span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 1s infinite",marginLeft:6,verticalAlign:"middle"}}/>}
          </button>
        ))}
      </div>

      {/* SERVICES */}
      {tab==="services" && (
        <div>
          {/* Redis degraded alert */}
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",background:`${T.amber}08`,border:`1px solid ${T.amber}33`,borderRadius:8,marginBottom:14}}>
            <span style={{fontSize:20}}>⚠️</span>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.amber,marginBottom:2}}>
                Redis cluster degraded — 1 of 2 replicas running
              </div>
              <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>
                Secondary replica offline since 2d 3h. Cache hit ratio dropped to 61%. Celery job queue may be affected.
              </div>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={()=>doAction("redis","restarting")} style={{padding:"7px 14px",background:`${T.amber}18`,border:`1px solid ${T.amber}`,borderRadius:5,color:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                {actionState.redis==="restarting"?"⟳ Restarting…":actionState.redis==="done"?"✓ Restarted":"↺ Restart Redis"}
              </button>
              <button style={{padding:"7px 12px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontSize:12,cursor:"pointer"}}>Dismiss</button>
            </div>
          </div>

          <Card style={{padding:0,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 18px",borderBottom:`1px solid ${T.border}`}}>
              <SectionHeader label="Container Services"/>
              <div style={{display:"flex",gap:8}}>
                {[["▶ Start All","starting",T.green],["↺ Restart All","restarting",T.amber],["⏹ Stop All","stopping",T.red]].map(([label,action,color])=>(
                  <button key={action} onClick={()=>doGlobal(action)} style={{padding:"6px 14px",background:`${color}14`,border:`1px solid ${color}44`,borderRadius:5,color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                    {globalAction===action?`⟳ ${action.replace("ing","ing…")}`:label}
                  </button>
                ))}
              </div>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead style={{position:"sticky",top:0,background:T.bg1,zIndex:2}}>
                <tr style={{borderBottom:`1px solid ${T.border}`}}>
                  {["","Service","Image","Status","Health","CPU","Memory","Ports","Replicas","Uptime",""].map(h=>(
                    <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICES_BASE.map(svc=>{
                  const m = metrics[svc.name] || {cpu:0,mem:0};
                  const isSel = selSvc===svc.name;
                  const aState = actionState[svc.name];
                  return (
                    <tr key={svc.name}
                      onClick={()=>setSelSvc(isSel?null:svc.name)}
                      style={{borderBottom:`1px solid ${T.border}11`,cursor:"pointer",background:isSel?`${T.cyan}07`:svc.status==="stopped"?`${T.red}05`:"transparent",transition:"background .1s"}}
                      onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background=T.bg2; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background=isSel?`${T.cyan}07`:svc.status==="stopped"?`${T.red}05`:"transparent"; }}>
                      <td style={{padding:"10px 12px"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:svc.status==="running"?(svc.health==="degraded"?T.amber:T.green):T.red,animation:svc.status==="running"?"pulse 2s infinite":"none"}}/>
                      </td>
                      <td style={{padding:"10px 12px"}}>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:svc.color,fontWeight:700}}>{svc.name}</div>
                        {aState && <div style={{fontSize:9,color:aState==="done"?T.green:T.amber,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{aState==="done"?"✓ done":"⟳ "+aState}</div>}
                      </td>
                      <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{svc.image}</td>
                      <td style={{padding:"10px 12px"}}><Badge color={sColor[svc.status]||T.textDim}>{svc.status.toUpperCase()}</Badge></td>
                      <td style={{padding:"10px 12px"}}><span style={{fontSize:11,color:hColor[svc.health],fontFamily:"'JetBrains Mono',monospace",fontWeight:svc.health==="degraded"?700:400}}>{svc.health}</span></td>
                      <td style={{padding:"10px 12px"}}>
                        {svc.status==="running"?(
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <div style={{width:48,height:4,background:T.bg3,borderRadius:2}}>
                              <div style={{width:`${Math.min(m.cpu,100)}%`,height:"100%",background:m.cpu>70?T.red:m.cpu>40?T.amber:T.green,borderRadius:2,transition:"width .5s"}}/>
                            </div>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:m.cpu>70?T.red:m.cpu>40?T.amber:T.text,minWidth:32}}>{m.cpu}%</span>
                          </div>
                        ):<span style={{color:T.textDim,fontSize:11}}>—</span>}
                      </td>
                      <td style={{padding:"10px 12px"}}>
                        {svc.status==="running"?(
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:m.mem>400?T.amber:T.text}}>{m.mem} MB</span>
                        ):<span style={{color:T.textDim,fontSize:11}}>—</span>}
                      </td>
                      <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan}}>{svc.ports}</td>
                      <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:svc.replicas.startsWith("0")?T.red:svc.health==="degraded"?T.amber:T.green}}>{svc.replicas}</td>
                      <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{svc.uptime}</td>
                      <td style={{padding:"10px 12px"}}>
                        <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>{streamLogs(svc.name);setTab("logs");}} style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9,transition:"all .12s"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.cyan;e.currentTarget.style.color=T.cyan;}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textDim;}}>Logs</button>
                          <button onClick={()=>doAction(svc.name,"restarting")} disabled={svc.status==="stopped"} style={{padding:"3px 8px",background:"transparent",border:`1px solid ${svc.status==="stopped"?T.border:T.border}`,borderRadius:3,color:svc.status==="stopped"?T.textDim+"44":T.textDim,cursor:svc.status==="stopped"?"default":"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9,transition:"all .12s"}}
                            onMouseEnter={e=>{ if(svc.status!=="stopped"){e.currentTarget.style.borderColor=T.amber;e.currentTarget.style.color=T.amber;} }}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textDim;}}>↺</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Service detail drawer */}
          {selDetail && (
            <Card style={{animation:"slideIn .2s ease",border:`1px solid ${T.cyan}22`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:selDetail.status==="running"?(selDetail.health==="degraded"?T.amber:T.green):T.red,animation:"pulse 2s infinite"}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:selDetail.color}}>{selDetail.name}</span>
                    <Badge color={sColor[selDetail.status]}>{selDetail.status.toUpperCase()}</Badge>
                    <Badge color={hColor[selDetail.health]}>{selDetail.health}</Badge>
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{selDetail.image}</div>
                </div>
                <button onClick={()=>setSelSvc(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:18}}>✕</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                {[
                  {l:"CPU",       v:`${metrics[selDetail.name]?.cpu||0}%`},
                  {l:"Memory",    v:`${metrics[selDetail.name]?.mem||0} MB`},
                  {l:"Replicas",  v:selDetail.replicas},
                  {l:"Uptime",    v:selDetail.uptime},
                  {l:"Ports",     v:selDetail.ports},
                  {l:"Network",   v:selDetail.network},
                  {l:"Env File",  v:selDetail.envFile},
                  {l:"Restart",   v:selDetail.restart},
                ].map(({l,v})=>(
                  <div key={l} style={{padding:"8px 12px",background:T.bg2,borderRadius:5}}>
                    <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:3}}>{l.toUpperCase()}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:T.textBright}}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{streamLogs(selDetail.name);setTab("logs");}} style={{padding:"8px 16px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>📋 View Logs</button>
                <button onClick={()=>doAction(selDetail.name,"restarting")} disabled={selDetail.status==="stopped"} style={{padding:"8px 16px",background:selDetail.status==="stopped"?T.bg3:`${T.amber}14`,border:`1px solid ${selDetail.status==="stopped"?T.border:T.amber}44`,borderRadius:5,color:selDetail.status==="stopped"?T.textDim:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:selDetail.status==="stopped"?"default":"pointer"}}>↺ Restart</button>
                {selDetail.status==="stopped" && (
                  <button onClick={()=>doAction(selDetail.name,"starting")} style={{padding:"8px 16px",background:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:5,color:T.green,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>▶ Start</button>
                )}
                <button style={{padding:"8px 16px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontSize:13,cursor:"pointer"}}>Inspect</button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* COMPOSE */}
      {tab==="compose" && (
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderBottom:`1px solid ${T.border}`,background:T.bg0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:13}}>🐳</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.textBright}}>docker-compose.yml</span>
              <Badge color={T.green}>✓ Valid</Badge>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Badge color={T.cyan}>Compose v3.9</Badge>
              <Badge color={T.orange}>{SERVICES_BASE.length} services</Badge>
              <Badge color={T.purple}>2 networks</Badge>
              <Badge color={T.green}>4 volumes</Badge>
            </div>
          </div>
          <div style={{background:T.bg0,overflowX:"auto",overflowY:"auto",maxHeight:580,padding:"10px 0",lineHeight:1.85}}>
            {hlYaml(COMPOSE)}
          </div>
        </Card>
      )}

      {/* NGINX */}
      {tab==="nginx" && (
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px",borderBottom:`1px solid ${T.border}`,background:T.bg0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:13}}>⚙</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.textBright}}>nginx/nginx.conf</span>
              <Badge color={T.green}>✓ CIS Hardened</Badge>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Badge color={T.cyan}>TLS 1.2/1.3</Badge>
              <Badge color={T.green}>HSTS preload</Badge>
              <Badge color={T.amber}>Rate limited</Badge>
              <Badge color={T.purple}>Gzip on</Badge>
            </div>
          </div>
          <div style={{background:T.bg0,overflowX:"auto",overflowY:"auto",maxHeight:560,padding:"10px 0",lineHeight:1.85}}>
            {hlYaml(NGINX_CONF)}
          </div>
        </Card>
      )}

      {/* LOGS */}
      {tab==="logs" && (
        <Card>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
            <SectionHeader label="Live Log Viewer" accent={T.cyan}/>
            <div style={{display:"flex",gap:5,marginLeft:"auto",flexWrap:"wrap"}}>
              {Object.keys(LOG_TEMPLATES).map(svc=>(
                <button key={svc} onClick={()=>streamLogs(svc)}
                  style={{padding:"5px 10px",background:logSvc===svc?`${T.cyan}18`:"transparent",border:`1px solid ${logSvc===svc?T.cyan:T.border}`,borderRadius:4,color:logSvc===svc?T.cyan:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  {logSvc===svc && logRunning && <span style={{width:5,height:5,borderRadius:"50%",background:T.green,animation:"pulse 1s infinite",display:"inline-block"}}/>}
                  {svc}
                </button>
              ))}
              <button onClick={stopLogs} disabled={!logRunning} style={{padding:"5px 10px",background:logRunning?`${T.amber}14`:"transparent",border:`1px solid ${logRunning?T.amber:T.border}`,borderRadius:4,color:logRunning?T.amber:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:logRunning?"pointer":"default"}}>⏸ Pause</button>
              <button onClick={()=>setLogLines([])} style={{padding:"5px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>⎋ Clear</button>
            </div>
          </div>

          {/* Log level legend */}
          <div style={{display:"flex",gap:14,marginBottom:10}}>
            {[["error",T.red],["warn",T.amber],["info",T.textDim]].map(([l,c])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:10,color:c,fontFamily:"'JetBrains Mono',monospace"}}>{l.toUpperCase()}</span>
              </div>
            ))}
            <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginLeft:8}}>{logLines.length} lines</span>
          </div>

          <div ref={logRef} style={{background:"#040709",borderRadius:5,padding:"12px 14px",height:460,overflowY:"auto",border:`1px solid ${T.border}`,fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.85}}>
            {logLines.length===0
              ? <div style={{color:T.textDim}}>▸ Select a service above to stream logs…</div>
              : logLines.map((l,i)=>(
                  <div key={i} style={{display:"flex",gap:12,marginBottom:1,padding:"1px 4px",borderRadius:2,background:l.level==="error"?`${T.red}08`:l.level==="warn"?`${T.amber}06`:"transparent"}}>
                    <span style={{color:T.textDim+"88",flexShrink:0,minWidth:80}}>{l.ts}</span>
                    <span style={{color:lvlC[l.level]||T.textDim,flexShrink:0,minWidth:40,fontWeight:l.level==="error"?700:400}}>{l.level.toUpperCase()}</span>
                    <span style={{color:lvlTC[l.level]||T.text,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>{l.text}</span>
                  </div>
                ))
            }
            {logRunning && <div style={{color:T.green,animation:"pulse 1s infinite",marginTop:4}}>█ streaming…</div>}
          </div>
        </Card>
      )}
    </div>
  );
};

const SettingsView = () => {
  const [tab, setTab]     = useState("general");
  const [saved, setSaved] = useState(false);
  const [webhookTest, setWebhookTest] = useState(null);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  const Toggle = ({ label, desc, on, color=T.cyan }) => {
    const [active, setActive] = useState(on);
    return (
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:`1px solid ${T.border}`}}>
        <div style={{flex:1,paddingRight:20}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:14,color:T.textBright,marginBottom:2}}>{label}</div>
          {desc && <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{desc}</div>}
        </div>
        <div onClick={()=>setActive(a=>!a)} style={{width:44,height:24,borderRadius:12,background:active?`${color}33`:T.bg3,border:`1px solid ${active?color:T.border}`,cursor:"pointer",position:"relative",transition:"all .2s",flexShrink:0}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:active?color:T.textDim,position:"absolute",top:2,left:active?22:2,transition:"left .2s, background .2s",boxShadow:active?`0 0 8px ${color}66`:"none"}}/>
        </div>
      </div>
    );
  };

  const INTEGRATIONS = [
    {name:"Slack",          icon:"💬", connected:true,  status:"ok",       desc:"Security alerts → #secops-alerts",       color:"#4a154b"},
    {name:"PagerDuty",      icon:"🔔", connected:true,  status:"ok",       desc:"Critical incident escalation",            color:"#06ac38"},
    {name:"Jira",           icon:"⬡",  connected:false, status:"idle",     desc:"Auto-create tickets from findings",       color:"#0052cc"},
    {name:"GitHub",         icon:"⌥",  connected:true,  status:"ok",       desc:"CI/CD triggers, code scanning",           color:"#ccc"},
    {name:"AWS",            icon:"☁",  connected:true,  status:"ok",       desc:"IAM, CloudTrail, Config integration",     color:"#f90"},
    {name:"Microsoft Sentinel", icon:"◈", connected:true, status:"degraded", desc:"SIEM log export — auth error (403)",    color:"#0078d4"},
    {name:"Splunk",         icon:"⬟",  connected:false, status:"idle",     desc:"Forward security events to Splunk",       color:"#ec2e25"},
    {name:"ServiceNow",     icon:"◫",  connected:false, status:"idle",     desc:"ITSM incident management",               color:"#81b5a1"},
  ];

  const statusC = { ok:T.green, degraded:T.amber, idle:T.textDim, error:T.red };
  const statusL = { ok:"CONNECTED", degraded:"DEGRADED", idle:"NOT CONNECTED", error:"ERROR" };

  const [selIntg, setSelIntg]         = useState("Microsoft Sentinel");
  const [sentinelForm, setSentinelForm] = useState({
    workspaceId:   "a2f8c4d1-3b7e-4a9f-8c2d-1e5f6a7b8c9d",
    workspaceKey:  "",
    endpoint:      "https://a2f8c4d1-3b7e-4a9f-8c2d-1e5f6a7b8c9d.ods.opinsights.azure.com",
    tableName:     "SecureOpsEvents_CL",
    batchSize:     "100",
    flushInterval: "30",
  });
  const [testState, setTestState]   = useState(null);  // null | "running" | "ok" | "error"
  const [testLog,   setTestLog]     = useState([]);
  const [_saveState, setSaveState]  = useState(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnected,  setReconnected]  = useState(false);

  const SENTINEL_ERROR = {
    code:    "HTTP 403 Forbidden",
    msg:     "Authorization failed — The provided shared key is expired or invalid.",
    last:    "2026-05-07 06:44:21 UTC",
    since:   "~2d 21h",
    dropped: 8341,
    detail:  "Workspace a2f8c4d1 rejected all log delivery attempts since May 5 06:44 UTC. Azure Log Analytics returned 403 on every POST to /api/logs. The Shared Key was last rotated on March 3 — keys expire every 90 days by default.",
    fix:     "Regenerate the Shared Key in Azure Portal → Log Analytics Workspace → Agents → Primary/Secondary Key, then paste the new key below and click Save & Reconnect.",
  };

  const SENTINEL_STATS = {
    lastOk:      "2026-05-05 06:43:51 UTC",
    totalSent:   "1,284,492",
    errorRate:   "100%",
    droppedEvts: "8,341",
    tableRows:   "1,284,492",
    logTypes:    ["SecurityEvent","Syslog","CommonSecurityLog","AzureActivity"],
  };

  const runConnectionTest = () => {
    if (!sentinelForm.workspaceKey.trim()) {
      setTestState("error");
      setTestLog([
        {t:"Resolving workspace endpoint…",  s:"ok"},
        {t:"DNS: a2f8c4d1.ods.opinsights.azure.com → 52.188.40.224",  s:"ok"},
        {t:"Opening TLS 1.3 connection to :443…",  s:"ok"},
        {t:"Sending HMAC-SHA256 signed test payload…",  s:"running"},
        {t:"← HTTP 403 Forbidden: SharedKey authorization header is invalid.",  s:"error"},
        {t:"FAILED — Shared Key is missing or invalid.",  s:"error"},
      ]);
      return;
    }
    setTestState("running");
    setTestLog([]);
    const steps = [
      {t:"Resolving workspace endpoint…",                                             s:"ok",    delay:200},
      {t:`DNS: ${sentinelForm.workspaceId.slice(0,8)}… → 52.188.40.224`,             s:"ok",    delay:420},
      {t:"Opening TLS 1.3 connection to ods.opinsights.azure.com:443…",              s:"ok",    delay:660},
      {t:"Generating HMAC-SHA256 Authorization header…",                              s:"ok",    delay:880},
      {t:`POST /api/logs?api-version=2016-04-01  (table: ${sentinelForm.tableName})`,s:"ok",    delay:1100},
      {t:"← HTTP 200 OK  (latency: 188ms)",                                          s:"ok",    delay:1400},
      {t:"Parsing response: { \"message\": \"\" }",                                  s:"ok",    delay:1600},
      {t:"✓ Connection successful — Shared Key is valid.",                            s:"ok",    delay:1800},
    ];
    steps.forEach(({t,s,delay})=>setTimeout(()=>setTestLog(p=>[...p,{t,s}]),delay));
    setTimeout(()=>setTestState("ok"), 2000);
  };

  const doReconnect = () => {
    if (!sentinelForm.workspaceKey.trim()) return;
    setReconnecting(true);
    setTimeout(()=>{ setReconnecting(false); setReconnected(true); }, 2800);
  };

  const doSave = () => {
    setSaveState("saving");
    setTimeout(()=>{ setSaveState("saved"); doReconnect(); }, 600);
  };

  const WEBHOOKS = [
    {name:"Security Alert Hook",   url:"https://hooks.slack.com/services/T0.../zolextech-alerts", events:["alert.critical","alert.high"],  active:true,  last:"2m ago"},
    {name:"Pipeline Notification", url:"https://hooks.zapier.com/hooks/catch/123.../abc/",         events:["pipeline.failed","pipeline.done"],active:true, last:"14m ago"},
    {name:"Compliance Report",     url:"https://api.pagerduty.com/v2/enqueue",                     events:["compliance.scan_done"],         active:false, last:"2d ago"},
  ];

  const TABS = ["general","security","integrations","webhooks","advanced"];
  const TL = {general:"⚙ General", security:"🔐 Security", integrations:"◈ Integrations", webhooks:"⟁ Webhooks", advanced:"⬡ Advanced"};

  return (
    <div className="fadeIn">
      <div style={{display:"flex",marginBottom:18,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"9px 20px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>{TL[t]}</button>)}
      </div>

      {/* GENERAL */}
      {tab==="general" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Platform Settings" accent={T.cyan}/>
            {[
              {l:"PLATFORM NAME",       v:"ZolexTech SecureOps"},
              {l:"ORGANIZATION",        v:"ZolexTech & Consultant"},
              {l:"PRIMARY DOMAIN",      v:"secureops.zolextech.com"},
              {l:"SUPPORT EMAIL",       v:"security@zolextech.com"},
              {l:"TIMEZONE",            v:"America/New_York"},
              {l:"DATE FORMAT",         v:"YYYY-MM-DD"},
            ].map(f=>(
              <div key={f.l} style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:5}}>{f.l}</div>
                <input defaultValue={f.v} style={{width:"100%",padding:"10px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:13,outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            ))}
            <Btn onClick={save} color={T.cyan} style={{maxWidth:180}}>{saved?"✓ Saved!":"Save Changes"}</Btn>
          </Card>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <SectionHeader label="Appearance" accent={T.purple}/>
              <Toggle label="Dark Mode"          desc="Dark terminal aesthetic (recommended)" on={true} color={T.purple}/>
              <Toggle label="Compact Sidebar"    desc="Reduce sidebar icon size" on={false} color={T.purple}/>
              <Toggle label="Animated Metrics"   desc="Live-updating dashboard charts" on={true} color={T.purple}/>
              <Toggle label="Scan Line Effect"   desc="Background scan line animation" on={true} color={T.purple}/>
              <Toggle label="Sound Alerts"       desc="Audio notification for critical events" on={false} color={T.purple}/>
            </Card>
            <Card>
              <SectionHeader label="Session & Access" accent={T.amber}/>
              {[
                {l:"SESSION TIMEOUT", v:"60 minutes"},
                {l:"MAX CONCURRENT",  v:"5 sessions"},
                {l:"IDLE TIMEOUT",    v:"30 minutes"},
              ].map(f=>(
                <div key={f.l} style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:5}}>{f.l}</div>
                  <input defaultValue={f.v} style={{width:"100%",padding:"10px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:13,outline:"none"}}
                    onFocus={e=>e.target.style.borderColor=T.amber} onBlur={e=>e.target.style.borderColor=T.border}/>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* SECURITY */}
      {tab==="security" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Authentication" accent={T.cyan}/>
            <Toggle label="Enforce MFA for all users"       desc="Block login without TOTP or hardware key" on={true}/>
            <Toggle label="SSO / SAML 2.0"                 desc="Enable enterprise single sign-on" on={false}/>
            <Toggle label="IP Allowlist"                    desc="Restrict access to approved IP ranges" on={false}/>
            <Toggle label="Passkeys (WebAuthn)"             desc="Allow passwordless login with device keys" on={false}/>
            <Toggle label="Login attempt lockout"           desc="Lock after 5 failed attempts (15 min)" on={true}/>
            <Toggle label="Suspicious login notifications"  desc="Alert on new device or unusual location" on={true}/>
          </Card>
          <Card>
            <SectionHeader label="Data & Privacy" accent={T.red}/>
            <Toggle label="Audit log all actions"    desc="Write every user action to the audit log" on={true} color={T.red}/>
            <Toggle label="Encrypt exports"          desc="Password-protect CSV and PDF exports" on={true} color={T.red}/>
            <Toggle label="Data residency (US-only)" desc="Prevent data leaving US-East-1 region" on={true} color={T.red}/>
            <Toggle label="GDPR delete on request"   desc="Honor right-to-erasure requests within 30d" on={true} color={T.red}/>
            <Toggle label="Share analytics with Anthropic" desc="Help improve AI Analyst responses" on={false} color={T.red}/>
            <div style={{marginTop:14,padding:"12px 14px",background:`${T.red}08`,border:`1px solid ${T.red}33`,borderRadius:6}}>
              <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>Data is encrypted at rest (AES-256) and in transit (TLS 1.3). PCI DSS v4 and SOC 2 Type II compliant.</div>
            </div>
          </Card>
          <Card>
            <SectionHeader label="Network Security" accent={T.amber}/>
            <Toggle label="Rate limiting"             desc="30 requests/min per IP on API endpoints" on={true} color={T.amber}/>
            <Toggle label="DDoS protection"           desc="AWS Shield Advanced integration" on={true} color={T.amber}/>
            <Toggle label="WAF rules enabled"         desc="1,247 active OWASP CRS rules" on={true} color={T.amber}/>
            <Toggle label="Bot detection"             desc="Block known crawlers and scanners" on={true} color={T.amber}/>
            <Toggle label="GeoIP blocking"            desc="Block traffic from sanctioned countries" on={false} color={T.amber}/>
          </Card>
          <Card>
            <SectionHeader label="Scan Policies" accent={T.green}/>
            <Toggle label="Auto-scan on PR merge"     desc="Trigger SAST scan on every merge to main" on={true} color={T.green}/>
            <Toggle label="Block deploy on CRITICAL"  desc="Fail CI pipeline if CRITICAL finding found" on={true} color={T.green}/>
            <Toggle label="Dependency updates"        desc="Weekly automated dependency security PRs" on={false} color={T.green}/>
            <Toggle label="Container image scanning"  desc="Trivy scan on every Docker build" on={true} color={T.green}/>
            <Toggle label="IaC drift alerts"          desc="Alert when AWS state diverges from Terraform" on={true} color={T.green}/>
          </Card>
        </div>
      )}

      {/* INTEGRATIONS */}
      {tab==="integrations" && (
        <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14,alignItems:"start"}}>
          {/* Integration list */}
          <Card style={{padding:"8px 0"}}>
            <div style={{padding:"0 14px 10px",borderBottom:`1px solid ${T.border}`,marginBottom:4}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,color:T.textBright}}>Integrations</div>
              <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{INTEGRATIONS.filter(i=>i.connected).length} of {INTEGRATIONS.length} connected</div>
            </div>
            {INTEGRATIONS.map(intg=>(
              <button key={intg.name} onClick={()=>setSelIntg(intg.name)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:selIntg===intg.name?`${intg.color}12`:"transparent",borderLeft:selIntg===intg.name?`2px solid ${intg.color}`:"2px solid transparent",border:"none",cursor:"pointer",textAlign:"left",transition:"all .12s"}}
                onMouseEnter={e=>{ if(selIntg!==intg.name) e.currentTarget.style.background=T.bg2; }}
                onMouseLeave={e=>{ if(selIntg!==intg.name) e.currentTarget.style.background="transparent"; }}>
                <div style={{width:32,height:32,borderRadius:8,background:intg.color+"1a",border:`1px solid ${intg.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{intg.icon}</div>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:selIntg===intg.name?T.textBright:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{intg.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:4,marginTop:2}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:statusC[intg.status],animation:intg.status==="ok"?"pulse 2s infinite":"none"}}/>
                    <span style={{fontSize:9,color:statusC[intg.status],fontFamily:"'JetBrains Mono',monospace"}}>{statusL[intg.status]}</span>
                  </div>
                </div>
              </button>
            ))}
          </Card>

          {/* Detail panel */}
          <div>
            {selIntg==="Microsoft Sentinel" ? (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>

                {/* Error banner */}
                {!reconnected && (
                  <div style={{padding:"14px 18px",background:`${T.red}08`,border:`1px solid ${T.red}33`,borderRadius:8,display:"flex",gap:14}}>
                    <div style={{width:36,height:36,borderRadius:9,background:"#0078d422",border:"1px solid #0078d444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>◈</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                        <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright}}>Microsoft Sentinel</span>
                        <Badge color={T.red}>⚠ DEGRADED</Badge>
                        <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>since {SENTINEL_ERROR.since}</span>
                      </div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.red,marginBottom:6}}>
                        {SENTINEL_ERROR.code}: {SENTINEL_ERROR.msg}
                      </div>
                      <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.7,marginBottom:8}}>
                        {SENTINEL_ERROR.detail}
                      </div>
                      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                        {[
                          ["Last successful send", SENTINEL_STATS.lastOk],
                          ["Events dropped",        SENTINEL_ERROR.dropped.toLocaleString()],
                          ["Error started",         SENTINEL_ERROR.last],
                        ].map(([l,v])=>(
                          <div key={l} style={{padding:"6px 12px",background:T.bg2,borderRadius:5}}>
                            <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1}}>{l.toUpperCase()}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:l==="Events dropped"?T.red:T.textBright,marginTop:2}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {reconnected && (
                  <div style={{padding:"14px 18px",background:`${T.green}08`,border:`1px solid ${T.green}33`,borderRadius:8,display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontSize:22}}>✓</span>
                    <div>
                      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:T.green,marginBottom:2}}>Microsoft Sentinel reconnected successfully</div>
                      <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>Log forwarding resumed. Events are now flowing to workspace table <span style={{color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{sentinelForm.tableName}</span>. No dropped events since reconnection.</div>
                    </div>
                  </div>
                )}

                {/* Fix guide */}
                {!reconnected && (
                  <Card style={{border:`1px solid ${T.amber}22`}}>
                    <SectionHeader label="Resolution Steps" accent={T.amber}/>
                    {[
                      {n:"1", title:"Open Azure Portal",      desc:"Navigate to portal.azure.com → Log Analytics workspaces → Select your workspace.",                                          done:true },
                      {n:"2", title:"Locate Shared Key",       desc:"Go to Settings → Agents → Primary Key (or Secondary Key). Copy the new key.",                                              done:true },
                      {n:"3", title:"Paste new key below",     desc:"Enter the new Primary Key in the Shared Key field below, then click Save & Reconnect.",                                   done:false},
                      {n:"4", title:"Verify connectivity",     desc:"Use the Test Connection button to confirm HTTP 200 before saving.",                                                         done:false},
                    ].map(step=>(
                      <div key={step.n} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                        <div style={{width:24,height:24,borderRadius:"50%",background:step.done?`${T.green}18`:`${T.amber}18`,border:`1px solid ${step.done?T.green:T.amber}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:step.done?T.green:T.amber,flexShrink:0,fontWeight:700}}>{step.done?"✓":step.n}</div>
                        <div>
                          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:step.done?T.textDim:T.textBright,marginBottom:2}}>{step.title}</div>
                          <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{step.desc}</div>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}

                {/* Configuration form */}
                <Card>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <SectionHeader label="Connection Configuration" accent={"#0078d4"}/>
                    <a href="https://learn.microsoft.com/en-us/azure/azure-monitor/logs/data-collector-api" target="_blank" rel="noopener noreferrer"
                      style={{fontSize:11,color:"#0078d4",fontFamily:"'JetBrains Mono',monospace",textDecoration:"none"}}>
                      Azure Docs ↗
                    </a>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    {[
                      {k:"workspaceId",   l:"WORKSPACE ID",             hint:"Found in Azure Portal → Log Analytics → Overview",          sensitive:false},
                      {k:"workspaceKey",  l:"SHARED KEY (PRIMARY) ⚠",   hint:"Regenerate in Azure Portal → Agents → Primary Key",          sensitive:true, required:true, error:!sentinelForm.workspaceKey&&!reconnected},
                      {k:"endpoint",      l:"ODS ENDPOINT",              hint:"Auto-derived from Workspace ID (do not modify unless custom)",sensitive:false},
                      {k:"tableName",     l:"LOG ANALYTICS TABLE",       hint:"Must end in _CL for custom tables",                          sensitive:false},
                    ].map(f=>(
                      <div key={f.k}>
                        <div style={{fontSize:9,color:f.error?T.red:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:5,display:"flex",gap:6}}>
                          {f.l}
                          {f.required && <span style={{color:T.red}}>*</span>}
                        </div>
                        <input
                          type={f.sensitive?"password":"text"}
                          value={sentinelForm[f.k]}
                          onChange={e=>setSentinelForm(p=>({...p,[f.k]:e.target.value}))}
                          placeholder={f.k==="workspaceKey"?"Paste new Primary Key here…":""}
                          style={{width:"100%",padding:"10px 12px",background:f.error?`${T.red}08`:T.bg2,border:`1px solid ${f.error?T.red:T.border}`,borderRadius:6,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",transition:"border-color .15s"}}
                          onFocus={e=>e.target.style.borderColor=f.error?T.red:"#0078d4"}
                          onBlur={e=>e.target.style.borderColor=f.error?T.red:T.border}
                        />
                        <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{f.hint}</div>
                        {f.error && <div style={{fontSize:10,color:T.red,fontFamily:"'JetBrains Mono',monospace",marginTop:3}}>⚠ This field is required to restore the connection</div>}
                      </div>
                    ))}
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:14}}>
                    <div>
                      <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:5}}>BATCH SIZE (events)</div>
                      <input value={sentinelForm.batchSize} onChange={e=>setSentinelForm(p=>({...p,batchSize:e.target.value}))}
                        style={{width:"100%",padding:"10px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none"}}
                        onFocus={e=>e.target.style.borderColor="#0078d4"} onBlur={e=>e.target.style.borderColor=T.border}/>
                      <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>Max events per POST (1–500)</div>
                    </div>
                    <div>
                      <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:5}}>FLUSH INTERVAL (seconds)</div>
                      <input value={sentinelForm.flushInterval} onChange={e=>setSentinelForm(p=>({...p,flushInterval:e.target.value}))}
                        style={{width:"100%",padding:"10px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none"}}
                        onFocus={e=>e.target.style.borderColor="#0078d4"} onBlur={e=>e.target.style.borderColor=T.border}/>
                      <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>How often to flush buffered events</div>
                    </div>
                  </div>

                  {/* Test connection */}
                  <div style={{marginTop:16,padding:"12px 14px",background:T.bg2,borderRadius:7,border:`1px solid ${T.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:testLog.length?10:0}}>
                      <div>
                        <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.textBright,marginBottom:2}}>Test Connection</div>
                        <div style={{fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>
                          Sends a small test payload to verify the Shared Key and endpoint before saving.
                        </div>
                      </div>
                      <button onClick={runConnectionTest} disabled={testState==="running"}
                        style={{padding:"7px 16px",background:testState==="running"?T.bg3:testState==="ok"?`${T.green}14`:`${"#0078d4"}14`,border:`1px solid ${testState==="running"?T.border:testState==="ok"?T.green:"#0078d4"}`,borderRadius:5,color:testState==="running"?T.textDim:testState==="ok"?T.green:"#0078d4",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:testState==="running"?"default":"pointer",flexShrink:0,marginLeft:14}}>
                        {testState==="running"?"⟳ Testing…":testState==="ok"?"✓ Connected":"▶ Test Connection"}
                      </button>
                    </div>
                    {testLog.length>0 && (
                      <div style={{background:"#030608",borderRadius:5,padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,lineHeight:1.9,marginTop:8}}>
                        {testLog.map((l,i)=>(
                          <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                            <span style={{color:l.s==="error"?T.red:l.s==="ok"?T.green:T.amber,flexShrink:0}}>{l.s==="error"?"✗":l.s==="ok"?"✓":"⟳"}</span>
                            <span style={{color:l.s==="error"?T.red:l.s==="ok"?T.text:T.amber}}>{l.t}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{display:"flex",gap:10,marginTop:16}}>
                    <button onClick={doSave} disabled={!sentinelForm.workspaceKey.trim()||reconnecting}
                      style={{padding:"10px 24px",background:!sentinelForm.workspaceKey.trim()?T.bg3:reconnected?`${T.green}18`:`${"#0078d4"}18`,border:`1px solid ${!sentinelForm.workspaceKey.trim()?T.border:reconnected?T.green:"#0078d4"}`,borderRadius:6,color:!sentinelForm.workspaceKey.trim()?T.textDim:reconnected?T.green:"#0078d4",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,cursor:!sentinelForm.workspaceKey.trim()?"default":"pointer",flex:1}}>
                      {reconnecting?"⟳ Reconnecting…":reconnected?"✓ Reconnected — Logs Flowing":"Save & Reconnect"}
                    </button>
                    <button onClick={()=>setSentinelForm(p=>({...p,workspaceKey:""}))}
                      style={{padding:"10px 18px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:6,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontSize:13,cursor:"pointer"}}>
                      Clear Key
                    </button>
                  </div>
                </Card>

                {/* Integration stats */}
                <Card>
                  <SectionHeader label="Log Forwarding Statistics" accent={"#0078d4"}/>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                    {[
                      {l:"Events Sent (all time)", v:SENTINEL_STATS.totalSent,   c:T.cyan},
                      {l:"Dropped (current fault)", v:SENTINEL_STATS.droppedEvts, c:T.red},
                      {l:"Error Rate",               v:reconnected?"0%":SENTINEL_STATS.errorRate, c:reconnected?T.green:T.red},
                      {l:"Table Row Count",           v:SENTINEL_STATS.tableRows,   c:T.purple},
                      {l:"Last Successful Send",      v:reconnected?"just now":SENTINEL_STATS.lastOk.slice(0,10), c:reconnected?T.green:T.textDim},
                      {l:"Status",                    v:reconnected?"OPERATIONAL":"DEGRADED", c:reconnected?T.green:T.amber},
                    ].map(({l,v,c})=>(
                      <div key={l} style={{padding:"9px 12px",background:T.bg2,borderRadius:6}}>
                        <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:3}}>{l.toUpperCase()}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>LOG TYPES FORWARDED</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {SENTINEL_STATS.logTypes.map(lt=>(
                        <span key={lt} style={{fontSize:10,color:"#0078d4",background:"#0078d414",padding:"3px 9px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace",border:"1px solid #0078d433"}}>{lt}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{padding:"10px 12px",background:T.bg2,borderRadius:5,border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:5}}>KQL QUERY TO VERIFY (run in Log Analytics)</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.green}}>
                      {sentinelForm.tableName} | where TimeGenerated &gt; ago(1h) | summarize count() by Severity
                    </div>
                  </div>
                </Card>

              </div>
            ) : (
              /* Generic integration panel */
              (() => {
                const intg = INTEGRATIONS.find(i=>i.name===selIntg);
                if (!intg) return null;
                return (
                  <Card>
                    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
                      <div style={{width:52,height:52,borderRadius:12,background:intg.color+"18",border:`1px solid ${intg.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{intg.icon}</div>
                      <div>
                        <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:20,color:T.textBright,marginBottom:4}}>{intg.name}</div>
                        <div style={{fontSize:13,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>{intg.desc}</div>
                        <Badge color={statusC[intg.status]}>{statusL[intg.status]}</Badge>
                      </div>
                    </div>
                    <button style={{width:"100%",padding:"12px 0",background:intg.connected?`${T.red}12`:`${intg.color}18`,border:`1px solid ${intg.connected?T.red:intg.color}44`,borderRadius:6,color:intg.connected?T.red:intg.color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>
                      {intg.connected?"Disconnect":"Connect →"}
                    </button>
                  </Card>
                );
              })()
            )}
          </div>
        </div>
      )}

      {/* WEBHOOKS */}
      {tab==="webhooks" && (
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <SectionHeader label="Configured Webhooks" accent={T.cyan}/>
              <button style={{padding:"7px 16px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add Webhook</button>
            </div>
            {WEBHOOKS.map((wh,i)=>(
              <div key={i} style={{padding:"14px 16px",background:T.bg2,borderRadius:7,border:`1px solid ${T.border}`,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:3}}>{wh.name}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan,background:T.bg0,padding:"3px 8px",borderRadius:3,display:"inline-block",maxWidth:380,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{wh.url}</div>
                  </div>
                  <Badge color={wh.active?T.green:T.textDim}>{wh.active?"ACTIVE":"PAUSED"}</Badge>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  {wh.events.map(ev=><Badge key={ev} color={T.purple}>{ev}</Badge>)}
                  <span style={{marginLeft:"auto",fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Last: {wh.last}</span>
                  <button onClick={()=>{setWebhookTest(i);setTimeout(()=>setWebhookTest(null),1500);}} style={{padding:"4px 12px",background:`${T.amber}14`,border:`1px solid ${T.amber}44`,borderRadius:4,color:webhookTest===i?T.green:T.amber,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer"}}>
                    {webhookTest===i?"✓ Sent!":"Test"}
                  </button>
                  <button style={{padding:"4px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer"}}>Edit</button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ADVANCED */}
      {tab==="advanced" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Performance" accent={T.cyan}/>
            {[
              {l:"Event buffer size",        v:"500 events",     hint:"Max events in live feed memory"},
              {l:"Dashboard refresh rate",   v:"2000ms",         hint:"Metric polling interval"},
              {l:"Log retention (local)",    v:"90 days",        hint:"Before archiving to S3"},
              {l:"Cache TTL",                v:"300 seconds",    hint:"Redis cache expiry for API responses"},
              {l:"WebSocket ping interval",  v:"30 seconds",     hint:"Keepalive for real-time connections"},
            ].map(f=>(
              <div key={f.l} style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:4}}>{f.l}</div>
                <input defaultValue={f.v} style={{width:"100%",padding:"9px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:6,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:12,outline:"none"}}
                  onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border}/>
                <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:3}}>{f.hint}</div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader label="Danger Zone" accent={T.red}/>
            {[
              {label:"Export All Data",    desc:"Download full platform data export (JSON/CSV)",  btn:"Export",      color:T.amber},
              {label:"Reset Demo Data",    desc:"Restore all metrics and alerts to sample data",  btn:"Reset",       color:T.amber},
              {label:"Purge Event Logs",   desc:"Permanently delete all event logs older than 90d",btn:"Purge Logs",  color:T.red},
              {label:"Revoke All Sessions",desc:"Force log out all currently active users",       btn:"Revoke All",  color:T.red},
              {label:"Delete Workspace",   desc:"Permanently delete this workspace and all data", btn:"Delete",      color:T.red},
            ].map((a,_i)=>(
              <div key={a.label} style={{padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:14}}>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:14,color:T.textBright,marginBottom:2}}>{a.label}</div>
                    <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{a.desc}</div>
                  </div>
                  <button style={{padding:"6px 14px",background:`${a.color}12`,border:`1px solid ${a.color}44`,borderRadius:5,color:a.color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{a.btn}</button>
                </div>
              </div>
            ))}
          </Card>
          <Card style={{gridColumn:"1/-1"}}>
            <SectionHeader label="Environment Variables" accent={T.textDim}/>
            <div style={{background:T.bg0,borderRadius:5,padding:"12px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.9}}>
              {[
                {k:"ENVIRONMENT",     v:"production",          c:T.green},
                {k:"DATABASE_URL",    v:"postgresql://***",    c:T.textDim},
                {k:"REDIS_URL",       v:"redis://redis:6379/0",c:T.amber},
                {k:"JWT_ALGORITHM",   v:"HS256",               c:T.cyan},
                {k:"ANTHROPIC_MODEL", v:"claude-sonnet-4-20250514", c:T.purple},
                {k:"STRIPE_MODE",     v:"live",                c:T.green},
                {k:"LOG_LEVEL",       v:"INFO",                c:T.textDim},
              ].map(e=>(
                <div key={e.k} style={{display:"flex",gap:14}}>
                  <span style={{color:T.cyan,minWidth:200}}>{e.k}</span>
                  <span style={{color:T.textDim}}>=</span>
                  <span style={{color:e.c}}>{e.v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// INCIDENT RESPONSE VIEW
// ═══════════════════════════════════════════════════════════════════════
const IncidentView = () => {
  const [tab, setTab]         = useState("active");
  const [selInc, setSelInc]   = useState("INC-001");
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes]     = useState([
    { author:"Adebayo Paul",    time:"09:42", text:"Confirmed lateral movement. Isolating 10.0.2.45 from network." },
    { author:"Amaka Obi",       time:"09:38", text:"IOC 185.220.101.8 added to WAF block list." },
    { author:"Chidera Okonkwo", time:"09:35", text:"Escalated to P1. Notifying CISO and exec team." },
    { author:"System",          time:"09:22", text:"Automated triage: High confidence lateral movement pattern (MITRE T1021.002)." },
  ]);
  const [taskDone, setTaskDone] = useState({});

  const INCIDENTS = [
    {
      id:"INC-001", title:"Active Lateral Movement — Internal Network", sev:"P1", status:"investigating",
      opened:"09:22", updated:"2m ago", owner:"Adebayo Paul",
      affected:["10.0.2.45","10.0.3.12","10.0.2.48"], ttd:"20m", ttr:"—",
      mitre:["T1021.002","T1078","T1110"], tags:["lateral-movement","smb","high-priority"],
      description:"Threat actor 185.220.101.8 (Tor exit node) initiated 847 SSH connections against internal hosts. Lateral movement via SMB to 10.0.3.12 detected. Potential credential compromise on 10.0.2.45.",
      tasks:[
        {id:"t1", label:"Isolate 10.0.2.45 from network",              phase:"Contain",  done:false},
        {id:"t2", label:"Block 185.220.101.8 at WAF + firewall",        phase:"Contain",  done:true },
        {id:"t3", label:"Capture memory dump from 10.0.2.45",           phase:"Eradicate",done:false},
        {id:"t4", label:"Audit all auth events on affected hosts",       phase:"Eradicate",done:false},
        {id:"t5", label:"Rotate all SSH keys on prod hosts",             phase:"Eradicate",done:false},
        {id:"t6", label:"Review lateral movement path in Sysmon logs",  phase:"Investigate",done:true},
        {id:"t7", label:"Notify affected users and reset passwords",     phase:"Recover",  done:false},
        {id:"t8", label:"Update IDS rules for SMB lateral movement",    phase:"Recover",  done:false},
        {id:"t9", label:"Write post-mortem report",                      phase:"Post-Inc", done:false},
      ],
      timeline:[
        {time:"09:22",event:"Automated detection: lateral movement pattern",type:"detect"},
        {time:"09:24",event:"Alert acknowledged by Adebayo Paul",           type:"ack"},
        {time:"09:28",event:"Severity escalated to P1",                     type:"escalate"},
        {time:"09:33",event:"CISO and exec team notified",                  type:"notify"},
        {time:"09:35",event:"Contain phase initiated",                      type:"contain"},
        {time:"09:38",event:"IOC blocked at WAF — 185.220.101.8",           type:"block"},
        {time:"09:42",event:"10.0.2.45 isolation in progress",              type:"contain"},
      ],
    },
    {
      id:"INC-002", title:"S3 Bucket Public ACL Re-enabled", sev:"P2", status:"contained",
      opened:"06:33", updated:"3h ago", owner:"Chidera Okonkwo",
      affected:["zolextech-prod bucket"], ttd:"8m", ttr:"45m",
      mitre:["T1530"], tags:["cloud","s3","misconfiguration"],
      description:"S3 bucket zolextech-prod had public ACL re-enabled via AWS console, exposing prod backups. Automated CloudTrail alert triggered. Access logs show 3 anonymous reads before remediation.",
      tasks:[
        {id:"t1",label:"Disable public ACL immediately",      phase:"Contain",  done:true},
        {id:"t2",label:"Audit CloudTrail for data access",    phase:"Investigate",done:true},
        {id:"t3",label:"Identify who changed ACL and why",    phase:"Investigate",done:true},
        {id:"t4",label:"Review exposed data classification",  phase:"Eradicate",done:true},
        {id:"t5",label:"Enable S3 Block Public Access policy",phase:"Recover",  done:true},
        {id:"t6",label:"Add AWS Config rule to alert on ACL", phase:"Recover",  done:false},
      ],
      timeline:[
        {time:"06:33",event:"CloudTrail: PutBucketAcl — public-read",type:"detect"},
        {time:"06:41",event:"Automated remediation blocked — awaiting manual confirm",type:"ack"},
        {time:"06:44",event:"ACL reverted by Chidera Okonkwo",type:"contain"},
        {time:"07:18",event:"Root cause: developer test — ACL not reverted after test",type:"investigate"},
      ],
    },
    {
      id:"INC-003", title:"Malicious PowerShell Encoded Command", sev:"P2", status:"resolved",
      opened:"07:44", updated:"6h ago", owner:"Amaka Obi",
      affected:["10.0.2.45"], ttd:"12m", ttr:"2h 14m",
      mitre:["T1059.001","T1027"], tags:["powershell","endpoint","malware"],
      description:"Sysmon Event ID 1 detected PowerShell with base64-encoded payload on host 10.0.2.45. Decoded payload was a reverse shell attempting C2 communication. Process terminated, host scanned clean.",
      tasks:[
        {id:"t1",label:"Terminate malicious PowerShell process", phase:"Contain",  done:true},
        {id:"t2",label:"Decode and analyse payload",             phase:"Investigate",done:true},
        {id:"t3",label:"Full AV + EDR scan on host",             phase:"Eradicate",done:true},
        {id:"t4",label:"Block C2 domain at DNS + firewall",      phase:"Eradicate",done:true},
        {id:"t5",label:"Host confirmed clean — return to service",phase:"Recover", done:true},
        {id:"t6",label:"Improve PowerShell logging (ScriptBlock)",phase:"Recover", done:true},
      ],
      timeline:[
        {time:"07:44",event:"Sysmon EID1: encoded PowerShell detected",type:"detect"},
        {time:"07:56",event:"Process terminated by EDR",type:"contain"},
        {time:"08:30",event:"Payload decoded: reverse shell to 103.89.21.14",type:"investigate"},
        {time:"09:58",event:"Host cleared — incident resolved",type:"resolve"},
      ],
    },
  ];

  const PLAYBOOKS = [
    {name:"Lateral Movement Response",    steps:9,  applicable:["INC-001"], icon:"🔴"},
    {name:"Data Exfiltration Response",   steps:11, applicable:[],          icon:"🔴"},
    {name:"Ransomware Containment",       steps:14, applicable:[],          icon:"🔴"},
    {name:"Cloud Misconfiguration",       steps:7,  applicable:["INC-002"], icon:"🟡"},
    {name:"Malware Infection",            steps:10, applicable:["INC-003"], icon:"🟡"},
    {name:"Credential Compromise",        steps:8,  applicable:["INC-001"], icon:"🔴"},
    {name:"DDoS Mitigation",              steps:6,  applicable:[],          icon:"🟡"},
    {name:"Insider Threat Investigation", steps:12, applicable:[],          icon:"🔴"},
  ];

  const inc       = INCIDENTS.find(i=>i.id===selInc) || INCIDENTS[0];
  const sevColor  = { P1:T.red, P2:T.amber, P3:T.cyan, P4:T.textDim };
  const statColor = { investigating:T.red, contained:T.amber, resolved:T.green, closed:T.textDim };
  const phaseColor= { Contain:T.red, Investigate:T.cyan, Eradicate:T.amber, Recover:T.green, "Post-Inc":T.textDim };
  const timeColor = { detect:T.red, ack:T.cyan, escalate:T.amber, notify:T.purple, contain:T.red, block:T.green, investigate:T.cyan, resolve:T.green };
  const phases    = ["Contain","Investigate","Eradicate","Recover","Post-Inc"];

  const TABS = ["active","playbooks","metrics"];
  const TL   = { active:"🚨 Active Incidents", playbooks:"📋 Playbooks", metrics:"📊 Metrics" };

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(n=>[{author:"Adebayo Paul", time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}), text:newNote.trim()}, ...n]);
    setNewNote("");
  };

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="OPEN P1"      value={INCIDENTS.filter(i=>i.sev==="P1"&&i.status!=="resolved"&&i.status!=="closed").length} icon="🚨" color={T.red} delta={1}/>
        <MetricCard label="OPEN P2"      value={INCIDENTS.filter(i=>i.sev==="P2"&&i.status!=="resolved"&&i.status!=="closed").length} icon="⚠" color={T.amber}/>
        <MetricCard label="TOTAL OPEN"   value={INCIDENTS.filter(i=>i.status!=="resolved"&&i.status!=="closed").length} icon="◎" color={T.cyan}/>
        <MetricCard label="AVG TTD"      value="13" unit="min" icon="⏱" color={T.green}/>
        <MetricCard label="AVG TTR"      value="94" unit="min" icon="⏱" color={T.amber}/>
        <MetricCard label="RESOLVED 30d" value={18} icon="✓" color={T.green}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.red}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.red:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            {TL[t]}
            {t==="active" && INCIDENTS.filter(i=>i.status==="investigating").length>0 && <span style={{background:T.red,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 6px",fontFamily:"'JetBrains Mono',monospace"}}>{INCIDENTS.filter(i=>i.status==="investigating").length}</span>}
          </button>
        ))}
      </div>

      {/* ACTIVE INCIDENTS */}
      {tab==="active" && (
        <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:14,alignItems:"start"}}>
          {/* Incident list */}
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button style={{width:"100%",padding:"10px 0",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:6,color:T.red,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",marginBottom:4}}>+ Declare New Incident</button>
            {INCIDENTS.map(inc=>(
              <div key={inc.id} onClick={()=>setSelInc(inc.id)} style={{padding:"12px 14px",background:selInc===inc.id?`${sevColor[inc.sev]}0a`:T.bg1,border:`1.5px solid ${selInc===inc.id?sevColor[inc.sev]:T.border}`,borderRadius:7,cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:sevColor[inc.sev],animation:inc.status==="investigating"?"pulse 1s infinite":"none"}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{inc.id}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <Badge color={sevColor[inc.sev]}>{inc.sev}</Badge>
                    <Badge color={statColor[inc.status]}>{inc.status.toUpperCase()}</Badge>
                  </div>
                </div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.textBright,marginBottom:5,lineHeight:1.3}}>{inc.title}</div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{inc.owner}</span>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>updated {inc.updated}</span>
                </div>
                {/* Phase progress dots */}
                <div style={{display:"flex",gap:4,marginTop:8}}>
                  {phases.map(ph=>{
                    const phaseTasks = inc.tasks.filter(t=>t.phase===ph);
                    const allDone = phaseTasks.every(t=>taskDone[t.id]??t.done);
                    const anyDone = phaseTasks.some(t=>taskDone[t.id]??t.done);
                    return <div key={ph} title={ph} style={{flex:1,height:4,borderRadius:2,background:allDone?phaseColor[ph]:anyDone?`${phaseColor[ph]}55`:T.bg3}}/>;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Incident Detail */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card style={{border:`1px solid ${sevColor[inc.sev]}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",gap:8,marginBottom:6}}>
                    <Badge color={sevColor[inc.sev]}>{inc.sev}</Badge>
                    <Badge color={statColor[inc.status]}>{inc.status.toUpperCase()}</Badge>
                    {inc.tags.map(t=><span key={t} style={{fontSize:10,color:T.textDim,background:T.bg3,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}
                  </div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,color:T.textBright,marginBottom:4}}>{inc.title}</div>
                  <div style={{fontSize:13,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.6}}>{inc.description}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0,marginLeft:20}}>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>OWNER</div>
                  <div style={{fontSize:13,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,marginBottom:6}}>{inc.owner}</div>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>OPENED</div>
                  <div style={{fontSize:12,color:T.text,fontFamily:"'JetBrains Mono',monospace"}}>{inc.opened}</div>
                  <div style={{marginTop:8,display:"flex",gap:8}}>
                    <div style={{padding:"4px 10px",background:T.bg2,borderRadius:4,textAlign:"center"}}>
                      <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>TTD</div>
                      <div style={{fontSize:13,fontWeight:700,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>{inc.ttd}</div>
                    </div>
                    <div style={{padding:"4px 10px",background:T.bg2,borderRadius:4,textAlign:"center"}}>
                      <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>TTR</div>
                      <div style={{fontSize:13,fontWeight:700,color:inc.ttr==="—"?T.amber:T.green,fontFamily:"'JetBrains Mono',monospace"}}>{inc.ttr}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Affected assets */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>AFFECTED ASSETS</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {inc.affected.map(a=><div key={a} style={{padding:"4px 10px",background:`${T.red}12`,border:`1px solid ${T.red}33`,borderRadius:4,fontSize:11,color:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{a}</div>)}
                </div>
              </div>

              {/* MITRE */}
              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>MITRE ATT&CK TECHNIQUES</div>
                <div style={{display:"flex",gap:6}}>
                  {inc.mitre.map(m=><span key={m} style={{fontSize:11,color:T.purple,background:`${T.purple}12`,padding:"3px 9px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{m}</span>)}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["Escalate","escalate",T.red],["Contain","contain",T.amber],["Notify CISO","notify",T.purple],["Assign","assign",T.cyan],["Close Incident","close",T.textDim]].map(([l,_a,c])=>(
                  <button key={l} style={{padding:"7px 14px",background:`${c}14`,border:`1px solid ${c}44`,borderRadius:5,color:c,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>{l}</button>
                ))}
              </div>
            </Card>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {/* Response tasks */}
              <Card>
                <SectionHeader label="Response Checklist" accent={T.amber}/>
                {phases.map(phase=>{
                  const phaseTasks = inc.tasks.filter(t=>t.phase===phase);
                  if(!phaseTasks.length) return null;
                  return (
                    <div key={phase} style={{marginBottom:14}}>
                      <div style={{fontSize:11,color:phaseColor[phase],fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:phaseColor[phase]}}/>
                        {phase.toUpperCase()}
                      </div>
                      {phaseTasks.map(task=>{
                        const done = taskDone[task.id] ?? task.done;
                        return (
                          <div key={task.id} onClick={()=>setTaskDone(d=>({...d,[task.id]:!done}))} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:done?`${T.green}08`:T.bg2,borderRadius:5,marginBottom:5,cursor:"pointer",border:`1px solid ${done?T.green+"33":T.border}`,transition:"all .15s"}}>
                            <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${done?T.green:T.border}`,background:done?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",flexShrink:0,transition:"all .15s"}}>
                              {done?"✓":""}
                            </div>
                            <span style={{fontSize:12,color:done?T.textDim:T.text,fontFamily:"'Rajdhani',sans-serif",textDecoration:done?"line-through":"none"}}>{task.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </Card>

              {/* Timeline + Notes */}
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <Card>
                  <SectionHeader label="Incident Timeline" accent={T.cyan}/>
                  <div style={{position:"relative",paddingLeft:16}}>
                    <div style={{position:"absolute",left:5,top:0,bottom:0,width:1.5,background:`linear-gradient(${T.red},${T.border})`}}/>
                    {inc.timeline.map((ev,i)=>(
                      <div key={i} style={{position:"relative",marginBottom:12}}>
                        <div style={{position:"absolute",left:-13,top:5,width:9,height:9,borderRadius:"50%",background:timeColor[ev.type]||T.cyan,border:`2px solid ${T.bg1}`}}/>
                        <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,whiteSpace:"nowrap"}}>{ev.time}</span>
                          <span style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.5}}>{ev.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionHeader label="Investigation Notes" accent={T.purple}/>
                  <div style={{maxHeight:160,overflowY:"auto",marginBottom:10}}>
                    {notes.map((n,i)=>(
                      <div key={i} style={{padding:"8px 10px",background:T.bg2,borderRadius:5,marginBottom:6,borderLeft:`3px solid ${n.author==="System"?T.textDim:T.purple}`}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,color:n.author==="System"?T.textDim:T.cyan}}>{n.author}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{n.time}</span>
                        </div>
                        <div style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.5}}>{n.text}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <input value={newNote} onChange={e=>setNewNote(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNote()} placeholder="Add investigation note…"
                      style={{flex:1,padding:"8px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontSize:13,outline:"none"}}
                      onFocus={e=>e.target.style.borderColor=T.purple} onBlur={e=>e.target.style.borderColor=T.border}/>
                    <button onClick={addNote} style={{padding:"8px 14px",background:`${T.purple}18`,border:`1px solid ${T.purple}44`,borderRadius:5,color:T.purple,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>Add</button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLAYBOOKS */}
      {tab==="playbooks" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {PLAYBOOKS.map(pb=>(
            <Card key={pb.name} style={{cursor:"pointer",transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=T.cyan}
              onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>{pb.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:T.textBright}}>{pb.name}</div>
                    <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{pb.steps} response steps</div>
                  </div>
                </div>
                {pb.applicable.length>0 && <Badge color={T.amber}>Applicable</Badge>}
              </div>
              {pb.applicable.length>0 && (
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>APPLIES TO</div>
                  <div style={{display:"flex",gap:6}}>{pb.applicable.map(a=><Badge key={a} color={T.red}>{a}</Badge>)}</div>
                </div>
              )}
              <button style={{width:"100%",padding:"7px 0",background:`${T.cyan}12`,border:`1px solid ${T.cyan}33`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                {pb.applicable.length>0?"▶ Execute Playbook":"View Playbook"}
              </button>
            </Card>
          ))}
        </div>
      )}

      {/* METRICS */}
      {tab==="metrics" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Incident Trend — Last 30 Days" accent={T.red}/>
            {[{label:"P1 Incidents",  data:[2,1,3,2,1,0,2,1],color:T.red},{label:"P2 Incidents",data:[4,5,3,4,3,2,4,3],color:T.amber},{label:"Resolved",data:[5,5,6,5,4,2,5,3],color:T.green}].map(({label,data,color})=>(
              <div key={label} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{label}</span>
                  <span style={{fontSize:12,color,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{data.reduce((a,b)=>a+b,0)} total</span>
                </div>
                <Sparkline data={data} color={color} height={28}/>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader label="Response Time KPIs" accent={T.green}/>
            {[
              {metric:"Mean Time to Detect (MTTD)",    value:"13 min",  target:"< 15 min", ok:true },
              {metric:"Mean Time to Respond (MTTR)",   value:"94 min",  target:"< 120 min",ok:true },
              {metric:"Mean Time to Contain (MTTC)",   value:"38 min",  target:"< 60 min", ok:true },
              {metric:"Mean Time to Resolve (MTTR)",   value:"3.2 hr",  target:"< 4 hr",   ok:true },
              {metric:"Escalation Rate",               value:"22%",     target:"< 20%",    ok:false},
              {metric:"False Positive Rate",           value:"8%",      target:"< 10%",    ok:true },
              {metric:"Incidents per Week",            value:"4.5",     target:"< 5",      ok:true },
            ].map(kpi=>(
              <div key={kpi.metric} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:13,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{kpi.metric}</div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Target: {kpi.target}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:kpi.ok?T.green:T.red}}>{kpi.value}</span>
                  <span style={{fontSize:14,color:kpi.ok?T.green:T.red}}>{kpi.ok?"✓":"⚠"}</span>
                </div>
              </div>
            ))}
          </Card>
          <Card style={{gridColumn:"1/-1"}}>
            <SectionHeader label="Incident Classification Breakdown" accent={T.purple}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
              {[
                {cat:"Malware",           count:6, color:T.red},
                {cat:"Unauthorized Access",count:4,color:T.amber},
                {cat:"Data Exposure",     count:3, color:T.orange},
                {cat:"Misconfiguration",  count:5, color:T.cyan},
                {cat:"DDoS / DoS",        count:2, color:T.purple},
              ].map(c=>(
                <div key={c.cat} style={{padding:"14px 16px",background:T.bg2,borderRadius:7,border:`1px solid ${c.color}33`,textAlign:"center"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:c.color,marginBottom:4}}>{c.count}</div>
                  <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{c.cat}</div>
                  <div style={{marginTop:8,height:4,background:T.bg3,borderRadius:2}}><div style={{width:`${(c.count/6)*100}%`,height:"100%",background:c.color,borderRadius:2}}/></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// NETWORK TOPOLOGY VIEW
// ═══════════════════════════════════════════════════════════════════════
const NetworkView = () => {
  const [tab, setTab]       = useState("topology");
  const [hovNode, setHovNode] = useState(null);
  const [selNode, setSelNode] = useState(null);
  const [showThreats, setShowThreats] = useState(true);
  const [showTraffic, setShowTraffic] = useState(true);
  const [trafficTick, setTrafficTick] = useState(0);

  useInterval(()=>setTrafficTick(t=>t+1), 1800);

  // Network nodes
  const NODES = [
    // Internet
    {id:"internet",  label:"Internet",        x:50,  y:200, icon:"🌐", color:T.textDim, type:"external", ip:"—",            info:"External traffic ingress"},
    {id:"attacker",  label:"Attacker",         x:50,  y:310, icon:"💀", color:T.red,     type:"threat",   ip:"185.220.101.8", info:"Tor exit node — active threat"},
    // Edge
    {id:"waf",       label:"WAF",              x:170, y:200, icon:"🛡", color:T.green,  type:"security", ip:"10.0.0.1",      info:"AWS WAF v2 — 1,247 rules active"},
    {id:"alb",       label:"ALB",              x:290, y:200, icon:"⚖", color:T.amber,  type:"network",  ip:"10.0.0.2",      info:"Application Load Balancer"},
    {id:"nat",       label:"NAT GW",           x:170, y:310, icon:"◫", color:T.textDim,type:"network",  ip:"10.0.0.3",      info:"NAT Gateway — 3× AZ"},
    // App tier
    {id:"api1",      label:"API Pod 1",        x:420, y:150, icon:"⚡", color:T.cyan,   type:"app",      ip:"10.0.1.10",     info:"FastAPI container — healthy (CPU 12%)"},
    {id:"api2",      label:"API Pod 2",        x:420, y:220, icon:"⚡", color:T.cyan,   type:"app",      ip:"10.0.1.11",     info:"FastAPI container — healthy (CPU 9%)"},
    {id:"api3",      label:"API Pod 3",        x:420, y:290, icon:"⚡", color:T.cyan,   type:"app",      ip:"10.0.1.12",     info:"FastAPI container — healthy (CPU 14%)"},
    {id:"worker",    label:"Worker",           x:420, y:360, icon:"⚙", color:T.orange, type:"app",      ip:"10.0.1.20",     info:"Celery worker — 2 replicas"},
    // Compromised
    {id:"comp45",    label:"10.0.2.45 ⚠",     x:430, y:430, icon:"💻", color:T.red,    type:"compromised",ip:"10.0.2.45",  info:"COMPROMISED — lateral movement source"},
    // Data tier
    {id:"postgres",  label:"PostgreSQL",       x:570, y:180, icon:"🗄", color:T.purple, type:"data",     ip:"10.0.2.10",     info:"RDS PostgreSQL 15.5 — Multi-AZ"},
    {id:"redis",     label:"Redis",            x:570, y:260, icon:"⚡", color:T.amber,  type:"data",     ip:"10.0.2.20",     info:"ElastiCache Redis 7.2 — DEGRADED 1/2"},
    {id:"s3",        label:"S3 Buckets",       x:570, y:340, icon:"🪣", color:T.green,  type:"storage",  ip:"AWS",           info:"2 buckets — encrypted — versioned"},
    // Monitoring
    {id:"prometheus",label:"Prometheus",       x:700, y:150, icon:"◎", color:T.orange, type:"monitor",  ip:"10.0.3.10",     info:"Metrics collection — 2.51.2"},
    {id:"grafana",   label:"Grafana",          x:700, y:230, icon:"▣", color:T.orange, type:"monitor",  ip:"10.0.3.11",     info:"Grafana 11.1.0 — dashboards active"},
    {id:"loki",      label:"Loki",             x:700, y:310, icon:"◧", color:T.textDim,type:"monitor",  ip:"10.0.3.12",     info:"Log aggregation — STOPPED"},
  ];

  const EDGES = [
    {from:"internet", to:"waf",       color:T.textDim, dashed:false, label:"HTTPS"},
    {from:"attacker", to:"waf",       color:T.red,     dashed:true,  label:"BLOCKED"},
    {from:"waf",      to:"alb",       color:T.green,   dashed:false, label:"HTTPS"},
    {from:"alb",      to:"api1",      color:T.cyan,    dashed:false, label:""},
    {from:"alb",      to:"api2",      color:T.cyan,    dashed:false, label:""},
    {from:"alb",      to:"api3",      color:T.cyan,    dashed:false, label:""},
    {from:"api1",     to:"postgres",  color:T.purple,  dashed:false, label:"PG"},
    {from:"api2",     to:"postgres",  color:T.purple,  dashed:false, label:""},
    {from:"api3",     to:"redis",     color:T.amber,   dashed:false, label:"Redis"},
    {from:"worker",   to:"redis",     color:T.amber,   dashed:false, label:"Queue"},
    {from:"worker",   to:"postgres",  color:T.purple,  dashed:false, label:""},
    {from:"api1",     to:"s3",        color:T.green,   dashed:false, label:"S3"},
    {from:"comp45",   to:"postgres",  color:T.red,     dashed:true,  label:"LATERAL"},
    {from:"comp45",   to:"api2",      color:T.red,     dashed:true,  label:"LATERAL"},
    {from:"api1",     to:"prometheus",color:T.orange,  dashed:false, label:"metrics"},
    {from:"api2",     to:"prometheus",color:T.orange,  dashed:false, label:""},
    {from:"postgres", to:"prometheus",color:T.orange,  dashed:false, label:""},
    {from:"prometheus",to:"grafana",  color:T.orange,  dashed:false, label:""},
    {from:"nat",      to:"internet",  color:T.textDim, dashed:false, label:"egress"},
  ];

  const getNode = id => NODES.find(n=>n.id===id);

  // Scale coordinates
  const scaleX = x => x * 1.04;
  const scaleY = y => y * 0.94;

  const _typeColors = { external:T.textDim, threat:T.red, security:T.green, network:T.amber, app:T.cyan, data:T.purple, storage:T.green, monitor:T.orange, compromised:T.red };
  const TABS = ["topology","segments","firewall","traffic"];
  const TL   = { topology:"◫ Topology", segments:"⬡ Segments", firewall:"🛡 Firewall Rules", traffic:"⟁ Traffic Analysis" };

  const FIREWALL_RULES = [
    {id:"FW-001",name:"Block Tor Exit Nodes",  src:"185.220.101.8/32",    dst:"0.0.0.0/0",     port:"*",       action:"DENY",  hits:"847",  active:true },
    {id:"FW-002",name:"Allow HTTPS Inbound",   src:"0.0.0.0/0",           dst:"10.0.0.2/32",   port:"443",     action:"ALLOW", hits:"12.4K",active:true },
    {id:"FW-003",name:"App to DB Only",        src:"10.0.1.0/24",         dst:"10.0.2.10/32",  port:"5432",    action:"ALLOW", hits:"4.2K", active:true },
    {id:"FW-004",name:"Block Public DB",       src:"0.0.0.0/0",           dst:"10.0.2.10/32",  port:"5432",    action:"DENY",  hits:"0",    active:true },
    {id:"FW-005",name:"Redis Internal Only",   src:"10.0.1.0/24",         dst:"10.0.2.20/32",  port:"6379",    action:"ALLOW", hits:"8.1K", active:true },
    {id:"FW-006",name:"Block CN Ranges",       src:"103.0.0.0/8",         dst:"0.0.0.0/0",     port:"*",       action:"DENY",  hits:"31",   active:true },
    {id:"FW-007",name:"Allow Monitoring",      src:"10.0.3.0/24",         dst:"10.0.0.0/16",   port:"9090,3000",action:"ALLOW",hits:"1.1K", active:true },
    {id:"FW-008",name:"Isolate 10.0.2.45",     src:"10.0.2.45/32",        dst:"10.0.0.0/16",   port:"*",       action:"DENY",  hits:"44",   active:false},
  ];

  const SEGMENTS = [
    {name:"Edge (Public)",   cidr:"10.0.0.0/24",  nodes:["waf","alb","nat"],            color:T.amber,  exposure:"internet-facing"},
    {name:"Application",     cidr:"10.0.1.0/24",  nodes:["api1","api2","api3","worker"],color:T.cyan,   exposure:"internal only"},
    {name:"Data",            cidr:"10.0.2.0/24",  nodes:["postgres","redis","comp45"],  color:T.purple, exposure:"restricted"},
    {name:"Monitoring",      cidr:"10.0.3.0/24",  nodes:["prometheus","grafana","loki"],color:T.orange, exposure:"internal only"},
  ];

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="TOTAL NODES"   value={NODES.length}                                  icon="◫" color={T.cyan}/>
        <MetricCard label="ACTIVE EDGES"  value={EDGES.length}                                  icon="⟁" color={T.green}/>
        <MetricCard label="THREATS ACTIVE"value={NODES.filter(n=>n.type==="threat"||n.type==="compromised").length} icon="⚠" color={T.red} delta={1}/>
        <MetricCard label="SEGMENTS"      value={SEGMENTS.length}                               icon="⬡" color={T.amber}/>
        <MetricCard label="FW RULES"      value={FIREWALL_RULES.length}                         icon="🛡" color={T.purple}/>
        <MetricCard label="BLOCKED / HR"  value="878" icon="⊘" color={T.green}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
      </div>

      {/* TOPOLOGY SVG */}
      {tab==="topology" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14,alignItems:"start"}}>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:`1px solid ${T.border}`,background:T.bg0}}>
              <span style={{fontSize:13,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontWeight:700}}>ZolexTech Production — Network Topology</span>
              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <button onClick={()=>setShowThreats(s=>!s)} style={{padding:"4px 10px",background:showThreats?`${T.red}18`:"transparent",border:`1px solid ${showThreats?T.red:T.border}`,borderRadius:4,color:showThreats?T.red:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>Threats</button>
                <button onClick={()=>setShowTraffic(s=>!s)} style={{padding:"4px 10px",background:showTraffic?`${T.cyan}18`:"transparent",border:`1px solid ${showTraffic?T.cyan:T.border}`,borderRadius:4,color:showTraffic?T.cyan:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>Traffic</button>
              </div>
            </div>
            <svg viewBox="0 0 780 510" style={{width:"100%",background:T.bg0,display:"block"}} onClick={()=>setSelNode(null)}>
              {/* Zone backgrounds */}
              <rect x="140" y="8"  width="80"  height="490" rx="6" fill={T.amber+"06"}   stroke={T.amber+"22"}   strokeWidth="1" strokeDasharray="4 3"/>
              <rect x="240" y="8"  width="160" height="490" rx="6" fill={T.cyan+"04"}    stroke={T.cyan+"22"}    strokeWidth="1" strokeDasharray="4 3"/>
              <rect x="390" y="8"  width="165" height="490" rx="6" fill={T.purple+"04"}  stroke={T.purple+"22"}  strokeWidth="1" strokeDasharray="4 3"/>
              <rect x="550" y="8"  width="130" height="490" rx="6" fill={T.orange+"04"}  stroke={T.orange+"22"}  strokeWidth="1" strokeDasharray="4 3"/>
              <rect x="660" y="8"  width="112" height="490" rx="6" fill={T.textDim+"03"} stroke={T.textDim+"18"} strokeWidth="1" strokeDasharray="4 3"/>

              <text x="182" y="24"  textAnchor="middle" fill={T.amber+"88"}  fontSize="8" fontFamily="'JetBrains Mono',monospace">EDGE</text>
              <text x="322" y="24"  textAnchor="middle" fill={T.cyan+"88"}   fontSize="8" fontFamily="'JetBrains Mono',monospace">APP TIER</text>
              <text x="475" y="24"  textAnchor="middle" fill={T.purple+"88"} fontSize="8" fontFamily="'JetBrains Mono',monospace">DATA TIER</text>
              <text x="618" y="24"  textAnchor="middle" fill={T.orange+"88"} fontSize="8" fontFamily="'JetBrains Mono',monospace">MONITORING</text>
              <text x="720" y="24"  textAnchor="middle" fill={T.textDim+"88"}fontSize="8" fontFamily="'JetBrains Mono',monospace">INTERNET</text>

              {/* Edges */}
              {EDGES.map((edge,i)=>{
                const a = getNode(edge.from), b = getNode(edge.to);
                if(!a||!b) return null;
                if(!showThreats && (edge.color===T.red)) return null;
                const ax=scaleX(a.x), ay=scaleY(a.y), bx=scaleX(b.x), by=scaleY(b.y);
                const mx=(ax+bx)/2, my=(ay+by)/2;
                // Animate traffic packet
                const _animOffset = (i * 37 + trafficTick * 12) % 100;
                return (
                  <g key={i}>
                    <line x1={ax} y1={ay} x2={bx} y2={by} stroke={edge.color} strokeWidth={edge.dashed?"1.5":"1.2"} strokeDasharray={edge.dashed?"5 4":"none"} opacity={showTraffic?0.7:0.3}/>
                    {edge.label && <text x={mx} y={my-5} textAnchor="middle" fill={edge.color} fontSize="7" fontFamily="'JetBrains Mono',monospace" opacity="0.7">{edge.label}</text>}
                    {showTraffic && !edge.dashed && (
                      <circle r="3" fill={edge.color} opacity="0.8">
                        <animateMotion dur={`${1.5+i*0.3}s`} repeatCount="indefinite" path={`M ${ax},${ay} L ${bx},${by}`}/>
                      </circle>
                    )}
                    {showThreats && edge.dashed && (
                      <circle r="3" fill={T.red} opacity="0.9">
                        <animateMotion dur="2s" repeatCount="indefinite" path={`M ${ax},${ay} L ${bx},${by}`}/>
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {NODES.map(node=>{
                if(!showThreats && node.type==="threat") return null;
                const nx=scaleX(node.x), ny=scaleY(node.y);
                const isSel = selNode===node.id;
                const isHov = hovNode===node.id;
                const col   = node.color;
                return (
                  <g key={node.id} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();setSelNode(isSel?null:node.id);}}
                    onMouseEnter={()=>setHovNode(node.id)} onMouseLeave={()=>setHovNode(null)}>
                    {(isSel||isHov) && <circle cx={nx} cy={ny} r="22" fill={`${col}10`} stroke={`${col}44`} strokeWidth="1.5"/>}
                    <circle cx={nx} cy={ny} r={isSel?16:14} fill={T.bg2} stroke={col} strokeWidth={isSel?"2.5":"1.5"}/>
                    <text x={nx} y={ny+4} textAnchor="middle" fontSize="12">{node.icon}</text>
                    <text x={nx} y={ny+26} textAnchor="middle" fill={isSel?col:T.textDim} fontSize="8" fontFamily="'JetBrains Mono',monospace">{node.label.split(" ")[0]}</text>
                    {(node.type==="threat"||node.type==="compromised") && (
                      <circle cx={nx+10} cy={ny-10} r="5" fill={T.red} opacity="0.9">
                        <animate attributeName="r" values="5;7;5" dur="1s" repeatCount="indefinite"/>
                      </circle>
                    )}
                    {node.type==="data" && node.id==="redis" && (
                      <circle cx={nx+10} cy={ny-10} r="4" fill={T.amber}/>
                    )}
                  </g>
                );
              })}
            </svg>
          </Card>

          {/* Node detail panel */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {selNode ? (()=>{
              const n = NODES.find(x=>x.id===selNode);
              return (
                <Card style={{border:`1px solid ${n.color}44`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div>
                      <div style={{fontSize:24,marginBottom:6}}>{n.icon}</div>
                      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright}}>{n.label}</div>
                      <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{n.ip}</div>
                    </div>
                    <button onClick={()=>setSelNode(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:16}}>✕</button>
                  </div>
                  <Badge color={n.color}>{n.type.toUpperCase()}</Badge>
                  <div style={{marginTop:10,fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.6}}>{n.info}</div>
                  <div style={{marginTop:12,display:"flex",gap:8}}>
                    <button style={{flex:1,padding:"7px 0",background:`${n.color}12`,border:`1px solid ${n.color}44`,borderRadius:5,color:n.color,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>Inspect</button>
                    {(n.type==="threat"||n.type==="compromised") && <button style={{flex:1,padding:"7px 0",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:5,color:T.red,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>Block</button>}
                  </div>
                </Card>
              );
            })() : (
              <Card>
                <SectionHeader label="Click a node to inspect" accent={T.textDim}/>
                <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.7}}>Select any node on the topology map to view IP address, status, and quick actions.</div>
              </Card>
            )}

            <Card>
              <SectionHeader label="Legend" accent={T.textDim}/>
              {[["App Node",T.cyan],["Data / Storage",T.purple],["Security",T.green],["Monitoring",T.orange],["Threat / Compromised",T.red],["Network",T.amber],["Degraded",T.amber]].map(([l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
                  <span style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{l}</span>
                </div>
              ))}
            </Card>

            <Card>
              <SectionHeader label="Active Threats on Network" accent={T.red}/>
              {NODES.filter(n=>n.type==="threat"||n.type==="compromised").map(n=>(
                <div key={n.id} style={{padding:"8px 10px",background:`${T.red}0a`,border:`1px solid ${T.red}33`,borderRadius:5,marginBottom:6,cursor:"pointer"}} onClick={()=>setSelNode(n.id)}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3}}>
                    <span style={{fontSize:14}}>{n.icon}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.red}}>{n.ip}</span>
                  </div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{n.info}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* SEGMENTS */}
      {tab==="segments" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {SEGMENTS.map(seg=>(
            <Card key={seg.name} style={{border:`1px solid ${seg.color}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,color:T.textBright,marginBottom:4}}>{seg.name}</div>
                  <div style={{display:"flex",gap:8}}>
                    <Badge color={seg.color}>{seg.cidr}</Badge>
                    <Badge color={seg.exposure.includes("internet")?T.amber:T.green}>{seg.exposure}</Badge>
                  </div>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:seg.color}}>{seg.nodes.length} nodes</div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {seg.nodes.map(nid=>{
                  const n = NODES.find(x=>x.id===nid);
                  if(!n) return null;
                  return (
                    <div key={nid} style={{padding:"8px 12px",background:T.bg2,border:`1px solid ${n.type==="compromised"?T.red:T.border}`,borderRadius:6,display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:14}}>{n.icon}</span>
                      <div>
                        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,fontWeight:600,color:n.type==="compromised"?T.red:T.textBright}}>{n.label}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{n.ip}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* FIREWALL RULES */}
      {tab==="firewall" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label={`Firewall & ACL Rules (${FIREWALL_RULES.length})`} accent={T.green}/>
            <button style={{padding:"7px 16px",background:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:5,color:T.green,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add Rule</button>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["Rule ID","Name","Source","Destination","Port(s)","Action","Hits","Active",""].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{FIREWALL_RULES.map((r,_i)=>(
              <tr key={r.id} style={{borderBottom:`1px solid ${T.border}22`}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{r.id}</td>
                <td style={{padding:"10px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,color:T.textBright}}>{r.name}</td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan}}>{r.src}</td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan}}>{r.dst}</td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{r.port}</td>
                <td style={{padding:"10px 12px"}}><Badge color={r.action==="ALLOW"?T.green:T.red}>{r.action}</Badge></td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:r.hits==="0"?T.textDim:T.amber}}>{r.hits}</td>
                <td style={{padding:"10px 12px"}}>
                  <div style={{width:36,height:20,borderRadius:10,background:r.active?`${T.green}33`:T.bg3,border:`1px solid ${r.active?T.green:T.border}`,position:"relative"}}>
                    <div style={{width:14,height:14,borderRadius:"50%",background:r.active?T.green:T.textDim,position:"absolute",top:2,left:r.active?18:2,transition:"left .15s"}}/>
                  </div>
                </td>
                <td style={{padding:"10px 12px"}}>
                  <div style={{display:"flex",gap:5}}>
                    <button style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Edit</button>
                    <button style={{padding:"3px 8px",background:`${T.red}12`,border:`1px solid ${T.red}33`,borderRadius:3,color:T.red,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Del</button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* TRAFFIC ANALYSIS */}
      {tab==="traffic" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Top Traffic Sources — Last Hour" accent={T.cyan}/>
            {[
              {src:"10.0.1.0/24 (App Tier)",  bytes:"4.2 GB", conns:12441, status:"normal"},
              {src:"185.220.101.8 (Tor)",      bytes:"284 MB", conns:847,   status:"blocked"},
              {src:"10.0.3.0/24 (Monitoring)", bytes:"142 MB", conns:3290,  status:"normal"},
              {src:"45.142.212.100 (Scanner)", bytes:"18 MB",  conns:312,   status:"blocked"},
              {src:"194.165.16.78 (RDP BF)",   bytes:"12 MB",  conns:198,   status:"blocked"},
              {src:"10.0.2.45 (Compromised)",  bytes:"8 MB",   conns:44,    status:"quarantine"},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:row.status==="blocked"?T.red:row.status==="quarantine"?T.amber:T.textBright,marginBottom:2}}>{row.src}</div>
                  <div style={{display:"flex",gap:12}}>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{row.bytes}</span>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{row.conns.toLocaleString()} conns</span>
                  </div>
                </div>
                <Badge color={row.status==="normal"?T.green:row.status==="blocked"?T.red:T.amber}>{row.status.toUpperCase()}</Badge>
              </div>
            ))}
          </Card>

          <Card>
            <SectionHeader label="Protocol Breakdown" accent={T.purple}/>
            {[
              {proto:"HTTPS/TLS 1.3", pct:71, bytes:"5.1 GB",  color:T.cyan},
              {proto:"PostgreSQL",    pct:15, bytes:"1.1 GB",  color:T.purple},
              {proto:"Redis RESP",    pct:8,  bytes:"580 MB",  color:T.amber},
              {proto:"gRPC",          pct:3,  bytes:"217 MB",  color:T.green},
              {proto:"Other/Unknown", pct:3,  bytes:"217 MB",  color:T.textDim},
            ].map(p=>(
              <div key={p.proto} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{p.proto}</span>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{p.bytes}</span>
                    <span style={{fontSize:12,color:p.color,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{p.pct}%</span>
                  </div>
                </div>
                <div style={{height:6,background:T.bg3,borderRadius:3}}>
                  <div style={{width:`${p.pct}%`,height:"100%",background:p.color,borderRadius:3,transition:"width .5s"}}/>
                </div>
              </div>
            ))}
          </Card>

          <Card style={{gridColumn:"1/-1"}}>
            <SectionHeader label="Hourly Traffic Volume — Last 24h" accent={T.cyan}/>
            <div style={{position:"relative",height:80}}>
              <svg viewBox="0 0 480 80" preserveAspectRatio="none" style={{width:"100%",height:"100%",position:"absolute",inset:0}}>
                {(() => {
                  const data = Array.from({length:24},(_,i)=> i>=20?rand(800,1200):rand(200,600));
                  const max  = Math.max(...data);
                  const pts  = data.map((v,i)=>`${(i/23)*480},${80-(v/max)*72}`).join(" ");
                  return (<>
                    <polygon points={`0,80 ${pts} 480,80`} fill={`${T.cyan}10`}/>
                    <polyline points={pts} fill="none" stroke={T.cyan} strokeWidth="1.8" strokeLinejoin="round"/>
                    {/* Threat spike marker */}
                    <line x1={scaleX(420)} y1={0} x2={scaleX(420)} y2={80} stroke={T.red} strokeWidth="1" strokeDasharray="3 2" opacity="0.7"/>
                    <text x={scaleX(422)} y={12} fill={T.red} fontSize="8" fontFamily="'JetBrains Mono',monospace">INC-001</text>
                  </>);
                })()}
              </svg>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>00:00</span>
              <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>now</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};


const CommandPalette = ({ onNav, onClose }) => {
  const [q, setQ] = useState("");
  const inputRef  = useRef();
  const [sel, setSel] = useState(0);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const COMMANDS = [
    { label:"Go to Dashboard",        icon:"◈", action:()=>onNav("dashboard"),  group:"Navigate"   },
    { label:"Go to CI/CD Pipelines",  icon:"⌬", action:()=>onNav("cicd"),       group:"Navigate"   },
    { label:"Go to Infrastructure",   icon:"⬡", action:()=>onNav("iac"),        group:"Navigate"   },
    { label:"Go to Security Scanning",icon:"◉", action:()=>onNav("scanning"),   group:"Navigate"   },
    { label:"Go to Vulnerability Mgmt",icon:"◎",action:()=>onNav("vuln"),       group:"Navigate"   },
    { label:"Go to Cloud Posture",    icon:"☁", action:()=>onNav("cloud"),       group:"Navigate"   },
    { label:"Go to SIEM & Logs",      icon:"⟁", action:()=>onNav("siem"),        group:"Navigate"   },
    { label:"Go to Risk Register",    icon:"⬡", action:()=>onNav("risk"),        group:"Navigate"   },
    { label:"Go to Asset Inventory",  icon:"◧", action:()=>onNav("assets"),      group:"Navigate"   },
    { label:"Go to Pen Test",         icon:"⊕", action:()=>onNav("pentest"),     group:"Navigate"   },
    { label:"Go to Audit & Logging",  icon:"◧", action:()=>onNav("audit"),       group:"Navigate"   },
    { label:"Go to Dev Portal",       icon:"⌬", action:()=>onNav("devportal"),   group:"Navigate"   },
    { label:"Go to Compliance",       icon:"❑", action:()=>onNav("compliance"), group:"Navigate"   },
    { label:"Go to Threat Hunting",   icon:"⊕", action:()=>onNav("threat"),     group:"Navigate"   },
    { label:"Go to AI Analyst",       icon:"✦", action:()=>onNav("ai"),         group:"Navigate"   },
    { label:"Go to Live Events",      icon:"⟁", action:()=>onNav("events"),     group:"Navigate"   },
    { label:"Go to Services",         icon:"🐳", action:()=>onNav("docker"),    group:"Navigate"   },
    { label:"Go to Grafana Plugin",   icon:"▣", action:()=>onNav("grafana"),    group:"Navigate"   },
    { label:"Go to Incident Response",icon:"🚨",action:()=>onNav("incident"),   group:"Navigate"   },
    { label:"Go to Network Topology", icon:"◫", action:()=>onNav("network"),    group:"Navigate"   },
    { label:"Go to Reports",          icon:"◧", action:()=>onNav("reports"),    group:"Navigate"   },
    { label:"Go to Team",             icon:"⊞", action:()=>onNav("team"),       group:"Navigate"   },
    { label:"Go to Billing & Plans",  icon:"◎", action:()=>onNav("billing"),    group:"Navigate"   },
    { label:"Go to Settings",         icon:"⚙", action:()=>onNav("settings"),   group:"Navigate"   },
    { label:"Go to My Account",       icon:"⊗", action:()=>onNav("account"),    group:"Navigate"   },
    { label:"Run Terraform Plan",     icon:"⚡", action:()=>{ onNav("iac");    },group:"Actions"    },
    { label:"Trigger CI Pipeline",    icon:"▶", action:()=>{ onNav("cicd");   },group:"Actions"    },
    { label:"Start Security Scan",    icon:"◉", action:()=>{ onNav("scanning");},group:"Actions"   },
    { label:"Run Compliance Audit",   icon:"❑", action:()=>{ onNav("compliance");},group:"Actions" },
    { label:"Open AI Analyst Chat",   icon:"✦", action:()=>{ onNav("ai");     },group:"Actions"    },
    { label:"View Live Event Stream", icon:"⟁", action:()=>{ onNav("events"); },group:"Actions"    },
    { label:"Generate Security Report",icon:"◧",action:()=>{ onNav("reports"); },group:"Actions"   },
    { label:"Block Malicious IP",     icon:"⊘", action:()=>{},                  group:"Security"   },
    { label:"Create Incident Ticket", icon:"⚠", action:()=>{},                  group:"Security"   },
    { label:"Export Compliance Evidence",icon:"↓",action:()=>{ onNav("compliance"); },group:"Security"},
    { label:"Revoke All Sessions",    icon:"⎋", action:()=>{ onNav("settings"); },group:"Security"  },
    { label:"Keyboard Shortcuts",     icon:"⌨", action:()=>{},                  group:"Help"       },
    { label:"Documentation",          icon:"◧", action:()=>{},                  group:"Help"       },
    { label:"Contact Support",        icon:"◎", action:()=>{},                  group:"Help"       },
  ];

  const filtered = COMMANDS.filter(c =>
    !q || c.label.toLowerCase().includes(q.toLowerCase()) || c.group.toLowerCase().includes(q.toLowerCase())
  );

  // Group filtered results
  const groups = [...new Set(filtered.map(c => c.group))];

  useEffect(() => { setSel(0); }, [q]);

  const flatFiltered = filtered;

  const handleKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s + 1, flatFiltered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === "Enter" && flatFiltered[sel]) { flatFiltered[sel].action(); onClose(); }
    if (e.key === "Escape") onClose();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.72)", zIndex:999, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"12vh" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:580, background:T.bg1, borderRadius:12, border:`1px solid ${T.borderHi}`, boxShadow:`0 32px 80px rgba(0,0,0,.8), 0 0 0 1px ${T.cyan}22`, overflow:"hidden" }} className="slideUp">
        {/* Search input */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom:`1px solid ${T.border}` }}>
          <span style={{ fontSize:16, color:T.textDim }}>⌕</span>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={handleKey}
            placeholder="Search commands, pages, actions…"
            style={{ flex:1, background:"transparent", border:"none", outline:"none", color:T.textBright, fontFamily:"'Rajdhani',sans-serif", fontSize:16, fontWeight:500 }}/>
          {q && <button onClick={()=>setQ("")} style={{ background:"none", border:"none", color:T.textDim, cursor:"pointer", fontSize:14 }}>✕</button>}
          <div style={{ padding:"3px 8px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:4, fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>ESC</div>
        </div>

        {/* Results */}
        <div style={{ maxHeight:420, overflowY:"auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding:"32px", textAlign:"center", color:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontSize:14 }}>
              No commands matching &quot;{q}&quot;
            </div>
          ) : (
            groups.map(group => (
              <div key={group}>
                <div style={{ padding:"8px 18px 4px", fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:2 }}>{group.toUpperCase()}</div>
                {filtered.filter(c=>c.group===group).map((cmd, _i) => {
                  const globalIdx = flatFiltered.indexOf(cmd);
                  const isSelected = globalIdx === sel;
                  return (
                    <div key={cmd.label} onClick={()=>{ cmd.action(); onClose(); }}
                      onMouseEnter={()=>setSel(globalIdx)}
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"10px 18px", background:isSelected?`${T.cyan}12`:"transparent", cursor:"pointer", borderLeft:isSelected?`2px solid ${T.cyan}`:"2px solid transparent", transition:"all .08s" }}>
                      <div style={{ width:28, height:28, borderRadius:6, background:isSelected?`${T.cyan}18`:T.bg2, border:`1px solid ${isSelected?T.cyanDim:T.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:isSelected?T.cyan:T.textDim, flexShrink:0 }}>{cmd.icon}</div>
                      <span style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:14, color:isSelected?T.textBright:T.text }}>{cmd.label}</span>
                      {isSelected && <div style={{ marginLeft:"auto", padding:"2px 7px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:4, fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>↵ Enter</div>}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"10px 18px", borderTop:`1px solid ${T.border}`, display:"flex", gap:16, alignItems:"center" }}>
          {[["↑↓","Navigate"],["↵","Select"],["Esc","Close"]].map(([k,l])=>(
            <div key={k} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ padding:"2px 7px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:4, fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{k}</div>
              <span style={{ fontSize:11, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>{l}</span>
            </div>
          ))}
          <span style={{ marginLeft:"auto", fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{filtered.length} results</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICATIONS PANEL
// ═══════════════════════════════════════════════════════════════════════
const NotificationsPanel = ({ onClose, onNav, notifs, setNotifs }) => {
  const [filter, setFilter] = useState("all");

  const typeColor = { critical:T.red, warn:T.amber, info:T.cyan, success:T.green };
  const shown     = filter === "all" ? notifs : notifs.filter(n => !n.read);
  const unread    = notifs.filter(n => !n.read).length;

  const markAllRead  = () => setNotifs(ns => ns.map(n => ({ ...n, read:true })));
  const markOneRead  = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read:true } : n));

  return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, width:400, background:T.bg1, borderLeft:`1px solid ${T.border}`, zIndex:300, display:"flex", flexDirection:"column", boxShadow:"-16px 0 60px rgba(0,0,0,.6)" }} className="slideUp">
      {/* Header */}
      <div style={{ padding:"18px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:17, color:T.textBright }}>Notifications</div>
          <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{unread} unread</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={markAllRead} style={{ padding:"5px 12px", background:"transparent", border:`1px solid ${T.border}`, borderRadius:4, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:10 }}>Mark all read</button>
          <button onClick={onClose} style={{ background:"none", border:"none", color:T.textDim, cursor:"pointer", fontSize:20, padding:"2px 4px" }}>✕</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:"flex", borderBottom:`1px solid ${T.border}` }}>
        {[["all","All"],["unread","Unread"]].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{ flex:1, padding:"10px 0", background:"transparent", borderBottom:filter===k?`2px solid ${T.cyan}`:"2px solid transparent", border:"none", cursor:"pointer", color:filter===k?T.cyan:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>
            {l} {k==="unread" && unread > 0 && <span style={{ background:T.red, color:"#fff", borderRadius:10, fontSize:9, padding:"1px 6px", fontFamily:"'JetBrains Mono',monospace", marginLeft:4 }}>{unread}</span>}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ flex:1, overflowY:"auto" }}>
        {shown.length === 0 ? (
          <div style={{ padding:"48px 24px", textAlign:"center", color:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontSize:14 }}>All caught up! No unread notifications.</div>
        ) : shown.map(n => (
          <div key={n.id} onClick={()=>{ markOneRead(n.id); onNav(n.action); onClose(); }}
            style={{ padding:"14px 18px", borderBottom:`1px solid ${T.border}22`, cursor:"pointer", background:!n.read?`${typeColor[n.type]}05`:"transparent", borderLeft:`3px solid ${n.read?T.border:typeColor[n.type]}`, transition:"background .15s" }}
            onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
            onMouseLeave={e=>e.currentTarget.style.background=!n.read?`${typeColor[n.type]}05`:"transparent"}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ width:34, height:34, borderRadius:8, background:`${typeColor[n.type]}18`, border:`1px solid ${typeColor[n.type]}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:typeColor[n.type], flexShrink:0 }}>{n.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:13, color:n.read?T.text:T.textBright, flex:1, paddingRight:8 }}>{n.title}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    {!n.read && <div style={{ width:7, height:7, borderRadius:"50%", background:typeColor[n.type] }}/>}
                    <span style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>{n.time}</span>
                  </div>
                </div>
                <div style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif", lineHeight:1.55 }}>{n.body}</div>
                <div style={{ marginTop:6 }}><Badge color={typeColor[n.type]}>{n.type.toUpperCase()}</Badge></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding:"14px 18px", borderTop:`1px solid ${T.border}` }}>
        <button onClick={()=>{ onNav("settings"); onClose(); }} style={{ width:"100%", padding:"9px 0", background:"transparent", border:`1px solid ${T.border}`, borderRadius:6, color:T.textDim, cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:13 }}>
          ⚙ Manage Notification Settings
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL SEARCH BAR
// ═══════════════════════════════════════════════════════════════════════
const GlobalSearch = ({ onNav, onClose }) => {
  const [q, setQ]       = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef();
  useEffect(() => { inputRef.current?.focus(); }, []);

  const SEARCH_INDEX = [
    { title:"Security Dashboard",     type:"page",   icon:"◈", nav:"dashboard", tags:"dashboard threats events metrics kpi" },
    { title:"CI/CD Pipelines",        type:"page",   icon:"⌬", nav:"cicd",      tags:"pipeline build deploy test SAST docker" },
    { title:"Infrastructure as Code", type:"page",   icon:"⬡", nav:"iac",       tags:"terraform aws vpc eks rds drift plan apply" },
    { title:"Security Scanning",      type:"page",   icon:"◉", nav:"scanning",  tags:"bandit zap trivy checkov SAST DAST CVE vulnerability" },
    { title:"Vulnerability Management",type:"page",  icon:"◎", nav:"vuln",      tags:"CVE CVSS vulnerability patch SLA remediation exploit risk score" },
    { title:"Cloud Security Posture", type:"page",   icon:"☁", nav:"cloud",     tags:"CSPM AWS S3 IAM EC2 RDS CIS benchmark cloud findings auto-fix FSBP" },
    { title:"SIEM & Log Analysis",    type:"page",   icon:"⟁", nav:"siem",      tags:"SIEM log search SPL KQL alert correlation event stream splunk" },
    { title:"Risk Register",          type:"page",   icon:"⬡", nav:"risk",      tags:"risk register heat matrix treatment plan board reporting residual appetite" },
    { title:"Asset Inventory",        type:"page",   icon:"◧", nav:"assets",    tags:"assets CMDB inventory server container database endpoint SBOM discovery change" },
    { title:"Penetration Testing",    type:"page",   icon:"⊕", nav:"pentest",   tags:"pentest penetration test engagement finding SQLi XSS IDOR CVSS nmap burp sqlmap" },
    { title:"Audit & Logging",        type:"page",   icon:"◧", nav:"audit",     tags:"audit log trail retention integrity chain custody WORM tamper evidence SOC2" },
    { title:"Developer Portal",       type:"page",   icon:"⌬", nav:"devportal", tags:"API REST SDK webhook rate limit endpoint docs Python JavaScript Go curl" },
    { title:"Compliance Reporting",   type:"page",   icon:"❑", nav:"compliance",tags:"SOC2 ISO27001 NIST audit evidence controls" },
    { title:"Threat Hunting",         type:"page",   icon:"⊕", nav:"threat",    tags:"IOC hunt query lateral movement MITRE ATT&CK actor" },
    { title:"Grafana Plugin Studio",  type:"page",   icon:"▣", nav:"grafana",   tags:"grafana plugin panel scaffold dashboard metrics" },
    { title:"Incident Response",      type:"page",   icon:"🚨",nav:"incident",  tags:"incident P1 P2 response playbook NIST contain eradicate" },
    { title:"Network Topology",       type:"page",   icon:"◫", nav:"network",   tags:"network topology firewall rules segments traffic VPC" },
    { title:"AI Security Analyst",    type:"page",   icon:"✦", nav:"ai",        tags:"AI Claude analyst chat code review incident" },
    { title:"Live Event Stream",      type:"page",   icon:"⟁", nav:"events",    tags:"events stream live alerts security log" },
    { title:"Services & Docker",      type:"page",   icon:"🐳",nav:"docker",    tags:"docker compose nginx postgres redis fastapi container" },
    { title:"Reports",                type:"page",   icon:"◧", nav:"reports",   tags:"report generate PDF export executive SOC2" },
    { title:"Team Management",        type:"page",   icon:"⊞", nav:"team",      tags:"team member invite role audit access" },
    { title:"Billing & Plans",        type:"page",   icon:"◎", nav:"billing",   tags:"billing invoice payment plan upgrade stripe" },
    { title:"Settings",               type:"page",   icon:"⚙", nav:"settings",  tags:"settings integrations webhook slack api key" },
    { title:"My Account",             type:"page",   icon:"⊗", nav:"account",   tags:"account profile password 2FA API key session" },
    { title:"CVE-2023-44487 — HTTP/2 Rapid Reset", type:"finding", icon:"◉", nav:"scanning", tags:"CVE nginx critical" },
    { title:"SOC2 CC7.2 — Incident Response",      type:"control", icon:"❑", nav:"compliance",tags:"SOC2 incident response warn" },
    { title:"Redis cache degraded",                type:"alert",   icon:"⚠", nav:"docker",   tags:"redis degraded warn" },
    { title:"Terraform drift detected",            type:"alert",   icon:"⬡", nav:"iac",      tags:"drift terraform S3 SG" },
    { title:"Adebayo Paul Oke",                    type:"user",    icon:"⊗", nav:"account",  tags:"user admin owner profile" },
    { title:"Pipeline zolextech/backend",          type:"pipeline",icon:"⌬", nav:"cicd",     tags:"pipeline backend success main" },
    { title:"IOC 185.220.101.8 — Tor Exit Node",  type:"ioc",     icon:"◎", nav:"threat",   tags:"IOC Tor malicious block" },
  ];

  const typeColor = { page:T.cyan, finding:T.red, control:T.green, alert:T.amber, user:T.purple, pipeline:T.orange, ioc:T.red };

  useEffect(()=>{
    if(!q.trim()){ setResults([]); return; }
    setResults(SEARCH_INDEX.filter(r=>
      r.title.toLowerCase().includes(q.toLowerCase()) ||
      r.tags.toLowerCase().includes(q.toLowerCase())
    ).slice(0,8));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[q]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:998, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"8vh" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ width:540, background:T.bg1, borderRadius:10, border:`1px solid ${T.borderHi}`, boxShadow:`0 24px 60px rgba(0,0,0,.7)`, overflow:"hidden" }} className="slideUp">
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 18px", borderBottom:results.length?`1px solid ${T.border}`:"none" }}>
          <span style={{ fontSize:18, color:T.textDim }}>⌕</span>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Escape") onClose(); if(e.key==="Enter"&&results[0]){onNav(results[0].nav);onClose();} }}
            placeholder="Search anything — pages, findings, alerts, users…"
            style={{ flex:1, background:"transparent", border:"none", outline:"none", color:T.textBright, fontFamily:"'Rajdhani',sans-serif", fontSize:15, fontWeight:500 }}/>
          <div style={{ padding:"2px 7px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:4, fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>ESC</div>
        </div>
        {results.map((r,_i)=>(
          <div key={r.title} onClick={()=>{ onNav(r.nav); onClose(); }}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 18px", borderBottom:`1px solid ${T.border}22`, cursor:"pointer", transition:"background .1s" }}
            onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ width:32, height:32, borderRadius:6, background:`${typeColor[r.type]}14`, border:`1px solid ${typeColor[r.type]}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:typeColor[r.type], flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:14, color:T.textBright }}>{r.title}</div>
            </div>
            <Badge color={typeColor[r.type]}>{r.type}</Badge>
          </div>
        ))}
        {q && results.length===0 && (
          <div style={{ padding:"28px", textAlign:"center", color:T.textDim, fontFamily:"'Rajdhani',sans-serif", fontSize:14 }}>No results for &quot;{q}&quot;</div>
        )}
        {!q && (
          <div style={{ padding:"20px 18px" }}>
            <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginBottom:10, letterSpacing:1 }}>QUICK ACCESS</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {[["Dashboard","dashboard","◈"],["Security Scan","scanning","◉"],["Threat Hunt","threat","⊕"],["Compliance","compliance","❑"],["AI Analyst","ai","✦"],["Live Events","events","⟁"]].map(([l,n,ic])=>(
                <button key={l} onClick={()=>{ onNav(n); onClose(); }} style={{ padding:"6px 12px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:5, color:T.textDim, cursor:"pointer", fontFamily:"'Rajdhani',sans-serif", fontWeight:600, fontSize:12, display:"flex", alignItems:"center", gap:6, transition:"all .12s" }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.cyan; e.currentTarget.style.color=T.cyan; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textDim; }}>
                  <span>{ic}</span>{l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS HELP
// ═══════════════════════════════════════════════════════════════════════
const ShortcutsHelp = ({ onClose }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{ width:520, background:T.bg1, borderRadius:12, border:`1px solid ${T.border}`, boxShadow:`0 24px 60px rgba(0,0,0,.7)`, overflow:"hidden" }} className="slideUp">
      <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:17, color:T.textBright }}>Keyboard Shortcuts</div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:T.textDim, cursor:"pointer", fontSize:18 }}>✕</button>
      </div>
      <div style={{ padding:"18px 22px" }}>
        {[
          {group:"Global", shortcuts:[["⌘K / Ctrl+K","Open Command Palette"],["⌘F / Ctrl+F","Global Search"],["⌘B / Ctrl+B","Toggle Sidebar"],["?","Show this help"]]},
          {group:"Navigation", shortcuts:[["G D","Dashboard"],["G C","CI/CD"],["G I","Infrastructure"],["G S","Security Scan"],["G V","Vuln Mgmt"],["G L","SIEM Logs"],["G T","Threat Hunt"],["G A","AI Analyst"],["G K","Risk Register"],["G N","Network"],["G X","Incidents"],["G P","Pen Test"],["G U","Audit Log"],["G M","Assets"]]},
          {group:"Actions",    shortcuts:[["R P","Run Pipeline"],["R S","Start Security Scan"],["R A","Run Audit"],["N N","View Notifications"]]},
        ].map(section=>(
          <div key={section.group} style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", letterSpacing:1, marginBottom:8 }}>{section.group.toUpperCase()}</div>
            {section.shortcuts.map(([key,label])=>(
              <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:13, color:T.text, fontFamily:"'Rajdhani',sans-serif" }}>{label}</span>
                <div style={{ padding:"3px 10px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:4, fontSize:11, color:T.cyan, fontFamily:"'JetBrains Mono',monospace" }}>{key}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════
// VULNERABILITY MANAGEMENT VIEW
// ═══════════════════════════════════════════════════════════════════════
const VulnView = () => {
  const [tab, setTab]         = useState("dashboard");
  const [selVuln, setSelVuln] = useState(null);
  const [filterSev, setFilterSev] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch]   = useState("");
  const [resolving, setResolving] = useState(null);
  const [assigning, setAssigning] = useState(null);

  const [vulns, setVulns] = useState([
    { id:"VLN-001", cve:"CVE-2023-44487",  cvss:9.8,  sev:"CRITICAL", title:"HTTP/2 Rapid Reset (NGINX)",         asset:"nginx:1.24.0",         assetType:"container", discovered:"Apr 28",  status:"open",        owner:null,          sla:"2d",   exploitable:true,  patchAvail:true,  description:"A flaw in the HTTP/2 protocol allows a remote, unauthenticated attacker to rapidly reset connections using RST_STREAM frames, causing denial of service. Actively exploited in the wild.",  fix:"Upgrade nginx to ≥ 1.25.3 or apply WAF mitigation rule." },
    { id:"VLN-002", cve:"CVE-2024-0232",   cvss:7.8,  sev:"HIGH",     title:"SQLite Use-After-Free (Python)",     asset:"python:3.11.4",        assetType:"runtime",   discovered:"Apr 25",  status:"in_progress", owner:"Emeka",       sla:"7d",   exploitable:false, patchAvail:true,  description:"A use-after-free vulnerability in SQLite bundled with Python 3.11.4. Under specific conditions, local code execution may be possible.",                                                  fix:"Upgrade to Python ≥ 3.11.8 or rebuild container with patched base." },
    { id:"VLN-003", cve:"CVE-2024-1086",   cvss:7.8,  sev:"HIGH",     title:"Linux Kernel netfilter Priv Esc",    asset:"base image",           assetType:"os",        discovered:"Apr 20",  status:"open",        owner:null,          sla:"7d",   exploitable:false, patchAvail:true,  description:"A vulnerability in the Linux kernel netfilter nf_tables subsystem allows local attackers to escalate privileges to root via a use-after-free flaw.",                                     fix:"Update base image to latest Ubuntu/Alpine with kernel patch applied." },
    { id:"VLN-004", cve:"CVE-2023-5363",   cvss:7.5,  sev:"HIGH",     title:"OpenSSL Incorrect Cipher Selection",  asset:"openssl:3.0.10",       assetType:"library",   discovered:"Apr 18",  status:"resolved",    owner:"Adebayo",     sla:"7d",   exploitable:false, patchAvail:true,  description:"An issue in the OpenSSL library causes incorrect cipher selection under certain AES-XTS configurations, potentially weakening encryption.",                                               fix:"Upgrade OpenSSL to ≥ 3.0.12. Applied Apr 22." },
    { id:"VLN-005", cve:"CVE-2024-21626",  cvss:8.6,  sev:"HIGH",     title:"runc Container Escape",               asset:"runc:1.1.11",          assetType:"container", discovered:"Apr 15",  status:"in_progress", owner:"Chidera",     sla:"7d",   exploitable:true,  patchAvail:true,  description:"A vulnerability in runc allows a malicious container process to escape the container and gain host-level access via a file descriptor leak.",                                             fix:"Upgrade runc to ≥ 1.1.12 and rebuild all container images." },
    { id:"VLN-006", cve:"CVE-2024-3094",   cvss:10.0, sev:"CRITICAL", title:"XZ Utils Backdoor (Supply Chain)",    asset:"xz-utils:5.6.0",       assetType:"library",   discovered:"Apr 1",   status:"resolved",    owner:"Adebayo",     sla:"1d",   exploitable:true,  patchAvail:true,  description:"A supply chain attack embedded a backdoor in XZ Utils 5.6.0/5.6.1. The backdoor allows unauthenticated remote code execution via SSH on affected systems.",                             fix:"Downgraded to xz-utils 5.4.6. Verified clean. Resolved Apr 2." },
    { id:"VLN-007", cve:"CWE-89",          cvss:6.5,  sev:"MEDIUM",   title:"SQL Injection in Search Endpoint",   asset:"/api/v1/search",       assetType:"webapp",    discovered:"Apr 12",  status:"open",        owner:null,          sla:"30d",  exploitable:false, patchAvail:false, description:"Unsanitized user input in the 'q' parameter is passed directly to a SQL query. Parameterised queries are not used consistently in the search module.",                                  fix:"Replace string concatenation with parameterised queries (SQLAlchemy bindparams)." },
    { id:"VLN-008", cve:"CVE-2023-45853",  cvss:9.8,  sev:"CRITICAL", title:"zlib Heap Buffer Overflow",           asset:"zlib:1.2.13",          assetType:"library",   discovered:"May 1",   status:"open",        owner:null,          sla:"2d",   exploitable:true,  patchAvail:true,  description:"A heap-based buffer overflow in zlib's inflateGetHeader function allows remote attackers to cause denial of service or potentially execute arbitrary code.",                            fix:"Upgrade zlib to ≥ 1.3.0.1 in all container base images." },
    { id:"VLN-009", cve:"CVE-2023-6129",   cvss:5.9,  sev:"MEDIUM",   title:"OpenSSL POLY1305 State Corruption",  asset:"openssl:3.0.10",       assetType:"library",   discovered:"Apr 8",   status:"open",        owner:null,          sla:"30d",  exploitable:false, patchAvail:true,  description:"The POLY1305 MAC implementation in OpenSSL for PowerPC CPUs corrupts vector registers on return. May cause application crashes.",                                                        fix:"Upgrade OpenSSL to ≥ 3.2.1." },
    { id:"VLN-010", cve:"CVE-2024-22195",  cvss:6.1,  sev:"MEDIUM",   title:"Jinja2 XSS in xmlattr Filter",       asset:"Jinja2:3.1.2",         assetType:"library",   discovered:"Apr 5",   status:"in_progress", owner:"Funke",       sla:"30d",  exploitable:false, patchAvail:true,  description:"The xmlattr filter in Jinja2 does not escape values properly when special characters are used, enabling cross-site scripting attacks in rendered templates.",                           fix:"Upgrade Jinja2 to ≥ 3.1.3." },
    { id:"VLN-011", cve:"CVE-2023-49083",  cvss:5.5,  sev:"MEDIUM",   title:"cryptography DoS via NULL deref",    asset:"cryptography:41.0.5",  assetType:"library",   discovered:"Apr 2",   status:"resolved",    owner:"Adebayo",     sla:"30d",  exploitable:false, patchAvail:true,  description:"A NULL pointer dereference in the Python cryptography library causes DoS when parsing malformed PKCS12 files.",                                                                          fix:"Upgraded to cryptography 42.0.5. Resolved Apr 7." },
    { id:"VLN-012", cve:"B105",            cvss:3.1,  sev:"LOW",      title:"Hardcoded Password (Bandit B105)",    asset:"app/auth.py:42",       assetType:"source",    discovered:"May 3",   status:"open",        owner:null,          sla:"90d",  exploitable:false, patchAvail:false, description:"A hardcoded password string was found in the authentication module. While not directly exploitable if the string is a test credential, it is a security anti-pattern.",                  fix:"Replace with os.environ.get('DB_PASSWORD') and use AWS Secrets Manager." },
  ]);

  const ASSETS = [
    { name:"secureops-api:2.4.1",    type:"Docker Image", vulns:3, critical:1, high:1, medium:1, low:0, risk:88, os:"Python 3.11.4 / NGINX" },
    { name:"secureops-ui:2.4.1",     type:"Docker Image", vulns:2, critical:0, high:1, medium:1, low:0, risk:62, os:"Node 20 / Alpine" },
    { name:"secureops-worker:2.4.1", type:"Docker Image", vulns:4, critical:1, high:2, medium:1, low:0, risk:91, os:"Python 3.11.4" },
    { name:"postgres:15.5-alpine",   type:"Base Image",   vulns:1, critical:0, high:0, medium:1, low:0, risk:34, os:"Alpine 3.18" },
    { name:"nginx:1.24.0",           type:"Base Image",   vulns:1, critical:1, high:0, medium:0, low:0, risk:98, os:"NGINX 1.24.0" },
    { name:"redis:7.2.4-alpine",     type:"Base Image",   vulns:0, critical:0, high:0, medium:0, low:0, risk:5,  os:"Alpine 3.18" },
  ];

  const SLA_DAYS = { CRITICAL:2, HIGH:7, MEDIUM:30, LOW:90 };
  const sevC  = { CRITICAL:T.red, HIGH:T.red, MEDIUM:T.amber, LOW:T.textDim };
  const statC = { open:T.red, in_progress:T.amber, resolved:T.green };
  const cvssC = s => s>=9?"#ff2244":s>=7?"#ff6b35":s>=4?"#ffb300":"#00ff9d";

  const filtered = vulns.filter(v =>
    (filterSev==="ALL" || v.sev===filterSev) &&
    (filterStatus==="ALL" || v.status===filterStatus) &&
    (!search || v.title.toLowerCase().includes(search.toLowerCase()) || v.cve.toLowerCase().includes(search.toLowerCase()) || v.asset.toLowerCase().includes(search.toLowerCase()))
  );

  const open       = vulns.filter(v=>v.status!=="resolved");
  const critical   = open.filter(v=>v.sev==="CRITICAL");
  const riskScore  = Math.min(99, critical.length*22 + open.filter(v=>v.sev==="HIGH").length*7 + open.filter(v=>v.sev==="MEDIUM").length*2);

  const TABS = ["dashboard","findings","assets","remediation"];
  const TL   = { dashboard:"◈ Dashboard", findings:"⚠ Findings", assets:"🐳 Assets", remediation:"✓ Remediation" };

  const CvssGauge = ({ score }) => {
    const pct = score/10; const r=28; const cx=36; const cy=40;
    const xy = deg=>({ x:cx+r*Math.cos(deg*Math.PI/180), y:cy+r*Math.sin(deg*Math.PI/180) });
    const s=xy(-135), e=xy(-135+pct*270), lg=pct>.5?1:0;
    return (
      <svg width="72" height="52" viewBox="0 0 72 52">
        <path d={`M ${s.x} ${s.y} A ${r} ${r} 0 1 1 ${xy(135).x} ${xy(135).y}`} fill="none" stroke={T.bg3} strokeWidth="6" strokeLinecap="round"/>
        <path d={`M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y}`} fill="none" stroke={cvssC(score)} strokeWidth="6" strokeLinecap="round" style={{transition:"all .5s"}}/>
        <text x={cx} y={cy-1} textAnchor="middle" fill={cvssC(score)} fontSize="12" fontFamily="'JetBrains Mono',monospace" fontWeight="700">{score}</text>
      </svg>
    );
  };

  return (
    <div className="fadeIn" style={{position:"relative"}}>
      {/* Detail drawer */}
      {selVuln && (() => {
        const v = vulns.find(x=>x.id===selVuln);
        return (
          <div style={{position:"fixed",top:0,right:0,bottom:0,width:480,background:T.bg1,borderLeft:`1px solid ${T.border}`,zIndex:200,overflowY:"auto",boxShadow:"-12px 0 50px rgba(0,0,0,.6)"}} className="slideUp">
            <div style={{padding:"18px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,marginBottom:4}}>{v.id} · {v.cve}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:17,color:T.textBright,marginBottom:6}}>{v.title}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <Badge color={sevC[v.sev]}>{v.sev}</Badge>
                  <Badge color={statC[v.status]}>{v.status.replace("_"," ").toUpperCase()}</Badge>
                  {v.exploitable && <Badge color={T.red}>EXPLOITABLE</Badge>}
                  {v.patchAvail && <Badge color={T.green}>PATCH AVAILABLE</Badge>}
                </div>
              </div>
              <button onClick={()=>setSelVuln(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:20}}>✕</button>
            </div>
            <div style={{padding:"18px 22px"}}>
              <div style={{display:"flex",gap:14,marginBottom:18}}>
                <div style={{flex:1,padding:"12px",background:T.bg2,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>CVSS SCORE</div>
                  <CvssGauge score={v.cvss}/>
                </div>
                <div style={{flex:1,padding:"12px",background:T.bg2,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>SLA</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:700,color:T.amber}}>{SLA_DAYS[v.sev]}d</div>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>from discovery</div>
                </div>
                <div style={{flex:1,padding:"12px",background:T.bg2,borderRadius:8}}>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>ASSET TYPE</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.cyan}}>{v.assetType}</div>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{v.discovered}</div>
                </div>
              </div>
              {[["Affected Asset",v.asset],["CVE / Rule",v.cve],["Discovered",v.discovered],["Owner",v.owner||"Unassigned"]].map(([k,val])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{k}</span>
                  <span style={{fontSize:12,color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{val}</span>
                </div>
              ))}
              <div style={{margin:"16px 0"}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:8}}>Description</div>
                <div style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.75}}>{v.description}</div>
              </div>
              <div style={{padding:"12px 14px",background:`${T.green}0a`,border:`1px solid ${T.green}33`,borderRadius:6,marginBottom:16}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.green,marginBottom:5}}>✓ Recommended Remediation</div>
                <div style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.65}}>{v.fix}</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button
                  onClick={()=>{
                    if(assigning===v.id||v.owner==="Adebayo"||v.status==="resolved") return;
                    setAssigning(v.id);
                    setTimeout(()=>{
                      setVulns(vs=>vs.map(x=>x.id===v.id?{...x,owner:"Adebayo",status:x.status==="open"?"in_progress":x.status}:x));
                      setAssigning(null);
                    },800);
                  }}
                  disabled={assigning===v.id||v.owner==="Adebayo"||v.status==="resolved"}
                  style={{flex:1,padding:"9px 0",background:assigning===v.id?T.bg3:`${T.amber}14`,border:`1px solid ${T.amber}44`,borderRadius:5,color:assigning===v.id||v.owner==="Adebayo"?T.green:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:assigning===v.id||v.owner==="Adebayo"||v.status==="resolved"?"default":"pointer",minWidth:120}}>
                  {assigning===v.id?"⟳ Assigning…":v.owner==="Adebayo"?"✓ Assigned":"Assign to Me"}
                </button>
                <button
                  onClick={()=>{
                    if(resolving===v.id||v.status==="resolved") return;
                    setResolving(v.id);
                    setTimeout(()=>{
                      setVulns(vs=>vs.map(x=>x.id===v.id?{...x,status:"resolved"}:x));
                      setResolving(null);
                      setSelVuln(null);
                    },900);
                  }}
                  disabled={resolving===v.id||v.status==="resolved"}
                  style={{flex:1,padding:"9px 0",background:resolving===v.id?T.bg3:v.status==="resolved"?`${T.green}22`:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:5,color:resolving===v.id?T.textDim:T.green,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:resolving===v.id||v.status==="resolved"?"default":"pointer",minWidth:120}}>
                  {resolving===v.id?"⟳ Resolving…":v.status==="resolved"?"✓ Already Resolved":"Mark Resolved ✓"}
                </button>
                <button style={{flex:1,padding:"9px 0",background:`${T.purple}14`,border:`1px solid ${T.purple}44`,borderRadius:5,color:T.purple,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",minWidth:120}}>Create Jira Ticket</button>
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="CRITICAL"     value={critical.length}                               icon="◉" color={T.red}    delta={1}/>
        <MetricCard label="HIGH"         value={open.filter(v=>v.sev==="HIGH").length}         icon="▲" color={T.amber}  delta={-1}/>
        <MetricCard label="TOTAL OPEN"   value={open.length}                                   icon="⚠" color={T.amber}/>
        <MetricCard label="RESOLVED"     value={vulns.filter(v=>v.status==="resolved").length} icon="✓" color={T.green}/>
        <MetricCard label="RISK SCORE"   value={riskScore} unit="/100"                         icon="⬡" color={riskScore>70?T.red:T.amber}/>
        <MetricCard label="EXPLOITABLE"  value={vulns.filter(v=>v.exploitable&&v.status!=="resolved").length} icon="⚡" color={T.red}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.amber}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.amber:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            {TL[t]}
            {t==="findings" && open.length>0 && <span style={{background:critical.length?T.red:T.amber,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 6px",fontFamily:"'JetBrains Mono',monospace"}}>{open.length}</span>}
          </button>
        ))}
      </div>

      {tab==="dashboard" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Risk Posture" accent={T.amber}/>
            <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:20}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:48,fontWeight:700,color:riskScore>70?T.red:T.amber,lineHeight:1}}>{riskScore}</div>
                <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>Risk Score / 100</div>
              </div>
              <div style={{flex:1}}>
                {["CRITICAL","HIGH","MEDIUM","LOW"].map(sev=>{
                  const total = vulns.filter(v=>v.sev===sev).length;
                  const op    = vulns.filter(v=>v.sev===sev&&v.status!=="resolved").length;
                  return (
                    <div key={sev} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <Badge color={sevC[sev]}>{sev}</Badge>
                          <span style={{fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{op} open</span>
                        </div>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:sevC[sev]}}>{total}</span>
                      </div>
                      <div style={{height:5,background:T.bg3,borderRadius:3}}>
                        <div style={{width:`${(total/vulns.length)*100}%`,height:"100%",background:sevC[sev],borderRadius:3}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{padding:"12px 14px",background:`${T.red}08`,border:`1px solid ${T.red}33`,borderRadius:6}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.red,marginBottom:4}}>{critical.length} CRITICAL vulnerabilities require immediate action</div>
              <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{vulns.filter(v=>v.exploitable&&v.status!=="resolved").length} are known exploitable in the wild. SLA: patch within 2 days.</div>
            </div>
          </Card>

          <Card>
            <SectionHeader label="SLA Compliance" accent={T.green}/>
            {["CRITICAL","HIGH","MEDIUM","LOW"].map(sev=>{
              const slaDays = SLA_DAYS[sev];
              const onTrack = vulns.filter(v=>v.sev===sev&&v.status==="resolved").length;
              const total   = vulns.filter(v=>v.sev===sev).length;
              const pct     = total ? Math.round((onTrack/total)*100) : 100;
              return (
                <div key={sev} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:12,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{sev}</span>
                      <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>SLA: {slaDays}d</span>
                    </div>
                    <span style={{fontSize:12,color:pct>=80?T.green:T.amber,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{pct}% met</span>
                  </div>
                  <div style={{height:6,background:T.bg3,borderRadius:3}}>
                    <div style={{width:`${pct}%`,height:"100%",background:pct>=80?T.green:T.amber,borderRadius:3,transition:"width .6s"}}/>
                  </div>
                </div>
              );
            })}
            <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {[{l:"Avg CVSS",v:"7.2",c:T.amber},{l:"Patch Avail",v:`${vulns.filter(v=>v.patchAvail).length}/${vulns.length}`,c:T.green},{l:"Exploitable",v:vulns.filter(v=>v.exploitable).length,c:T.red}].map(s=>(
                <div key={s.l} style={{padding:"8px 10px",background:T.bg2,borderRadius:5,textAlign:"center"}}>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{s.l}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:700,color:s.c}}>{s.v}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{gridColumn:"1/-1"}}>
            <SectionHeader label="Top Critical & Exploitable Findings" accent={T.red}/>
            {vulns.filter(v=>v.status!=="resolved"&&(v.sev==="CRITICAL"||v.exploitable)).slice(0,5).map(v=>(
              <div key={v.id} onClick={()=>setSelVuln(v.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 14px",background:T.bg2,borderRadius:6,marginBottom:8,cursor:"pointer",borderLeft:`3px solid ${sevC[v.sev]}`,transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                onMouseLeave={e=>e.currentTarget.style.background=T.bg2}>
                <div style={{width:56}}><CvssGauge score={v.cvss}/></div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:6,marginBottom:4}}>
                    <Badge color={sevC[v.sev]}>{v.sev}</Badge>
                    {v.exploitable && <Badge color={T.red}>EXPLOITABLE</Badge>}
                    {v.patchAvail && <Badge color={T.green}>PATCH AVAIL</Badge>}
                  </div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright}}>{v.title}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,marginTop:2}}>{v.cve} · {v.asset}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <Badge color={statC[v.status]}>{v.status.replace("_"," ").toUpperCase()}</Badge>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>SLA {SLA_DAYS[v.sev]}d · found {v.discovered}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {tab==="findings" && (
        <Card>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <SectionHeader label={`All Vulnerabilities (${filtered.length})`} style={{marginBottom:0}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search CVE, title, asset…"
              style={{padding:"7px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",width:220,marginLeft:"auto"}}
              onFocus={e=>e.target.style.borderColor=T.amber} onBlur={e=>e.target.style.borderColor=T.border}/>
            <div style={{display:"flex",gap:5}}>
              {["ALL","CRITICAL","HIGH","MEDIUM","LOW"].map(f=>(
                <button key={f} onClick={()=>setFilterSev(f)} style={{padding:"5px 10px",background:filterSev===f?(f==="ALL"?T.cyan:sevC[f])+"18":"transparent",border:`1px solid ${filterSev===f?(f==="ALL"?T.cyan:sevC[f]):T.border}`,borderRadius:4,color:filterSev===f?(f==="ALL"?T.cyan:sevC[f]):T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>{f}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:5}}>
              {["ALL","open","in_progress","resolved"].map(f=>(
                <button key={f} onClick={()=>setFilterStatus(f)} style={{padding:"5px 10px",background:filterStatus===f?`${T.cyan}18`:"transparent",border:`1px solid ${filterStatus===f?T.cyan:T.border}`,borderRadius:4,color:filterStatus===f?T.cyan:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>{f}</button>
              ))}
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["ID","CVSS","Severity","Title","Asset","Status","Owner","SLA","Exploit",""].map(h=>(
                <th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{filtered.map(v=>(
              <tr key={v.id} onClick={()=>setSelVuln(v.id)} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer",opacity:v.status==="resolved"?.55:1,transition:"background .12s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{v.id}</td>
                <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:cvssC(v.cvss)}}>{v.cvss}</span></td>
                <td style={{padding:"9px 12px"}}><Badge color={sevC[v.sev]}>{v.sev}</Badge></td>
                <td style={{padding:"9px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.textBright,fontWeight:600,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.title}</td>
                <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.asset}</td>
                <td style={{padding:"9px 12px"}}><Badge color={statC[v.status]}>{v.status.replace("_"," ").toUpperCase()}</Badge></td>
                <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{v.owner||"—"}</td>
                <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.amber}}>{SLA_DAYS[v.sev]}d</td>
                <td style={{padding:"9px 12px",textAlign:"center"}}><span style={{fontSize:14}}>{v.exploitable?"⚡":"—"}</span></td>
                <td style={{padding:"9px 12px",fontSize:11,color:T.textDim}}>→</td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {tab==="assets" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
          {ASSETS.map(a=>(
            <Card key={a.name} style={{border:`1px solid ${a.critical>0?T.red:a.high>0?T.amber:T.border}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.textBright,fontWeight:600,marginBottom:3}}>{a.name}</div>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{a.type} · {a.os}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:a.risk>70?T.red:a.risk>40?T.amber:T.green}}>{a.risk}</div>
                  <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>RISK</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:10}}>
                {[{l:"CRIT",v:a.critical,c:T.red},{l:"HIGH",v:a.high,c:T.amber},{l:"MED",v:a.medium,c:T.textDim},{l:"LOW",v:a.low,c:T.textDim}].map(s=>(
                  <div key={s.l} style={{padding:"6px 8px",background:T.bg2,borderRadius:4,textAlign:"center"}}>
                    <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>{s.l}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:s.v>0?s.c:T.textDim}}>{s.v}</div>
                  </div>
                ))}
              </div>
              <div style={{height:4,background:T.bg3,borderRadius:2}}>
                <div style={{width:`${a.risk}%`,height:"100%",background:a.risk>70?T.red:a.risk>40?T.amber:T.green,borderRadius:2,transition:"width .5s"}}/>
              </div>
              <button style={{marginTop:10,width:"100%",padding:"7px 0",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>View {a.vulns} Findings →</button>
            </Card>
          ))}
        </div>
      )}

      {tab==="remediation" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Remediation Backlog — Priority Order" accent={T.amber}/>
            {vulns.filter(v=>v.status!=="resolved").sort((a,b)=>b.cvss-a.cvss).map((v,i)=>(
              <div key={v.id} onClick={()=>setSelVuln(v.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:T.bg2,borderRadius:6,marginBottom:6,cursor:"pointer",borderLeft:`3px solid ${sevC[v.sev]}`,transition:"background .12s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                onMouseLeave={e=>e.currentTarget.style.background=T.bg2}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,minWidth:20}}>#{i+1}</span>
                <Badge color={sevC[v.sev]}>{v.sev}</Badge>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{v.title}</div>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{v.asset} · CVSS {v.cvss}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {v.patchAvail && <span style={{fontSize:10,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>patch ✓</span>}
                  <Badge color={statC[v.status]}>{v.status.replace("_"," ").toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </Card>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <SectionHeader label="Remediation Velocity" accent={T.green}/>
              {[
                {week:"This week",  fixed:3, opened:2, net:+1},
                {week:"Last week",  fixed:5, opened:4, net:+1},
                {week:"2 weeks ago",fixed:2, opened:3, net:-1},
                {week:"3 weeks ago",fixed:4, opened:2, net:+2},
              ].map(w=>(
                <div key={w.week} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{w.week}</span>
                  <div style={{display:"flex",gap:16,alignItems:"center"}}>
                    <span style={{fontSize:11,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>+{w.fixed} fixed</span>
                    <span style={{fontSize:11,color:T.red,fontFamily:"'JetBrains Mono',monospace"}}>+{w.opened} new</span>
                    <span style={{fontSize:12,fontWeight:700,color:w.net>=0?T.green:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{w.net>0?"+":""}{w.net}</span>
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <SectionHeader label="Quick Wins — Easy Patches" accent={T.cyan}/>
              {vulns.filter(v=>v.patchAvail&&v.status==="open"&&v.sev!=="LOW").slice(0,4).map(v=>(
                <div key={v.id} style={{padding:"10px 12px",background:T.bg2,borderRadius:5,marginBottom:7,border:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:600,color:T.textBright}}>{v.title}</div>
                    <Badge color={sevC[v.sev]}>{v.sev}</Badge>
                  </div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>{v.asset}</div>
                  <div style={{fontSize:12,color:T.green,fontFamily:"'Rajdhani',sans-serif"}}>{v.fix.slice(0,60)}{v.fix.length>60?"…":""}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CLOUD SECURITY POSTURE (CSPM) VIEW
// ═══════════════════════════════════════════════════════════════════════
const CloudView = () => {
  const [tab, setTab]   = useState("overview");
  const [selAccount, setSelAccount] = useState("prod");
  const [remediating, setRemediating] = useState(null);

  const ACCOUNTS = [
    { id:"prod",    name:"zolextech-prod",    id_num:"123456789012", region:"us-east-1", services:42, findings:8,  score:87, status:"ok"   },
    { id:"staging", name:"zolextech-staging", id_num:"234567890123", region:"us-east-1", services:28, findings:14, score:71, status:"warn" },
    { id:"dev",     name:"zolextech-dev",      id_num:"345678901234", region:"us-east-1", services:19, findings:22, score:54, status:"warn" },
  ];

  const FINDINGS = [
    { id:"CSF-001", service:"S3",         rule:"CKV_AWS_20",   sev:"CRITICAL", title:"S3 bucket allows public ACL",               account:"prod",    resource:"s3://zolextech-backups",       status:"open",     fix:"Enable S3 Block Public Access",       autofix:true  },
    { id:"CSF-002", service:"IAM",        rule:"CKV_AWS_40",   sev:"HIGH",     title:"IAM user with AdministratorAccess",         account:"prod",    resource:"iam::user/old-admin",          status:"open",     fix:"Remove or scope down AdministratorAccess",autofix:false },
    { id:"CSF-003", service:"EC2",        rule:"CKV_AWS_8",    sev:"HIGH",     title:"EC2 instance without IMDSv2",               account:"staging", resource:"i-0a3f9b8c7d1e2f456",         status:"open",     fix:"Set IMDSv2 as required for all instances",autofix:true  },
    { id:"CSF-004", service:"RDS",        rule:"CKV_AWS_17",   sev:"HIGH",     title:"RDS instance not encrypted",                account:"dev",     resource:"db-dev-postgres",              status:"open",     fix:"Enable storage encryption (recreate needed)",autofix:false},
    { id:"CSF-005", service:"CloudTrail", rule:"CKV_AWS_67",   sev:"HIGH",     title:"CloudTrail not enabled in all regions",     account:"dev",     resource:"trail/dev-trail",              status:"open",     fix:"Enable CloudTrail in all regions",    autofix:true  },
    { id:"CSF-006", service:"S3",         rule:"CKV_AWS_18",   sev:"MEDIUM",   title:"S3 access logging not enabled",             account:"prod",    resource:"s3://zolextech-app",           status:"open",     fix:"Enable server access logging",        autofix:true  },
    { id:"CSF-007", service:"Lambda",     rule:"CKV_AWS_116",  sev:"MEDIUM",   title:"Lambda missing dead-letter queue",          account:"prod",    resource:"fn:secureops-processor",       status:"in_progress",fix:"Configure SQS DLQ for Lambda",    autofix:false },
    { id:"CSF-008", service:"EKS",        rule:"CKV_AWS_37",   sev:"MEDIUM",   title:"EKS control plane logging not enabled",     account:"staging", resource:"eks/zolextech-staging",        status:"open",     fix:"Enable all control plane log types",  autofix:true  },
    { id:"CSF-009", service:"VPC",        rule:"CKV_AWS_25",   sev:"LOW",      title:"Security group allows all traffic",         account:"dev",     resource:"sg-dev-default",               status:"open",     fix:"Remove 0.0.0.0/0 ingress rule",      autofix:false },
    { id:"CSF-010", service:"KMS",        rule:"CKV_AWS_7",    sev:"MEDIUM",   title:"KMS key rotation not enabled",              account:"staging", resource:"kms/staging-key",              status:"resolved", fix:"Enable annual key rotation",         autofix:true  },
    { id:"CSF-011", service:"CloudWatch", rule:"CKV_AWS_111",  sev:"LOW",      title:"CloudWatch log group not encrypted",        account:"dev",     resource:"logs/application",             status:"open",     fix:"Encrypt CloudWatch logs with KMS",   autofix:true  },
    { id:"CSF-012", service:"S3",         rule:"CKV_AWS_53",   sev:"MEDIUM",   title:"S3 bucket versioning not enabled",          account:"staging", resource:"s3://staging-artifacts",       status:"open",     fix:"Enable versioning on artifact bucket",autofix:true  },
  ];

  const SERVICES_MATRIX = [
    {service:"IAM",         icon:"◈", score:88, findings:2, controls:18, critical:0, high:1},
    {service:"EC2",         icon:"⚡", score:79, findings:3, controls:24, critical:0, high:2},
    {service:"S3",          icon:"🪣", score:72, findings:4, controls:21, critical:1, high:1},
    {service:"RDS",         icon:"🗄", score:91, findings:1, controls:14, critical:0, high:0},
    {service:"VPC/Network", icon:"◫", score:95, findings:1, controls:16, critical:0, high:0},
    {service:"Lambda",      icon:"⚙", score:76, findings:2, controls:11, critical:0, high:0},
    {service:"EKS",         icon:"☸", score:83, findings:1, controls:19, critical:0, high:0},
    {service:"CloudTrail",  icon:"◧", score:68, findings:2, controls:8,  critical:0, high:1},
    {service:"KMS",         icon:"🔑", score:97, findings:0, controls:6,  critical:0, high:0},
    {service:"CloudWatch",  icon:"◎", score:84, findings:1, controls:9,  critical:0, high:0},
  ];

  const BENCHMARKS = [
    {name:"CIS AWS Foundations v3.0",    score:87, controls:58, passing:50, warn:5,  fail:3 },
    {name:"AWS Security Hub FSBP",        score:82, controls:44, passing:36, warn:6,  fail:2 },
    {name:"PCI DSS v4.0 (Cloud)",        score:91, controls:31, passing:28, warn:3,  fail:0 },
    {name:"HIPAA (AWS Config Rules)",    score:78, controls:25, passing:19, warn:4,  fail:2 },
    {name:"SOC 2 (AWS Controls)",        score:94, controls:22, passing:21, warn:1,  fail:0 },
  ];

  const sevC  = {CRITICAL:T.red, HIGH:T.amber, MEDIUM:T.textDim, LOW:T.textDim+"88"};
  const statC = {open:T.red, in_progress:T.amber, resolved:T.green};
  const scoreC= s=>s>=90?T.green:s>=75?T.amber:T.red;

  const acct = ACCOUNTS.find(a=>a.id===selAccount)||ACCOUNTS[0];
  const filteredFindings = FINDINGS.filter(f=>f.account===selAccount||selAccount==="all");

  const autoRemediate = (id) => {
    setRemediating(id);
    setTimeout(()=>setRemediating(null), 2200);
  };

  const TABS = ["overview","findings","services","benchmarks","inventory"];
  const TL   = { overview:"☁ Overview", findings:"⚠ Findings", services:"⚙ Services", benchmarks:"❑ Benchmarks", inventory:"◧ Inventory" };

  return (
    <div className="fadeIn">
      {/* Account selector */}
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        {ACCOUNTS.map(ac=>(
          <div key={ac.id} onClick={()=>setSelAccount(ac.id)} style={{flex:1,minWidth:180,padding:"14px 18px",background:selAccount===ac.id?`${T.cyan}0a`:T.bg1,border:`1.5px solid ${selAccount===ac.id?T.cyan:T.border}`,borderRadius:8,cursor:"pointer",transition:"all .15s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright}}>{ac.name}</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{ac.id_num} · {ac.region}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:scoreC(ac.score)}}>{ac.score}%</div>
                <div style={{fontSize:9,color:T.textDim,letterSpacing:1}}>POSTURE</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{ac.services} services</span>
              <span style={{fontSize:11,color:ac.findings>0?T.amber:T.green,fontFamily:"'JetBrains Mono',monospace"}}>{ac.findings} findings</span>
            </div>
            <div style={{marginTop:8,height:3,background:T.bg3,borderRadius:2}}>
              <div style={{width:`${ac.score}%`,height:"100%",background:scoreC(ac.score),borderRadius:2}}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label={`${acct.name} — Security Posture`} accent={T.cyan}/>
            <div style={{display:"flex",gap:20,marginBottom:18}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:52,fontWeight:700,color:scoreC(acct.score),lineHeight:1}}>{acct.score}</div>
                <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>Posture Score</div>
              </div>
              <div style={{flex:1}}>
                {["CRITICAL","HIGH","MEDIUM","LOW"].map(sev=>{
                  const cnt = filteredFindings.filter(f=>f.sev===sev).length;
                  return (
                    <div key={sev} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <Badge color={sevC[sev]}>{sev}</Badge>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:cnt>0?sevC[sev]:T.textDim}}>{cnt}</span>
                      </div>
                      <div style={{height:4,background:T.bg3,borderRadius:2}}>
                        <div style={{width:cnt>0?`${(cnt/filteredFindings.length)*100}%`:"0%",height:"100%",background:sevC[sev],borderRadius:2}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {[["AWS Account",acct.id_num],["Primary Region",acct.region],["Services Monitored",acct.services],["Last Scanned","2 min ago"],["Auto-remediation","Enabled (10 rules)"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{k}</span>
                <span style={{fontSize:12,color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
              </div>
            ))}
          </Card>

          <Card>
            <SectionHeader label="Service Risk Heatmap" accent={T.amber}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6}}>
              {SERVICES_MATRIX.map(s=>(
                <div key={s.service} onClick={()=>setTab("services")} style={{padding:"10px 8px",background:T.bg2,border:`1px solid ${s.critical>0?T.red:s.high>0?T.amber:s.score<75?T.amber:T.border}22`,borderRadius:6,textAlign:"center",cursor:"pointer",transition:"all .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.bg3}
                  onMouseLeave={e=>e.currentTarget.style.background=T.bg2}>
                  <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:T.textDim,marginBottom:4}}>{s.service}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:scoreC(s.score)}}>{s.score}%</div>
                  {s.findings>0 && <div style={{fontSize:9,color:s.critical>0?T.red:T.amber,fontFamily:"'JetBrains Mono',monospace",marginTop:2}}>{s.findings} issue{s.findings>1?"s":""}</div>}
                </div>
              ))}
            </div>
          </Card>

          <Card style={{gridColumn:"1/-1"}}>
            <SectionHeader label="Critical & Auto-Remediable Findings" accent={T.red}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {filteredFindings.filter(f=>f.status!=="resolved"&&(f.sev==="CRITICAL"||f.sev==="HIGH")).slice(0,6).map(f=>(
                <div key={f.id} style={{padding:"12px 14px",background:T.bg2,borderRadius:6,border:`1px solid ${sevC[f.sev]}22`,borderLeft:`3px solid ${sevC[f.sev]}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{display:"flex",gap:6,marginBottom:4}}>
                        <Badge color={sevC[f.sev]}>{f.sev}</Badge>
                        <Badge color={T.purple}>{f.service}</Badge>
                        {f.autofix && <Badge color={T.green}>AUTO-FIX</Badge>}
                      </div>
                      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.textBright}}>{f.title}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,marginTop:2}}>{f.rule} · {f.resource}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    {f.autofix && (
                      <button onClick={()=>autoRemediate(f.id)} disabled={remediating===f.id} style={{flex:1,padding:"6px 0",background:remediating===f.id?T.bg3:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:4,color:remediating===f.id?T.textDim:T.green,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:11,cursor:remediating===f.id?"default":"pointer"}}>
                        {remediating===f.id?"⟳ Remediating…":"⚡ Auto-Fix"}
                      </button>
                    )}
                    <button style={{flex:1,padding:"6px 0",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer"}}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* FINDINGS */}
      {tab==="findings" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label={`Cloud Security Findings — ${acct.name}`}/>
            <Badge color={T.cyan}>{filteredFindings.length} findings</Badge>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["ID","Service","Severity","Finding","Resource","Status","Auto-Fix",""].map(h=>(
                <th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{filteredFindings.map(f=>(
              <tr key={f.id} style={{borderBottom:`1px solid ${T.border}22`,opacity:f.status==="resolved"?.55:1,transition:"background .12s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{f.id}</td>
                <td style={{padding:"9px 12px"}}><span style={{fontSize:11,color:T.purple,background:`${T.purple}12`,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{f.service}</span></td>
                <td style={{padding:"9px 12px"}}><Badge color={sevC[f.sev]}>{f.sev}</Badge></td>
                <td style={{padding:"9px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.textBright,fontWeight:600,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.title}</td>
                <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.resource}</td>
                <td style={{padding:"9px 12px"}}><Badge color={statC[f.status]}>{f.status.replace("_"," ").toUpperCase()}</Badge></td>
                <td style={{padding:"9px 12px",textAlign:"center"}}><span style={{fontSize:13}}>{f.autofix?"⚡":"—"}</span></td>
                <td style={{padding:"9px 12px"}}>
                  {f.autofix&&f.status==="open" ? (
                    <button onClick={()=>autoRemediate(f.id)} disabled={remediating===f.id} style={{padding:"4px 10px",background:remediating===f.id?T.bg3:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:4,color:remediating===f.id?T.textDim:T.green,cursor:remediating===f.id?"default":"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>
                      {remediating===f.id?"⟳":"Fix"}
                    </button>
                  ) : <button style={{padding:"4px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>View</button>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* SERVICES */}
      {tab==="services" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {SERVICES_MATRIX.map(s=>(
            <Card key={s.service}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>{s.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright}}>{s.service}</div>
                    <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{s.controls} controls · {s.findings} findings</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:scoreC(s.score)}}>{s.score}%</div>
                </div>
              </div>
              <ProgressBar value={s.score} color={scoreC(s.score)}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:10}}>
                {[{l:"Critical",v:s.critical,c:T.red},{l:"High",v:s.high,c:T.amber},{l:"Findings",v:s.findings,c:T.textDim}].map(m=>(
                  <div key={m.l} style={{padding:"7px 10px",background:T.bg2,borderRadius:5,textAlign:"center"}}>
                    <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{m.l.toUpperCase()}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:m.v>0?m.c:T.textDim}}>{m.v}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* BENCHMARKS */}
      {tab==="benchmarks" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {BENCHMARKS.map(bm=>(
            <Card key={bm.name}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright,marginBottom:4}}>{bm.name}</div>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:12,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>✓ {bm.passing} passing</span>
                    {bm.warn>0 && <span style={{fontSize:12,color:T.amber,fontFamily:"'JetBrains Mono',monospace"}}>⚠ {bm.warn} warn</span>}
                    {bm.fail>0 && <span style={{fontSize:12,color:T.red,fontFamily:"'JetBrains Mono',monospace"}}>✗ {bm.fail} fail</span>}
                    <span style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{bm.controls} total</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:28,fontWeight:700,color:scoreC(bm.score)}}>{bm.score}%</div>
                  <Badge color={bm.score>=90?T.green:bm.score>=75?T.amber:T.red}>{bm.score>=90?"COMPLIANT":bm.score>=75?"IN PROGRESS":"NON-COMPLIANT"}</Badge>
                </div>
              </div>
              <div style={{height:8,background:T.bg3,borderRadius:4,overflow:"hidden",display:"flex"}}>
                <div style={{width:`${(bm.passing/bm.controls)*100}%`,height:"100%",background:T.green}}/>
                <div style={{width:`${(bm.warn/bm.controls)*100}%`,height:"100%",background:T.amber}}/>
                <div style={{width:`${(bm.fail/bm.controls)*100}%`,height:"100%",background:T.red}}/>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* INVENTORY */}
      {tab==="inventory" && (
        <Card>
          <SectionHeader label="Cloud Resource Inventory" accent={T.cyan}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
            {[
              {label:"EC2 Instances",     count:6,  icon:"⚡", color:T.cyan},
              {label:"RDS Databases",     count:3,  icon:"🗄", color:T.purple},
              {label:"S3 Buckets",        count:8,  icon:"🪣", color:T.green},
              {label:"Lambda Functions",  count:12, icon:"⚙", color:T.orange},
              {label:"EKS Clusters",      count:2,  icon:"☸", color:T.cyan},
              {label:"CloudFront Distros",count:3,  icon:"🌐", color:T.textDim},
              {label:"VPCs",              count:3,  icon:"◫", color:T.amber},
              {label:"IAM Users",         count:24, icon:"◈", color:T.red},
              {label:"IAM Roles",         count:38, icon:"◈", color:T.amber},
              {label:"Security Groups",   count:16, icon:"🛡", color:T.green},
              {label:"KMS Keys",          count:5,  icon:"🔑", color:T.gold},
              {label:"CloudWatch Alarms", count:22, icon:"🔔", color:T.purple},
            ].map(r=>(
              <div key={r.label} style={{padding:"12px 14px",background:T.bg2,borderRadius:7,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{r.icon}</span>
                <div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:700,color:r.color}}>{r.count}</div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{r.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{padding:"12px 16px",background:`${T.cyan}08`,border:`1px solid ${T.cyan}22`,borderRadius:7,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:2}}>Total tracked resources across 3 AWS accounts</div>
              <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>Last full inventory scan: 2 minutes ago · Next: 6 hours</div>
            </div>
            <button style={{padding:"8px 18px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:6,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>↺ Rescan Now</button>
          </div>
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SIEM & LOG ANALYSIS VIEW
// ═══════════════════════════════════════════════════════════════════════
const SIEMView = () => {
  const [tab, setTab]         = useState("explorer");
  const [query, setQuery]     = useState('source="nginx-access" status>=400 | stats count by src_ip | sort -count | head 20');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [paused, setPaused]   = useState(false);
  const [logStream, setLogStream] = useState([]);
  const [filter, setFilter]   = useState({ source:"ALL", level:"ALL", search:"" });
  const logRef = useRef();
  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [logStream]);

  const LOG_SOURCES = ["nginx-access","fastapi","postgres","redis","sysmon","cloudtrail","vpc-flow","waf","kernel","auth"];
  const LOG_LEVELS  = ["CRITICAL","ERROR","WARN","INFO","DEBUG"];
  const levelC      = { CRITICAL:T.red, ERROR:T.red, WARN:T.amber, INFO:T.cyan, DEBUG:T.textDim };

  const SAMPLE_LOGS = [
    {ts:"09:42:11.001",src:"nginx-access", lvl:"WARN",    msg:'185.220.101.8 - "POST /api/v1/auth/login" 429 0 rt=0.001'},
    {ts:"09:42:11.334",src:"fastapi",      lvl:"WARNING", msg:"Rate limit exceeded: 185.220.101.8 — 30/min threshold breached"},
    {ts:"09:42:12.102",src:"waf",          lvl:"CRITICAL",msg:"WAF BLOCK: Rule WZone-XSS detected from 185.220.101.8 — request dropped"},
    {ts:"09:42:12.445",src:"sysmon",       lvl:"WARN",    msg:"EID1: ProcessCreate — powershell.exe -enc JAB... on host 10.0.2.45"},
    {ts:"09:42:13.001",src:"fastapi",      lvl:"INFO",    msg:"JWT issued: adebayo@zolextech.com sub=user_42 exp=86400s"},
    {ts:"09:42:13.551",src:"cloudtrail",   lvl:"WARN",    msg:"IAM: PutBucketAcl — s3://zolextech-prod — PublicRead by arn:user/dev"},
    {ts:"09:42:14.003",src:"postgres",     lvl:"ERROR",   msg:"FATAL: connection pool exhausted 10/10 — waiting for available slot"},
    {ts:"09:42:14.441",src:"vpc-flow",     lvl:"WARN",    msg:"REJECT 185.220.101.8:52341->10.0.2.45:22 proto=TCP bytes=0"},
    {ts:"09:42:15.002",src:"auth",         lvl:"CRITICAL",msg:"5 failed login attempts: user adebayo_dev from 45.142.212.100 — LOCKED"},
    {ts:"09:42:15.334",src:"kernel",       lvl:"WARN",    msg:"nf_tables: possible use-after-free detected in nf_tables_newrule"},
    {ts:"09:42:15.891",src:"fastapi",      lvl:"INFO",    msg:"GET /api/v1/dashboard 200 — user: adebayo@zolextech.com — 14ms"},
    {ts:"09:42:16.004",src:"cloudtrail",   lvl:"INFO",    msg:"AssumeRole: zolextech-eks-node-role in us-east-1 by ec2.amazonaws.com"},
    {ts:"09:42:16.445",src:"nginx-access", lvl:"ERROR",   msg:'45.142.212.100 - "GET /../etc/passwd HTTP/1.1" 400 0 rt=0.000'},
    {ts:"09:42:17.002",src:"postgres",     lvl:"WARN",    msg:"slow query 1842ms: SELECT * FROM pipeline_runs WHERE user_id=42 LIMIT 1000"},
    {ts:"09:42:17.334",src:"redis",        lvl:"WARN",    msg:"Memory usage at 84% — maxmemory policy: allkeys-lru eviction triggered"},
    {ts:"09:42:18.001",src:"sysmon",       lvl:"WARN",    msg:"EID3: NetworkConnect — 10.0.2.45:53412->103.89.21.14:443 — proc: python.exe"},
    {ts:"09:42:18.441",src:"waf",          lvl:"INFO",    msg:"WAF ALLOW: rule pass — 10.0.1.10:POST:/api/v1/scan — bytes=1024"},
    {ts:"09:42:19.003",src:"vpc-flow",     lvl:"INFO",    msg:"ACCEPT 10.0.1.11:47812->10.0.2.10:5432 proto=TCP bytes=4096"},
    {ts:"09:42:19.334",src:"cloudtrail",   lvl:"ERROR",   msg:"AccessDenied: iam:DeleteRole denied for arn:user/dev — missing permission"},
    {ts:"09:42:20.001",src:"fastapi",      lvl:"INFO",    msg:"Compliance scan completed: SOC2 94.2% — 11/11 controls evaluated"},
  ];

  const QUERY_RESULTS = [
    { src_ip:"185.220.101.8",  count:847, last:"09:42:11", geo:"🇳🇱", status:"429,400,403" },
    { src_ip:"45.142.212.100", count:312, last:"09:42:16", geo:"🇷🇺", status:"400,403"     },
    { src_ip:"103.89.21.14",   count:31,  last:"09:42:18", geo:"🇨🇳", status:"200,443"     },
    { src_ip:"10.0.1.10",      count:4284,last:"09:42:18", geo:"🏠",  status:"200"         },
    { src_ip:"10.0.2.45",      count:44,  last:"09:42:17", geo:"⚠",  status:"various"     },
  ];

  const SAVED_SEARCHES = [
    { name:"Failed Auth Attempts",      query:'source="auth" lvl=ERROR | stats count by src_ip',    saved:"2h ago", schedule:"hourly" },
    { name:"High-Rate 4xx Errors",      query:'source="nginx-access" status>=400 | timechart count',saved:"1d ago", schedule:"daily"  },
    { name:"Lateral Movement Indicator",query:'source="sysmon" EID=3 | filter dst_port IN(22,445)', saved:"3d ago", schedule:"5min"   },
    { name:"CloudTrail IAM Changes",    query:'source="cloudtrail" eventName=Put*|Delete* | alert',  saved:"1w ago", schedule:"15min"  },
    { name:"Slow DB Queries",           query:'source="postgres" lvl=WARN | regex "slow query.*ms"', saved:"2d ago", schedule:"30min"  },
  ];

  const ALERTS = [
    { id:"ALR-001", name:"Brute Force Detection",      severity:"critical",triggered:"09:42:15",count:5,   status:"firing"  },
    { id:"ALR-002", name:"WAF CRITICAL Block Spike",   severity:"high",    triggered:"09:42:12",count:12,  status:"firing"  },
    { id:"ALR-003", name:"Lateral Movement (Sysmon)",  severity:"critical",triggered:"09:42:18",count:2,   status:"firing"  },
    { id:"ALR-004", name:"DB Connection Pool Exhausted",severity:"high",   triggered:"09:42:14",count:1,   status:"resolved"},
    { id:"ALR-005", name:"High Memory Usage (Redis)",  severity:"medium",  triggered:"09:42:17",count:3,   status:"firing"  },
    { id:"ALR-006", name:"Slow Query Threshold",       severity:"low",     triggered:"09:42:17",count:8,   status:"resolved"},
  ];

  const sevC = { critical:T.red, high:T.amber, medium:T.cyan, low:T.textDim };

  useInterval(()=>{
    if(paused) return;
    const l = SAMPLE_LOGS[Math.floor(Math.random()*SAMPLE_LOGS.length)];
    const newTs = new Date().toISOString().slice(11,23);
    setLogStream(s=>[...s.slice(-199), { ...l, ts:newTs, id:Date.now() }]);
  }, 900);

  const visibleLogs = logStream.filter(l=>
    (filter.source==="ALL" || l.src===filter.source) &&
    (filter.level==="ALL"  || l.lvl===filter.level)  &&
    (!filter.search || l.msg.toLowerCase().includes(filter.search.toLowerCase()) || l.src.includes(filter.search))
  );

  const runQuery = () => {
    if(running) return;
    setRunning(true); setResults(null);
    setTimeout(()=>{ setRunning(false); setResults(QUERY_RESULTS); }, 1600);
  };

  const TABS = ["explorer","stream","alerts","correlations"];
  const TL   = { explorer:"⌕ Log Search", stream:"⟁ Live Stream", alerts:"⚠ Alert Rules", correlations:"◈ Correlations" };

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="EVENTS / MIN" value={logStream.length>0?rand(420,680):0} icon="⟁" color={T.cyan}/>
        <MetricCard label="FIRING ALERTS" value={ALERTS.filter(a=>a.status==="firing").length} icon="⚠" color={T.red} delta={2}/>
        <MetricCard label="LOG SOURCES"   value={LOG_SOURCES.length} icon="◧" color={T.purple}/>
        <MetricCard label="RETENTION"     value="90" unit="d" icon="⬡" color={T.amber}/>
        <MetricCard label="INDEXED TODAY" value="14.2" unit="GB" icon="◎" color={T.green}/>
        <MetricCard label="PARSE ERRORS"  value={3} icon="✗" color={T.textDim}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
            {TL[t]}
            {t==="alerts" && ALERTS.filter(a=>a.status==="firing").length>0 && <span style={{background:T.red,color:"#fff",borderRadius:10,fontSize:9,padding:"1px 6px",fontFamily:"'JetBrains Mono',monospace"}}>{ALERTS.filter(a=>a.status==="firing").length}</span>}
          </button>
        ))}
      </div>

      {/* LOG SEARCH */}
      {tab==="explorer" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <SectionHeader label="Log Explorer — SPL / KQL Query" accent={T.cyan}/>
                <div style={{display:"flex",gap:8}}>
                  {["Last 15m","Last 1h","Last 24h","Custom"].map(t=>(
                    <button key={t} onClick={()=>{}} style={{padding:"4px 10px",background:t==="Last 1h"?`${T.cyan}18`:"transparent",border:`1px solid ${t==="Last 1h"?T.cyan:T.border}`,borderRadius:4,color:t==="Last 1h"?T.cyan:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{position:"relative",marginBottom:12}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,color:T.textDim}}>⌕</span>
                <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runQuery()}
                  style={{width:"100%",padding:"12px 14px 12px 40px",background:T.bg0,border:`1px solid ${T.border}`,borderRadius:6,color:T.green,fontFamily:"'JetBrains Mono',monospace",fontSize:12,outline:"none",transition:"border-color .15s"}}
                  onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={runQuery} disabled={running} style={{padding:"9px 22px",background:running?T.bg3:`${T.cyan}18`,border:`1px solid ${T.cyan}`,borderRadius:5,color:running?T.textDim:T.cyan,cursor:running?"default":"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
                  {running?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span>Searching…</>:"⌕ Search"}
                </button>
                <button style={{padding:"9px 14px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>Save Search</button>
                <button style={{padding:"9px 14px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,cursor:"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>↓ Export</button>
              </div>
            </Card>

            {results && (
              <Card>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:12,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>✓ {results.length} rows · 0.28s · 2.4M events scanned</div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{padding:"4px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>↓ CSV</button>
                    <button style={{padding:"4px 10px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer"}}>📊 Visualize</button>
                  </div>
                </div>
                {/* Mini bar viz */}
                <div style={{display:"flex",alignItems:"flex-end",gap:4,height:40,marginBottom:14}}>
                  {results.map((r,i)=>(
                    <div key={i} style={{flex:1,background:`${T.cyan}bb`,borderRadius:"3px 3px 0 0",height:`${Math.min((r.count/results[0].count)*100,100)}%`,minHeight:3,transition:"height .4s"}} title={`${r.src_ip}: ${r.count}`}/>
                  ))}
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>
                  <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                    {["SRC_IP","COUNT","LAST_SEEN","GEO","STATUS_CODES",""].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",color:T.textDim,fontWeight:400,fontSize:10,letterSpacing:1}}>{h}</th>)}
                  </tr></thead>
                  <tbody>{results.map((r,i)=>(
                    <tr key={i} style={{borderBottom:`1px solid ${T.border}22`}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"8px 10px",color:T.red,fontWeight:700}}>{r.src_ip}</td>
                      <td style={{padding:"8px 10px",color:T.amber,fontWeight:700}}>{r.count.toLocaleString()}</td>
                      <td style={{padding:"8px 10px",color:T.textDim}}>{r.last}</td>
                      <td style={{padding:"8px 10px"}}>{r.geo}</td>
                      <td style={{padding:"8px 10px",color:T.cyan}}>{r.status}</td>
                      <td style={{padding:"8px 10px"}}>
                        <div style={{display:"flex",gap:5}}>
                          <button style={{padding:"3px 8px",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:3,color:T.red,cursor:"pointer",fontSize:9}}>Block</button>
                          <button style={{padding:"3px 8px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:3,color:T.textDim,cursor:"pointer",fontSize:9}}>Hunt</button>
                        </div>
                      </td>
                    </tr>
                  ))}</tbody>
                </table>
              </Card>
            )}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Card>
              <SectionHeader label="Saved Searches" accent={T.purple}/>
              {SAVED_SEARCHES.map((s,i)=>(
                <div key={i} onClick={()=>setQuery(s.query)} style={{padding:"9px 11px",background:T.bg2,borderRadius:5,marginBottom:7,cursor:"pointer",border:`1px solid ${T.border}`,transition:"border-color .12s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=T.cyan}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright,marginBottom:3}}>{s.name}</div>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{s.schedule}</span>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{s.saved}</span>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader label="Field Breakdown" accent={T.amber}/>
              <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:8}}>source (top 5)</div>
              {["nginx-access","fastapi","cloudtrail","sysmon","vpc-flow"].map((src,i)=>{
                const pct=[32,24,18,14,12][i];
                return (
                  <div key={src} style={{marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{src}</span>
                      <span style={{fontSize:11,color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{pct}%</span>
                    </div>
                    <div style={{height:4,background:T.bg3,borderRadius:2}}><div style={{width:`${pct}%`,height:"100%",background:T.cyan,borderRadius:2}}/></div>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      )}

      {/* LIVE LOG STREAM */}
      {tab==="stream" && (
        <div>
          <Card style={{marginBottom:12}}>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <input value={filter.search} onChange={e=>setFilter(f=>({...f,search:e.target.value}))} placeholder="Filter logs…"
                style={{padding:"7px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",width:200}}
                onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border}/>
              <select value={filter.source} onChange={e=>setFilter(f=>({...f,source:e.target.value}))}
                style={{padding:"7px 10px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",cursor:"pointer"}}>
                <option value="ALL">All Sources</option>
                {LOG_SOURCES.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <select value={filter.level} onChange={e=>setFilter(f=>({...f,level:e.target.value}))}
                style={{padding:"7px 10px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",cursor:"pointer"}}>
                <option value="ALL">All Levels</option>
                {LOG_LEVELS.map(l=><option key={l} value={l}>{l}</option>)}
              </select>
              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <button onClick={()=>setPaused(p=>!p)} style={{padding:"6px 14px",background:paused?`${T.green}18`:`${T.amber}18`,border:`1px solid ${paused?T.green:T.amber}`,borderRadius:5,color:paused?T.green:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                  {paused?"▶ RESUME":"⏸ PAUSE"}
                </button>
                <button onClick={()=>setLogStream([])} style={{padding:"6px 12px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>⎋ Clear</button>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                {!paused && <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 1s infinite"}}/>}
                <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{paused?"PAUSED":"STREAMING"} · {visibleLogs.length} events</span>
              </div>
            </div>
          </Card>
          <div ref={logRef} style={{background:T.bg0,borderRadius:8,border:`1px solid ${T.border}`,padding:"10px 0",height:500,overflowY:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>
            {visibleLogs.length===0 && <div style={{padding:"20px 16px",color:T.textDim}}>▸ Waiting for log events…</div>}
            {visibleLogs.slice(-150).map((l,i)=>(
              <div key={l.id||i} style={{display:"flex",gap:0,padding:"2px 0",borderBottom:`1px solid ${T.border}11`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2+"88"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <span style={{color:T.textDim,minWidth:100,padding:"0 12px",flexShrink:0}}>{l.ts}</span>
                <span style={{color:T.purple,minWidth:90,flexShrink:0}}>[{l.src}]</span>
                <span style={{color:levelC[l.lvl]||T.textDim,minWidth:72,fontWeight:700,flexShrink:0}}>[{l.lvl}]</span>
                <span style={{color:l.lvl==="CRITICAL"||l.lvl==="ERROR"?T.red:l.lvl==="WARN"||l.lvl==="WARNING"?T.amber:T.text,flex:1,paddingRight:12,wordBreak:"break-all"}}>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALERT RULES */}
      {tab==="alerts" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <SectionHeader label="Active Alert Rules" accent={T.red}/>
              <button style={{padding:"7px 14px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ New Alert</button>
            </div>
            {ALERTS.map(alert=>(
              <div key={alert.id} style={{padding:"12px 14px",background:T.bg2,borderRadius:6,marginBottom:9,border:`1px solid ${sevC[alert.severity]}22`,borderLeft:`3px solid ${alert.status==="firing"?sevC[alert.severity]:T.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:3}}>{alert.name}</div>
                    <div style={{display:"flex",gap:8}}>
                      <Badge color={sevC[alert.severity]}>{alert.severity.toUpperCase()}</Badge>
                      <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>triggered {alert.triggered}</span>
                      <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{alert.count}× today</span>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {alert.status==="firing" && <div style={{width:8,height:8,borderRadius:"50%",background:T.red,animation:"pulse 1s infinite"}}/>}
                    <Badge color={alert.status==="firing"?T.red:T.green}>{alert.status.toUpperCase()}</Badge>
                  </div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <button style={{padding:"5px 12px",background:`${T.amber}12`,border:`1px solid ${T.amber}44`,borderRadius:4,color:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer"}}>Acknowledge</button>
                  <button style={{padding:"5px 12px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:4,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer"}}>Edit Rule</button>
                  <button style={{padding:"5px 12px",background:`${T.red}10`,border:`1px solid ${T.red}33`,borderRadius:4,color:T.red,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:11,cursor:"pointer"}}>Suppress</button>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader label="Alert Analytics — Last 7 Days" accent={T.amber}/>
            {[
              {day:"Mon",critical:2,high:5,medium:8},
              {day:"Tue",critical:1,high:3,medium:6},
              {day:"Wed",critical:4,high:7,medium:11},
              {day:"Thu",critical:2,high:4,medium:7},
              {day:"Fri",critical:3,high:6,medium:9},
              {day:"Sat",critical:1,high:2,medium:4},
              {day:"Sun",critical:3,high:5,medium:8},
            ].map(d=>(
              <div key={d.day} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,minWidth:28}}>{d.day}</span>
                <div style={{flex:1,display:"flex",gap:2,height:16}}>
                  <div style={{width:`${d.critical*8}%`,background:T.red,borderRadius:"3px 0 0 3px",minWidth:4}} title={`${d.critical} critical`}/>
                  <div style={{width:`${d.high*5}%`,background:T.amber,minWidth:4}} title={`${d.high} high`}/>
                  <div style={{width:`${d.medium*3}%`,background:T.textDim,borderRadius:"0 3px 3px 0",minWidth:4}} title={`${d.medium} medium`}/>
                </div>
                <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",minWidth:24}}>{d.critical+d.high+d.medium}</span>
              </div>
            ))}
            <div style={{display:"flex",gap:14,marginTop:10}}>
              {[["Critical",T.red],["High",T.amber],["Medium",T.textDim]].map(([l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                  <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{l}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CORRELATIONS */}
      {tab==="correlations" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Event Correlation Rules" accent={T.purple}/>
            {[
              {name:"Credential Stuffing Attack",   rules:["auth:5 failures","same IP 60s"],    sev:"critical",hits:3, desc:"5+ auth failures from same IP within 60 seconds."},
              {name:"Lateral Movement Chain",       rules:["SMB+SSH","internal IPs"],           sev:"critical",hits:1, desc:"Outbound SMB/SSH from internal host to internal host."},
              {name:"Data Exfiltration Pattern",    rules:["large upload","non-business hours"], sev:"high",    hits:0, desc:"Upload > 100MB to external IP between 22:00–06:00."},
              {name:"Privilege Escalation Attempt", rules:["sudo failed","kernel warning"],     sev:"high",    hits:2, desc:"Kernel nf_tables warning + sudo failure on same host."},
              {name:"C2 Beacon Detection",          rules:["periodic outbound","known C2 port"],sev:"critical",hits:1, desc:"Regular outbound connection every 30–120s to external IP."},
              {name:"Impossible Travel",            rules:["login geo A","login geo B","<1h"],  sev:"high",    hits:0, desc:"Auth from two geographically impossible locations within 1hr."},
            ].map((rule,i)=>(
              <div key={i} style={{padding:"11px 14px",background:T.bg2,borderRadius:6,marginBottom:8,border:`1px solid ${rule.hits>0?(rule.sev==="critical"?T.red:T.amber):T.border}22`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright}}>{rule.name}</div>
                  <div style={{display:"flex",gap:6}}>
                    {rule.hits>0 && <Badge color={rule.sev==="critical"?T.red:T.amber}>{rule.hits} MATCH{rule.hits>1?"ES":""}</Badge>}
                    <Badge color={rule.sev==="critical"?T.red:T.amber}>{rule.sev.toUpperCase()}</Badge>
                  </div>
                </div>
                <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",marginBottom:6}}>{rule.desc}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {rule.rules.map(r=><span key={r} style={{fontSize:10,color:T.purple,background:`${T.purple}12`,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{r}</span>)}
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader label="Correlated Event Timeline" accent={T.red}/>
            <div style={{fontSize:12,color:T.textDim,marginBottom:14,fontFamily:"'Rajdhani',sans-serif"}}>Showing correlation chain for INC-001 — Active Lateral Movement</div>
            {[
              {t:"09:22:04",e:"VPC Flow: REJECT 185.220.101.8→10.0.2.45:22 (847x)",c:T.textDim,icon:"⊘"},
              {t:"09:35:11",e:"auth: 5 failed SSH logins from 185.220.101.8 — LOCKED",c:T.amber,icon:"⚠"},
              {t:"09:38:42",e:"sysmon EID1: cmd.exe spawned by python.exe on 10.0.2.45",c:T.red,icon:"⚡"},
              {t:"09:40:18",e:"vpc-flow: ACCEPT 10.0.2.45→10.0.3.12:445 (SMB internal)",c:T.red,icon:"🔴"},
              {t:"09:41:02",e:"sysmon EID3: network connect 10.0.2.45→103.89.21.14:443",c:T.red,icon:"🔴"},
              {t:"09:41:58",e:"cloudtrail: GetObject s3://zolextech-prod/configs/secrets.json",c:T.red,icon:"🔴"},
              {t:"09:42:15",e:"CORRELATION FIRED: Lateral Movement Chain — INC-001 created",c:T.purple,icon:"◈"},
            ].map((ev,i)=>(
              <div key={i} style={{display:"flex",gap:12,marginBottom:10}}>
                <span style={{fontSize:14,flexShrink:0,width:20}}>{ev.icon}</span>
                <div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,marginRight:10}}>{ev.t}</span>
                  <span style={{fontSize:12,color:ev.c,fontFamily:"'Rajdhani',sans-serif",fontWeight:ev.c===T.purple?700:400}}>{ev.e}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// RISK REGISTER VIEW
// ═══════════════════════════════════════════════════════════════════════
const RiskView = () => {
  const [tab, setTab]     = useState("register");
  const [selRisk, setSelRisk] = useState(null);
  const [_viewMode, _setViewMode] = useState("table"); // table | matrix

  const RISKS = [
    { id:"RSK-001", category:"Cybersecurity", title:"Ransomware Attack",           likelihood:4, impact:5, inherent:20, residual:12, owner:"Adebayo Paul",   status:"open",     controls:["Endpoint protection","Offline backups","Incident playbook"],    trend:"stable",  appetite:"low",   sla:"2026-Q2" },
    { id:"RSK-002", category:"Cybersecurity", title:"Supply Chain Compromise",     likelihood:3, impact:5, inherent:15, residual:9,  owner:"Chidera Okonkwo",status:"open",     controls:["Dependency scanning","SBOM","Vendor assessment"],               trend:"increasing",appetite:"low",  sla:"2026-Q2" },
    { id:"RSK-003", category:"Cloud",         title:"Misconfigured S3 Public ACL", likelihood:4, impact:4, inherent:16, residual:4,  owner:"Emeka Nwachukwu",status:"mitigated",controls:["AWS Config rules","CSPM scanning","Auto-remediation"],           trend:"decreasing",appetite:"low", sla:"2026-Q1" },
    { id:"RSK-004", category:"Compliance",    title:"SOC2 Audit Failure",          likelihood:2, impact:5, inherent:10, residual:6,  owner:"Adebayo Paul",   status:"open",     controls:["Quarterly evidence","Continuous monitoring","Auditor engagement"],trend:"stable",  appetite:"medium",sla:"2026-Q3" },
    { id:"RSK-005", category:"Availability",  title:"Database Failure (no DR)",    likelihood:2, impact:5, inherent:10, residual:4,  owner:"Emeka Nwachukwu",status:"mitigated",controls:["RDS Multi-AZ","Automated backups","DR test quarterly"],           trend:"stable",  appetite:"low",  sla:"2026-Q2" },
    { id:"RSK-006", category:"Cybersecurity", title:"Credential Compromise",       likelihood:3, impact:4, inherent:12, residual:5,  owner:"Amaka Obi",      status:"open",     controls:["MFA enforced","PAM solution","Credential rotation"],              trend:"stable",  appetite:"low",  sla:"2026-Q2" },
    { id:"RSK-007", category:"Legal",         title:"GDPR Data Breach Penalty",    likelihood:2, impact:5, inherent:10, residual:7,  owner:"Adebayo Paul",   status:"open",     controls:["Data classification","Encryption at rest","Breach notification"], trend:"stable",  appetite:"low",  sla:"2026-Q4" },
    { id:"RSK-008", category:"Operational",   title:"Key Person Dependency",       likelihood:3, impact:3, inherent:9,  residual:6,  owner:"Adebayo Paul",   status:"open",     controls:["Documentation","Cross-training","Succession plan"],               trend:"stable",  appetite:"medium",sla:"2026-Q3" },
    { id:"RSK-009", category:"Cloud",         title:"AWS Region Outage",           likelihood:2, impact:4, inherent:8,  residual:3,  owner:"Emeka Nwachukwu",status:"mitigated",controls:["Multi-region failover","RTO/RPO tested","Chaos engineering"],    trend:"stable",  appetite:"medium",sla:"2026-Q2" },
    { id:"RSK-010", category:"Cybersecurity", title:"Insider Threat",              likelihood:2, impact:4, inherent:8,  residual:5,  owner:"Chidera Okonkwo",status:"open",     controls:["Least privilege","Audit logs","UEBA monitoring"],                 trend:"stable",  appetite:"low",  sla:"2026-Q3" },
    { id:"RSK-011", category:"Compliance",    title:"Data Residency Violation",    likelihood:2, impact:3, inherent:6,  residual:2,  owner:"Adebayo Paul",   status:"mitigated",controls:["AWS region lock","Data classification","Legal review"],          trend:"decreasing",appetite:"low", sla:"2026-Q1" },
    { id:"RSK-012", category:"Operational",   title:"Third-party API Outage",      likelihood:4, impact:2, inherent:8,  residual:5,  owner:"Funke Adeyemi",  status:"open",     controls:["Circuit breaker","Fallback logic","SLA monitoring"],              trend:"stable",  appetite:"medium",sla:"2026-Q3" },
  ];

  const riskC = r => r>=15?"#ff2244":r>=10?"#ff6b35":r>=5?"#ffb300":"#00ff9d";
  const lC    = { open:T.red, mitigated:T.green, accepted:T.amber, closed:T.textDim };
  const catColors = { Cybersecurity:T.red, Cloud:T.cyan, Compliance:T.purple, Availability:T.amber, Legal:T.orange, Operational:T.textDim };
  const trendIcon = { increasing:"▲", stable:"→", decreasing:"▼" };
  const trendC    = { increasing:T.red, stable:T.textDim, decreasing:T.green };

  const categories = [...new Set(RISKS.map(r=>r.category))];

  // Heat matrix cells: likelihood 1–5 x impact 1–5
  const matrixRisk = (l,i) => l*i;
  const matrixC    = (v) => v>=15?"#ff224488":v>=10?"#ff6b3566":v>=5?"#ffb30044":"#00ff9d22";
  const matrixBorder = (v) => v>=15?T.red:v>=10?"#ff6b35":v>=5?T.amber:T.green;

  const TABS = ["register","matrix","treatment","reporting"];
  const TL   = { register:"◧ Risk Register", matrix:"⬡ Heat Matrix", treatment:"✓ Treatment", reporting:"◈ Reporting" };

  const TREATMENT_PLANS = [
    { risk:"RSK-001", strategy:"Mitigate",  actions:["Deploy EDR on all endpoints","Implement offline backup rotation","Test ransomware playbook quarterly"], cost:"$12K/yr",   due:"2026-Q2", progress:65 },
    { risk:"RSK-002", strategy:"Mitigate",  actions:["Automate SBOM on every build","Expand vendor security assessment","Subscribe to supply chain intel feed"], cost:"$8K/yr",  due:"2026-Q2", progress:40 },
    { risk:"RSK-006", strategy:"Mitigate",  actions:["Enforce hardware MFA for all admins","Deploy PAM for privileged accounts","90-day credential rotation policy"], cost:"$6K/yr",due:"2026-Q2",progress:75 },
    { risk:"RSK-004", strategy:"Accept",    actions:["Maintain SOC2 audit readiness","Monthly evidence collection","Engage auditor for pre-audit review"], cost:"$18K/yr",     due:"2026-Q3", progress:82 },
    { risk:"RSK-007", strategy:"Transfer",  actions:["Cyber liability insurance policy","Legal counsel on retainer","DPA agreements with all vendors"], cost:"$22K/yr",         due:"2026-Q4", progress:55 },
  ];

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="TOTAL RISKS"   value={RISKS.length}                             icon="⬡" color={T.cyan}/>
        <MetricCard label="CRITICAL (≥15)" value={RISKS.filter(r=>r.residual>=15).length} icon="⚠" color={T.red}/>
        <MetricCard label="HIGH (≥10)"    value={RISKS.filter(r=>r.residual>=10&&r.residual<15).length} icon="▲" color={T.amber}/>
        <MetricCard label="MITIGATED"     value={RISKS.filter(r=>r.status==="mitigated").length} icon="✓" color={T.green}/>
        <MetricCard label="AVG RESIDUAL"  value={(RISKS.reduce((a,r)=>a+r.residual,0)/RISKS.length).toFixed(1)} icon="◎" color={T.purple}/>
        <MetricCard label="RISK APPETITE" value="LOW" icon="⊘" color={T.amber}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.purple}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.purple:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
      </div>

      {/* RISK REGISTER */}
      {tab==="register" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {categories.map(cat=>(
              <button key={cat} style={{padding:"5px 12px",background:`${catColors[cat]}12`,border:`1px solid ${catColors[cat]}44`,borderRadius:4,color:catColors[cat],fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer"}}>{cat} ({RISKS.filter(r=>r.category===cat).length})</button>
            ))}
          </div>
          <Card>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["ID","Category","Risk","Inherent","Residual","Trend","Owner","Status","SLA",""].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{RISKS.map(r=>(
                <tr key={r.id} onClick={()=>setSelRisk(selRisk===r.id?null:r.id)} style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer",background:selRisk===r.id?`${T.purple}08`:"transparent",transition:"background .12s"}}
                  onMouseEnter={e=>{ if(selRisk!==r.id) e.currentTarget.style.background=T.bg2; }}
                  onMouseLeave={e=>{ if(selRisk!==r.id) e.currentTarget.style.background="transparent"; }}>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{r.id}</td>
                  <td style={{padding:"10px 12px"}}><span style={{fontSize:11,color:catColors[r.category],background:`${catColors[r.category]}12`,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{r.category}</span></td>
                  <td style={{padding:"10px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.textBright,fontWeight:600,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.title}</td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:28,height:28,borderRadius:6,background:`${riskC(r.inherent)}22`,border:`1px solid ${riskC(r.inherent)}66`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:riskC(r.inherent)}}>{r.inherent}</div>
                    </div>
                  </td>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:28,height:28,borderRadius:6,background:`${riskC(r.residual)}22`,border:`1px solid ${riskC(r.residual)}66`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:riskC(r.residual)}}>{r.residual}</div>
                      {r.inherent>r.residual && <span style={{fontSize:10,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>-{r.inherent-r.residual}</span>}
                    </div>
                  </td>
                  <td style={{padding:"10px 12px"}}><span style={{fontSize:16,color:trendC[r.trend]}}>{trendIcon[r.trend]}</span></td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{r.owner.split(" ")[0]}</td>
                  <td style={{padding:"10px 12px"}}><Badge color={lC[r.status]}>{r.status.toUpperCase()}</Badge></td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{r.sla}</td>
                  <td style={{padding:"10px 12px",fontSize:11,color:T.textDim}}>→</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>
          {/* Risk detail drawer */}
          {selRisk && (() => {
            const r = RISKS.find(x=>x.id===selRisk);
            return (
              <Card style={{marginTop:14,border:`1px solid ${riskC(r.residual)}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,marginBottom:4}}>{r.id} · {r.category}</div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,color:T.textBright,marginBottom:6}}>{r.title}</div>
                    <div style={{display:"flex",gap:8}}>
                      <Badge color={lC[r.status]}>{r.status.toUpperCase()}</Badge>
                      <Badge color={catColors[r.category]}>{r.category}</Badge>
                      <span style={{fontSize:13,color:trendC[r.trend]}}>{trendIcon[r.trend]} {r.trend}</span>
                    </div>
                  </div>
                  <button onClick={()=>setSelRisk(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:18}}>✕</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
                  {[{l:"Inherent Risk",v:r.inherent},{l:"Residual Risk",v:r.residual},{l:"Risk Reduction",v:`${Math.round((1-r.residual/r.inherent)*100)}%`}].map(({l,v})=>(
                    <div key={l} style={{padding:"12px 14px",background:T.bg2,borderRadius:7,textAlign:"center"}}>
                      <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:4}}>{l.toUpperCase()}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:typeof v==="number"?riskC(v):T.green}}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginBottom:12}}>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>EXISTING CONTROLS</div>
                  {r.controls.map(c=>(
                    <div key={c} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:T.bg2,borderRadius:4,marginBottom:5}}>
                      <span style={{color:T.green,fontSize:12}}>✓</span>
                      <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.text}}>{c}</span>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                  {[["Owner",r.owner],["Risk Appetite",r.appetite.toUpperCase()],["SLA",r.sla]].map(([k,v])=>(
                    <div key={k} style={{padding:"8px 12px",background:T.bg2,borderRadius:5}}>
                      <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{k.toUpperCase()}</div>
                      <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright}}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}
        </div>
      )}

      {/* HEAT MATRIX */}
      {tab==="matrix" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14}}>
          <Card>
            <SectionHeader label="Risk Heat Matrix — Likelihood × Impact" accent={T.purple}/>
            <div style={{display:"grid",gridTemplateColumns:"28px repeat(5,1fr)",gap:4,marginBottom:8}}>
              <div/>
              {["1","2","3","4","5"].map(i=>(
                <div key={i} style={{textAlign:"center",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",paddingBottom:4}}>Impact {i}</div>
              ))}
              {[5,4,3,2,1].map(l=>(
                <>
                  <div key={`l${l}`} style={{display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:4}}>
                    <span style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",writingMode:"initial"}}>L{l}</span>
                  </div>
                  {[1,2,3,4,5].map(imp=>{
                    const rv = matrixRisk(l,imp);
                    const cellRisks = RISKS.filter(r=>r.likelihood===l&&r.impact===imp);
                    return (
                      <div key={`${l}-${imp}`} style={{height:60,borderRadius:6,background:matrixC(rv),border:`1px solid ${matrixBorder(rv)}44`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:4}}>
                        <div style={{fontSize:9,color:riskC(rv),fontFamily:"'JetBrains Mono',monospace",fontWeight:700,marginBottom:2}}>{rv}</div>
                        {cellRisks.map(r=>(
                          <div key={r.id} title={r.title} style={{fontSize:8,color:"#fff",background:riskC(r.residual),borderRadius:3,padding:"1px 4px",margin:"1px 0",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",cursor:"pointer"}} onClick={()=>setSelRisk(r.id)}>
                            {r.id}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
            <div style={{display:"flex",gap:14,marginTop:6}}>
              {[["Critical ≥15",T.red],["High ≥10","#ff6b35"],["Medium ≥5",T.amber],["Low <5",T.green]].map(([l,c])=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:12,height:12,borderRadius:2,background:c+"33",border:`1px solid ${c}66`}}/>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{l}</span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Card>
              <SectionHeader label="Risk by Category" accent={T.purple}/>
              {categories.map(cat=>{
                const catRisks = RISKS.filter(r=>r.category===cat);
                const avgResidual = Math.round(catRisks.reduce((a,r)=>a+r.residual,0)/catRisks.length);
                return (
                  <div key={cat} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <span style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{cat}</span>
                      <span style={{fontSize:12,color:riskC(avgResidual),fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>avg {avgResidual}</span>
                    </div>
                    <div style={{height:5,background:T.bg3,borderRadius:3}}>
                      <div style={{width:`${(avgResidual/20)*100}%`,height:"100%",background:riskC(avgResidual),borderRadius:3}}/>
                    </div>
                  </div>
                );
              })}
            </Card>
            <Card>
              <SectionHeader label="Risk Appetite Statement" accent={T.amber}/>
              <div style={{padding:"12px 14px",background:`${T.amber}08`,border:`1px solid ${T.amber}33`,borderRadius:6,fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.7,marginBottom:10}}>
                ZolexTech maintains a <strong style={{color:T.amber}}>LOW</strong> risk appetite for cybersecurity and compliance risks, and a <strong style={{color:T.cyan}}>MEDIUM</strong> appetite for operational and availability risks.
              </div>
              {[{l:"Cybersecurity",v:"LOW",c:T.red},{l:"Cloud",v:"LOW",c:T.amber},{l:"Compliance",v:"LOW",c:T.purple},{l:"Availability",v:"MEDIUM",c:T.cyan},{l:"Operational",v:"MEDIUM",c:T.textDim},{l:"Legal",v:"LOW",c:T.orange}].map(a=>(
                <div key={a.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{a.l}</span>
                  <Badge color={a.c}>{a.v}</Badge>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* TREATMENT PLANS */}
      {tab==="treatment" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {TREATMENT_PLANS.map(tp=>{
            const risk = RISKS.find(r=>r.id===tp.risk);
            return (
              <Card key={tp.risk} style={{border:`1px solid ${riskC(risk?.residual||0)}22`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 200px",gap:14}}>
                  <div>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <Badge color={T.purple}>{tp.risk}</Badge>
                      <Badge color={tp.strategy==="Mitigate"?T.cyan:tp.strategy==="Transfer"?T.orange:T.amber}>{tp.strategy}</Badge>
                      <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:T.textBright}}>{risk?.title}</span>
                    </div>
                    <div style={{marginBottom:10}}>
                      <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6,letterSpacing:1}}>TREATMENT ACTIONS</div>
                      {tp.actions.map((a,i)=>(
                        <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:T.bg2,borderRadius:4,marginBottom:5}}>
                          <span style={{color:T.green,fontSize:12}}>→</span>
                          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:T.text}}>{a}</span>
                        </div>
                      ))}
                    </div>
                    <ProgressBar value={tp.progress} color={tp.progress>=80?T.green:tp.progress>=50?T.cyan:T.amber} label={`Treatment Progress`}/>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {[["Annual Cost",tp.cost],["Due",tp.due],["Strategy",tp.strategy],["Owner",risk?.owner||"—"]].map(([k,v])=>(
                      <div key={k} style={{padding:"8px 12px",background:T.bg2,borderRadius:5}}>
                        <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:3}}>{k.toUpperCase()}</div>
                        <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* REPORTING */}
      {tab==="reporting" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Risk KPIs — Board Reporting" accent={T.purple}/>
            {[
              {kpi:"Total Risk Exposure (inherent)",  value:"124", unit:"pts", trend:"-8 vs Q4", color:T.green},
              {kpi:"Total Risk Exposure (residual)",  value:"68",  unit:"pts", trend:"-12 vs Q4",color:T.green},
              {kpi:"Critical Risks (residual ≥ 15)", value:"1",   unit:"",    trend:"same",      color:T.amber},
              {kpi:"Risks exceeding appetite",        value:"3",   unit:"",    trend:"-1 vs Q4", color:T.green},
              {kpi:"Controls effectiveness",          value:"45%", unit:"",    trend:"+5%",       color:T.green},
              {kpi:"Risk treatment velocity",         value:"2.1", unit:"/mo", trend:"on track",  color:T.cyan},
            ].map(k=>(
              <div key={k.kpi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <div>
                  <div style={{fontSize:13,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{k.kpi}</div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{k.trend}</div>
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:20,fontWeight:700,color:k.color}}>{k.value}<span style={{fontSize:12,color:T.textDim}}>{k.unit}</span></div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader label="Trend Analysis" accent={T.amber}/>
            {[{l:"Inherent",data:[130,128,126,124,124,124,124]},{l:"Residual",data:[86,82,78,75,72,70,68]},{l:"Target",data:[70,70,70,70,70,70,70]}].map(({l,data})=>(
              <div key={l} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{l} Exposure</span>
                  <span style={{fontSize:12,fontWeight:700,color:l==="Inherent"?T.amber:l==="Residual"?T.cyan:T.green+"88",fontFamily:"'JetBrains Mono',monospace"}}>{data[data.length-1]} pts</span>
                </div>
                <Sparkline data={data} color={l==="Inherent"?T.amber:l==="Residual"?T.cyan:T.green+"88"} height={28}/>
              </div>
            ))}
            <div style={{padding:"12px 14px",background:`${T.green}08`,border:`1px solid ${T.green}33`,borderRadius:6,marginTop:8}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.green,marginBottom:3}}>✓ On track to meet Q2 risk reduction target</div>
              <div style={{fontSize:12,color:T.textDim}}>Residual exposure trending down 12 pts QoQ. Target: ≤ 60 pts by end of Q3 2026.</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ASSET INVENTORY VIEW
// ═══════════════════════════════════════════════════════════════════════
const AssetView = () => {
  const [tab, setTab]       = useState("inventory");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selAsset, setSelAsset]     = useState(null);
  const [scanRunning, setScanRunning] = useState(false);
  const [scanPct, setScanPct]         = useState(0);

  const ASSETS = [
    // Servers / VMs
    { id:"AST-001", name:"eks-node-01",           type:"Server",      os:"Amazon Linux 2",    ip:"10.0.1.10", env:"prod",    owner:"Emeka Nwachukwu", criticality:"high",   vulns:3, status:"online",  tags:["eks","node","prod"],          last:"2m ago",  cpu:"12%",  mem:"41%",  disk:"28%",  cost:"$145/mo"  },
    { id:"AST-002", name:"eks-node-02",           type:"Server",      os:"Amazon Linux 2",    ip:"10.0.1.11", env:"prod",    owner:"Emeka Nwachukwu", criticality:"high",   vulns:3, status:"online",  tags:["eks","node","prod"],          last:"2m ago",  cpu:"9%",   mem:"38%",  disk:"25%",  cost:"$145/mo"  },
    { id:"AST-003", name:"eks-node-03",           type:"Server",      os:"Amazon Linux 2",    ip:"10.0.1.12", env:"prod",    owner:"Emeka Nwachukwu", criticality:"high",   vulns:3, status:"online",  tags:["eks","node","prod"],          last:"2m ago",  cpu:"14%",  mem:"44%",  disk:"31%",  cost:"$145/mo"  },
    { id:"AST-004", name:"bastion-host",          type:"Server",      os:"Ubuntu 22.04 LTS",  ip:"10.0.0.10", env:"prod",    owner:"Adebayo Paul",    criticality:"critical",vulns:1,status:"online",  tags:["bastion","ssh","jump"],       last:"1h ago",  cpu:"1%",   mem:"8%",   disk:"12%",  cost:"$22/mo"   },
    // Containers
    { id:"AST-005", name:"secureops-api:2.4.1",  type:"Container",   os:"Python 3.11.4",     ip:"10.0.1.10", env:"prod",    owner:"Adebayo Paul",    criticality:"critical",vulns:2,status:"running", tags:["api","fastapi","prod"],       last:"1m ago",  cpu:"12%",  mem:"284MB",disk:"—",    cost:"—"        },
    { id:"AST-006", name:"secureops-ui:2.4.1",   type:"Container",   os:"Node 20 / Alpine",  ip:"10.0.1.10", env:"prod",    owner:"Chidera Okonkwo", criticality:"high",   vulns:2, status:"running", tags:["frontend","react","prod"],   last:"1m ago",  cpu:"3%",   mem:"112MB",disk:"—",    cost:"—"        },
    { id:"AST-007", name:"nginx:1.24.0",          type:"Container",   os:"NGINX / Alpine",    ip:"10.0.0.5",  env:"prod",    owner:"Emeka Nwachukwu", criticality:"critical",vulns:1,status:"running", tags:["proxy","nginx","edge"],       last:"1m ago",  cpu:"1%",   mem:"18MB", disk:"—",    cost:"—"        },
    { id:"AST-008", name:"postgres:15.5",         type:"Container",   os:"PostgreSQL",        ip:"10.0.2.10", env:"prod",    owner:"Emeka Nwachukwu", criticality:"critical",vulns:0,status:"running", tags:["database","postgres","prod"], last:"1m ago",  cpu:"8%",   mem:"512MB",disk:"—",    cost:"—"        },
    { id:"AST-009", name:"redis:7.2.4",           type:"Container",   os:"Redis / Alpine",    ip:"10.0.2.20", env:"prod",    owner:"Emeka Nwachukwu", criticality:"high",   vulns:0, status:"degraded",tags:["cache","redis","degraded"],  last:"1m ago",  cpu:"2%",   mem:"96MB", disk:"—",    cost:"—"        },
    // Databases
    { id:"AST-010", name:"zolextech-prod",        type:"Database",    os:"PostgreSQL 15.5",   ip:"10.0.2.10", env:"prod",    owner:"Emeka Nwachukwu", criticality:"critical",vulns:0,status:"online",  tags:["rds","postgres","encrypted"],last:"2m ago",  cpu:"8%",   mem:"62%",  disk:"44%",  cost:"$130/mo"  },
    { id:"AST-011", name:"redis-primary",         type:"Database",    os:"ElastiCache 7.2",   ip:"10.0.2.20", env:"prod",    owner:"Emeka Nwachukwu", criticality:"high",   vulns:0, status:"degraded",tags:["redis","cache","1/2 nodes"],  last:"1m ago",  cpu:"2%",   mem:"84%",  disk:"—",    cost:"$54/mo"   },
    // Network
    { id:"AST-012", name:"zolextech-prod-alb",    type:"Network",     os:"AWS ALB",           ip:"10.0.0.2",  env:"prod",    owner:"Adebayo Paul",    criticality:"critical",vulns:0,status:"online",  tags:["alb","loadbalancer","tls"],   last:"1m ago",  cpu:"—",    mem:"—",    disk:"—",    cost:"$22/mo"   },
    { id:"AST-013", name:"waf-zolextech-prod",    type:"Network",     os:"AWS WAF v2",        ip:"0.0.0.0",   env:"prod",    owner:"Adebayo Paul",    criticality:"critical",vulns:0,status:"online",  tags:["waf","security","1247rules"], last:"1m ago",  cpu:"—",    mem:"—",    disk:"—",    cost:"$6/mo"    },
    // Storage
    { id:"AST-014", name:"zolextech-app",         type:"Storage",     os:"AWS S3",            ip:"AWS",       env:"prod",    owner:"Adebayo Paul",    criticality:"high",   vulns:1, status:"online",  tags:["s3","encrypted","versioned"], last:"5m ago",  cpu:"—",    mem:"—",    disk:"14GB", cost:"$14/mo"   },
    { id:"AST-015", name:"zolextech-tfstate",     type:"Storage",     os:"AWS S3",            ip:"AWS",       env:"prod",    owner:"Emeka Nwachukwu", criticality:"high",   vulns:0, status:"online",  tags:["s3","terraform","encrypted"], last:"10m ago", cpu:"—",    mem:"—",    disk:"2GB",  cost:"$2/mo"    },
    // Endpoints
    { id:"AST-016", name:"dev-mac-adebayo",       type:"Endpoint",    os:"macOS 14 Sonoma",   ip:"192.168.1.5",env:"dev",   owner:"Adebayo Paul",    criticality:"medium", vulns:0, status:"online",  tags:["dev","macbook","endpoint"],   last:"5m ago",  cpu:"34%",  mem:"71%",  disk:"62%",  cost:"—"        },
    { id:"AST-017", name:"dev-win-chidera",       type:"Endpoint",    os:"Windows 11 Pro",    ip:"192.168.1.8",env:"dev",   owner:"Chidera Okonkwo", criticality:"medium", vulns:2, status:"online",  tags:["dev","windows","endpoint"],   last:"22m ago", cpu:"28%",  mem:"55%",  disk:"48%",  cost:"—"        },
    // Compromised
    { id:"AST-018", name:"prod-host-compromised", type:"Server",      os:"Amazon Linux 2",    ip:"10.0.2.45", env:"prod",    owner:"Adebayo Paul",    criticality:"critical",vulns:4,status:"compromised",tags:["compromised","incident","isolate"],last:"1m ago",cpu:"67%",mem:"89%",disk:"71%",cost:"$145/mo"},
  ];

  const TYPES    = ["ALL","Server","Container","Database","Network","Storage","Endpoint"];
  const typeIcon = { Server:"⚡", Container:"🐳", Database:"🗄", Network:"◫", Storage:"🪣", Endpoint:"💻" };
  const typeC    = { Server:T.cyan, Container:T.orange, Database:T.purple, Network:T.amber, Storage:T.green, Endpoint:T.textDim };
  const critC    = { critical:T.red, high:T.amber, medium:T.cyan, low:T.textDim };
  const statC    = { online:T.green, running:T.green, degraded:T.amber, offline:T.red, compromised:T.red };
  const statLabel= { online:"ONLINE", running:"RUNNING", degraded:"DEGRADED", offline:"OFFLINE", compromised:"COMPROMISED" };
  const envC     = { prod:T.cyan, staging:T.amber, dev:T.textDim };

  const filtered = ASSETS.filter(a =>
    (typeFilter==="ALL" || a.type===typeFilter) &&
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) ||
     a.ip.includes(search) || a.os.toLowerCase().includes(search.toLowerCase()) ||
     a.tags.some(t=>t.includes(search.toLowerCase())))
  );

  const runScan = () => {
    setScanRunning(true); setScanPct(0);
    let p=0; const iv=setInterval(()=>{ p+=rand(3,8); setScanPct(Math.min(p,100)); if(p>=100){clearInterval(iv);setScanRunning(false);}},120);
  };

  const TABS = ["inventory","discovery","software","changes"];
  const TL   = { inventory:"◧ Inventory", discovery:"⊕ Discovery", software:"◎ Software", changes:"⟁ Change History" };

  const SOFTWARE_MAP = [
    { name:"Python",          version:"3.11.4",  latest:"3.12.3", assets:["AST-005","AST-007","AST-008"], vuln:true,  license:"PSF-2.0"    },
    { name:"NGINX",           version:"1.24.0",  latest:"1.25.5", assets:["AST-007"],                     vuln:true,  license:"BSD-2-Clause"},
    { name:"PostgreSQL",      version:"15.5",    latest:"16.2",   assets:["AST-010"],                     vuln:false, license:"PostgreSQL"  },
    { name:"Redis",           version:"7.2.4",   latest:"7.2.4",  assets:["AST-011"],                     vuln:false, license:"BSD-3-Clause"},
    { name:"OpenSSL",         version:"3.0.10",  latest:"3.2.1",  assets:["AST-005","AST-006","AST-007"], vuln:true,  license:"Apache-2.0"  },
    { name:"cryptography",    version:"41.0.5",  latest:"42.0.5", assets:["AST-005"],                     vuln:false, license:"Apache-2.0"  },
    { name:"FastAPI",         version:"0.109.2", latest:"0.110.0",assets:["AST-005"],                     vuln:false, license:"MIT"         },
    { name:"Jinja2",          version:"3.1.2",   latest:"3.1.3",  assets:["AST-005"],                     vuln:true,  license:"BSD-3-Clause"},
    { name:"Node.js",         version:"20.11.0", latest:"20.12.0",assets:["AST-006"],                     vuln:false, license:"MIT"         },
    { name:"React",           version:"18.2.0",  latest:"18.3.1", assets:["AST-006"],                     vuln:false, license:"MIT"         },
    { name:"zlib",            version:"1.2.13",  latest:"1.3.1",  assets:["AST-005","AST-007"],            vuln:true,  license:"Zlib"        },
    { name:"runc",            version:"1.1.11",  latest:"1.1.12", assets:["AST-005","AST-006","AST-007","AST-008","AST-009"], vuln:true, license:"Apache-2.0"},
  ];

  const CHANGES = [
    { id:"CHG-001", asset:"secureops-api:2.4.1", type:"Deploy",   desc:"Container image updated v2.4.0→v2.4.1",          time:"09:38",  user:"CI/CD",          severity:"low"    },
    { id:"CHG-002", asset:"nginx:1.24.0",         type:"Config",   desc:"nginx.conf updated — added rate limit zone /api", time:"09:20",  user:"Adebayo Paul",   severity:"medium" },
    { id:"CHG-003", asset:"10.0.2.45",            type:"Security", desc:"Host ISOLATED — incident INC-001",                time:"09:42",  user:"System",         severity:"critical"},
    { id:"CHG-004", asset:"waf-zolextech-prod",   type:"Security", desc:"WAF rule added: BLOCK 185.220.101.8/32",          time:"09:38",  user:"Amaka Obi",      severity:"high"   },
    { id:"CHG-005", asset:"zolextech-app (S3)",   type:"Config",   desc:"S3 ACL reset to private — was public-read",       time:"06:44",  user:"Chidera Okonkwo",severity:"high"   },
    { id:"CHG-006", asset:"eks-node-01",          type:"Patch",    desc:"Kernel security patch applied — reboot pending",  time:"03:00",  user:"Automation",     severity:"medium" },
    { id:"CHG-007", asset:"redis-primary",        type:"Incident", desc:"Replica failure — cluster degraded to 1/2 nodes", time:"2d ago", user:"System",         severity:"high"   },
    { id:"CHG-008", asset:"zolextech-prod (RDS)", type:"Backup",   desc:"Daily automated backup completed — 30-day retention",time:"02:00",user:"AWS",           severity:"low"    },
    { id:"CHG-009", asset:"dev-win-chidera",       type:"Patch",    desc:"Windows Defender definitions updated",            time:"1d ago", user:"Automation",     severity:"low"    },
    { id:"CHG-010", asset:"bastion-host",         type:"Auth",     desc:"SSH login: adebayo@10.0.0.10 — successful",       time:"1h ago", user:"Adebayo Paul",   severity:"low"    },
  ];

  const chgC = { Deploy:T.cyan, Config:T.amber, Security:T.red, Patch:T.green, Incident:T.red, Auth:T.textDim, Backup:T.textDim };
  const chgSevC = { critical:T.red, high:T.amber, medium:T.cyan, low:T.textDim };

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="TOTAL ASSETS"   value={ASSETS.length}                                             icon="◧" color={T.cyan}/>
        <MetricCard label="CRITICAL"       value={ASSETS.filter(a=>a.criticality==="critical").length}       icon="⚠" color={T.red}/>
        <MetricCard label="COMPROMISED"    value={ASSETS.filter(a=>a.status==="compromised").length}         icon="💀" color={T.red} delta={1}/>
        <MetricCard label="WITH VULNS"     value={ASSETS.filter(a=>a.vulns>0).length}                       icon="◉" color={T.amber}/>
        <MetricCard label="ONLINE"         value={ASSETS.filter(a=>a.status==="online"||a.status==="running").length} icon="●" color={T.green}/>
        <MetricCard label="MONTHLY COST"   value="$783" unit="/mo"                                          icon="$" color={T.gold}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,paddingBottom:4}}>
          {scanRunning && <ProgressBar value={scanPct} color={T.cyan} style={{width:120,marginBottom:0}}/>}
          <button onClick={runScan} disabled={scanRunning} style={{padding:"6px 16px",background:scanRunning?T.bg3:`${T.cyan}14`,border:`1px solid ${scanRunning?T.border:T.cyan}`,borderRadius:5,color:scanRunning?T.textDim:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:scanRunning?"default":"pointer"}}>
            {scanRunning?`⟳ Scanning ${scanPct}%`:"◉ Scan Assets"}
          </button>
        </div>
      </div>

      {/* INVENTORY */}
      {tab==="inventory" && (
        <div>
          <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, IP, OS, tags…"
              style={{padding:"7px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",width:220}}
              onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border}/>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {TYPES.map(t=>(
                <button key={t} onClick={()=>setTypeFilter(t)} style={{padding:"5px 10px",background:typeFilter===t?`${t==="ALL"?T.cyan:typeC[t]||T.cyan}18`:"transparent",border:`1px solid ${typeFilter===t?(t==="ALL"?T.cyan:typeC[t]||T.cyan):T.border}`,borderRadius:4,color:typeFilter===t?(t==="ALL"?T.cyan:typeC[t]||T.cyan):T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  {t!=="ALL"&&<span>{typeIcon[t]}</span>}{t}
                </button>
              ))}
            </div>
            <span style={{marginLeft:"auto",fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} assets</span>
          </div>

          <Card style={{padding:0,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead style={{position:"sticky",top:0,background:T.bg1,zIndex:2}}>
                <tr style={{borderBottom:`1px solid ${T.border}`}}>
                  {["Asset","Type","OS / Runtime","IP","Env","Criticality","Status","Vulns","CPU","Mem","Owner",""].map(h=>(
                    <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{filtered.map(a=>(
                <tr key={a.id} onClick={()=>setSelAsset(selAsset===a.id?null:a.id)}
                  style={{borderBottom:`1px solid ${T.border}22`,cursor:"pointer",background:a.status==="compromised"?`${T.red}08`:selAsset===a.id?`${T.cyan}07`:"transparent",transition:"background .12s"}}
                  onMouseEnter={e=>{ if(a.status!=="compromised"&&selAsset!==a.id) e.currentTarget.style.background=T.bg2; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=a.status==="compromised"?`${T.red}08`:selAsset===a.id?`${T.cyan}07`:"transparent"; }}>
                  <td style={{padding:"10px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:statC[a.status]||T.textDim,animation:a.status==="running"||a.status==="online"?"pulse 3s infinite":"none",flexShrink:0}}/>
                      <div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:a.status==="compromised"?T.red:T.textBright,fontWeight:600}}>{a.name}</div>
                        <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"10px 12px"}}><span style={{fontSize:11,color:typeC[a.type],background:`${typeC[a.type]}12`,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{typeIcon[a.type]} {a.type}</span></td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.os}</td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.cyan}}>{a.ip}</td>
                  <td style={{padding:"10px 12px"}}><span style={{fontSize:10,color:envC[a.env],fontFamily:"'JetBrains Mono',monospace",background:`${envC[a.env]}12`,padding:"2px 6px",borderRadius:3}}>{a.env.toUpperCase()}</span></td>
                  <td style={{padding:"10px 12px"}}><Badge color={critC[a.criticality]}>{a.criticality.toUpperCase()}</Badge></td>
                  <td style={{padding:"10px 12px"}}><span style={{fontSize:11,color:statC[a.status]||T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{statLabel[a.status]||a.status}</span></td>
                  <td style={{padding:"10px 12px"}}><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:a.vulns>0?T.red:T.green}}>{a.vulns}</span></td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:parseFloat(a.cpu)>50?T.amber:T.textDim}}>{a.cpu}</td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:parseFloat(a.mem)>80?T.red:parseFloat(a.mem)>60?T.amber:T.textDim}}>{a.mem}</td>
                  <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,whiteSpace:"nowrap"}}>{a.owner.split(" ")[0]}</td>
                  <td style={{padding:"10px 12px",fontSize:11,color:T.textDim}}>→</td>
                </tr>
              ))}</tbody>
            </table>
          </Card>

          {selAsset && (() => {
            const a = ASSETS.find(x=>x.id===selAsset);
            if(!a) return null;
            return (
              <Card style={{marginTop:14,border:`1px solid ${a.status==="compromised"?T.red:T.cyan}33`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div>
                    <div style={{display:"flex",gap:8,marginBottom:6}}>
                      <span style={{fontSize:20}}>{typeIcon[a.type]}</span>
                      <div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:a.status==="compromised"?T.red:T.textBright}}>{a.name}</div>
                        <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.id} · {a.os}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <Badge color={critC[a.criticality]}>{a.criticality.toUpperCase()}</Badge>
                      <Badge color={statC[a.status]||T.textDim}>{statLabel[a.status]}</Badge>
                      <Badge color={envC[a.env]}>{a.env.toUpperCase()}</Badge>
                      {a.tags.map(t=><span key={t} style={{fontSize:10,color:T.textDim,background:T.bg3,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{t}</span>)}
                    </div>
                  </div>
                  <button onClick={()=>setSelAsset(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:18}}>✕</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                  {[{l:"IP Address",v:a.ip},{l:"Owner",v:a.owner},{l:"Cost",v:a.cost},{l:"Last Seen",v:a.last},{l:"CPU",v:a.cpu},{l:"Memory",v:a.mem},{l:"Disk",v:a.disk},{l:"Vulnerabilities",v:a.vulns}].map(({l,v})=>(
                    <div key={l} style={{padding:"9px 12px",background:T.bg2,borderRadius:5}}>
                      <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:3}}>{l.toUpperCase()}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:l==="Vulnerabilities"&&v>0?T.red:T.textBright}}>{v}</div>
                    </div>
                  ))}
                </div>
                {a.status==="compromised" && (
                  <div style={{padding:"12px 16px",background:`${T.red}0a`,border:`1px solid ${T.red}44`,borderRadius:6,marginBottom:12}}>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.red,marginBottom:4}}>⚠ This asset is COMPROMISED — Active Incident INC-001</div>
                    <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>Lateral movement detected from this host. Host is being isolated from the network.</div>
                  </div>
                )}
                <div style={{display:"flex",gap:8}}>
                  <button style={{padding:"8px 16px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>⊕ Hunt</button>
                  <button style={{padding:"8px 16px",background:`${T.amber}14`,border:`1px solid ${T.amber}44`,borderRadius:5,color:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>◉ Scan</button>
                  {a.status==="compromised"&&<button style={{padding:"8px 16px",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:5,color:T.red,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>⊘ Isolate</button>}
                  <button style={{padding:"8px 16px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Edit</button>
                </div>
              </Card>
            );
          })()}
        </div>
      )}

      {/* DISCOVERY */}
      {tab==="discovery" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Discovery Configuration" accent={T.cyan}/>
            {[
              {proto:"AWS Config",     scope:"All regions",          interval:"Continuous", last:"2m ago",  status:"ok"},
              {proto:"Nmap Network",   scope:"10.0.0.0/16",          interval:"6h",         last:"4h ago",  status:"ok"},
              {proto:"ECS/EKS Agent", scope:"Prod cluster",          interval:"5min",       last:"1m ago",  status:"ok"},
              {proto:"Endpoint Agent",scope:"All dev endpoints",     interval:"15min",      last:"5m ago",  status:"ok"},
              {proto:"S3 Inventory",  scope:"All buckets",           interval:"24h",        last:"2h ago",  status:"ok"},
              {proto:"Shodan Monitor",scope:"External IPs",          interval:"24h",        last:"3h ago",  status:"warn"},
            ].map((d,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:d.status==="ok"?T.green:T.amber,animation:"pulse 2s infinite",flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright}}>{d.proto}</div>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{d.scope} · every {d.interval}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>last: {d.last}</div>
                </div>
              </div>
            ))}
            <button onClick={runScan} disabled={scanRunning} style={{marginTop:12,width:"100%",padding:"9px 0",background:scanRunning?T.bg3:`${T.cyan}14`,border:`1px solid ${T.cyan}`,borderRadius:6,color:scanRunning?T.textDim:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:scanRunning?"default":"pointer"}}>
              {scanRunning?`⟳ Scanning ${scanPct}%`:"▶ Run Discovery Now"}
            </button>
          </Card>
          <Card>
            <SectionHeader label="Asset Coverage" accent={T.green}/>
            {[
              {l:"Servers / VMs",    total:4,  covered:4,  color:T.green},
              {l:"Containers",       total:5,  covered:5,  color:T.green},
              {l:"Databases",        total:2,  covered:2,  color:T.green},
              {l:"Network Devices",  total:2,  covered:2,  color:T.green},
              {l:"Storage (S3)",     total:2,  covered:2,  color:T.green},
              {l:"Endpoints",        total:2,  covered:2,  color:T.green},
              {l:"SaaS Apps",        total:8,  covered:3,  color:T.amber},
              {l:"Shadow IT",        total:"?",covered:0,  color:T.red},
            ].map(c=>(
              <div key={c.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{c.l}</span>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{height:4,width:80,background:T.bg3,borderRadius:2}}>
                    {typeof c.total==="number"&&<div style={{width:`${(c.covered/c.total)*100}%`,height:"100%",background:c.color,borderRadius:2}}/>}
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:c.color,minWidth:40,textAlign:"right"}}>{c.covered}/{c.total}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* SOFTWARE */}
      {tab==="software" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label="Software Bill of Materials (SBOM)"/>
            <div style={{display:"flex",gap:8}}>
              <Badge color={T.red}>{SOFTWARE_MAP.filter(s=>s.vuln).length} vulnerable</Badge>
              <button style={{padding:"6px 14px",background:`${T.cyan}14`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>↓ Export SBOM</button>
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["Software","Installed Ver","Latest","Affected Assets","License","Vulnerable",""].map(h=>(
                <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{SOFTWARE_MAP.map((s,_i)=>(
              <tr key={s.name} style={{borderBottom:`1px solid ${T.border}22`}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:T.textBright}}>{s.name}</td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:s.vuln?T.red:s.version!==s.latest?T.amber:T.green}}>{s.version}</td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.green}}>{s.latest}</td>
                <td style={{padding:"10px 12px"}}><span style={{fontSize:12,color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{s.assets.length} asset{s.assets.length>1?"s":""}</span></td>
                <td style={{padding:"10px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{s.license}</td>
                <td style={{padding:"10px 12px",textAlign:"center"}}><span style={{fontSize:14}}>{s.vuln?"⚡":""}</span></td>
                <td style={{padding:"10px 12px"}}>
                  {s.version!==s.latest&&<button style={{padding:"3px 10px",background:`${T.green}12`,border:`1px solid ${T.green}33`,borderRadius:3,color:T.green,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:9}}>Update</button>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* CHANGES */}
      {tab==="changes" && (
        <Card>
          <SectionHeader label="Asset Change History" accent={T.amber}/>
          {CHANGES.map((c,_i)=>(
            <div key={c.id} style={{display:"flex",gap:14,padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:32,height:32,borderRadius:7,background:`${chgC[c.type]||T.textDim}14`,border:`1px solid ${chgC[c.type]||T.textDim}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:chgC[c.type]||T.textDim,flexShrink:0}}>
                {c.type==="Deploy"?"⌬":c.type==="Config"?"⚙":c.type==="Security"?"🛡":c.type==="Patch"?"✓":c.type==="Incident"?"🚨":c.type==="Auth"?"◈":"◧"}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.cyan,marginRight:8}}>{c.asset}</span>
                    <span style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif"}}>{c.desc}</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:12}}>
                    <Badge color={chgC[c.type]||T.textDim}>{c.type.toUpperCase()}</Badge>
                    <Badge color={chgSevC[c.severity]}>{c.severity.toUpperCase()}</Badge>
                  </div>
                </div>
                <div style={{display:"flex",gap:12}}>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{c.time}</span>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>by {c.user}</span>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{c.id}</span>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// DEVELOPER PORTAL VIEW
// ═══════════════════════════════════════════════════════════════════════
const DevPortalView = () => {
  const [tab, setTab]       = useState("overview");
  const [selEndpoint, setSelEndpoint] = useState(null);
  const [testBody, setTestBody]       = useState('{\n  "scope": "dashboard",\n  "limit": 10\n}');
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult]   = useState(null);
  const [copied, setCopied]           = useState(false);

  const ENDPOINTS = [
    { method:"GET",    path:"/api/v1/health",              tag:"System",     auth:false, rateLimit:"unlimited", desc:"Platform health check endpoint",  params:[],                                             response:'{"status":"healthy","version":"2.4.1","uptime":1209600}' },
    { method:"GET",    path:"/api/v1/dashboard/metrics",   tag:"Dashboard",  auth:true,  rateLimit:"60/min",    desc:"Retrieve real-time security KPIs", params:[{name:"window",type:"string",desc:"Time window: 1h|6h|24h|7d",required:false}], response:'{"threats":4,"vulns":23,"compliance":94,"events":1284}' },
    { method:"GET",    path:"/api/v1/vulnerabilities",     tag:"Vulns",      auth:true,  rateLimit:"30/min",    desc:"List all tracked vulnerabilities",  params:[{name:"severity",type:"string",desc:"Filter: CRITICAL|HIGH|MEDIUM|LOW",required:false},{name:"status",type:"string",desc:"Filter: open|resolved",required:false}], response:'[{"id":"VLN-001","cve":"CVE-2023-44487","cvss":9.8,...}]' },
    { method:"POST",   path:"/api/v1/scan/trigger",        tag:"Scanning",   auth:true,  rateLimit:"10/min",    desc:"Trigger a security scan",          params:[{name:"target",type:"string",desc:"Target: repo URL or container image",required:true},{name:"type",type:"string",desc:"Scan type: sast|dast|container|iac",required:true}], response:'{"scan_id":"SCN-4829","status":"queued","eta":42}' },
    { method:"GET",    path:"/api/v1/incidents",           tag:"Incidents",  auth:true,  rateLimit:"60/min",    desc:"List active incidents",             params:[{name:"status",type:"string",desc:"Filter: open|investigating|resolved",required:false}], response:'[{"id":"INC-001","severity":"P1","status":"investigating",...}]' },
    { method:"POST",   path:"/api/v1/incidents",           tag:"Incidents",  auth:true,  rateLimit:"5/min",     desc:"Declare a new incident",           params:[{name:"title",type:"string",desc:"Incident title",required:true},{name:"severity",type:"string",desc:"P1|P2|P3|P4",required:true}], response:'{"id":"INC-004","created":"2026-05-07T10:22:00Z",...}' },
    { method:"GET",    path:"/api/v1/compliance/score",    tag:"Compliance", auth:true,  rateLimit:"30/min",    desc:"Current compliance scores",         params:[{name:"framework",type:"string",desc:"SOC2|ISO27001|NIST",required:false}], response:'{"soc2":{"overall":94},"iso27001":{"overall":89}}' },
    { method:"GET",    path:"/api/v1/ioc",                 tag:"Threat",     auth:true,  rateLimit:"60/min",    desc:"Retrieve IOC intelligence feed",    params:[{name:"type",type:"string",desc:"ip|domain|hash|url",required:false},{name:"severity",type:"string",desc:"critical|high|medium",required:false}], response:'[{"id":"IOC-001","type":"IPv4","value":"185.220.101.8",...}]' },
    { method:"POST",   path:"/api/v1/ioc/lookup",          tag:"Threat",     auth:true,  rateLimit:"20/min",    desc:"Lookup a single IOC indicator",     params:[{name:"value",type:"string",desc:"IP, domain, hash, or URL to look up",required:true}], response:'{"value":"185.220.101.8","malicious":true,"confidence":95}' },
    { method:"GET",    path:"/api/v1/assets",              tag:"Assets",     auth:true,  rateLimit:"30/min",    desc:"List all tracked assets",           params:[{name:"type",type:"string",desc:"server|container|database|network",required:false},{name:"env",type:"string",desc:"prod|staging|dev",required:false}], response:'[{"id":"AST-001","name":"eks-node-01","type":"Server",...}]' },
    { method:"POST",   path:"/api/v1/webhooks",            tag:"Integrations",auth:true, rateLimit:"5/min",     desc:"Register a new webhook endpoint",  params:[{name:"url",type:"string",desc:"Target webhook URL",required:true},{name:"events",type:"array",desc:"Event types to subscribe to",required:true}], response:'{"id":"WH-012","url":"https://hooks.example.com/...","active":true}' },
    { method:"DELETE", path:"/api/v1/webhooks/:id",        tag:"Integrations",auth:true, rateLimit:"10/min",    desc:"Delete a webhook",                  params:[{name:"id",type:"string",desc:"Webhook ID to delete",required:true}], response:'{"deleted":true,"id":"WH-012"}' },
  ];

  const TAGS    = [...new Set(ENDPOINTS.map(e=>e.tag))];
  const methodC = { GET:T.green, POST:T.cyan, PUT:T.amber, DELETE:T.red, PATCH:T.purple };

  const SDKS = [
    { lang:"Python",     icon:"🐍", install:"pip install secureops-sdk", import:"from secureops import SecureOps",    snippet:`client = SecureOps(api_key=os.environ["SECUREOPS_API_KEY"])\nmetrics = client.dashboard.get_metrics(window="1h")\nprint(f"Active threats: {metrics['threats']}")`,version:"2.4.1" },
    { lang:"JavaScript", icon:"🟨", install:"npm install @zolextech/secureops", import:'import { SecureOps } from "@zolextech/secureops"', snippet:`const client = new SecureOps({ apiKey: process.env.SECUREOPS_API_KEY });\nconst vulns = await client.vulnerabilities.list({ severity: "CRITICAL" });\nconsole.log(\`Critical vulns: \${vulns.length}\`);`, version:"2.4.1" },
    { lang:"Go",         icon:"🔵", install:"go get github.com/zolextech/secureops-go", import:'import "github.com/zolextech/secureops-go"', snippet:`client := secureops.New(os.Getenv("SECUREOPS_API_KEY"))\nincidents, err := client.Incidents.List(ctx, &ListOptions{Status: "open"})\nfmt.Printf("Open incidents: %d\\n", len(incidents))`, version:"2.4.1" },
    { lang:"curl",       icon:"⚡", install:"— (no install needed)", import:"export SECUREOPS_API_KEY=sk_live_...", snippet:`curl -X GET "https://api.secureops.zolextech.com/v1/dashboard/metrics" \\\n  -H "Authorization: Bearer $SECUREOPS_API_KEY" \\\n  -H "Content-Type: application/json"`, version:"REST v1" },
  ];

  const [selSDK, setSelSDK] = useState("Python");
  const [selTag, setSelTag] = useState("ALL");

  const filteredEndpoints = ENDPOINTS.filter(e=>selTag==="ALL"||e.tag===selTag);
  const sdk = SDKS.find(s=>s.lang===selSDK);

  const runTest = () => {
    setTestRunning(true); setTestResult(null);
    setTimeout(()=>{
      setTestRunning(false);
      setTestResult({ status:200, body: selEndpoint?.response || '{"status":"ok"}', time:"142ms" });
    }, 1200);
  };

  const copyKey = () => { setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const WEBHOOKS_EVENTS = [
    "alert.critical","alert.high","scan.complete","scan.failed","incident.created","incident.resolved",
    "pipeline.failed","pipeline.success","compliance.scan_done","vuln.new_critical","asset.compromised","drift.detected",
  ];

  const RATE_LIMITS = [
    { plan:"Starter",    rps:10,  rpm:300,  daily:5000,   burst:20  },
    { plan:"Pro",        rps:30,  rpm:1800, daily:50000,  burst:60  },
    { plan:"Enterprise", rps:100, rpm:6000, daily:"∞",    burst:200 },
  ];

  const TABS = ["overview","endpoints","sdks","webhooks","ratelimits"];
  const TL   = { overview:"◈ Overview", endpoints:"◉ Endpoints", sdks:"⌬ SDKs", webhooks:"⟁ Webhooks", ratelimits:"⊘ Rate Limits" };

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="API VERSION"   value="v1"  icon="⌬" color={T.cyan}/>
        <MetricCard label="ENDPOINTS"     value={ENDPOINTS.length} icon="◉" color={T.green}/>
        <MetricCard label="YOUR USAGE"    value="68%" icon="◎" color={T.amber}/>
        <MetricCard label="UPTIME 30d"    value="99.98" unit="%" icon="●" color={T.green}/>
        <MetricCard label="AVG LATENCY"   value="142" unit="ms" icon="⏱" color={T.cyan}/>
        <MetricCard label="SDK LANGUAGES" value={SDKS.length} icon="⬡" color={T.purple}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Quick Start" accent={T.cyan}/>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {n:"1",title:"Get your API key",     desc:"Go to My Account → API Keys → Generate New",       action:"account"},
                {n:"2",title:"Install the SDK",      desc:'pip install secureops-sdk  OR  npm i @zolextech/secureops', action:"sdks"},
                {n:"3",title:"Authenticate",         desc:"SECUREOPS_API_KEY=sk_live_zolex_...",               action:null},
                {n:"4",title:"Make your first call", desc:"client.dashboard.get_metrics()",                    action:null},
                {n:"5",title:"Subscribe to webhooks",desc:"Register endpoints for real-time alerts",           action:"webhooks"},
              ].map(s=>(
                <div key={s.n} onClick={()=>s.action&&setTab(s.action)} style={{display:"flex",gap:12,padding:"12px 14px",background:T.bg2,borderRadius:6,border:`1px solid ${T.border}`,cursor:s.action?"pointer":"default",transition:"border-color .15s"}}
                  onMouseEnter={e=>{ if(s.action) e.currentTarget.style.borderColor=T.cyan; }}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:`${T.cyan}18`,border:`1px solid ${T.cyan}44`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:T.cyan,flexShrink:0}}>{s.n}</div>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:3}}>{s.title}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{s.desc}</div>
                  </div>
                  {s.action&&<span style={{marginLeft:"auto",color:T.textDim,fontSize:14}}>→</span>}
                </div>
              ))}
            </div>
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <SectionHeader label="Your API Keys" accent={T.purple}/>
              {[
                {name:"Production",key:"sk_live_zolex_4xk9...a8f2",created:"Jan 15",last:"2 min ago",perms:["read","write"]},
                {name:"Grafana Plugin",key:"sk_live_zolex_7mb2...c391",created:"Mar 3",last:"1hr ago",perms:["read"]},
              ].map(k=>(
                <div key={k.name} style={{padding:"10px 12px",background:T.bg2,borderRadius:6,marginBottom:8,border:`1px solid ${T.border}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.textBright}}>{k.name}</div>
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{k.last}</span>
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.cyan,background:T.bg0,padding:"3px 8px",borderRadius:3,marginBottom:6,display:"inline-block"}}>{k.key}</div>
                  <div style={{display:"flex",gap:6}}>
                    {k.perms.map(p=><Badge key={p} color={T.purple}>{p}</Badge>)}
                  </div>
                </div>
              ))}
              <button onClick={()=>{}} style={{width:"100%",padding:"8px 0",background:`${T.cyan}12`,border:`1px solid ${T.cyan}44`,borderRadius:5,color:T.cyan,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",marginTop:4}}>+ Generate New Key</button>
            </Card>
            <Card>
              <SectionHeader label="API Status" accent={T.green}/>
              {[["REST API","https://api.secureops.zolextech.com","ok"],["WebSocket","wss://ws.secureops.zolextech.com","ok"],["Webhooks","Outbound delivery","ok"],["Status Page","status.secureops.zolextech.com","ok"]].map(([svc,url,_status])=>(
                <div key={svc} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright}}>{svc}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:T.textDim}}>{url}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:T.green,animation:"pulse 2s infinite"}}/>
                    <span style={{fontSize:10,color:T.green,fontFamily:"'JetBrains Mono',monospace"}}>OPERATIONAL</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* ENDPOINTS */}
      {tab==="endpoints" && (
        <div style={{display:"grid",gridTemplateColumns:selEndpoint?"1fr 440px":"1fr",gap:14}}>
          <div>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              {["ALL",...TAGS].map(t=>(
                <button key={t} onClick={()=>setSelTag(t)} style={{padding:"5px 12px",background:selTag===t?`${T.cyan}18`:"transparent",border:`1px solid ${selTag===t?T.cyan:T.border}`,borderRadius:4,color:selTag===t?T.cyan:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontSize:10,cursor:"pointer"}}>{t}</button>
              ))}
              <span style={{marginLeft:"auto",fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{filteredEndpoints.length} endpoints</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {filteredEndpoints.map(ep=>(
                <div key={ep.path} onClick={()=>setSelEndpoint(selEndpoint?.path===ep.path?null:ep)}
                  style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:selEndpoint?.path===ep.path?`${methodC[ep.method]||T.cyan}0a`:T.bg1,border:`1.5px solid ${selEndpoint?.path===ep.path?methodC[ep.method]||T.cyan:T.border}`,borderRadius:7,cursor:"pointer",transition:"all .15s"}}
                  onMouseEnter={e=>{ if(selEndpoint?.path!==ep.path) e.currentTarget.style.background=T.bg2; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background=selEndpoint?.path===ep.path?`${methodC[ep.method]||T.cyan}0a`:T.bg1; }}>
                  <div style={{width:60,padding:"3px 0",background:`${methodC[ep.method]||T.cyan}18`,border:`1px solid ${methodC[ep.method]||T.cyan}44`,borderRadius:4,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:11,fontWeight:700,color:methodC[ep.method]||T.cyan,flexShrink:0}}>{ep.method}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:T.textBright,flex:1}}>{ep.path}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{ep.desc}</span>
                    <Badge color={T.textDim}>{ep.tag}</Badge>
                    {!ep.auth&&<Badge color={T.green}>Public</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selEndpoint && (
            <Card style={{position:"sticky",top:80}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{padding:"3px 10px",background:`${methodC[selEndpoint.method]}18`,border:`1px solid ${methodC[selEndpoint.method]}44`,borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:methodC[selEndpoint.method]}}>{selEndpoint.method}</div>
                    <Badge color={T.textDim}>{selEndpoint.tag}</Badge>
                    {selEndpoint.auth?<Badge color={T.amber}>Auth Required</Badge>:<Badge color={T.green}>Public</Badge>}
                  </div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:T.textBright,marginBottom:4}}>{selEndpoint.path}</div>
                  <div style={{fontSize:13,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{selEndpoint.desc}</div>
                </div>
                <button onClick={()=>setSelEndpoint(null)} style={{background:"none",border:"none",color:T.textDim,cursor:"pointer",fontSize:18}}>✕</button>
              </div>

              {selEndpoint.params.length>0&&(
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:7}}>PARAMETERS</div>
                  {selEndpoint.params.map(p=>(
                    <div key={p.name} style={{padding:"8px 12px",background:T.bg2,borderRadius:5,marginBottom:6}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:T.cyan}}>{p.name}</span>
                        <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{p.type}</span>
                        {p.required&&<Badge color={T.red}>required</Badge>}
                      </div>
                      <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{p.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>RATE LIMIT</div>
                <div style={{padding:"6px 12px",background:T.bg2,borderRadius:4,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.amber}}>{selEndpoint.rateLimit}</div>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>TRY IT</div>
                {selEndpoint.method!=="GET"&&(
                  <textarea value={testBody} onChange={e=>setTestBody(e.target.value)} style={{width:"100%",height:80,background:T.bg0,border:`1px solid ${T.border}`,borderRadius:5,padding:"8px 12px",color:T.green,fontFamily:"'JetBrains Mono',monospace",fontSize:11,resize:"none",outline:"none",marginBottom:8}}/>
                )}
                <button onClick={runTest} disabled={testRunning} style={{width:"100%",padding:"9px 0",background:testRunning?T.bg3:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:5,color:testRunning?T.textDim:T.green,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:testRunning?"default":"pointer",marginBottom:8}}>
                  {testRunning?"⟳ Sending…":"▶ Send Request"}
                </button>
                {testResult&&(
                  <div style={{background:T.bg0,borderRadius:5,padding:"10px 12px",border:`1px solid ${T.green}44`}}>
                    <div style={{display:"flex",gap:10,marginBottom:6}}>
                      <Badge color={T.green}>{testResult.status} OK</Badge>
                      <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{testResult.time}</span>
                    </div>
                    <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.green,whiteSpace:"pre-wrap",wordBreak:"break-all",margin:0}}>{testResult.body}</pre>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* SDKs */}
      {tab==="sdks" && (
        <div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:14}}>
          <Card style={{padding:"12px 0"}}>
            <div style={{padding:"0 14px 10px"}}><SectionHeader label="Languages" accent={T.cyan}/></div>
            {SDKS.map(s=>(
              <button key={s.lang} onClick={()=>setSelSDK(s.lang)} style={{width:"100%",padding:"10px 14px",textAlign:"left",background:selSDK===s.lang?`${T.cyan}10`:"transparent",borderLeft:selSDK===s.lang?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:selSDK===s.lang?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:18}}>{s.icon}</span>{s.lang}
              </button>
            ))}
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:24}}>{sdk.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,color:T.textBright}}>{sdk.lang} SDK</div>
                    <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>v{sdk.version}</div>
                  </div>
                </div>
                <Badge color={T.green}>Official</Badge>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>INSTALLATION</div>
                <div style={{background:T.bg0,borderRadius:5,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${T.border}`}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:T.cyan}}>$ {sdk.install}</span>
                  <button onClick={copyKey} style={{background:"none",border:"none",cursor:"pointer",color:copied?T.green:T.textDim,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>{copied?"✓ Copied":"Copy"}</button>
                </div>
              </div>

              <div style={{marginBottom:14}}>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",letterSpacing:1,marginBottom:6}}>QUICK EXAMPLE</div>
                <div style={{background:T.bg0,borderRadius:5,padding:"14px 16px",border:`1px solid ${T.border}`}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,marginBottom:8}}>{sdk.import}</div>
                  {sdk.snippet.split("\n").map((line,i)=>{
                    let color = T.text;
                    if(line.trim().startsWith("//") || line.trim().startsWith("#")) color=T.textDim;
                    else if(line.includes("import")||line.includes("from")) color=T.purple;
                    else if(line.includes("const ")||line.includes(" = ")||line.includes("client")) color=T.text;
                    else if(line.match(/"[^"]+"|'[^']+'/)) color=T.green;
                    return <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color,whiteSpace:"pre"}}>{line}</div>;
                  })}
                </div>
              </div>
            </Card>

            <Card>
              <SectionHeader label="More Examples" accent={T.purple}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {title:"List Critical CVEs",      code:`vulns = client.vulnerabilities.list(severity="CRITICAL")`},
                  {title:"Trigger Security Scan",   code:`scan = client.scans.trigger(target="repo/backend", type="sast")`},
                  {title:"Get Active Incidents",    code:`incidents = client.incidents.list(status="open")`},
                  {title:"Check IOC",               code:`result = client.ioc.lookup(value="185.220.101.8")`},
                  {title:"Get Compliance Score",    code:`score = client.compliance.score(framework="SOC2")`},
                  {title:"Subscribe to Webhook",    code:`wh = client.webhooks.create(url=URL, events=["alert.critical"])`},
                ].map(ex=>(
                  <div key={ex.title} style={{padding:"10px 12px",background:T.bg2,borderRadius:5,border:`1px solid ${T.border}`}}>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:12,color:T.textBright,marginBottom:5}}>{ex.title}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.green,whiteSpace:"pre-wrap"}}>{ex.code}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* WEBHOOKS */}
      {tab==="webhooks" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Available Webhook Events" accent={T.cyan}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {WEBHOOKS_EVENTS.map(ev=>(
                <div key={ev} style={{padding:"7px 10px",background:T.bg2,borderRadius:4,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:ev.includes("critical")||ev.includes("failed")||ev.includes("compromised")?T.red:ev.includes("complete")||ev.includes("success")||ev.includes("resolved")?T.green:T.amber,flexShrink:0}}/>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{ev}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <SectionHeader label="Webhook Payload Structure" accent={T.amber}/>
            <div style={{background:T.bg0,borderRadius:5,padding:"14px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.9,border:`1px solid ${T.border}`}}>
              {[
                ["{",""],
                ["  \"event\":","\"alert.critical\",",T.green],
                ["  \"timestamp\":","\"2026-05-07T09:42:11Z\",",T.amber],
                ["  \"version\":","\"1.0\",",T.green],
                ["  \"payload\":","{ ... event-specific data },",T.textDim],
                ["  \"signature\":","\"sha256=abc123...\",",T.cyan],
                ["  \"delivery_id\":","\"dlv_4xk9a8f2\"",T.textDim],
                ["}",""],
              ].map(([k,v,vc],i)=>(
                <div key={i} style={{display:"flex",gap:4}}>
                  <span style={{color:T.cyan}}>{k}</span>
                  <span style={{color:vc||T.text}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:12,padding:"10px 12px",background:`${T.amber}08`,border:`1px solid ${T.amber}33`,borderRadius:5,fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.6}}>
              Verify webhooks using HMAC-SHA256 signature with your webhook secret. All deliveries include retry logic (3 attempts, exponential backoff).
            </div>
          </Card>
        </div>
      )}

      {/* RATE LIMITS */}
      {tab==="ratelimits" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Rate Limits by Plan" accent={T.amber}/>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["Plan","Req/s","Req/min","Daily","Burst"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{RATE_LIMITS.map((r,_i)=>(
                <tr key={r.plan} style={{borderBottom:`1px solid ${T.border}22`,background:r.plan==="Pro"?`${T.cyan}06`:"transparent"}}>
                  <td style={{padding:"11px 12px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright}}>{r.plan}</span>
                      {r.plan==="Pro"&&<Badge color={T.cyan}>YOUR PLAN</Badge>}
                    </div>
                  </td>
                  {[r.rps,r.rpm,r.daily,r.burst].map((v,j)=>(
                    <td key={j} style={{padding:"11px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:700,color:r.plan==="Pro"?T.cyan:T.textDim}}>{v}</td>
                  ))}
                </tr>
              ))}</tbody>
            </table>
          </Card>
          <Card>
            <SectionHeader label="Your Current Usage" accent={T.cyan}/>
            {[
              {endpoint:"/api/v1/dashboard/metrics",  used:42,  limit:60,  window:"1 min"},
              {endpoint:"/api/v1/vulnerabilities",    used:18,  limit:30,  window:"1 min"},
              {endpoint:"/api/v1/scan/trigger",       used:3,   limit:10,  window:"1 min"},
              {endpoint:"/api/v1/incidents",          used:28,  limit:60,  window:"1 min"},
              {endpoint:"/api/v1/ioc",               used:11,  limit:60,  window:"1 min"},
            ].map(u=>(
              <div key={u.endpoint} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,marginRight:8}}>{u.endpoint}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:u.used/u.limit>.8?T.red:T.cyan,flexShrink:0}}>{u.used}/{u.limit}</span>
                </div>
                <div style={{height:5,background:T.bg3,borderRadius:3}}>
                  <div style={{width:`${(u.used/u.limit)*100}%`,height:"100%",background:u.used/u.limit>.8?T.red:T.cyan,borderRadius:3,transition:"width .5s"}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:4,padding:"8px 12px",background:`${T.cyan}08`,border:`1px solid ${T.cyan}22`,borderRadius:5,fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>
              Rate limit window resets every 60 seconds. Headers: <span style={{color:T.cyan}}>X-RateLimit-Remaining</span>, <span style={{color:T.cyan}}>X-RateLimit-Reset</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// PENETRATION TESTING VIEW
// ═══════════════════════════════════════════════════════════════════════
const PentestView = () => {
  const [tab, setTab]           = useState("engagements");
  const [selEng, setSelEng]     = useState("PT-2026-Q1");
  const [runningTool, setRunningTool] = useState(null);
  const [toolOutput, setToolOutput]   = useState({});
  const [toolPct, setToolPct]         = useState({});

  const ENGAGEMENTS = [
    {
      id:"PT-2026-Q1", title:"Q1 2026 External Penetration Test",
      type:"External Network", scope:"zolextech.com, *.zolextech.com, 34.220.x.x/24",
      status:"completed", started:"Mar 1, 2026", completed:"Mar 14, 2026",
      tester:"RedTeam Solutions Ltd", approved:"Adebayo Paul Oke",
      critical:1, high:3, medium:5, low:4, info:7, total:20,
      risk:"High", remediated:16, open:4, cvss_avg:6.4,
      methodology:"OWASP WSTG + PTES",
      findings:[
        { id:"PT-F001", title:"SQL Injection in /api/v1/search",         sev:"CRITICAL",cvss:9.1, cve:"CWE-89",  status:"remediated",desc:"Time-based blind SQLi via the 'q' parameter. Unauthenticated. Full database read confirmed in testing.",fix:"Parameterised queries implemented (SQLAlchemy bindparams). Retested clean." },
        { id:"PT-F002", title:"Broken Object Level Auth on /api/v1/user/:id", sev:"HIGH",cvss:8.1, cve:"CWE-639",status:"remediated",desc:"IDOR vulnerability allowing any authenticated user to access other users' profile data by enumerating integer IDs.",fix:"UUID-based IDs and ownership checks added. Retested clean." },
        { id:"PT-F003", title:"Missing Rate Limiting on Login Endpoint",  sev:"HIGH",   cvss:7.5, cve:"CWE-307",status:"remediated",desc:"No brute-force protection on POST /api/v1/auth/login. 10,000 attempts completed in 60s without lockout.",fix:"Rate limiting (5/min) + account lockout after 10 failures implemented." },
        { id:"PT-F004", title:"JWT Algorithm Confusion (None Attack)",    sev:"HIGH",   cvss:7.2, cve:"CWE-347",status:"open",      desc:"JWT library accepted 'none' algorithm. Forged tokens granted admin access in lab environment.",fix:"Pending: Pin algorithm to HS256 in JWT validation logic. Due 2026-05-15." },
        { id:"PT-F005", title:"Reflected XSS in /search?q= parameter",   sev:"MEDIUM", cvss:5.4, cve:"CWE-79", status:"remediated",desc:"Stored XSS in search results page. CSP header absent. Script injection confirmed.",fix:"Input encoding + strict CSP policy deployed." },
        { id:"PT-F006", title:"NGINX Server Version Disclosure",          sev:"LOW",    cvss:2.1, cve:"CWE-200",status:"remediated",desc:"NGINX Server header exposed version 1.24.0 on all responses.",fix:"server_tokens off added to nginx.conf." },
      ],
    },
    {
      id:"PT-2025-Q3", title:"Q3 2025 Web App + API Test",
      type:"Web Application", scope:"https://app.zolextech.com + REST API",
      status:"completed", started:"Sep 5, 2025", completed:"Sep 19, 2025",
      tester:"SecureWorks Pen Test Team", approved:"Adebayo Paul Oke",
      critical:0, high:2, medium:8, low:6, info:9, total:25,
      risk:"Medium", remediated:25, open:0, cvss_avg:5.2,
      methodology:"OWASP WSTG + ASVS L2",
      findings:[],
    },
    {
      id:"PT-2026-Q2", title:"Q2 2026 Cloud Infrastructure Test",
      type:"Cloud (AWS)", scope:"AWS account 123456789012 — all services",
      status:"scheduled", started:"Jun 1, 2026", completed:"—",
      tester:"TBD — SOW in review", approved:"Pending",
      critical:0, high:0, medium:0, low:0, info:0, total:0,
      risk:"—", remediated:0, open:0, cvss_avg:0,
      methodology:"CREST Cloud + AWS Shared Responsibility",
      findings:[],
    },
  ];

  const TOOLS = [
    { id:"nmap",     name:"Nmap",        desc:"Network discovery & port scanning",     icon:"◫",  color:T.cyan,
      cmd:"nmap -sV -sC -p- --min-rate 3000 34.220.0.0/24",
      output:["Starting Nmap 7.94 ( https://nmap.org )","Scanning 256 hosts [65535 ports]","","Nmap scan report for 34.220.0.1","Host is up (0.012s latency).","","PORT     STATE  SERVICE    VERSION","80/tcp   open   http       nginx 1.24.0","443/tcp  open   https      nginx 1.24.0","8080/tcp closed http","","Nmap done: 1 IP address (1 host up) scanned in 42.31 seconds"] },
    { id:"nikto",    name:"Nikto",       desc:"Web server vulnerability scanner",      icon:"◉",  color:T.amber,
      cmd:"nikto -h https://app.zolextech.com -ssl",
      output:["- Nikto v2.1.6","-----------------------------------------------------------------------","+ Target IP:     34.220.0.1","+ Target Port:   443","+ SSL Info:      TLSv1.3 / ECDHE-RSA-AES256-GCM-SHA384","","+ Server: nginx/1.24.0","+ /: X-Frame-Options header not present.","+ /: X-Content-Type-Options header not set.","+ Retrieved x-powered-by header: FastAPI","+ 6544 requests: 0 error(s) and 3 item(s) reported"] },
    { id:"sqlmap",   name:"SQLmap",      desc:"SQL injection detection & exploitation", icon:"⚡",  color:T.red,
      cmd:"sqlmap -u 'https://api.zolextech.com/v1/search?q=test' --level=3 --risk=2",
      output:["[*] starting @ 09:42:00","[09:42:01] [INFO] testing connection to the target URL","[09:42:02] [INFO] testing if the target URL content is stable","[09:42:04] [WARNING] heuristic (basic) test shows parameter 'q' might be injectable","[09:42:06] [CRITICAL] parameter 'q' appears to be 'AND boolean-based blind' injectable","[09:42:08] [INFO] the back-end DBMS is PostgreSQL","[09:42:09] [INFO] fetching banner: '15.5 on x86_64'","[*] ending @ 09:42:12"] },
    { id:"gobuster", name:"Gobuster",    desc:"Directory/endpoint enumeration",         icon:"⬡",  color:T.purple,
      cmd:"gobuster dir -u https://api.zolextech.com -w /usr/share/seclists/common.txt",
      output:["===============================================================","Gobuster v3.6","===============================================================","[+] Url:          https://api.zolextech.com","[+] Threads:      10","[+] Wordlist:     common.txt","===============================================================","/.env            (Status: 403) [Size: 22]","/admin           (Status: 401) [Size: 0]","/api/v1          (Status: 200) [Size: 1024]","/api/v1/health   (Status: 200) [Size: 48]","/docs            (Status: 200) [Size: 8192]","Progress: 4614 / 4615 (99.98%)","==============================================================="] },
    { id:"metasploit",name:"Metasploit", desc:"Exploitation framework (lab only)",     icon:"💀",  color:T.red,
      cmd:"msfconsole -x 'use exploit/multi/handler; set payload ...'",
      output:["[*] Metasploit Framework 6.3.44","[*] Starting the Metasploit Framework console...","[*] "] },
    { id:"burp",     name:"Burp Suite",  desc:"Web app proxy & scanner",               icon:"🔍",  color:T.orange,
      cmd:"burpsuite --project-file=zolextech-q1.burp",
      output:["Burp Suite Professional v2024.2","Loading project: zolextech-q1.burp","Scanner: 0 issues in queue","Proxy: Listening on 127.0.0.1:8080","Target scope: https://app.zolextech.com"] },
  ];

  const eng = ENGAGEMENTS.find(e=>e.id===selEng) || ENGAGEMENTS[0];
  const sevC = { CRITICAL:T.red, HIGH:T.amber, MEDIUM:T.cyan, LOW:T.textDim, INFO:T.textDim+"88" };
  const statC = { remediated:T.green, open:T.red, scheduled:T.amber, pending:T.textDim };
  const engStatC = { completed:T.green, scheduled:T.amber, "in-progress":T.cyan };

  const runTool = (toolId) => {
    if (runningTool) return;
    setRunningTool(toolId);
    setToolPct(p=>({...p,[toolId]:0}));
    setToolOutput(o=>({...o,[toolId]:[]}));
    const tool = TOOLS.find(t=>t.id===toolId);
    let i=0, p=0;
    const lineIv = setInterval(()=>{
      setToolOutput(o=>({...o,[toolId]:[...(o[toolId]||[]),tool.output[i]||""]}));
      i++;
      if(i>=tool.output.length) clearInterval(lineIv);
    }, 180);
    const pctIv = setInterval(()=>{
      p+=rand(5,15);
      setToolPct(prev=>({...prev,[toolId]:Math.min(p,100)}));
      if(p>=100){ clearInterval(pctIv); setRunningTool(null); }
    }, 220);
  };

  const TABS = ["engagements","findings","tools","methodology"];
  const TL   = { engagements:"◧ Engagements", findings:"⚠ Findings", tools:"⚙ Tools", methodology:"◈ Methodology" };

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="ENGAGEMENTS"  value={ENGAGEMENTS.length}                                     icon="◧" color={T.cyan}/>
        <MetricCard label="CRITICAL"     value={ENGAGEMENTS.reduce((a,e)=>a+e.critical,0)}              icon="⚠" color={T.red}/>
        <MetricCard label="OPEN FINDINGS"value={ENGAGEMENTS.reduce((a,e)=>a+e.open,0)}                 icon="◉" color={T.amber} delta={-4}/>
        <MetricCard label="REMEDIATED"   value={ENGAGEMENTS.reduce((a,e)=>a+e.remediated,0)}           icon="✓" color={T.green}/>
        <MetricCard label="NEXT TEST"    value="Jun 1" unit="" icon="⏱" color={T.purple}/>
        <MetricCard label="LAST CVSS AVG"value={eng.cvss_avg||"—"} icon="⬡" color={T.amber}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.red}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.red:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
      </div>

      {/* ENGAGEMENTS */}
      {tab==="engagements" && (
        <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:14,alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ENGAGEMENTS.map(e=>(
              <div key={e.id} onClick={()=>setSelEng(e.id)} style={{padding:"13px 15px",background:selEng===e.id?`${T.red}0a`:T.bg1,border:`1.5px solid ${selEng===e.id?T.red:T.border}`,borderRadius:8,cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{e.id}</div>
                  <Badge color={engStatC[e.status]||T.textDim}>{e.status.toUpperCase()}</Badge>
                </div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.textBright,marginBottom:4,lineHeight:1.3}}>{e.title}</div>
                <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:6}}>{e.type} · {e.started}</div>
                {e.total>0 && (
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {e.critical>0 && <span style={{fontSize:10,color:T.red,fontFamily:"'JetBrains Mono',monospace"}}>{e.critical}C</span>}
                    {e.high>0    && <span style={{fontSize:10,color:T.amber,fontFamily:"'JetBrains Mono',monospace"}}>{e.high}H</span>}
                    {e.medium>0  && <span style={{fontSize:10,color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{e.medium}M</span>}
                    {e.low>0     && <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{e.low}L</span>}
                    <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{e.total} total</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Engagement detail */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card style={{border:`1px solid ${T.red}22`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim,marginBottom:4}}>{eng.id}</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:18,color:T.textBright,marginBottom:6}}>{eng.title}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <Badge color={engStatC[eng.status]||T.textDim}>{eng.status.toUpperCase()}</Badge>
                    <Badge color={T.purple}>{eng.type}</Badge>
                    <Badge color={eng.risk==="High"?T.red:eng.risk==="Medium"?T.amber:T.green}>{eng.risk} Risk</Badge>
                  </div>
                </div>
                {eng.total>0 && (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[{l:"CVSS Avg",v:eng.cvss_avg,c:T.amber},{l:"Remediated",v:`${eng.remediated}/${eng.total}`,c:T.green},{l:"Still Open",v:eng.open,c:eng.open>0?T.red:T.green},{l:"Methodology",v:eng.methodology.split("+")[0],c:T.textDim}].map(({l,v,c})=>(
                      <div key={l} style={{padding:"7px 10px",background:T.bg2,borderRadius:5,textAlign:"center"}}>
                        <div style={{fontSize:9,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginBottom:2}}>{l.toUpperCase()}</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {[["Scope",eng.scope],["Tester",eng.tester],["Approved By",eng.approved],["Methodology",eng.methodology],["Started",eng.started],["Completed",eng.completed]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{k}</span>
                  <span style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",textAlign:"right",maxWidth:280}}>{v}</span>
                </div>
              ))}
              {eng.total>0 && (
                <div style={{marginTop:14,display:"flex",gap:8}}>
                  <button onClick={()=>setTab("findings")} style={{padding:"8px 18px",background:`${T.red}14`,border:`1px solid ${T.red}44`,borderRadius:5,color:T.red,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>View Findings →</button>
                  <button style={{padding:"8px 18px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:5,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>↓ Full Report PDF</button>
                </div>
              )}
            </Card>
            {eng.total>0 && (
              <Card>
                <SectionHeader label="Finding Severity Distribution" accent={T.red}/>
                <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80,marginBottom:10}}>
                  {[{l:"Critical",v:eng.critical,c:T.red},{l:"High",v:eng.high,c:T.amber},{l:"Medium",v:eng.medium,c:T.cyan},{l:"Low",v:eng.low,c:T.textDim},{l:"Info",v:eng.info,c:T.textDim+"55"}].map(s=>{
                    const maxV = Math.max(eng.critical,eng.high,eng.medium,eng.low,eng.info,1);
                    return (
                      <div key={s.l} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",justifyContent:"flex-end"}}>
                        <div style={{fontSize:11,fontWeight:700,color:s.c,fontFamily:"'JetBrains Mono',monospace",marginBottom:3}}>{s.v}</div>
                        <div style={{width:"100%",background:`${s.c}bb`,borderRadius:"3px 3px 0 0",height:`${(s.v/maxV)*100}%`,minHeight:s.v>0?4:0,transition:"height .5s"}}/>
                        <div style={{fontSize:9,color:T.textDim,marginTop:4,fontFamily:"'JetBrains Mono',monospace"}}>{s.l.slice(0,4)}</div>
                      </div>
                    );
                  })}
                </div>
                <ProgressBar value={Math.round((eng.remediated/eng.total)*100)} color={T.green} label="Remediation Progress"/>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* FINDINGS */}
      {tab==="findings" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}>
            <select onChange={e=>setSelEng(e.target.value)} value={selEng}
              style={{padding:"7px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",cursor:"pointer"}}>
              {ENGAGEMENTS.filter(e=>e.findings.length>0).map(e=><option key={e.id} value={e.id}>{e.id}: {e.title.slice(0,40)}</option>)}
            </select>
            <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",marginLeft:"auto"}}>{eng.findings.length} findings</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {eng.findings.map(f=>(
              <Card key={f.id} style={{border:`1px solid ${sevC[f.sev]}22`,borderLeft:`4px solid ${sevC[f.sev]}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{display:"flex",gap:8,marginBottom:6}}>
                      <Badge color={sevC[f.sev]}>{f.sev}</Badge>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:T.amber}}>CVSS {f.cvss}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{f.cve}</span>
                      <Badge color={statC[f.status]}>{f.status.toUpperCase()}</Badge>
                    </div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:16,color:T.textBright,marginBottom:5}}>{f.title}</div>
                    <div style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.7,marginBottom:8}}>{f.desc}</div>
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,flexShrink:0,marginLeft:20}}>{f.id}</span>
                </div>
                <div style={{padding:"10px 14px",background:f.status==="remediated"?`${T.green}08`:`${T.amber}08`,border:`1px solid ${f.status==="remediated"?T.green:T.amber}33`,borderRadius:5}}>
                  <div style={{fontSize:11,color:f.status==="remediated"?T.green:T.amber,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,marginBottom:3}}>
                    {f.status==="remediated"?"✓ Remediation Applied":"⚠ Remediation Pending"}
                  </div>
                  <div style={{fontSize:12,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.6}}>{f.fix}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TOOLS */}
      {tab==="tools" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {TOOLS.map(tool=>(
            <Card key={tool.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>{tool.icon}</span>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:T.textBright}}>{tool.name}</div>
                    <div style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{tool.desc}</div>
                  </div>
                </div>
                <button onClick={()=>runTool(tool.id)} disabled={!!runningTool} style={{padding:"6px 14px",background:runningTool===tool.id?T.bg3:`${tool.color}14`,border:`1px solid ${tool.color}44`,borderRadius:4,color:runningTool===tool.id?T.textDim:tool.color,cursor:runningTool?"default":"pointer",fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12}}>
                  {runningTool===tool.id?`${toolPct[tool.id]||0}%`:"▶ Run"}
                </button>
              </div>
              <div style={{background:T.bg0,borderRadius:4,padding:"4px 8px",marginBottom:8,border:`1px solid ${T.border}`}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan}}>$ {tool.cmd}</span>
              </div>
              {runningTool===tool.id && <ProgressBar value={toolPct[tool.id]||0} color={tool.color}/>}
              {toolOutput[tool.id]?.length>0 && (
                <div style={{background:"#070a0e",borderRadius:4,padding:"8px 10px",maxHeight:120,overflowY:"auto",border:`1px solid ${T.border}`,marginTop:6}}>
                  {toolOutput[tool.id].map((l,i)=>(
                    <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:l.includes("[CRITICAL]")||l.includes("ERROR")?T.red:l.includes("[WARNING]")||l.includes("WARNING")?T.amber:l.includes("[INFO]")?T.cyan:T.textDim,lineHeight:1.7,whiteSpace:"pre"}}>{l||" "}</div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* METHODOLOGY */}
      {tab==="methodology" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Testing Methodology — PTES + OWASP WSTG" accent={T.red}/>
            {[
              {phase:"1. Pre-Engagement",          tasks:["Scope definition & rules of engagement","Legal authorization (signed SOW)","Threat modeling & asset identification","Emergency contact procedures"],color:T.textDim},
              {phase:"2. Intelligence Gathering",   tasks:["OSINT: WHOIS, DNS, cert transparency","Shodan / Censys external exposure","LinkedIn / GitHub employee enumeration","Technology stack fingerprinting"],color:T.cyan},
              {phase:"3. Vulnerability Analysis",   tasks:["Automated scanning (Nessus, OpenVAS)","Manual code review (SAST findings)","Custom PoC development","Business logic flaw identification"],color:T.amber},
              {phase:"4. Exploitation",             tasks:["Controlled exploitation in lab","Proof-of-concept for each finding","Lateral movement simulation","Privilege escalation attempts"],color:T.red},
              {phase:"5. Post-Exploitation",        tasks:["Data access scope validation","Persistence mechanisms tested","Clean-up and artefact removal","Evidence collection for report"],color:T.purple},
              {phase:"6. Reporting",                tasks:["Executive summary (non-technical)","Technical findings with CVSS scores","Remediation guidance per finding","Retest after fixes applied"],color:T.green},
            ].map((p,i)=>(
              <div key={i} style={{padding:"10px 14px",background:T.bg2,borderRadius:6,marginBottom:8,borderLeft:`3px solid ${p.color}`}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:6}}>{p.phase}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {p.tasks.map(t=>(
                    <div key={t} style={{padding:"3px 8px",background:T.bg0,border:`1px solid ${p.color}33`,borderRadius:3,fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>✓ {t}</div>
                  ))}
                </div>
              </div>
            ))}
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <SectionHeader label="Compliance & Standards" accent={T.purple}/>
              {[["OWASP WSTG v4.2","Web Security Testing Guide","✓ Adopted"],["PTES","Penetration Testing Execution Standard","✓ Adopted"],["CREST","Council of Registered Ethical Security Testers","✓ Compliant"],["CVSS v3.1","Common Vulnerability Scoring System","✓ All findings scored"],["CVE/CWE","Vulnerability naming standards","✓ Cross-referenced"],["NIST SP 800-115","Technical Guide to InfoSec Testing","✓ Reference"]].map(([std,desc,status])=>(
                <div key={std} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div>
                    <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.textBright}}>{std}</div>
                    <div style={{fontSize:11,color:T.textDim,fontFamily:"'Rajdhani',sans-serif"}}>{desc}</div>
                  </div>
                  <Badge color={T.green}>{status}</Badge>
                </div>
              ))}
            </Card>
            <Card>
              <SectionHeader label="Authorisation & Scope Controls" accent={T.amber}/>
              {["Signed Statement of Work (SOW) required before any testing","Emergency stop procedure: security@zolextech.com / +1-404-555-0100","Testing window: Mon-Fri 09:00-18:00 ET (prod) / 24h (staging)","All tests conducted from approved tester IP ranges","Destructive tests (DoS, data deletion) explicitly excluded","Findings embargoed 30 days before public disclosure"].map((r,i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                  <span style={{color:T.amber,fontSize:12,flexShrink:0}}>{i+1}.</span>
                  <span style={{fontSize:13,color:T.text,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.5}}>{r}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// AUDIT & LOGGING VIEW
// ═══════════════════════════════════════════════════════════════════════
const AuditView = () => {
  const [tab, setTab]     = useState("trail");
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [exportFormat, setExportFormat] = useState("CSV");
  const [exporting, setExporting] = useState(false);

  const AUDIT_LOG = [
    { id:"AUD-8841", ts:"2026-05-07 09:42:11", user:"adebayo@zolextech.com", role:"Owner",   action:"ISOLATE_ASSET",      resource:"10.0.2.45",              result:"success", ip:"72.34.201.18", detail:"Host isolated per incident INC-001" },
    { id:"AUD-8840", ts:"2026-05-07 09:38:42", user:"amaka@zolextech.com",   role:"Analyst", action:"CREATE_WAF_RULE",     resource:"WAF/block-185.220.101.8", result:"success", ip:"72.34.201.22", detail:"WAF block rule created for attacker IP" },
    { id:"AUD-8839", ts:"2026-05-07 09:35:18", user:"adebayo@zolextech.com", role:"Owner",   action:"ESCALATE_INCIDENT",  resource:"INC-001",                 result:"success", ip:"72.34.201.18", detail:"Severity escalated to P1, CISO notified" },
    { id:"AUD-8838", ts:"2026-05-07 09:28:04", user:"System",                role:"System",  action:"AUTO_DETECT",        resource:"Network:10.0.2.45",       result:"success", ip:"—",            detail:"Lateral movement pattern detected by correlation engine" },
    { id:"AUD-8837", ts:"2026-05-07 06:44:31", user:"chidera@zolextech.com", role:"Admin",   action:"UPDATE_S3_ACL",      resource:"s3://zolextech-prod",     result:"success", ip:"72.34.201.19", detail:"Public ACL removed — reverted to private" },
    { id:"AUD-8836", ts:"2026-05-07 06:33:14", user:"System",                role:"System",  action:"CLOUDTRAIL_ALERT",   resource:"s3://zolextech-prod",     result:"warn",    ip:"—",            detail:"PutBucketAcl: public-read set by dev user" },
    { id:"AUD-8835", ts:"2026-05-07 03:00:00", user:"Automation",            role:"System",  action:"PATCH_APPLIED",      resource:"eks-node-01",             result:"success", ip:"—",            detail:"Kernel security patch applied — reboot pending" },
    { id:"AUD-8834", ts:"2026-05-07 02:00:04", user:"AWS",                   role:"System",  action:"BACKUP_COMPLETED",   resource:"zolextech-prod (RDS)",    result:"success", ip:"—",            detail:"Automated backup to S3 — 30d retention" },
    { id:"AUD-8833", ts:"2026-05-06 17:22:31", user:"adebayo@zolextech.com", role:"Owner",   action:"API_KEY_CREATED",    resource:"API/Terraform-CLI",       result:"success", ip:"72.34.201.18", detail:"New API key generated for Terraform CLI" },
    { id:"AUD-8832", ts:"2026-05-06 14:11:52", user:"funke@zolextech.com",   role:"Engineer",action:"COMPLIANCE_SCAN",    resource:"Framework/SOC2",          result:"success", ip:"72.34.201.31", detail:"SOC2 audit scan completed — 94% coverage" },
    { id:"AUD-8831", ts:"2026-05-06 11:04:28", user:"adebayo@zolextech.com", role:"Owner",   action:"USER_INVITED",       resource:"Team/oluwaseun@zt.com",   result:"success", ip:"72.34.201.18", detail:"Invitation sent — Security Engineer role" },
    { id:"AUD-8830", ts:"2026-05-06 09:22:15", user:"emeka@zolextech.com",   role:"DevOps",  action:"TF_APPLY",           resource:"IaC/prod-vpc",            result:"failed",  ip:"72.34.201.24", detail:"TF Apply failed — IAM permission denied on eks_node" },
    { id:"AUD-8829", ts:"2026-05-05 22:18:44", user:"System",                role:"System",  action:"CERT_RENEWED",       resource:"TLS/*.zolextech.com",     result:"success", ip:"—",            detail:"TLS certificate renewed via Let's Encrypt — 90d" },
    { id:"AUD-8828", ts:"2026-05-05 18:33:07", user:"chidera@zolextech.com", role:"Admin",   action:"ROLE_CHANGED",       resource:"Team/funke@zt.com",       result:"success", ip:"72.34.201.19", detail:"Role changed from Viewer to Security Engineer" },
    { id:"AUD-8827", ts:"2026-05-05 15:44:22", user:"adebayo@zolextech.com", role:"Owner",   action:"LOGIN_MFA",          resource:"Auth/Session",            result:"success", ip:"72.34.201.18", detail:"MFA verified — new session created" },
  ];

  const ACTIONS = [...new Set(AUDIT_LOG.map(l=>l.action))];
  const USERS   = [...new Set(AUDIT_LOG.map(l=>l.user))];
  const resultC = { success:T.green, warn:T.amber, failed:T.red };
  const actionC = { ISOLATE_ASSET:T.red, CREATE_WAF_RULE:T.red, ESCALATE_INCIDENT:T.red, AUTO_DETECT:T.purple, UPDATE_S3_ACL:T.amber, CLOUDTRAIL_ALERT:T.amber, PATCH_APPLIED:T.green, BACKUP_COMPLETED:T.green, API_KEY_CREATED:T.cyan, COMPLIANCE_SCAN:T.purple, USER_INVITED:T.cyan, TF_APPLY:T.amber, CERT_RENEWED:T.green, ROLE_CHANGED:T.amber, LOGIN_MFA:T.textDim };

  const filtered = AUDIT_LOG.filter(l=>
    (userFilter==="ALL" || l.user===userFilter) &&
    (actionFilter==="ALL" || l.action===actionFilter) &&
    (!search || l.action.includes(search.toUpperCase()) || l.user.includes(search) || l.resource.toLowerCase().includes(search.toLowerCase()) || l.detail.toLowerCase().includes(search.toLowerCase()))
  );

  const doExport = () => {
    setExporting(true);
    setTimeout(()=>setExporting(false), 1800);
  };

  const RETENTION_POLICIES = [
    { name:"Security Events",         retention:"2 years",  storage:"S3 + CloudWatch",  encrypted:true,  immutable:true  },
    { name:"Authentication Logs",     retention:"1 year",   storage:"CloudWatch Logs",  encrypted:true,  immutable:false },
    { name:"API Access Logs",         retention:"90 days",  storage:"S3",               encrypted:true,  immutable:false },
    { name:"Audit Trail",             retention:"7 years",  storage:"S3 Glacier",       encrypted:true,  immutable:true  },
    { name:"Incident Records",        retention:"7 years",  storage:"S3 + SIEM",        encrypted:true,  immutable:true  },
    { name:"Compliance Evidence",     retention:"10 years", storage:"S3 Glacier",       encrypted:true,  immutable:true  },
    { name:"Network Flow Logs",       retention:"1 year",   storage:"S3",               encrypted:true,  immutable:false },
    { name:"Container Logs",          retention:"30 days",  storage:"CloudWatch Logs",  encrypted:true,  immutable:false },
  ];

  const INTEGRITY_CHECKS = [
    { check:"Audit log hash chain integrity",          status:"pass", last:"2m ago"   },
    { check:"Log stream continuity (no gaps)",         status:"pass", last:"5m ago"   },
    { check:"CloudTrail validation",                   status:"pass", last:"10m ago"  },
    { check:"S3 audit bucket WORM policy",             status:"pass", last:"1h ago"   },
    { check:"KMS key active (audit encryption)",       status:"pass", last:"1h ago"   },
    { check:"Log delivery to SIEM (no drops)",         status:"warn", last:"30m ago"  },
    { check:"Timestamp synchronisation (NTP)",         status:"pass", last:"2m ago"   },
  ];

  const TABS = ["trail","retention","integrity","reports"];
  const TL   = { trail:"◧ Audit Trail", retention:"⬡ Retention Policies", integrity:"✓ Integrity Checks", reports:"◈ Audit Reports" };

  return (
    <div className="fadeIn">
      <div style={{display:"flex",gap:12,marginBottom:18,flexWrap:"wrap"}}>
        <MetricCard label="EVENTS TODAY"  value={AUDIT_LOG.filter(l=>l.ts.startsWith("2026-05-07")).length} icon="◧" color={T.cyan}/>
        <MetricCard label="FAILURES"      value={AUDIT_LOG.filter(l=>l.result==="failed").length}           icon="✗" color={T.red}/>
        <MetricCard label="HIGH RISK OPS" value={AUDIT_LOG.filter(l=>["ISOLATE_ASSET","ESCALATE_INCIDENT","UPDATE_S3_ACL"].includes(l.action)).length} icon="⚠" color={T.amber}/>
        <MetricCard label="RETENTION MAX" value="10" unit="yr" icon="⬡" color={T.green}/>
        <MetricCard label="INTEGRITY"     value={INTEGRITY_CHECKS.filter(c=>c.status==="pass").length+"/"+INTEGRITY_CHECKS.length} icon="✓" color={T.green}/>
        <MetricCard label="STORAGE USED"  value="2.4" unit="TB" icon="🗄" color={T.purple}/>
      </div>

      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${T.border}`}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",background:"transparent",borderBottom:tab===t?`2px solid ${T.cyan}`:"2px solid transparent",border:"none",cursor:"pointer",color:tab===t?T.cyan:T.textDim,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13}}>
            {TL[t]}
          </button>
        ))}
      </div>

      {/* AUDIT TRAIL */}
      {tab==="trail" && (
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search action, user, resource, detail…"
                style={{padding:"7px 12px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.textBright,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",width:260}}
                onFocus={e=>e.target.style.borderColor=T.cyan} onBlur={e=>e.target.style.borderColor=T.border}/>
              <select value={userFilter} onChange={e=>setUserFilter(e.target.value)}
                style={{padding:"7px 10px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",cursor:"pointer"}}>
                <option value="ALL">All Users</option>
                {USERS.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
              <select value={actionFilter} onChange={e=>setActionFilter(e.target.value)}
                style={{padding:"7px 10px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",cursor:"pointer"}}>
                <option value="ALL">All Actions</option>
                {ACTIONS.map(a=><option key={a} value={a}>{a}</option>)}
              </select>
              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <select value={exportFormat} onChange={e=>setExportFormat(e.target.value)}
                  style={{padding:"6px 10px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:5,color:T.text,fontFamily:"'JetBrains Mono',monospace",fontSize:11,outline:"none",cursor:"pointer"}}>
                  {["CSV","JSON","NDJSON","Splunk HEC"].map(f=><option key={f}>{f}</option>)}
                </select>
                <button onClick={doExport} disabled={exporting} style={{padding:"6px 14px",background:exporting?T.bg3:`${T.green}14`,border:`1px solid ${T.green}44`,borderRadius:5,color:exporting?T.textDim:T.green,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:12,cursor:exporting?"default":"pointer"}}>
                  {exporting?"⟳ Exporting…":"↓ Export"}
                </button>
              </div>
            </div>
          </Card>

          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{maxHeight:540,overflowY:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead style={{position:"sticky",top:0,background:T.bg1,zIndex:2}}>
                  <tr style={{borderBottom:`1px solid ${T.border}`}}>
                    {["Timestamp","User","Action","Resource","Result","IP","Detail"].map(h=>(
                      <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>{filtered.map((l,i)=>(
                  <tr key={l.id} style={{borderBottom:`1px solid ${T.border}11`,transition:"background .1s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":T.bg0+"44"}>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,whiteSpace:"nowrap"}}>{l.ts}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.cyan,whiteSpace:"nowrap"}}>{l.user.split("@")[0]}</td>
                    <td style={{padding:"9px 12px"}}>
                      <span style={{fontSize:10,color:actionC[l.action]||T.textDim,background:`${actionC[l.action]||T.textDim}12`,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>{l.action}</span>
                    </td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.resource}</td>
                    <td style={{padding:"9px 12px"}}><Badge color={resultC[l.result]}>{l.result.toUpperCase()}</Badge></td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:T.textDim}}>{l.ip}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:T.text,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.detail}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{padding:"8px 14px",borderTop:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} of {AUDIT_LOG.length} records · AUD-{AUDIT_LOG[AUDIT_LOG.length-1].id.split("-")[1]} to AUD-{AUDIT_LOG[0].id.split("-")[1]}</span>
              <div style={{display:"flex",gap:6}}>
                {["←","1","2","3","→"].map(p=><button key={p} style={{padding:"3px 8px",background:p==="1"?`${T.cyan}18`:"transparent",border:`1px solid ${p==="1"?T.cyan:T.border}`,borderRadius:3,color:p==="1"?T.cyan:T.textDim,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:10}}>{p}</button>)}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* RETENTION */}
      {tab==="retention" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <SectionHeader label="Log Retention Policies"/>
            <div style={{display:"flex",gap:8}}>
              <Badge color={T.green}>GDPR Compliant</Badge>
              <Badge color={T.cyan}>SOC2 CC7.2</Badge>
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
              {["Log Type","Retention","Storage","Encrypted","WORM/Immutable"].map(h=>(
                <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace",fontWeight:400,letterSpacing:1}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{RETENTION_POLICIES.map((p,i)=>(
              <tr key={p.name} style={{borderBottom:`1px solid ${T.border}22`,background:i%2===0?"transparent":T.bg0+"44"}}
                onMouseEnter={e=>e.currentTarget.style.background=T.bg2}
                onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":T.bg0+"44"}>
                <td style={{padding:"11px 14px",fontFamily:"'Rajdhani',sans-serif",fontSize:14,fontWeight:700,color:T.textBright}}>{p.name}</td>
                <td style={{padding:"11px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:T.amber}}>{p.retention}</td>
                <td style={{padding:"11px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:T.textDim}}>{p.storage}</td>
                <td style={{padding:"11px 14px",textAlign:"center"}}><span style={{fontSize:15}}>{p.encrypted?"🔒":"—"}</span></td>
                <td style={{padding:"11px 14px",textAlign:"center"}}><span style={{fontSize:15,color:p.immutable?T.green:T.textDim}}>{p.immutable?"✓ WORM":"—"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}

      {/* INTEGRITY */}
      {tab==="integrity" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Log Integrity Checks" accent={T.green}/>
            {INTEGRITY_CHECKS.map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c.status==="pass"?T.green:T.amber,animation:c.status==="pass"?"pulse 3s infinite":"none",flexShrink:0}}/>
                  <span style={{fontSize:13,color:T.textBright,fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{c.check}</span>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:10,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{c.last}</span>
                  <Badge color={c.status==="pass"?T.green:T.amber}>{c.status.toUpperCase()}</Badge>
                </div>
              </div>
            ))}
            <div style={{marginTop:14,padding:"10px 14px",background:`${T.green}08`,border:`1px solid ${T.green}33`,borderRadius:6}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:13,color:T.green,marginBottom:3}}>✓ Audit trail integrity verified</div>
              <div style={{fontSize:12,color:T.textDim}}>SHA-256 hash chain validated. All {AUDIT_LOG.length} records in scope intact. Last full verification: 2 minutes ago.</div>
            </div>
          </Card>

          <Card>
            <SectionHeader label="Chain of Custody" accent={T.cyan}/>
            <div style={{fontSize:12,color:T.textDim,fontFamily:"'Rajdhani',sans-serif",lineHeight:1.7,marginBottom:14}}>
              Every audit record is signed with a hash that includes the previous record&apos;s hash, creating a tamper-evident chain. Any modification to historical records will break the hash chain and trigger an alert.
            </div>
            {[
              {label:"Hash Algorithm",       value:"SHA-256"},
              {label:"Chain Length",         value:`${AUDIT_LOG.length} records`},
              {label:"Genesis Record",       value:"AUD-0001 (Jan 2025)"},
              {label:"Current Tip",          value:"AUD-8841"},
              {label:"KMS Signing Key",      value:"alias/secureops-audit"},
              {label:"Verification Interval",value:"Every 5 minutes"},
              {label:"Alert on Tampering",   value:"PagerDuty + Slack"},
              {label:"WORM Compliance",      value:"S3 Object Lock (7yr)"},
            ].map(({label,value})=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{label}</span>
                <span style={{fontSize:12,color:T.cyan,fontFamily:"'JetBrains Mono',monospace"}}>{value}</span>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* AUDIT REPORTS */}
      {tab==="reports" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <Card>
            <SectionHeader label="Scheduled Audit Reports" accent={T.gold}/>
            {[
              {name:"Weekly Security Operations Report",    schedule:"Every Monday 08:00",  recipients:["CISO","Security Team"],            format:"PDF + Email",last:"May 5"},
              {name:"Monthly Compliance Evidence Pack",     schedule:"1st of month 06:00",  recipients:["Compliance Officer","Auditor"],    format:"PDF + S3",   last:"May 1"},
              {name:"Quarterly Board Risk Report",          schedule:"End of quarter",       recipients:["Board","CEO","CFO"],               format:"PDF + Slides",last:"Mar 31"},
              {name:"Privileged Access Weekly Review",     schedule:"Every Friday 17:00",  recipients:["CISO","IT Manager"],              format:"CSV + Email", last:"May 2"},
              {name:"Daily Failed Auth Summary",            schedule:"Daily 07:00",          recipients:["Security Operations"],             format:"Email",      last:"Today"},
              {name:"SOC2 Continuous Control Evidence",    schedule:"Every Sunday 02:00",  recipients:["Compliance","Auditor Mailbox"],    format:"S3 Archive", last:"May 4"},
            ].map((r,i)=>(
              <div key={i} style={{padding:"11px 14px",background:T.bg2,borderRadius:6,marginBottom:8,border:`1px solid ${T.border}`}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:14,color:T.textBright,marginBottom:4}}>{r.name}</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:5}}>
                  <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>⏱ {r.schedule}</span>
                  <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>Last: {r.last}</span>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {r.recipients.map(rec=><span key={rec} style={{fontSize:10,color:T.purple,background:`${T.purple}12`,padding:"2px 7px",borderRadius:3,fontFamily:"'JetBrains Mono',monospace"}}>{rec}</span>)}
                  <Badge color={T.amber}>{r.format}</Badge>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionHeader label="Recent Audit Activities" accent={T.amber}/>
            {[
              {action:"External pen test completed",   type:"security",   date:"May 1",     user:"RedTeam Solutions",    sev:"critical"},
              {action:"SOC2 audit evidence submitted", type:"compliance",  date:"Apr 30",    user:"Adebayo Paul",         sev:"info"},
              {action:"IAM quarterly access review",  type:"access",      date:"Apr 28",    user:"Chidera Okonkwo",      sev:"medium"},
              {action:"Privileged session reviewed",  type:"access",      date:"Apr 25",    user:"Security Ops",         sev:"info"},
              {action:"Data retention policy updated",type:"governance",  date:"Apr 20",    user:"Adebayo Paul",         sev:"low"},
              {action:"ISO 27001 internal audit",     type:"compliance",  date:"Apr 15",    user:"Compliance Officer",   sev:"high"},
              {action:"Vendor risk assessment",       type:"governance",  date:"Apr 10",    user:"Adebayo Paul",         sev:"medium"},
              {action:"DR test completed",            type:"operations",  date:"Apr 8",     user:"Emeka Nwachukwu",      sev:"info"},
            ].map((a,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:32,height:32,borderRadius:7,background:`${a.sev==="critical"?T.red:a.sev==="high"?T.amber:a.sev==="medium"?T.cyan:T.textDim}14`,border:`1px solid ${a.sev==="critical"?T.red:a.sev==="high"?T.amber:a.sev==="medium"?T.cyan:T.border}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>
                  {a.type==="security"?"🛡":a.type==="compliance"?"❑":a.type==="access"?"◈":"◧"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600,fontSize:13,color:T.textBright,marginBottom:2}}>{a.action}</div>
                  <div style={{display:"flex",gap:10}}>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.user}</span>
                    <span style={{fontSize:11,color:T.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{a.date}</span>
                  </div>
                </div>
                <Badge color={a.sev==="critical"?T.red:a.sev==="high"?T.amber:a.sev==="medium"?T.cyan:T.textDim}>{a.sev.toUpperCase()}</Badge>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

// ROOT APP
// ═══════════════════════════════════════════════════════════════════════
const INITIAL_NOTIFS = [
  { id:1,  type:"critical", icon:"⚠", title:"Critical threat detected",           body:"Lateral movement via SMB — 10.0.2.45 → 10.0.3.12. Immediate investigation required.",  time:"2m ago",  read:false, action:"incident"  },
  { id:2,  type:"warn",     icon:"⌬", title:"Pipeline pl-003 failed",             body:"zolextech/infra — TF Plan failed: Insufficient IAM permissions on eks_node role.",      time:"18m ago", read:false, action:"cicd"      },
  { id:11, type:"critical", icon:"⟁", title:"SIEM: Brute force alert firing",      body:"ALR-001 triggered — 5 auth failures from 185.220.101.8 within 60s. 5× today.",         time:"8m ago",  read:false, action:"siem"      },
  { id:12, type:"critical", icon:"◧", title:"Asset compromised — 10.0.2.45",       body:"Lateral movement detected from prod-host-compromised. Asset isolated per INC-001.",      time:"20m ago", read:false, action:"assets"    },
  { id:3,  type:"info",     icon:"✓", title:"Deployment successful",               body:"zolextech/backend v2.4.1 deployed to production. 3/3 EKS replicas healthy.",           time:"34m ago", read:false, action:"cicd"      },
  { id:4,  type:"critical", icon:"◉", title:"CRITICAL CVE: CVE-2023-44487",        body:"HTTP/2 Rapid Reset in nginx:1.24.0. Upgrade to ≥1.25.3 immediately.",                  time:"1h ago",  read:false, action:"scanning"  },
  { id:5,  type:"warn",     icon:"❑", title:"Compliance gap detected",             body:"ISO 27001 A.16.1 Incident Management — evidence plan last updated June 2024.",         time:"2h ago",  read:true,  action:"compliance"},
  { id:6,  type:"info",     icon:"⬡", title:"Terraform drift detected",            body:"3 resources have drifted from IaC state — S3 versioning, Redis replicas, SG ingress.", time:"3h ago",  read:true,  action:"iac"       },
  { id:7,  type:"success",  icon:"🔐", title:"SOC2 audit scan complete",           body:"94% coverage across 11 controls. 1 warning (CC7.2), 0 failures.",                     time:"4h ago",  read:true,  action:"compliance"},
  { id:8,  type:"warn",     icon:"◈", title:"Redis degraded",                      body:"ElastiCache redis cluster running at 1/2 replicas. Cache hit ratio: 61%.",             time:"5h ago",  read:true,  action:"docker"    },
  { id:9,  type:"info",     icon:"⊞", title:"New team member invited",             body:"Invitation sent to oluwaseun@zolextech.com (Security Engineer). Pending acceptance.", time:"6h ago",  read:true,  action:"team"      },
  { id:10, type:"info",     icon:"◎", title:"Invoice generated",                   body:"INV-2026-05 — Pro Plan — $119.00. Due June 1, 2026.",                                 time:"1d ago",  read:true,  action:"billing"   },
];

export default function App() {
  const [user,      setUser]      = useState(null);
  const [active,    setActive]    = useState("dashboard");
  const [time,      setTime]      = useState(new Date().toLocaleTimeString());
  const [cmdOpen,   setCmdOpen]   = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen,setSearchOpen]= useState(false);
  const [shortcutsOpen,setShortcutsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [toast, setToast] = useState(null);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  useInterval(()=>setTime(new Date().toLocaleTimeString()),1000);

  // Keyboard shortcuts
  useEffect(()=>{
    const handler = (e) => {
      if (!user) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key==="k") { e.preventDefault(); setCmdOpen(o=>!o); }
      if (mod && (e.key==="f"||e.key==="F")) { e.preventDefault(); setSearchOpen(o=>!o); }
      if (mod && e.key==="b") { e.preventDefault(); setSidebarCollapsed(o=>!o); }
      if (e.key==="?" && !e.target.closest("input,textarea")) setShortcutsOpen(o=>!o);
      if (e.key==="Escape") { setCmdOpen(false); setNotifOpen(false); setSearchOpen(false); setShortcutsOpen(false); }
      // G + key navigation shortcuts
      if (e.key==="g" && !e.target.closest("input,textarea")) {
        const navMap = { d:"dashboard", c:"cicd", i:"iac", s:"scanning", t:"threat", a:"ai", r:"reports", e:"events", v:"vuln", l:"siem", k:"risk", n:"network", x:"incident", p:"pentest", u:"audit", m:"assets" };
        const next = (ev2) => { if (navMap[ev2.key]) { nav(navMap[ev2.key]); } document.removeEventListener("keydown",next); };
        document.addEventListener("keydown", next);
        setTimeout(()=>document.removeEventListener("keydown",next),1500);
      }
    };
    document.addEventListener("keydown", handler);
    return ()=>document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user]);

  const showToast = (msg, color=T.green) => {
    setToast({msg,color});
    setTimeout(()=>setToast(null),3000);
  };

  const nav = (id) => {
    setActive(id);
    setCmdOpen(false);
    setNotifOpen(false);
    setSearchOpen(false);
    // Build breadcrumb
    const crumb = TITLES_MAP[id]?.[0] || id;
    setBreadcrumbs(prev => {
      const next = prev.filter(b=>b.id!==id);
      return [{id,label:crumb},...next].slice(0,4);
    });
  };

  const TITLES_MAP = {
    dashboard:  ["Security Dashboard",       "Real-time threat intelligence & infrastructure health"],
    cicd:       ["CI/CD Pipeline Monitor",   "Build, test, scan & deploy automation"],
    iac:        ["Infrastructure as Code",   "Terraform · AWS · Multi-workspace · Drift detection"],
    scanning:   ["Security Scanning",        "SAST · DAST · Container · IaC Policy"],
    vuln:       ["Vulnerability Management", "CVE tracking · CVSS scoring · SLA compliance · Auto-remediation"],
    cloud:      ["Cloud Security Posture",   "CSPM · CIS benchmarks · AWS findings · Auto-fix"],
    siem:       ["SIEM & Log Analysis",      "Log search · Live stream · Alert rules · Event correlations"],
    pentest:    ["Penetration Testing",      "Engagements · Findings · Tools · PTES methodology"],
    compliance: ["Compliance Reporting",     "SOC 2 Type II · ISO 27001:2022 · NIST CSF"],
    risk:       ["Risk Register",            "Risk identification · Heat matrix · Treatment plans · Board reporting"],
    threat:     ["Threat Hunting",           "IOC feeds · Hunt queries · MITRE ATT&CK · Actors"],
    incident:   ["Incident Response",        "Active incidents · Playbooks · NIST SP 800-61 · Metrics"],
    network:    ["Network Topology",         "Live topology · Segments · Firewall rules · Traffic analysis"],
    assets:     ["Asset Inventory",          "CMDB · Discovery · SBOM · Change history · Coverage"],
    audit:      ["Audit & Logging",          "Tamper-evident audit trail · Retention policies · Integrity checks"],
    grafana:    ["Grafana Plugin Studio",    "npx @grafana/create-plugin@latest · Build · Publish"],
    ai:         ["AI Security Analyst",      "Claude Sonnet · Threat analysis · Code review · Incident response"],
    events:     ["Live Event Stream",        "Real-time feed · WebSocket · 500-event buffer · Filters"],
    docker:     ["Services & Containers",    "Docker Compose · NGINX config · Health · Log viewer"],
    reports:    ["Security Reports",         "Generate · Schedule · Export · PDF · Compliance evidence"],
    team:       ["Team Management",          "Members · Roles · Invitations · Audit log"],
    devportal:  ["Developer Portal",         "REST API · SDKs · Webhooks · Rate limits · Interactive docs"],
    billing:    ["Billing & Plans",          "Manage subscription, payments, and invoices"],
    settings:   ["Platform Settings",        "General · Security policies · Integrations · Webhooks · Advanced"],
    account:    ["My Account",               "Profile · Security · Notifications · API Keys"],
  };

  const VIEWS = {
    dashboard:DashboardView,  cicd:CICDView,         iac:IaCView,
    scanning:ScanningView,    vuln:VulnView,          cloud:CloudView,
    siem:SIEMView,            pentest:PentestView,    compliance:ComplianceView,
    risk:RiskView,            threat:ThreatView,      incident:IncidentView,
    network:NetworkView,      assets:AssetView,       audit:AuditView,
    grafana:GrafanaView,      ai:AIAnalystView,       events:EventsView,
    docker:DockerView,        reports:ReportsView,    team:TeamView,
    devportal:DevPortalView,  billing:BillingView,    settings:SettingsView,
    account:AccountView,
  };

  if (!user) return <LoginScreen onAuth={u=>{setUser(u);showToast(`Welcome back, ${u.name?.split(" ")[0]}!`);}} />;

  const View    = VIEWS[active] || DashboardView;
  const [title, subtitle] = TITLES_MAP[active] || ["ZolexTech Security",""];
  const UNREAD  = notifs.filter(n => !n.read).length;
  const sideW   = sidebarCollapsed ? 64 : 224;

  return (
    <div style={{ minHeight:"100vh", background:T.bg0, position:"relative", overflow:"hidden" }}>
      <GlobalStyle />

      {/* Overlays */}
      {cmdOpen    && <CommandPalette   onNav={nav} onClose={()=>setCmdOpen(false)}    />}
      {searchOpen && <GlobalSearch     onNav={nav} onClose={()=>setSearchOpen(false)} />}
      {notifOpen  && <NotificationsPanel onNav={nav} onClose={()=>setNotifOpen(false)} notifs={notifs} setNotifs={setNotifs} />}
      {shortcutsOpen && <ShortcutsHelp onClose={()=>setShortcutsOpen(false)} />}

      {/* Floating Quick-Launch FAB */}
      {!cmdOpen && !searchOpen && (
        <div style={{ position:"fixed", bottom:42, right:28, zIndex:400, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
          <div style={{ display:"flex", gap:6, flexDirection:"column", alignItems:"flex-end" }}>
            {[
              {label:"New Incident",  icon:"🚨", nav:"incident", color:T.red   },
              {label:"AI Analyst",    icon:"✦",  nav:"ai",       color:T.purple},
              {label:"Live Events",   icon:"⟁",  nav:"events",   color:T.cyan  },
              {label:"SIEM Search",   icon:"⌕",  nav:"siem",     color:T.amber },
            ].map(a=>(
              <button key={a.label} onClick={()=>nav(a.nav)}
                title={a.label}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", background:T.bg1, border:`1px solid ${a.color}33`, borderRadius:24, color:a.color, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", boxShadow:`0 4px 16px rgba(0,0,0,.4)`, transition:"all .15s", whiteSpace:"nowrap" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=a.color; e.currentTarget.style.background=`${a.color}14`; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${a.color}33`; e.currentTarget.style.background=T.bg1; }}>
                <span style={{fontSize:14}}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {toast && (
        <div style={{ position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)", padding:"12px 24px", background:toast.color+"18", border:`1px solid ${toast.color}`, borderRadius:8, color:toast.color, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:14, zIndex:500, boxShadow:`0 8px 32px rgba(0,0,0,.5)`, animation:"slideUp .3s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* Dot grid */}
      <div style={{ position:"fixed", inset:0, backgroundImage:`radial-gradient(${T.border}66 1px,transparent 1px)`, backgroundSize:"32px 32px", pointerEvents:"none", zIndex:0, opacity:.4 }} />

      {/* Collapsed Sidebar */}
      {sidebarCollapsed ? (
        <div style={{ width:64, minHeight:"100vh", background:T.bg1, borderRight:`1px solid ${T.border}`, position:"fixed", top:0, left:0, zIndex:100, display:"flex", flexDirection:"column", alignItems:"center", paddingTop:16, gap:4 }}>
          <div onClick={()=>setSidebarCollapsed(false)} style={{ cursor:"pointer", marginBottom:12 }}>
            <img src="/logo.svg" alt="ZolexTech Security" style={{ width:40, height:40, filter:`drop-shadow(0 0 7px ${T.cyan}66)` }} />
          </div>
          {NAV_ITEMS.filter(n=>n.id && !n.id.startsWith("__") && !n.section).map(item=>(
            <button key={item.id} onClick={()=>nav(item.id)} title={item.label} style={{ width:40, height:40, background:active===item.id?`${T.cyan}18`:"transparent", border:`1px solid ${active===item.id?T.cyan:T.border}`, borderRadius:8, cursor:"pointer", color:active===item.id?T.cyan:T.textDim, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", marginBottom:2 }}>
              {item.icon}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ position:"relative", zIndex:100 }}>
          <Sidebar active={active} setActive={nav} wsStatus="CONNECTED" user={user} onLogout={()=>{setUser(null);}} />
        </div>
      )}

      {/* Main content */}
      <div style={{ marginLeft:sideW, minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", zIndex:1, transition:"margin-left .2s ease" }}>

        {/* Enhanced Topbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 24px", borderBottom:`1px solid ${T.border}`, background:T.bg1, position:"sticky", top:0, zIndex:50 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            {/* Sidebar toggle */}
            <button onClick={()=>setSidebarCollapsed(o=>!o)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textDim, fontSize:16, padding:"4px 6px", borderRadius:4, transition:"color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.color=T.cyan}
              onMouseLeave={e=>e.currentTarget.style.color=T.textDim}>☰</button>

            <div>
              <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:19, color:T.textBright, lineHeight:1 }}>{title}</div>
              {/* Breadcrumbs */}
              {breadcrumbs.length > 1 && (
                <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:2 }}>
                  {breadcrumbs.slice().reverse().map((b,i)=>(
                    <span key={b.id} style={{ display:"flex", alignItems:"center", gap:4 }}>
                      {i > 0 && <span style={{ fontSize:10, color:T.textDim }}>›</span>}
                      <button onClick={()=>nav(b.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:i===breadcrumbs.length-1?T.cyan:T.textDim, fontFamily:"'JetBrains Mono',monospace", padding:0 }}>{b.label}</button>
                    </span>
                  ))}
                </div>
              )}
              {breadcrumbs.length <= 1 && <div style={{ fontSize:11, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", marginTop:1 }}>{subtitle}</div>}
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Global search */}
            <button onClick={()=>setSearchOpen(true)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:12, transition:"all .15s", minWidth:180 }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.cyan; e.currentTarget.style.color=T.cyan; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textDim; }}>
              <span style={{ fontSize:14 }}>⌕</span>
              <span>Search…</span>
              <div style={{ marginLeft:"auto", padding:"1px 6px", background:T.bg3, border:`1px solid ${T.border}`, borderRadius:3, fontSize:9, color:T.textDim }}>⌘F</div>
            </button>

            {/* Command palette button */}
            <button onClick={()=>setCmdOpen(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", background:T.bg2, border:`1px solid ${T.border}`, borderRadius:6, color:T.textDim, cursor:"pointer", fontFamily:"'JetBrains Mono',monospace", fontSize:11, transition:"all .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.purple; e.currentTarget.style.color=T.purple; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textDim; }}>
              ⌘K
            </button>

            <div style={{ width:1, height:24, background:T.border }} />

            <Badge color={T.green}>● LIVE</Badge>

            <button onClick={()=>nav("ai")} style={{ padding:"6px 12px", background:`${T.purple}14`, border:`1px solid ${T.purple}44`, borderRadius:5, color:T.purple, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", letterSpacing:.5, transition:"all .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${T.purple}22`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=`${T.purple}14`; }}>
              ✦ AI
            </button>

            {/* Notification bell */}
            <button onClick={()=>setNotifOpen(o=>!o)} style={{ position:"relative", background:"transparent", border:"none", cursor:"pointer", color:notifOpen?T.amber:T.textDim, fontSize:18, padding:"4px 6px", borderRadius:4, transition:"color .15s" }}
              onMouseEnter={e=>e.currentTarget.style.color=T.amber}
              onMouseLeave={e=>{ if(!notifOpen) e.currentTarget.style.color=T.textDim; }}>
              🔔
              {UNREAD > 0 && <span style={{ position:"absolute", top:0, right:0, width:16, height:16, borderRadius:"50%", background:T.red, border:`2px solid ${T.bg1}`, fontSize:9, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'JetBrains Mono',monospace", fontWeight:700 }}>{UNREAD}</span>}
            </button>

            {/* Keyboard shortcuts */}
            <button onClick={()=>setShortcutsOpen(true)} title="Keyboard shortcuts (?)" style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:5, cursor:"pointer", color:T.textDim, fontSize:13, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.cyan; e.currentTarget.style.color=T.cyan; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textDim; }}>?</button>

            <span style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:T.textDim }}>{time}</span>

            <button onClick={()=>nav("account")} style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${T.cyan},${T.purple})`, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#000", boxShadow:`0 0 10px ${T.cyan}33` }}>
              {user?.name?.[0]||"A"}
            </button>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex:1, padding:"20px 24px 44px", overflowX:"hidden" }}>
          {/* Welcome banner for first visit to dashboard */}
          {active==="dashboard" && (
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", background:`linear-gradient(135deg,${T.cyan}0e,${T.purple}0a)`, border:`1px solid ${T.cyan}22`, borderRadius:8, marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:22 }}>⚡</div>
                <div>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:15, color:T.textBright }}>Welcome back, {user?.name?.split(" ")[0] || "Adebayo"} — ZolexTech SecureOps</div>
                  <div style={{ fontSize:12, color:T.textDim, fontFamily:"'Rajdhani',sans-serif" }}>1 active P1 incident · 4 unacknowledged alerts · 1 critical CVE · Compliance at 94% · Terraform drift on 3 resources</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>nav("incident")} style={{ padding:"6px 14px", background:`${T.red}14`, border:`1px solid ${T.red}44`, borderRadius:5, color:T.red, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>🚨 Incidents</button>
                <button onClick={()=>nav("scanning")} style={{ padding:"6px 14px", background:`${T.amber}14`, border:`1px solid ${T.amber}44`, borderRadius:5, color:T.amber, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>View CVEs</button>
                <button onClick={()=>nav("iac")} style={{ padding:"6px 14px", background:`${T.cyan}14`, border:`1px solid ${T.cyan}44`, borderRadius:5, color:T.cyan, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>Fix Drift</button>
                <button onClick={()=>nav("network")} style={{ padding:"6px 14px", background:`${T.purple}14`, border:`1px solid ${T.purple}44`, borderRadius:5, color:T.purple, fontFamily:"'Rajdhani',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer" }}>◫ Network</button>
              </div>
            </div>
          )}
          {active==="account" ? <AccountView user={user} /> : <View />}
        </main>

        {/* Enhanced Status bar */}
        <div style={{ borderTop:`1px solid ${T.border}`, background:T.bg1, padding:"5px 24px", display:"flex", alignItems:"center", gap:0, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:T.green, animation:"pulse 3s infinite" }}/>
              <span style={{ fontSize:10, color:T.green, fontFamily:"'JetBrains Mono',monospace" }}>Systems operational</span>
            </div>
            <div style={{ width:1, height:12, background:T.border }}/>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:T.amber }}/>
              <span style={{ fontSize:10, color:T.amber, fontFamily:"'JetBrains Mono',monospace" }}>Redis degraded</span>
            </div>
            <div style={{ width:1, height:12, background:T.border }}/>
            <span style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>1 P1 incident active</span>
            <div style={{ width:1, height:12, background:T.border }}/>
            <span style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>WS ● CONNECTED</span>
          </div>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <span style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>v3.0.0</span>
            <span style={{ fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace" }}>ZolexTech & Consultant</span>
            <button onClick={()=>setShortcutsOpen(true)} style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:3, cursor:"pointer", fontSize:10, color:T.textDim, fontFamily:"'JetBrains Mono',monospace", padding:"1px 7px" }}>?</button>
            <button onClick={()=>setCmdOpen(true)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:10, color:T.cyan, fontFamily:"'JetBrains Mono',monospace", padding:0 }}>⌘K</button>
          </div>
        </div>
      </div>
    </div>
  );
}
