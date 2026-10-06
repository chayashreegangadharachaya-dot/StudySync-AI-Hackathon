const defaultTopics=[
{id:1,subject:'Data Structures',topic:'Trees & Graphs',difficulty:'Hard',hours:2,deadline:'2026-10-11',progress:35,status:'pending',missed:false},
{id:2,subject:'Database Systems',topic:'Normalization',difficulty:'Medium',hours:1,deadline:'2026-10-14',progress:70,status:'pending',missed:false},
{id:3,subject:'Artificial Intelligence',topic:'Search Algorithms',difficulty:'Hard',hours:1.5,deadline:'2026-10-18',progress:45,status:'pending',missed:false},
{id:4,subject:'Computer Networks',topic:'TCP/IP Protocols',difficulty:'Medium',hours:1,deadline:'2026-10-21',progress:80,status:'pending',missed:false},
{id:5,subject:'HR Management',topic:'Recruitment & Selection',difficulty:'Easy',hours:1,deadline:'2026-10-24',progress:90,status:'pending',missed:false},
{id:6,subject:'Data Structures',topic:'Sorting Algorithms',difficulty:'Medium',hours:1.5,deadline:'2026-10-09',progress:60,status:'pending',missed:false},
{id:7,subject:'Database Systems',topic:'SQL Queries',difficulty:'Easy',hours:1,deadline:'2026-10-12',progress:85,status:'pending',missed:false}
];
let topics=JSON.parse(localStorage.getItem('studysync_topics')||'null')||defaultTopics;
let user=localStorage.getItem('studysync_user')||'Chaya';
let charts={};

