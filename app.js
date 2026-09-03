const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const escapeHtml=(s="")=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const cfg=window.SEWON_CONFIG||{};
const supabaseClient=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);

let rrData=[],terms=[],notices=[],events=[],monthMeta=[];
let y=new Date().getFullYear(),m=new Date().getMonth();

const contentMap={
 topbar_text:"topbarText",hero_eyebrow:"heroEyebrow",hero_title1:"heroTitle1",hero_title2:"heroTitle2",
 hero_desc:"heroDesc",search_button:"searchButtonText",hero_tag1:"heroTag1",hero_tag2:"heroTag2",
 hero_tag3:"heroTag3",hero_tag4:"heroTag4",hero_side_eyebrow:"heroSideEyebrow",hero_side_title:"heroSideTitle",
 hero_side_desc:"heroSideDesc",stat_company_value:"statCompanyValue",stat_company_label:"statCompanyLabel",
 stat_task_value:"statTaskValue",stat_task_label:"statTaskLabel",stat_glossary_value:"statGlossaryValue",
 stat_glossary_label:"statGlossaryLabel",quick_cal_eyebrow:"quickCalEyebrow",quick_cal_title:"quickCalTitle",
 quick_cal_desc:"quickCalDesc",quick_notice_eyebrow:"quickNoticeEyebrow",quick_notice_title:"quickNoticeTitle",
 quick_notice_desc:"quickNoticeDesc",quick_rr_eyebrow:"quickRrEyebrow",quick_rr_title:"quickRrTitle",
 quick_rr_desc:"quickRrDesc",quick_gloss_eyebrow:"quickGlossEyebrow",quick_gloss_title:"quickGlossTitle",
 quick_gloss_desc:"quickGlossDesc",month_card_eyebrow:"monthCardEyebrow",month_card_title:"monthCardTitle",
 notice_card_eyebrow:"noticeCardEyebrow",notice_card_title:"noticeCardTitle",calendar_eyebrow:"calendarEyebrow",
 calendar_title:"calendarTitleText",calendar_desc:"calendarDesc",notice_eyebrow:"noticeEyebrow",
 notice_title:"noticeTitleText",notice_desc:"noticeDesc",rr_eyebrow:"rrEyebrow",rr_title:"rrTitleText",
 rr_desc:"rrDesc",glossary_eyebrow:"glossaryEyebrow",glossary_title:"glossaryTitleText",
 glossary_desc:"glossaryDesc",footer_title:"footerTitle",footer_companies:"footerCompanies"
};
const placeholderMap={
 global_search_placeholder:"globalSearch",rr_search_placeholder:"rrSearch",term_search_placeholder:"termSearch"
};
const fontVarMap={
 font_base:"--fs-base",font_nav:"--fs-nav",font_hero_title:"--fs-hero-title",font_hero_desc:"--fs-hero-desc",
 font_quick_title:"--fs-quick-title",font_section_title:"--fs-section-title",font_section_desc:"--fs-section-desc",
 font_calendar_date:"--fs-calendar-date",font_notice_title:"--fs-notice-title",font_rr_company:"--fs-rr-company",
 font_rr_primary:"--fs-rr-primary",font_rr_support:"--fs-rr-support",font_term_title:"--fs-term-title",
 font_term_body:"--fs-term-body"
};

async function loadSettings(){
 const {data}=await supabaseClient.from("internal_site_settings").select("key,value");
 (data||[]).forEach(({key,value})=>{
   if(contentMap[key]&&document.getElementById(contentMap[key]))document.getElementById(contentMap[key]).textContent=value;
   if(placeholderMap[key]&&document.getElementById(placeholderMap[key]))document.getElementById(placeholderMap[key]).placeholder=value;
   if(fontVarMap[key]){
     const n=Number(value);
     if(Number.isFinite(n)&&n>=7&&n<=80)document.documentElement.style.setProperty(fontVarMap[key],`${n}px`);
   }
 });
}

