const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
const rrData=[
 {cat:"환경",title:"온실가스 관리",lead:"기획실/기획팀",coop:"환경안전보건팀 · 총무 · 공정기술 · 생산",role:"Scope 1·2·3 산정, 감축목표, 검증 및 고객사 대응"},
 {cat:"환경",title:"에너지 절감",lead:"총무 / 공정기술",coop:"생산 · 기획 · 재경",role:"전력·연료 사용량 관리, 절감과제 발굴 및 투자 검토"},
 {cat:"환경",title:"환경 데이터",lead:"환경안전보건팀",coop:"생산 · 업무 · 기획",role:"폐기물·용수·대기배출 등 환경지표 관리"},
 {cat:"사회",title:"인권·노동",lead:"인사총무본부",coop:"기획실 · 각 부서",role:"인권정책, 근로조건, 교육, 고충처리 및 평가 증빙"},
 {cat:"사회",title:"안전보건",lead:"환경안전보건팀",coop:"생산 · 공정기술 · 인사",role:"위험성평가, 산업재해, 안전교육 및 법정 관리"},
 {cat:"공급망",title:"협력사 ESG",lead:"기획실 / 전략구매",coop:"품질 · 환경안전 · 인사",role:"협력사 ESG 평가, 개선요청, 교육 및 실사 대응"},
 {cat:"거버넌스",title:"윤리·준법",lead:"기획실 / 인사총무",coop:"전 부서",role:"윤리규정, 신고제도, 준법교육 및 관련 증빙 관리"},
 {cat:"거버넌스",title:"ESG 평가·공시",lead:"기획실/기획팀",coop:"전 부서",role:"EcoVadis, CDP, 고객사 평가 및 ESG 공시 총괄"},
 {cat:"환경",title:"제품환경·LCA",lead:"기술연구소",coop:"구매 · 생산 · 기획",role:"제품 탄소발자국, 원재료 정보, LCA 및 고객사 제품환경 대응"}
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
 const list=rrData.filter(x=>(filter==="전체"||x.cat===filter)&&(`${x.title} ${x.lead} ${x.coop} ${x.role}`.toLowerCase().includes(q.toLowerCase())));
 $("#rrGrid").innerHTML=list.map(x=>`<article class="rr-card"><span class="cat">${x.cat}</span><h3>${x.title}</h3><dl><div><dt>주관</dt><dd><b>${x.lead}</b></dd></div><div><dt>협조</dt><dd>${x.coop}</dd></div><div><dt>주요 역할</dt><dd>${x.role}</dd></div></dl></article>`).join("");
}
function renderTerms(){
 const q=$("#termSearch").value.toLowerCase(), c=$("#termCategory").value;
 const list=terms.filter(x=>(c==="전체"||x.cat===c)&&(`${x.term} ${x.eng} ${x.def} ${x.usage}`.toLowerCase().includes(q)));
 $("#termGrid").innerHTML=list.map(x=>`<article class="term-card"><span>${x.cat}</span><h3>${x.term} <small>${x.eng}</small></h3><p>${x.def}</p><div class="usage">활용: ${x.usage}</div></article>`).join("");
}
let y=2026,m=8;
const events={"2026-09-08":["현대차·기아 ESG 보완자료 취합"],"2026-09-15":["온실가스 감축계획 내부 검토"],"2026-09-24":["CDP 대응자료 점검"]};
const holidays={"2026-09-24":"추석휴무","2026-09-25":"추석","2026-09-26":"추석휴무","2026-09-27":"추석휴무","2026-09-28":"휴일중복"};
function fmt(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function renderCalendar(){
 $("#calendarTitle").textContent=`${y}년 ${m+1}월`; $("#eventTitle").textContent=`${y}년 ${m+1}월 일정`;
 const first=new Date(y,m,1), start=new Date(y,m,1-first.getDay());
 let html="";
 for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=fmt(d),other=d.getMonth()!==m,holiday=holidays[key],today=key==="2026-09-03";html+=`<div class="day ${other?"other":""} ${holiday?"holiday":""} ${today?"today":""}">${today?`<b>${d.getDate()}</b>`:d.getDate()}${events[key]?'<i></i>':""}</div>`}
 $("#calendarGrid").innerHTML=html;
 const monthEvents=Object.entries(events).filter(([k])=>k.startsWith(`${y}-${String(m+1).padStart(2,"0")}`));
 $("#eventCount").textContent=`${monthEvents.length}건`;$("#eventList").innerHTML=monthEvents.length?monthEvents.map(([k,v])=>`<div class="event-row"><b>${k.slice(5).replace("-",".")} ${v[0]}</b><small>관련 부서 일정 확인 필요</small></div>`).join(""):`<div class="event-row"><small>등록된 일정이 없습니다.</small></div>`;
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
