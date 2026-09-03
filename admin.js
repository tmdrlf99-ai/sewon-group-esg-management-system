const cfg=window.SEWON_CONFIG||{};
const sb=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=(s="")=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const settingDefs=[["기본 문구", "topbar_text", "상단 시스템명", "text"], ["기본 문구", "hero_eyebrow", "메인 영문 상단문구", "text"], ["기본 문구", "hero_title1", "메인 제목 1줄", "text"], ["기본 문구", "hero_title2", "메인 제목 2줄", "text"], ["기본 문구", "hero_desc", "메인 설명", "textarea"], ["기본 문구", "global_search_placeholder", "통합검색 안내문구", "text"], ["기본 문구", "search_button", "통합검색 버튼", "text"], ["기본 문구", "hero_tag1", "메인 태그1", "text"], ["기본 문구", "hero_tag2", "메인 태그2", "text"], ["기본 문구", "hero_tag3", "메인 태그3", "text"], ["기본 문구", "hero_tag4", "메인 태그4", "text"], ["메인 우측", "hero_side_eyebrow", "상단문구", "text"], ["메인 우측", "hero_side_title", "제목", "text"], ["메인 우측", "hero_side_desc", "설명", "textarea"], ["메인 우측", "stat_company_value", "계열사 수", "text"], ["메인 우측", "stat_company_label", "계열사 라벨", "text"], ["메인 우측", "stat_task_value", "업무 수", "text"], ["메인 우측", "stat_task_label", "업무 라벨", "text"], ["메인 우측", "stat_glossary_value", "용어 수", "text"], ["메인 우측", "stat_glossary_label", "용어 라벨", "text"], ["바로가기", "quick_cal_eyebrow", "일정 상단문구", "text"], ["바로가기", "quick_cal_title", "일정 제목", "text"], ["바로가기", "quick_cal_desc", "일정 설명", "text"], ["바로가기", "quick_notice_eyebrow", "공지 상단문구", "text"], ["바로가기", "quick_notice_title", "공지 제목", "text"], ["바로가기", "quick_notice_desc", "공지 설명", "text"], ["바로가기", "quick_rr_eyebrow", "R&R 상단문구", "text"], ["바로가기", "quick_rr_title", "R&R 제목", "text"], ["바로가기", "quick_rr_desc", "R&R 설명", "text"], ["바로가기", "quick_gloss_eyebrow", "용어 상단문구", "text"], ["바로가기", "quick_gloss_title", "용어 제목", "text"], ["바로가기", "quick_gloss_desc", "용어 설명", "text"], ["섹션", "month_card_eyebrow", "이번달 카드 상단문구", "text"], ["섹션", "month_card_title", "이번달 카드 제목", "text"], ["섹션", "notice_card_eyebrow", "최근공지 카드 상단문구", "text"], ["섹션", "notice_card_title", "최근공지 카드 제목", "text"], ["섹션", "calendar_eyebrow", "일정 영문 상단문구", "text"], ["섹션", "calendar_title", "일정 제목", "text"], ["섹션", "calendar_desc", "일정 설명", "textarea"], ["섹션", "notice_eyebrow", "공지 영문 상단문구", "text"], ["섹션", "notice_title", "공지 제목", "text"], ["섹션", "notice_desc", "공지 설명", "textarea"], ["섹션", "rr_eyebrow", "R&R 영문 상단문구", "text"], ["섹션", "rr_title", "R&R 제목", "text"], ["섹션", "rr_desc", "R&R 설명", "textarea"], ["섹션", "rr_search_placeholder", "R&R 검색 안내", "text"], ["섹션", "glossary_eyebrow", "용어 영문 상단문구", "text"], ["섹션", "glossary_title", "용어 제목", "text"], ["섹션", "glossary_desc", "용어 설명", "textarea"], ["섹션", "term_search_placeholder", "용어 검색 안내", "text"], ["하단", "footer_title", "하단 시스템명", "text"], ["하단", "footer_companies", "하단 회사명", "text"]];
const fontDefs=[["font_base", "전체 기본 글자", 16], ["font_nav", "좌측 메뉴", 14], ["font_hero_title", "메인 제목", 44], ["font_hero_desc", "메인 설명", 14], ["font_quick_title", "바로가기 제목", 15], ["font_section_title", "섹션 제목", 25], ["font_section_desc", "섹션 설명", 13.5], ["font_calendar_date", "달력 날짜", 12], ["font_notice_title", "공지 제목", 12.5], ["font_rr_company", "R&R 회사명", 17], ["font_rr_primary", "R&R 정 담당", 13.5], ["font_rr_support", "R&R 부 담당", 13], ["font_term_title", "ESG 용어명", 17], ["font_term_body", "ESG 용어 설명", 12]];
let allEvents=[],allNotices=[],allRR=[],allGloss=[],allSettings={},allMonthMeta=[];