async function loadData(){
 const [n,e,r,g,mm]=await Promise.all([
  supabaseClient.from("internal_notices").select("*").eq("is_visible",true).order("is_pinned",{ascending:false}).order("notice_date",{ascending:false}).order("id",{ascending:false}),
  supabaseClient.from("internal_events").select("*").eq("is_visible",true).order("event_date",{ascending:true}).order("id",{ascending:true}),
  supabaseClient.from("internal_rr").select("*").eq("is_visible",true).order("sort_order",{ascending:true}).order("company",{ascending:true}),
  supabaseClient.from("internal_glossary").select("*").eq("is_visible",true).order("sort_order",{ascending:true}).order("term",{ascending:true}),
  supabaseClient.from("internal_month_meta").select("*").order("year").order("month")
 ]);
 notices=n.data||[];events=e.data||[];rrData=r.data||[];terms=g.data||[];monthMeta=mm.data||[];
 renderDashboard();renderCalendar();renderRR();renderTerms();renderNoticeBoard();
}

function fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}

function renderDashboard(){
 const timeline=$("#timeline");
 const monthPrefix=`${y}-${String(m+1).padStart(2,"0")}`;
 const esg=events.filter(x=>x.event_date?.startsWith(monthPrefix)&&x.category==="ESG").slice(0,3);
 timeline.innerHTML=esg.length?esg.map((x,i)=>`<div><time>${x.event_date.slice(5).replace("-",".")}</time><p><b>${escapeHtml(x.title)}</b><small>${escapeHtml(x.description||"")}</small></p><span class="tag">${escapeHtml(x.status_label||"예정")}</span></div>`).join(""):'<div><p><small>이번 달 등록된 ESG 일정이 없습니다.</small></p></div>';

 const nm=$("#noticeMini");
 nm.innerHTML=notices.slice(0,3).map(n=>`<button type="button" data-notice="${n.id}"><span>${escapeHtml(n.category||"안내")}</span><b>${escapeHtml(n.title)}</b><time>${String(n.notice_date||"").slice(5).replace("-",".")}</time></button>`).join("")||'<p class="empty">등록된 공지가 없습니다.</p>';
 nm.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{location.hash="notice";setTimeout(()=>document.querySelector(`[data-board-id="${b.dataset.notice}"]`)?.click(),350)}));
}

function renderCalendar(){
 const month=m+1;
 $("#calendarTitle").textContent=`${y}년 ${month}월`;
 $("#eventTitle").textContent=`${y}년 ${month}월 주요 일정`;
 const first=new Date(y,m,1),start=new Date(y,m,1-first.getDay());
 const today=fmt(new Date());
 let html="";
 for(let i=0;i<42;i++){
  const d=new Date(start);d.setDate(start.getDate()+i);
  const key=fmt(d),other=d.getMonth()!==m,dow=d.getDay();
  const dayEvents=events.filter(x=>x.event_date===key);
  const cal=dayEvents.find(x=>x.category==="공휴일"||x.category==="회사휴무");
  const hasEsg=dayEvents.some(x=>x.category==="ESG");
  const classes=["day",other?"other":"",cal?"holiday":"",cal?.category==="회사휴무"?"company-off":"",key===today?"today":"",dow===0?"sun-day":"",dow===6?"sat-day":""].filter(Boolean).join(" ");
  html+=`<button type="button" class="${classes}" data-date="${key}" title="${escapeHtml(cal?.title||"")}">
    <span class="date-num">${key===today?`<b>${d.getDate()}</b>`:d.getDate()}</span>
    ${key===today?'<span class="today-pill">TODAY</span>':""}
    ${cal&&!other?`<small class="holiday-name">${escapeHtml(cal.title)}</small>`:""}
    ${hasEsg?'<i class="event-dot"></i>':""}
  </button>`;
 }
 $("#calendarGrid").innerHTML=html;

 const prefix=`${y}-${String(month).padStart(2,"0")}`;
 const monthEvents=events.filter(x=>x.event_date?.startsWith(prefix));
 $("#eventCount").textContent=`${monthEvents.length}건`;
 const meta=monthMeta.find(x=>Number(x.year)===y&&Number(x.month)===month);
 $("#workdayCount").textContent=meta?.workdays ?? "-";
 $("#holidayCount").textContent=new Set(monthEvents.filter(x=>x.category==="공휴일"||x.category==="회사휴무").map(x=>x.event_date)).size;
 $("#eventList").innerHTML=monthEvents.length?monthEvents.map(x=>`
 <div class="event-row ${x.category==="ESG"?"esg":x.category==="공휴일"?"public-holiday":"company-holiday"}">
  <div class="event-date">${x.event_date.slice(5).replace("-",".")}</div>
  <div><b>${escapeHtml(x.title)}</b><small>${escapeHtml(x.category)}${x.description?` · ${escapeHtml(x.description)}`:""}</small></div>
 </div>`).join(""):`<div class="event-empty"><span>▣</span><b>등록된 일정이 없습니다.</b><small>다른 월을 선택해 주세요.</small></div>`;
}

