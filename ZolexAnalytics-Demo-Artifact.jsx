import { useState, useEffect, useRef } from "react";
import {
  ComposedChart, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

const T = {
  bg:"#060d1a", surface:"#0b1628", card:"#0f1e35", border:"#1a2e4a",
  sky:"#0ea5e9", cyan:"#06b6d4", emerald:"#10b981", amber:"#f59e0b",
  rose:"#f43f5e", violet:"#8b5cf6", text:"#e2eaf5", muted:"#5a7499", white:"#fff",
};
const PIE_CLR = [T.sky,T.cyan,T.violet,T.emerald,T.amber,T.rose];
const mono = { fontFamily:"'JetBrains Mono',monospace" };

const GS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:#060d1a;color:#e2eaf5;-webkit-font-smoothing:antialiased;overflow-x:hidden}
input,select,button{font-family:inherit;-webkit-appearance:none}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#0b1628}
::-webkit-scrollbar-thumb{background:#1a2e4a;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.fu{animation:fadeUp .5s ease both}
.fu1{animation:fadeUp .5s .07s ease both}
.fu2{animation:fadeUp .5s .14s ease both}
.fu3{animation:fadeUp .5s .21s ease both}
.bg{transition:all .2s}.bg:hover{filter:brightness(1.08);transform:translateY(-1px)}
.ch{transition:all .22s}.ch:hover{transform:translateY(-2px);border-color:rgba(14,165,233,.4)!important;box-shadow:0 8px 28px rgba(6,182,212,.12)!important}
.rh{transition:background .14s}.rh:hover{background:rgba(14,165,233,.05)!important}
.nl{transition:color .18s}.nl:hover{color:#06b6d4!important}
`;

// ── DATA ──
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const STAGES = ["Awareness","Interest","Consideration","Intent","Conversion"];
const STAGE_CLR = {Awareness:T.muted,Interest:T.sky,Consideration:T.violet,Intent:T.amber,Conversion:T.emerald};
const fmtAgo = iso => { const s=Math.floor((Date.now()-new Date(iso))/1000); if(s<60)return s+"s ago"; if(s<3600)return Math.floor(s/60)+"m ago"; return Math.floor(s/3600)+"h ago"; };

function seed() {
  const b=[42,51,48,63,72,68,84,91,88,103,119,134];
  return {
    revenue: MONTHS.map((m,i)=>({month:m, revenue:b[i]*1000+Math.floor(Math.random()*8000), target:(b[i]+10)*1000, leads:Math.floor(b[i]*1.4), conversions:Math.floor(b[i]*.18)})),
    traffic: MONTHS.map((m,i)=>({month:m, sessions:8000+i*1200, pageviews:24000+i*3400, bounceRate:+(42-i*.8).toFixed(1)})),
    channels:[{name:"Organic Search",value:34,leads:412},{name:"Paid Ads",value:22,leads:267},{name:"Social Media",value:18,leads:218},{name:"Email",value:12,leads:145},{name:"Referral",value:9,leads:109},{name:"Direct",value:5,leads:61}],
    campaigns:[
      {id:"c1",name:"Q1 Brand Push",     channel:"Google Ads", status:"active",budget:15000,spent:12400,leads:267,conv:34,roas:3.2},
      {id:"c2",name:"LinkedIn Outreach",  channel:"LinkedIn",   status:"active",budget:8000, spent:6700, leads:189,conv:28,roas:2.8},
      {id:"c3",name:"Google PPC Spring",  channel:"Google Ads", status:"active",budget:22000,spent:18900,leads:412,conv:67,roas:4.1},
      {id:"c4",name:"Email Nurture v3",   channel:"Newsletter", status:"paused",budget:3500, spent:2800, leads:98, conv:11,roas:2.1},
      {id:"c5",name:"Partner Referral",   channel:"Partner",    status:"active",budget:5000, spent:1200, leads:61, conv:9, roas:3.8},
    ],
    leads:[
      {id:"l1",name:"James Wilson",  co:"Nexus Corp",    src:"Google Ads", stage:"Conversion",    score:92,val:28400},
      {id:"l2",name:"Amara Okafor",  co:"BrightWave",    src:"LinkedIn",   stage:"Intent",        score:84,val:15000},
      {id:"l3",name:"Chen Zhang",    co:"StratoTech",    src:"Twitter/X",  stage:"Consideration", score:71,val:42000},
      {id:"l4",name:"Sofia Reyes",   co:"Lumena Inc",    src:"Newsletter", stage:"Interest",      score:65,val:9800},
      {id:"l5",name:"Kwame Asante",  co:"Forge Systems", src:"Partner",    stage:"Awareness",     score:60,val:5200},
      {id:"l6",name:"Elena Petrov",  co:"DataPulse",     src:"Google Ads", stage:"Conversion",    score:88,val:33000},
      {id:"l7",name:"David Kim",     co:"CorePath",      src:"LinkedIn",   stage:"Intent",        score:79,val:18500},
    ],
    events:[
      {id:"e1",type:"deal_closed",       ico:"💰",desc:"Deal closed: $28,400 — James Wilson @ Nexus Corp",    time:new Date(Date.now()-480000).toISOString(),  clr:T.emerald},
      {id:"e2",type:"demo_booked",       ico:"📅",desc:"Demo booked: Kwame Asante @ Forge Systems",           time:new Date(Date.now()-1320000).toISOString(), clr:T.amber},
      {id:"e3",type:"lead_captured",     ico:"👤",desc:"New lead: Sofia Reyes @ Lumena Inc — Google Ads",    time:new Date(Date.now()-2820000).toISOString(), clr:T.sky},
      {id:"e4",type:"email_opened",      ico:"📧",desc:"Email opened: Q2 Nurture #3 — 47% open rate",        time:new Date(Date.now()-5400000).toISOString(), clr:T.violet},
      {id:"e5",type:"campaign_launched", ico:"🚀",desc:"Campaign launched: LinkedIn Outreach Q2",             time:new Date(Date.now()-10800000).toISOString(),clr:T.cyan},
    ],
    kpis:{mrr:142800,mrrD:12.4, leads:1212,leadsD:8.7, cac:186,cacD:-4.2, ltv:8640,ltvD:6.1, conv:3.8,convD:0.4, nps:67,npsD:3},
  };
}

const DATA = seed();

// ── ATOMS ──
function AnimNum({target,prefix="",suffix="",dec=0}) {
  const [v,setV] = useState(0);
  const r = useRef();
  useEffect(()=>{
    const dur=1100, start=performance.now();
    const tick=now=>{
      const p=Math.min((now-start)/dur,1);
      const e=1-Math.pow(1-p,3);
      setV(+(target*e).toFixed(dec));
      if(p<1) r.current=requestAnimationFrame(tick);
    };
    r.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(r.current);
  },[target]);
  return <>{prefix}{v.toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec})}{suffix}</>;
}

const TT=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:9,padding:"10px 14px",fontSize:".77rem",maxWidth:195}}>
      <div style={{fontWeight:700,marginBottom:5,color:T.white}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",gap:6,alignItems:"center",marginBottom:2}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
          <span style={{color:T.muted}}>{p.name}:</span>
          <span style={{color:T.white,fontWeight:600}}>{/revenue|target/i.test(p.name)?"$":""}{typeof p.value==="number"?p.value.toLocaleString():p.value}{/rate|bounce/i.test(p.name)?"%":""}</span>
        </div>
      ))}
    </div>
  );
};

const Card=({ch,c,p=20,children,onClick})=>(
  <div onClick={onClick} className={ch?"ch":undefined} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:p,...c}}>
    {children}
  </div>
);

const SH=(t)=><div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white,marginBottom:4}}>{t}</div>;
const SM=(t)=><div style={{fontSize:".77rem",color:T.muted,marginBottom:14}}>{t}</div>;

// ── SIGNUP MODAL ──
function SignupModal({onClose}) {
  const [email,setEmail]=useState("");
  const [done,setDone]=useState(false);
  useEffect(()=>{
    const fn=e=>e.key==="Escape"&&onClose();
    window.addEventListener("keydown",fn);
    document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",fn);document.body.style.overflow="";};
  },[onClose]);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(6,13,26,.9)",backdropFilter:"blur(10px)",zIndex:4000,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn .2s"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,padding:"36px 32px",width:"100%",maxWidth:400,animation:"slideUp .25s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",fontWeight:800,color:"#fff",fontFamily:"'DM Serif Display',serif",margin:"0 auto 14px",boxShadow:`0 8px 24px rgba(6,182,212,.35)`}}>ZT</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.55rem",color:T.white,marginBottom:6,lineHeight:1.2}}>
            {done?"You're in! 🎉":"Start your free 14-day trial"}
          </h2>
          <p style={{fontSize:".85rem",color:done?T.emerald:T.muted,fontWeight:done?600:400}}>
            {done?"Check your inbox to activate your account.":"Full Pro access · No credit card · Cancel anytime"}
          </p>
        </div>
        {!done?(
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <input type="email" placeholder="Work email address" value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&email.includes("@")&&setDone(true)}
              style={{background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"12px 15px",borderRadius:10,fontSize:".9rem",outline:"none",width:"100%"}} autoFocus/>
            <button onClick={()=>email.includes("@")&&setDone(true)} className="bg"
              style={{padding:13,borderRadius:10,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",fontWeight:800,fontSize:".9rem",cursor:"pointer",boxShadow:`0 5px 20px rgba(6,182,212,.32)`}}>
              Start Free Trial →
            </button>
            <div style={{textAlign:"center",fontSize:".75rem",color:T.muted}}>
              Already have an account? <span style={{color:T.cyan,cursor:"pointer",fontWeight:600}}>Sign in</span>
            </div>
          </div>
        ):(
          <button onClick={onClose} className="bg"
            style={{width:"100%",padding:13,borderRadius:10,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",fontWeight:700,fontSize:".9rem",cursor:"pointer"}}>
            Go to Dashboard →
          </button>
        )}
        <div style={{textAlign:"center",marginTop:12,fontSize:".72rem",color:T.muted}}>🔒 GDPR compliant · Data never sold</div>
      </div>
    </div>
  );
}

// ── OVERVIEW TAB ──
function OverviewTab() {
  const {kpis,revenue,channels}=DATA;
  const kpiRows=[
    {l:"MRR",          v:<AnimNum target={kpis.mrr}  prefix="$"/>,       d:kpis.mrrD,  pos:true},
    {l:"Total Leads",  v:<AnimNum target={kpis.leads}/>,                  d:kpis.leadsD,pos:true},
    {l:"CAC",          v:<AnimNum target={kpis.cac}  prefix="$"/>,       d:kpis.cacD,  pos:false},
    {l:"LTV",          v:<AnimNum target={kpis.ltv}  prefix="$"/>,       d:kpis.ltvD,  pos:true},
    {l:"Conv. Rate",   v:<AnimNum target={kpis.conv} suffix="%" dec={1}/>,d:kpis.convD, pos:true},
    {l:"NPS Score",    v:<AnimNum target={kpis.nps}/>,                    d:kpis.npsD,  pos:true},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:15}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:11}}>
        {kpiRows.map(k=>(
          <Card key={k.l} ch>
            <div style={{fontSize:".65rem",fontWeight:600,color:T.muted,letterSpacing:".09em",textTransform:"uppercase",marginBottom:5}}>{k.l}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.85rem",color:T.white,lineHeight:1,marginBottom:5}}>{k.v}</div>
            <div style={{fontSize:".72rem",fontWeight:600,color:k.pos?T.emerald:T.rose,display:"flex",alignItems:"center",gap:3}}>
              {k.pos?"▲":"▼"} {Math.abs(k.d)}% <span style={{color:T.muted,fontWeight:400,marginLeft:2}}>vs last mo</span>
            </div>
          </Card>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:13}}>
        <Card>
          {SH("Revenue vs Target")}
          {SM("Monthly performance · Full year")}
          <ResponsiveContainer width="100%" height={210}>
            <ComposedChart data={revenue}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.cyan} stopOpacity={.28}/><stop offset="95%" stopColor={T.cyan} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="month" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>"$"+Math.round(v/1000)+"K"} width={40}/>
              <Tooltip content={<TT/>}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={T.cyan} fill="url(#rg)" strokeWidth={2.5} dot={false}/>
              <Line  type="monotone" dataKey="target"  name="Target"  stroke={T.amber} strokeWidth={1.5} strokeDasharray="5 3" dot={false}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          {SH("Channel Mix")}
          <ResponsiveContainer width="100%" height={145}>
            <PieChart>
              <Pie data={channels} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" strokeWidth={0}>
                {channels.map((_,i)=><Cell key={i} fill={PIE_CLR[i%PIE_CLR.length]}/>)}
              </Pie>
              <Tooltip content={({active,payload})=>active&&payload?.length?(
                <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"7px 11px",fontSize:".77rem"}}>
                  <b style={{color:T.white}}>{payload[0].name}</b><br/>
                  <span style={{color:T.muted}}>Share: </span><b>{payload[0].value}%</b>
                </div>
              ):null}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:2}}>
            {channels.slice(0,4).map((ch,i)=>(
              <div key={ch.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:7,height:7,borderRadius:"50%",background:PIE_CLR[i%PIE_CLR.length]}}/><span style={{fontSize:".73rem",color:T.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:100}}>{ch.name}</span></div>
                <span style={{...mono,fontSize:".73rem",color:T.text,fontWeight:600}}>{ch.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        {SH("Monthly Pipeline — Leads & Conversions")}
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={revenue} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} width={28}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{fontSize:".76rem",color:T.muted,paddingTop:8}}/>
            <Bar dataKey="leads" name="Leads" fill={T.sky} radius={[3,3,0,0]} opacity={.85}/>
            <Bar dataKey="conversions" name="Conversions" fill={T.emerald} radius={[3,3,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── CAMPAIGNS TAB ──
function CampaignsTab() {
  const [filter,setFilter]=useState("all");
  const visible=filter==="all"?DATA.campaigns:DATA.campaigns.filter(c=>c.status===filter);
  const SB=({s})=>{
    const m={active:{bg:"rgba(16,185,129,.15)",c:T.emerald},paused:{bg:"rgba(245,158,11,.15)",c:T.amber},draft:{bg:"rgba(90,116,153,.15)",c:T.muted}}[s]||{bg:T.border,c:T.muted};
    return <span style={{fontSize:".65rem",fontWeight:700,padding:"2px 8px",borderRadius:100,background:m.bg,color:m.c,letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{s}</span>;
  };
  const tot=DATA.campaigns.reduce((a,c)=>({b:a.b+c.budget,s:a.s+c.spent,l:a.l+c.leads,v:a.v+c.conv}),{b:0,s:0,l:0,v:0});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11}}>
        {[{l:"Total Budget",v:"$"+tot.b.toLocaleString()},{l:"Total Spent",v:"$"+tot.s.toLocaleString()},{l:"Total Leads",v:tot.l.toLocaleString()},{l:"Conversions",v:tot.v.toLocaleString()}].map(s=>(
          <Card key={s.l}>
            <div style={{fontSize:".65rem",color:T.muted,fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",marginBottom:5}}>{s.l}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:T.white}}>{s.v}</div>
          </Card>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        {["all","active","paused"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${filter===f?T.sky:T.border}`,background:filter===f?"rgba(14,165,233,.12)":T.card,color:filter===f?T.sky:T.muted,fontWeight:600,fontSize:".78rem",cursor:"pointer",textTransform:"capitalize",transition:"all .18s"}}>
            {f==="all"?`All (${DATA.campaigns.length})`:f}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {visible.map(c=>(
          <Card key={c.id} ch p={16}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:".92rem",color:T.white,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                <div style={{fontSize:".74rem",color:T.muted}}>{c.channel}</div>
              </div>
              <SB s={c.status}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
              {[{l:"Budget",v:"$"+c.budget.toLocaleString(),c:T.text},{l:"Spent",v:"$"+c.spent.toLocaleString(),c:T.amber},{l:"Leads",v:c.leads,c:T.sky},{l:"ROAS",v:c.roas>0?c.roas+"×":"—",c:c.roas>=3?T.emerald:c.roas>0?T.amber:T.muted}].map(m=>(
                <div key={m.l} style={{textAlign:"center",background:T.bg,borderRadius:8,padding:"7px 4px"}}>
                  <div style={{...mono,fontSize:".86rem",fontWeight:600,color:m.c}}>{m.v}</div>
                  <div style={{fontSize:".61rem",color:T.muted,marginTop:2}}>{m.l}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:".69rem",color:T.muted,marginBottom:4}}>
                <span>Budget used</span>
                <span style={{...mono,color:T.text,fontWeight:600}}>{c.budget>0?Math.round((c.spent/c.budget)*100):0}%</span>
              </div>
              <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${c.budget>0?Math.min((c.spent/c.budget)*100,100):0}%`,background:c.budget>0&&c.spent/c.budget>.9?T.rose:c.budget>0&&c.spent/c.budget>.7?T.amber:T.emerald,borderRadius:3,transition:"width 1s ease"}}/>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── LEADS TAB ──
function LeadsTab() {
  const [sf,setSf]=useState("all");
  const [q,setQ]=useState("");
  const vis=DATA.leads.filter(l=>(!q||[l.name,l.co,l.src].some(v=>v.toLowerCase().includes(q.toLowerCase())))&&(sf==="all"||l.stage===sf));
  const cnt=STAGES.reduce((a,s)=>({...a,[s]:DATA.leads.filter(l=>l.stage===s).length}),{all:DATA.leads.length});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:2}}>
        {["all",...STAGES].map(s=>(
          <button key={s} onClick={()=>setSf(s)}
            style={{flexShrink:0,padding:"7px 11px",borderRadius:10,border:`1px solid ${sf===s?T.sky:T.border}`,background:sf===s?"rgba(14,165,233,.1)":T.card,cursor:"pointer",textAlign:"center",minWidth:62,transition:"all .2s"}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.05rem",color:sf===s?T.white:T.muted}}>{cnt[s]||0}</div>
            <div style={{fontSize:".58rem",color:sf===s?T.sky:T.muted,fontWeight:600,marginTop:1,textTransform:"uppercase",letterSpacing:".05em"}}>{s==="all"?"All":s.slice(0,5)}</div>
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"8px 12px",alignItems:"center"}}>
        <span style={{color:T.muted}}>🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search leads…"
          style={{background:"transparent",border:"none",outline:"none",fontSize:".86rem",color:T.text,flex:1,minWidth:0}}/>
        {q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:".8rem"}}>✕</button>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {vis.length===0&&<div style={{textAlign:"center",padding:36,color:T.muted}}>No leads found.</div>}
        {vis.map(l=>(
          <Card key={l.id} ch p={15}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:".9rem",color:T.white,marginBottom:2}}>{l.name}</div>
                <div style={{fontSize:".74rem",color:T.muted}}>{l.co} · {l.src}</div>
              </div>
              <span style={{fontSize:".67rem",fontWeight:700,padding:"2px 8px",borderRadius:100,background:(STAGE_CLR[l.stage]||T.muted)+"22",color:STAGE_CLR[l.stage]||T.muted,flexShrink:0,marginLeft:8}}>{l.stage}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 2fr",gap:8}}>
              <div style={{background:T.bg,borderRadius:8,padding:"7px",textAlign:"center"}}>
                <div style={{...mono,fontSize:".85rem",fontWeight:600,color:T.emerald}}>${l.val.toLocaleString()}</div>
                <div style={{fontSize:".61rem",color:T.muted,marginTop:1}}>Deal Value</div>
              </div>
              <div style={{background:T.bg,borderRadius:8,padding:"7px",textAlign:"center"}}>
                <div style={{...mono,fontSize:".85rem",fontWeight:600,color:l.score>79?T.emerald:l.score>59?T.amber:T.rose}}>{l.score}</div>
                <div style={{fontSize:".61rem",color:T.muted,marginTop:1}}>Score</div>
              </div>
              <div style={{background:T.bg,borderRadius:8,padding:"7px"}}>
                <div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden",margin:"6px 0"}}>
                  <div style={{height:"100%",width:l.score+"%",background:l.score>79?T.emerald:l.score>59?T.amber:T.rose,borderRadius:2}}/>
                </div>
                <div style={{fontSize:".61rem",color:T.muted,textAlign:"center"}}>Score bar</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── EVENTS TAB ──
function EventsTab() {
  const [evts,setEvts]=useState(DATA.events);
  const [form,setForm]=useState({type:"lead_captured",desc:""});
  const [open,setOpen]=useState(false);
  const TYPES=["lead_captured","email_opened","demo_booked","deal_closed","campaign_launched","page_view"];
  const ICO={lead_captured:"👤",email_opened:"📧",demo_booked:"📅",deal_closed:"💰",campaign_launched:"🚀",page_view:"👁"};
  const CLR={lead_captured:T.sky,email_opened:T.violet,demo_booked:T.amber,deal_closed:T.emerald,campaign_launched:T.cyan,page_view:T.muted};
  const add=()=>{
    if(!form.desc.trim()) return;
    setEvts(p=>[{id:"e"+Date.now(),type:form.type,ico:ICO[form.type]||"📌",desc:form.desc,time:new Date().toISOString(),clr:CLR[form.type]||T.muted},...p]);
    setForm({type:"lead_captured",desc:""});
    setOpen(false);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:13}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:9}}>
        <div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1rem",color:T.white}}>Live Activity Feed</div>
          <div style={{fontSize:".76rem",color:T.muted,marginTop:2,display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:T.emerald,display:"inline-block",animation:"pulse 2s infinite"}}/>
            {evts.length} events · streaming live
          </div>
        </div>
        <button onClick={()=>setOpen(!open)} className="bg"
          style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:"8px 16px",borderRadius:9,fontWeight:700,fontSize:".82rem",cursor:"pointer"}}>
          + Log Event
        </button>
      </div>

      {open&&(
        <Card c={{background:"rgba(14,165,233,.05)",border:`1px solid rgba(14,165,233,.2)`}}>
          <div style={{display:"flex",gap:10}}>
            <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}
              style={{background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"9px 11px",borderRadius:9,fontSize:".84rem",outline:"none",cursor:"pointer",flexShrink:0}}>
              {TYPES.map(t=><option key={t} value={t}>{t.replace(/_/g," ")}</option>)}
            </select>
            <input value={form.desc} onChange={e=>setForm(p=>({...p,desc:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Describe what happened…"
              style={{background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"9px 12px",borderRadius:9,fontSize:".84rem",outline:"none",flex:1,minWidth:0}}/>
            <button onClick={add} className="bg"
              style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:"9px 16px",borderRadius:9,fontWeight:700,fontSize:".83rem",cursor:"pointer",whiteSpace:"nowrap"}}>
              Log
            </button>
          </div>
        </Card>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {evts.map((ev,i)=>(
          <div key={ev.id} className="ch" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"12px 15px",display:"flex",alignItems:"flex-start",gap:11,animation:i===0?"fadeUp .4s ease":undefined}}>
            <div style={{width:34,height:34,borderRadius:9,background:(ev.clr||T.muted)+"18",border:`1px solid ${(ev.clr||T.muted)}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem",flexShrink:0}}>{ev.ico||"📌"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:".84rem",color:T.white,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ev.desc}</div>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <span style={{fontSize:".66rem",fontWeight:700,padding:"1px 7px",borderRadius:100,background:(ev.clr||T.muted)+"18",color:ev.clr||T.muted,textTransform:"capitalize",whiteSpace:"nowrap"}}>{(ev.type||"").replace(/_/g," ")}</span>
                <span style={{fontSize:".71rem",color:T.muted}}>{fmtAgo(ev.time)}</span>
              </div>
            </div>
            <span style={{...mono,fontSize:".67rem",color:T.muted,flexShrink:0}}>{new Date(ev.time).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TRAFFIC TAB ──
function TrafficTab() {
  const {traffic,channels}=DATA;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:11}}>
        {[{l:"Total Sessions",v:(traffic.reduce((s,r)=>s+r.sessions,0)/1000).toFixed(0)+"K"},{l:"Page Views",v:(traffic.reduce((s,r)=>s+r.pageviews,0)/1000).toFixed(0)+"K"},{l:"Avg Bounce",v:(traffic.reduce((s,r)=>s+r.bounceRate,0)/traffic.length).toFixed(1)+"%"},{l:"Pages/Session",v:"3.4"}].map(s=>(
          <Card key={s.l} ch>
            <div style={{fontSize:".65rem",color:T.muted,fontWeight:600,letterSpacing:".09em",textTransform:"uppercase",marginBottom:5}}>{s.l}</div>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.6rem",color:T.white}}>{s.v}</div>
          </Card>
        ))}
      </div>
      <Card>
        {SH("Sessions & Page Views")}
        <ResponsiveContainer width="100%" height={215}>
          <LineChart data={traffic}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
            <XAxis dataKey="month" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis yAxisId="l" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>Math.round(v/1000)+"K"} width={34}/>
            <YAxis yAxisId="r" orientation="right" tick={{fill:T.muted,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>Math.round(v/1000)+"K"} width={34}/>
            <Tooltip content={<TT/>}/>
            <Legend wrapperStyle={{fontSize:".76rem",color:T.muted,paddingTop:8}}/>
            <Line yAxisId="l" type="monotone" dataKey="sessions"  name="Sessions"   stroke={T.sky}    strokeWidth={2.5} dot={{fill:T.sky,r:2.5}}/>
            <Line yAxisId="r" type="monotone" dataKey="pageviews" name="Page Views" stroke={T.violet} strokeWidth={2.5} dot={{fill:T.violet,r:2.5}}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        {SH("Channel Attribution")}
        {SM("Lead volume by source")}
        {channels.map((ch,i)=>(
          <div key={ch.name} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:7,height:7,borderRadius:"50%",background:PIE_CLR[i%PIE_CLR.length]}}/><span style={{fontSize:".83rem",color:T.text}}>{ch.name}</span></div>
              <div style={{display:"flex",gap:12}}><span style={{...mono,fontSize:".77rem",color:T.muted}}>{ch.leads} leads</span><span style={{...mono,fontSize:".77rem",color:PIE_CLR[i%PIE_CLR.length],fontWeight:600}}>{ch.value}%</span></div>
            </div>
            <div style={{height:6,background:T.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:ch.value+"%",background:PIE_CLR[i%PIE_CLR.length],borderRadius:3,transition:"width 1.1s ease"}}/></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── MAIN ──
const TABS=[{k:"overview",ico:"◈",l:"Overview"},{k:"campaigns",ico:"🎯",l:"Campaigns"},{k:"leads",ico:"👥",l:"Leads"},{k:"traffic",ico:"🌐",l:"Traffic"},{k:"events",ico:"⚡",l:"Live Feed"}];

export default function App() {
  const [tab,setTab]=useState("overview");
  const [signup,setSignup]=useState(false);

  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",flexDirection:"column"}}>
      <style>{GS}</style>
      {signup&&<SignupModal onClose={()=>setSignup(false)}/>}

      {/* TOPBAR */}
      <header style={{position:"sticky",top:0,zIndex:100,background:"rgba(6,13,26,.97)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.border}`,padding:"0 24px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:7,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:".76rem",color:"#fff",fontFamily:"Georgia,serif",flexShrink:0}}>ZT</div>
          <span style={{fontWeight:700,fontSize:".92rem",color:T.white}}>Zolex<span style={{color:T.cyan}}>Analytics</span></span>
          <span style={{fontSize:".65rem",fontWeight:700,padding:"2px 9px",borderRadius:100,background:"rgba(245,158,11,.15)",color:T.amber,letterSpacing:".06em",textTransform:"uppercase"}}>Demo</span>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{...mono,fontSize:".7rem",color:T.muted,background:T.card,border:`1px solid ${T.border}`,padding:"4px 10px",borderRadius:6,display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:T.emerald,display:"inline-block",animation:"pulse 2s infinite"}}/>Live demo
          </div>
          <button onClick={()=>setSignup(true)} className="bg"
            style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:"8px 18px",borderRadius:8,fontWeight:700,fontSize:".8rem",cursor:"pointer",boxShadow:`0 4px 16px rgba(6,182,212,.28)`,whiteSpace:"nowrap"}}>
            Start Free Trial
          </button>
        </div>
      </header>

      {/* LIVE TICKER */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,overflow:"hidden",height:32,display:"flex",alignItems:"center"}}>
        <div style={{display:"flex",gap:48,whiteSpace:"nowrap",animation:"ticker 28s linear infinite"}}>
          {[...Array(2)].map((_,rep)=>["💰 Deal closed: $28,400 · James Wilson","📈 MRR up 12.4% this month","🎯 4.1× ROAS on Google PPC","👤 New lead: Sofia Reyes via Google Ads","⚡ LinkedIn Outreach Q2 launched","📅 Demo booked: Kwame @ Forge Systems","🏆 NPS: 67 · +3 pts this quarter"].map((t,i)=>(
            <span key={`${rep}-${i}`} style={{fontSize:".71rem",color:T.muted,fontWeight:500,flexShrink:0}}>
              <span style={{color:T.border,marginRight:14}}>◆</span>{t}
            </span>
          )))}
        </div>
      </div>

      {/* LAYOUT */}
      <div style={{display:"flex",flex:1,minHeight:0}}>
        {/* SIDEBAR */}
        <aside style={{width:188,flexShrink:0,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",position:"sticky",top:86,height:"calc(100vh - 86px)",overflowY:"auto"}}>
          <nav style={{padding:"12px 8px",flex:1}}>
            <div style={{fontSize:".59rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:T.muted,padding:"4px 11px 10px"}}>Analytics</div>
            {TABS.map(n=>(
              <button key={n.k} onClick={()=>setTab(n.k)}
                style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"9px 11px",borderRadius:9,border:"none",background:tab===n.k?"rgba(14,165,233,.13)":"transparent",color:tab===n.k?T.sky:T.muted,fontWeight:tab===n.k?600:400,fontSize:".84rem",cursor:"pointer",marginBottom:2,textAlign:"left",transition:"all .18s"}}>
                <span style={{fontSize:".9rem",width:18,textAlign:"center",flexShrink:0}}>{n.ico}</span>
                {n.l}
                {tab===n.k&&<span style={{marginLeft:"auto",width:5,height:5,borderRadius:"50%",background:T.cyan,flexShrink:0}}/>}
              </button>
            ))}
          </nav>
          <div style={{padding:"12px 10px",borderTop:`1px solid ${T.border}`}}>
            <div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.2)",borderRadius:9,padding:"10px 12px",marginBottom:10}}>
              <div style={{fontSize:".69rem",fontWeight:700,color:T.amber,marginBottom:4}}>👁 Demo Mode</div>
              <div style={{fontSize:".7rem",color:T.muted,lineHeight:1.5,marginBottom:8}}>Viewing sample data. Sign up to connect real accounts.</div>
              <button onClick={()=>setSignup(true)} className="bg"
                style={{width:"100%",padding:"8px",borderRadius:8,background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",fontWeight:700,fontSize:".76rem",cursor:"pointer"}}>
                Start Free Trial →
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{flex:1,minWidth:0,padding:24,overflowY:"auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.05rem",color:T.white}}>
              {TABS.find(t=>t.k===tab)?.ico} {TABS.find(t=>t.k===tab)?.l}
            </div>
            <div style={{...mono,fontSize:".68rem",color:T.muted,background:T.card,border:`1px solid ${T.border}`,padding:"3px 9px",borderRadius:5}}>demo data · no backend required</div>
          </div>

          {tab==="overview"  && <OverviewTab/>}
          {tab==="campaigns" && <CampaignsTab/>}
          {tab==="leads"     && <LeadsTab/>}
          {tab==="traffic"   && <TrafficTab/>}
          {tab==="events"    && <EventsTab/>}
        </main>
      </div>

      {/* CTA FOOTER */}
      <div style={{background:`linear-gradient(135deg,rgba(14,165,233,.08),rgba(139,92,246,.08))`,borderTop:`1px solid ${T.border}`,padding:"28px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexShrink:0,flexWrap:"wrap"}}>
        <div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:"1.35rem",color:T.white,marginBottom:3}}>Ready to connect your real data?</div>
          <div style={{fontSize:".86rem",color:T.muted}}>14-day free trial · Full Pro access · No credit card required</div>
        </div>
        <button onClick={()=>setSignup(true)} className="bg"
          style={{background:`linear-gradient(135deg,${T.sky},${T.cyan})`,border:"none",color:"#000",padding:"13px 28px",borderRadius:10,fontWeight:800,fontSize:".92rem",cursor:"pointer",boxShadow:`0 6px 22px rgba(6,182,212,.32)`,whiteSpace:"nowrap"}}>
          Start Your Free Trial →
        </button>
      </div>
    </div>
  );
}
