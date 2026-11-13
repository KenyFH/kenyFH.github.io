import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {steps,duration,locate,startOf} from './process.js';
import {motion,makeLogistics} from './logistics.js';
import {makePlatform} from './platform.js';
import {science,sources,designNote} from './science.js';
const $=s=>document.querySelector(s), host=$('#canvas');
let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true})}catch(e){$('#loading').innerHTML='当前浏览器未能启用三维渲染，请使用支持 WebGL 的浏览器并开启硬件加速。';throw e}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0xe6e9ed);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;host.appendChild(renderer.domElement);
const scene=new T.Scene();scene.fog=new T.Fog(0xe6e9ed,115,210);const camera=new T.PerspectiveCamera(35,1,.1,200);camera.position.set(26,22,30);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(1,3,0);controls.enableDamping=true;controls.minDistance=14;controls.maxDistance=65;controls.maxPolarAngle=Math.PI*.47;controls.minPolarAngle=.2;controls.enablePan=true;
scene.add(new T.HemisphereLight(0xeaf5ff,0x707b86,2));const sun=new T.DirectionalLight(0xfff0de,4);sun.position.set(-12,24,14);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-25,right:25,top:22,bottom:-20,near:.1,far:80});sun.shadow.bias=-.0005;sun.shadow.normalBias=.04;scene.add(sun);const fill=new T.DirectionalLight(0xdaedff,1.6);fill.position.set(15,12,-15);scene.add(fill);
const mat=(color,metalness=.45,roughness=.55)=>new T.MeshStandardMaterial({color,metalness,roughness});
const steel=mat(0xaab4bf,.7,.38),dark=mat(0x505c69,.72,.4),edge=mat(0x798692,.65,.4),concrete=mat(0xcdd2d8,.05,.85),yellow=mat(0xcaa34a,.55,.5),blue=mat(0x2097c6,.5,.32),brick=mat(0x6f584a,.1,.95),slagmat=mat(0x5c4d43,.15,.95),hot=new T.MeshStandardMaterial({color:0xff861a,emissive:0xff5200,emissiveIntensity:2,roughness:.4}),liquid=new T.MeshStandardMaterial({color:0xffc23e,emissive:0xff6600,emissiveIntensity:1.65,roughness:.32});
const root=new T.Group();scene.add(root);
function mesh(geo,m,parent=root){const x=new T.Mesh(geo,m);x.castShadow=true;x.receiveShadow=true;parent.add(x);return x}
function box(w,h,d,x,y,z,m=steel,parent=root){const o=mesh(new T.BoxGeometry(w,h,d),m,parent);o.position.set(x,y,z);return o}
function cyl(rt,rb,h,x,y,z,m=steel,parent=root,n=32){const o=mesh(new T.CylinderGeometry(rt,rb,h,n),m,parent);o.position.set(x,y,z);return o}
function tube(points,r,m=steel,parent=root){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,10,false),m,parent)}
function rod(a,b,r,m=steel,parent=root){const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av);const o=mesh(new T.CylinderGeometry(r,r,v.length(),12),m,parent);o.position.copy(av.add(bv).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o}
function ring(r,y,parent,m=edge){const o=mesh(new T.TorusGeometry(r,.07,8,48),m,parent);o.rotation.x=Math.PI/2;o.position.y=y;return o}
function lathe(profile,m,parent,phiStart=0,phiLength=Math.PI*2){return mesh(new T.LatheGeometry(profile.map(p=>new T.Vector2(...p)),48,phiStart,phiLength),m,parent)}
function platform(x,z,w,d){box(w,.32,d,x,.15,z,concrete);box(w+.12,.08,d+.12,x,.33,z,edge)}
function label(text,pos,step){const el=document.createElement('button');el.className='equipment';el.textContent=text;el.onclick=()=>go(step);$('#labels').append(el);return{el,pos:new T.Vector3(...pos),step}}
const labels=[];
// Raised museum-like workshop plinth, rail tracks and painted circulation lines.
box(33,.5,20,1,-.42,0,concrete);box(33.2,.15,20.2,1,-.72,0,edge);
const grid=new T.GridHelper(34,34,0xb6bfc8,0xcbd1d7);grid.position.set(1,-.15,0);root.add(grid);
for(const z of [3.9,5.4]){box(31,.09,.10,1,.04,z,dark);for(let x=-14;x<17;x+=.7)box(.18,.08,2,x,0,4.65,edge)}
for(const x of [-13,-5,4,12]){box(.045,.01,17,x,-.14,0,yellow)}
// Sparse structural frame, overhead crane rails, no roof to conceal process.
for(const x of [-13,-5,4,13]){for(const z of [-6.7]){box(.26,11,.3,x,5.5,z,dark);box(.65,.25,.7,x,.2,z,edge);box(.5,.25,.55,x,8.6,z,edge)} }
box(28,.3,.3,.2,10.4,-6.7,dark);box(28,.25,.28,.2,8.5,-6.7,edge);
for(let x=-13;x<13;x+=4.3)rod([x,8.5,-6.7],[x+4.3,10.4,-6.7],.055,edge);

