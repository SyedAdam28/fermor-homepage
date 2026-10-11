"use client";
import {useEffect,useRef,useState,type PointerEvent} from 'react';
import {ArrowUpRight,ArrowRight,TrendingUp,Target,Wallet,Home,Plane,Shield,ChevronRight,Check} from 'lucide-react';
import {projectSavings,formatRupees,requiredContribution} from '@/lib/projection';
import {Atmosphere} from "./atmosphere";
import {ClosingQuestions} from './closing-questions';
import {handSequence,thumbGesture} from '@/lib/hand-sequence';
import {RollingValue,ProgressRing} from './motion-ui';
import {FinancialWaves} from './financial-waves';
export function FermorSymbol(){return <svg viewBox="-1.04 -0.79 2.08 1.58" fill="currentColor" aria-hidden="true"><path d="M0.9526 -0.7447 L0.7342 -0.4684 L0.1684 -0.4684 L-0.2895 0.1132 L-1 0.1132 L-0.7868 -0.1579 L-0.4342 -0.1579 L0.0289 -0.7447 Z"/><path d="M-0.9526 0.7447 L-0.7342 0.4684 L-0.1684 0.4684 L0.2895 -0.1132 L1 -0.1132 L0.7868 0.1579 L0.4342 0.1579 L-0.0289 0.7447 Z"/></svg>}
export function MiniLine({purple=false,animate=false,reduced=false}:{purple?:boolean;animate?:boolean;reduced?:boolean}){return <svg viewBox="0 0 280 100" className={'mini-line '+(animate&&!reduced?'chart-reveal':'')} role="img" aria-label="Illustrative trend"><path className="trend-path" pathLength="1" d="M0 90L20 84L40 88L60 68L80 75L100 55L120 61L140 43L160 50L180 25L200 31L220 16L240 22L280 3" fill="none" stroke={purple?'#b8a6fc':'#83e2a0'} strokeWidth="2.5"/><path d="M0 98H280M0 65H280M0 32H280" stroke="currentColor" opacity=".08"/></svg>}
export function ColumnBars({animate=false,reduced=false}:{animate?:boolean;reduced?:boolean}){return <div className={'column-bars '+(animate&&!reduced?'bars-settle':'')} aria-hidden="true">{[40,57,44,75,62,88,74,100].map((n,i)=><div key={i}><i style={{height:n+'%',animationDelay:`${i*55}ms`}}/><span>{['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'][i]}</span></div>)}</div>}
export function MoneyInsights({reduced}:{reduced:boolean}){
 const [view,setView]=useState(0);const [replay,setReplay]=useState(0);const [pause,setPause]=useState(false);const [visible,setVisible]=useState(false);const ref=useRef<HTMLElement>(null);const titles=['Spending','Savings','Investments'];
 useEffect(()=>{const handle=(event:Event)=>{const i=(event as CustomEvent<{index:number}>).detail?.index;if(Number.isInteger(i)&&i>=0&&i<3){setView(i);setReplay(n=>n+1);setPause(true)}};window.addEventListener('fermor:insight',handle);return()=>window.removeEventListener('fermor:insight',handle)},[]);
 useEffect(()=>{const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.25});if(ref.current)observer.observe(ref.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(pause||reduced||!visible)return;const id=setInterval(()=>{if(!document.hidden)setView(v=>(v+1)%3)},4500);return()=>clearInterval(id)},[pause,reduced,visible]);
 return <section className="money-insights" id="insights" ref={ref}><FinancialWaves variant="insights" reduced={reduced}/>
  <div className="insight-copy"><span className="eyebrow">YOUR EVERYDAY, IN FOCUS</span><h2>A clearer view.<br/>A better<br/><em>next move.</em></h2><p>Understand where your money goes. Spot patterns and make more confident decisions.</p><a className="button mint insight-ask" href="#ask">Ask about your money <ArrowUpRight size={17}/></a></div>
  <div className="insight-demo">
   <div className="insight-tabs" aria-label="Financial overview examples">{titles.map((t,i)=><button key={t} aria-pressed={view===i} className={view===i?'active':''} onClick={()=>{setView(i);setReplay(v=>v+1);setPause(true)}}><span className="tab-dot"/>{t}</button>)}</div>
   <div className="insight-panels">
    <div className="main-insight" key={`${view}-${replay}`}><span>{['Monthly spending','Your savings','Investment value'][view]} <small>Sample profile</small></span><div className="insight-value-row"><strong><RollingValue value={[48320,324000,871230][view]} run={visible} reduced={reduced}/></strong><span className="insight-value-badge">{['↓ 12%','65% of goal','Sample trend'][view]}</span></div><div className="insight-change">{['₹6,620 less than the previous month','An emergency fund, taking shape','One view across your sample holdings'][view]}</div>
     {view===0?<><ColumnBars animate={visible} reduced={reduced}/><div className="spending-categories" aria-label="Sample spending categories">{[['Food & dining',12480,'26%'],['Shopping',9840,'20%'],['Transport',7260,'15%'],['Bills & utilities',6480,'13%'],['Other',12260,'26%']].map(([name,amount,share],i)=><div key={name}><i className={'category-dot category-'+i}/><span>{name}</span><strong>{formatRupees(Number(amount))}</strong><small>{share}</small></div>)}</div></>:view===1?<div className="saving-visual"><ProgressRing animate run={visible} reduced={reduced} color="#67c58e" track="#31453c"/><div><span>Emergency fund</span><b><RollingValue value={324000} run={visible} reduced={reduced}/> <small>of ₹5L goal</small></b><i><span/></i><p>₹1,76,000 to your sample target</p></div></div>:<><MiniLine purple animate={visible} reduced={reduced}/><div className="allocation"><span>Equity <b>60%</b></span><span>Funds <b>30%</b></span><span>Other <b>10%</b></span></div></>}
    </div>
    <div className="takeaway-insight"><div className="takeaway-icon">{view===0?<Wallet size={18}/>:view===1?<Shield size={18}/>:<TrendingUp size={18}/>}</div><div><span>A LITTLE CONTEXT</span><h3>{['Your patterns. Made visible.','Room for the unexpected.','See the whole picture.'][view]}</h3><p>{['Compare monthly patterns. Find what changed.','Track progress toward your emergency fund.','See how your holdings fit together.'][view]}</p></div><a href="#ask" aria-label="Explore this topic with the assistant"><ArrowUpRight size={19}/></a></div>
   </div><div className="insight-caption">Choose a view · Sample overview <span>{String(view+1).padStart(2,'0')} / 03</span></div>
  </div>
 </section>;
}
const investmentTopics=[{name:'Stocks',kicker:'A SHARE IN A BUSINESS',heading:'Understand what you own.',copy:'Explore individual companies and the role they could play in a portfolio. Start with context, including the risks.',amount:'₹22,345',label:'Example holding value',rows:[['Banking','32%'],['Technology','28%'],['Other sectors','40%']],card:'Company by company.',hint:'Explore performance and sector exposure.'},{name:'Mutual funds',kicker:'MANY HOLDINGS. ONE FUND.',heading:'Build a steady habit.',copy:'Understand how pooled investments work, explore different fund categories, and plan contributions around your goals.',amount:'₹5,000',label:'Example monthly contribution',rows:[['Equity funds','52%'],['Hybrid funds','28%'],['Debt funds','20%']],card:'A little, consistently.',hint:'See how a regular contribution could add up.'},{name:'ETFs',kicker:'A BASKET OF POSSIBILITIES',heading:'Take a broader view.',copy:'Explore exchange-traded funds and the markets they track. Compare diversification, costs and market risk.',amount:'₹24,300',label:'Example investment value',rows:[['Broad market','60%'],['Sector funds','25%'],['Other exposure','15%']],card:'Look beyond one company.',hint:'Understand the basket behind an investment.'}];
export function InvestmentExplorer({reduced}:{reduced:boolean}){
 const ref=useRef<HTMLElement>(null),frame=useRef(0),selected=useRef(0),motion=useRef(reduced);motion.current=reduced;
 const [active,setActive]=useState(0);
 function apply(angle:number,touch:number){const el=ref.current;if(!el)return;el.style.setProperty('--thumb-angle',angle+'deg');el.style.setProperty('--thumb-touch',String(touch*.45));el.style.setProperty('--swipe-lift',(-touch*42)+'px');}
 function setTopic(index:number){if(selected.current!==index){selected.current=index;setActive(index)}}
 function choose(index:number){cancelAnimationFrame(frame.current);const previous=selected.current;if(motion.current){setTopic(index);apply(0,0);return}let start=0;const reverse=index<previous;const tick=(now:number)=>{if(!start)start=now;const p=Math.min(1,(now-start)/1000),gesture=thumbGesture(reverse?1-p:p);apply(gesture.angle,gesture.touch);if(p>=.5)setTopic(index);if(p<1)frame.current=requestAnimationFrame(tick);else{frame.current=0;apply(0,0)}};frame.current=requestAnimationFrame(tick);}
 useEffect(()=>{
  if(reduced){apply(0,0);return}let raf=0;const update=()=>{raf=0;const el=ref.current;if(!el)return;if(window.innerWidth<900){cancelAnimationFrame(frame.current);frame.current=0;apply(0,0);return}const r=el.getBoundingClientRect();if(r.top>window.innerHeight||r.bottom<0)return;cancelAnimationFrame(frame.current);frame.current=0;const p=Math.max(0,Math.min(1,-r.top/Math.max(1,el.offsetHeight-window.innerHeight))),pose=handSequence(p);setTopic(pose.index);apply(reduced?0:pose.angle,reduced?0:pose.touch);};
  const scroll=()=>{if(!raf)raf=requestAnimationFrame(update)};update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);
  return()=>{cancelAnimationFrame(raf);cancelAnimationFrame(frame.current);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)};
 },[reduced]);
 useEffect(()=>{if(reduced){cancelAnimationFrame(frame.current);apply(0,0)}},[reduced]);
 const t=investmentTopics[active];
 return <section ref={ref} className={'investment-section '+(reduced?'no-pin':'')} id="explore" data-topic={active}><div className="investment-sticky"><FinancialWaves variant="explore" reduced={reduced}/><Atmosphere kind="ribbons" variant="explore" reduced={reduced}/><div className="investment-waves"/><div className="investment-top"><span className="eyebrow">EXPLORE YOUR POSSIBILITIES</span><span>ILLUSTRATIVE PRODUCT DEMO</span></div><div className="investment-layout"><div className="investment-copy"><h2>Make room<br/>for <em>what’s next.</em></h2><p>Different ways to invest.<br/>A clearer way to understand them.</p><div className="investment-select" aria-label="Investment examples">{investmentTopics.map((item,i)=><button key={item.name} aria-pressed={i===active} onClick={()=>choose(i)} className={active===i?'active':''}><span>0{i+1}</span>{item.name}<ArrowUpRight size={15}/></button>)}</div><div className="swipe-controls"><span>Scroll, or choose a category</span></div></div><div className="held-phone scrubbed-hand"><div className="held-art finger-only"><img className="held-base" src="/images/hand-phone-repaired.webp" alt="A hand holding the interactive investment phone" loading="lazy" width={833} height={998}/><div className="held-screen"><div className="held-island"/><div className="held-page" key={active}><div className="held-status">9:41 <span>▰</span></div><div className="held-title">Fermor <span>＋</span></div><div className="held-nav"><b>{t.name}</b><span>Overview</span></div><p>{t.label}</p><h3>{t.amount}</h3><span className="held-gain">Illustrative example</span><MiniLine/><div className="held-periods">1M <b>1Y</b> ALL</div><div className="held-summary"><span>Understand the mix</span>{t.rows.map(([label,value])=><div key={label}><i/>{label}<b>{value}</b></div>)}</div><div className="held-cta">Explore {t.name.toLowerCase()} <ArrowRight size={10}/></div><div className="held-foot">◉ <span>▥</span> ◎</div></div></div><span className="thumb-swipe-layer" aria-hidden="true"><img className="hand-thumb-local" src="/images/thumb-swipe.webp" alt="" aria-hidden="true" loading="lazy" width={833} height={998}/></span><span className="phone-touch" aria-hidden="true"/></div></div><div className="investment-context" key={active} aria-live="polite"><span className="eyebrow">{t.kicker}</span><h3>{t.heading}</h3><p>{t.copy}</p><div className="invest-note"><TrendingUp size={18}/><span>{t.card}</span><strong>{active===1?'₹5,000 / month':'Explore the bigger picture'}</strong><p>{t.hint}</p><a href="#plan">Try the planner <ArrowUpRight size={18}/></a></div><small>Investments carry risk. These are educational examples.</small></div></div></div></section>
}
export function GoalPlanner({reduced=false}:{reduced?:boolean}) {
  const [monthly,setMonthly]=useState(10000);
  const [years,setYears]=useState(5);
  const [rate,setRate]=useState(7);
  const [goal,setGoal]=useState(0);
  const [target,setTarget]=useState(3000000);
  const [inspect,setInspect]=useState(5);
  const [hovering,setHovering]=useState(false);
  const [exploring,setExploring]=useState(false);
  const showMarker=hovering||exploring;
  const {points,value,contributions}=projectSavings(monthly,years,rate);
  const needed=requiredContribution(target,years,rate);
  const shortfall=Math.max(0,needed-monthly);
  const growth=value-contributions;
  const selected=points[Math.min(inspect,years)];
  const max=Math.max(value,target)*1.17;
  const x=(year:number)=>42+year/years*416;
  const y=(amount:number)=>165-amount/max*130;
  const path=points.map((point,i)=>`${i?'L':'M'} ${x(point.year)} ${y(point.value)}`).join(' ');
  const goals=[{name:'Home',icon:Home,target:3000000},{name:'Travel',icon:Plane,target:300000},{name:'Emergency fund',icon:Shield,target:500000}];
  useEffect(()=>setInspect(years),[years]);
  function inspectChart(e:PointerEvent<HTMLDivElement>) {
    const svg=e.currentTarget.querySelector('svg');
    if(!svg)return;
    const r=svg.getBoundingClientRect(),scale=Math.min(r.width/500,r.height/200);
    const left=r.left+(r.width-500*scale)/2;
    setInspect(Math.max(0,Math.min(years,Math.round(((e.clientX-left)/scale-42)/416*years))));
  }
  return <section className="planner-section planner-clean" id="plan"><Atmosphere kind="glass" variant="plan" reduced={reduced}/><FinancialWaves variant="plan" reduced={reduced}/>
    <div className="planner-heading"><div><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>Turn a someday <em>into a plan.</em></h2></div></div>
    <div className="planner-layout">
      <div className="planner-controls">
        <div className="goal-select" aria-label="Choose a goal">{goals.map(({name,icon:Icon,target:amount},i)=><button key={name} aria-pressed={goal===i} className={goal===i?'active':''} onClick={()=>{setGoal(i);setTarget(amount)}}><Icon size={17}/>{name}</button>)}</div>
        <label className="goal-target" htmlFor="goal-target"><span>Goal amount</span><span>₹ <input id="goal-target" type="number" min="10000" max="100000000" step="10000" value={target} onChange={e=>setTarget(Math.max(10000,Math.min(100000000,Number(e.target.value))))}/></span></label>
        <label className="slider-label" htmlFor="monthly"><span>Monthly contribution</span><strong>{formatRupees(monthly)}</strong></label>
        <input id="monthly" type="range" min="1000" max="50000" step="1000" value={monthly} onChange={e=>setMonthly(Number(e.target.value))}/>
        <div className="contribution-presets" aria-label="Monthly contribution shortcuts">{[5000,10000,20000].map(amount=><button key={amount} aria-pressed={monthly===amount} className={monthly===amount?'active':''} onClick={()=>setMonthly(amount)}>{formatRupees(amount)}</button>)}</div>
        <label className="slider-label" htmlFor="years"><span>Time to reach your goal</span><strong>{years} {years===1?'year':'years'}</strong></label>
        <input id="years" type="range" min="1" max="20" value={years} onChange={e=>setYears(Number(e.target.value))}/>
        <div className="range-ends"><span>1 year</span><span>20 years</span></div>
        <label className="return-label" htmlFor="return">Assumed annual return <select id="return" value={rate} onChange={e=>setRate(Number(e.target.value))}>{[0,3,5,7,9,12].map(n=><option key={n} value={n}>{n}%</option>)}</select></label>
        <p className="planner-tip"><Shield size={14}/>{goal===2?'Emergency fund? Compare a 0% assumption too.':goal===1?'Shorter goals need more room for uncertainty.':'Adjust the target to match your own plan.'}</p>
      </div>
      <div className="projection-panel forecast-card">
        <div className="forecast-heading"><span>YOUR ILLUSTRATIVE PLAN</span><span>{years}-year horizon</span></div>
        <div className="forecast-total" aria-live="polite"><span>What you could build</span><strong>{formatRupees(value)}</strong></div>
        <div className="forecast-chart-header"><span><i/>Projected value</span><span><i/>Goal · {formatRupees(target)}</span></div>
        <div className="forecast-plot" onPointerEnter={()=>setHovering(true)} onPointerLeave={()=>setHovering(false)} onPointerMove={inspectChart}>
          {showMarker&&<div className="forecast-tooltip" aria-hidden="true">Year {selected.year}<b>{formatRupees(selected.value)}</b></div>}
          <svg viewBox="0 0 500 200" className="forecast-chart" role="img" aria-label={`Illustrative ${years}-year projection: ${formatRupees(value)}, against a ${formatRupees(target)} goal, at ${rate}% assumed annual return.`}>
            <defs><linearGradient id="forecast-area" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8870cf" stopOpacity=".13"/><stop offset="1" stopColor="#8870cf" stopOpacity="0"/></linearGradient></defs>
            {[0,1,2,3].map(i=><g key={i}><line x1="42" x2="458" y1={165-i*40} y2={165-i*40} stroke="#dce2ec"/><text x="32" y={169-i*40} fontSize="14" textAnchor="end" fill="#52627a">{i===0?'0':(max*i*40/130/100000).toFixed(1)+'L'}</text></g>)}
            <line x1="42" x2="458" y1={y(target)} y2={y(target)} stroke="#59916b" strokeDasharray="4 5"/>
            <g className={reduced?'':'forecast-draw'} key={`${monthly}-${years}-${rate}-${target}`}><path d={path+' L458 165L42 165Z'} fill="url(#forecast-area)"/><path className="forecast-line" pathLength="1" d={path} stroke="#8266be" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" fill="none"/></g>
            {showMarker&&<line x1={x(selected.year)} x2={x(selected.year)} y1="22" y2="165" stroke="#b2a3ce" strokeDasharray="3 5"/>}
            <circle cx={x(showMarker?selected.year:years)} cy={y(showMarker?selected.value:value)} r="4.5" fill="#8266be" stroke="#fff" strokeWidth="2"/>
            {[0,.5,1].map(n=><text key={n} x={42+n*416} y="189" textAnchor="middle" fontSize="14" fill="#52627a">{n===0?'Today':`${Number((years*n).toFixed(1))} years`}</text>)}
          </svg>
        </div>
        <div className="forecast-breakdown" aria-live="polite"><div><span>You contribute</span><strong>{formatRupees(contributions)}</strong></div><div><span>Assumed growth</span><strong>{formatRupees(growth)}</strong></div></div>
        <div className={'forecast-status '+(shortfall===0?'covered':'')} aria-live="polite">{shortfall===0?<Check size={18}/>:<Target size={18}/>}<div><strong>{shortfall===0?'Goal covered in this example':`${formatRupees(Math.ceil(needed))} / month to meet the goal`}</strong><span>{shortfall===0?`${formatRupees(value-target)} above your target`:`${formatRupees(Math.ceil(shortfall))} more than your current contribution`}</span></div></div>
        <details className="forecast-details" onToggle={e=>setExploring(e.currentTarget.open)}><summary>Explore year by year <ChevronRight size={14}/></summary><div><label htmlFor="chart-year">Year {selected.year}<span>{formatRupees(selected.value)}</span></label><input id="chart-year" type="range" min="0" max={years} step="1" value={selected.year} onChange={e=>setInspect(Number(e.target.value))}/><p>Contributed {formatRupees(selected.contributions)} · Assumed growth {formatRupees(selected.value-selected.contributions)}</p></div></details>
        <p className="forecast-disclaimer">Illustration only. Monthly compounding; end-of-month contributions. Returns are assumed. Excludes fees, tax and inflation.</p>
      </div>
    </div>
  </section>;
}
export function ClosingScene({reduced}:{reduced:boolean}){
 return <section className={"closing-chapter"+(reduced?" motion-static":"")} id="how" aria-labelledby="closing-title"><div className="closing-section clarity-horizon closing-sticky"><div className="closing-copy"><span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span><h2 id="closing-title">A clearer tomorrow<br/><em>starts with a question.</em></h2><p>Choose a question. Explore an example.</p></div><ClosingQuestions reduced={reduced}/></div></section>;
}