async function checkSession(){
 const {data}=await sb.auth.getSession();
 if(data.session)showApp(); else $("#loginView").hidden=false;
}
async function login(){
 $("#loginMsg").textContent="";
 const {error}=await sb.auth.signInWithPassword({email:$("#loginEmail").value.trim(),password:$("#loginPassword").value});
 if(error)return $("#loginMsg").textContent=error.message;
 showApp();
}
async function showApp(){$("#loginView").hidden=true;$("#adminApp").hidden=false;await loadAll()}
async function logout(){await sb.auth.signOut();location.reload()}

async function loadAll(){
 const [e,n,r,g,s,mm]=await Promise.all([
  sb.from("internal_events").select("*").order("event_date").order("id"),
  sb.from("internal_notices").select("*").order("is_pinned",{ascending:false}).order("notice_date",{ascending:false}).order("id",{ascending:false}),
  sb.from("internal_rr").select("*").order("sort_order").order("company"),
  sb.from("internal_glossary").select("*").order("sort_order").order("term"),
  sb.from("internal_site_settings").select("*"),
  sb.from("internal_month_meta").select("*").order("year").order("month")
 ]);
 allEvents=e.data||[];allNotices=n.data||[];allRR=r.data||[];allGloss=g.data||[];allSettings=Object.fromEntries((s.data||[]).map(x=>[x.key,x.value]));allMonthMeta=mm.data||[];
 renderAll();
}
function renderAll(){renderSummary();renderEvents();renderNotices();renderRR();renderGloss();renderSettings();renderMonthMeta()}
function renderSummary(){$("#summaryGrid").innerHTML=[
 ["일정",allEvents.length],["공지",allNotices.length],["R&R",allRR.length],["ESG 용어",allGloss.length]
].map(x=>`<div><strong>${x[1]}</strong><span>${x[0]}</span></div>`).join("")}

function flags(v,p=false){return `<div class="flags">${p?'<span class="flag">상단고정</span>':""}<span class="flag ${v===false?"off":""}">${v===false?"비공개":"공개"}</span></div>`}
function actions(type,id){return `<div class="list-actions"><button onclick="edit${type}(${id})">수정</button><button class="delete" onclick="del${type}(${id})">삭제</button></div>`}

function renderEvents(){
 const q=($("#eventSearch")?.value||"").toLowerCase(),list=allEvents.filter(x=>!q||`${x.event_date} ${x.category} ${x.title} ${x.description||""}`.toLowerCase().includes(q));
 $("#eventListAdmin").innerHTML=list.map(x=>`<div class="list-item"><div>${flags(x.is_visible)}<b>${esc(x.event_date)} · ${esc(x.title)}</b><small>${esc(x.category)}${x.description?" · "+esc(x.description):""}</small></div>${actions("Event",x.id)}</div>`).join("");
}
window.editEvent=id=>{const x=allEvents.find(v=>v.id===id);eventId.value=x.id;eventDate.value=x.event_date;eventCategory.value=x.category;eventTitle.value=x.title;eventDesc.value=x.description||"";eventStatus.value=x.status_label||"";eventVisible.checked=x.is_visible!==false}
window.delEvent=async id=>{if(!confirm("일정을 삭제하시겠습니까?"))return;await sb.from("internal_events").delete().eq("id",id);await loadAll()}
async function saveEvent(e){e.preventDefault();const id=eventId.value,p={event_date:eventDate.value,category:eventCategory.value,title:eventTitle.value.trim(),description:eventDesc.value.trim(),status_label:eventStatus.value.trim(),is_visible:eventVisible.checked,updated_at:new Date().toISOString()};const r=id?await sb.from("internal_events").update(p).eq("id",id):await sb.from("internal_events").insert(p);if(r.error)alert(r.error.message);else{resetEvent();await loadAll()}}
function resetEvent(){eventForm.reset();eventId.value="";eventVisible.checked=true;eventCategory.value="ESG";eventDate.value=new Date().toISOString().slice(0,10)}