function renderNoticeBoard(){
 const box=$("#noticeBoard");if(!box)return;
 box.innerHTML=`<div class="board-dynamic">
  <div class="board-row header"><span>번호</span><span>구분</span><span>제목</span><span>등록일</span><span></span></div>
  ${notices.map((n,i)=>`<div class="board-item">
   <div class="board-row">
    <span class="no">${n.is_pinned?"공지":notices.length-i}</span><span class="cat">${escapeHtml(n.category||"안내")}</span>
    <button type="button" class="title" data-board-id="${n.id}">${escapeHtml(n.title)}</button>
    <time>${escapeHtml(String(n.notice_date||""))}</time><span class="chev">⌄</span>
   </div>
   <div class="board-detail">${escapeHtml(n.content||"").replace(/\n/g,"<br>")}</div>
  </div>`).join("")}
 </div>`;
 box.querySelectorAll(".board-row .title").forEach(btn=>btn.addEventListener("click",()=>btn.closest(".board-item").classList.toggle("open")));
}

function renderRR(filter="전체",q=""){
 const query=q.toLowerCase();
 const list=rrData.filter(x=>(filter==="전체"||x.task===filter)&&(`${x.task} ${x.full_name||""} ${x.company} ${x.primary_contact||""} ${x.support_contact||""} ${x.coordinator||""}`.toLowerCase().includes(query)));
 const grouped={};list.forEach(x=>{(grouped[x.task]??=[]).push(x)});
 $("#rrGrid").innerHTML=Object.entries(grouped).map(([task,items])=>`
 <section class="rr-task-group">
  <div class="rr-task-head"><div><span>${escapeHtml(task)}</span><strong>${escapeHtml(items[0]?.full_name||"")}</strong></div>${items.some(x=>x.coordinator)?`<em>그룹 취합·조율 담당 포함</em>`:""}</div>
  <div class="rr-company-grid">${items.map(x=>`
   <article class="rr-card"><h3 class="rr-company">${escapeHtml(x.company)}</h3>
    <div class="rr-role-row rr-primary-row"><span class="rr-role-label primary-label">정</span><div class="rr-role-copy"><small>업무 주관</small><p class="rr-role-text primary">${escapeHtml(x.primary_contact||"-")}</p></div></div>
    <div class="rr-role-row rr-support-row"><span class="rr-role-label">부</span><div class="rr-role-copy"><small>자료·인터뷰 대응</small><p class="rr-role-text">${escapeHtml(x.support_contact||"-")}</p></div></div>
    ${x.coordinator?`<div class="rr-role-row coord"><span class="rr-role-label coord-label">총괄</span><div class="rr-role-copy"><small>계열사 취합·조율</small><p class="rr-role-text">${escapeHtml(x.coordinator)}</p></div></div>`:""}
   </article>`).join("")}
  </div>
 </section>`).join("")||'<div class="rr-empty">검색 결과가 없습니다.</div>';
}

