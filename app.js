if ("scrollRestoration" in history) history.scrollRestoration = "manual";
const cfg = window.SEWON_CONFIG;
const supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);

const escapeHtml = (s="") => String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function scrollToSection(targetId){
  const el=document.getElementById(targetId);
  if(!el)return;
  const topbar=document.querySelector(".topbar");
  const offset=(topbar?.offsetHeight||66)+16;
  const y=el.getBoundingClientRect().top+window.scrollY-offset;
  window.scrollTo({top:y,behavior:"smooth"});
  history.replaceState(null,"",`#${targetId}`);
}
const FAQ_CATEGORY_ORDER=["공통","환경","노동인권","안전보건","윤리","공급망","시스템","기타"];
let allFaqs=[], faqVisibleCount=8;

let allEvents=[], calendarMonth=new Date(2026,8,1), selectedDate="";

/* 2026 세원그룹 WORK CALENDAR 기준 휴일/휴무일 */
const SEWON_2026_HOLIDAYS = {
  "2026-01-01":"신정",
  "2026-01-02":"신정휴무",
  "2026-02-16":"설날휴무",
  "2026-02-17":"설날",
  "2026-02-18":"설날휴무",
  "2026-02-19":"설날휴무",
  "2026-03-01":"삼일절",
  "2026-03-02":"휴일중복",
  "2026-05-01":"노동절",
  "2026-05-05":"어린이날",
  "2026-05-24":"석가탄신일",
  "2026-05-25":"휴일중복",
  "2026-06-03":"전국동시지방선거",
  "2026-06-06":"현충일",
  "2026-08-03":"하기휴무",
  "2026-08-04":"하기휴무",
  "2026-08-05":"하기휴무",
  "2026-08-06":"하기휴무",
  "2026-08-07":"하기휴무",
  "2026-08-15":"광복절",
  "2026-08-17":"휴일중복",
  "2026-09-24":"추석휴무",
  "2026-09-25":"추석",
  "2026-09-26":"추석휴무",
  "2026-09-27":"추석휴무",
  "2026-09-28":"휴일중복",
  "2026-10-03":"개천절",
  "2026-10-05":"휴일중복",
  "2026-10-09":"한글날",
  "2026-12-25":"기독탄신일"
};

let allTerms=[], glossaryVisibleCount=12;
const GLOSSARY_PAGE_SIZE=12;

function sortFaqs(list){return [...list].sort((a,b)=>{
  const ca=FAQ_CATEGORY_ORDER.indexOf(a.category), cb=FAQ_CATEGORY_ORDER.indexOf(b.category);
  const ia=ca<0?999:ca, ib=cb<0?999:cb;
  if(ia!==ib) return ia-ib;
  const na=Number(a.question_no)||999999, nb=Number(b.question_no)||999999;
  return na!==nb?na-nb:Number(a.id)-Number(b.id);
});}

let allNotices=[], noticeVisibleCount=5;

async function loadNotices(){
  const box=document.getElementById("noticeList"); if(!box)return;
  box.innerHTML='<div class="notice-board-loading">공지사항을 불러오는 중입니다...</div>';

  const {data,error}=await supabaseClient
    .from("notices")
    .select("id,category,title,content,notice_date,is_pinned,created_at")
    .eq("is_visible",true)
    .order("is_pinned",{ascending:false})
    .order("notice_date",{ascending:false})
    .order("id",{ascending:false});

  if(error){
    console.warn("notices load failed",error);
    box.innerHTML='<div class="notice-board-empty">공지사항을 불러오지 못했습니다.</div>';
    return;
  }
  allNotices=data||[];
  renderNotices();
}