function renderNotices(){
 const q=($("#noticeSearch")?.value||"").toLowerCase(),list=allNotices.filter(x=>!q||`${x.category} ${x.title} ${x.content}`.toLowerCase().includes(q));
 $("#noticeListAdmin").innerHTML=list.map(x=>`<div class="list-item"><div>${flags(x.is_visible,x.is_pinned)}<b>${esc(x.title)}</b><small>${esc(x.notice_date)} · ${esc(x.category)} · ${esc(x.content).slice(0,90)}</small></div>${actions("Notice",x.id)}</div>`).join("");
}
window.editNotice=id=>{const x=allNotices.find(v=>v.id===id);noticeId.value=x.id;noticeCategory.value=x.category||"안내";noticeDate.value=x.notice_date;noticeTitle.value=x.title;noticeContent.value=x.content||"";noticePinned.checked=!!x.is_pinned;noticeVisible.checked=x.is_visible!==false}
window.delNotice=async id=>{if(!confirm("공지를 삭제하시겠습니까?"))return;await sb.from("internal_notices").delete().eq("id",id);await loadAll()}
async function saveNotice(e){e.preventDefault();const id=noticeId.value,p={category:noticeCategory.value.trim(),notice_date:noticeDate.value,title:noticeTitle.value.trim(),content:noticeContent.value.trim(),is_pinned:noticePinned.checked,is_visible:noticeVisible.checked,updated_at:new Date().toISOString()};const r=id?await sb.from("internal_notices").update(p).eq("id",id):await sb.from("internal_notices").insert(p);if(r.error)alert(r.error.message);else{resetNotice();await loadAll()}}
function resetNotice(){noticeForm.reset();noticeId.value="";noticeVisible.checked=true;noticeDate.value=new Date().toISOString().slice(0,10)}

function renderRR(){
 const q=($("#rrSearchAdmin")?.value||"").toLowerCase(),list=allRR.filter(x=>!q||`${x.task} ${x.company} ${x.primary_contact||""} ${x.support_contact||""}`.toLowerCase().includes(q));
 $("#rrListAdmin").innerHTML=list.map(x=>`<div class="list-item"><div>${flags(x.is_visible)}<b>${esc(x.task)} · ${esc(x.company)}</b><small>정: ${esc(x.primary_contact||"-")} / 부: ${esc(x.support_contact||"-")}</small></div>${actions("RR",x.id)}</div>`).join("");
}
window.editRR=id=>{const x=allRR.find(v=>v.id===id);rrId.value=x.id;rrTask.value=x.task;rrFull.value=x.full_name||"";rrCompany.value=x.company;rrPrimary.value=x.primary_contact||"";rrSupport.value=x.support_contact||"";rrCoord.value=x.coordinator||"";rrSort.value=x.sort_order||100;rrVisible.checked=x.is_visible!==false}
window.delRR=async id=>{if(!confirm("R&R 항목을 삭제하시겠습니까?"))return;await sb.from("internal_rr").delete().eq("id",id);await loadAll()}
async function saveRR(e){e.preventDefault();const id=rrId.value,p={task:rrTask.value.trim(),full_name:rrFull.value.trim(),company:rrCompany.value.trim(),primary_contact:rrPrimary.value.trim(),support_contact:rrSupport.value.trim(),coordinator:rrCoord.value.trim(),sort_order:Number(rrSort.value)||100,is_visible:rrVisible.checked,updated_at:new Date().toISOString()};const r=id?await sb.from("internal_rr").update(p).eq("id",id):await sb.from("internal_rr").insert(p);if(r.error)alert(r.error.message);else{resetRR();await loadAll()}}
function resetRR(){rrForm.reset();rrId.value="";rrVisible.checked=true;rrSort.value=100}