function renderTerms(){
 const q=($("#termSearch")?.value||"").toLowerCase(),c=$("#termCategory")?.value||"전체";
 const list=terms.filter(x=>(c==="전체"||x.category===c)&&(`${x.term} ${x.eng||""} ${x.definition||""} ${x.usage||""}`.toLowerCase().includes(q)));
 $("#termGrid").innerHTML=list.map(x=>`<article class="term-card"><span>${escapeHtml(x.category)}</span><h3>${escapeHtml(x.term)} <small>${escapeHtml(x.eng||"")}</small></h3><p>${escapeHtml(x.definition||"")}</p><div class="usage">활용: ${escapeHtml(x.usage||"")}</div></article>`).join("");
}

function scrollToSection(id){
 const el=document.getElementById(id);if(!el)return;
 const offset=window.innerWidth<=760?72:76;
 window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-offset,behavior:"smooth"});
 history.replaceState(null,"",`#${id}`);
}
function initScrollSpy(){
 const ids=["home","calendar","notice","rr","glossary"],links=$$(".nav a[data-target]");
 let lastY=window.scrollY,active="home";
 const setActive=id=>{active=id;links.forEach(a=>a.classList.toggle("active",a.dataset.target===id))};
 const visible=(el,off)=>{const r=el.getBoundingClientRect();return Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(r.top,off))};
 const update=()=>{const now=scrollY,down=now>=lastY,off=innerWidth<=760?74:78;let cur=active;
  if(down){cur="home";ids.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=off+46)cur=id})}
  else{let best=active,bv=-1;ids.forEach(id=>{const el=document.getElementById(id);if(el){const v=visible(el,off);if(v>bv){bv=v;best=id}}});const av=visible(document.getElementById(active),off);if(best===active||bv>=av+70||av<90)cur=best}
  if(innerHeight+now>=document.documentElement.scrollHeight-25)cur="glossary";if(cur!==active)setActive(cur);lastY=now};
 let tick=false;addEventListener("scroll",()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{update();tick=false})},{passive:true});addEventListener("resize",update);setTimeout(update,80);
}

$("#prevMonth")?.addEventListener("click",()=>{m--;if(m<0){m=11;y--}renderCalendar()});
$("#nextMonth")?.addEventListener("click",()=>{m++;if(m>11){m=0;y++}renderCalendar()});
$("#todayBtn")?.addEventListener("click",()=>{const d=new Date();y=d.getFullYear();m=d.getMonth();renderCalendar()});
$("#rrSearch")?.addEventListener("input",()=>renderRR($(".rr-chips button.active")?.dataset.filter||"전체",$("#rrSearch").value));
$$(".rr-chips button").forEach(b=>b.addEventListener("click",()=>{$$(".rr-chips button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderRR(b.dataset.filter,$("#rrSearch")?.value||"")}));
$("#termSearch")?.addEventListener("input",renderTerms);$("#termCategory")?.addEventListener("change",renderTerms);
$$(".chips button").forEach(b=>b.addEventListener("click",()=>{$("#termSearch").value=b.textContent;renderTerms()}));
$("#searchBtn")?.addEventListener("click",()=>{const q=$("#globalSearch")?.value.trim();if(!q)return;$("#rrSearch").value=q;renderRR("전체",q);if($("#rrGrid").textContent.trim()!=="검색 결과가 없습니다.")return scrollToSection("rr");$("#termSearch").value=q;renderTerms();scrollToSection("glossary")});
$$(".js-section-link").forEach(a=>a.addEventListener("click",e=>{const id=a.dataset.scrollTarget||a.dataset.target;if(id){e.preventDefault();scrollToSection(id)}}));

(async()=>{await loadSettings();await loadData();initScrollSpy()})();