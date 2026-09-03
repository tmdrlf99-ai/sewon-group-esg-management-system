const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const rrData=[
 {task:"LCA",full:"Life Cycle Assessment",company:"세원정공",primary:"공기 이대희 매니저",support:"생산 고경민 매니저 · 업무부 곽기호/정수연 매니저",coord:""},
 {task:"LCA",full:"Life Cycle Assessment",company:"세원물산",primary:"자재 김호현 책임",support:"총무 양승권 매니저 · 공기 송윤근 매니저",coord:""},
 {task:"LCA",full:"Life Cycle Assessment",company:"세원테크",primary:"자재 권은찬 책임 · 공기 김빈 매니저",support:"총무 이종완 매니저",coord:""},
 {task:"LCA",full:"Life Cycle Assessment",company:"세원이엔아이",primary:"영업 이동욱 책임",support:"총무 김민제 매니저",coord:""},

 {task:"RMI",full:"Responsible Minerals Initiative",company:"세원정공",primary:"업무부 곽기호/정수연 매니저",support:"구매 조덕진 책임 (2차사 협조/전달)",coord:""},
 {task:"RMI",full:"Responsible Minerals Initiative",company:"세원물산",primary:"자재 지병구 매니저",support:"총무 양승권 매니저",coord:""},
 {task:"RMI",full:"Responsible Minerals Initiative",company:"세원테크",primary:"자재 김광은 책임",support:"총무 이종완 매니저 · 구매 조덕진 책임 (2차사 협조/전달)",coord:""},
 {task:"RMI",full:"Responsible Minerals Initiative",company:"세원이엔아이",primary:"자재 김용진 책임",support:"-",coord:""},

 {task:"CDP",full:"Carbon Disclosure Project",company:"세원정공",primary:"공기 이대희 매니저",support:"총무 김현정 책임",coord:""},
 {task:"CDP",full:"Carbon Disclosure Project",company:"세원물산",primary:"총무 나현철 매니저 · 총무 양승권 매니저",support:"공기 송윤근 매니저",coord:""},
 {task:"CDP",full:"Carbon Disclosure Project",company:"세원테크",primary:"공기 김빈 매니저",support:"총무 이종완 매니저",coord:""},
 {task:"CDP",full:"Carbon Disclosure Project",company:"세원이엔아이",primary:"총무 김민제 매니저",support:"생기 정재광 매니저",coord:""},

 {task:"SCEMS",full:"Supplier CO₂ Emission Monitoring System / 온실가스 관리",company:"세원정공",primary:"공기 이대희 매니저",support:"총무 김현정 책임",coord:""},
 {task:"SCEMS",full:"Supplier CO₂ Emission Monitoring System / 온실가스 관리",company:"세원물산",primary:"총무 양승권 매니저",support:"공기 송윤근 매니저 · 자재 지병구 매니저",coord:""},
 {task:"SCEMS",full:"Supplier CO₂ Emission Monitoring System / 온실가스 관리",company:"세원테크",primary:"자재 권은찬 책임",support:"총무 이종완 매니저",coord:""},
 {task:"SCEMS",full:"Supplier CO₂ Emission Monitoring System / 온실가스 관리",company:"세원이엔아이",primary:"총무 김민제 매니저",support:"생산 조민주 매니저 · 생기 정재광 매니저 · 자재 김용진 책임",coord:""},

 {task:"ESG 평가",full:"개별 계열사 대응 주관",company:"세원정공",primary:"총무 김현정 책임",support:"전 부서 협조",coord:"기획 김준성 책임 · 기획 진승길 매니저"},
 {task:"ESG 평가",full:"개별 계열사 대응 주관",company:"세원물산",primary:"총무 나현철 매니저 · 총무 양승권 매니저",support:"전 부서 협조",coord:"기획 김준성 책임 · 기획 진승길 매니저"},
 {task:"ESG 평가",full:"개별 계열사 대응 주관",company:"세원테크",primary:"총무 이종완 매니저",support:"전 부서 협조",coord:"기획 김준성 책임 · 기획 진승길 매니저"},
 {task:"ESG 평가",full:"개별 계열사 대응 주관",company:"세원이엔아이",primary:"총무 김민제 매니저",support:"전 부서 협조",coord:"기획 김준성 책임 · 기획 진승길 매니저"}
];
const terms=[
 {cat:"탄소·에너지",term:"Scope 1",eng:"Direct Emissions",def:"사업장이 직접 소유·통제하는 배출원에서 발생하는 온실가스 배출.",usage:"보일러·법인차량·공정연료 등의 배출량 관리"},
 {cat:"탄소·에너지",term:"Scope 2",eng:"Indirect Energy Emissions",def:"구매한 전기·스팀·열·냉방 사용으로 인해 간접적으로 발생하는 배출.",usage:"전력 사용량 기반 배출량 관리"},
 {cat:"탄소·에너지",term:"Scope 3",eng:"Value Chain Emissions",def:"구매·물류·출장·사용·폐기 등 가치사슬 전반에서 발생하는 기타 간접배출.",usage:"공급망 탄소관리와 고객사 감축 요구 대응"},
 {cat:"평가·공시",term:"EcoVadis",eng:"EcoVadis",def:"환경·노동인권·윤리·지속가능조달을 평가하는 글로벌 ESG 평가 플랫폼.",usage:"글로벌 고객사 공급망 ESG 평가 대응"},
 {cat:"자동차·제품환경",term:"LCA",eng:"Life Cycle Assessment",def:"원료 채취부터 생산·사용·폐기까지 제품 전 과정의 환경영향을 평가하는 방법.",usage:"자동차 부품 제품환경 및 탄소발자국 평가"},
 {cat:"공급망·인권",term:"CSDDD",eng:"Corporate Sustainability Due Diligence Directive",def:"기업이 인권·환경에 대한 공급망 실사를 수행하도록 요구하는 EU 제도.",usage:"유럽 공급망 실사와 협력사 관리체계 대응"},
 {cat:"평가·공시",term:"CDP",eng:"Carbon Disclosure Project",def:"기업의 기후변화·수자원·산림 관련 정보 공개를 평가하는 글로벌 공시 플랫폼.",usage:"기후변화 대응 수준 및 온실가스 정보 공시"},
 {cat:"탄소·에너지",term:"Net Zero",eng:"Net Zero",def:"감축 후 남은 온실가스 배출량을 제거·상쇄해 순배출량을 0으로 만드는 목표.",usage:"중장기 탄소중립 전략과 고객사 요구 대응"},
 {cat:"자동차·제품환경",term:"CBAM",eng:"Carbon Border Adjustment Mechanism",def:"EU 수입품의 내재배출량에 탄소가격을 부과하는 탄소국경조정제도.",usage:"EU 수출 및 공급망 탄소정보 관리"}
];
function renderRR(filter="전체",q=""){
 const query=q.toLowerCase();
 const list=rrData.filter(x=>(filter==="전체"||x.task===filter)&&(`${x.task} ${x.full} ${x.company} ${x.primary} ${x.support} ${x.coord}`.toLowerCase().includes(query)));

 const grouped={};
 list.forEach(x=>{
   if(!grouped[x.task])grouped[x.task]=[];
   grouped[x.task].push(x);
 });

 $("#rrGrid").innerHTML=Object.entries(grouped).map(([task,items])=>`
   <section class="rr-task-group">
     <div class="rr-task-head">
       <div>
         <span>${task}</span>
         <strong>${items[0]?.full||""}</strong>
       </div>
       ${task==="ESG 평가"?'<em>계열사별 취합·조율: 기획 김준성 책임 · 기획 진승길 매니저</em>':""}
     </div>
     <div class="rr-company-grid">
       ${items.map(x=>`
         <article class="rr-card">
           <h3 class="rr-company">${x.company}</h3>
           <div class="rr-role-row">
             <span class="rr-role-label">정</span>
             <p class="rr-role-text primary">${x.primary}</p>
           </div>
           <div class="rr-role-row">
             <span class="rr-role-label">부</span>
             <p class="rr-role-text">${x.support}</p>
           </div>
           ${x.coord?`
           <div class="rr-role-row coord">
             <span class="rr-role-label">총괄</span>
             <p class="rr-role-text">${x.coord}</p>
           </div>`:""}
         </article>`).join("")}
     </div>
   </section>`).join("") || '<div class="rr-empty">검색 결과가 없습니다.</div>';
}
function renderTerms(){
 const q=$("#termSearch").value.toLowerCase(), c=$("#termCategory").value;
 const list=terms.filter(x=>(c==="전체"||x.cat===c)&&(`${x.term} ${x.eng} ${x.def} ${x.usage}`.toLowerCase().includes(q)));
 $("#termGrid").innerHTML=list.map(x=>`<article class="term-card"><span>${x.cat}</span><h3>${x.term} <small>${x.eng}</small></h3><p>${x.def}</p><div class="usage">활용: ${x.usage}</div></article>`).join("");
}
let y=2026,m=8;
const esgEvents={
 "2026-09-08":["현대차·기아 ESG 보완자료 취합"],
 "2026-09-15":["온실가스 감축계획 내부 검토"],
 "2026-09-24":["CDP 대응자료 점검"]
};

