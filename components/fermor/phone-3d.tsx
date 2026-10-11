"use client";
import {useEffect,useRef,useState,type ReactNode} from 'react';
/** Decorative WebGL device. The surrounding HTML supplies all meaningful content. */
export default function Phone3D({reduced,children}:{reduced:boolean;children:ReactNode}){
 const holder=useRef<HTMLDivElement>(null);const motion=useRef(reduced);const [ready,setReady]=useState(false);
 useEffect(()=>{motion.current=reduced;holder.current?.dispatchEvent(new Event('motionchange'))},[reduced]);
 useEffect(()=>{
  let cancelled=false;let dispose:(()=>void)|undefined;
  async function start(){
   const root=holder.current;if(!root)return;
   try{
    const THREE=await import('three');const {RoomEnvironment}=await import('three/examples/jsm/environments/RoomEnvironment.js');if(cancelled)return;
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-1.68,1.68,3.2,-3.2,.1,100);camera.position.set(0,0,13);
    const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;
    const phone=new THREE.Group();scene.add(phone);
    const rounded=(w:number,h:number,r:number)=>{const s=new THREE.Shape();const x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s};
    const frameGeometry=new THREE.ExtrudeGeometry(rounded(2.62,5.30,.35),{depth:.13,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.035,bevelThickness:.03,curveSegments:16});frameGeometry.translate(0,0,-.07);
    const metal=new THREE.MeshStandardMaterial({color:'#687078',metalness:.95,roughness:.2});const body=new THREE.Mesh(frameGeometry,metal);phone.add(body);
    const black=new THREE.MeshStandardMaterial({color:'#080b0d',metalness:.45,roughness:.26});const glassRim=new THREE.Mesh(new THREE.ShapeGeometry(rounded(2.59,5.27,.34),24),black);glassRim.position.z=.096;phone.add(glassRim);
    const c=document.createElement('canvas');c.width=780;c.height=1580;const ctx=c.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
    ctx.fillStyle='#fafbf8';ctx.fillRect(0,0,780,1580);ctx.textBaseline='alphabetic';
    const text=(t:string,x:number,y:number,size:number,color='#161c1b',weight=400)=>{ctx.font=`${weight} ${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.fillText(t,x,y)};
    const box=(x:number,y:number,w:number,h:number,r:number,color:string)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=color;ctx.fill()};
    text('9:41',48,61,26,'#171c1a',600);text('▰',672,61,27);
    ctx.fillStyle='#6bdc90';ctx.beginPath();ctx.moveTo(51,136);ctx.lineTo(87,110);ctx.lineTo(120,110);ctx.lineTo(82,143);ctx.fill();ctx.beginPath();ctx.moveTo(55,161);ctx.lineTo(92,136);ctx.lineTo(125,136);ctx.lineTo(85,169);ctx.fill();text('Fermor',139,157,38,'#191f1c',700);box(665,114,57,57,29,'#e4ecdd');text('A',683,151,25,'#68745e',600);
    text('YOUR FINANCIAL PICTURE',49,246,19,'#8a9187',400);text('₹12,48,230',48,332,83,'#18211b',600);text('↗ 12.4%',49,388,27,'#45915b',600);text('this year',186,388,23,'#92988e');
    ctx.strokeStyle='#e6eae2';ctx.lineWidth=1;[446,530,614].forEach(y=>{ctx.beginPath();ctx.moveTo(48,y);ctx.lineTo(731,y);ctx.stroke()});
    const data=[.12,.15,.13,.29,.25,.38,.36,.47,.41,.58,.55,.67,.61,.78,.74,.91,.86,1];const pts=data.map((v,i)=>[48+i*682/(data.length-1),640-v*206]);ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineTo(730,665);ctx.lineTo(48,665);ctx.closePath();const grad=ctx.createLinearGradient(0,430,0,665);grad.addColorStop(0,'#8fe0a45a');grad.addColorStop(1,'#8fe0a400');ctx.fillStyle=grad;ctx.fill();ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.strokeStyle='#5bb477';ctx.lineWidth=5;ctx.lineJoin='round';ctx.stroke();
    text('1M',119,710,21,'#8d9588');text('6M',269,710,21,'#8d9588');box(395,682,75,41,10,'#e8e3f5');text('1Y',418,711,21,'#8c79bb',600);text('ALL',568,710,21,'#8d9588');
    box(47,759,685,157,22,'#e9f4e2');text('A little clarity.',78,820,31,'#38613b',600);text('A lot of possibility.',78,861,31,'#38613b',600);text('↗',657,853,45,'#6d946a');
    const rows=[['Savings','₹3,24,000'],['Investments','₹8,71,230'],['Other assets','₹53,000']];rows.forEach(([name,v],i)=>{const y=981+i*107;box(49,y-25,40,40,10,'#eeeaf6');text(['▥','↗','◇'][i],58,y+4,26,'#8f7bb1');text(name,116,y+6,28,'#65715f');ctx.font='600 27px Arial, sans-serif';ctx.fillStyle='#333f30';ctx.textAlign='right';ctx.fillText(v,729,y+6);ctx.textAlign='left';ctx.beginPath();ctx.moveTo(49,y+45);ctx.lineTo(731,y+45);ctx.strokeStyle='#e1e8da';ctx.lineWidth=1;ctx.stroke()});
    box(49,1273,682,88,44,'#ffffff');ctx.strokeStyle='#dfe7d8';ctx.strokeRect(80,1273,615,1);text('✳',78,1328,31,'#8b78b5');text('Ask about your money',128,1327,25,'#6e7868');box(650,1290,53,53,28,'#ddf0d5');text('↑',666,1327,26,'#53744b');
    [['◉','Overview'],['▥','Insights'],['◎','Goals']].forEach(([icon,label],i)=>{const x=100+i*241;text(icon,x,1441,36,'#7b8970');text(label,x-13,1480,18,'#8e9885')});box(260,1534,260,10,5,'#121714');
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
    const screenGeometry=new THREE.ShapeGeometry(rounded(2.45,5.10,.30),24);const pos=screenGeometry.attributes.position;const uv=screenGeometry.attributes.uv;for(let i=0;i<pos.count;i++)uv.setXY(i,(pos.getX(i)+1.225)/2.45,(pos.getY(i)+2.55)/5.10);const screen=new THREE.Mesh(screenGeometry,new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));screen.position.z=.101;phone.add(screen);
    const island=new THREE.Mesh(new THREE.ShapeGeometry(rounded(.77,.205,.102),16),new THREE.MeshBasicMaterial({color:'#080b0d'}));island.position.set(0,2.33,.104);phone.add(island);
    const lens=new THREE.Mesh(new THREE.CircleGeometry(.048,24),new THREE.MeshStandardMaterial({color:'#1d2d40',metalness:.8,roughness:.1}));lens.position.set(.25,2.33,.108);phone.add(lens);
    const buttonGeometry=new THREE.BoxGeometry(.055,.53,.10);const button=new THREE.Mesh(buttonGeometry,metal);button.position.set(1.335,.8,0);phone.add(button);const volume=new THREE.Mesh(new THREE.BoxGeometry(.045,.37,.085),metal);volume.position.set(-1.337,.72,0);phone.add(volume);
    const port=new THREE.Mesh(new THREE.BoxGeometry(.3,.024,.075),black);port.position.set(0,-2.683,-.015);phone.add(port);for(let i=-3;i<=3;i++){if(i===0)continue;const hole=new THREE.Mesh(new THREE.SphereGeometry(.022,8,8),black);hole.scale.y=.4;hole.position.set(i*.145+(i>0?.2:-.2),-2.682,0);phone.add(hole)}
    scene.add(new THREE.AmbientLight('#ffffff',.8));const light=new THREE.DirectionalLight('#ffffff',3);light.position.set(-4,6,8);scene.add(light);const rim=new THREE.DirectionalLight('#d9e5ff',2);rim.position.set(5,-2,4);scene.add(rim);
    root.insertBefore(renderer.domElement,root.firstChild);renderer.domElement.setAttribute('aria-hidden','true');const hero=root.closest('.hero') as HTMLElement|null;let raf=0;let visible=true;let hx=0,hy=0;
    const render=()=>{raf=0;if(cancelled||!visible)return;const rect=hero?.getBoundingClientRect();const p=motion.current?1:rect&&hero?Math.max(0,Math.min(1,-rect.top/(hero.offsetHeight-window.innerHeight))):0;phone.rotation.set(-.72+p*.78+hy,-.25+p*.25+hx,-.11+p*.11);renderer.render(scene,camera);};
    const schedule=()=>{if(!raf)raf=requestAnimationFrame(render)};
    const resize=()=>{const w=root.clientWidth,h=root.clientHeight;renderer.setSize(w,h);camera.left=-3.2*w/h;camera.right=3.2*w/h;camera.updateProjectionMatrix();schedule()};
    const pointer=(e:PointerEvent)=>{if(motion.current||e.pointerType!=='mouse')return;const r=root.getBoundingClientRect();hx=((e.clientX-r.left)/r.width-.5)*.12;hy=((e.clientY-r.top)/r.height-.5)*.08;schedule()};const leave=()=>{hx=0;hy=0;schedule()};
    const observer=new ResizeObserver(resize);observer.observe(root);const visibility=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)schedule()});visibility.observe(root);window.addEventListener('scroll',schedule,{passive:true});root.addEventListener('pointermove',pointer);root.addEventListener('pointerleave',leave);root.addEventListener('motionchange',schedule);resize();render();setReady(true);
    dispose=()=>{cancelAnimationFrame(raf);observer.disconnect();visibility.disconnect();window.removeEventListener('scroll',schedule);root.removeEventListener('pointermove',pointer);root.removeEventListener('pointerleave',leave);root.removeEventListener('motionchange',schedule);scene.traverse(o=>{const mesh=o as import('three').Mesh;if(mesh.geometry)mesh.geometry.dispose();if(mesh.material){const materials=Array.isArray(mesh.material)?mesh.material:[mesh.material];materials.forEach(m=>m.dispose())}});texture.dispose();env.dispose();pmrem.dispose();room.dispose();renderer.dispose();renderer.domElement.remove()};
   }catch{if(!cancelled)setReady(false)}
  }start();return()=>{cancelled=true;dispose?.()};
 },[]);
 return <div ref={holder} className={'webgl-phone '+(ready?'ready':'')}><div className="phone-fallback" aria-hidden="true">{children}</div></div>;
}
