"use client";
import {useEffect,useState,type CSSProperties} from 'react';
import {formatRupees} from '@/lib/projection';

/** Finite digit reels: screen readers receive only the settled sample value. */
export function RollingValue({value,currency=true,run=true,reduced=false}:{value:number;currency?:boolean;run?:boolean;reduced?:boolean}){
 const label=currency?formatRupees(value):String(value);
 if(reduced)return <span>{label}</span>;
 return <span className={'rolling-value '+(run?'is-rolling':'')} ><span className="sr-only">{label}</span><span aria-hidden="true">{Array.from(label).map((char,i)=>/\d/.test(char)?<span className="digit-window" key={i}><span className="digit-strip" style={{'--stop':20+Number(char),'--delay':`${i*35}ms`} as CSSProperties}>{Array.from({length:30},(_,n)=><span key={n}>{n%10}</span>)}</span></span>:<span className="digit-punctuation" key={i}>{char}</span>)}</span></span>;
}
export function ProgressRing({value=65,animate=false,run=true,reduced=false,color='#92ffb1',track='#ffffff15'}:{value?:number;animate?:boolean;run?:boolean;reduced?:boolean;color?:string;track?:string}){
 const [progress,setProgress]=useState(value);
 useEffect(()=>{if(!animate||!run||reduced){setProgress(value);return}let raf=0,start=0;setProgress(0);const tick=(now:number)=>{if(!start)start=now;const p=Math.min(1,(now-start)/1200);setProgress(value*(1-Math.pow(1-p,3)));if(p<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[value,animate,run,reduced]);
 return <div className="scene-ring" style={{background:`conic-gradient(${color} ${progress}%,${track} 0)`}} role="img" aria-label={`${value}% of sample goal`}><div aria-hidden="true"><RollingValue value={value} currency={false} run={animate&&run} reduced={reduced}/><small>%</small></div></div>;
}
