/** Stable point correspondence keeps the financial sculptures coherent while they morph. */
export function buildFinancialForms(count:number){
 const orbit=new Float32Array(count*3),coins=new Float32Array(count*3),growth=new Float32Array(count*3),colors=new Float32Array(count*3),seeds=new Float32Array(count);
 let seed=7319;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<count;i++){
  const a=rand()*Math.PI*2,b=rand()*Math.PI*2,t=rand(),s=rand();seeds[i]=s;
  // A dimensional orbit signifies the connected financial picture.
  orbit.set([(1.22+.22*Math.cos(b))*Math.cos(a),(.22*Math.sin(b))*.9,(1.22+.22*Math.cos(b))*Math.sin(a)],i*3);
  // Three coin-like layers, with face and rim points rather than a solid ball.
  const layer=i%3,r=t<.58?Math.sqrt(rand())*.88:.88,z=(rand()-.5)*.17;
  coins.set([Math.cos(a)*r,(layer-1)*.47+z,Math.sin(a)*r],i*3);
  // Five rising columns, sampled on their surfaces, make a legible financial silhouette.
  const column=i%5,height=.35+column*.32,x=(column-2)*.49,face=Math.floor(rand()*3);const px=rand(),py=rand();
  growth.set([x+(face===0?(s<.5?-.18:.18):(px-.5)*.36),face===1?height-.9:py*height-.9,face===2?(s<.5?-.2:.2):(px-.5)*.4],i*3);
  const c=i%7<3?[.6,.94,.73]:i%7<6?[.67,.58,1]:[1,.81,.47];colors.set(c,i*3);
 }
 return {orbit,coins,growth,colors,seeds};
}
