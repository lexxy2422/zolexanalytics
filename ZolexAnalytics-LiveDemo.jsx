/**
 * ZolexAnalytics — Interactive Live Demo
 * ─────────────────────────────────────────────────────────────
 * A fully self-contained public demo. Drop this anywhere:
 *   - On the landing page as an interactive preview
 *   - As a standalone route at /demo
 *   - Embedded in a blog post or Product Hunt launch
 *
 * No backend required — runs entirely on seed data.
 * Features: animated KPIs, live charts, working campaign/lead
 * tables, event feed, and a signup CTA modal.
 * ─────────────────────────────────────────────────────────────
 */
import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  ComposedChart, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

/* ── THEME ── */
const T = {
  bg:"#060d1a", surface:"#0b1628", card:"#0f1e35", border:"#1a2e4a",
  sky:"#0ea5e9", cyan:"#06b6d4", emerald:"#10b981", amber:"#f59e0b",
  rose:"#f43f5e", violet:"#8b5cf6", text:"#e2eaf5", muted:"#5a7499", white:"#fff",
};
const PIE_CLR = [T.sky, T.cyan, T.violet, T.emerald, T.amber, T.rose];
const mono    = { fontFamily: "'JetBrains Mono', monospace" };

/* ── GLOBAL CSS ── */
const GS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'DM Sans',sans-serif;background:${T.bg};color:${T.text};-webkit-font-smoothing:antialiased;overflow-x:hidden}
input,select,button{font-family:'DM Sans',sans-serif;-webkit-appearance:none}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:${T.surface}}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(6,182,212,.2)}50%{box-shadow:0 0 40px rgba(6,182,212,.5)}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.fu{animation:fadeUp .5s ease both}
.fu1{animation:fadeUp .5s .07s ease both}
.fu2{animation:fadeUp .5s .14s ease both}
.fu3{animation:fadeUp .5s .21s ease both}
.fu4{animation:fadeUp .5s .28s ease both}
.ch{transition:all .22s ease}
.ch:hover{transform:translateY(-2px);border-color:rgba(14,165,233,.4)!important;box-shadow:0 8px 32px rgba(6,182,212,.12)!important}
.bg{transition:all .2s}.bg:hover{filter:brightness(1.08);transform:translateY(-1px)}
.nl{transition:color .18s}.nl:hover{color:${T.cyan}!important}
.rh{transition:background .14s}.rh:hover{background:rgba(14,165,233,.05)!important}
`;

/* ── DATA ── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STAGES = ["Awareness","Interest","Consideration","Intent","Conversion"];
const STAGE_CLR = { Awareness:T.muted, Interest:T.sky, Consideration:T.violet, Intent:T.amber, Conversion:T.emerald };
const fmtT = iso => {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return s + "s ago";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  return Math.floor(s / 3600) + "h ago";
};

function buildData() {
  const base = [42,51,48,63,72,68,84,91,88,103,119,134];
  return {
    revenue: MONTHS.map((m,i) => ({
      month:m, revenue:base[i]*1000+Math.floor(Math.random()*8000),
      target:(base[i]+10)*1000,
      leads:Math.floor(base[i]*1.4+Math.random()*20),
      conversions:Math.floor(base[i]*.18+Math.random()*5),
    })),
    traffic: MONTHS.map((m,i) => ({
      month:m,
      sessions:8000+i*1200+Math.floor(Math.random()*2000),
      pageviews:24000+i*3400+Math.floor(Math.random()*5000),
      bounceRate:+(42-i*.8+Math.random()*4).toFixed(1),
    })),
    channels: [
      {name:"Organic Search",value:34,leads:412,cost:0},
      {name:"Paid Ads",      value:22,leads:267,cost:8900},
      {name:"Social Media",  value:18,leads:218,cost:3200},
      {name:"Email",         value:12,leads:145,cost:900},
      {name:"Referral",      value:9, leads:109,cost:400},
      {name:"Direct",        value:5, leads:61, cost:0},
    ],
    campaigns: [
      {id:"c1",name:"Q1 Brand Push",      channel:"Google Ads", status:"active",budget:15000,spent:12400,leads:267,conv:34,roas:3.2},
      {id:"c2",name:"LinkedIn Outreach",  channel:"LinkedIn",   status:"active",budget:8000, spent:6700, leads:189,conv:28,roas:2.8},
      {id:"c3",name:"Google PPC Spring",  channel:"Google Ads", status:"active",budget:22000,spent:18900,leads:412,conv:67,roas:4.1},
      {id:"c4",name:"Email Nurture v3",   channel:"Newsletter", status:"paused",budget:3500, spent:2800, leads:98, conv:11,roas:2.1},
      {id:"c5",name:"Partner Referral",   channel:"Partner",    status:"active",budget:5000, spent:1200, leads:61, conv:9, roas:3.8},
    ],
    leads: [
      {id:"l1", name:"James Wilson",  co:"Nexus Corp",    src:"Google Ads",  stage:"Conversion",    score:92,val:28400},
      {id:"l2", name:"Amara Okafor",  co:"BrightWave",    src:"LinkedIn",    stage:"Intent",        score:84,val:15000},
      {id:"l3", name:"Chen Zhang",    co:"StratoTech",    src:"Twitter/X",   stage:"Consideration", score:71,val:42000},
      {id:"l4", name:"Sofia Reyes",   co:"Lumena Inc",    src:"Newsletter",  stage:"Interest",      score:65,val:9800},
      {id:"l5", name:"Kwame Asante",  co:"Forge Systems", src:"Partner",     stage:"Awareness",     score:60,val:5200},
      {id:"l6", name:"Elena Petrov",  co:"DataPulse",     src:"Google Ads",  stage:"Conversion",    score:88,val:33000},
      {id:"l7", name:"David Kim",     co:"CorePath",      src:"LinkedIn",    stage:"Intent",        score:79,val:18500},
      {id:"l8", name:"Priya Sharma",  co:"Vantage Group", src:"Twitter/X",   stage:"Consideration", score:68,val:22000},
    ],
    events: [
      {id:"e1",type:"deal_closed",       ico:"💰",desc:"Deal closed: $28,400 — James Wilson @ Nexus Corp",        time:new Date(Date.now()-480000).toISOString(),clr:T.emerald},
      {id:"e2",type:"demo_booked",       ico:"📅",desc:"Demo booked: Kwame Asante @ Forge Systems",               time:new Date(Date.now()-1320000).toISOString(),clr:T.amber},
      {id:"e3",type:"lead_captured",     ico:"👤",desc:"New lead: Sofia Reyes @ Lumena Inc (Google Ads)",         time:new Date(Date.now()-2820000).toISOString(),clr:T.sky},
      {id:"e4",type:"email_opened",      ico:"📧",desc:"Email opened: Q2 Nurture #3 — 47% open rate",            time:new Date(Date.now()-5400000).toISOString(),clr:T.violet},
      {id:"e5",type:"campaign_launched", ico:"🚀",desc:"Campaign launched: LinkedIn Outreach Q2",                 time:new Date(Date.now()-10800000).toISOString(),clr:T.cyan},
      {id:"e6",type:"page_view",         ico:"👁", desc:"Landing page spike: 347 sessions in last hour",          time:new Date(Date.now()-18000000).toISOString(),clr:T.muted},
    ],
    kpis: { mrr:142800,mrrD:12.4, leads:1212,leadsD:8.7, cac:186,cacD:-4.2, ltv:8640,ltvD:6.1, conv:3.8,convD:0.4, nps:67,npsD:3 },
  };
}

const DATA = buildData();

/* ── ATOMS ── */
const Card = ({children,style,className,onClick}) => (
  <div onClick={onClick} className={className}
    style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:20,...style}}>
    {children}
  </div>
);

function AnimKpi({ target, prefix="", suffix="", decimals=0 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let frame; const dur=1200, start=performance.now();
    const tick = now => {
      const p = Math.min((now-start)/dur,1);
      const e = 1 - Math.pow(1-p,3);
      setV(+(target*e).toFixed(decimals));
      if (p<1) frame=requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  },[target]);
  return <>{prefix}{typeof v==="number"?v.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals}):v}{suffix}</>;
}

const TT = ({active,payload,label}) => {
  if (!active||!payload?.length) return null;
  return (
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,padding:"10px 14px",fontSize:".78rem",maxWidth:200}}>
      <div style={{fontWeight:700,marginBottom:6,color:T.white}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",gap:7,alignItems:"center",marginBottom:2}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
          <span style={{color:T.muted}}>{p.name}:</span>
          <span style={{color:T.white,fontWeight:600}}>
            {/revenue|target/i.test(p.name)?"$":""}{typeof p.value==="number"?p.value.toLocaleString():p.value}{/rate|bounce/i.test(p.name)?"%":""}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── SIGNUP MODAL ── */
function SignupModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(6,13,26,.92)",backdropFilter:"blur(10px)",zIndex:4000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn .2s"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"40px 36px",width:"100%",maxWidth:420,animation:"slideUp .25s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",fontWeight:800,color:"#fff",fontFamily:"'DM Serif Display',serif",margin:"0 auto 16px",boxShadow:`0 8px 24px rgba(6,182,212,.35)`}}>ZT</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:T.white,marginBottom:8,lineHeight:1.2}}>
            {done ? "You're in! 🎉" : "Start your free 14-day trial"}
          </h2>
          {!done && <p style={{fontSize:".87rem",color:T.muted,lineHeight:1.65}}>Full Pro access · No credit card · Cancel anytime</p>}
          {done  && <p style={{fontSize:".87rem",color:T.emerald,fontWeight:600}}>Check your inbox to activate your account.</p>}
        </div>
        {!done ? (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input
              type="email"
              placeholder="Work email address"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&email.includes("@")&&setDone(true)}
              style={{background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"12px 16px",borderRadius:10,fontSize:".9rem",outline:"none",width:"100%"}}
              autoFocus
            />
            <button
              onClick={()=>{if(email.includes("@"))setDone(true);}}
              className="bg"
              style={{padding:14,borderRadius:10,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",fontWeight:800,fontSize:".92rem",cursor:"pointer",boxShadow:`0 6px 24px rgba(6,182,212,.35)`}}
            >
              Start Free Trial →
            </button>
            <div style={{textAlign:"center",fontSize:".76rem",color:T.muted}}>
              Already have an account? <span style={{color:T.cyan,cursor:"pointer",fontWeight:600}}>Sign in</span>
            </div>
          </div>
        ) : (
          <button onClick={onClose} className="bg" style={{width:"100%",padding:13,borderRadius:10,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",fontWeight:700,fontSize:".9rem",cursor:"pointer"}}>
            Go to Dashboard →
          </button>
        )}
        <div style={{textAlign:"center",marginTop:14,fontSize:".73rem",color:T.muted}}>
          🔒 Secured by Supabase · GDPR compliant · Data never sold
        </div>
      </div>
    </div>
  );
}

/* ── TICKER ── */
function LiveTicker() {
  const items = [
    "💰 Deal closed: $28,400 · James Wilson @ Nexus Corp",
    "📈 MRR up 12.4% this month",
    "🎯 4.1× ROAS on Google PPC Spring",
    "👤 New lead: Sofia Reyes @ Lumena Inc via Google Ads",
    "⚡ Campaign launched: LinkedIn Outreach Q2",
    "📅 Demo booked: Kwame Asante @ Forge Systems",
    "🏆 NPS score: 67 · +3 points this quarter",
    "📧 Email campaign: 47% open rate · 12% CTR",
  ];
  const doubled = [...items, ...items];
  return (
    <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,overflow:"hidden",height:34,display:"flex",alignItems:"center"}}>
      <div style={{
        display:"flex",gap:48,whiteSpace:"nowrap",
        animation:"ticker 30s linear infinite",
        willChange:"transform",
      }}>
        {doubled.map((item,i)=>(
          <span key={i} style={{fontSize:".72rem",color:T.muted,fontWeight:500,flexShrink:0}}>
            <span style={{color:T.border,marginRight:16}}>◆</span>{item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── DEMO SECTIONS ── */
function OverviewTab({ isMobile }) {
  const { kpis, revenue, channels } = DATA;
  const rev = isMobile ? revenue.slice(-6) : revenue;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* KPI grid */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(3,1fr)",gap:12}}>
        {[
          {l:"MRR",        v:<AnimKpi target={kpis.mrr}  prefix="$"/>, d:kpis.mrrD,  pos:true},
          {l:"Total Leads",v:<AnimKpi target={kpis.leads}/>,           d:kpis.leadsD,pos:true},
          {l:"CAC",        v:<AnimKpi target={kpis.cac}  prefix="$"/>, d:kpis.cacD,  pos:false},
          {l:"LTV",        v:<AnimKpi target={kpis.ltv}  prefix="$"/>, d:kpis.ltvD,  pos:true},
          {l:"Conv. Rate", v:<AnimKpi target={kpis.conv} suffix="%"  decimals={1}/>,d:kpis.convD,pos:true},
          {l:"NPS Score",  v:<AnimKpi target={kpis.nps}/>,             d:kpis.npsD,  pos:true},
        ].map(k=>(
          <Card key={k.l} className="ch fu">
            <div style={{fontSize:".66rem",fontWeight:600,color:T.muted,letterSpacing:".09em",textTransform:"uppercase",marginBottom:6}}>{k.l}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:isMobile?"1.5rem":"1.9rem",color:T.white,lineHeight:1,marginBottom:6}}>{k.v}</div>
            <div style={{fontSize:".73rem",fontWeight:600,color:k.pos?T.emerald:T.rose,display:"flex",alignItems:"center",gap:3}}>
              {k.pos?"▲":"▼"} {Math.abs(k.d)}% <span style={{color:T.muted,fontWeight:400,marginLeft:2}}>vs last mo</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue chart + Channel mix */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"2fr 1fr",gap:14}}>
        <Card className="fu1">
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white,marginBottom:4}}>Revenue vs Target</div>
          <div style={{fontSize:".77rem",color:T.muted,marginBottom:14}}>Monthly performance · All 12 months</div>
          <ResponsiveContainer width="100%" height={isMobile?170:230}>
            <ComposedChart data={rev}>
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.cyan} stopOpacity={.28}/>
                  <stop offset="95%" stopColor={T.cyan} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>"$"+Math.round(v/1000)+"K"} width={42}/>
              <Tooltip content={<TT/>}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={T.cyan} fill="url(#rg)" strokeWidth={2.5} dot={false}/>
              <Line  type="monotone" dataKey="target"  name="Target"  stroke={T.amber} strokeWidth={1.5} strokeDasharray="5 3" dot={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card className="fu2">
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white,marginBottom:12}}>Channel Mix</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={channels} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                {channels.map((_,i)=><Cell key={i} fill={PIE_CLR[i%PIE_CLR.length]}/>)}
              </Pie>
              <Tooltip content={({active,payload})=>active&&payload?.length?(
                <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",fontSize:".78rem"}}>
                  <b style={{color:T.white}}>{payload[0].name}</b><br/>
                  <span style={{color:T.muted}}>Share: </span><b>{payload[0].value}%</b>
                </div>
              ):null}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {channels.slice(0,4).map((ch,i)=>(
              <div key={ch.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:PIE_CLR[i%PIE_CLR.length],flexShrink:0}}/>
                  <span style={{fontSize:".74rem",color:T.muted}}>{ch.name}</span>
                </div>
                <span style={{...mono,fontSize:".74rem",color:T.text,fontWeight:600}}>{ch.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Leads & Conversions */}
      <Card className="fu3">
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white,marginBottom:4}}>Monthly Pipeline</div>
        <div style={{fontSize:".77rem",color:T.muted,marginBottom:14}}>Leads captured vs conversions closed</div>
        <ResponsiveContainer width="100%" height={isMobile?155:190}>
          <BarChart data={rev} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} width={30}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{fontSize:".77rem",color:T.muted,paddingTop:10}}/>
            <Bar dataKey="leads" name="Leads" fill={T.sky} radius={[3,3,0,0]} opacity={.85}/>
            <Bar dataKey="conversions" name="Conversions" fill={T.emerald} radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function CampaignsTab({ isMobile }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? DATA.campaigns : DATA.campaigns.filter(c=>c.status===filter);
  const StatusBadge = ({s}) => {
    const cfg = {active:{bg:"rgba(16,185,129,.15)",c:T.emerald},paused:{bg:"rgba(245,158,11,.15)",c:T.amber},draft:{bg:"rgba(90,116,153,.15)",c:T.muted}}[s]||{bg:T.border,c:T.muted};
    return <span style={{fontSize:".66rem",fontWeight:700,padding:"2px 8px",borderRadius:100,background:cfg.bg,color:cfg.c,letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{s}</span>;
  };
  const totals = DATA.campaigns.reduce((a,c)=>({budget:a.budget+c.budget,spent:a.spent+c.spent,leads:a.leads+c.leads,conv:a.conv+c.conv}),{budget:0,spent:0,leads:0,conv:0});

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12}}>
        {[{l:"Total Budget",v:"$"+totals.budget.toLocaleString(),c:T.text},{l:"Total Spent",v:"$"+totals.spent.toLocaleString(),c:T.amber},{l:"Total Leads",v:totals.leads.toLocaleString(),c:T.sky},{l:"Total Conv.",v:totals.conv.toLocaleString(),c:T.emerald}].map(s=>(
          <Card key={s.l}>
            <div style={{fontSize:".66rem",color:T.muted,fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",marginBottom:6}}>{s.l}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:isMobile?"1.3rem":"1.6rem",color:s.c}}>{s.v}</div>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["all","active","paused","draft"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${filter===f?T.sky:T.border}`,background:filter===f?"rgba(14,165,233,.12)":T.card,color:filter===f?T.sky:T.muted,fontWeight:600,fontSize:".78rem",cursor:"pointer",fontFamily:"inherit",transition:"all .18s",textTransform:"capitalize"}}>
            {f==="all"?`All (${DATA.campaigns.length})`:f}
          </button>
        ))}
      </div>

      {/* Campaign cards */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(c=>(
          <Card key={c.id} className="ch" style={{padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:".92rem",color:T.white,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                <div style={{fontSize:".75rem",color:T.muted}}>{c.channel}</div>
              </div>
              <StatusBadge s={c.status}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              {[
                {l:"Budget",  v:"$"+c.budget.toLocaleString(),  c:T.text},
                {l:"Spent",   v:"$"+c.spent.toLocaleString(),   c:T.amber},
                {l:"Leads",   v:c.leads,                        c:T.sky},
                {l:"ROAS",    v:c.roas>0?c.roas+"×":"—",        c:c.roas>=3?T.emerald:c.roas>0?T.amber:T.muted},
              ].map(m=>(
                <div key={m.l} style={{textAlign:"center",background:T.bg,borderRadius:8,padding:"8px 4px"}}>
                  <div style={{...mono,fontSize:".86rem",fontWeight:600,color:m.c}}>{m.v}</div>
                  <div style={{fontSize:".62rem",color:T.muted,marginTop:2}}>{m.l}</div>
                </div>
              ))}
            </div>
            {/* Budget progress bar */}
            <div style={{marginTop:12}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".7rem",color:T.muted,marginBottom:5}}>
                <span>Budget utilisation</span>
                <span style={{...mono,color:T.text,fontWeight:600}}>{c.budget>0?Math.round((c.spent/c.budget)*100):0}%</span>
              </div>
              <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{
                  height:"100%",
                  width:`${c.budget>0?Math.min((c.spent/c.budget)*100,100):0}%`,
                  background:c.budget>0&&(c.spent/c.budget)>0.9?T.rose:c.budget>0&&(c.spent/c.budget)>0.7?T.amber:T.emerald,
                  borderRadius:3,transition:"width 1s ease",
                }}/>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LeadsTab({ isMobile }) {
  const [stageFilter, setStageFilter] = useState("all");
  const [search, setSearch] = useState("");
  const visible = DATA.leads.filter(l=>{
    const sm = !search || [l.name,l.co,l.src].some(v=>v.toLowerCase().includes(search.toLowerCase()));
    const sf = stageFilter==="all" || l.stage===stageFilter;
    return sm && sf;
  });
  const stageCounts = STAGES.reduce((a,s)=>({...a,[s]:DATA.leads.filter(l=>l.stage===s).length}),{all:DATA.leads.length});

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Stage filter */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {["all",...STAGES].map(s=>(
          <button key={s} onClick={()=>setStageFilter(s)} style={{flexShrink:0,padding:"8px 12px",borderRadius:10,border:`1px solid ${stageFilter===s?T.sky:T.border}`,background:stageFilter===s?"rgba(14,165,233,.1)":T.card,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",textAlign:"center",minWidth:68}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.1rem",color:stageFilter===s?T.white:T.muted}}>{stageCounts[s]||0}</div>
            <div style={{fontSize:".59rem",color:stageFilter===s?T.sky:T.muted,fontWeight:600,marginTop:2,textTransform:"uppercase",letterSpacing:".05em"}}>{s==="all"?"All":s}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{display:"flex",gap:8,background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"8px 12px",alignItems:"center"}}>
        <span style={{color:T.muted,flexShrink:0}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads by name, company or source…"
          style={{background:"transparent",border:"none",outline:"none",fontFamily:"inherit",fontSize:".86rem",color:T.text,flex:1,minWidth:0}}/>
        {search&&<button onClick={()=>setSearch("")} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,padding:2,fontSize:".8rem"}}>✕</button>}
      </div>

      {/* Lead cards */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {visible.length===0&&<div style={{textAlign:"center",padding:40,color:T.muted}}>No leads match your filters.</div>}
        {visible.map(l=>(
          <Card key={l.id} className="ch" style={{padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:".92rem",color:T.white,marginBottom:2}}>{l.name}</div>
                <div style={{fontSize:".76rem",color:T.muted}}>{l.co} · {l.src}</div>
              </div>
              <span style={{fontSize:".68rem",fontWeight:700,padding:"2px 9px",borderRadius:100,background:(STAGE_CLR[l.stage]||T.muted)+"22",color:STAGE_CLR[l.stage]||T.muted,flexShrink:0,marginLeft:8}}>{l.stage}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              <div style={{background:T.bg,borderRadius:8,padding:"7px",textAlign:"center"}}>
                <div style={{...mono,fontSize:".86rem",fontWeight:600,color:T.emerald}}>${l.val.toLocaleString()}</div>
                <div style={{fontSize:".62rem",color:T.muted,marginTop:1}}>Deal Value</div>
              </div>
              <div style={{background:T.bg,borderRadius:8,padding:"7px",textAlign:"center"}}>
                <div style={{...mono,fontSize:".86rem",fontWeight:600,color:l.score>79?T.emerald:l.score>59?T.amber:T.rose}}>{l.score}</div>
                <div style={{fontSize:".62rem",color:T.muted,marginTop:1}}>Lead Score</div>
              </div>
              <div style={{background:T.bg,borderRadius:8,padding:"7px",textAlign:"center"}}>
                <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden",margin:"4px 0 6px"}}>
                  <div style={{height:"100%",width:l.score+"%",background:l.score>79?T.emerald:l.score>59?T.amber:T.rose,borderRadius:3}}/>
                </div>
                <div style={{fontSize:".62rem",color:T.muted}}>Score %</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState(DATA.events);
  const [form, setForm] = useState({type:"lead_captured",desc:""});
  const [adding, setAdding] = useState(false);
  const EVENT_TYPES = ["lead_captured","email_opened","demo_booked","deal_closed","campaign_launched","page_view"];
  const TYPE_ICO = {lead_captured:"👤",email_opened:"📧",demo_booked:"📅",deal_closed:"💰",campaign_launched:"🚀",page_view:"👁"};
  const TYPE_CLR = {lead_captured:T.sky,email_opened:T.violet,demo_booked:T.amber,deal_closed:T.emerald,campaign_launched:T.cyan,page_view:T.muted};

  const addEvent = () => {
    if (!form.desc.trim()) return;
    const ev = {id:"e"+Date.now(),type:form.type,ico:TYPE_ICO[form.type]||"📌",desc:form.desc,time:new Date().toISOString(),clr:TYPE_CLR[form.type]||T.muted};
    setEvents(prev=>[ev,...prev]);
    setForm({type:"lead_captured",desc:""});
    setAdding(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white}}>Live Activity Feed</div>
          <div style={{fontSize:".77rem",color:T.muted,marginTop:2,display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:T.emerald,display:"inline-block",animation:"pulse 2s infinite"}}/>
            {events.length} events · streaming live
          </div>
        </div>
        <button onClick={()=>setAdding(!adding)} className="bg" style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:"8px 18px",borderRadius:9,fontWeight:700,fontSize:".82rem",cursor:"pointer",fontFamily:"inherit"}}>
          + Log Event
        </button>
      </div>

      {adding && (
        <Card style={{background:"rgba(14,165,233,.06)",border:`1px solid rgba(14,165,233,.2)`}}>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:10}}>
              <div>
                <label style={{fontSize:".72rem",fontWeight:600,color:T.muted,display:"block",marginBottom:5}}>Event Type</label>
                <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"10px 12px",borderRadius:9,fontSize:".85rem",outline:"none",width:"100%",cursor:"pointer"}}>
                  {EVENT_TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:".72rem",fontWeight:600,color:T.muted,display:"block",marginBottom:5}}>Description</label>
                <input value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addEvent()} placeholder="Describe what happened…" style={{background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"10px 12px",borderRadius:9,fontSize:".85rem",outline:"none",width:"100%"}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={addEvent} className="bg" style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:"9px 20px",borderRadius:9,fontWeight:700,fontSize:".83rem",cursor:"pointer",fontFamily:"inherit"}}>Log It</button>
              <button onClick={()=>setAdding(false)} style={{background:"transparent",border:`1px solid ${T.border}`,color:T.muted,padding:"9px 16px",borderRadius:9,fontWeight:600,fontSize:".83rem",cursor:"pointer",fontFamily:"inherit"}}>Cancel</button>
            </div>
          </div>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {events.map((ev,i)=>(
          <div key={ev.id} className="ch" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"13px 16px",display:"flex",alignItems:"flex-start",gap:12,animation:i===0?"fadeUp .4s ease":undefined}}>
            <div style={{width:36,height:36,borderRadius:10,background:(ev.clr||T.muted)+"18",border:`1px solid ${(ev.clr||T.muted)}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".95rem",flexShrink:0}}>
              {ev.ico||"📌"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:".86rem",color:T.white,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.desc}</div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:".67rem",fontWeight:700,padding:"1px 8px",borderRadius:100,background:(ev.clr||T.muted)+"18",color:ev.clr||T.muted,textTransform:"capitalize",whiteSpace:"nowrap"}}>
                  {(ev.type||"").replace(/_/g," ")}
                </span>
                <span style={{fontSize:".72rem",color:T.muted}}>{fmtT(ev.time)}</span>
              </div>
            </div>
            <span style={{...mono,fontSize:".68rem",color:T.muted,flexShrink:0}}>
              {new Date(ev.time).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrafficTab({ isMobile }) {
  const { traffic, channels } = DATA;
  const tr = isMobile ? traffic.slice(-6) : traffic;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12}}>
        {[
          {l:"Total Sessions",v:(traffic.reduce((s,r)=>s+r.sessions,0)/1000).toFixed(0)+"K"},
          {l:"Page Views",    v:(traffic.reduce((s,r)=>s+r.pageviews,0)/1000).toFixed(0)+"K"},
          {l:"Avg Bounce",    v:(traffic.reduce((s,r)=>s+r.bounceRate,0)/traffic.length).toFixed(1)+"%"},
          {l:"Pages/Session", v:"3.4"},
        ].map(s=>(
          <Card key={s.l} className="ch">
            <div style={{fontSize:".66rem",color:T.muted,fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",marginBottom:6}}>{s.l}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:isMobile?"1.3rem":"1.7rem",color:T.white}}>{s.v}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white,marginBottom:14}}>Sessions &amp; Page Views</div>
        <ResponsiveContainer width="100%" height={isMobile?170:240}>
          <LineChart data={tr}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="l" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>Math.round(v/1000)+"K"} width={36}/>
            <YAxis yAxisId="r" orientation="right" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>Math.round(v/1000)+"K"} width={36}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{fontSize:".77rem",color:T.muted,paddingTop:10}}/>
            <Line yAxisId="l" type="monotone" dataKey="sessions"  name="Sessions"   stroke={T.sky}    strokeWidth={2.5} dot={{fill:T.sky,r:2.5}}/>
            <Line yAxisId="r" type="monotone" dataKey="pageviews" name="Page Views" stroke={T.violet} strokeWidth={2.5} dot={{fill:T.violet,r:2.5}}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white,marginBottom:14}}>Channel Attribution — Leads by Source</div>
        {channels.map((ch,i)=>(
          <div key={ch.name} style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:PIE_CLR[i%PIE_CLR.length]}}/>
                <span style={{fontSize:".84rem",color:T.text}}>{ch.name}</span>
              </div>
              <div style={{display:"flex",gap:16}}>
                <span style={{...mono,fontSize:".78rem",color:T.muted}}>{ch.leads} leads</span>
                <span style={{...mono,fontSize:".78rem",color:PIE_CLR[i%PIE_CLR.length],fontWeight:600}}>{ch.value}%</span>
              </div>
            </div>
            <div style={{height:6,background:T.border,borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:ch.value+"%",background:PIE_CLR[i%PIE_CLR.length],borderRadius:3,transition:"width 1.2s ease"}}/>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ── MAIN DEMO COMPONENT ── */
const TABS = [
  {k:"overview",  ico:"◈",  l:"Overview"},
  {k:"campaigns", ico:"🎯", l:"Campaigns"},
  {k:"leads",     ico:"👥", l:"Leads"},
  {k:"traffic",   ico:"🌐", l:"Traffic"},
  {k:"events",    ico:"⚡", l:"Live Feed"},
];

export default function ZolexAnalyticsDemo() {
  const [tab,     setTab]     = useState("overview");
  const [signup,  setSignup]  = useState(false);
  const [isMob,   setIsMob]   = useState(false);
  const [sideOpen,setSideOpen]= useState(false);

  useEffect(() => {
    const fn = () => setIsMob(window.innerWidth < 640);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <style>{GS}</style>

      {signup && <SignupModal onClose={()=>setSignup(false)}/>}

      {/* ── TOPBAR */}
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(6,13,26,.97)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,padding:`0 ${isMob?14:24}px`,height:56,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {isMob && (
            <button onClick={()=>setSideOpen(!sideOpen)} style={{background:T.card,border:`1px solid ${T.border}`,color:T.muted,width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>☰</button>
          )}
          <div style={{width:30,height:30,borderRadius:7,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:".76rem",color:"#fff",fontFamily:"Georgia,serif",flexShrink:0}}>ZT</div>
          <span style={{fontWeight:700,fontSize:".92rem",color:T.white}}>Zolex<span style={{color:T.cyan}}>Analytics</span></span>
          <span style={{fontSize:".66rem",fontWeight:700,padding:"2px 9px",borderRadius:100,background:"rgba(245,158,11,.15)",color:T.amber,letterSpacing:".06em",textTransform:"uppercase",marginLeft:4}}>Live Demo</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {!isMob && (
            <div style={{...mono,fontSize:".7rem",color:T.muted,background:T.card,border:`1px solid ${T.border}`,padding:"4px 10px",borderRadius:6,display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:T.emerald,display:"inline-block",animation:"pulse 2s infinite"}}/>
              Demo · {new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}
            </div>
          )}
          <button onClick={()=>setSignup(true)} className="bg" style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:isMob?"7px 14px":"8px 18px",borderRadius:8,fontWeight:700,fontSize:".8rem",cursor:"pointer",fontFamily:"inherit",boxShadow:`0 4px 16px rgba(6,182,212,.3)`,whiteSpace:"nowrap"}}>
            {isMob?"Sign Up":"Start Free Trial"}
          </button>
        </div>
      </header>

      {/* ── LIVE TICKER */}
      <LiveTicker/>

      {/* ── LAYOUT */}
      <div style={{display:"flex",flex:1,minHeight:0}}>

        {/* Sidebar — desktop always visible, mobile drawer */}
        {(isMob && sideOpen) && (
          <div onClick={()=>setSideOpen(false)} style={{position:"fixed",inset:0,background:"rgba(6,13,26,.75)",zIndex:140,animation:"fadeIn .2s"}}/>
        )}
        <aside style={{
          width:194,flexShrink:0,background:T.surface,borderRight:`1px solid ${T.border}`,
          display:"flex",flexDirection:"column",
          position:isMob?"fixed":"sticky",top:isMob?0:90,left:0,
          height:isMob?"100vh":"calc(100vh - 90px)",zIndex:150,
          overflowY:"auto",
          transform:isMob?(sideOpen?"translateX(0)":"translateX(-100%)"):"none",
          transition:"transform .28s cubic-bezier(.4,0,.2,1)",
          boxShadow:sideOpen&&isMob?"4px 0 32px rgba(0,0,0,.5)":"none",
        }}>
          {isMob && (
            <div style={{padding:"16px 16px 10px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:700,fontSize:".88rem",color:T.white}}>ZolexAnalytics</span>
              <button onClick={()=>setSideOpen(false)} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:"1.1rem"}}>✕</button>
            </div>
          )}

          <nav style={{padding:"12px 8px",flex:1}}>
            <div style={{fontSize:".6rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:T.muted,padding:"4px 11px 8px"}}>Navigation</div>
            {TABS.map(n=>(
              <button key={n.k} onClick={()=>{setTab(n.k);setSideOpen(false);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 11px",borderRadius:9,border:"none",background:tab===n.k?"rgba(14,165,233,.13)":"transparent",color:tab===n.k?T.sky:T.muted,fontWeight:tab===n.k?600:400,fontSize:".84rem",cursor:"pointer",fontFamily:"inherit",marginBottom:2,textAlign:"left",transition:"all .18s"}}>
                <span style={{fontSize:".9rem",width:18,textAlign:"center",flexShrink:0}}>{n.ico}</span>
                {n.l}
                {tab===n.k&&<span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:T.cyan,flexShrink:0}}/>}
              </button>
            ))}
          </nav>

          {/* Demo badge + CTA */}
          <div style={{padding:"12px 10px",borderTop:`1px solid ${T.border}`}}>
            <div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)",borderRadius:9,padding:"10px 12px",marginBottom:10}}>
              <div style={{fontSize:".7rem",fontWeight:700,color:T.amber,marginBottom:4}}>👁 Demo Mode</div>
              <div style={{fontSize:".7rem",color:T.muted,lineHeight:1.5,marginBottom:8}}>You're viewing sample data. Sign up to connect your real accounts.</div>
              <button onClick={()=>setSignup(true)} className="bg" style={{width:"100%",padding:"8px",borderRadius:8,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",fontWeight:700,fontSize:".76rem",cursor:"pointer",fontFamily:"inherit"}}>Start Free Trial →</button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{flex:1,minWidth:0,padding:isMob?"14px 14px 80px":"24px",overflowY:"auto"}}>
          {/* Breadcrumb */}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:isMob?".95rem":"1.05rem",color:T.white,display:"flex",alignItems:"center",gap:8}}>
              <span>{TABS.find(t=>t.k===tab)?.ico}</span>
              <span>{TABS.find(t=>t.k===tab)?.l}</span>
            </div>
            <div style={{...mono,fontSize:".68rem",color:T.muted,background:T.card,border:`1px solid ${T.border}`,padding:"3px 9px",borderRadius:5}}>demo data</div>
          </div>

          {tab==="overview"  && <OverviewTab  isMobile={isMob}/>}
          {tab==="campaigns" && <CampaignsTab isMobile={isMob}/>}
          {tab==="leads"     && <LeadsTab     isMobile={isMob}/>}
          {tab==="traffic"   && <TrafficTab   isMobile={isMob}/>}
          {tab==="events"    && <EventsTab/>}
        </main>
      </div>

      {/* Mobile bottom nav */}
      {isMob && (
        <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:120,background:T.surface,borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"stretch",boxShadow:"0 -4px 24px rgba(0,0,0,.4)",paddingBottom:"env(safe-area-inset-bottom)"}}>
          {TABS.map(n=>(
            <button key={n.k} onClick={()=>setTab(n.k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"8px 0",background:tab===n.k?"rgba(14,165,233,.1)":"transparent",border:"none",borderTop:tab===n.k?`2px solid ${T.sky}`:"2px solid transparent",cursor:"pointer",fontFamily:"inherit",transition:"all .18s",minWidth:0}}>
              <span style={{fontSize:"1.05rem",lineHeight:1}}>{n.ico}</span>
              <span style={{fontSize:".5rem",fontWeight:600,color:tab===n.k?T.sky:T.muted,letterSpacing:".04em",textTransform:"uppercase",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%",padding:"0 2px"}}>{n.l}</span>
            </button>
          ))}
        </nav>
      )}

      {/* CTA Banner */}
      <div style={{background:`linear-gradient(135deg,rgba(14,165,233,.08),rgba(139,92,246,.08))`,borderTop:`1px solid ${T.border}`,padding:`${isMob?28:36}px ${isMob?20:40}px`,display:"flex",flexDirection:isMob?"column":"row",alignItems:"center",justifyContent:"space-between",gap:16,flexShrink:0}}>
        <div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:isMob?"1.2rem":"1.4rem",color:T.white,marginBottom:4}}>Ready to connect your real data?</div>
          <div style={{fontSize:".86rem",color:T.muted}}>14-day free trial · Full Pro access · No credit card required</div>
        </div>
        <button onClick={()=>setSignup(true)} className="bg" style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:"13px 28px",borderRadius:10,fontWeight:800,fontSize:".92rem",cursor:"pointer",fontFamily:"inherit",boxShadow:`0 6px 24px rgba(6,182,212,.32)`,whiteSpace:"nowrap",flexShrink:0,width:isMob?"100%":undefined}}>
          Start Your Free Trial →
        </button>
      </div>
    </div>
  );
}
