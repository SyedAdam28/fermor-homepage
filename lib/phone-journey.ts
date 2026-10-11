export type DeviceBox={left:number;top:number;width:number;height:number};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
/** Both anchors are measured in viewport coordinates; compensate for the exiting sticky hero. */
export function phoneJourneyPose(hero:DeviceBox,target:DeviceBox,assistantTop:number,viewport:number,heroProgress:number){
 const p=clamp((viewport-assistantTop)/Math.max(1,viewport-24));
 const sourceTop=hero.top+Math.max(0,viewport-assistantTop);
 const targetTop=target.top-Math.max(0,assistantTop-24);
 return {progress:p,left:mix(hero.left,target.left,p),top:mix(sourceTop,targetTop,p)-Math.sin(p*Math.PI)*24,width:mix(hero.width,target.width,p),height:mix(hero.height,target.height,p),rotateX:24*(1-clamp(heroProgress))*(1-p)-Math.sin(p*Math.PI)*8,rotateY:-25*(1-clamp(heroProgress))*(1-p)-360*p,rotateZ:9*(1-clamp(heroProgress))*(1-p)+Math.sin(p*Math.PI)*4};
}
