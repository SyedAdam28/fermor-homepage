"use client";
import {useEffect,useRef,useState,type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {phoneJourneyPose} from '@/lib/phone-journey';
/** The live assistant is mounted once in a shared device on desktop; compact layouts keep it inline. */
export function PhoneJourney({preview,children,reduced}:{preview:ReactNode;children:ReactNode;reduced:boolean}) {
 const [enabled,setEnabled]=useState(false),[ready,setReady]=useState(false);
 const outer=useRef<HTMLDivElement>(null),device=useRef<HTMLDivElement>(null);
 useEffect(()=>{const media=window.matchMedia('(min-width:900px)');const sync=()=>setEnabled(media.matches&&!reduced);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync)},[reduced]);
 useEffect(()=>{
  if(!enabled)return;const layer=outer.current,body=device.current,hero=document.querySelector<HTMLElement>('.hero'),source=document.querySelector<HTMLElement>('.hero-device-anchor'),assistant=document.querySelector<HTMLElement>('.assistant-section'),target=document.querySelector<HTMLElement>('.assistant-device-anchor');if(!layer||!body||!hero||!source||!assistant||!target)return;
  document.documentElement.classList.add('journey-ready');let raf=0;
  const update=()=>{raf=0;const a=assistant.getBoundingClientRect(),s=source.getBoundingClientRect(),t=target.getBoundingClientRect(),h=hero.getBoundingClientRect(),vh=window.innerHeight;
   const pose=phoneJourneyPose(s,t,a.top,vh,Math.max(0,Math.min(1,-h.top/Math.max(1,hero.offsetHeight-vh))));
   layer.style.width=pose.width+'px';layer.style.height=pose.height+'px';layer.style.transform=`translate3d(${pose.left}px,${pose.top}px,0)`;layer.style.visibility=h.bottom>0||t.bottom>0&&t.top<vh?'visible':'hidden';
   body.style.transform=`rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg) rotateZ(${pose.rotateZ}deg)`;
   layer.style.setProperty('--phone-sx',String(pose.width/252));layer.style.setProperty('--phone-sy',String(pose.height/510));
   const fade=Math.max(0,Math.min(1,(pose.progress-.38)/.24));layer.style.setProperty('--screen-switch',String(fade));setReady(pose.progress>.96);
  };
  const scroll=()=>{if(!raf)raf=requestAnimationFrame(update)};const observer=new ResizeObserver(scroll);observer.observe(source);observer.observe(target);update();window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);document.documentElement.classList.remove('journey-ready')};
 },[enabled]);
 if(!enabled)return children;
 return createPortal(<div ref={outer} className={'journey-phone '+(ready?'assistant-ready':'')}><div ref={device} className="journey-device"><div className="journey-metal-back" aria-hidden="true"><span>Fermor</span><i/><i/><i/></div><div className="journey-metal-edge"/><div className="journey-hero-screen" aria-hidden="true" inert>{preview}</div><div className="journey-assistant-screen" inert={!ready} aria-hidden={!ready}>{children}</div></div></div>,document.body);
}