function renderNotices(){
  const box=document.getElementById("noticeList"); if(!box)return;
  if(!allNotices.length){
    box.innerHTML='<div class="notice-board-empty">등록된 공지사항이 없습니다.</div>';
    return;
  }

  const visible=allNotices.slice(0,noticeVisibleCount);
  const rows=visible.map((n,idx)=>{
    const date=n.notice_date||String(n.created_at||"").slice(0,10);
    return `
      <div class="notice-board-item ${n.is_pinned?"pinned":""}">
        <button type="button" class="notice-board-row" data-notice-id="${n.id}" aria-expanded="false">
          <span class="notice-board-no">${n.is_pinned?"공지":allNotices.length-idx}</span>
          <span class="notice-board-category">${escapeHtml(n.category||"안내")}</span>
          <span class="notice-board-title">${n.is_pinned?'<b class="pin-mark">중요</b>':""}${escapeHtml(n.title||"")}</span>
          <time>${escapeHtml(date)}</time>
          <span class="notice-chevron">⌄</span>
        </button>
        <div class="notice-board-content" id="notice-content-${n.id}" hidden>
          ${escapeHtml(n.content||"").replace(/\n/g,"<br>")}
        </div>
      </div>`;
  }).join("");

  box.innerHTML=`
    <div class="notice-board">
      <div class="notice-board-head">
        <span>번호</span><span>구분</span><span>제목</span><span>등록일</span><span></span>
      </div>
      ${rows}
    </div>
    ${allNotices.length>noticeVisibleCount?`<div class="notice-more-wrap"><button id="noticeMoreBtn" type="button">공지 더보기 (${Math.min(noticeVisibleCount,allNotices.length)}/${allNotices.length})</button></div>`:""}`;

  box.querySelectorAll(".notice-board-row").forEach(btn=>btn.addEventListener("click",()=>{
    const id=btn.dataset.noticeId;
    const content=document.getElementById(`notice-content-${id}`);
    if(!content)return;
    const opened=!content.hidden;
    content.hidden=opened;
    btn.setAttribute("aria-expanded",String(!opened));
    btn.closest(".notice-board-item")?.classList.toggle("open",!opened);
  }));

  document.getElementById("noticeMoreBtn")?.addEventListener("click",()=>{
    noticeVisibleCount+=5;
    renderNotices();
  });
}

async function loadFaqs(){
  const box=document.getElementById("faqList"); if(!box)return;
  box.innerHTML='<p class="msg">FAQ를 불러오는 중입니다...</p>';
  const {data,error}=await supabaseClient.from("faqs").select("id,category,question_no,question,answer,created_at").eq("is_visible",true);
  if(error){console.error(error);box.innerHTML='<p class="error">FAQ를 불러오지 못했습니다.</p>';return;}
  allFaqs=sortFaqs(data||[]); renderFaqs();
}
function getFilteredFaqs(){
  const keyword=(document.getElementById("searchInput")?.value||"").trim().toLowerCase();
  const category=document.getElementById("categoryFilter")?.value||"";
  return sortFaqs(allFaqs.filter(f=>{
    const hay=`${f.category||""} ${f.question_no||""} ${f.question||""} ${f.answer||""}`.toLowerCase();
    return (!keyword||hay.includes(keyword))&&(!category||f.category===category);
  }));
}
function renderFaqs(){
  const box=document.getElementById("faqList"); if(!box)return;
  const list=getFilteredFaqs(); if(!list.length){box.innerHTML='<div class="faq-item">검색 결과가 없습니다.</div>';return;}
  let html="", prev="";
  list.slice(0,faqVisibleCount).forEach(f=>{
    if(f.category!==prev){html+=`<div class="faq-category-title">${escapeHtml(f.category||"기타")}</div>`;prev=f.category;}
    html+=`<div class="faq-item"><div class="faq-meta"><span class="badge">${escapeHtml(f.category||"기타")}</span></div><div class="faq-q">Q. ${escapeHtml(f.question)}</div><div class="faq-a">A. ${escapeHtml(f.answer)}</div></div>`;
  });
  if(list.length>faqVisibleCount) html+=`<div class="more-wrap"><button id="faqMoreBtn" class="more-btn" type="button">더보기 (${faqVisibleCount}/${list.length})</button></div>`;
  box.innerHTML=html;
  document.getElementById("faqMoreBtn")?.addEventListener("click",()=>{faqVisibleCount+=8;renderFaqs();});
}

