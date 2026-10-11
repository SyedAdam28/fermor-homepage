"use client";
import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {ArrowUpRight,X,TrendingUp,Wallet,Search,Target,BarChart3,Compass} from 'lucide-react';
import {questionLayout,questionDropPath,questionScrollProgress,questionTimelineTime} from '@/lib/question-drop';
import {closingPrompts,closingAnswers} from '@/lib/closing-prompts';

export function ClosingQuestions({reduced}:{reduced:boolean}){
 const field=useRef<HTMLDivElement>(null),layout=useRef(questionLayout(360));
 const animations=useRef<Animation[]>([]),manual=useRef(false),progress=useRef(1),lastTime=useRef<number|null>(null);
 const [selected,setSelected]=useState<number|null>(null);
 const answerDialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  if(selected===null)return;
  const previousOverflow=document.documentElement.style.overflow;
  if(!answerDialog.current?.open)answerDialog.current?.showModal();
  document.documentElement.style.overflow='hidden';
  return()=>{document.documentElement.style.overflow=previousOverflow};
 },[selected]);
 function paint(p:number){progress.current=p;const time=questionTimelineTime(p);if(lastTime.current===time)return;lastTime.current=time;animations.current.forEach(a=>{a.currentTime=time});}
 function settle(){manual.current=true;paint(1)}

 useEffect(()=>{
  const el=field.current,chapter=el?.closest<HTMLElement>('.closing-chapter');if(!el||!chapter)return;
  let raf=0,lastWidth=0,lastCompact=false,lastHeight=0;
  const update=()=>{raf=0;if(manual.current)return;const r=chapter.getBoundingClientRect();paint(reduced?1:questionScrollProgress(r.top,chapter.offsetHeight,window.innerHeight));};
  const cancel=()=>{animations.current.forEach(a=>a.cancel());animations.current=[];lastTime.current=null};
  function measure(){
   const width=el!.clientWidth,compact=window.innerHeight<=480||(window.innerHeight<=650&&window.innerWidth<=480);
   const sticky=chapter!.querySelector<HTMLElement>('.closing-sticky')!,copy=sticky.querySelector<HTMLElement>('.closing-copy')!,controls=sticky.querySelector<HTMLElement>('.question-field-controls')!;
   const styles=getComputedStyle(sticky),available=window.innerHeight-parseFloat(styles.paddingTop)-parseFloat(styles.paddingBottom)-copy.offsetHeight-parseFloat(styles.rowGap)-controls.offsetHeight-12;
   if(Math.abs(width-lastWidth)<.5&&compact===lastCompact&&Math.abs(available-lastHeight)<.5)return;
   lastWidth=width;lastCompact=compact;lastHeight=available;cancel();
   const next=questionLayout(width,compact,available);layout.current=next;
   el!.style.setProperty('--question-field-height',next.height+'px');el!.style.setProperty('--question-card-width',next.cardWidth+'px');el!.style.setProperty('--question-card-height',next.cardHeight+'px');
   const cards=el!.querySelectorAll<HTMLButtonElement>('.falling-question');
   cards.forEach((card,i)=>{card.style.left=next.cards[i].left+'px';card.style.top=next.cards[i].top+'px';card.style.setProperty('--question-tilt',next.cards[i].tilt+'deg')});
   if(!reduced&&typeof cards[0]?.animate==='function')animations.current=Array.from(cards,(card,i)=>{const a=card.animate(questionDropPath(next,i,window.innerHeight),{duration:5800+(i%3)*240,delay:i*130,fill:'both'});a.pause();return a});
   if(manual.current)paint(progress.current);else update();
  }
  const scroll=()=>{manual.current=false;if(!raf)raf=requestAnimationFrame(update)};
  const resize=()=>{measure();scroll()};
  measure();const observer=new ResizeObserver(measure);observer.observe(el);const copy=chapter.querySelector('.closing-copy');if(copy)observer.observe(copy);
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize);
  const visibility=()=>{if(document.hidden){if(manual.current)paint(1)}};
  document.addEventListener('visibilitychange',visibility);
  return()=>{cancelAnimationFrame(raf);cancel();observer.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility)};
 },[reduced]);
 return <div className="closing-constellation question-playground">
  <div className="question-field" ref={field} onFocusCapture={settle}>
   <div className="question-ground" aria-hidden="true"/>
   {closingPrompts.map((prompt,i)=>{const Icon=({Markets:TrendingUp,Spending:Wallet,Review:Search,Savings:Target,Investments:BarChart3,Planning:Compass})[prompt.category];return <button type="button" className={'falling-question question-color-'+(i%5)} key={prompt.text} aria-label={prompt.question} aria-haspopup="dialog" title={prompt.question} style={{left:layout.current.cards[i].left,top:layout.current.cards[i].top,'--question-tilt':layout.current.cards[i].tilt+'deg'} as CSSProperties} onClick={()=>{settle();setSelected(i)}}><Icon className="question-topic-icon" aria-hidden="true"/><span className="falling-question-copy"><small>{prompt.category}</small><strong>{prompt.text}</strong></span><ArrowUpRight className="falling-question-arrow" size={15}/></button>})}
   <dialog ref={answerDialog} className="question-answer" aria-labelledby="question-answer-title" aria-describedby="question-answer-source" onClose={()=>setSelected(null)} onClick={e=>{if(e.target===e.currentTarget)answerDialog.current?.close()}}>
    {selected!==null&&<div className="question-answer-content" key={selected}>
     <div className="question-answer-top"><span>FERMOR · EXAMPLE RESPONSE</span><button type="button" aria-label="Close answer" onClick={()=>answerDialog.current?.close()}><X size={20}/></button></div>
     <p className="question-answer-request">{closingPrompts[selected].question}</p>
     <h3 id="question-answer-title">{closingAnswers[selected].title}</h3>
     <dl>{closingAnswers[selected].rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
     <p className="question-answer-next"><strong>A useful next step</strong>{closingAnswers[selected].next}</p>
     <div className="question-answer-bottom"><p id="question-answer-source">Illustrative data · Prepared response<br/>No connected accounts or live market feed.</p><button type="button" onClick={()=>answerDialog.current?.close()}>Back to questions <ArrowUpRight size={16}/></button></div>
    </div>}
   </dialog>
  </div>
  <div className="question-field-controls"><span>{reduced?'Choose a question. Explore an example.':'Scroll to scatter · Select a question for an answer here'}</span></div>
 </div>;
}
