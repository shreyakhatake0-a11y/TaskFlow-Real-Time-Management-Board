const seedTasks=[
 {id:1,title:"Design project dashboard",description:"Create a clean and responsive dashboard layout.",priority:"High",assignee:"Shreya",status:"todo"},
 {id:2,title:"Build task creation form",description:"Implement task creation with validation.",priority:"Medium",assignee:"Aarav",status:"progress"},
 {id:3,title:"Prepare project documentation",description:"Add setup instructions and feature documentation.",priority:"Low",assignee:"Shreya",status:"done"}
];
let tasks=JSON.parse(localStorage.getItem("taskflow_tasks"))||seedTasks;
const $=id=>document.getElementById(id);

function save(){localStorage.setItem("taskflow_tasks",JSON.stringify(tasks));render();}
function render(){
  ["todo","progress","done"].forEach(s=>{
    const list=$(s); const filtered=tasks.filter(t=>t.status===s);
    list.innerHTML=filtered.length?filtered.map(taskCard).join('<div></div>'):'<div class="empty">No tasks here</div>';
    $(s+"Badge").textContent=filtered.length;
  });
  $("totalCount").textContent=tasks.length;
  $("todoCount").textContent=tasks.filter(t=>t.status==="todo").length;
  $("progressCount").textContent=tasks.filter(t=>t.status==="progress").length;
  $("doneCount").textContent=tasks.filter(t=>t.status==="done").length;
}
function taskCard(t){
 const next=t.status==="todo"?"progress":t.status==="progress"?"done":"todo";
 const nextLabel=t.status==="todo"?"Start":t.status==="progress"?"Complete":"Reopen";
 return `<article class="task">
   <h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.description||"No description")}</p>
   <div class="meta"><span class="priority ${t.priority.toLowerCase()}">${t.priority}</span><span>👤 ${escapeHtml(t.assignee||"Unassigned")}</span></div>
   <div class="actions"><button onclick="moveTask(${t.id},'${next}')">${nextLabel}</button><button onclick="deleteTask(${t.id})">Delete</button></div>
 </article>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
function moveTask(id,status){const t=tasks.find(x=>x.id===id);if(t){t.status=status;save();}}
function deleteTask(id){if(confirm("Delete this task?")){tasks=tasks.filter(t=>t.id!==id);save();}}
$("addTaskBtn").onclick=()=>$("modal").classList.remove("hidden");
$("closeBtn").onclick=()=>$("modal").classList.add("hidden");
$("modal").onclick=e=>{if(e.target.id==="modal")$("modal").classList.add("hidden")};
$("taskForm").onsubmit=e=>{
 e.preventDefault();
 tasks.push({id:Date.now(),title:$("title").value.trim(),description:$("description").value.trim(),priority:$("priority").value,assignee:$("assignee").value.trim()||"Unassigned",status:"todo"});
 e.target.reset();$("modal").classList.add("hidden");save();
};
render();
