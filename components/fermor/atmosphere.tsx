"use client";
import {useEffect,useRef} from 'react';
import type * as Three from 'three';
import {buildFinancialForms} from '@/lib/financial-forms';

type Kind='glass'|'particles'|'ribbons';
/** Visible scenes animate; CSS supplies an immediate visual fallback. */
export function Atmosphere({kind='glass',variant='hero',reduced=false}:{kind?:Kind;variant?:string;reduced?:boolean}) {
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=host.current;if(!element)return;const el:HTMLDivElement=element;
  let disposed=false,started=false,visible=false,failed=false,raf=0,previous=0,clock=0;
  let renderer:Three.WebGLRenderer|undefined,scene:Three.Scene|undefined,camera:Three.PerspectiveCamera|undefined;
  let renderScene:((time:number)=>void)|undefined;
  const cleanups:(()=>void)[]=[],pointer={x:0,y:0};
  function loop(now:number){raf=0;if(disposed||failed||!visible||document.hidden||!renderScene)return;const delta=previous?Math.min(.05,(now-previous)/1000):0;previous=now;clock+=delta;if(now-lastDraw>=(window.innerWidth<760?1000/30:1000/40)){renderScene(reduced?0:clock);lastDraw=now;}if(!reduced)raf=requestAnimationFrame(loop)}
  let lastDraw=0;
  function wake(){if(!disposed&&!failed&&visible&&!document.hidden&&renderScene&&!raf){previous=0;lastDraw=-100;raf=requestAnimationFrame(loop)}}
  function sleep(){cancelAnimationFrame(raf);raf=0;previous=0}
  async function init(){
   if(started||disposed)return;started=true;
   try{
    const T=await import('three');if(disposed)return;
    const mobile=window.innerWidth<760;
    renderer=new T.WebGLRenderer({alpha:true,antialias:!mobile,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1:1.35));renderer.setClearColor(0x000000,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.transmissionResolutionScale=.5;
    el.appendChild(renderer.domElement);el.classList.add('webgl-ready');
    const fallback=()=>{failed=true;sleep();el.classList.remove('webgl-ready');el.classList.add('webgl-fallback')};renderer.debug.onShaderError=fallback;
    const contextLost=(e:Event)=>{e.preventDefault();fallback()};const contextRestored=()=>{failed=false;el.classList.remove('webgl-fallback');el.classList.add('webgl-ready');wake()};renderer.domElement.addEventListener('webglcontextlost',contextLost);renderer.domElement.addEventListener('webglcontextrestored',contextRestored);const canvas=renderer.domElement;cleanups.push(()=>{canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored)});
    scene=new T.Scene();camera=new T.PerspectiveCamera(35,1,.1,40);camera.position.set(0,0,8);
    const shared={time:{value:0},phase:{value:0},aspect:{value:1},reflections:{value:variant==='hero'?0:1}};
    function track<G extends Three.BufferGeometry|Three.Material|Three.Texture>(asset:G):G{cleanups.push(()=>asset.dispose());return asset}
    if(kind==='glass'||kind==='ribbons'){
     const landscape=track(new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:shared,vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.999,1.0);}`,fragmentShader:`
      precision highp float;varying vec2 vUv;uniform float time;uniform float phase;uniform float aspect;uniform float reflections;
      float ridge(float x,float center,float width){return exp(-pow((x-center)/width,2.));}
      void main(){
       vec2 uv=vUv;float t=time*.08;float horizon=.33;
       vec3 sky=mix(vec3(.76,.82,.94),vec3(.9,.93,.97),smoothstep(.3,1.,uv.y));
       sky=mix(sky,vec3(.86,.81,.95),.28*ridge(uv.x,.7,.55));
       float x=uv.x;float y=uv.y;float left=pow(max(0.,.48-x),1.15),right=pow(max(0.,x-.6),1.2);
       for(int i=0;i<5;i++){
        float f=float(i);float wave=horizon+.014*f+left*(.18+.045*f)+right*(.19+.046*f)+.01*sin(x*9.+t+f*.6);
        float band=smoothstep(wave-.012,wave+.012,y)-smoothstep(wave+.025,wave+.058,y);
        vec3 shade=mix(vec3(.4,.56,.84),vec3(.71,.68,.91),f/5.);
        sky=mix(sky,shade,band*(.4-f*.03));
        float shine=exp(-abs(y-wave-.03)*220.);sky+=vec3(.04,.025,.05)*shine;
       }
       if(y<horizon){
        float depth=(horizon-y)/horizon;float ripple=sin((horizon-y)*220.+sin(x*17.+t)*.55+t*2.);
        vec3 water=mix(vec3(.82,.84,.95),vec3(.72,.79,.91),depth);
        water+=vec3(.012,.014,.02)*ripple*depth;
        float reflection=exp(-pow((x-.66)/(.12+depth*.13),2.))*exp(-pow((y-.18)/.12,2.));
        water=mix(water,vec3(.71,.62,.9),reflection*.19*reflections);
        sky=mix(water,sky,smoothstep(horizon-.015,horizon,y));
       }
       sky+=.018*sin(uv.x*5.+uv.y*4.+t)*sin(uv.y*6.-t);
       gl_FragColor=vec4(sky,1.);
      }` }));
     const backdrop=new T.Mesh(track(new T.PlaneGeometry(2,2)),landscape);backdrop.frustumCulled=false;backdrop.renderOrder=-10;scene.add(backdrop);
     // A procedural studio environment makes the sphere highlights and violet reflections physical.
     const envCanvas=document.createElement('canvas');envCanvas.width=512;envCanvas.height=256;
     const ctx=envCanvas.getContext('2d');
     if(ctx){const grad=ctx.createLinearGradient(0,0,0,256);grad.addColorStop(0,'#e5f0ff');grad.addColorStop(.45,'#c6ceeb');grad.addColorStop(.6,'#8360d4');grad.addColorStop(1,'#bccce8');ctx.fillStyle=grad;ctx.fillRect(0,0,512,256);ctx.fillStyle='#fff';ctx.fillRect(50,12,65,90);ctx.fillRect(380,20,90,48);ctx.fillStyle='#9b82e2';ctx.beginPath();ctx.ellipse(245,185,120,35,-.2,0,Math.PI*2);ctx.fill();}
     const env=track(new T.CanvasTexture(envCanvas));env.mapping=T.EquirectangularReflectionMapping;env.colorSpace=T.SRGBColorSpace;
     const generator=new T.PMREMGenerator(renderer);const target=generator.fromEquirectangular(env);scene.environment=target.texture;cleanups.push(()=>target.dispose());generator.dispose();
     scene.add(new T.HemisphereLight(0xf7f9ff,0xaaa0dc,3));const light=new T.DirectionalLight(0xffffff,4);light.position.set(-3,5,5);scene.add(light);
     const sphereGeometry=track(new T.SphereGeometry(1,mobile?40:64,mobile?28:48));
     const glass=track(new T.MeshPhysicalMaterial({color:0xe2d8ff,metalness:.05,roughness:.035,transmission:mobile?.55:.92,thickness:1.4,ior:1.38,clearcoat:1,clearcoatRoughness:.03,iridescence:.45,iridescenceIOR:1.32,envMapIntensity:1.1}));
     const bubbles=new T.Group();if(variant!=='hero')scene.add(bubbles);
     const layout=kind==='ribbons'?[[2,.2,.42],[-2.3,-.9,.21],[1.2,-1.5,.18]]:variant==='plan'?[[2.4,.5,.58],[-2.8,-1.2,.25],[1.4,-1.6,.2]]:variant==='closing'?[[1.65,.35,.95],[-2.6,-1,.28],[2.9,-1.3,.34]]:[[1.15,.2,.95],[-2.7,-.85,.34],[2.8,.15,.25]];
     const meshes=layout.map(([x,y,s],i)=>{const m=new T.Mesh(sphereGeometry,glass);m.position.set(x,y,-.8-i*.2);m.scale.setScalar(s);bubbles.add(m);return m});
     const reflectionMaterial=track(new T.MeshPhysicalMaterial({color:0xb7a2e9,metalness:.3,roughness:.2,transparent:true,opacity:.2,envMapIntensity:.7,depthWrite:false}));
     const reflection=new T.Mesh(sphereGeometry,reflectionMaterial);reflection.position.set(layout[0][0],-1.68,-1);reflection.scale.set(layout[0][2],layout[0][2]*.5,layout[0][2]);bubbles.add(reflection);
     renderScene=(time)=>{if(!renderer||!scene||!camera)return;const r=el.getBoundingClientRect();const p=reduced?.5:Math.max(0,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)));shared.time.value=time;shared.phase.value=p;meshes.forEach((m,i)=>{const base=layout[i];m.position.y=base[1]+(reduced?0:Math.sin(time*.32+i)*.09);m.position.x=base[0]+pointer.x*.07;m.rotation.y=time*.12+p*.4;});reflection.position.x=meshes[0].position.x;camera.position.x=pointer.x*.07;camera.position.y=pointer.y*.04;renderer.render(scene,camera)};
    }else{
     const forms=buildFinancialForms(mobile?4200:7200);
     const geometry=track(new T.BufferGeometry());geometry.setAttribute('position',new T.BufferAttribute(forms.orbit,3));geometry.setAttribute('aCoin',new T.BufferAttribute(forms.coins,3));geometry.setAttribute('aGrowth',new T.BufferAttribute(forms.growth,3));geometry.setAttribute('aColor',new T.BufferAttribute(forms.colors,3));geometry.setAttribute('aSeed',new T.BufferAttribute(forms.seeds,1));
     const material=track(new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{...shared,pixel:{value:renderer.getPixelRatio()}},vertexShader:`
      attribute vec3 aCoin;attribute vec3 aGrowth;attribute vec3 aColor;attribute float aSeed;uniform float time;uniform float phase;uniform float pixel;varying vec3 vColor;varying float vAlpha;
      void main(){float k=clamp(phase,0.,2.);vec3 p=k<1.?mix(position,aCoin,smoothstep(0.,1.,k)):mix(aCoin,aGrowth,smoothstep(0.,1.,k-1.));float pulse=sin(fract(k)*3.14159);p+=vec3(sin(aSeed*20.),cos(aSeed*37.),sin(aSeed*51.))*pulse*.35;p.y+=sin(time*.3+aSeed*6.28)*.035;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=(1.2+aSeed*1.2)*pixel*(7./-mv.z);vColor=aColor;vAlpha=.42+aSeed*.42;}`,fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(vColor,vAlpha*(1.-smoothstep(.08,.5,d)));}` }));
     const sculpture=new T.Points(geometry,material);sculpture.position.set(variant==='insights'?-1.25:1.25,.05,-.8);scene.add(sculpture);
     const starGeo=track(new T.BufferGeometry()),stars=new Float32Array(540*3);
     for(let i=0;i<540;i++){stars[i*3]=(forms.seeds[i%forms.seeds.length]-.5)*13;stars[i*3+1]=Math.sin(i*7.13)*4;stars[i*3+2]=-2-((i*13)%100)/25;}
     starGeo.setAttribute('position',new T.BufferAttribute(stars,3));const starMat=track(new T.PointsMaterial({color:0xbdb6dd,size:.011,transparent:true,opacity:.28,depthWrite:false}));const starField=new T.Points(starGeo,starMat);scene.add(starField);
     renderScene=(time)=>{if(!renderer||!scene||!camera)return;const r=el.getBoundingClientRect();const p=Math.max(0,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)));shared.time.value=time;shared.phase.value=reduced?(variant==='insights'?2:1):Math.max(0,Math.min(2,p*2.7+(variant==='insights'?.2:-.3)));sculpture.rotation.y=(reduced?-.2:time*.055+p*.6)+pointer.x*.06;sculpture.rotation.z=Math.sin(p*Math.PI)*.13;sculpture.rotation.x=.55-shared.phase.value*.18;sculpture.position.y=(variant==='insights'?-.5:.1)+pointer.y*.06;starField.rotation.z=reduced?0:time*.006;renderer.render(scene,camera)};
    }
    const resize=()=>{if(!renderer||!camera)return;const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();shared.aspect.value=w/h;if(reduced&&visible&&!failed)renderScene?.(0);else wake()};
    const observer=new ResizeObserver(resize);observer.observe(el);cleanups.push(()=>observer.disconnect());resize();wake();
   }catch{el.classList.remove('webgl-ready');el.classList.add('webgl-fallback');renderer?.dispose();renderer?.domElement.remove();renderer=undefined;}
  }
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){void init();wake()}else sleep()},{threshold:0});io.observe(el);
  const visibility=()=>{if(document.hidden)sleep();else wake()};document.addEventListener('visibilitychange',visibility);
  const pointerMove=(e:PointerEvent)=>{if(!visible||e.pointerType!=='mouse'||reduced)return;const r=el.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=.5-(e.clientY-r.top)/r.height;};window.addEventListener('pointermove',pointerMove,{passive:true});
  return()=>{disposed=true;sleep();io.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pointermove',pointerMove);cleanups.forEach(fn=>fn());renderer?.dispose();renderer?.domElement.remove();el.classList.remove('webgl-ready')};
 },[kind,variant,reduced]);
 return <div ref={host} className={`atmosphere atmosphere-${kind} atmosphere-${variant}`} aria-hidden="true"><div className="atmosphere-fallback"/></div>;
}
