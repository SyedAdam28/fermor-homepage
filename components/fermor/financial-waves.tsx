"use client";
import {useEffect,useId,useRef} from 'react';

/** Lightweight SVG depth: native scroll moves the contours; hidden scenes stop drifting. */
export function FinancialWaves({variant,reduced}:{variant:'hero'|'insights'|'explore'|'plan'|'footer';reduced:boolean}){
 const ref=useRef<HTMLDivElement>(null),id=useId().replace(/:/g,'');
 useEffect(()=>{
  const el=ref.current;if(!el)return;let raf=0,visible=false;
  const paint=()=>{raf=0;if(!visible)return;const r=el.parentElement!.getBoundingClientRect();const p=reduced?0:Math.max(-1,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)-.5));el.style.setProperty('--wave-scroll',String(p));};
  const schedule=()=>{if(visible&&!raf)raf=requestAnimationFrame(paint)};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;el.dataset.visible=String(visible);schedule()},{rootMargin:'80px'});
  const visibility=()=>{el.dataset.visible=String(visible&&!document.hidden);if(!document.hidden)schedule()};
  observer.observe(el.parentElement!);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();cancelAnimationFrame(raf);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',visibility)};
 },[reduced]);
 return <div ref={ref} className={'financial-waves waves-'+variant+(reduced?' waves-still':'')} aria-hidden="true"><div className="wave-light"/><svg viewBox="0 0 1440 900" preserveAspectRatio="none"><defs><linearGradient id={id+'-line'} x1="0" y1="1" x2="1" y2="0"><stop stopColor="var(--wave-start)" stopOpacity="0"/><stop offset=".35" stopColor="var(--wave-start)" stopOpacity=".65"/><stop offset="1" stopColor="var(--wave-end)" stopOpacity=".18"/></linearGradient></defs><g className="wave-contours" fill="none" stroke={`url(#${id}-line)`} strokeWidth="1.2">{Array.from({length:15},(_,i)=><path key={i} d={`M -160 ${710+i*26} C 270 ${900+i*15}, 410 ${510+i*22}, 780 ${580+i*18} S 1180 ${180+i*24}, 1580 ${120+i*28}`}/>)}</g><g className="wave-echo" fill="none" stroke={`url(#${id}-line)`} strokeWidth=".8">{Array.from({length:5},(_,i)=><path key={i} d={`M -80 ${600+i*42} C 160 ${300+i*33}, 390 ${840+i*28}, 760 ${470+i*37} S 1230 ${640+i*30}, 1510 ${320+i*20}`}/>)}</g></svg></div>;
}