const workCalendar={
 "2026-01-01":{name:"신정",type:"holiday"},
 "2026-01-02":{name:"신정휴무",type:"company"},
 "2026-02-16":{name:"설날휴무",type:"company"},
 "2026-02-17":{name:"설날",type:"holiday"},
 "2026-02-18":{name:"설날휴무",type:"company"},
 "2026-02-19":{name:"설날휴무",type:"company"},
 "2026-02-20":{name:"휴무일 조정 (5/25 → 2/20)",type:"company"},
 "2026-03-01":{name:"삼일절",type:"holiday"},
 "2026-03-02":{name:"휴일중복",type:"company"},
 "2026-05-01":{name:"노동절",type:"holiday"},
 "2026-05-05":{name:"어린이날",type:"holiday"},
 "2026-05-24":{name:"석가탄신일",type:"holiday"},
 "2026-05-25":{name:"휴일중복 / 휴무일 조정",type:"company"},
 "2026-06-03":{name:"전국동시지방선거",type:"holiday"},
 "2026-06-06":{name:"현충일",type:"holiday"},
 "2026-07-28":{name:"하기휴무",type:"company"},
 "2026-07-29":{name:"하기휴무",type:"company"},
 "2026-07-30":{name:"하기휴무",type:"company"},
 "2026-07-31":{name:"하기휴무",type:"company"},
 "2026-08-01":{name:"하기휴무",type:"company"},
 "2026-08-03":{name:"하기휴무",type:"company"},
 "2026-08-04":{name:"하기휴무",type:"company"},
 "2026-08-05":{name:"하기휴무",type:"company"},
 "2026-08-06":{name:"하기휴무",type:"company"},
 "2026-08-07":{name:"하기휴무",type:"company"},
 "2026-08-15":{name:"광복절",type:"holiday"},
 "2026-08-17":{name:"휴일중복",type:"company"},
 "2026-09-24":{name:"추석휴무",type:"company"},
 "2026-09-25":{name:"추석",type:"holiday"},
 "2026-09-26":{name:"추석휴무",type:"company"},
 "2026-09-27":{name:"추석휴무",type:"company"},
 "2026-09-28":{name:"휴일중복",type:"company"},
 "2026-10-03":{name:"개천절",type:"holiday"},
 "2026-10-05":{name:"휴일중복",type:"company"},
 "2026-10-09":{name:"한글날",type:"holiday"},
 "2026-12-25":{name:"기독탄신일",type:"holiday"}
};