async function loadEvents(){
  const {data,error}=await supabaseClient.from("esg_events").select("*").eq("is_visible",true).order("event_date",{ascending:true});
  if(error){console.warn("esg_events load failed",error);allEvents=[];} else allEvents=data||[];
  renderUpcoming(); renderCalendar();
}
function renderUpcoming(){
  const box=document.getElementById("upcomingSchedule"); if(!box)return;
  const m=calendarMonth.getMonth()+1, y=calendarMonth.getFullYear();
  document.getElementById("currentMonthLabel").textContent=`${y}.${String(m).padStart(2,"0")}`;
  const monthEvents=allEvents.filter(e=>String(e.event_date||"").startsWith(`${y}-${String(m).padStart(2,"0")}`)).slice(0,3);
  box.innerHTML=monthEvents.length?monthEvents.map(e=>{
    const d=String(e.event_date).slice(-2);
    return `<div class="upcoming-item"><span class="upcoming-day">${d}</span><div><b>${escapeHtml(e.title||"")}</b><small>${escapeHtml(e.description||"")}</small></div><span class="event-tag">${escapeHtml(e.category||"일정")}</span></div>`;
  }).join(""):'<p class="msg">이번 달 등록된 일정이 없습니다.</p>';
}
function renderCalendar(){
  const grid=document.getElementById("calendarGrid"), listBox=document.getElementById("calendarEventList");
  if(!grid||!listBox)return;

  const y=calendarMonth.getFullYear(), m=calendarMonth.getMonth();
  const now=new Date();
  const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  document.getElementById("calendarMonthTitle").textContent=`${y}년 ${m+1}월`;

  const days=["일","월","화","수","목","금","토"];
  let html=days.map((d,i)=>`<div class="calendar-weekday ${i===0?"sun":i===6?"sat":""}">${d}</div>`).join("");

  const first=new Date(y,m,1), start=new Date(y,m,1-first.getDay());

  for(let i=0;i<42;i++){
    const dt=new Date(start);
    dt.setDate(start.getDate()+i);
    const ds=`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
    const dayEvents=allEvents.filter(e=>e.event_date===ds);
    const has=dayEvents.length>0;
    const isToday=ds===today;
    const isSelected=selectedDate===ds;
    const dow=dt.getDay();
    const holidayName=SEWON_2026_HOLIDAYS[ds]||"";
    const isHoliday=!!holidayName;

    const eventDots=dayEvents.slice(0,3).map(()=>`<i class="event-dot"></i>`).join("");
    const extra=dayEvents.length>3?`<small class="event-more">+${dayEvents.length-3}</small>`:"";

    html+=`
      <button type="button"
        class="calendar-day ${dt.getMonth()!==m?"other":""} ${has?"has-event":""} ${isToday?"today":""} ${isSelected?"selected":""} ${isHoliday?"holiday":""} ${dow===0?"sun":dow===6?"sat":""}"
        data-date="${ds}" aria-label="${ds}${holidayName?`, ${holidayName}`:""}${has?`, 일정 ${dayEvents.length}건`:""}"
        title="${holidayName?escapeHtml(holidayName):""}">
        <span class="calendar-date-num">${dt.getDate()}</span>
        ${isToday?'<span class="today-label">TODAY</span>':""}
        ${isHoliday && dt.getMonth()===m?`<span class="holiday-label">${escapeHtml(holidayName)}</span>`:""}
        <span class="event-dots">${eventDots}${extra}</span>
      </button>`;
  }

  grid.innerHTML=html;
  grid.querySelectorAll(".calendar-day").forEach(btn=>btn.addEventListener("click",()=>{
    selectedDate=btn.dataset.date;
    renderCalendar();
  }));

  const focusEvents=selectedDate
    ? allEvents.filter(e=>e.event_date===selectedDate)
    : allEvents.filter(e=>String(e.event_date||"").startsWith(`${y}-${String(m+1).padStart(2,"0")}`));

  listBox.innerHTML=`
    <div class="event-list-head">
      <div>
        <span class="section-kicker">EVENTS</span>
        <h3>${selectedDate?selectedDate:`${y}년 ${m+1}월`} 일정</h3>
      </div>
      <span class="event-count">${focusEvents.length}건</span>
    </div>
    ${focusEvents.length
      ? focusEvents.map(e=>`
        <div class="event-card">
          <div class="event-card-top">
            <span class="event-tag">${escapeHtml(e.category||"일정")}</span>
            <time>${escapeHtml(e.event_date||"")}</time>
          </div>
          <strong>${escapeHtml(e.title||"")}</strong>
          <p>${escapeHtml(e.description||"")}</p>
        </div>`).join("")
      : '<div class="empty-calendar"><b>등록된 일정이 없습니다.</b><span>다른 날짜 또는 월을 선택해 주세요.</span></div>'}`;
}

const FALLBACK_TERMS=[
 {term:"Scope 3",eng:"Scope 3 Emissions",category:"탄소·에너지",definition:"기업의 가치사슬에서 발생하는 기타 간접 온실가스 배출",usage:"공급망 탄소배출 관리"},
 {term:"EcoVadis",eng:"EcoVadis",category:"평가·공시",definition:"기업의 지속가능성 성과를 평가하는 글로벌 평가 플랫폼",usage:"협력사 ESG 평가"},
 {term:"CSDDD",eng:"Corporate Sustainability Due Diligence Directive",category:"공급망·인권",definition:"EU 기업 지속가능성 실사지침",usage:"공급망 인권·환경 실사"},
 {term:"LCA",eng:"Life Cycle Assessment",category:"자동차·제품환경",definition:"제품 전 과정의 환경영향을 평가하는 방법",usage:"제품 환경성 평가"},
 {term:"위험성평가",eng:"Risk Assessment",category:"환경·안전",definition:"작업장의 유해·위험요인을 파악하고 위험성을 평가하는 활동",usage:"안전보건 관리"},
 {term:"ISO 14001",eng:"Environmental Management System",category:"규격·인증",definition:"환경경영시스템 국제표준",usage:"환경경영체계 인증"}
];
async function loadGlossary(){
  const {data,error}=await supabaseClient.from("glossary_terms").select("*").eq("is_visible",true).order("sort_order",{ascending:true}).order("term",{ascending:true});
  allTerms=error||!data?.length?FALLBACK_TERMS:(data||[]); renderGlossary();
}
function renderGlossary(){
  const q=(document.getElementById("glossarySearch")?.value||"").trim().toLowerCase();
  const c=document.getElementById("glossaryCategory")?.value||"";
  let list=allTerms.filter(t=>{
    const hay=`${t.term||""} ${t.eng||""} ${t.category||""} ${t.definition||""} ${t.usage||""} ${t.aliases||""}`.toLowerCase();
    return (!q||hay.includes(q))&&(!c||t.category===c);
  });
  const box=document.getElementById("glossaryList"), summary=document.getElementById("glossarySummary");
  if(summary) summary.textContent=`검색 가능 용어 ${allTerms.length}개 · 현재 ${list.length}개 표시 대상`;
  if(!box)return;
  box.innerHTML=list.slice(0,glossaryVisibleCount).map(t=>`<div class="term-card"><span class="term-category">${escapeHtml(t.category||"ESG")}</span><h3>${escapeHtml(t.term||"")}${t.eng?` <small>${escapeHtml(t.eng)}</small>`:""}</h3><p>${escapeHtml(t.definition||"")}</p>${t.usage?`<div class="usage">활용: ${escapeHtml(t.usage)}</div>`:""}</div>`).join("")||'<div class="faq-item">검색 결과가 없습니다.</div>';
  const more=document.getElementById("glossaryMoreBtn");
  if(more){more.style.display=list.length>glossaryVisibleCount?"inline-block":"none";more.textContent=`더보기 (${Math.min(glossaryVisibleCount,list.length)}/${list.length})`;}
}

async function loadSiteContent(){
  try{
    const {data,error}=await supabaseClient.from("site_content").select("*").limit(1).maybeSingle();
    if(error||!data)return;
    const map={
      header_description:"heroDescription",
      hero_title_line1:"heroTitleLine1",
      hero_title_line2:"heroTitleLine2",
      quick_faq_eyebrow:"quickFaqEyebrow",
      quick_faq_title:"quickFaqTitle",
      quick_faq_desc:"quickFaqDesc",
      quick_calendar_eyebrow:"quickCalEyebrow",
      quick_calendar_title:"quickCalTitle",
      quick_calendar_desc:"quickCalDesc",
      quick_glossary_eyebrow:"quickGlossEyebrow",
      quick_glossary_title:"quickGlossTitle",
      quick_glossary_desc:"quickGlossDesc",
      quick_inquiry_eyebrow:"quickInquiryEyebrow",
      quick_inquiry_title:"quickInquiryTitle",
      quick_inquiry_desc:"quickInquiryDesc",
      notice_section_title:"noticeSectionTitle",
      notice_title:"noticeTitle",
      notice_body:"noticeBody",
      calendar_title:"calendarSectionTitle",
      calendar_description:"calendarDescription",
      faq_title:"faqSectionTitle",
      faq_description:"faqDescription",
      glossary_title:"glossarySectionTitle",
      glossary_description:"glossaryDescription",
      glossary_guide_text:"glossaryGuideText",
      inquiry_title:"inquirySectionTitle",
      inquiry_description:"inquiryDescription",
      inquiry_label_company:"labelCompany",
      inquiry_label_contact:"labelContact",
      inquiry_label_email:"labelEmail",
      inquiry_label_phone:"labelPhone",
      inquiry_label_category:"labelCategory",
      inquiry_label_question_no:"labelQuestionNo",
      inquiry_label_title:"labelInquiryTitle",
      inquiry_label_content:"labelInquiryContent",
      inquiry_faq_consent_text:"faqConsentText",
      footer_support_text:"footerSupportText",
      topbar_title:"topbarTitle",
      hero_eyebrow:"heroEyebrow",
      hero_tag1:"heroTag1",
      hero_tag2:"heroTag2",
      hero_tag3:"heroTag3",
      hero_tag4:"heroTag4",
      proof_label:"proofLabel",
      proof_title1:"proofTitle1",
      proof_title2:"proofTitle2",
      proof_company1:"proofCompany1",
      proof_company2:"proofCompany2",
      proof_company3:"proofCompany3",
      proof_company4:"proofCompany4",
      proof_features:"proofFeatures",
      notice_kicker:"noticeKicker",
      mini_schedule_kicker:"miniScheduleKicker",
      mini_schedule_title:"miniScheduleTitle",
      full_calendar_link_text:"fullCalendarLink",
      faq_kicker:"faqKicker",
      calendar_kicker:"calendarKicker",
      glossary_kicker:"glossaryKicker",
      glossary_shortcut_label:"glossaryShortcutLabel",
      inquiry_kicker:"inquiryKicker",
      submit_button_text:"submitButtonText",
};
    Object.entries(map).forEach(([k,id])=>{if(data[k]&&document.getElementById(id))document.getElementById(id).textContent=data[k];});
    document.querySelectorAll("[data-placeholder-key]").forEach(el=>{
      const key=el.dataset.placeholderKey;
      if(data[key])el.placeholder=data[key];
    });
    const fontVars={
      font_size_base:"--admin-fs-base",
      font_size_hero_title:"--admin-fs-hero-title",
      font_size_section_title:"--admin-fs-section-title",
      font_size_section_desc:"--admin-fs-section-desc",
      font_size_quick_desc:"--admin-fs-quick-desc",
      font_size_faq_q:"--admin-fs-faq-q",
      font_size_faq_a:"--admin-fs-faq-a",
      font_size_term_desc:"--admin-fs-term-desc",
      font_size_term_usage:"--admin-fs-term-usage",
      font_size_inquiry_label:"--admin-fs-inquiry-label",
      font_size_input:"--admin-fs-input"
    };
    Object.entries(fontVars).forEach(([key,cssVar])=>{
      const value=Number(data[key]);
      if(Number.isFinite(value) && value>=8 && value<=60){
        document.documentElement.style.setProperty(cssVar,`${value}px`);
      }
    });

  }catch(e){console.warn("site_content load skipped",e);}
}

async function submitInquiry(e){
  e.preventDefault(); const form=e.target,msg=document.getElementById("formMsg"),fd=new FormData(form);
  const payload={company:(fd.get("company")||"").trim(),contact_name:(fd.get("contact_name")||"").trim(),email:(fd.get("email")||"").trim(),phone:(fd.get("phone")||"").trim(),category:fd.get("category")||"",question_no:(fd.get("question_no")||"").trim(),title:(fd.get("title")||"").trim(),content:(fd.get("content")||"").trim(),is_faq_candidate:!!fd.get("is_faq_candidate")};
  msg.textContent="등록 중입니다...";msg.className="msg";
  const {error}=await supabaseClient.from("inquiries").insert(payload);
  if(error){console.error(error);msg.textContent="문의 등록 중 오류가 발생했습니다. 필수값을 확인해 주세요.";msg.className="msg error";return;}
  form.reset();msg.textContent="문의가 정상 접수되었습니다.";msg.className="msg success";
}

function bindEvents(){
  document.getElementById("searchInput")?.addEventListener("input",()=>{faqVisibleCount=8;renderFaqs();});
  document.getElementById("categoryFilter")?.addEventListener("change",()=>{faqVisibleCount=8;renderFaqs();});
  document.getElementById("inquiryForm")?.addEventListener("submit",submitInquiry);
  document.getElementById("glossarySearch")?.addEventListener("input",()=>{
    glossaryVisibleCount=12;
    document.querySelectorAll(".glossary-chip").forEach(x=>x.classList.remove("active"));
    renderGlossary();
  });
  document.getElementById("glossaryCategory")?.addEventListener("change",()=>{
    glossaryVisibleCount=12;
    document.querySelectorAll(".glossary-chip").forEach(x=>x.classList.remove("active"));
    renderGlossary();
  });
  document.getElementById("glossaryMoreBtn")?.addEventListener("click",()=>{glossaryVisibleCount+=GLOSSARY_PAGE_SIZE;renderGlossary();});
  document.querySelectorAll(".glossary-chip").forEach(btn=>btn.addEventListener("click",()=>{
    const term=btn.dataset.term||"";
    const input=document.getElementById("glossarySearch");
    const category=document.getElementById("glossaryCategory");
    if(input) input.value=term;
    if(category) category.value="";
    glossaryVisibleCount=12;
    document.querySelectorAll(".glossary-chip").forEach(x=>x.classList.toggle("active",x===btn));
    renderGlossary();
    // 주요 용어 바로가기 행이 화면 상단에 자연스럽게 보이도록 고정 스크롤
    // 카드 목록으로 직접 이동하면 섹션 높이 변화에 따라 문의등록까지 과도하게 내려갈 수 있음
    requestAnimationFrame(()=>{
      const target=document.querySelector(".glossary-shortcuts") || document.getElementById("glossary");
      if(!target)return;
      const top=target.getBoundingClientRect().top + window.pageYOffset - 86;
      window.scrollTo({top:Math.max(0,top),behavior:"smooth"});
    });
  }));

  document.getElementById("prevMonthBtn")?.addEventListener("click",()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);selectedDate="";renderUpcoming();renderCalendar();});
  document.getElementById("nextMonthBtn")?.addEventListener("click",()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);selectedDate="";renderUpcoming();renderCalendar();});
  document.getElementById("todayMonthBtn")?.addEventListener("click",()=>{const n=new Date();calendarMonth=new Date(2026,Math.min(11,Math.max(0,n.getFullYear()===2026?n.getMonth():8)),1);selectedDate="";renderUpcoming();renderCalendar();});
  document.getElementById("globalSearchBtn")?.addEventListener("click",()=>{
    const q=(document.getElementById("globalSearch")?.value||"").trim();document.getElementById("searchInput").value=q;faqVisibleCount=8;renderFaqs();scrollToSection("faq");
  });
  document.getElementById("globalSearch")?.addEventListener("keydown",e=>{if(e.key==="Enter")document.getElementById("globalSearchBtn").click();});

  document.querySelectorAll(".js-section-link").forEach(link=>link.addEventListener("click",e=>{
    const target=link.dataset.scrollTarget;
    if(!target)return;
    e.preventDefault();
    scrollToSection(target);
  }));
  document.querySelectorAll(".side-nav a").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll(".side-nav a").forEach(x=>x.classList.remove("active"));a.classList.add("active");}));
}


function initScrollSpy(){
  const sectionIds=["home","faq","calendar","glossary","inquiry"];
  const links=[...document.querySelectorAll(".side-nav a[data-scroll-target]")];
  if(!links.length)return;

  const setActive=(id)=>{
    links.forEach(link=>link.classList.toggle("active",link.dataset.scrollTarget===id));
  };

  const update=()=>{
    const topOffset=(document.querySelector(".topbar")?.offsetHeight||66)+70;
    let current="home";
    for(const id of sectionIds){
      const section=document.getElementById(id);
      if(!section)continue;
      if(section.getBoundingClientRect().top<=topOffset) current=id;
    }

    /* 페이지 최하단에서는 문의등록을 확실히 활성화 */
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-30){
      current="inquiry";
    }
    setActive(current);
  };

  let ticking=false;
  const requestUpdate=()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{update();ticking=false;});
  };

  window.addEventListener("scroll",requestUpdate,{passive:true});
  window.addEventListener("resize",requestUpdate);
  setTimeout(update,100);
}

loadNotices();initScrollSpy();bindEvents();loadSiteContent();loadFaqs();loadEvents();loadGlossary();
