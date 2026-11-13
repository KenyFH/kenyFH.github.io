// Deterministic handling sequence: all poses derive from timeline position.
const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
const blend=(a,b,u)=>a.map((v,i)=>v+(b[i]-v)*smooth(u));
function path(p,keys){for(let j=1;j<keys.length;j++){if(p<=keys[j][0])return blend(keys[j-1][1],keys[j][1],(p-keys[j-1][0])/(keys[j][0]-keys[j-1][0]))}return keys.at(-1)[1].slice()}
export function motion(k,p){const s={iron:[-11,.9,4.65],scrap:[-8,.95,7.4],steel:[14,.9,1.3],ironCar:-11,scrapCar:-9.1,steelCar:14,chargeLoad:null,castLoad:null,tilt:k>=3&&k<=6?.68:0,ironAngle:0,scrapAngle:0,action:'待命',charge:'待命 · 吊具升起',casting:'待命 · 吊具升起'};
if(k===0){s.iron[0]=-14+3*smooth(p);s.ironCar=s.iron[0];s.scrap[0]=-14;s.scrapCar=-15.1;s.action='铁水罐车 → 铁水吊装位';}
if(k===1){s.scrap[0]=-14+6*smooth(p);s.scrapCar=s.scrap[0]-1.1;s.action='废钢料槽车 → 料槽吊装位';}
if(k===2){s.scrap=path(p,[[0,[-8,.95,7.4]],[.35,[-8,.95,7.4]],[1,[-8,8,7.4]]]);s.chargeLoad=p>=.35?'scrap':null;s.chargeTarget=[-9.1,2.45,7.4];s.chargeApproach=smooth(p/.35);s.charge=p<.35?'驶入 → 落钩挂槽':'主钩起升 · 料槽离车';s.action='料槽车停车 → 挂钩 → 试吊 → 起升';}
if(k===3){s.scrap=path(p,[[0,[-8,8,7.4]],[.48,[-3,7.6,0]],[1,[-3,7.6,0]]]);s.scrapAngle=-.35*smooth((p-.48)/.18)*(1-smooth((p-.9)/.1));s.chargeLoad='scrap';s.charge=p<.48?'大车行走 / 小车横移':'副钩配合 · 料槽倾翻';s.tilt=.68*smooth(p/.3);s.action=p<.48?'高位吊运 → 转炉加料位':'料槽倾翻 → 废钢入炉';}
if(k===4){s.scrap=path(p,[[0,[-3,7.6,0]],[.45,[-8,8,7.4]],[.78,[-8,.95,7.4]],[.88,[-8,.95,7.4]],[1,[-14,.95,7.4]]]);s.chargeLoad=p<.78?'scrap':null;s.scrapCar=p>.88?s.scrap[0]-1.1:-9.1;s.charge=p<.45?'空槽回运':p<.78?'落槽到车':'摘钩 · 退出吊装区';s.action='空槽回运 → 落车摘钩 → 料槽车退场';}
if(k>=5){s.scrap=[-14,.95,7.4];s.scrapCar=-15.1;}
if(k===5){s.iron=path(p,[[0,[-11,.9,4.65]],[.2,[-11,.9,4.65]],[.48,[-11,7.6,4.65]],[.86,[-4.8,7.6,0]],[1,[-4.8,6.5,0]]]);s.chargeLoad=p>=.2?'iron':null;s.chargeTarget=[-11,3.68,4.65];s.chargeApproach=smooth(p/.2);s.charge=p<.2?'移至铁水位 · 落钩':p<.48?'挂罐 · 起升':p<.86?'吊运铁水罐':'对准兑铁位';s.action='主钩挂罐 → 起升 → 大车 / 小车移位';}
if(k===6){s.iron=[-4.8,6.5,0];s.ironAngle=-.9*smooth(p/.22)*(1-smooth((p-.8)/.2));s.chargeLoad='iron';s.charge='主钩承重 · 副钩控制倾翻';s.action='副钩起升 → 倾罐兑铁 → 铁水罐回正';}
if(k===7){s.iron=path(p,[[0,[-4.8,6.5,0]],[.16,[-4.8,7.6,0]],[.6,[-11,7.6,4.65]],[.84,[-11,.9,4.65]],[.9,[-11,.9,4.65]],[1,[-14,.9,4.65]]]);s.chargeLoad=p<.84?'iron':null;s.ironCar=p>.9?s.iron[0]:-11;s.tilt=.68*(1-smooth(p/.5));s.charge=p<.6?'空罐回运':p<.84?'空罐落车':'摘钩 · 天车退出';s.action='空罐回运 → 落车摘钩 → 铁水罐车退场';}
if(k>=8){s.iron=[-14,.9,4.65];s.ironCar=-14;s.steel=[5,.9,1.3];s.steelCar=5;}
if(k===8){s.steel[0]=14-9*smooth(p);s.steelCar=s.steel[0];s.action='预热钢包随钢包车 → 出钢位';}
if(k===9)s.action='加料天车退出 · 转炉正位 → 降枪吹炼';
if(k===10)s.action='提枪停氧 → 副枪测温取样';
if(k===11){s.tilt=-.65*smooth(p/.25);s.action='钢包车定位 → 炉体倾转 → 侧口出钢';}
if(k===12){s.steel[0]=5+5*smooth(p);s.steelCar=s.steel[0];s.tilt=-.65*(1-smooth(p/.3));s.action='重钢包车 → LF 精炼交接位';}
if(k>=13){s.steel=[10,.9,1.3];s.steelCar=10;}
if(k===13){s.tilt=1.6*smooth(p/.25)*(1-smooth((p-.78)/.22));s.action='渣罐接渣 → 倒渣 → 炉体回正';}
if(k===14)s.action='LF 工位接收钢包 → 精炼及温度成分确认';
if(k===15){s.steel=path(p,[[0,[10,.9,1.3]],[.22,[10,.9,1.3]],[.48,[10,6.4,1.3]],[.8,[14,6.4,-2.3]],[.92,[14,5.15,-2.3]],[1,[14,5.15,-2.3]]]);s.castLoad=p>=.22&&p<.92?'steel':null;s.castTarget=[10,3.65,1.3];s.castApproach=smooth(p/.22);s.casting=p<.22?'LF 炉盖退避 · 落钩':p<.48?'挂包 · 主钩起升':p<.8?'重包吊运 → 浇铸位':p<.92?'钢包落座':'摘钩 · 吊具退出';s.action='浇铸天车吊运 → 钢包落座浇铸支架';}
if(k===16){s.steel=[14,5.15,-2.3];s.action='钢包底注 → 中间包 → 结晶器 → 铸坯';}
return s;}
export function makeLogistics(h){const{T,root,box,cyl,rod,tube,steel,dark,edge,yellow}=h;
function car(){const g=new T.Group();root.add(g);box(3.7,.35,2.6,0,.6,0,yellow,g);for(const x of[-1.2,1.2])for(const z of[-1.25,1.25]){const w=cyl(.29,.29,.2,x,.3,z,dark,g,16);w.rotation.x=Math.PI/2}for(const x of[-1.2,1.2])box(.16,.5,1.2,x,.95,0,dark,g);return g;}
const ironCar=car(),scrapCar=car();
for(const z of [6.65,8.15]){box(14,.09,.1,-8,.04,z,dark);for(let x=-15;x<-1;x+=.7)box(.17,.08,1.8,x,0,7.4,edge)}
for(const z of [.55,2.05]){box(12,.09,.1,10,.04,z,dark);for(let x=4;x<16;x+=.65)box(.16,.08,1.8,x,0,1.3,edge)}
function crane(xmin,xmax,zmin,zmax,tint){const g=new T.Group();root.add(g);const paint=yellow.clone();paint.color.setHex(tint);const bridge=new T.Group();g.add(bridge);for(const z of[zmin,zmax]){box(xmax-xmin,.3,.32,(xmin+xmax)/2,13.9,z,edge,g);for(const x of[xmin,xmax]){box(.2,13.7,.25,x,6.8,z,edge,g);rod([x,12.5,z],[x+(x===xmin?1:-1),13.9,z],.07,edge,g)}}
for(const x of[-.5,.5]){box(.35,.65,zmax-zmin+1,x,14.2,(zmax+zmin)/2,paint,bridge);box(.4,.1,zmax-zmin+1,x,14.58,(zmax+zmin)/2,dark,bridge)}for(const z of[zmin,zmax])box(1.8,.35,.7,0,14,z,dark,bridge);
const trolley=new T.Group();bridge.add(trolley);box(1.8,.3,1.4,0,14.7,0,paint,trolley);for(const x of[-.45,.45])cyl(.24,.24,.6,x,15,0,dark,trolley).rotation.x=Math.PI/2;box(.5,.4,.5,.95,14.8,0,edge,trolley);
const ropes=[rod([0,14.6,0],[0,12,0],.027,dark),rod([0,14.6,0],[0,12,0],.027,dark)];const hook=new T.Group();root.add(hook);box(2.5,.18,.35,0,0,0,paint,hook);const tor=new T.Mesh(new T.TorusGeometry(.17,.06,7,18,Math.PI*1.65),dark);tor.position.y=-.25;hook.add(tor);const slings=[rod([0,0,0],[0,1,0],.035,dark),rod([0,0,0],[0,1,0],.035,dark)];const auxiliary=rod([0,0,0],[0,1,0],.028,dark);const aHook=cyl(.1,.1,.25,0,0,0,paint);
const line=(o,a,b)=>{const d=b.clone().sub(a);o.position.copy(a.clone().add(b).multiplyScalar(.5));o.scale.y=d.length()/o.geometry.parameters.height;o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize())};
function update(anchor,load,type,tilting){bridge.position.x=anchor.x;trolley.position.z=anchor.z;hook.position.copy(anchor);for(let j=0;j<2;j++){const dx=j? .45:-.45;line(ropes[j],new T.Vector3(anchor.x+dx,14.6,anchor.z),new T.Vector3(anchor.x+dx,anchor.y,anchor.z))}slings.forEach((o,j)=>{o.visible=!!load;if(load){const point=load.localToWorld(new T.Vector3(type==='scrap'?-1.1+(j?1.5:-1.5):(j?1.18:-1.18),type==='scrap'?.5:1.35,0));line(o,new T.Vector3(anchor.x+(j?1.15:-1.15),anchor.y,anchor.z),point)}});auxiliary.visible=aHook.visible=!!load&&tilting;if(tilting&&load){const endpoint=load.localToWorld(new T.Vector3(type==='scrap'?.5:.8,.35,0));line(auxiliary,new T.Vector3(anchor.x+1,14.6,anchor.z),endpoint);aHook.position.copy(endpoint)}}return{update,bridge,trolley,hook};}
const charging=crane(-14,-2,-5.8,8,0xd8ac43),casting=crane(9.3,16,-5.8,4,0xe4b453);
return{ironCar,scrapCar,charging,casting};}