function renderGloss(){
 const q=($("#glossSearchAdmin")?.value||"").toLowerCase(),list=allGloss.filter(x=>!q||`${x.term} ${x.eng||""} ${x.category} ${x.definition}`.toLowerCase().includes(q));
 $("#glossListAdmin").innerHTML=list.map(x=>`<div class="list-item"><div>${flags(x.is_visible)}<b>${esc(x.term)} ${x.eng?"("+esc(x.eng)+")":""}</b><small>${esc(x.category)} · ${esc(x.definition).slice(0,90)}</small></div>${actions("Gloss",x.id)}</div>`).join("");
}
window.editGloss=id=>{const x=allGloss.find(v=>v.id===id);glossId.value=x.id;glossTerm.value=x.term;glossEng.value=x.eng||"";glossCategory.value=x.category;glossDef.value=x.definition||"";glossUsage.value=x.usage||"";glossSort.value=x.sort_order||100;glossVisible.checked=x.is_visible!==false}
window.delGloss=async id=>{if(!confirm("ESG 용어를 삭제하시겠습니까?"))return;await sb.from("internal_glossary").delete().eq("id",id);await loadAll()}
async function saveGloss(e){e.preventDefault();const id=glossId.value,p={term:glossTerm.value.trim(),eng:glossEng.value.trim(),category:glossCategory.value.trim(),definition:glossDef.value.trim(),usage:glossUsage.value.trim(),sort_order:Number(glossSort.value)||100,is_visible:glossVisible.checked,updated_at:new Date().toISOString()};const r=id?await sb.from("internal_glossary").update(p).eq("id",id):await sb.from("internal_glossary").insert(p);if(r.error)alert(r.error.message);else{resetGloss();await loadAll()}}
function resetGloss(){glossForm.reset();glossId.value="";glossVisible.checked=true;glossSort.value=100}

function renderMonthMeta(){
 const year=2026;$("#monthMetaGrid").innerHTML=Array.from({length:12},(_,i)=>{const mm=allMonthMeta.find(x=>x.year===year&&x.month===i+1);return `<div><label>${i+1}월</label><input type="number" data-month="${i+1}" value="${mm?.workdays??""}"/></div>`}).join("");
}
async function saveMeta(){
 const rows=$$("#monthMetaGrid input").map(i=>({year:2026,month:Number(i.dataset.month),workdays:Number(i.value)||0,updated_at:new Date().toISOString()}));
 const {error}=await sb.from("internal_month_meta").upsert(rows,{onConflict:"year,month"});if(error)alert(error.message);else await loadAll();
}

function renderSettings(){
 const groups={};
 settingDefs.forEach(x=>{(groups[x[0]]??=[]).push(x)});
 let html=Object.entries(groups).map(([g,defs])=>`<div class="settings-group"><h3>${g}</h3><div class="settings-grid">${defs.map(d=>`<div class="setting-field"><label>${d[2]}</label>${d[3]==="textarea"?`<textarea data-key="${d[1]}">${esc(allSettings[d[1]]||"")}</textarea>`:`<input data-key="${d[1]}" value="${esc(allSettings[d[1]]||"")}"/>`}</div>`).join("")}</div></div>`).join("");
 html+=`<div class="settings-group"><h3>글자 크기 (px)</h3><div class="font-grid">${fontDefs.map(d=>`<div class="setting-field"><label>${d[1]}</label><input type="number" min="7" max="80" step="0.5" data-key="${d[0]}" value="${esc(allSettings[d[0]]??d[2])}"/></div>`).join("")}</div></div>`;
 $("#settingsFields").innerHTML=html;
}
async function saveSettings(e){e.preventDefault();const rows=$$("#settingsFields [data-key]").map(el=>({key:el.dataset.key,value:el.value,updated_at:new Date().toISOString()}));const {error}=await sb.from("internal_site_settings").upsert(rows,{onConflict:"key"});settingsMsg.textContent=error?error.message:"저장되었습니다.";if(!error)await loadAll()}

$$(".admin-side nav button").forEach(btn=>btn.addEventListener("click",()=>{$$(".admin-side nav button").forEach(x=>x.classList.remove("active"));$$(".admin-section").forEach(x=>x.classList.remove("active"));btn.classList.add("active");$("#"+btn.dataset.target).classList.add("active")}));
loginBtn.addEventListener("click",login);logoutBtn.addEventListener("click",logout);
eventForm.addEventListener("submit",saveEvent);eventReset.addEventListener("click",resetEvent);eventSearch.addEventListener("input",renderEvents);
noticeForm.addEventListener("submit",saveNotice);noticeReset.addEventListener("click",resetNotice);noticeSearch.addEventListener("input",renderNotices);
rrForm.addEventListener("submit",saveRR);rrReset.addEventListener("click",resetRR);rrSearchAdmin.addEventListener("input",renderRR);
glossForm.addEventListener("submit",saveGloss);glossReset.addEventListener("click",resetGloss);glossSearchAdmin.addEventListener("input",renderGloss);
saveMonthMeta.addEventListener("click",saveMeta);settingsForm.addEventListener("submit",saveSettings);
resetEvent();resetNotice();resetRR();resetGloss();checkSession();