const monthlyWorkdays={1:20,2:15,3:21,4:22,5:19,6:22,7:23,8:15,9:19,10:20,11:21,12:22};
function fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function renderCalendar(){
 const month=m+1;
 $("#calendarTitle").textContent=`${y}년 ${month}월`;
 $("#eventTitle").textContent=`${y}년 ${month}월 주요 일정`;

 const first=new Date(y,m,1);
 const start=new Date(y,m,1-first.getDay());
 const todayKey="2026-09-03";
 let html="";

 for(let i=0;i<42;i++){
   const d=new Date(start);
   d.setDate(start.getDate()+i);
   const key=fmt(d);
   const other=d.getMonth()!==m;
   const cal=workCalendar[key];
   const hasEsg=!!esgEvents[key];
   const isToday=key===todayKey;
   const dow=d.getDay();

   const classes=[
     "day",
     other?"other":"",
     cal?"holiday":"",
     cal?.type==="company"?"company-off":"",
     isToday?"today":"",
     dow===0?"sun-day":"",
     dow===6?"sat-day":""
   ].filter(Boolean).join(" ");

   html+=`<button type="button" class="${classes}" data-date="${key}" title="${cal?.name||""}">
     <span class="date-num">${isToday?`<b>${d.getDate()}</b>`:d.getDate()}</span>
     ${isToday?'<span class="today-pill">TODAY</span>':""}
     ${cal&&!other?`<small class="holiday-name">${cal.name}</small>`:""}
     ${hasEsg?'<i class="event-dot"></i>':""}
   </button>`;
 }
 $("#calendarGrid").innerHTML=html;

 const prefix=`${y}-${String(month).padStart(2,"0")}`;
 const calendarItems=Object.entries(workCalendar)
   .filter(([k])=>k.startsWith(prefix))
   .map(([date,v])=>({date,title:v.name,kind:v.type==="holiday"?"공휴일":"회사휴무"}));
 const esgItems=Object.entries(esgEvents)
   .filter(([k])=>k.startsWith(prefix))
   .flatMap(([date,arr])=>arr.map(title=>({date,title,kind:"ESG"})));

 const all=[...calendarItems,...esgItems].sort((a,b)=>a.date.localeCompare(b.date));
 $("#eventCount").textContent=`${all.length}건`;

 const workdays=monthlyWorkdays[month]||"-";
 $("#workdayCount").textContent=workdays;
 const holidayDates=new Set(calendarItems.map(x=>x.date));
 $("#holidayCount").textContent=holidayDates.size;

 $("#eventList").innerHTML=all.length?all.map(x=>`
   <div class="event-row ${x.kind==="ESG"?"esg":x.kind==="공휴일"?"public-holiday":"company-holiday"}">
     <div class="event-date">${x.date.slice(5).replace("-",".")}</div>
     <div><b>${x.title}</b><small>${x.kind}</small></div>
   </div>`).join(""):`
   <div class="event-empty">
     <span>▣</span><b>등록된 일정이 없습니다.</b><small>다른 월을 선택해 주세요.</small>
   </div>`;
}
function scrollToSection(id){
 const el=document.getElementById(id);if(!el)return;
 const mobile=window.innerWidth<=760;
 const offset=mobile?72:76;
 const y=el.getBoundingClientRect().top+window.scrollY-offset;
 window.scrollTo({top:y,behavior:"smooth"});
 history.replaceState(null,"",`#${id}`);
}

