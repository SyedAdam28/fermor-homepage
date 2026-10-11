"use client";
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {storyPose,scrollProgress} from '@/lib/story-motion';
import {ArrowUpRight,ChevronLeft,ChevronRight,Home,Target,TrendingUp,Wallet} from 'lucide-react';
import {FermorSymbol,MiniLine,ColumnBars} from './scenes';
import {RollingValue,ProgressRing} from './motion-ui';

export function DashboardAssembly({reduced}:{reduced:boolean}) {
 const ref=useRef<HTMLElement>(null);
 const [stage,setStage]=useState(reduced?3:0),[mode,setMode]=useState(0);
 function apply(p:number){const el=ref.current;if(!el)return;const clamp=(n:number)=>Math.max(0,Math.min(1,n));const a=clamp(p/.75),spend=clamp((p-.02)/.42),goal=clamp((p-.12)/.44),invest=clamp((p-.24)/.44);el.style.setProperty('--assembly',String(a));el.style.setProperty('--spend-entry',String(spend));el.style.setProperty('--goal-entry',String(goal));el.style.setProperty('--invest-entry',String(invest));setStage(invest>.96?3:goal>.96?2:spend>.96?1:0)}
 useEffect(()=>{let raf=0;const update=()=>{raf=0;const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();const p=reduced?1:window.innerWidth<900?(r.top<window.innerHeight*.8&&r.bottom>0?1:0):Math.max(0,Math.min(1,-r.top/(el.offsetHeight-window.innerHeight)));apply(p)};const scroll=()=>{if(!raf)raf=requestAnimationFrame(update)};update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)}},[reduced]);
 return <section ref={ref} className={'assembly-section assembly-orbit '+(reduced?'no-pin':'')} id="overview"><div className="assembly-sticky">
  <span className="orbit-eyebrow eyebrow">DIFFERENT PIECES. ONE PERSPECTIVE.</span>
  <div className="assembly-copy"><h2>Everything.<br/><em>In one picture.</em></h2></div>
  <div className="orbit-visual"><div className={'orbit-stage orbit-focus-'+mode}>
   <div className="orbit-device"><div className="orbit-device-back"/><div className="orbit-device-edge"/><i className="orbit-device-button"/><div className="orbit-phone">
    <div className="orbit-island"/><div className="orbit-status">9:41<span>◔ ▰</span></div><div className="orbit-phone-brand"><FermorSymbol/>Fermor <span>Sample</span></div>
    <span className="orbit-total-label">YOUR FINANCIAL PICTURE</span><strong className="orbit-total"><RollingValue value={1248230} run={stage>=1} reduced={reduced}/></strong>
    <div className="orbit-asset-mix" aria-label="Sample assets: 26% savings, 70% investments and 4% other assets"><i/><i/><i/></div><div className="orbit-mix-labels"><span>Savings 26%</span><span>Investments 70%</span></div>
    <div className="orbit-phone-tabs" aria-label="Phone overview">{['Spending','Goals','Investments'].map((name,i)=><button key={name} aria-pressed={mode===i} className={mode===i?'active':''} onClick={()=>setMode(i)}>{name}</button>)}</div>
    <div className={'orbit-inset orbit-inset-'+mode} key={`phone-${mode}`}><span>{['THIS MONTH','EMERGENCY FUND','INVESTMENT VALUE'][mode]}</span>
     {mode===0?<><strong><RollingValue value={48320} run={stage>=1} reduced={reduced}/></strong><ColumnBars animate={stage>=1} reduced={reduced}/><small>Eight months of sample spending</small></>:mode===1?<><div className="orbit-inset-goal"><ProgressRing animate run={stage>=2} reduced={reduced}/><div><strong><RollingValue value={324000} run={stage>=2} reduced={reduced}/></strong><small>Saved toward ₹5L</small></div></div><div className="orbit-goal-track"><i/></div><small>A little closer to your goal.</small></>:<><strong><RollingValue value={871230} run={stage>=3} reduced={reduced}/></strong><MiniLine purple animate={stage>=3} reduced={reduced}/><small>Illustrative portfolio trend</small></>}
    </div>
    <a className="orbit-phone-ask" href="#ask" onClick={()=>window.dispatchEvent(new CustomEvent('fermor:ask',{detail:{index:mode===0?1:mode===1?2:0}}))}>Ask about this view <ArrowUpRight size={13}/></a>
    <div className="orbit-phone-nav" aria-hidden="true"><Home size={15}/><Wallet size={15}/><Target size={15}/></div><i className="orbit-home"/>
   </div></div>
   <div className="orbit-card orbit-spend" key={`spend-${mode}`}><span><Wallet size={14}/> Monthly spending</span><strong><RollingValue value={48320} run={stage>=1} reduced={reduced}/></strong><ColumnBars animate={stage>=1} reduced={reduced}/><small>Your monthly patterns, in view.</small></div>
   <div className="orbit-card orbit-goal" key={`goal-${mode}`}><span><Target size={14}/> Emergency fund</span><div className="orbit-goal-body"><ProgressRing animate run={stage>=2} reduced={reduced}/><div><strong><RollingValue value={324000} run={stage>=2} reduced={reduced}/></strong><small>of a ₹5L sample goal</small></div></div></div>
   <div className="orbit-card orbit-invest" key={`invest-${mode}`}><span><TrendingUp size={14}/> Investments</span><strong><RollingValue value={871230} run={stage>=3} reduced={reduced}/></strong><MiniLine purple animate={stage>=3} reduced={reduced}/></div>
  </div></div>
  <div className="orbit-controls"><div className="assembly-modes" aria-label="Overview focus">{['Analyze','Plan','Invest'].map((name,i)=><button key={name} aria-pressed={mode===i} className={mode===i?'active':''} onClick={()=>setMode(i)}>{name}<ArrowUpRight size={14}/></button>)}</div><p>{['Monthly spending · ₹48,320','Emergency fund · ₹3,24,000 of ₹5L','Investment value · ₹8,71,230'][mode]}<span>Sample profile · Scroll to assemble · Choose a view</span></p></div>
 </div></section>;
}