function save(){localStorage.setItem('studysync_topics',JSON.stringify(topics))}
function daysLeft(d){return Math.max(0,Math.ceil((new Date(d)-new Date('2026-10-06'))/86400000))}
function priority(t){
 const urgency=Math.max(0,100-daysLeft(t.deadline)*8);
 const diff={Easy:20,Medium:55,Hard:90}[t.difficulty]||50;
 const weak=100-t.progress;
 const missed=t.missed?100:0;
 return Math.round(urgency*.4+diff*.25+weak*.25+missed*.1)
}
function level(t){let p=priority(t);return p>=65?'high':p>=42?'medium':'low'}
function subjectData(){
 const map={};
 topics.forEach(t=>{if(!map[t.subject])map[t.subject]={total:0,prog:0};map[t.subject].total++;map[t.subject].prog+=t.progress})
 return Object.entries(map).map(([name,v])=>({name,progress:Math.round(v.prog/v.total)}))
}
function render(){
 document.getElementById('welcome').innerHTML=`Good morning, ${user}`;
 document.getElementById('statSubjects').textContent=subjectData().length;
 const overall=Math.round(topics.reduce((a,t)=>a+t.progress,0)/topics.length);
 document.getElementById('overall').textContent=overall+'%';
 document.getElementById('statCompleted').textContent=topics.filter(t=>t.status==='done').length+12;
 document.getElementById('statUrgent').textContent=topics.filter(t=>priority(t)>=65&&t.status!=='done').length;
 renderToday();renderBars();renderUpcoming();renderPlanner();renderSubjects();renderCalendar();renderCharts();
 const urgent=topics.filter(t=>priority(t)>=65&&t.status!=='done').sort((a,b)=>priority(b)-priority(a))[0];
 if(urgent){document.getElementById('mainInsight').textContent=`Prioritize ${urgent.subject} today`;document.getElementById('insightText').textContent=`${urgent.topic} has a priority score of ${priority(urgent)}/100. Consider an extra focused session before ${urgent.deadline}.`;document.getElementById('sideInsight').textContent=`${urgent.subject} needs attention. ${urgent.daysLeft||daysLeft(urgent.deadline)} day(s) left.`}
}
function renderToday(){
 const list=[...topics].filter(t=>t.status!=='done').sort((a,b)=>priority(b)-priority(a)).slice(0,4);
 document.getElementById('todayList').innerHTML=list.map((t,i)=>taskHTML(t,i)).join('')||'<div class="empty">All caught up! 🎉</div>';
}
function taskHTML(t,i){
 return `<div class="task"><button class="check ${t.status==='done'?'done':''}" onclick="toggleDone(${t.id})">${t.status==='done'?'✓':''}</button><div class="task-main"><b>${t.topic}</b><small>${t.subject} · ${t.hours}h · ${daysLeft(t.deadline)} days left</small></div><span class="badge ${level(t)}">${level(t).toUpperCase()}</span><button class="link" onclick="markMissed(${t.id})">Miss</button></div>`
}
function renderBars(){
 document.getElementById('subjectBars').innerHTML=subjectData().map(s=>`<div class="bar-row"><div class="bar-label"><b>${s.name}</b><span>${s.progress}%</span></div><div class="bar-bg"><div class="bar-fill" style="width:${s.progress}%"></div></div></div>`).join('');
}
function renderUpcoming(){
 const upcoming=[...topics].filter(t=>t.status!=='done').sort((a,b)=>a.deadline.localeCompare(b.deadline)).slice(0,4);
 document.getElementById('upcoming').innerHTML=upcoming.map(t=>`<div class="up-item"><div class="datebox">${new Date(t.deadline).getDate()}<br>${new Date(t.deadline).toLocaleString('en',{month:'short'})}</div><div><b>${t.topic}</b><small>${t.subject} · ${daysLeft(t.deadline)} days left</small></div></div>`).join('');
}
function renderPlanner(){
 const list=[...topics].filter(t=>t.status!=='done').sort((a,b)=>priority(b)-priority(a));
 document.getElementById('plannerList').innerHTML=list.map((t,i)=>`<div class="planner-item"><div class="time">${['09:00','10:30','13:30','15:30','17:00','19:00'][i%6]}<br>${t.hours} HR</div><div><h4>${t.topic}</h4><p>${t.subject} · Deadline ${t.deadline} · ${t.progress}% complete ${t.missed?'· ⚠ MISSED':''}</p></div><div><span class="badge ${level(t)}">${priority(t)} PRIORITY</span><br><button class="link" onclick="toggleDone(${t.id})">${t.status==='done'?'Undo':'Complete'}</button> <button class="link" onclick="markMissed(${t.id})">Miss</button></div></div>`).join('')||'<div class="empty">No pending topics.</div>';
}
function renderSubjects(){
 document.getElementById('subjectCards').innerHTML=subjectData().map(s=>{
 const arr=topics.filter(t=>t.subject===s.name);return `<div class="subject-card"><div class="top"><div><h3>${s.name}</h3><p class="muted">${arr.length} topics · ${arr.filter(x=>x.status==='done').length} completed</p></div><span class="pct">${s.progress}%</span></div><div class="bar-bg"><div class="bar-fill" style="width:${s.progress}%"></div></div><div style="margin-top:13px">${arr.map(t=>`<div class="task"><button class="check ${t.status==='done'?'done':''}" onclick="toggleDone(${t.id})">${t.status==='done'?'✓':''}</button><div class="task-main"><b>${t.topic}</b><small>${t.difficulty} · ${t.progress}% progress</small></div></div>`).join('')}</div></div>`}).join('');
}
function renderCalendar(){
 const days=['MON','TUE','WED','THU','FRI','SAT','SUN'];
 document.getElementById('calendarGrid').innerHTML=days.map((d,i)=>`<div class="day ${i===1?'today':''}"><h4>${d} ${6+i}</h4>${topics.filter(t=>t.status!=='done').sort((a,b)=>priority(b)-priority(a)).slice(i%3,(i%3)+2).map(t=>`<div class="event"><b>${t.topic}</b>${t.hours}h · ${t.subject}</div>`).join('')}</div>`).join('');
}
function renderCharts(){
 if(!window.Chart)return;
 const labels=subjectData().map(x=>x.name), vals=subjectData().map(x=>x.progress);
 if(charts.bar)charts.bar.destroy();if(charts.line)charts.line.destroy();
 charts.bar=new Chart(document.getElementById('barChart'),{type:'bar',data:{labels,datasets:[{label:'Completion %',data:vals,borderRadius:7}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,max:100}}}});
 charts.line=new Chart(document.getElementById('lineChart'),{type:'line',data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],datasets:[{label:'Progress',data:[42,48,51,57,61,65,68],tension:.35,fill:false}]},options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true,max:100}}}});
}
function toggleDone(id){const t=topics.find(x=>x.id===id);if(!t)return;t.status=t.status==='done'?'pending':'done';if(t.status==='done')t.progress=100;else t.progress=Math.min(t.progress,90);t.missed=false;save();render();toast(t.status==='done'?'Task completed — progress updated!':'Task reopened.')}
function markMissed(id){const t=topics.find(x=>x.id===id);if(!t)return;t.missed=true;t.status='pending';save();toast('Task marked missed. Schedule needs adaptation.');render();autoReschedule(true)}
function autoReschedule(silent=false){topics.sort((a,b)=>priority(b)-priority(a));save();render();if(!silent)toast('Schedule rebuilt using your latest progress.')}
function showView(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active-view'));document.getElementById(v).classList.add('active-view');document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.view===v))}
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>showView(b.dataset.view));
function openModal(){document.getElementById('modal').classList.add('show')}
function closeModal(){document.getElementById('modal').classList.remove('show')}
function addTopic(e){e.preventDefault();topics.push({id:Date.now(),subject:fSubject.value,topic:fTopic.value,difficulty:fDifficulty.value,hours:Number(fHours.value),deadline:fDeadline.value,progress:0,status:'pending',missed:false});save();closeModal();e.target.reset();render();toast('Topic added and prioritized automatically.')}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.style.display='block';setTimeout(()=>el.style.display='none',2200)}
function logout(){localStorage.removeItem('studysync_user');toast('Demo logout successful.')}
render();