function initScrollSpy(){
 const ids=["home","calendar","notice","rr","glossary"];
 const links=$$(".nav a[data-target]");
 if(!links.length)return;

 let lastY=window.scrollY;
 let active="home";

 const setActive=id=>{
   active=id;
   links.forEach(a=>a.classList.toggle("active",a.dataset.target===id));
 };

 const visibleHeight=(el,topOffset)=>{
   const r=el.getBoundingClientRect();
   const top=Math.max(r.top,topOffset);
   const bottom=Math.min(r.bottom,window.innerHeight);
   return Math.max(0,bottom-top);
 };

 const update=()=>{
   const now=window.scrollY;
   const down=now>=lastY;
   const topOffset=window.innerWidth<=760?74:78;
   let current=active;

   if(down){
     current="home";
     const line=topOffset+46;
     ids.forEach(id=>{
       const el=document.getElementById(id);
       if(el&&el.getBoundingClientRect().top<=line)current=id;
     });
   }else{
     let best=active,bestVisible=-1;
     ids.forEach(id=>{
       const el=document.getElementById(id);if(!el)return;
       const v=visibleHeight(el,topOffset);
       if(v>bestVisible){bestVisible=v;best=id}
     });
     const activeEl=document.getElementById(active);
     const activeVisible=activeEl?visibleHeight(activeEl,topOffset):0;
     if(best===active||bestVisible>=activeVisible+70||activeVisible<90)current=best;
   }

   if(window.innerHeight+now>=document.documentElement.scrollHeight-25)current="glossary";
   if(current!==active)setActive(current);
   lastY=now;
 };

 let ticking=false;
 const onScroll=()=>{
   if(ticking)return;
   ticking=true;
   requestAnimationFrame(()=>{update();ticking=false});
 };
 window.addEventListener("scroll",onScroll,{passive:true});
 window.addEventListener("resize",onScroll);
 setTimeout(update,80);
}
$$(".board-item button").forEach(b=>b.addEventListener("click",()=>b.parentElement.classList.toggle("open")));
$$(".rr-chips button").forEach(b=>b.addEventListener("click",()=>{$$(".rr-chips button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderRR(b.dataset.filter,$("#rrSearch").value)}));
$("#rrSearch").addEventListener("input",()=>renderRR($(".rr-chips button.active").dataset.filter,$("#rrSearch").value));
$("#termSearch").addEventListener("input",renderTerms);$("#termCategory").addEventListener("change",renderTerms);
$$(".chips button").forEach(b=>b.addEventListener("click",()=>{$("#termSearch").value=b.textContent;renderTerms()}));
$("#prevMonth").addEventListener("click",()=>{m--;if(m<0){m=11;y--}renderCalendar()});$("#nextMonth").addEventListener("click",()=>{m++;if(m>11){m=0;y++}renderCalendar()});$("#todayBtn").addEventListener("click",()=>{y=2026;m=8;renderCalendar()});
$("#searchBtn").addEventListener("click",()=>{const q=$("#globalSearch").value.trim();if(!q)return;const r=rrData.find(x=>`${x.title} ${x.role}`.includes(q));if(r){location.hash="rr";$("#rrSearch").value=q;renderRR("전체",q);return}$("#termSearch").value=q;renderTerms();location.hash="glossary"});

$$(".js-section-link").forEach(a=>a.addEventListener("click",e=>{
 const id=a.dataset.scrollTarget||a.dataset.target;
 if(!id)return;
 e.preventDefault();
 scrollToSection(id);
}));

renderRR();renderTerms();renderCalendar();initScrollSpy();
