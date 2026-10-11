import assert from 'node:assert/strict';
import {phoneJourneyPose} from '../lib/phone-journey.ts';
import {buildFinancialForms} from '../lib/financial-forms.ts';
import {handSequence,thumbGesture} from '../lib/hand-sequence.ts';
import {questionLayout,questionDropPath,questionScrollProgress,questionTimelineTime,QUESTION_TIMELINE} from '../lib/question-drop.ts';
import {closingPrompts,closingAnswers} from '../lib/closing-prompts.ts';
import {projectSavings} from '../lib/projection.ts';
import {storyPose,scrollProgress} from '../lib/story-motion.ts';
const start={left:830,top:160,width:280,height:566},viewport=768,targetBase={left:850,top:100,width:335,height:642};
for(let assistantTop=900;assistantTop>=-500;assistantTop-=4){
 const source={...start,top:start.top-Math.max(0,viewport-assistantTop)},target={...targetBase,top:targetBase.top+assistantTop-24};
 const pose=phoneJourneyPose(source,target,assistantTop,viewport,1);
 Object.values(pose).forEach(n=>assert.ok(Number.isFinite(n)));assert.ok(pose.progress>=0&&pose.progress<=1);assert.ok(pose.width>=280&&pose.width<=335);assert.ok(pose.height>=566&&pose.height<=642);
 if(assistantTop<=24){assert.equal(pose.left,target.left);assert.equal(pose.width,target.width);assert.ok(Math.abs(pose.top-target.top)<1e-9);assert.equal(pose.rotateY,-360)}
}
const initial=phoneJourneyPose(start,targetBase,900,viewport,0);assert.equal(initial.progress,0);assert.equal(initial.rotateX,24);assert.equal(initial.rotateY,-25);
for(const count of [4200,7200]){
 const a=buildFinancialForms(count),b=buildFinancialForms(count);assert.equal(a.seeds.length,count);
 for(const key of ['orbit','coins','growth','colors']){assert.equal(a[key].length,count*3);assert.deepEqual(a[key],b[key]);a[key].forEach(n=>assert.ok(Number.isFinite(n)));}
 a.colors.forEach(n=>assert.ok(n>=0&&n<=1));a.seeds.forEach(n=>assert.ok(n>=0&&n<=1));
}
assert.equal(scrollProgress(0,2000,800),0);assert.equal(scrollProgress(-1200,2000,800),1);assert.equal(scrollProgress(200,2000,800),0);assert.equal(scrollProgress(-1500,2000,800),1);
for(let i=0;i<5;i++){
 const settled=storyPose(i,i);assert.equal(settled.flip,180);assert.equal(settled.x,0);assert.equal(settled.opacity,1);assert.equal(storyPose(i,i-.75).flip,0);assert.equal(storyPose(i,i-1,true).flip,180);assert.equal(storyPose(i,i-1,true).tilt,0);
 assert.ok(Math.abs(storyPose(i,i-.3).flip-storyPose(i,i+.3).flip)<1e-9);
}
for(let p=-.75;p<=4;p+=.025)for(let i=0;i<5;i++){const pose=storyPose(i,p);Object.values(pose).forEach(n=>assert.ok(Number.isFinite(n)));assert.ok(pose.flip>=0&&pose.flip<=180);assert.ok(pose.opacity>=0&&pose.opacity<=1);assert.ok(pose.z>=-440&&pose.z<=0)}
for(let p=0;p<=1.001;p+=.001){
 const pose=handSequence(p);Object.values(pose).filter(x=>typeof x==='number').forEach(n=>assert.ok(Number.isFinite(n)));assert.ok(pose.angle>=-26&&pose.angle<=0);assert.ok(pose.index>=0&&pose.index<=2);
 if(p>=.75){assert.ok(Math.abs(pose.angle)<1e-9);assert.equal(pose.index,2);assert.equal(pose.settled,true)}
}
assert.equal(handSequence(.15).index,0);assert.equal(handSequence(.30).index,1);assert.equal(handSequence(.64).index,2);
assert.equal(thumbGesture(0).changed,false);assert.equal(thumbGesture(.5).changed,true);assert.ok(Math.abs(thumbGesture(.5).angle+26)<1e-9);assert.ok(Math.abs(thumbGesture(1).angle)<1e-9);
// Native scroll directly controls a single paused timeline; settled exit precedes release.
assert.equal(questionScrollProgress(800,1760,800),0);
assert.equal(questionScrollProgress(0,1760,800),0);
assert.equal(questionScrollProgress(-864,1760,800),1);
assert.equal(questionScrollProgress(-960,1760,800),1);
assert.equal(questionTimelineTime(1),QUESTION_TIMELINE);
assert.equal(questionTimelineTime(-1),0);
for(let top=0;top>=-960;top-=2){
 const p=questionScrollProgress(top,1760,800),t=questionTimelineTime(p);assert.ok(t>=0&&t<=8100);assert.equal(t,questionTimelineTime(questionScrollProgress(top,1760,800)));
 if(top<=-864)assert.equal(t,8100);
}
for(let i=0;i<15;i++)assert.ok(5800+(i%3)*240+i*130<=QUESTION_TIMELINE);
assert.equal(closingPrompts.length,15);assert.equal(new Set(closingPrompts.map(p=>p.text)).size,15);
assert.equal(closingAnswers.length,closingPrompts.length);
closingAnswers.forEach(answer=>{assert.ok(answer.title.length>0&&answer.next.length>0);assert.ok(answer.rows.length>0);answer.rows.forEach(([label,value])=>assert.ok(label.length>0&&value.length>0));});
assert.equal(Math.round(projectSavings(10000,5,7).value),715929);
assert.equal(Math.round(projectSavings(20000,5,7).value),1431858);
assert.ok(projectSavings(10000,14,7).value<3000000);
assert.ok(projectSavings(10000,15,7).value>=3000000);
for(const compact of [false,true])for(let width=220;width<=1440;width+=5){
 const layout=questionLayout(width,compact);assert.equal(layout.cards.length,15);
 const boxes=layout.cards.map(card=>{const a=Math.abs(card.tilt)*Math.PI/180,bw=layout.cardWidth*Math.cos(a)+layout.cardHeight*Math.sin(a),bh=layout.cardHeight*Math.cos(a)+layout.cardWidth*Math.sin(a);return {left:card.left+(layout.cardWidth-bw)/2,right:card.left+(layout.cardWidth+bw)/2,top:card.top+(layout.cardHeight-bh)/2,bottom:card.top+(layout.cardHeight+bh)/2}});
 boxes.forEach((box,i)=>{
  assert.ok(box.left>=0&&box.right<=width);assert.ok(box.top>=0&&box.bottom<layout.height-10);
  boxes.slice(i+1).forEach(other=>assert.ok(box.right<other.left||other.right<box.left||box.bottom<other.top||other.bottom<box.top,`Questions overlap at ${width}px`));
  const frames=questionDropPath(layout,i,600);assert.equal(frames.at(-1).opacity,1);assert.equal(frames.at(-1).transform,`translate3d(0px,0px,0px) rotateX(0deg) rotateZ(${layout.cards[i].tilt}deg) scale(1,1)`);for(let j=1;j<frames.length;j++)assert.ok(frames[j].offset>frames[j-1].offset);
  const impact=frames.find(f=>f.offset===.45),y=Number(impact.transform.match(/translate3d\([^,]+,([^p]+)px/)[1]);assert.equal(layout.cards[i].top+layout.cardHeight+y,layout.height-10);
 });
}
// Heading, copy, section padding, spacing and controls plus the actual field.
// Short portrait phones and ordinary laptop screens keep all fifteen targets in one view.
for(const [width,height,chrome] of [[320,568,177],[375,667,177],[390,844,177],[768,650,205],[1280,720,230],[1440,900,230],[667,375,100],[1024,480,100]]){
 const fieldWidth=Math.min(1180,width*(width<900?.9:.88));assert.ok(questionLayout(fieldWidth,height<=480||(height<=650&&width<=480)).height+chrome<=height,`Question section exceeds ${width}x${height}`);
}
console.log('Motion checks passed: retained phone, hand and editorial poses; fifteen local example answers and their forecast values; 490 non-overlapping question layouts, exact floor impacts, viewport budgets and scroll-controlled question timeline.');

// Selected-reference viewport budget: measure the field after the fixed navigation and copy.
for(const [width,height,compact,copy,padding,gap,controls] of [[1120,720,false,123,124,24,40],[351,844,false,81,124,20,40],[351,600,true,59,94,12,40],[744,390,true,52,80,8,32],[651,320,true,22,68,8,32],[450,320,true,22,68,8,32]]){
 const available=height-copy-padding-gap-controls-12;
 const layout=questionLayout(width,compact,available);
 assert.ok(layout.height<=available,`Question field exceeds its ${width}x${height} reference budget`);
 assert.ok(layout.cardHeight>=36);
}
console.log('Selected-reference question budgets passed, including short landscape screens.');
