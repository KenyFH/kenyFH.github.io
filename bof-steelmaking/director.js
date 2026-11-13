import * as T from 'three';
const views={
 ironArrival:{label:'铁水罐进场',offset:[15,10,18]},scrapArrival:{label:'料槽车接运',offset:[15,11,18]},
 scrapPick:{label:'挂槽与起升',offset:[17,12,20]},scrapCharge:{label:'天车加料',offset:[17,11,20]},scrapReturn:{label:'空槽回运',offset:[18,12,21]},
 ironPick:{label:'铁水罐吊运',offset:[18,12,21]},ironPour:{label:'倾罐兑铁',offset:[15,9,19]},ironReturn:{label:'空罐回运',offset:[18,12,21]},
 ladlePosition:{label:'钢包就位',offset:[15,10,18]},blow:{label:'炉内反应特写',target:[0,4.9,.2],offset:[6.8,4.7,11]},sample:{label:'测温取样',target:[0,5.3,0],offset:[10,6,15]},
 tap:{label:'侧口出钢',target:[2.6,3.5,.5],offset:[12,8,16]},steelTransfer:{label:'钢包车转运',offset:[14,9,18]},slag:{label:'倒渣与护炉',target:[-1.6,3,2],offset:[13,9,17]},
 refine:{label:'炉外精炼',target:[10,3,1.3],offset:[12,8,17]},castLift:{label:'浇铸天车吊运',offset:[16,11,20]},cast:{label:'底注与连铸',target:[14,3.3,-.5],offset:[13,9,18]}
};
export function createDirector(camera,controls,host,button,status,reduced){let enabled=true,manual=false,lastKey=null,viewLabel='',settled=false;controls.minDistance=9;const target=new T.Vector3(),eye=new T.Vector3();
const refresh=()=>{button.setAttribute('aria-pressed',enabled);button.querySelector('span').textContent=enabled?'开':'关';status.textContent=!enabled?'自由视角':manual?'手动视角 · 下一工序恢复':('自动聚焦 · '+viewLabel)};
function interrupt(){manual=true;settled=false;refresh()}
controls.addEventListener('start',interrupt);
button.onclick=()=>{enabled=!enabled;manual=false;settled=false;refresh()};
function update(key,m,dt){const changed=key!==lastKey;if(changed){lastKey=key;manual=false;settled=false}const view=views[key];viewLabel=view.label;refresh();if(!enabled||manual||(reduced&&settled))return;
if(view.target)target.fromArray(view.target);else if(key.startsWith('scrap'))target.fromArray(m.scrap).add(new T.Vector3(-.8,key==='scrapPick'?3:2.5,0));else if(key.startsWith('iron'))target.fromArray(m.iron).add(new T.Vector3(1,key==='ironPour'?1:3,0));else target.fromArray(m.steel).add(new T.Vector3(0,key==='castLift'?3:1.6,0));
// Keep the whole active load and the hoist in view during lift operations.
if(['scrapPick','scrapCharge','scrapReturn','ironPick','ironReturn','castLift'].includes(key))target.y=Math.max(6.8,target.y);
const factor=Math.min(1.85,Math.max(1,1.32/camera.aspect));eye.fromArray(view.offset).multiplyScalar(factor).add(target);const alpha=reduced?1:1-Math.exp(-dt*3.5);controls.target.lerp(target,alpha);camera.position.lerp(eye,alpha);settled=true;
}
return{update,interrupt,getState:()=>({enabled,manual,label:viewLabel})};}