// Converter supports and rotating vessel, rotation axis along Z.
platform(0,0,7,5.6);
for(const z of [-2.5,2.5]){box(1,.7,1.5,0,.8,z,dark);box(.9,3.6,.75,0,2.5,z,steel);rod([-.4,1,z],[-1,4.6,z],.13,edge);rod([.4,1,z],[1,4.6,z],.13,edge);const axle=cyl(.47,.47,1.3,0,4.55,z,edge);axle.rotation.x=Math.PI/2;const hub=cyl(.65,.65,.25,0,4.55,z+Math.sign(z)*.5,dark);hub.rotation.x=Math.PI/2;for(let i=0;i<8;i++){const a=i*Math.PI/4;const bolt=cyl(.07,.07,.1,Math.cos(a)*.48,4.55+Math.sin(a)*.48,z+Math.sign(z)*.65,steel,root,8);bolt.rotation.x=Math.PI/2}}
const vessel=new T.Group();vessel.position.set(0,4.55,0);root.add(vessel);
// Actual wall profile. Front 110 degree sector removable for illustrative cutaway.
const profile=[[.18,-2.25],[1.05,-2.16],[1.65,-1.7],[1.98,-.85],[2.06,.7],[1.83,1.62],[1.1,2.8],[.96,2.93],[.85,2.93],[.92,2.65],[1.52,1.47],[1.72,.56],[1.67,-.77],[1.32,-1.43],[.8,-1.78],[.18,-1.84]];
const cutAngle=1.18;const shell=lathe(profile,steel,vessel,cutAngle,Math.PI*2-2*cutAngle);const shellFront=lathe(profile,steel,vessel,-cutAngle,2*cutAngle);
// orange refractory lining visible in cutaway, following inside shape.
const linerProfile=[[.08,-1.84],[.8,-1.78],[1.32,-1.43],[1.67,-.77],[1.72,.56],[1.52,1.47],[.92,2.65],[.85,2.93]];
const liner=lathe(linerProfile,brick,vessel,cutAngle,Math.PI*2-2*cutAngle);liner.material.side=T.DoubleSide;
const band=ring(2.08,.1,vessel,dark);band.scale.y=1.7;ring(1,2.94,vessel,edge);
for(let i=0;i<10;i++){const a=.7+i*.54;rod([2.06*Math.sin(a),-.6,2.06*Math.cos(a)],[2.0*Math.sin(a),.8,2.0*Math.cos(a)],.042,edge,vessel)}
const bath=cyl(1.62,1.32,.48,0,-.7,0,liquid,vessel);const slagSurface=cyl(1.64,1.64,.065,0,-.42,0,slagmat,vessel);slagSurface.material=slagmat.clone();
const tap=rod([1.75,.65,0],[2.5,.45,0],.23,dark,vessel);rod([1.76,.65,0],[2.55,.44,0],.12,brick,vessel);
const glow=new T.PointLight(0xff8b24,30,10,2);glow.position.set(0,3.6,1);root.add(glow);
// Oxygen supply, hood and dust collection train.
const lance=new T.Group();root.add(lance);cyl(.1,.1,5.5,0,9.1,0,steel,lance);cyl(.2,.15,.32,0,6.45,0,dark,lance);cyl(.19,.19,.38,0,10.6,0,blue,lance);
tube([[-12,1,-5],[-12,10,-5],[-10,10.3,-5],[-1.8,10.3,-5],[0,10.3,-4],[0,11,0]],.11,blue);
for(let x=-10;x<0;x+=2)cyl(.14,.14,.2,x,10.3,-5,edge).rotation.z=Math.PI/2;
const hood=cyl(.7,2.3,1.5,0,8.9,-2.3,steel);tube([[0,9.7,-2.3],[.2,11,-3],[3,11,-4.8],[6,9.2,-5]],.48,steel);
platform(7,-5.1,4.2,3.4);for(const x of [6.1,7.8]){cyl(.68,.68,4.5,x,4.2,-5.1,steel);cyl(.68,.18,1,x,1.45,-5.1,edge);cyl(.25,.25,1.8,x,7.3,-5.1,steel);ring(.68,0,new T.Group());for(let y=2;y<6;y+=1){const r=ring(.7,y,root);r.position.x=x;r.position.z=-5.1}for(const dx of [-.5,.5])box(.12,1,.12,x+dx,.8,-5.1,dark)}tube([[6,7.8,-5],[8,8.4,-5],[9.4,8.4,-5],[9.4,10.4,-5]],.23,edge);
labels.push(label('烟气收集 / 除尘',[6.9,8.9,-5],3));
// Ladles with open wall, refractory, handles, and transport car.
function ladle(x,y,z,size=1){const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(size);root.add(g);lathe([[.4,0],[.85,.12],[1.1,1.9],[.92,1.9],[.7,.3],[.4,.25]],steel,g);ring(1.1,1.9,g);ring(.94,.65,g,dark);for(const dx of [-1.18,1.18]){const a=cyl(.18,.18,.5,dx,1.35,0,dark,g);a.rotation.z=Math.PI/2;rod([dx,1.3,0],[dx,2.5,0],.07,edge,g)}const melt=cyl(.9,.7,.08,0,1.5,0,liquid,g);return{g,melt}}
const iron=ladle(-7,4.5,0,1.05);const steelLadle=ladle(5,.9,1.3,1.02);const slagPot=ladle(-4.2,.45,4.5,.8);slagPot.melt.material=slagmat;slagPot.melt.position.y=.6;
const transfer=new T.Group();transfer.position.set(5,0,1.3);root.add(transfer);box(3.6,.4,3,0,.6,0,yellow,transfer);for(const x of [-1.1,1.1])for(const z of [-1.4,1.4]){const w=cyl(.32,.32,.2,x,.3,z,dark,transfer,16);w.rotation.x=Math.PI/2}
// Scrap box on charging side, hinged front ramp and individual scrap pieces.
platform(-8,-3.3,5,3);const scrap=new T.Group();scrap.position.set(-6.6,7.1,-2);root.add(scrap);box(4,.18,1.4,-1.1,0,0,dark,scrap);box(4,.65,.12,-1.1,.35,-.7,steel,scrap);box(4,.65,.12,-1.1,.35,.7,steel,scrap);box(.12,.65,1.4,-3.1,.35,0,steel,scrap);
const scrapBits=[];for(let i=0;i<28;i++){const s=box(.18+(i%4)*.1,.13+(i%3)*.1,.25,-2.9+(i%9)*.34,.3+Math.floor(i/9)*.18,-.44+(i%4)*.27,i%2?edge:dark,scrap);s.rotation.set(i*.42,i*.7,i*.2);scrapBits.push(s)}
const hopper=new T.Group();hopper.position.set(-3.4,9,-3.7);root.add(hopper);cyl(.72,.25,1.3,0,0,0,steel,hopper);tube([[-3.4,8.4,-3.7],[-2.5,7.8,-3],[-.8,7.5,-1]],.13,edge);for(let i=0;i<2;i++)box(.09,2,.09,-4.1+i*1.4,7.8,-3.7,dark);
labels.push(label('废钢料槽',[-7.4,8.3,-2],1),label('铁水包',[-7,7.8,.5],2),label('氧枪',[.6,11,.3],3),label('转炉',[0,2.1,2.7],3),label('出钢口',[2.8,5.1,.3],5),label('钢包 / 钢包车',[5.1,3.7,2.5],5),label('渣罐',[-4,2.7,5.5],6));
// LF station and downstream continuous casting as contextual equipment.
platform(10,1.3,4,4);for(const x of [8.5,11.5])box(.2,5,.2,x,2.7,.1,dark);box(3.4,.35,2.1,10,5.3,.1,steel);cyl(1.3,1.3,.3,10,3.1,1.3,dark);for(const x of [9.5,10,10.5])cyl(.065,.065,2.4,x,4.2,1.3,dark);tube([[10,5.5,-.3],[10,7,-1],[12,7,-3],[12,5,-5]],.18,edge);labels.push(label('炉外精炼（以 LF 示意）',[10,6,1.5],7));
platform(14,-2,4,6);for(const x of [12.8,15.2])box(.2,4,.2,x,2,-2.3,dark);box(3.5,.3,2,14,3.8,-2.3,steel);const tundish=box(2.2,.65,.8,14,4.3,-2.3,brick);const casterMelt=box(1.8,.07,.6,14,4.66,-2.3,hot);cyl(.1,.1,.7,14,3.45,-2.3,brick);box(.8,.6,.8,14,2.8,-2.3,yellow);
const castCurve=new T.CatmullRomCurve3([new T.Vector3(14,2.8,-2.3),new T.Vector3(14,1.8,-1.5),new T.Vector3(14,.65,0),new T.Vector3(14,.55,3),new T.Vector3(14,.55,6.7)]);const strand=mesh(new T.TubeGeometry(castCurve,50,.16,4,false),hot);strand.rotation.y=0;for(let i=0;i<13;i++){const p=castCurve.getPoint(i/13);const roller=cyl(.18,.18,1.2,p.x,p.y-.2,p.z,edge);roller.rotation.z=Math.PI/2;box(.12,.55,.22,p.x-.65,p.y-.4,p.z,dark);box(.12,.55,.22,p.x+.65,p.y-.4,p.z,dark)}labels.push(label('中间包 → 连铸铸坯',[14,5.4,-2.3],7));
const workshop={T,root,box,cyl,rod,tube,steel,dark,edge,yellow};
makePlatform(workshop);const handling=makeLogistics(workshop);
labels.forEach(l=>l.step=steps.findIndex(s=>s.base===l.step));
const ironLabel=labels.find(l=>l.el.textContent==='铁水包');ironLabel.el.textContent='铁水罐 / 罐车';
const scrapLabel=labels.find(l=>l.el.textContent==='废钢料槽');const steelLabel=labels.find(l=>l.el.textContent==='钢包 / 钢包车');
const chargeLabel=label('加料天车',[-10,15.3,4],2),castLabel=label('浇铸天车',[12,15.3,0],15);labels.push(chargeLabel,castLabel);
labels.push(label('操作平台 / 钢结构支撑',[3.8,7.9,-3.6],10),label('双跑楼梯 → 操作层',[-9.3,4.8,-1.6],10),label('操作室 / 控制台',[2.6,9,-5],9));
// Ladle casting stand supports the load after crane release.
for(const x of[12.7,15.3])for(const z of[-3,-1.6]){box(.15,6.3,.18,x,3.15,z,dark);box(.45,.25,2.1,x,6.4,-2.3,edge)}
rod([12.7,.3,-3],[12.7,4.9,-1.6],.055,edge);rod([15.3,.3,-3],[15.3,4.9,-1.6],.055,edge);
const castingStream=rod([14,5.15,-2.3],[14,4.65,-2.3],.065,hot);
const lfMoving=[];root.children.forEach(o=>{if(o.isMesh&&o.position.x>=8.4&&o.position.x<=11.6&&o.position.y>=3&&o.position.y<=5.4&&o.position.z>=-.1&&o.position.z<=1.5)lfMoving.push({o,z:o.position.z,y:o.position.y})});
// Dynamic process particles, streams and probe.
const oxygen=rod([0,6.3,0],[0,4.1,0],.075,blue);oxygen.material=blue.clone();oxygen.material.emissive.set(0x116eae);oxygen.material.emissiveIntensity=1.5;
const probe=cyl(.045,.045,4,.45,10,.2,edge);const reaction=new T.Group();root.add(reaction);const sparks=[];for(let i=0;i<95;i++){const o=mesh(new T.SphereGeometry(.024+(i%3)*.01,5,4),i%4?hot:liquid,reaction);sparks.push(o)}
const smokes=[];const smokeMat=new T.MeshStandardMaterial({color:0x838d94,transparent:true,opacity:.12,depthWrite:false,roughness:1});for(let i=0;i<12;i++)smokes.push(mesh(new T.SphereGeometry(.3,9,8),smokeMat.clone()));
const pourIron=rod([-5.8,6.1,0],[-1.2,5.8,0],.13,hot);const pourSteel=rod([2.2,4.3,0],[5,2.6,1.3],.12,liquid);const pourSlag=rod([-2.5,5.2,0],[-4.2,1.8,4.5],.14,slagmat);
const falling=[];for(let i=0;i<16;i++)falling.push(box(.15,.1,.14,0,0,0,i%2?dark:edge));
let time=0,playing=false,speed=1,current=-1,annotations=true,cutaway=true;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const buttons=steps.map((s,i)=>{const b=document.createElement('button');b.className='step';b.innerHTML='<b>'+String(i+1).padStart(2,'0')+'</b><span>'+s.title+'</span>';b.onclick=()=>go(i);$('#steps').append(b);return b});
function go(i){time=startOf(Math.min(steps.length-1,Math.max(0,i)));updateUI();updateScene(time);}
function updateUI(){const idx=locate(time).i;if(idx!==current){current=idx;const s=steps[idx];$('#stepno').textContent='工序 '+String(idx+1).padStart(2,'0')+' / '+String(steps.length).padStart(2,'0');$('#phase').textContent=s.phase;$('#title').textContent=s.title;$('#description').textContent=s.description;$('#input').textContent=s.input;$('#output').textContent=s.output;$('#notes').replaceChildren(...s.notes.map(n=>{const li=document.createElement('li');li.textContent=n;return li}));$('#observe').textContent=s.observe;$('#next').textContent=idx===steps.length-1?'回到铁水罐进场 ↺':'下一工序 →';buttons.forEach((b,i)=>{b.classList.toggle('active',i===idx);b.classList.toggle('done',i<idx);b.setAttribute('aria-current',i===idx?'step':'false')});labels.forEach(l=>l.el.classList.toggle('active',l.step===idx));renderScience(s.key);const track=$('#steps');track.scrollTo({left:Math.max(0,buttons[idx].offsetLeft-track.offsetLeft-track.clientWidth/2+45),behavior:'smooth'})}$('#seek').value=time;const n=Math.floor(time);$('#time').textContent=String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')+' / '+formatTime(duration);$('#play').textContent=playing?'Ⅱ 暂停':time>=duration?'↺ 重播':'▶ 播放';}
function ease(a){a=T.MathUtils.clamp(a,0,1);return a*a*(3-2*a)}
function setStream(o,a,b){const d=b.clone().sub(a);o.position.copy(a.clone().add(b).multiplyScalar(.5));o.scale.y=d.length()/o.geometry.parameters.height;o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize())}
let liveMotion=null;
function updateScene(t){const {i,p}=locate(t),key=steps[i].key,m=motion(i,p);liveMotion=m;
vessel.rotation.z=m.tilt;iron.g.position.fromArray(m.iron);iron.g.rotation.z=m.ironAngle;scrap.position.fromArray(m.scrap);scrap.rotation.z=m.scrapAngle;steelLadle.g.position.fromArray(m.steel);transfer.position.set(m.steelCar,0,1.3);handling.ironCar.position.set(m.ironCar,0,4.65);handling.scrapCar.position.set(m.scrapCar,0,7.4);
const isBlow=key==='blow',isPour=key==='ironPour',isTap=key==='tap';
lance.position.y=isBlow?-1.7*ease(p*5)*(1-ease((p-.9)*10)):0;oxygen.visible=isBlow&&p>.15&&p<.94;setStream(oxygen,new T.Vector3(0,6.3+lance.position.y,0),new T.Vector3(0,4.1,0));
shellFront.visible=!cutaway;bath.visible=i>=6&&i<=11;bath.scale.y=isPour?Math.max(.05,p):isTap?Math.max(.05,1-p):i>11?.05:1;slagSurface.visible=i>=9&&i<=13;slagSurface.material.transparent=true;slagSurface.material.opacity=.65;glow.intensity=isBlow?34:12;
iron.melt.visible=i<6||isPour&&p<.8;steelLadle.melt.visible=i>=11;steelLadle.melt.position.y=isTap?.45+1.05*p:key==='cast'?1.5*(1-p)+.3*p:1.5;
vessel.updateMatrixWorld(true);iron.g.updateMatrixWorld(true);scrap.updateMatrixWorld(true);steelLadle.g.updateMatrixWorld(true);
setStream(pourIron,iron.g.localToWorld(new T.Vector3(1.05,1.82,0)),vessel.localToWorld(new T.Vector3(0,2.65,0)));setStream(pourSteel,vessel.localToWorld(new T.Vector3(2.55,.44,0)),new T.Vector3(5,2.5,1.3));setStream(pourSlag,vessel.localToWorld(new T.Vector3(0,2.9,0)),new T.Vector3(-4.2,1.75,4.5));pourIron.visible=isPour&&p>.22&&p<.8;pourSteel.visible=isTap&&p>.25&&p<.94;pourSlag.visible=key==='slag'&&p>.25&&p<.75;
scrapBits.forEach(o=>o.visible=i<3||i===3&&p<.78);falling.forEach((o,j)=>{o.visible=key==='scrapCharge'&&p>.64&&p<.86;const f=(p*6+j/16)%1;const start=scrap.localToWorld(new T.Vector3(.8,.3,0)),end=vessel.localToWorld(new T.Vector3(0,1,0));o.position.copy(start.lerp(end,f));o.position.z+=Math.sin(j*2)*.3;o.rotation.x=t+j});
const standby=new T.Vector3(-11,12,6);let chargeAnchor=standby.clone(),chargeLoad=null,chargeType=m.chargeLoad;
if(chargeType){chargeLoad=chargeType==='scrap'?scrap:iron.g;chargeAnchor=chargeLoad.localToWorld(new T.Vector3(chargeType==='scrap'?-1.1:0,chargeType==='scrap'?1.5:2.65,0))}else if(m.chargeTarget)chargeAnchor.lerp(new T.Vector3(...m.chargeTarget),m.chargeApproach);
if(i===4&&p>=.78)chargeAnchor.set(-9.1,2.45+9.55*ease((p-.78)/.22),7.4);if(i===7&&p>=.84)chargeAnchor.set(-11,3.68+8.32*ease((p-.84)/.16),4.65);
handling.charging.update(chargeAnchor,chargeLoad,chargeType,Math.abs(m.ironAngle)+Math.abs(m.scrapAngle)>.02);
let castAnchor=new T.Vector3(12,12,3),castLoad=null;if(m.castLoad){castLoad=steelLadle.g;castAnchor=castLoad.localToWorld(new T.Vector3(0,2.65,0))}else if(m.castTarget)castAnchor.lerp(new T.Vector3(...m.castTarget),m.castApproach);if(i===15&&p>=.92)castAnchor.set(14,7.85+4.15*ease((p-.92)/.08),-2.3);if(i===16)castAnchor.set(14,12,-2.3).lerp(new T.Vector3(12,12,3),ease(p/.3));handling.casting.update(castAnchor,castLoad,'steel',false);
lfMoving.forEach(({o,z,y})=>{o.position.z=z+(i===15?-3.8*ease((p-.05)/.13):i>15?-3.8:0);o.position.y=y+(i===15?.4*ease(p/.05):i>15?.4:0)});
probe.visible=key==='sample';probe.position.y=10-3.1*Math.sin(p*Math.PI);reaction.visible=isBlow&&p>.12&&p<.95;sparks.forEach((o,j)=>{const f=(t*.9+j*.017)%1,a=j*2.399;o.position.set(Math.cos(a)*f*1.8,3.7+3.7*f-2*f*f,Math.sin(a)*f*1.8);o.scale.setScalar((1-f)*1.7)});smokes.forEach((o,j)=>{o.visible=isBlow;const f=(t*.22+j/12)%1;o.position.set(Math.sin(j)*f*.7,7+2*f,-.5-1.8*f);o.scale.setScalar(.8+f*2);o.material.opacity=(1-f)*.15});strand.visible=casterMelt.visible=castingStream.visible=key==='cast';
ironLabel.pos.copy(iron.g.position).add(new T.Vector3(0,3.4,0));scrapLabel.pos.copy(scrap.position).add(new T.Vector3(-1,1.6,0));steelLabel.pos.copy(steelLadle.g.position).add(new T.Vector3(0,3.3,.6));chargeLabel.pos.set(chargeAnchor.x,15.5,chargeAnchor.z);castLabel.pos.set(castAnchor.x,15.5,castAnchor.z);
$('#dispatch-action').textContent=m.action;$('#charge-status').textContent=m.charge;$('#cast-status').textContent=m.casting;
}
function formatTime(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0')}
function renderScience(key){const d=science(key);$('#temperature').textContent=d.temperature;$('#thermal').textContent=d.thermal;$('#reactions').replaceChildren(...d.reactions.map(v=>{const el=document.createElement('li');el.textContent=v;return el}));$('#parameters').replaceChildren(...d.parameters.map(row=>{const tr=document.createElement('tr');row.forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.append(td)});return tr}));$('#design-note').textContent=designNote;$('#science-sources').replaceChildren(...d.refs.map(id=>{const a=document.createElement('a');a.textContent=sources[id][0];a.href=sources[id][1];a.target='_blank';a.rel='noreferrer';return a}))}
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-panel]').forEach(x=>{const selected=x===b;x.setAttribute('aria-selected',selected);$('#'+x.dataset.panel).hidden=!selected})});
$('#seek').max=duration;
let smallView=false;function resize(){const w=host.clientWidth,h=host.clientHeight;if((w<500)!==smallView){smallView=w<500;home()}renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}new ResizeObserver(resize).observe(host);
function home(){const k=host.clientWidth<500?1.65:1;camera.position.set(32*k,27*k,36*k);controls.maxDistance=k>1?90:65;controls.target.set(1,3,0);controls.update()}$('#reset').onclick=home;$('#overview').onclick=home;$('#focus').onclick=()=>{camera.position.set(18,15,23);controls.target.set(0,4.2,0);controls.update()};
$('#annotations').onclick=()=>{annotations=!annotations;$('#labels').hidden=!annotations;$('#annotations').setAttribute('aria-pressed',annotations);$('#annotations span').textContent=annotations?'开':'关'};$('#cutaway').onclick=()=>{cutaway=!cutaway;$('#cutaway').setAttribute('aria-pressed',cutaway);$('#cutaway span').textContent=cutaway?'开':'关'};
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){$('#fullscreen').textContent='浏览器不支持全屏'}};
$('#next').onclick=()=>go((current+1)%steps.length);$('#play').onclick=()=>{if(time>=duration)time=0;playing=!playing;updateUI()};$('#restart').onclick=()=>{time=0;playing=false;updateUI();updateScene(time)};$('#speed').onchange=e=>speed=Number(e.target.value);$('#seek').oninput=e=>{time=Number(e.target.value);updateUI();updateScene(time)};
document.addEventListener('keydown',e=>{if(['INPUT','SELECT','BUTTON'].includes(document.activeElement.tagName))return;if(e.code==='Space'){e.preventDefault();$('#play').click()}if(e.code==='ArrowRight')go(current+1);if(e.code==='ArrowLeft')go(current-1)});
let last=performance.now();function tick(now){requestAnimationFrame(tick);const dt=Math.min((now-last)/1000,.08);last=now;if(playing){time=Math.min(duration,time+dt*speed);if(time>=duration)playing=false;updateUI()}updateScene(time);controls.update();const cw=host.clientWidth,ch=host.clientHeight;labels.forEach(l=>{const v=l.pos.clone().project(camera);l.el.style.left=(v.x*.5+.5)*cw+'px';l.el.style.top=(-v.y*.5+.5)*ch+'px';l.el.style.display=v.z>1||Math.abs(v.x)>.96||Math.abs(v.y)>.92||(smallView&&!['转炉','加料天车','浇铸天车'].includes(l.el.textContent))?'none':''});renderer.render(scene,camera)}
updateUI();updateScene(0);resize();$('#loading').remove();requestAnimationFrame(tick);window.bofApp={getState:()=>({time,playing,current,cutaway,annotations,motion:liveMotion,stages:steps.map(s=>s.key),duration}),go,seek:(t)=>{time=T.MathUtils.clamp(t,0,duration);updateUI();updateScene(time)}};
