const clamp=(n:number)=>Math.max(0,Math.min(1,n));
/** Two gestures occur entirely inside the pinned chapter, with calm entry and exit holds. */
export function handSequence(progress:number){
 const p=clamp(progress);
 const first=clamp((p-.16)/.23),second=clamp((p-.52)/.23);
 const local=p<.5?first:second;
 return {index:second>=.5?2:first>=.5?1:0,angle:-26*Math.sin(local*Math.PI),touch:Math.sin(local*Math.PI),settled:p<.16||p>=.75};
}
/** A manual gesture uses the same thumb path without translating the phone screen. */
export function thumbGesture(progress:number){
 const p=clamp(progress);return {angle:-26*Math.sin(p*Math.PI),changed:p>=.5,touch:Math.sin(p*Math.PI)};
}