const stories=[
 {topic:'SPENDING',title:'What changed this month?',copy:'Dining is ₹3,690 above the sample three-month average. Start with the transactions behind the change.',link:'Explore spending',href:'#ask',question:1},
 {topic:'MARKETS',title:'The headline. And your picture.',copy:'An index gives you one view. The market example shows how sector moves relate to a sample portfolio.',link:'Try the market example',href:'#ask',question:0},
 {topic:'PLANNING',title:'A goal starts with a number.',copy:'Change your monthly contribution and see the forecast change. Keep the assumptions in view.',link:'Build an example plan',href:'#plan',question:null},
 {topic:'SAVINGS',title:'Progress you can see.',copy:'A sample emergency fund is 65% of its target. Explore the savings view to see the amount behind the percentage.',link:'Explore the savings view',href:'#insights',question:null},
 {topic:'PERSPECTIVE',title:'See the connections.',copy:'Spending, goals and investments share one financial picture. Ask which area deserves a closer look.',link:'Try a review',href:'#ask',question:2},
];
export function EditorialCarousel({reduced}:{reduced:boolean}) {
 const ref=useRef<HTMLElement>(null),manual=useRef(false);
 const [position,setPosition]=useState(-.75),[manualMotion,setManualMotion]=useState(false);
 const active=Math.max(0,Math.min(stories.length-1,Math.round(position)));
 useEffect(()=>{
  if(reduced){setPosition(n=>Math.max(0,Math.min(stories.length-1,Math.round(n))));return;}
  let raf=0;
  const update=()=>{raf=0;const el=ref.current;if(!el||reduced||manual.current)return;const r=el.getBoundingClientRect();if(r.top>window.innerHeight||r.bottom<0)return;setManualMotion(false);setPosition(scrollProgress(r.top,el.offsetHeight,window.innerHeight)*(stories.length-1+.75)-.75);};
  const scroll=()=>{manual.current=false;if(!raf)raf=requestAnimationFrame(update)};
  update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);
  return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)};
 },[reduced]);
 function choose(i:number){manual.current=true;setManualMotion(true);setPosition(i)}
 function openStory(i:number){const story=stories[i];if(story.question!==null)window.dispatchEvent(new CustomEvent('fermor:ask',{detail:{index:story.question}}));if(story.topic==='SAVINGS')window.dispatchEvent(new CustomEvent('fermor:insight',{detail:{index:1}}));}
 return <section ref={ref} className={'context-section context-scroll '+(reduced?'motion-off ':'')+(manualMotion?'manual-motion':'')} aria-labelledby="context-title"><div className="context-sticky">
  <div className="context-heading"><div><span className="eyebrow">FIVE PERSPECTIVES</span><h2 id="context-title">For your next move.</h2></div><span>{reduced?'Choose a perspective below':'Scroll to bring each perspective into focus'}</span></div>
  <div className="context-stage">{stories.map((story,i)=>{
   const pose=storyPose(i,position,reduced),offset=i-position;
   const style={'--story-x':pose.x+'px','--story-y':pose.y+'px','--story-z':pose.z+'px','--story-tilt':pose.tilt+'deg','--story-flip':pose.flip+'deg',opacity:pose.opacity,zIndex:stories.length-Math.round(Math.abs(offset))} as CSSProperties;
   const readable=i===active&&pose.flip>100;
   return <div className={'context-slot '+(i===active?'current ':'')+(readable?'is-readable':'')} key={story.topic} style={style} aria-hidden={i!==active}><div className="story-flipper">
    <button className="story-face story-cover" tabIndex={-1} aria-hidden={readable} onClick={()=>choose(i)} aria-label={`Explore ${story.topic.toLowerCase()}`}><span className="story-topic">0{i+1} / {story.topic}</span><h3>{story.title}</h3><div className={'story-art story-art-'+i} aria-hidden="true">{i===0?<><strong>₹12,480</strong><ColumnBars reduced animate={false}/></>:i===1?<><strong>+0.62%</strong><MiniLine purple/></>:i===2?<><strong>₹10,000<span> / month</span></strong><MiniLine/></>:i===3?<ProgressRing reduced run/>:<div className="story-connections"><Wallet size={26}/><Target size={26}/><TrendingUp size={26}/></div>}</div><span className="story-cover-note">ILLUSTRATIVE EXAMPLE <ArrowUpRight size={16}/></span></button>
    <article className="story-face story-answer" aria-hidden={!readable}><span className="story-topic">{story.topic} / EXAMPLE</span><h3>{story.title}</h3><p>{story.copy}</p><a href={story.href} tabIndex={readable?0:-1} onClick={()=>openStory(i)}>{story.link}<ArrowUpRight size={17}/></a></article>
   </div></div>;
  })}</div>
  <div className="context-controls"><button aria-label="Previous perspective" disabled={active===0} onClick={()=>choose(active-1)}><ChevronLeft size={18}/></button><div aria-label="Choose a perspective">{stories.map((s,i)=><button key={s.topic} aria-label={s.title} aria-pressed={active===i} className={active===i?'active':''} onClick={()=>choose(i)}/>)}</div><button aria-label="Next perspective" disabled={active===stories.length-1} onClick={()=>choose(active+1)}><ChevronRight size={18}/></button></div>
  <p className="context-position" role="status">{String(active+1).padStart(2,'0')} / 05 <span>{stories[active].topic.toLowerCase()}</span></p>
 </div></section>;
}
export function FooterGlow({reduced}:{reduced:boolean}) {
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{let raf=0;const update=()=>{raf=0;const el=ref.current;if(!el)return;const r=el.parentElement!.getBoundingClientRect();const p=reduced?1:Math.max(0,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)));el.style.setProperty('--footer-progress',String(p))};const scroll=()=>{if(!raf)raf=requestAnimationFrame(update)};update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);return()=>{cancelAnimationFrame(raf);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll)}},[reduced]);
 return <div ref={ref} className="footer-glow" aria-hidden="true"/>;
}
