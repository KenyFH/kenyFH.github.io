// Shared prompt templates for resource details and the content-maintenance prototype.
(()=>{
 const scriptBase=new URL('.',document.currentScript.src).href;
 const base=['localhost','127.0.0.1'].includes(location.hostname)?'https://kenyfh.github.io/ai-studio/':scriptBase;
 const absolute=source=>{try{return new URL(source||'',base).href}catch{return source||''}};
 window.getInstallationPrompt=function(r){
  if(r.installPrompt?.trim())return r.installPrompt.trim();
  const source=absolute(r.source),name=r.slug||r.name;
  if(r.kind==='MCP')return `请帮我在 WorkBuddy 中配置并验证 ${r.name}。\n\n官方来源：${source}\n环境要求：${r.requires||'请按官方说明检查'}\n\n请按顺序完成：\n1. 阅读官方说明，检查所需运行环境和当前 WorkBuddy 的 MCP 配置入口。\n2. 查看现有配置，只添加本服务，保留其他服务和设置。如果当前版本不能由对话直接配置，请告诉我具体需要手动操作的步骤。\n3. 参考下方配置进行合并；实际版本、参数与依赖以官方说明为准。不要声称已经执行尚未完成的操作。\n4. 如需凭证，指导我在本地配置，不要将凭证写入对话、报告或公开文件。\n5. 连接成功后，执行一个只读测试，返回服务状态、实际版本与测试结果。不要提交表单、发送消息或修改外部数据。\n\n参考配置：\n${r.config||'请从官方说明获取适用于当前版本的配置。'}\n\n只读验证任务：${r.verify||'列出服务能力，并执行一次只读查询。'}`;
  if(r.group==='own')return `请协助我在 WorkBuddy 中安装「${r.name}」技能。\n\n技能名称：${name}\n版本：${r.version||'以技能包为准'}\n技能包下载地址：${source}\n资源说明：此包为演示技能，包含 README.md 与 SKILL.md。\n\n请按顺序完成：\n1. 检查是否已经安装同名技能；如有，请先说明现有版本，避免覆盖。\n2. 将上方 ZIP 下载到当前工作目录，阅读包内说明，核对 SKILL.md 中的名称和依赖要求。\n3. 此资源是本地 ZIP，不是市场安装命令。请按当前 WorkBuddy 支持的方式协助导入；如果不能由对话自动完成，明确让我在「技能 → 添加技能 → 上传技能」中选择该 ZIP，不要自行猜测或修改系统技能目录。\n4. 导入后检查已安装列表和启用状态。尚未完成时请准确说明当前步骤。\n5. 给出一条最小调用示例，让我确认技能已被实际加载。\n\n安装后的验证方式：${r.verify||'检查名称与启用状态，并运行一次小任务。'}`;
  return `请帮我查找并安装「${r.name}」技能。\n\n参考来源：${source}\n用途：${r.usage||r.desc}\n\n请先阅读来源说明，在 WorkBuddy 技能市场中查找名称与来源匹配的技能，列出作者和版本供我核对，再按客户端的确认流程安装。不要只凭同名选择其他资源。\n\n如果市场中没有对应条目，请根据原作者提供的获取方式准备完整技能包，并说明通过「添加技能 → 上传技能」导入的步骤；不要声称已经安装。\n\n安装完成后检查启用状态，并执行一个小任务验证：${r.verify||'确认对应技能被实际加载。'}`;
 };
 window.renderInstallPrompt=function(r){return `<div class="installation-prompt"><h3>通过提示词安装</h3><p>复制下面的内容，粘贴到 WorkBuddy 对话框，按提示完成安装与验证。</p><div class="prompt-box"><div class="prompt-top"><span>安装提示词 · WorkBuddy</span><button data-resource-copy="${r.id}" data-copy-field="installPrompt">${icon('copy')} 复制安装提示词</button></div><pre>${esc(getInstallationPrompt(r))}</pre></div><p class="small-note">${r.kind==='MCP'?'MCP 配置能否由对话完成取决于客户端能力；请以实际连接和验证结果为准。':r.group==='own'?'本站 ZIP 是本地技能包；对话可协助下载和检查，若不能自动导入，需在技能页手动上传。':'市场技能可通过对话查找安装；如使用原作者的本地包，需按客户端要求上传导入。'}</p></div>`};
})();
