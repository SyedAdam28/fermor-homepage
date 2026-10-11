export const QUESTION_TIMELINE=8100;
/** All cards finish before the pinned scene releases; reverse scroll uses the same time. */
export function questionScrollProgress(top:number,chapterHeight:number,viewportHeight:number){
 return Math.max(0,Math.min(1,-top/Math.max(1,chapterHeight-viewportHeight)/.9));
}
export function questionTimelineTime(progress:number){return Math.max(0,Math.min(1,progress))*QUESTION_TIMELINE;}
/** Fixed, non-overlapping landing spots keep all fifteen questions selectable. */
export function questionLayout(width:number,compact=false,maxHeight?:number){
 const w=Math.max(220,width),columns=w>=650||compact&&w>=430?5:w>=260?3:2,rows=Math.ceil(15/columns);
 const gap=compact?12:w>=650?22:14,pad=compact?10:w>=650?18:10;
 const cardWidth=(w-pad*2-gap*(columns-1))/columns,baseHeight=w>=650?(compact?44:68):w>=430?(compact?48:64):compact?54:58;
 const cardHeight=maxHeight===undefined?baseHeight:Math.max(36,Math.min(baseHeight,Math.floor((maxHeight-(rows-1)*gap-pad*2-12)/rows)));
 const height=rows*cardHeight+(rows-1)*gap+pad*2+12;
 const tilts=[-2.5,1.8,-1.2,2.3,-1.7];
 return {width:w,height,cardWidth,cardHeight,columns,cards:Array.from({length:15},(_,i)=>({
  left:pad+(i%columns)*(cardWidth+gap),top:pad+Math.floor(i/columns)*(cardHeight+gap),tilt:tilts[i%tilts.length],
 }))};
}
export function questionDropPath(layout:ReturnType<typeof questionLayout>,index:number,entryDistance:number){
 const card=layout.cards[index],side=index%2?1:-1;
 const impact=layout.height-10-card.top-layout.cardHeight;
 const drift=side*Math.min(18,layout.cardWidth*.1),bounce=48+(index%4)*14;
 const transform=(x:number,y:number,z:number,rx:number,rz:number,sx=1,sy=1)=>`translate3d(${x}px,${y}px,${z}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${sx},${sy})`;
 const entry=-60-card.top;
 const air=Array.from({length:6},(_,i)=>{const t=i/5;return {offset:i===5?.45:.08+.37*t,transform:transform(drift,entry+(impact-entry)*t*t,45*(1-t),12*(1-t),side*(8-6*t)),opacity:1,easing:'linear'}});
 return [
  {offset:0,transform:transform(drift,-Math.max(450,entryDistance+card.top),60,28,side*(12+index%4*3)),opacity:0,easing:'linear'},
  ...air,
  {offset:.49,transform:transform(drift,impact+2,0,0,side*2,1.035,.93),opacity:1,boxShadow:'0 2px 4px #465a7828',easing:'cubic-bezier(.12,.6,.3,1)'},
  {offset:.62,transform:transform(-drift,impact-bounce,20,-7,card.tilt+side*5),opacity:1,boxShadow:'0 18px 20px #465a7814',easing:'cubic-bezier(.5,0,.8,.5)'},
  {offset:.76,transform:transform(drift*.35,impact,0,0,card.tilt-side*2),opacity:1,easing:'ease-out'},
  {offset:.79,transform:transform(drift*.35,impact+1,0,0,card.tilt,1.012,.975),opacity:1,easing:'cubic-bezier(.2,.6,.3,1)'},
  {offset:.95,transform:transform(0,-6,8,-2,card.tilt),opacity:1,easing:'ease-out'},
  {offset:1,transform:transform(0,0,0,0,card.tilt),opacity:1,boxShadow:'0 8px 14px #5e72a115, inset 0 1px 0 #fffc'},
 ];
}
