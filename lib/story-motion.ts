/** Native-scroll positions and physical card poses; no timers or scroll interception. */
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function scrollProgress(top:number,height:number,viewport:number){
 return clamp(-top/Math.max(1,height-viewport),0,1);
}
export function storyPose(index:number,position:number,reduced=false){
 const offset=index-position,distance=Math.abs(offset);
 return {
  x:offset*310,
  y:Math.min(distance,2)*18,
  z:-Math.min(distance,2)*220,
  tilt:reduced?0:clamp(offset*-18,-30,30),
  flip:reduced?180:180*clamp(1-distance*1.35,0,1),
  opacity:distance>2.5?0:Math.max(.3,1-distance*.35),
 };
}
