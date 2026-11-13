import {steps as core} from './process-core.js';
const mk=(key,title,base,duration,description,observe)=>({...core[base],key,title,duration,description:description||core[base].description,observe:observe||core[base].observe,base});
export const steps=[
mk('ironArrival','铁水罐进场',0,12,'经预处理的铁水由铁水罐车送入车间，在指定吊装位停车，等待加料天车接运。','观察前侧轨道上铁水罐车进场，铁水罐在吊装前始终由车辆承托。'),
mk('scrapArrival','料槽车进场',0,10,'废钢在料槽内配料称量，由料槽车送至另一条接运轨道；车辆停车后向天车交接。','废钢料槽与铁水罐使用分开的接运轨道；加料天车按顺序服务。'),
mk('scrapPick','天车挂槽起升',1,12,'加料天车大车定位，小车移至料槽上方；落钩挂接、确认承载后，主钩起升使料槽离开车辆。','黄色桥架沿纵向轨道移动，小车在桥架上横移；双侧钢丝绳随主钩升降。'),
mk('scrapCharge','吊运废钢加料',1,16,'料槽起升至示意通行高度，大车和小车将其送至加料位；转炉倾转、氧枪退出，副钩配合料槽倾翻加料。','先吊运到位，再倾翻装料；设备占位与动作顺序可用进度条反复查看。'),
mk('scrapReturn','空槽回运落车',1,14,'空槽回正，由原路吊回接运位并下降到料槽车；摘钩后吊具升起，料槽车退场。','落槽到车后才解除吊挂，车辆退出与吊运过程依次发生。'),
mk('ironPick','天车吊运铁水',2,16,'加料天车转至铁水罐吊装位，主钩挂罐起升；铁水罐离开罐车后，沿示意吊运路径移向兑铁位。','铁水罐从车载状态切换到吊挂状态，吊具与罐体同步移动。'),
mk('ironPour','倾罐兑入铁水',2,14,'主钩承重，副钩配合控制铁水罐倾翻；铁水兑入已装废钢的转炉，兑铁后罐体回正。','铁水流从罐口进入倾斜炉口；兑铁过程中两套吊索分别表达承重和倾翻。'),
mk('ironReturn','空罐回运退场',2,16,'空铁水罐吊回接运位，下降落在铁水罐车上后摘钩；罐车退场，天车退出转炉工作区域。','空罐落车后才脱钩；炉体逐步回正，吊装与吹炼顺序衔接。'),
mk('ladlePosition','空钢包就位',0,12,'检查并预热后的钢包由钢包车送往出钢侧，定位等待；炉下钢包车通道与高处操作平台相互分离。','钢包随台车沿出钢侧专用轨道移动，钢包车不是自由漂移的设备。'),
mk('blow','吹氧精炼',3,18),mk('sample','终点检测',4,10),mk('tap','出钢合金化',5,14),
mk('steelTransfer','钢包车转运',7,12,'出钢结束后，重钢包由钢包车送往 LF 精炼交接位；完成工位交接后进行精炼。','钢包保持落座台车，台车从出钢位行至精炼位；转炉同步回正。'),
mk('slag','倒渣护炉',6,12),
mk('refine','LF 炉外精炼',7,10,'在 LF 工位，按钢种需要进行电弧加热、合金微调及氩气搅拌；确认成分、温度与洁净度后转序。','LF 仅示意一种精炼路线，RH 等设备按实际钢种配置。'),
mk('castLift','浇铸天车转运',7,16,'LF 炉盖与电极抬起退避，浇铸天车落钩挂包、起升并运至浇铸位；钢包在支架上落座后摘钩。','右侧独立浇铸天车负责钢包转运；先退出精炼设备，再吊运并落座。'),
mk('cast','钢包底注连铸',7,12,'钢包在浇铸支架上由底部水口向中间包供钢，钢水再流入结晶器及二冷区，连续凝固成铸坯。','钢包落座支架后进行底注浇钢，浇铸天车吊具退出。')
];
const routeNotes=['本演示按单炉串行调度；现场天车分工、路径与互锁须依车间布置确定。','吊运遵守区域隔离与设备互锁；图中通行高度仅为模型示意，不是吊运参数。'];
for(const s of steps){if(['ironArrival','scrapArrival','scrapPick','scrapCharge','scrapReturn','ironPick','ironReturn','castLift'].includes(s.key)){s.notes=[s.notes[0],...routeNotes];s.phase='物流 / 天车'}if(s.key==='ladlePosition')s.notes=['出钢前确认钢包检查、预热、干燥和定位状态。','炉下运输与高处操作区分离，保持钢包车通道畅通。'];}
export const duration=steps.reduce((sum,s)=>sum+s.duration,0);
export function locate(t){let start=0;for(let i=0;i<steps.length;i++){if(t<start+steps[i].duration||i===steps.length-1)return{i,p:Math.min(1,(t-start)/steps[i].duration),start};start+=steps[i].duration}}
export function startOf(i){return steps.slice(0,i).reduce((sum,s)=>sum+s.duration,0)}

const flows={ironArrival:['预处理铁水（示例90 t）','铁水罐吊装位'],scrapArrival:['废钢料槽（示例20 t）','料槽吊装位'],scrapReturn:['空废钢料槽','落车摘钩 / 车辆退场'],ironReturn:['空铁水罐','落车摘钩 / 罐车退场'],ladlePosition:['预热合格空钢包','出钢侧就位'],steelTransfer:['重钢包 / 钢包车','LF 交接位'],refine:['待精炼钢水','温度 / 成分确认'],castLift:['合格精炼钢水','浇铸支架落座'],cast:['钢包底注钢水','合格铸坯']};for(const s of steps){if(flows[s.key])[s.input,s.output]=flows[s.key]}
