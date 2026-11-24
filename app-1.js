
(function(){
'use strict';
/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const r3=n=>Math.round(n*1000)/1000;
const title=s=>String(s).split(' ').filter(Boolean).map(w=>w[0].toUpperCase()+w.slice(1)).join(' ');
const MONTHS_FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const KEY='fils-prototype-v1';
const ICON={
  back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
  fwd:'<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  chart:'<svg viewBox="0 0 24 24"><path d="M5 20v-7M12 20V5M19 20v-10M3 20h18"/></svg>',
  people:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c.8-3.4 3.3-5.4 6.2-5.4s5.4 2 6.2 5.4"/><path d="M15.8 4.8a3.4 3.4 0 0 1 0 6.4M18 14.9c1.7.7 2.8 2.4 3.3 5.1"/></svg>',
  sliders:'<svg viewBox="0 0 24 24"><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
  help:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .8-1 1.5v.5"/><path d="M12 17h.01"/></svg>',
  x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  out:'<svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg>',
  in:'<svg viewBox="0 0 24 24"><path d="M17 7 7 17M15 17H7V9"/></svg>',
  grid:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><circle cx="16.75" cy="16.75" r="3.3"/></svg>',
  tag:'<svg viewBox="0 0 24 24"><path d="M3.5 12.5V4h8.5l8.5 8.5-8 8z"/><circle cx="8" cy="8.5" r="1.3"/></svg>',
  swap:'<svg viewBox="0 0 24 24"><path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/></svg>',
  copy:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>',
  trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
  save:'<svg viewBox="0 0 24 24"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14"/></svg>',
  down:'<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  search:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
  filter:'<svg viewBox="0 0 24 24"><path d="M3.5 5h17l-6.5 8v6l-4 1.8V13z"/></svg>'
};

/* ---------- default data ---------- */
const CAT_DEF=[
 ['food','Food & Dining','expense','Fo','#d97706','food, lunch, dinner, breakfast, restaurant, shawarma, coffee, cafe, tea, karak, burger, pizza, snack'],
 ['groceries','Groceries','expense','Gr','#65a30d','groceries, grocery, supermarket, coop, jamiya, carrefour, vegetables, fruit'],
 ['transport','Transport','expense','Tr','#2563eb','transport, taxi, uber, careem, fuel, petrol, parking, bus, metro'],
 ['car','Car','expense','Ca','#64748b','car, car service, oil change, tyres, tires, car wash, car insurance'],
 ['housing','Housing','expense','Ho','#a16207','rent, housing, maintenance, furniture'],
 ['bills','Bills & Utilities','expense','Bi','#0891b2','bills, bill, electricity, water bill, internet, phone bill, mobile bill, recharge, wifi'],
 ['shopping','Shopping','expense','Sh','#db2777','shopping, clothes, shoes, amazon, electronics, avenues, mall, phone, iphone, mobile, laptop'],
 ['health','Health','expense','He','#dc2626','health, pharmacy, doctor, clinic, dentist, medicine, hospital'],
 ['care','Personal Care','expense','Pc','#9333ea','haircut, barber, salon, laundry, personal care'],
 ['fun','Entertainment','expense','En','#7c3aed','entertainment, cinema, movie, movies, netflix, spotify, games, outing'],
 ['travel','Travel','expense','Tv','#0284c7','travel, flight, hotel, visa, airbnb, ticket'],
 ['gifts','Family & Gifts','expense','Fa','#e11d48','gift, gifts, family, charity, zakat, donation'],
 ['education','Education','expense','Ed','#4f46e5','education, course, books, book, exam, certification, training'],
 ['fees','Fees & Charges','expense','Fe','#78716c','fee, fees, bank fee, transfer fee, fine, charges'],
 ['other','Other','expense','Ot','#6b7280','other, misc'],
 ['salary','Salary','income','Sa','#16a34a','salary, payroll, wage, wages'],
 ['freelance','Freelance','income','Fr','#059669','freelance, project, client, consulting, side work'],
 ['giftin','Gift received','income','Gi','#ca8a04','gift, eidiya, eid money'],
 ['otherin','Other income','income','Oi','#4d7c0f','income, bonus, other income']
];
const DEFAULT_DESIGN={appName:'Fils',theme:'system',font:'terminal',iconStyle:'icons',accent:'#0f766e',income:'#1f8a4c',expense:'#c2410c',fontSize:'m',corners:'soft',density:'comfortable',inputPos:'bottom',popupPos:'bottom',rows:'two',swipeLabels:true,haptics:true,kbSuggest:false,currency:'KWD',defaultAccount:'bank',showCash:true,showIn:true,showOut:true,showLeft:true,showLoan:true,
  features:{loans:true,places:true,byPlace:true,shortcuts:true,autofocus:true,confirmAll:false}};

function freshState(){
  const now=new Date();
  const ago=min=>now.getTime()-min*60000;
  const at=(d,h,mi)=>{const x=new Date(now);x.setDate(x.getDate()-d);x.setHours(h,mi,0,0);return x.getTime()};
  const first=(back,h)=>new Date(now.getFullYear(),now.getMonth()-back,1,h,5).getTime();
  const categories=CAT_DEF.map(c=>({id:c[0],name:c[1],kind:c[2],abbr:c[3],hue:c[4],synonyms:c[5].split(',').map(x=>x.trim()).filter(Boolean)}));
  const places=[
    {id:'p_safa',name:'Al Safa Restaurant',categoryId:'food',aliases:['safa','al safa']},
    {id:'p_tsc',name:'The Sultan Center',categoryId:'groceries',aliases:['tsc','sultan','sultan center']},
    {id:'p_lulu',name:'Lulu Hypermarket',categoryId:'groceries',aliases:['lulu']},
    {id:'p_zain',name:'Zain',categoryId:'bills',aliases:['zain']},
    {id:'p_sbux',name:'Starbucks',categoryId:'food',aliases:['starbucks','sbux']},
    {id:'p_noon',name:'Noon',categoryId:'shopping',aliases:['noon']},
    {id:'p_tlb',name:'Talabat',categoryId:'food',aliases:['talabat']}
  ];
  const people=[{id:'u_ali',name:'Ali',aliases:[]},{id:'u_hassan',name:'Hassan',aliases:[]},{id:'u_sara',name:'Sara',aliases:[]},{id:'u_moh',name:'Mohammed',aliases:['mohd','moh']},{id:'u_safa',name:'Safa',aliases:[]}];
  const entries=[];
  const add=(type,amount,ts,o={})=>entries.push({id:uid(),type,amount,currency:'KWD',account:o.a||'bank',...(type==='transfer'?{toAccount:o.to}:{}),categoryId:o.c||null,placeId:o.p||null,personId:o.u||null,note:o.n||'',ts});
  add('income',650,first(0,9),{c:'salary'});
  add('expense',1.25,ago(150),{c:'food',n:'karak',a:'cash'});
  add('expense',3.5,ago(70),{c:'transport',n:'taxi',a:'cash'});
  add('transfer',40,at(5,18,0),{a:'bank',to:'cash'});
  add('expense',5,at(15,19,0),{c:'care',n:'barber',a:'cash'});
  add('transfer',20,at(16,10,0),{a:'bank',to:'cash'});
  add('expense',4.25,at(1,21,10),{c:'food',p:'p_tlb',n:'shawarma'});
  add('expense',18.45,at(2,19,30),{c:'groceries',p:'p_tsc'});
  add('lent',20,at(2,15,0),{u:'u_ali'});
  add('expense',8.5,at(3,13,40),{c:'food',p:'p_safa'});
  add('expense',6,at(4,8,20),{c:'transport',n:'fuel'});
  add('refund',12,at(4,17,0),{c:'shopping',p:'p_noon'});
  add('expense',2.1,at(5,9,5),{c:'food',p:'p_sbux'});
  add('expense',3.2,at(6,23,15),{c:'transport',n:'careem'});
  add('lent',15,at(6,14,0),{u:'u_hassan'});
  add('expense',10,at(7,12,0),{c:'bills',p:'p_zain',n:'recharge'});
  add('expense',0.5,at(8,10,30),{c:'transport',n:'parking',a:'cash'});
  add('expense',24.8,at(9,20,0),{c:'groceries',p:'p_lulu'});
  add('borrowed',50,at(9,18,0),{u:'u_sara'});
  add('expense',12,at(10,14,15),{c:'food',p:'p_safa'});
  add('expense',22,at(11,16,0),{c:'shopping',p:'p_noon',n:'headphones'});
  add('expense',15.15,at(12,11,0),{c:'bills',n:'electricity'});
  add('expense',4.6,at(13,18,45),{c:'health',n:'pharmacy'});
  add('expense',20,at(14,9,0),{c:'bills',n:'internet'});
  add('expense',31.2,at(16,20,10),{c:'groceries',p:'p_tsc'});
  add('expense',7.75,at(17,13,0),{c:'food',p:'p_safa'});
  add('expense',6.5,at(18,21,30),{c:'fun',n:'cinema'});
  add('got_back',30,at(18,12,0),{u:'u_ali'});
  add('expense',12.95,at(20,18,0),{c:'groceries',p:'p_lulu'});
  add('lent',10,at(30,12,0),{u:'u_moh'});
  add('lent',30,at(25,12,0),{u:'u_ali'});
  add('got_back',10,at(22,12,0),{u:'u_moh'});
  add('lent',5,at(40,12,0),{u:'u_safa'});
  add('got_back',5,at(35,12,0),{u:'u_safa'});
  add('income',650,first(1,9),{c:'salary'});
  add('expense',27.3,at(33,19,0),{c:'groceries',p:'p_lulu'});
  add('expense',9.25,at(36,13,0),{c:'food',p:'p_safa'});
  add('expense',120,at(38,10,0),{c:'housing',n:'rent share'});
  add('expense',14,at(41,20,0),{c:'fun',n:'bowling'});
  return {v:1,sample:true,openings:{bank:0,cash:0},design:JSON.parse(JSON.stringify(DEFAULT_DESIGN)),categories,places,people,entries};
}
let lastRaw=null;
function load(){try{const raw=localStorage.getItem(KEY);lastRaw=raw;if(!raw)return null;const s=JSON.parse(raw);if(!s||s.v!==1)return null;return s}catch(e){return null}}
function persist(){try{const j=JSON.stringify(S);localStorage.setItem(KEY,j);lastRaw=j}catch(e){}pushToday()}

const SAVED=load();let S=SAVED||freshState();
if(S.setupDone===undefined)S.setupDone=!!SAVED; // first launch shows the setup page; people who already use the app skip it
const CURRENCIES=['KWD','USD','SGD','MYR','AED','SAR','QAR','BHD','OMR','INR','EUR','GBP'];
S.design=Object.assign({},DEFAULT_DESIGN,S.design||{});
S.design.features=Object.assign({},DEFAULT_DESIGN.features,(S.design&&S.design.features)||{});
if(!S.kbOn){S.design.features.autofocus=true;S.kbOn=1} // one-time: keyboard on start is now the default
if(!S.openings)S.openings={bank:typeof S.opening==='number'?S.opening:0,cash:0};delete S.opening;
if(!S.detailsBack){S.design.rows='two';S.detailsBack=true} // one-time: detailed rows are the default again
const F=()=>S.design.features;
const noFilter=()=>({type:'all',range:'all',account:'all',cats:[],placeId:'',personId:''});
const UI={view:'home',personId:null,sheet:null,arg:null,pending:null,toast:null,month:null,openCat:null,mtab:'categories',
  search:'',searchOpen:false,cashOpen:false,filter:noFilter(),openDays:new Set(),daysLimit:14};
const TYPE_OPTS=[['all','All'],['expense','Expenses'],['income','Income'],['loan','Loans']];
const RANGE_OPTS=[['today','Today'],['7','7 days'],['month','This month'],['lastmonth','Last month'],['all','All time']];

/* ---------- lookups ---------- */
const catById=id=>S.categories.find(c=>c.id===id);
const placeById=id=>S.places.find(p=>p.id===id);
const personById=id=>S.people.find(p=>p.id===id);
// older versions saved refunds as income under a "Refund" income category: turn them into real refunds
function migrateRefunds(){let changed=false;
  for(const e of S.entries){if(e.type==='income'&&e.categoryId==='refund'){const pl=placeById(e.placeId);const pc=pl&&catById(pl.categoryId);
    e.type='refund';e.categoryId=pc&&pc.kind==='expense'?pc.id:'other';changed=true}}
  if(S.categories.some(c=>c.id==='refund'&&c.kind==='income')){S.categories=S.categories.filter(c=>!(c.id==='refund'&&c.kind==='income'));changed=true}
  if(changed)persist()}
migrateRefunds();
// one-time word list update: a phone you buy is Shopping, a phone/water bill is Bills, "water" alone asks
function migrateWords(){const b=catById('bills'),s=catById('shopping');let ch=false;
  if(b){const drop=['phone','water'];if(b.synonyms.some(w=>drop.includes(w))){b.synonyms=b.synonyms.filter(w=>!drop.includes(w));ch=true}
    for(const w of ['phone bill','mobile bill','water bill'])if(!b.synonyms.includes(w)){b.synonyms.push(w);ch=true}}
  if(s)for(const w of ['phone','iphone','mobile','laptop'])if(!s.synonyms.includes(w)){s.synonyms.push(w);ch=true}
  if(ch)persist()}
migrateWords();
// make any loaded or restored data complete: design defaults, features, account balances
function normalizeState(){
  S.design=Object.assign({},DEFAULT_DESIGN,S.design||{});
  S.design.features=Object.assign({},DEFAULT_DESIGN.features,(S.design&&S.design.features)||{});
  if(!S.openings)S.openings={bank:typeof S.opening==='number'?S.opening:0,cash:0};delete S.opening;
  S.people=S.people||[];S.places=S.places||[];S.entries=S.entries||[];
  if(S.setupDone===undefined)S.setupDone=true;
  if(!S.kbOn){S.design.features.autofocus=true;S.kbOn=1} // one-time: keyboard on start is now the default
  migrateRefunds();migrateWords()}
/* ---------- first-launch setup page (every choice can be changed later in Customise) ---------- */
function setupHTML(){
  const start=UI.setupStart||'empty';
  return`<div class="sheet setup pad" role="dialog" aria-modal="true" aria-label="Set up Fils">
  <div class="shead"><h2>Welcome to ${esc(S.design.appName||'Fils')}</h2><button class="btn" data-act="setupskip">${S.setupDone?'Close':'Skip'}</button></div>
  <p class="note" style="margin-top:0">Type what you spend, like <code>spend 10 at safa</code>. Set a few things first. You can change all of it later in ☰ → Customise.</p>
  <div class="sgroup"><span class="flabel">Main currency</span>${seg('currency',CURRENCIES.map(c=>[c,c])).replace('class="seg"','class="seg cur"')}</div>
  <div class="sgroup"><span class="flabel">Money you have right now</span>
    <div class="inrow"><div class="field" style="flex:1;margin:0"><label for="s_open_bank">In the bank</label><input id="s_open_bank" inputmode="decimal" placeholder="0" value="${S.openings.bank?fmt(S.openings.bank).replace(/,/g,''):''}"></div><div class="field" style="flex:1;margin:0"><label for="s_open_cash">Cash</label><input id="s_open_cash" inputmode="decimal" placeholder="0" value="${S.openings.cash?fmt(S.openings.cash).replace(/,/g,''):''}"></div></div>
    <p class="note">Leave blank if you're not sure. Later, type <code>balance 940</code> to match what's really there.</p></div>
  <div class="sgroup"><span class="flabel">You usually pay with</span>${seg('defaultAccount',[['bank','Bank / card'],['cash','Cash']])}</div>
  <div class="sgroup"><span class="flabel">Theme</span>${seg('theme',[['system','System'],['light','Light'],['dark','Dark']])}</div>
  <div class="sgroup"><span class="flabel">Font</span>${seg('font',[['terminal','Terminal'],['plex','Plex Mono'],['space','Space Mono'],['modern','Modern']])}</div>
  <div class="sgroup"><span class="flabel">Text size</span>${seg('fontSize',[['s','Small'],['m','Medium'],['l','Large'],['xl','Extra large']])}</div>
  <div class="sgroup"><span class="flabel">Features</span>
    ${tog('features.loans','Lending and borrowing','lent, borrowed, paid back, People screen')}
    ${tog('features.places','Places','safa becomes Al Safa Restaurant')}
    ${tog('haptics','Haptics','small clicks when you save, swipe or delete')}</div>
  ${S.sample?`<div class="sgroup"><span class="flabel">Start with</span><div class="seg" role="group">${[['empty','Empty'],['sample','Example entries']].map(([v,l])=>`<button data-act="setupstart" data-val="${esc(v)}" class="${start===v?'on':''}" aria-pressed="${start===v}">${l}</button>`).join('')}</div></div>`:''}
  <div class="btns"><button class="btn pri grow" data-act="setupdone">Start using ${esc(S.design.appName||'Fils')}</button></div></div>`}
function backupHTML(){
  const json=JSON.stringify({app:'fils',version:1,savedAt:new Date().toISOString(),data:S});
  return sheetWrap('Backup and restore',`
  <div class="sgroup" style="border-top:0"><span class="flabel">Save a backup</span>
    <p class="note" style="margin-top:0">${S.entries.length} entries, ${S.places.length} places, ${S.people.length} people, your categories and design. Copy this text and keep it somewhere safe, like a note or an email to yourself. The finished app will save it as a file instead.</p>
    <textarea class="out" id="copysrc" readonly>${esc(json)}</textarea>
    <div class="btns"><button class="btn pri" data-act="copy">Copy backup</button></div></div>
  <div class="sgroup"><span class="flabel">Restore</span>
    <p class="note" style="margin-top:0">Restoring replaces everything in the app with the backup.</p>
    <div class="field"><label for="r_file">Backup file</label><input type="file" id="r_file" accept=".json,.txt,application/json,text/plain"></div>
    <div class="field"><label for="r_text">Or paste the backup text</label><textarea id="r_text" spellcheck="false"></textarea></div>
    <p class="err" id="r_err" hidden></p>
    <div class="btns"><button class="btn danger" data-act="restore">Restore backup</button></div></div>`)}
// Restore: rebuild the backup keeping only the fields Fils knows, each with a safe value,
// so a crafted backup can't slip code into IDs, colours or currency codes.
function cleanBackup(d){
  const ID=/^[A-Za-z0-9_-]{1,40}$/,COL=/^#[0-9a-fA-F]{3,8}$/,CUR=/^[A-Z]{3}$/,
    TYPES=['expense','income','refund','transfer','lent','borrowed','got_back','paid_back'];
  const str=(v,max)=>typeof v==='string'?v.slice(0,max):'';
  const num=v=>typeof v==='number'&&isFinite(v)?v:NaN;
  const id=v=>typeof v==='string'&&ID.test(v)?v:null;
  const acct=v=>v==='cash'?'cash':'bank';
  const strs=a=>Array.isArray(a)?a.filter(x=>typeof x==='string').map(x=>x.slice(0,60)).slice(0,500):[];
  const categories=d.categories.map(c=>c&&id(c.id)?{id:c.id,name:str(c.name,60)||'Category',kind:c.kind==='income'?'income':'expense',
    abbr:str(c.abbr,3)||'??',hue:typeof c.hue==='string'&&COL.test(c.hue)?c.hue:'#6b7280',synonyms:strs(c.synonyms)}:null).filter(Boolean);
  if(!categories.length)throw new Error('no categories');
  const named=(a,extra)=>(Array.isArray(a)?a:[]).map(x=>x&&id(x.id)?{id:x.id,name:str(x.name,60)||'?',aliases:strs(x.aliases),...extra(x)}:null).filter(Boolean);
  const places=named(d.places,x=>({categoryId:id(x.categoryId)})),people=named(d.people,()=>({}));
  const entries=d.entries.map(e=>{if(!e||!id(e.id)||!TYPES.includes(e.type))return null;const amount=num(e.amount),ts=num(e.ts);
    if(!(amount>=0)||!(ts>0))return null;
    const o={id:e.id,type:e.type,amount,currency:typeof e.currency==='string'&&CUR.test(e.currency)?e.currency:'KWD',account:acct(e.account),
      categoryId:id(e.categoryId),placeId:id(e.placeId),personId:id(e.personId),note:str(e.note,500),ts};
    if(e.type==='transfer')o.toAccount=acct(e.toAccount);return o}).filter(Boolean);
  const dd=(d.design&&typeof d.design==='object')?d.design:{},D=DEFAULT_DESIGN,design={};
  for(const k in D){if(k==='features')continue;const v=dd[k],def=D[k];
    if(typeof def==='boolean')design[k]=typeof v==='boolean'?v:def;
    else if(k==='accent'||k==='income'||k==='expense')design[k]=typeof v==='string'&&COL.test(v)?v:def;
    else if(k==='currency')design[k]=typeof v==='string'&&CUR.test(v)?v:def;
    else if(k==='appName')design[k]=str(v,30)||def;
    else design[k]=typeof v==='string'&&/^[a-z0-9_-]{1,20}$/i.test(v)?v:def}
  const df=(dd.features&&typeof dd.features==='object')?dd.features:{};design.features={};
  for(const k in D.features)design.features[k]=typeof df[k]==='boolean'?df[k]:D.features[k];
  const ob=d.openings||{};
  return{v:1,sample:d.sample===true,setupDone:true,kbOn:1,detailsBack:true,design,categories,places,people,entries,
    openings:{bank:num(ob.bank)||(typeof d.opening==='number'&&isFinite(d.opening)?d.opening:0),cash:num(ob.cash)||0}};
}
function doRestore(btn){const err=$('#r_err');const txt=($('#r_text').value||'').trim();
  const fail=m=>{err.textContent=m;err.hidden=false};
  if(!txt)return fail('Choose a backup file or paste the backup text first.');
  let o;try{o=JSON.parse(txt)}catch(e){return fail("That isn't a valid backup. Paste the whole text, from the first { to the last }.")}
  const d=o&&o.data?o.data:o;
  if(!d||!Array.isArray(d.entries)||!Array.isArray(d.categories))return fail("That text doesn't look like a Fils backup.");
  let clean;try{clean=cleanBackup(d)}catch(e){return fail("That text doesn't look like a Fils backup.")}
  if(!armed(btn,'Tap again to replace everything'))return;
  S=clean;normalizeState();persist();
  UI.pending=null;UI.batch=null;UI.filter=noFilter();UI.search='';UI.searchOpen=false;UI.view='home';UI.sheet=null;
  UI.toast={ids:[],learned:['Backup restored: '+S.entries.length+' entries.']};render();clearTimeout(UI.tt);UI.tt=setTimeout(()=>{UI.toast=null;renderPending()},7000)}
const isLoan=t=>t==='lent'||t==='borrowed'||t==='got_back'||t==='paid_back';
const dec=c=>c==='KWD'||c==='BHD'||c==='OMR'?3:2;
// show money as written: 25.65 not 25.650, 23 not 23.000 (up to 3 decimals for KWD, 2 for others)
// INR uses Indian grouping (12,50,000); 2-decimal currencies keep both decimals when there are any (32,500.50)
const fmt=(n,c)=>{c=c||S.design.currency;const d=dec(c),v=Number(n);const whole=Math.abs(v-Math.round(v))<1e-9;
  return v.toLocaleString(c==='INR'?'en-IN':'en-US',{minimumFractionDigits:whole?0:(d===2?2:0),maximumFractionDigits:d})};
const fmt0=n=>fmt(n); // home tiles use the same trimmed format
const mk=ts=>{const d=new Date(ts);return d.getFullYear()*12+d.getMonth()};
const dayKey=ts=>{const d=new Date(ts);return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()};
const hm=ts=>{const d=new Date(ts);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
function dayLabel(ts){const d=new Date(ts),t=new Date();const y=new Date();y.setDate(t.getDate()-1);
  if(dayKey(ts)===dayKey(t))return 'Today';if(dayKey(ts)===dayKey(y))return 'Yesterday';
  return DAYS[d.getDay()]+' '+d.getDate()+' '+MONTHS_FULL[d.getMonth()].slice(0,3)+(d.getFullYear()!==t.getFullYear()?' '+d.getFullYear():'')}
function balance(pid){let b=0;for(const e of S.entries){if(e.personId!==pid||e.currency!==S.design.currency)continue;
  if(e.type==='lent'||e.type==='paid_back')b+=e.amount;else if(e.type==='borrowed'||e.type==='got_back')b-=e.amount}return r3(b)}
// all-time running cash: starting balance + money in (income, refunds, borrowed, repaid to you) - money out (spending, lent, you repaid)
const ACCT_NAME={bank:'Bank',cash:'Cash'};
const acctOf=e=>e.account||'bank';
const otherAcct=a=>a==='bank'?'cash':'bank';
function balances(){const b={bank:S.openings.bank||0,cash:S.openings.cash||0};
  for(const e of S.entries){if(e.currency!==S.design.currency)continue;const a=acctOf(e);
    if(e.type==='transfer'){b[a]-=e.amount;b[e.toAccount||otherAcct(a)]+=e.amount}
    else if(e.type==='income'||e.type==='refund'||e.type==='borrowed'||e.type==='got_back')b[a]+=e.amount;else b[a]-=e.amount}
  return{bank:r3(b.bank),cash:r3(b.cash)}}
function cashInHand(){const b=balances();return r3(b.bank+b.cash)}
function owedTotals(){let toYou=0,youOwe=0;for(const p of S.people){const b=balance(p.id);if(b>0)toYou+=b;else youOwe-=b}return{toYou:r3(toYou),youOwe:r3(youOwe)}}

/* ---------- name matching ---------- */
/* ---------- built-in word list: common words, Gulf shops and brands per category ----------
   Read-only and kept apart from your own words: your words are always checked first, so moving a word
   to another category (by picking it once, or in Manage) wins over this list. */
const BUILTIN_WORDS={
 food:'brunch, supper, meal, meals, takeaway, takeout, delivery, talabat, deliveroo, keeta, jahez, carriage, cari, mcdonalds, mcdonald\'s, kfc, burger king, hardees, pizza hut, dominos, papa johns, subway, starbucks, tim hortons, costa, caribou, dunkin, krispy kreme, shake shack, five guys, nandos, texas chicken, popeyes, chilis, applebees, cheesecake factory, johnny rockets, baskin robbins, sushi, biryani, mandi, machboos, kabsa, falafel, foul, kebab, grill, bbq, noodles, pasta, sandwich, sandwiches, wrap, salad, steak, seafood, dessert, desserts, ice cream, cake, juice, smoothie, latte, cappuccino, espresso, mocha, frappe, chai, donut, donuts, croissant, bakery, sweets, kunafa, chocolate, snacks, drinks, soda, cola, energy drink, water bottle, canteen, cafeteria, food court',
 groceries:'lulu, lulu hypermarket, sultan center, tsc, city centre, geant, oncost, saveco, spinneys, waitrose, monoprix, union coop, grandiose, hypermarket, minimarket, baqala, bakala, meat, chicken, fish, rice, milk, bread, eggs, dates, cheese, yogurt, laban, butter, flour, sugar, spices, tissues, detergent, cleaning supplies, household',
 transport:'bolt, hala, cab, train, tram, toll, salik, nol, ride, lyft, gas station, fuel station, petrol station, oula, knpc, soor, adnoc, enoc, aramco',
 car:'car repair, mechanic, service center, garage, car battery, tire, tyre, car registration, istimara, driving license, car rental, rental car, car parts',
 housing:'apartment, landlord, plumber, electrician, ac repair, ac service, cleaning, cleaner, maid, housekeeping, ikea, home centre, pan emirates, ace hardware, true value, hardware, paint',
 bills:'zain, ooredoo, stc, viva, du, etisalat, mobily, virgin mobile, mobile recharge, data package, broadband, fiber, fibre, gas bill, cooking gas, gas cylinder, municipality, subscription, subscriptions, insurance, icloud, google one, chatgpt, microsoft 365, office 365, dropbox, vpn, domain, hosting',
 shopping:'zara, h&m, hm, shein, noon, namshi, ounass, xcite, eureka, best al yousifi, virgin megastore, jarir, sharaf dg, apple store, samsung, centrepoint, splash, lc waikiki, uniqlo, nike, adidas, puma, bag, bags, watch, watches, smartwatch, apple watch, citizen, casio, seiko, rolex, swatch, tissot, fossil, g-shock, marketplace, facebook marketplace, opensooq, olx, 4sale, dubizzle, ebay, aliexpress, temu, online shopping, online order, facebook, instagram, insta, tiktok shop, online, earbuds, earphones, headset, speaker, speakers, phone case, case, cover, screen protector, power bank, powerbank, adapter, keyboard, mouse, monitor, tablet, ipad, macbook, pc, computer, printer, camera, console, controller, hard drive, ssd, usb, memory card, smart tv, shirt, shirts, t-shirt, tshirt, jeans, pants, trousers, jacket, hoodie, sweater, dress, skirt, socks, underwear, sneakers, sandals, slippers, cap, hat, belt, wallet, suit, jersey, kandura, ghutra, shemagh, pillow, bedsheet, towel, towels, curtains, lamp, kitchenware, utensils, pots, pans, plates, mug, home decor, decor, accessories, jewellery, jewelry, gold, headphones, airpods, charger, cable, tv, appliance, appliances, gadget, gadgets, sunglasses, toys, abaya, dishdasha, thobe, 360 mall, marina mall, al kout mall, assima, dubai mall, mall of the emirates',
 health:'gym, gym membership, fitness, workout, trainer, personal trainer, pt session, crossfit, yoga, pilates, protein, supplements, vitamins, whey, creatine, physio, physiotherapy, lab test, blood test, checkup, check up, scan, xray, x-ray, mri, optician, glasses, contact lenses, eye test, health insurance, medication, meds, prescription, therapy, therapist, vaccine, swimming',
 care:'perfume, cologne, makeup, skincare, cosmetics, sephora, faces, bath and body works, shampoo, toiletries, deodorant, razor, spa, massage, nails, manicure, pedicure, threading, waxing, grooming, dry cleaning, ironing, tailor',
 fun:'watch movie, watch a movie, watch the game, shisha, hookah, concert, show, theatre, theater, bowling, arcade, karting, go karting, escape room, trampoline, theme park, water park, zoo, museum, event, events, playstation, ps5, psn, xbox, nintendo, steam, game, gaming, youtube premium, anghami, shahid, osn, disney plus, prime video, apple music, apple tv, hobby, hobbies, football, padel',
 travel:'flights, airline, airfare, kuwait airways, jazeera, jazeera airways, emirates, qatar airways, flydubai, booking.com, agoda, hotels, resort, hostel, luggage, baggage, travel insurance, trip, vacation, holiday, tour, hajj, umrah',
 gifts:'wedding gift, birthday gift, birthday, wedding, present, flowers, sadaqah, sadaqa, mosque, mosque donation, fitrah, zakat al fitr, remittance, money home',
 education:'tuition, school, school fees, university, college, class, classes, lesson, lessons, tutor, tutoring, udemy, coursera, linkedin learning, stationery, notebook, pens, ielts, toefl, workshop, seminar, conference',
 fees:'visa fee, passport, residency, iqama, civil id, paci, government fee, stamps, post office, courier, aramex, dhl, shipping, delivery fee, late fee, penalty, traffic fine, service charge, commission, annual fee',
 other:'cigarettes, cigs, tobacco, vape, pet, pets, cat food, dog food, vet',
 salary:'paycheck, monthly salary, overtime, allowance, housing allowance, end of service',
 freelance:'invoice, upwork, fiverr, gig, side job, side hustle',
 giftin:'eidi, gift money, birthday money',
 otherin:'dividend, dividends, profit, resale, rental income, prize, winnings, reimbursement, reimbursed'
};
const BUILTIN=Object.fromEntries(Object.entries(BUILTIN_WORDS).map(([k,v])=>[k,v.split(',').map(x=>x.trim()).filter(Boolean)]));
const catWords=c=>[c.name,...c.synonyms,...(BUILTIN[c.id]||[])];
// category-name words that add nothing as a note ("groceries 20" keeps no note)
const GENERIC_CAT=new Set([...CAT_DEF.flatMap(c=>[c[0],c[1],...c[1].split(/ & | /)]),'grocery','bill','fee','charges','gift','misc','income','other income','expense','spending','stuff'].map(w=>nn(w)).filter(Boolean));
function nn(s){s=String(s).toLowerCase().replace(/^[@#]+/,'').replace(/[^a-z0-9؀-ۿ]+/g,'');if(s.length>5&&/^(al|el)/.test(s))s=s.slice(2);return s}
function lev(a,b){if(a===b)return 0;const m=a.length,n=b.length;if(!m)return n;if(!n)return m;let p=[];for(let j=0;j<=n;j++)p[j]=j;
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}return p[n]}
function closeness(typed,name,strict){const a=nn(typed),b=nn(name);if(!a||!b)return -1;if(a===b)return 0;if(strict)return -1;
  if(a.length<3||b.length<4)return -1;const d=lev(a,b);return d<=(Math.max(a.length,b.length)>=8?2:1)?d:-1}
const placeNames=p=>[p.name,...(p.aliases||[])];
const personNames=p=>[p.name,...(p.aliases||[])];
function best(items,namesOf,text,strict){let bd=99,res=[];for(const it of items){let d=99;for(const n of namesOf(it)){const c=closeness(text,n,strict);if(c>=0&&c<d)d=c}
  if(d<bd){bd=d;res=[it]}else if(d===bd&&d<99)res.push(it)}return bd<99?res:[]}
// find a run of 1-3 words in arr that names an item; 'tight' only allows typos for 5+ letter words
function scan(arr,items,namesOf,tight){for(let n=Math.min(3,arr.length);n>=1;n--)for(let i=0;i+n<=arr.length;i++){
  const g=arr.slice(i,i+n).join(' ');const strict=tight&&nn(g).length<5;const m=best(items,namesOf,g,strict);
  if(m.length)return{items:m,text:g,rest:arr.slice(0,i).concat(arr.slice(i+n))}}return null}
// userOnly: skip the built-in list (used for "at X": a built-in shop name there is a new place, not just a category)
function scanCats(arr,pool,userOnly){for(let n=Math.min(3,arr.length);n>=1;n--)for(let i=0;i+n<=arr.length;i++){
  const g=arr.slice(i,i+n).join(' '),gn=nn(g);if(!gn)continue;
  for(const c of pool){for(const w of [c.name,...c.synonyms]){if(nn(w)===gn)return{cat:c,word:g,rest:arr.slice(0,i).concat(arr.slice(i+n))}}}
  if(!userOnly&&!S.categories.some(o=>o.synonyms.some(y=>nn(y)===gn)))for(const c of pool){for(const w of BUILTIN[c.id]||[]){if(nn(w)===gn)return{cat:c,word:g,rest:arr.slice(0,i).concat(arr.slice(i+n))}}}
  if(gn.length>=5)for(const c of pool){for(const w of userOnly?[c.name,...c.synonyms]:catWords(c)){const wn=nn(w);if(wn.length>=5&&lev(gn,wn)<=1)return{cat:c,word:g,rest:arr.slice(0,i).concat(arr.slice(i+n))}}}
}return null}
function personExact(arr){const r=takePerson(arr);return r&&r.match.length===1&&personNames(r.match[0]).some(n=>nn(n)===nn(r.text))?r:null}
function takePerson(arr){for(const n of [2,1]){if(arr.length>=n){const txt=arr.slice(0,n).join(' ');const m=best(S.people,personNames,txt,false);if(m.length)return{match:m,rest:arr.slice(n),text:txt}}}return null}

/* ---------- parser ---------- */
const MON={jan:0,january:0,feb:1,february:1,mar:2,march:2,apr:3,april:3,may:4,jun:5,june:5,jul:6,july:6,aug:7,august:7,sep:8,sept:8,september:8,oct:9,october:9,nov:10,november:10,dec:11,december:11};
const WDS={sun:0,sunday:0,mon:1,monday:1,tue:2,tues:2,tuesday:2,wed:3,wednesday:3,thu:4,thur:4,thurs:4,thursday:4,fri:5,friday:5,sat:6,saturday:6};
const CUR={kd:'KWD',kwd:'KWD',dinar:'KWD',dinars:'KWD',usd:'USD','$':'USD',dollar:'USD',dollars:'USD',sgd:'SGD',aed:'AED',dirham:'AED',dirhams:'AED',sar:'SAR',riyal:'SAR',riyals:'SAR',qar:'QAR',inr:'INR',rupees:'INR',eur:'EUR','€':'EUR',euro:'EUR',euros:'EUR',gbp:'GBP','£':'GBP',bhd:'BHD',omr:'OMR',myr:'MYR',rm:'MYR',ringgit:'MYR'};
const EXP_V=new Set(['spent','spend','spending','paid','pay','paying','bought','buy','purchased','cost','costs']);
const INC_V=new Set(['got','get','received','receive','earned','earn','credited']);
const INC_W=new Set(['salary','bonus','income','eidiya']);
const REFUND_W=new Set(['refund','refunded','cashback']);
const LEND_V=new Set(['lent','lend','loaned','loan']);
const BORROW_V=new Set(['borrowed','borrow']);
const BACK_V=new Set(['repaid','repay','returned','return','settled']);
const GIVE_V=new Set(['gave','give','sent']);
const FILL=new Set(['the','a','an','some','of','and','my','i','me','by','via','with','just','money','in','back','took','had','have','has','having','also','owe','owes','owed','transfer','transferred','moved','move']);
const GENERIC=new Set(['bill','bills','payment','payments','charge','charges','purchase','stuff','thing','things']);
const VERBS_ALL=new Set([...EXP_V,...INC_V,...LEND_V,...BORROW_V,...BACK_V,...GIVE_V,'i','back','took']);
const NW={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
const isNW=x=>Object.prototype.hasOwnProperty.call(NW,x);
// "ten" -> 10, "two fifty" -> 250, "twenty five" -> 25, "a hundred" -> 100, "half" -> 0.5
function wordsToNum(t){const out=[];let i=0;
  while(i<t.length){const w=t[i];
    if(w==='half'){out.push('0.5');i++;continue}
    if(isNW(w)||(w==='a'&&(t[i+1]==='hundred'||t[i+1]==='thousand'))){
      let total=0,cur=0,lastUnit=false,j=i;
      while(j<t.length){const x=t[j];
        if(isNW(x)){const v=NW[x];if(lastUnit&&v>=20&&cur<10)cur=cur*100+v;else cur+=v;lastUnit=v<10;j++}
        else if(x==='a'&&(t[j+1]==='hundred'||t[j+1]==='thousand')){cur=1;j++}
        else if(x==='hundred'){cur=(cur||1)*100;lastUnit=false;j++}
        else if(x==='thousand'){total+=(cur||1)*1000;cur=0;lastUnit=false;j++}
        else if(x==='and'&&j>i&&isNW(t[j+1]||'')){j++}
        else break}
      out.push(String(total+cur));i=j;continue}
    out.push(w);i++}
  return out}
const CONN=new Set(['at','to','from','for','on']);
const REMOVE=new Set([...EXP_V,...INC_V,...LEND_V,...BORROW_V,...BACK_V,...GIVE_V,...FILL,...REFUND_W]);
const catKind=type=>type==='income'?'income':'expense'; // refunds use expense categories

function parse(raw){
  const f=F(),now=new Date();
  let s=raw.toLowerCase();
  s=s.replace(/(\d),(?=\d{3}\b)/g,'$1').replace(/([$€£])\s*(\d)/g,'$1 $2').replace(/(\d)\s*([$€£])/g,'$1 $2')
     .replace(/(\d)(kd|kwd|usd|sgd|aed|sar|qar|inr|eur|gbp|bhd|omr|myr|rm|fils)\b/g,'$1 $2').replace(/\b(kd|kwd|usd|sgd|aed|sar|qar|inr|eur|gbp|myr|rm)(\d)/g,'$1 $2')
     .replace(/[,;!?"()]+/g,' ').replace(/\.(?=\s|$)/g,' ').replace(/\s+/g,' ').trim();
  const SUM=/(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)/;
  while(SUM.test(s))s=s.replace(SUM,(m,a,b)=>String(r3(+a + +b)));
  let t=s.split(' ').filter(Boolean);
  if(!/\d/.test(s))t=wordsToNum(t);
  if(!f.shortcuts)t=t.map(x=>x.replace(/^[@#]+/,'')).filter(Boolean);
  const d=new Date(now);let dateSet=false;
  // time of day: "3pm", "3:30 pm", "14:30"
  for(let i=0;i<t.length;i++){
    let h=null,mi=0,used=1,m=t[i].match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
    if(!m&&/^\d{1,2}(:\d{2})?$/.test(t[i])&&(t[i+1]==='am'||t[i+1]==='pm')){m=(t[i]+t[i+1]).match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);used=2}
    if(m){h=(+m[1])%12+(m[3]==='pm'?12:0);mi=+(m[2]||0)}
    else{const m2=t[i].match(/^(\d{1,2}):(\d{2})$/);if(m2){h=+m2[1];mi=+m2[2]}}
    if(h!=null&&h<24&&mi<60){d.setHours(h,mi,0,0);dateSet=true;let st=i;if(t[st-1]==='at')st--;t.splice(st,used+(i-st));i=st-1}
  }
  // date: today, yesterday, day before yesterday, (last) friday, 15 nov, nov 15, 15/11
  for(let i=0;i<t.length;i++){
    const w=t[i];let n=0,delta=null,abs=null;
    if(w==='today'){n=1;delta=0}
    else if(w==='yesterday'){n=1;delta=1}
    else if(w==='day'&&t[i+1]==='before'&&t[i+2]==='yesterday'){n=3;delta=2}
    else if(w in WDS){let back=(now.getDay()-WDS[w]+7)%7;if(t[i-1]==='last'){if(back===0)back=7;i--;n=2}else n=1;delta=back}
    else if(w in MON){const nx=(t[i+1]||'').match(/^(\d{1,2})(st|nd|rd|th)?$/),pv=(t[i-1]||'').match(/^(\d{1,2})(st|nd|rd|th)?$/);
      if(nx){abs=[+nx[1],MON[w],null];n=2}else if(pv){i--;abs=[+pv[1],MON[w],null];n=2}}
    else{const m=w.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/);if(m){abs=[+m[1],+m[2]-1,m[3]?(+m[3]<100?2000+(+m[3]):+m[3]):null];n=1}}
    if(n){dateSet=true;
      if(delta!=null)d.setFullYear(now.getFullYear(),now.getMonth(),now.getDate()-delta);
      else{const y=abs[2]??now.getFullYear();d.setFullYear(y,abs[1],abs[0]);if(abs[2]==null&&d>now)d.setFullYear(y-1)}
      let st=i;if(t[st-1]==='on')st--;t.splice(st,n+(i-st));i=st-1;
    }
  }
  // quantity: with two numbers, a small whole number right before a word is how many ("2 coffees 1" = 1 KD for 2 coffees)
  const isNum=x=>/^(\d+(\.\d+)?|\.\d+)$/.test(x);
  let qty=null;{const nums=t.map((x,i)=>isNum(x)?i:-1).filter(i=>i>=0);
    if(nums.length>=2)for(const i of nums){const v=parseFloat(t[i]),nx=t[i+1]||'';
      if(Number.isInteger(v)&&v>=1&&v<=50&&nx&&!isNum(nx)&&!CUR[nx]&&nx!=='fils'&&!CONN.has(nx)&&!REMOVE.has(nx)&&nx!=='each'&&nx!=='per'){qty=v;t[i]='q:'+t[i];break}}}
  // amount + currency
  let amount=null,currency=null;const extra=[];
  for(let i=0;i<t.length;i++){
    if(/^(\d+(\.\d+)?|\.\d+)$/.test(t[i])){
      const v=parseFloat(t[i]);
      if(amount==null){amount=v;t.splice(i,1);if(t[i]==='fils'){amount=v/1000;currency='KWD';t.splice(i,1)}i--}
      else{extra.push(t[i]);t.splice(i,1);i--}
    }
  }
  for(let i=0;i<t.length;i++)if(CUR[t[i]]){currency=currency||CUR[t[i]];t.splice(i,1);i--}
  t=t.filter(x=>x!=='fils');
  // "2 coffees 1 each" = 2 x 1; otherwise the price is the total. The quantity stays in the note.
  if(qty&&amount!=null&&(t.includes('each')||t.includes('per')))amount=amount*qty;
  t=t.filter(x=>x!=='each'&&x!=='per').map(x=>x.startsWith('q:')?x.slice(2):x);
  if(amount==null||!(amount>0))return{error:'Add an amount, like 10 or 2.500'};
  currency=currency||S.design.currency;
  // which account paid: "cash" -> Cash; card/knet/visa/bank -> Bank; otherwise the default account
  const BANKW=new Set(['card','knet','visa','mastercard','bank','debit','credit','applepay']);
  let account=null;if(t.includes('cash'))account='cash';else if(t.some(x=>BANKW.has(x)))account='bank';
  // first real word, skipping a leading payment method ("by card borrowed 40 from ali", "in cash paid ali back 20")
  const lead=t.find(x=>x!=='cash'&&!BANKW.has(x)&&!['by','in','with','via','using'].includes(x))||'';
  // "transfer/moved 50 to cash" (or "to bank"): where the money went
  const toI=t.findIndex((x,i)=>x==='to'&&(t[i+1]==='cash'||BANKW.has(t[i+1]||'')));
  const moveTo=toI>=0?(t[toI+1]==='cash'?'cash':'bank'):null;
  t=t.filter(x=>x!=='cash'&&!BANKW.has(x));
  const base={raw,amount:r3(amount),currency,account:account||S.design.defaultAccount||'bank',ts:d.getTime(),dateSet,extraWarn:extra.length?extra.join(', '):null};
  // moving money between your own accounts is not spending
  if(t.some(x=>['atm','withdrew','withdraw','withdrawal','withdrawn'].includes(x)))return{d:{...base,type:'transfer',account:'bank',toAccount:'cash',note:''}};
  if(t.some(x=>['deposited','deposit'].includes(x)))return{d:{...base,type:'transfer',account:'cash',toAccount:'bank',note:''}};
  if(moveTo&&t.some(x=>['transfer','transferred','moved','move','put'].includes(x)))return{d:{...base,type:'transfer',account:otherAcct(moveTo),toAccount:moveTo,note:''}};

  // what kind of entry
  const has=set=>t.some(x=>set.has(x)),hasW=w=>t.includes(w);
  let loanHint=null;
  if(f.loans){
    if(hasW('back')||has(BACK_V)){
      if(has(INC_V))loanHint='got_back';
      else{const first=lead;const verbs=new Set([...EXP_V,...BACK_V,...GIVE_V,'back','i','to','from']);loanHint=(first&&!verbs.has(first))?'got_back':'paid_back'}
    }else if(has(LEND_V))loanHint=hasW('me')?'borrowed':'lent';           // "ali lent me 20" = you borrowed
    else if(has(BORROW_V)){const first=lead;loanHint=(first&&!VERBS_ALL.has(first)&&!CONN.has(first))?'lent':'borrowed'} // "ali borrowed 20" = you lent
    else if(hasW('took')&&hasW('from'))loanHint='borrowed';
    // "ali owes me 20" = Ali owes you (lent); "i owe sara 50" = you owe Sara (borrowed)
    else if(hasW('owes')||(hasW('owe')&&hasW('me')&&lead!=='i'))loanHint='lent';
    else if(hasW('owe'))loanHint='borrowed';
    // "gave ali 20" = lent, but "mom gave me 50" is money coming in (handled below)
    else if(has(GIVE_V)&&!hasW('me'))loanHint='lent';
  }
  const giveOnly=loanHint==='lent'&&has(GIVE_V)&&!has(LEND_V);
  const paidVerb=t.some(x=>x==='paid'||x==='pay'||x==='paying');

  // split the rest into slots by connector words
  const slots={pre:[],at:[],to:[],from:[],for:[],on:[]};let cur='pre';const forcedP=[],forcedPl=[];
  for(const w of t){
    if(w.startsWith('@')&&w.length>1){forcedP.push(w.slice(1));continue}
    if(w.startsWith('#')&&w.length>1){forcedPl.push(w.slice(1));continue}
    if(CONN.has(w)){cur=w;continue}
    if(REMOVE.has(w))continue;
    slots[cur].push(w);
  }
  const leftover=()=>[...slots.pre,...slots.on,...slots.for,...slots.from,...slots.to,...slots.at].filter(w=>!GENERIC.has(w)).join(' ');

  // income or expense: income words, or an income category word with no expense category word
  const allWords=[...slots.pre,...slots.on,...slots.for,...slots.from,...slots.to,...slots.at];
  const expHit=scanCats(allWords,S.categories.filter(c=>c.kind==='expense'));
  const incHit=scanCats(allWords,S.categories.filter(c=>c.kind==='income'));
  const incomeish=has(INC_W)||(has(GIVE_V)&&hasW('me'))||(has(INC_V)?!(expHit&&!incHit):(!!incHit&&(!expHit||incHit.word.split(' ').length>expHit.word.split(' ').length)));

  // money coming from someone you know: "received 20 from ali", "ali gave me 20", "ali paid 20"
  if(f.loans&&!forcedPl.length&&!hasW('back')&&!has(BACK_V)&&!has(LEND_V)&&!has(BORROW_V)){
    let r=null,src=null;
    if(has(INC_V)&&slots.from.length){r=personExact(slots.from);src='from'}
    else if((has(GIVE_V)||paidVerb)&&t[0]&&!VERBS_ALL.has(t[0])&&!CONN.has(t[0])&&slots.pre.length){r=personExact(slots.pre);src='pre'}
    if(r){slots[src]=r.rest;const p=r.match[0],b=balance(p.id),note=leftover();
      if(b>0)return{d:{...base,type:'got_back',personId:p.id,note}};
      const withName=[p.name,note].filter(Boolean).join(' · ');
      return{d:{...base,type:'income',note:withName,altsTitle:'Money from '+p.name+'?',alts:[
        {label:'Borrowed from '+p.name,sub:balLabel(p),d:{...base,type:'borrowed',personId:p.id,note}},
        {label:'Gift from '+p.name,sub:'Income · Gift received',d:{...base,type:'income',catId:catById('giftin')?'giftin':null,note:withName}},
        {label:'Other income',sub:'Pick a category next',d:{...base,type:'income',catId:null,note:withName}}]}};
    }
    // "mom gave me 50" with someone new: still money coming in, never a loan you gave
    else if(src==='pre'&&has(GIVE_V)&&hasW('me')){const w=slots.pre.find(x=>!S.categories.some(c=>catWords(c).some(y=>nn(y)===nn(x))));
      if(w){slots.pre=slots.pre.filter(x=>x!==w);const nm=title(w),note=leftover(),withName=[nm,note].filter(Boolean).join(' · ');
        return{d:{...base,type:'income',note:withName,altsTitle:'Money from '+nm+'?',alts:[
          {label:'Borrowed from '+nm,sub:'New person',d:{...base,type:'borrowed',newPersonName:nm,note}},
          {label:'Gift from '+nm,sub:'Income · Gift received',d:{...base,type:'income',catId:catById('giftin')?'giftin':null,note:withName}},
          {label:'Other income',sub:'Pick a category next',d:{...base,type:'income',catId:null,note:withName}}]}}}}
  }

  // refunds only when the word refund / refunded / cashback is used; "back" always means a loan
  // loans
  if(loanHint){
    let person=null,newName=null,alts=null;
    if(forcedP.length){const txt=forcedP.join(' ');const m=best(S.people,personNames,txt,true);if(m.length)person=m[0];else newName=txt}
    else{
      // 1) look for someone you already know, anywhere in the sentence
      const order=(loanHint==='lent'||loanHint==='paid_back')?['to','pre','for','from']:['from','pre','to','for'];
      for(const k of order){if(!slots[k].length)continue;const r=takePerson(slots[k]);
        if(r){slots[k]=r.rest;if(r.match.length>1)alts=r.match;else person=r.match[0];break}}
      // 2) otherwise treat the first word that isn't a category word as a new person ("for rent" stays a note)
      const isCatWord=w=>S.categories.some(c=>catWords(c).some(x=>nn(x)===nn(w)));
      // "gave 10 to charity box": giving to a category (charity, zakat) is spending, not a loan to someone new
      const givingToCat=giveOnly&&[...slots.pre,...slots.to,...slots.for,...slots.from].some(isCatWord);
      if(!person&&!alts&&!givingToCat){
        const order2=(loanHint==='lent'||loanHint==='paid_back')?['to','pre','from','for']:['from','pre','to','for'];
        for(const k of order2){const i=slots[k].findIndex(w=>!isCatWord(w));if(i<0)continue;newName=slots[k][i];slots[k]=slots[k].filter((_,j)=>j!==i);break}
      }
    }
    if(person||newName||alts){
      const dd={...base,type:loanHint,personId:person?person.id:null,newPersonName:newName?title(newName):null,note:leftover()};
      if(alts){dd.altsTitle='Which person?';dd.alts=alts.map(p=>({label:p.name,sub:balLabel(p),d:{...dd,personId:p.id,alts:null}}))}
      return{d:dd};
    }
  }
  // "paid 8 for ali lunch" = paid on someone's behalf
  if(f.loans&&!incomeish&&(slots.for.length||forcedP.length)){
    let person=null,rest=slots.for;
    if(forcedP.length){const m=best(S.people,personNames,forcedP.join(' '),true);if(m.length)person=m[0];else return{d:{...base,type:'lent',newPersonName:title(forcedP.join(' ')),note:leftover()}}}
    else{const r=takePerson(slots.for);if(r&&r.match.length===1&&closeness(r.text,r.match[0].name,true)===0||r&&r.match.length===1&&(r.match[0].aliases||[]).some(a=>nn(a)===nn(r.text))){person=r.match[0];rest=r.rest}}
    if(person){slots.for=rest;return{d:{...base,type:'lent',personId:person.id,note:leftover()}}}
  }

  // expenses and income
  const kind=has(REFUND_W)?'refund':incomeish?'income':'expense';
  const pool=S.categories.filter(c=>c.kind===catKind(kind));
  let place=null,placeAlts=null,newPlace=null,placeTxt=null,catId=null,catWord=null;
  if(f.places){
    const atWords=forcedPl.length?forcedPl:slots.at;
    if(atWords.length){
      const txt=atWords.join(' ');const m=best(S.places,placeNames,txt,false);
      if(m.length){if(m.length===1)place=m[0];else placeAlts=m;if(!forcedPl.length)slots.at=[]}
      else{const r=scan(atWords,S.places,placeNames,true);
        if(r&&r.items.length===1){place=r.items[0];if(!forcedPl.length)slots.at=r.rest}
        else{const cr=scanCats(atWords,pool,true);if(!(cr&&cr.rest.length===0)){newPlace=txt;if(!forcedPl.length)slots.at=[]}}}
    }else{
      for(const k of ['pre','for','on','from','to']){const r=scan(slots[k],S.places,placeNames,true);
        if(r){if(r.items.length===1)place=r.items[0];else placeAlts=r.items;placeTxt=r.text;slots[k]=r.rest;break}}
    }
  }
  for(const k of ['pre','on','for','from','to','at']){const r=scanCats(slots[k],pool);if(r){catId=r.cat.id;catWord=r.word;slots[k]=r.rest;break}}
  if(!catId&&place){const pc=catById(place.categoryId);if(pc&&pc.kind===catKind(kind))catId=pc.id}
  if(!catId&&newPlace){const r=scanCats(newPlace.split(' '),pool);if(r)catId=r.cat.id} // new place known to the built-in list, e.g. "at talabat"
  // known person written without "at", e.g. "paid ali 20" or "paid 20 to ali"
  let payee=null;
  if(f.loans&&kind==='expense'&&!place&&!placeAlts&&!newPlace){
    for(const k of ['to','pre']){
      if(!slots[k].length||(k==='pre'&&!paidVerb))continue;
      const r=takePerson(slots[k]);
      if(r&&r.match.length===1&&r.match[0].aliases.concat(r.match[0].name).some(n=>nn(n)===nn(r.text))){payee=r.match[0];slots[k]=r.rest;break}
    }
  }
  let note=leftover();
  if(payee)note=[payee.name,note].filter(Boolean).join(' ');
  // keep the word that picked the category in the note when it says what was bought ("earbuds", "citizen"),
  // in the order it was typed; plain category words ("groceries", "shopping") stay out
  if(catWord&&!GENERIC_CAT.has(nn(catWord))&&!(' '+note+' ').includes(' '+catWord.toLowerCase()+' ')){
    const toks=String(raw).toLowerCase().split(/\s+/),at=w=>{const i=toks.indexOf(w.toLowerCase());return i<0?99:i};
    note=[...catWord.split(' '),...(note?note.split(' '):[])].sort((a,b)=>at(a)-at(b)).join(' ')}
  const learn=(!catId&&!place&&!placeAlts&&!newPlace&&!payee&&leftover()&&leftover().split(' ').length<=3)?leftover():null;
  const dd={...base,type:kind,catId,placeId:place?place.id:null,note,learn,
    newPlace:newPlace?{name:title(newPlace),aliases:mkAliases(newPlace)}:null};
  if(newPlace)dd.note=leftover();
  if(placeAlts){dd.altsTitle='Which place?';dd.alts=placeAlts.map(p=>({label:p.name,sub:catById(p.categoryId)?.name||'',d:{...dd,placeId:p.id,catId:dd.catId||p.categoryId,alts:null}}))}
  // same name for a person and a place, no "at" to tell them apart
  if(f.loans&&kind==='expense'&&place&&placeTxt&&paidVerb){
    const pm=best(S.people,personNames,placeTxt,true);
    if(pm.length){const p=pm[0];dd.altsTitle='Which '+p.name+'?';
      dd.alts=[{label:place.name,sub:catById(place.categoryId)?.name||'Place',d:{...dd,alts:null}},...personAlts(p,base,leftover())]}
  }
  if(payee&&balance(payee.id)<0){
    dd.altsTitle='Repayment to '+payee.name+'?';
    dd.alts=[{label:'Yes, repay '+payee.name,sub:'You owe '+fmt(-balance(payee.id)),d:{...base,type:'paid_back',personId:payee.id,note:leftover()}},
             {label:'No, it was an expense',sub:'Paid '+payee.name+' for something',d:{...dd,alts:null}}];
  }else if(payee){
    dd.altsTitle='What was the '+fmt(base.amount,base.currency)+' to '+payee.name+'?';
    dd.alts=[{label:'Lent to '+payee.name,sub:balLabel(payee),d:{...base,type:'lent',personId:payee.id,note:leftover()}},
             {label:'Paid '+payee.name+' for something',sub:'Expense, pick a category next',d:{...dd,alts:null}}];
  }
  return{d:dd};
}
function mkAliases(txt){const a=[txt];const w=txt.split(' ');if(w.length>1&&w[0].length>=3&&!['restaurant','cafe','the','shop','store'].includes(w[0]))a.push(w[0]);return a}
function balLabel(p){const b=balance(p.id);return b>0?'Owes you '+fmt(b):b<0?'You owe '+fmt(-b):'Settled'}
function personAlts(p,base,note){const b=balance(p.id),out=[];
  if(b<0)out.push({label:'Repay '+p.name,sub:'You owe '+fmt(-b),d:{...base,type:'paid_back',personId:p.id,note}});
  out.push({label:'Lend to '+p.name,sub:'Person · '+balLabel(p).toLowerCase(),d:{...base,type:'lent',personId:p.id,note}});
  return out}
// several entries in one line: "spent 10 on food and 5 on taxi"
function parseAll(raw){
  const parts=raw.split(/\s+and\s+|\s*;\s*/i).map(x=>x.trim()).filter(Boolean);
  const words=p=>p.toLowerCase().split(/\s+/);
  const hasAmt=p=>/\d/.test(p)||words(p).some(w=>isNW(w)||w==='half');
  if(parts.length<2||!parts.every(hasAmt)){const r=parse(raw);return r.error?r:{drafts:[r.d]}}
  const VSETS=[EXP_V,INC_V,LEND_V,BORROW_V,GIVE_V];const isVerb=w=>VSETS.some(s=>s.has(w));
  const firstVerb=words(parts[0]).find(isVerb);
  const drafts=[];
  for(let i=0;i<parts.length;i++){let p=parts[i];if(i>0&&firstVerb&&!words(p).some(isVerb))p=firstVerb+' '+p;
    const r=parse(p);if(r.error)return{error:'In "'+parts[i]+'": '+r.error};drafts.push(r.d)}
  const dated=drafts.find(d=>d.dateSet);if(dated)drafts.forEach(d=>{if(!d.dateSet){d.ts=dated.ts;(d.alts||[]).forEach(a=>a.d.ts=dated.ts)}});
  return{drafts};
}
window.filsParse=parse;window.filsParseAll=parseAll;

/* ---------- typing suggestions: rebuilt from your own past entries ---------- */
// turn an entry back into a short sentence the parser understands, with {amt} where the amount goes
function entryText(e){
  const p=placeById(e.placeId),c=catById(e.categoryId),u=personById(e.personId);
  const pw=p?(p.aliases[0]||p.name).toLowerCase():'',cw=c?(c.synonyms[0]||c.name).toLowerCase():'',nm=u?u.name.toLowerCase():'';
  const note=(e.note||'').toLowerCase().trim();let t;
  switch(e.type){
    case'expense':t=p?`${pw} {amt}`:note?`${note} {amt}`+(c&&!scanCats(note.split(' '),[c])?` on ${cw}`:''):`${cw} {amt}`;break;
    case'income':t=`got {amt} ${cw||note}`;break;
    case'refund':t=`refund {amt} ${pw||cw}`;break;
    case'lent':t=`lent {amt} to ${nm}`;break;
    case'borrowed':t=`borrowed {amt} from ${nm}`;break;
    case'got_back':t=`${nm} paid back {amt}`;break;
    case'paid_back':t=`paid ${nm} back {amt}`;break;
    case'transfer':t=acctOf(e)==='bank'?'atm {amt}':'deposited {amt}';break;
    default:return null}
  if(e.currency!==S.design.currency)t+=' '+e.currency.toLowerCase();
  if(e.type!=='transfer'&&acctOf(e)!==S.design.defaultAccount)t+=acctOf(e)==='cash'?' cash':' card';
  return{tpl:t.replace(/\s+/g,' ').trim(),amt:String(r3(e.amount))}}
function suggestions(q){
  const toks=q.toLowerCase().trim().split(/\s+/).filter(Boolean);if(q.trim().length<2)return[];
  let amt=null;const words=[];
  for(const t of toks){if(/^\d+(\.\d+)?$/.test(t))amt=t;else if(!REMOVE.has(t)&&!CONN.has(t)&&!CUR[t]&&t!=='cash'&&t!=='card')words.push(t)}
  if(!words.length)return[];
  const seen=new Map();
  for(const e of sorted().slice(0,500)){const s=entryText(e);if(!s)continue;const c=seen.get(s.tpl)||{tpl:s.tpl,amt:s.amt,n:0,ts:e.ts};c.n++;seen.set(s.tpl,c)}
  const out=[];for(const c of seen.values()){const ws=c.tpl.replace('{amt}','').split(' ').filter(Boolean);if(words.every(w=>ws.some(x=>x.startsWith(w))))out.push(c)}
  out.sort((a,b)=>b.n-a.n||b.ts-a.ts);
  const typed=q.trim().toLowerCase();
  return out.map(c=>c.tpl.replace('{amt}',amt||c.amt)).filter(s=>s!==typed).slice(0,3)}
function renderSugg(){const el=$('#sugg');const list=UI.pending?[]:suggestions($('#q').value);UI.sugg=list;
  if(!list.length){el.hidden=true;el.innerHTML='';return}
  el.innerHTML=list.map((s,i)=>`<button type="button" data-act="sugg" data-i="${i}">${esc(s)}</button>`).join('')+(list.length?'<span class="shint">Tab ↹</span>':'');el.hidden=false}

/* ---------- entry flow ---------- */
function nextQ(d){
  if(d.alts)return'which';
  if(d.newPersonName&&!d.personOk)return'person';
  if((d.type==='expense'||d.type==='income'||d.type==='refund')&&!d.catId)return'category';
  if((d.type==='got_back'||d.type==='paid_back')&&d.personId&&!d.warnOk){const b=balance(d.personId);const owed=d.type==='got_back'?b:-b;if(d.amount>owed+1e-9)return'overpay'}
  if(F().confirmAll&&!d.confirmed&&!UI.batch)return'confirm';
  return null;
}
function startBatch(ds){UI.batch={done:[],queue:ds.slice(1),total:ds.length};advance(ds[0])}
function advance(d){const q=nextQ(d);if(q){UI.pending={d,q};UI.toast=null;renderPending();return}
  if(UI.batch){UI.batch.done.push(d);if(UI.batch.queue.length)advance(UI.batch.queue.shift());else{UI.pending={q:'batch',d:null};UI.toast=null;renderPending()}return}
  commit(d)}
function commit(d){finish([d])}
// haptics: system tactile clicks in the app (native Tactile plugin), navigator.vibrate in a browser. k: 'tick'|'edge'|'ok'|'heavy'|'tap'
function buzz(k){if(S.design.haptics===false)return;try{const C=window.Capacitor;
  if(C&&C.isNativePlatform&&C.isNativePlatform()&&C.nativePromise){C.nativePromise('Tactile','feel',{k}).catch(()=>{});return}
  if(navigator.vibrate&&(!navigator.userActivation||navigator.userActivation.hasBeenActive))navigator.vibrate(k==='ok'?[8,50,8]:k==='heavy'?14:6)}catch(e){}}
function finish(ds){const ids=[],learned=[];
  for(const d of ds){const r=saveDraft(d);ids.push(r.e.id);learned.push(...r.learned)}
  buzz('ok');persist();UI.pending=null;UI.batch=null;UI.toast={ids,learned};if(POPUP)popupAutoClose();
  render();clearTimeout(UI.tt);UI.tt=setTimeout(()=>{UI.toast=null;renderPending()},learned.length||ids.length>1?9000:5000)}
function saveDraft(d){
  const learned=[];
  if(d.newPersonName){const ex=S.people.find(p=>nn(p.name)===nn(d.newPersonName));if(ex)d.personId=ex.id;else{const p={id:uid(),name:d.newPersonName,aliases:[]};S.people.push(p);d.personId=p.id;learned.push('New person: '+p.name)}}
  if(d.newPlace){const nm=d.newPlace.name||'New place';const ex=S.places.find(p=>nn(p.name)===nn(nm));if(ex)d.placeId=ex.id;else{const pl={id:uid(),name:nm,categoryId:d.catId,aliases:d.newPlace.aliases};S.places.push(pl);d.placeId=pl.id;learned.push('Remembered '+pl.name+' as '+catById(d.catId).name)}}
  if(d.learn&&d.learnOk){const c=catById(d.catId);if(c&&!c.synonyms.includes(d.learn)){c.synonyms.push(d.learn);learned.push('Remembered "'+d.learn+'" as '+c.name)}}
  const e={id:uid(),type:d.type,amount:d.amount,currency:d.currency,account:d.account||S.design.defaultAccount||'bank',...(d.type==='transfer'?{toAccount:d.toAccount||otherAcct(d.account)}:{}),categoryId:isLoan(d.type)?null:d.catId,placeId:isLoan(d.type)?null:(d.placeId||null),personId:isLoan(d.type)?d.personId:null,note:d.note||'',ts:d.ts};
  S.entries.push(e);
  if(d.extraWarn)learned.push('Only the first amount was used. Type '+d.extraWarn+' as its own entry.');
  return{e,learned};
}
function summaryLine(d){
  if(d.type==='transfer')return(d.account==='bank'?'ATM withdrawal':'Cash deposit')+' · '+fmt(d.amount,d.currency)+' '+d.currency+' · '+ACCT_NAME[d.account]+' → '+ACCT_NAME[d.toAccount||otherAcct(d.account)];
  const parts=[];const lbl={expense:'Expense',income:'Income',refund:'Refund',lent:'Lent',borrowed:'Borrowed',got_back:'Paid back to you',paid_back:'You paid back'}[d.type];
  parts.push(lbl,fmt(d.amount,d.currency)+' '+d.currency);
  if(isLoan(d.type)){const p=personById(d.personId);parts.push(p?p.name:(d.newPersonName||'?'))}
  else{const c=catById(d.catId);parts.push(c?c.name:'?');const pl=placeById(d.placeId);if(pl)parts.push(pl.name);else if(d.newPlace)parts.push(d.newPlace.name)}
  if(d.account&&d.account!==S.design.defaultAccount)parts.push(ACCT_NAME[d.account]);
  return parts.join(' · ');
}
function kindLabel(e){if(e.type==='transfer'){const a=acctOf(e);return ACCT_NAME[a]+' → '+ACCT_NAME[e.toAccount||otherAcct(a)]}
  const base=isLoan(e.type)?'Loan':(catById(e.categoryId)?.name||'');return acctOf(e)!==S.design.defaultAccount?base+' · '+ACCT_NAME[acctOf(e)]:base}
function entryLine(e){if(e.type==='transfer')return acctOf(e)==='bank'?'ATM withdrawal':'Cash deposit';
  if(isLoan(e.type)){const n=personById(e.personId)?.name||'Someone';return{lent:'Lent to '+n,borrowed:'Borrowed from '+n,got_back:n+' paid you back',paid_back:'You paid '+n+' back'}[e.type]}
  return placeById(e.placeId)?.name||e.note||catById(e.categoryId)?.name||'Uncategorised'}

/* ---------- rendering ---------- */
function applyDesign(){
  const d=S.design,a=$('#app');
  if(d.theme==='system')a.removeAttribute('data-mode');else a.dataset.mode=d.theme;
  {const q=$('#q');if(q){const on=!!d.kbSuggest;if(q.spellcheck!==on){q.spellcheck=on;q.setAttribute('autocorrect',on?'on':'off');
    if(document.activeElement===q){q.blur();setTimeout(()=>q.focus(),0)}}}} // the keyboard reads these when the box gets focus
  a.dataset.font=d.font;a.dataset.fs=d.fontSize;a.dataset.corners=d.corners;a.dataset.density=d.density;a.dataset.input=d.inputPos;
  a.style.setProperty('--accent-base',d.accent);a.style.setProperty('--income-base',d.income);a.style.setProperty('--expense-base',d.expense);
}
function render(){applyDesign();renderHdr();renderBar();renderMain();renderPending();renderOverlay()}
function ib(act,v,icon,label){return`<button class="ib" data-act="${act}"${v?` data-v="${esc(v)}"`:''} aria-label="${label}" title="${label}">${ICON[icon]}</button>`}
function renderHdr(){
  const v=UI.view;let left;
  if(v==='home')left=`<div class="ttl"><span class="eyebrow"><span class="e1">${esc(S.design.appName||'Fils')}</span><span class="e2">${S.design.showCash?fmt(cashInHand())+' '+esc(S.design.currency)+' in hand':''}</span></span><button class="mbtn" data-act="cal" data-ts="${Date.now()}" title="Open calendar" aria-label="Open calendar"><h1>${MONTHS_FULL[new Date().getMonth()]}</h1>${ICON.down}</button></div>`;
  else{const t=v==='summary'?'Summary':v==='people'?'People':(personById(UI.personId)?.name||'Person');left=`<div class="ttl row">${ib('back','','back','Back')}<h1>${esc(t)}</h1></div>`}
  const tools=(v==='home'?`<button class="ib${UI.searchOpen||isFiltering()?' on':''}" data-act="search" aria-label="Search and filter" title="Search and filter">${ICON.search}</button>`:'')
    +ib('sheet','manage','grid','Categories, places, people')+ib('sheet','menu','menu','Menu');
  $('#hdr').innerHTML=left+`<div class="tools">${tools}</div>`;
}
const CAT_ICON={
  food:'<path d="M7 3v18M4.5 3v5a2.5 2.5 0 0 0 5 0V3M17 21V3c-2.2 1.6-3 4.2-3 8h3"/>',
  groceries:'<path d="M3 4h2.2l2.2 11h10.4L20 7.5H6.3"/><circle cx="9" cy="19.2" r="1.4"/><circle cx="17" cy="19.2" r="1.4"/>',
  transport:'<path d="M5 16v-5l2-5h10l2 5v5M3.5 16h17M5 11h14M7 16v3M17 16v3"/>',
  car:'<path d="M14.7 6.3a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.7-8.7a4 4 0 0 0-2-2z"/>',
  housing:'<path d="M3 11l9-7 9 7M5.5 9.5V20h13V9.5M10 20v-6h4v6"/>',
  bills:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',
  shopping:'<path d="M5 8h14l-1 13H6zM9 8V6.5a3 3 0 0 1 6 0V8"/>',
  health:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
  care:'<circle cx="6.5" cy="7" r="2.5"/><circle cx="6.5" cy="17" r="2.5"/><path d="M8.7 8.3 20 18M8.7 15.7 20 6"/>',
  fun:'<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14.5 7v10"/>',
  travel:'<path d="M21 3 3 10.5l7 2.5 2.5 7zM10 13l11-10"/>',
  gifts:'<path d="M4 9h16v4H4zM5.5 13v8h13v-8M12 9v12M12 9C10.5 5 7 5 7 7.2S10 9 12 9c2 0 5 0 5-1.8S13.5 5 12 9"/>',
  education:'<path d="M4.5 18.5V5.5a2 2 0 0 1 2-2h13v15h-13a2 2 0 0 0 0 4h13"/>',
  fees:'<path d="M18.5 5.5l-13 13"/><circle cx="7" cy="7" r="2.2"/><circle cx="17" cy="17" r="2.2"/>',
  other:'<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
  salary:'<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V5h6v2.5M3.5 13h17"/>',
  freelance:'<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 19h18"/>',
  refund:'<path d="M9 13.5 4 8.5l5-5M4 8.5h10a5.5 5.5 0 0 1 0 11h-3"/>',
  giftin:'<path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z"/>',
  otherin:'<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>'
};
function catTile(c){const st=S.design.iconStyle,h=c?c.hue:'#888';
  if(st==='tags')return`<span class="tile tag" style="--h:${esc(h)}" aria-hidden="true">[${esc((c?c.abbr:'??').toLowerCase())}]</span>`;
  if(st==='icons'&&c&&CAT_ICON[c.id])return`<span class="tile" style="--h:${esc(h)}" aria-hidden="true"><svg viewBox="0 0 24 24">${CAT_ICON[c.id]}</svg></span>`;
  return`<span class="tile" style="--h:${esc(h)}" aria-hidden="true">${esc(c?c.abbr:'?')}</span>`}
// each entry sits on a coloured layer that shows while you swipe: right = duplicate, left = delete
// labels next to the swipe icons can be turned off in Customise
const swTile=()=>S.design.swipeLabels?76:56; // action tile width
const delW=()=>swTile()+20; // space the row slides over: 8px screen-edge inset + tile + 12px gap to the card
const swWrap=(id,inner)=>{const L=S.design.swipeLabels;
  return`<div class="swp" data-id="${esc(id)}"><div class="sw-bg" aria-hidden="true"><span class="sw-dup" style="width:${swTile()}px">${ICON.copy}${L?'<span>Duplicate</span>':''}</span><button class="sw-del" data-act="swdel" data-id="${esc(id)}" tabindex="-1" aria-label="Delete" title="Delete" style="width:${swTile()}px">${ICON.trash}${L?'<span>Delete</span>':''}</button></div>${inner}</div>`};
function rowHTML(e){
  const c=catById(e.categoryId),p=placeById(e.placeId);let sub,tile,amt,cls='';
  const ttl=entryLine(e);
  const tag=(e.type!=='transfer'&&acctOf(e)!==S.design.defaultAccount)?` <span class="acct">${ACCT_NAME[acctOf(e)].toLowerCase()}</span>`:'';
  if(e.type==='transfer'){const a=acctOf(e);sub=ACCT_NAME[a]+' → '+ACCT_NAME[e.toAccount||otherAcct(a)]+' · '+hm(e.ts);tile=`<span class="tile loan" aria-hidden="true">${ICON.swap}</span>`;amt=fmt(e.amount,e.currency);cls='loanamt'}
  else if(isLoan(e.type)){sub=['Loan',e.note,hm(e.ts)].filter(Boolean).join(' · ');tile=`<span class="tile loan" aria-hidden="true">${e.type==='lent'||e.type==='paid_back'?ICON.out:ICON.in}</span>`;amt=fmt(e.amount,e.currency);cls='loanamt'}
  else{const up=e.type==='income'||e.type==='refund';const parts=[c?c.name:'Uncategorised'];if(e.type==='refund')parts.unshift('Refund');if(e.note&&ttl!==e.note)parts.push(e.note);parts.push(hm(e.ts));sub=parts.join(' · ');tile=catTile(c);amt=(up?'+':'−')+fmt(e.amount,e.currency);cls=up?'inc':''}
  const cs=e.currency!==S.design.currency?` <small>${esc(e.currency)}</small>`:'';
  if(S.design.rows!=='two'){ // one line: icon (dot = non-default account), name, amount; details on tap
    const other=e.type!=='transfer'&&acctOf(e)!==S.design.defaultAccount;
    if(other)tile=tile.slice(0,-7)+`<i class="dot" title="${ACCT_NAME[acctOf(e)]}"></i></span>`;
    return swWrap(e.id,`<button class="row one" data-act="edit" data-id="${esc(e.id)}" title="${esc(sub+(other?' · '+ACCT_NAME[acctOf(e)]:''))}">${tile}<span class="rt"><span class="t1">${esc(ttl)}</span></span><span class="amt ${cls}">${amt}${cs}</span></button>`)}
  return swWrap(e.id,`<button class="row" data-act="edit" data-id="${esc(e.id)}">${tile}<span class="rt"><span class="t1">${esc(ttl)}${tag}</span><span class="t2">${esc(sub)}</span></span><span class="amt ${cls}">${amt}${cs}</span></button>`);
}
function listHTML(list){const groups=[],m=new Map();
  for(const e of list){const k=dayKey(e.ts);if(!m.has(k)){const g={ts:e.ts,list:[]};m.set(k,g);groups.push(g)}m.get(k).list.push(e)}
  return groups.map(g=>`<h3 class="day" data-ts="${esc(g.ts)}" data-label="${esc(dayLabel(g.ts))}" data-info="${esc(dayInfo(g.list))}">${dayLabel(g.ts)}</h3>`+g.list.map(rowHTML).join('')).join('')}
const sorted=()=>S.entries.slice().sort((a,b)=>b.ts-a.ts);
function monthStats(key){const cur=S.design.currency;let inc=0,exp=0,other=0;const byCat={},byPlace={},incCat={};
  for(const e of S.entries){if(mk(e.ts)!==key)continue;if(isLoan(e.type)||e.type==='transfer')continue;if(e.currency!==cur){other++;continue}
    if(e.type==='expense'){exp+=e.amount;const k=e.categoryId||'other';byCat[k]=(byCat[k]||0)+e.amount;if(e.placeId){const p=byPlace[e.placeId]||(byPlace[e.placeId]={n:0,t:0});p.n++;p.t+=e.amount}}
    else if(e.type==='refund'){exp-=e.amount;const k=e.categoryId||'other';byCat[k]=(byCat[k]||0)-e.amount;if(e.placeId){const p=byPlace[e.placeId]||(byPlace[e.placeId]={n:0,t:0});p.t-=e.amount}}
    else{inc+=e.amount;const k=e.categoryId||'otherin';incCat[k]=(incCat[k]||0)+e.amount}}
  return{inc:r3(inc),exp:r3(exp),other,byCat,byPlace,incCat}}
const stat=(l,v,cls)=>`<div class="stat"><span class="lbl">${l}</span><span class="num ${cls||''}">${fmt(v)}</span></div>`;
function renderMain(){
  const m=$('#main');const v=UI.view;let h='';
  if(v==='home')h=homeHTML();
  else if(v==='summary')h=summaryHTML();
  else if(v==='people')h=peopleHTML();
  else if(v==='person')h=personHTML();
  m.innerHTML=h;
}
/* ---------- home: today first, past days collapsed, search and filters ---------- */
const tileOn=act=>(act==='in'||act==='out')&&UI.filter.type===(act==='in'?'income':'expense')&&UI.filter.range==='month';
const tileBtn=(act,l,v,cls,hint,sub)=>`<button class="stat${tileOn(act)?' on':''}" data-act="tile" data-v="${act}" title="${hint}"><span class="lbl">${l}</span><span class="num ${cls||''}">${fmt0(v)}</span>${sub?`<span class="tsub">${sub}</span>`:''}</button>`;
// loan money moving this month: out = lent + you repaid, in = borrowed + repaid to you
function monthLoans(key){let out=0,inn=0;for(const e of S.entries){if(mk(e.ts)!==key||e.currency!==S.design.currency)continue;
  if(e.type==='lent'||e.type==='paid_back')out+=e.amount;else if(e.type==='borrowed'||e.type==='got_back')inn+=e.amount}return{out:r3(out),in:r3(inn)}}
function filterActive(){const f=UI.filter;return f.type!=='all'||f.range!=='all'||f.account!=='all'||f.cats.length>0||!!f.placeId||!!f.personId}
const isFiltering=()=>!!UI.search.trim()||filterActive();
function inRange(ts,r){const now=new Date();if(r==='all')return true;if(r==='today')return dayKey(ts)===dayKey(now.getTime());
  if(r==='7'){const s=new Date(now);s.setHours(0,0,0,0);s.setDate(s.getDate()-6);return ts>=s.getTime()}
  if(r==='month')return mk(ts)===mk(now.getTime());if(r==='lastmonth')return mk(ts)===mk(now.getTime())-1;return true}
const TYPE_WORD={transfer:'transfer atm withdrawal deposit cash bank',expense:'expense spent',income:'income',refund:'refund',lent:'lent loan',borrowed:'borrowed loan',got_back:'paid back loan repaid',paid_back:'paid back loan repaid'};
/* ---------- smarter search: plain words become filters ("over 20 food last week at safa");
   whatever is left over is searched as text, like before ---------- */
let sqMemo={q:null,v:null};
function sqFor(q){if(sqMemo.q!==q)sqMemo={q,v:interpret(q)};return sqMemo.v}
function interpret(q){
  const r={min:null,max:null,minInc:false,maxInc:false,from:null,to:null,acct:null,type:null,cats:[],placeId:null,personId:null,personText:'',text:'',labels:[]};
  const t=String(q).toLowerCase().replace(/,/g,' ').replace(/(\d)\s*kd\b/g,'$1').replace(/\bkd\s*(\d)/g,'$1').split(/\s+/).filter(Boolean);
  const num=w=>w!=null&&/^\d*\.?\d+$/.test(w)?parseFloat(w):null;
  const now=new Date(),D0=d=>{const x=new Date(d);x.setHours(0,0,0,0);return x.getTime()},DAY=864e5;
  const range=(a,b,l)=>{r.from=a;r.to=b;r.labels.push(l)};
  const between=(a,b)=>{r.min=Math.min(a,b);r.max=Math.max(a,b);r.minInc=r.maxInc=true;r.labels.push(fmt(r.min)+'–'+fmt(r.max))};
  const FILL=['at','on','in','with','for','from','to','the','a','an','and','of','my','i','me','all','show','entries','what','how','much','did','spent','spend','paid','bought'];
  const out=[];
  for(let i=0;i<t.length;i++){const w=t[i],w1=t[i+1],w2=t[i+2],w3=t[i+3];let m;
    if(['over','above','>','min'].includes(w)&&num(w1)!=null){r.min=num(w1);r.labels.push('over '+fmt(r.min));i++;continue}
    if(w==='more'&&w1==='than'&&num(w2)!=null){r.min=num(w2);r.labels.push('over '+fmt(r.min));i+=2;continue}
    if(['under','below','<','max'].includes(w)&&num(w1)!=null){r.max=num(w1);r.labels.push('under '+fmt(r.max));i++;continue}
    if(w==='less'&&w1==='than'&&num(w2)!=null){r.max=num(w2);r.labels.push('under '+fmt(r.max));i+=2;continue}
    if(w==='between'&&num(w1)!=null&&['and','to','-'].includes(w2)&&num(w3)!=null){between(num(w1),num(w3));i+=3;continue}
    if((m=w.match(/^(\d*\.?\d+)-(\d*\.?\d+)$/))){between(+m[1],+m[2]);continue}
    if(w==='today'){range(D0(now),D0(now)+DAY,'today');continue}
    if(w==='yesterday'){range(D0(now)-DAY,D0(now),'yesterday');continue}
    if((w==='last'||w==='past')&&w1==='week'){range(D0(now)-6*DAY,Infinity,'last 7 days');i++;continue}
    if(w==='this'&&w1==='week'){const d=new Date(D0(now));d.setDate(d.getDate()-d.getDay());range(d.getTime(),Infinity,'this week');i++;continue}
    if((w==='last'||w==='past')&&num(w1)!=null&&(w2==='days'||w2==='day')){const n=Math.max(1,num(w1));range(D0(now)-(n-1)*DAY,Infinity,'last '+n+' days');i+=2;continue}
    if(w==='this'&&w1==='month'){range(new Date(now.getFullYear(),now.getMonth(),1).getTime(),Infinity,'this month');i++;continue}
    if(w==='last'&&w1==='month'){range(new Date(now.getFullYear(),now.getMonth()-1,1).getTime(),new Date(now.getFullYear(),now.getMonth(),1).getTime(),'last month');i++;continue}
    if(w==='this'&&w1==='year'){range(new Date(now.getFullYear(),0,1).getTime(),Infinity,'this year');i++;continue}
    if(w==='last'&&w1==='year'){range(new Date(now.getFullYear()-1,0,1).getTime(),new Date(now.getFullYear(),0,1).getTime(),'last year');i++;continue}
    if(w!=='may'&&Object.prototype.hasOwnProperty.call(MON,w)||(w==='may'&&(i===t.length-1||num(w1)!=null))){
      const mo=MON[w];let y=now.getFullYear();const yy=num(w1);
      if(yy!=null&&yy>=2000&&yy<2100){y=yy;i++}else if(mo>now.getMonth())y--;
      range(new Date(y,mo,1).getTime(),new Date(y,mo+1,1).getTime(),MONTHS_FULL[mo]+' '+y);continue}
    if(w==='cash'){r.acct='cash';r.labels.push('Cash');continue}
    if(['card','bank','knet','visa'].includes(w)){r.acct='bank';r.labels.push('Bank');continue}
    if(['income','earned','received'].includes(w)){r.type='income';r.labels.push('Income');continue}
    if(['expense','expenses','spending'].includes(w)){r.type='expense';r.labels.push('Expenses');continue}
    if(['loan','loans','lent','borrowed','owe','owes'].includes(w)){r.type='loan';r.labels.push('Loans');continue}
    if(['refund','refunds'].includes(w)){r.type='refund';r.labels.push('Refunds');continue}
    if(['atm','withdrawal','withdrawals','transfer','transfers','deposit','deposits'].includes(w)){r.type='transfer';r.labels.push('Transfers');continue}
    if(FILL.includes(w))continue;
    if(num(w)!=null&&!(num(w)>=2000&&num(w)<2100&&r.from!=null)){r.min=r.max=num(w);r.minInc=r.maxInc=true;r.labels.push('exactly '+fmt(num(w)));continue} // "spent 2 kd"
    out.push(w)}
  let rest=out;
  // a person: their loans plus any entry that mentions them ("lunch with ali")
  for(let n=Math.min(2,rest.length);n>=1&&!r.personId;n--)for(let i=0;i+n<=rest.length;i++){
    const g=rest.slice(i,i+n).join(' '),m=best(S.people,personNames,g,true);
    if(m.length===1){r.personId=m[0].id;r.personText=nn(m[0].name);rest=rest.slice(0,i).concat(rest.slice(i+n));
      // same word is also a place (person "Safa", place "Al Safa Restaurant"): show both
      const pm=scan(g.split(' '),S.places,placeNames,true);if(pm&&pm.items.length===1)r.altPlaceId=pm.items[0].id;
      r.labels.push(r.altPlaceId?m[0].name+' or '+placeById(r.altPlaceId).name:m[0].name);break}}
  {const m=rest.length?scan(rest,S.places,placeNames,true):null;if(m&&m.items.length===1){r.placeId=m.items[0].id;r.labels.push(m.items[0].name);rest=m.rest}}
  // category names only ("food", "groceries"); other words stay text, so "coffee" finds coffees, not all of Food
  rest=rest.filter(w=>{const c=S.categories.find(c=>[c.id,c.name,...c.name.split(/ & | /)].some(x=>nn(x)&&nn(x)===nn(w)));
    if(!c)return true;if(!r.cats.includes(c.id)){r.cats.push(c.id);r.labels.push(c.name)}return false});
  r.text=rest.join(' ');if(r.text&&r.labels.length)r.labels.push('"'+r.text+'"');
  return r}
function renderSqHint(){const el=$('#sqhint');if(!el)return;const sq=sqFor(UI.search);
  el.textContent=sq.labels.length?'Showing: '+sq.labels.join(' · '):'';el.hidden=!el.textContent}
function matches(e){const f=UI.filter;
  if(f.type==='expense'&&e.type!=='expense'&&e.type!=='refund')return false;if(f.type==='income'&&e.type!=='income')return false;if(f.type==='loan'&&!isLoan(e.type))return false;
  if(f.cats.length&&!f.cats.includes(e.categoryId))return false;if(f.placeId&&e.placeId!==f.placeId)return false;if(f.personId&&e.personId!==f.personId)return false;
  if(!inRange(e.ts,f.range))return false;
  if(f.account!=='all'&&acctOf(e)!==f.account&&!(e.type==='transfer'&&(e.toAccount||otherAcct(acctOf(e)))===f.account))return false;
  const sq=sqFor(UI.search);
  if(sq.min!=null&&!(sq.minInc?e.amount>=sq.min:e.amount>sq.min))return false;
  if(sq.max!=null&&!(sq.maxInc?e.amount<=sq.max:e.amount<sq.max))return false;
  if(sq.from!=null&&!(e.ts>=sq.from&&e.ts<sq.to))return false;
  if(sq.acct&&acctOf(e)!==sq.acct&&!(e.type==='transfer'&&(e.toAccount||otherAcct(acctOf(e)))===sq.acct))return false;
  if(sq.type&&!(sq.type==='expense'?(e.type==='expense'||e.type==='refund'):sq.type==='loan'?isLoan(e.type):e.type===sq.type))return false;
  if(sq.cats.length&&!sq.cats.includes(e.categoryId))return false;
  if(sq.placeId&&e.placeId!==sq.placeId)return false;
  if(sq.personId&&e.personId!==sq.personId&&!nn(e.note||'').includes(sq.personText)&&!(sq.altPlaceId&&e.placeId===sq.altPlaceId))return false;
  const q=sq.text;if(!q)return true;
  const hay=[entryLine(e),e.note,catById(e.categoryId)?.name,placeById(e.placeId)?.name,personById(e.personId)?.name,TYPE_WORD[e.type],fmt(e.amount,e.currency),String(e.amount),e.currency,dayLabel(e.ts)].filter(Boolean).join(' ').toLowerCase();
  return q.split(/\s+/).every(w=>hay.includes(w))}
// one number for a day: income + refunds - spending (loans not included)
function dayNet(list){let n=0;for(const e of list){if(e.currency!==S.design.currency)continue;if(e.type==='income'||e.type==='refund')n+=e.amount;else if(e.type==='expense')n-=e.amount}return r3(n)}
function homeHTML(){
  const st=monthStats(mk(Date.now())),d=S.design,q=[];
  const cash=cashInHand(),ow=owedTotals();
  const settled=r3(cash+(F().loans?ow.toYou-ow.youOwe:0));
  // one quiet line of tappable totals instead of four boxes
  const qi=(act,l,val,cls,hint)=>`<button class="${tileOn(act)?'on':''}" data-act="tile" data-v="${act}" title="${hint}"><span class="ql">${l}</span> <span class="num ${cls||''}">${val}</span></button>`;
  if(d.showIn)q.push(qi('in','In',fmt(st.inc),'inc','This month\'s income. Tap to list it'));
  if(d.showOut)q.push(qi('out','Out',fmt(st.exp),'','This month\'s spending. Tap to list it'));
  if(d.showLeft)q.push(qi('left','Net cash',fmt(settled),settled<0?'neg':'','Net cash = cash in hand + owed to you − you owe. Opens the summary'));
  if(d.showLoan&&F().loans&&(ow.toYou||ow.youOwe))q.push(qi('owed','Loans',(ow.toYou?`<span class="inc">+${fmt(ow.toYou)}</span>`:'')+(ow.toYou&&ow.youOwe?'/':'')+(ow.youOwe?`<span class="neg">−${fmt(ow.youOwe)}</span>`:''),'','+ owed to you, − you owe (never combined). Opens People'));
  let h='';
  if(d.showCash){const bl=balances();
    const cl=fmt(cash).length;
    h+=`<button class="hero" id="hero" data-act="cashsplit" aria-expanded="${UI.cashOpen}" title="Tap to see Bank and Cash"><span class="hlbl">Cash in hand</span><span class="num big ${cash<0?'neg':''}${cl>14?' xlong':cl>11?' long':''}">${fmt(cash)}<small> ${esc(d.currency)}</small></span></button>`;
    if(UI.cashOpen)h+=`<div class="split"><button data-act="acctfilter" data-v="bank"><span>Bank</span><span class="num ${bl.bank<0?'neg':''}">${fmt(bl.bank)}</span></button><button data-act="acctfilter" data-v="cash"><span>Cash</span><span class="num ${bl.cash<0?'neg':''}">${fmt(bl.cash)}</span></button></div>`}
  if(q.length)h+=`<div class="quick">${q.join('')}</div>`;
  if(isFiltering())return h+resultsHTML();
  const all=sorted(),tk=dayKey(Date.now());
  const today=all.filter(e=>dayKey(e.ts)===tk);
  // every day expanded under its own date header (today first); the scrubber on the right jumps by date
  h+=dayHead(Date.now(),today);
  if(today.length)h+=today.map(rowHTML).join('');
  else h+=`<p class="note">Nothing logged today yet. Type below, like <code>spend 10 at safa</code>.</p>`;
  const days=[],map=new Map();
  for(const e of all){const k=dayKey(e.ts);if(k===tk)continue;if(!map.has(k)){const g={k,ts:e.ts,list:[]};map.set(k,g);days.push(g)}map.get(k).list.push(e)}
  for(const g of days)h+=dayHead(g.ts,g.list)+g.list.map(rowHTML).join('');
  return h}
const netStr=n=>(n>0?'+':n<0?'−':'')+fmt(Math.abs(n));
const dayInfo=list=>`${list.length} entr${list.length===1?'y':'ies'} · ${netStr(dayNet(list))}`;
// date headers: carry their date, count and total for the scrubber; tapping one opens the calendar
function dayHead(ts,list){const net=dayNet(list);
  return`<div class="todayrow" data-ts="${esc(ts)}" data-label="${esc(dayLabel(ts))}" data-info="${esc(dayInfo(list))}"><h3 class="day">${dayLabel(ts)}</h3><span class="num ${net>0?'inc':''}">${netStr(net)}</span></div>`}
function resultsHTML(){const list=sorted().filter(matches),cur=S.design.currency;let out=0,inc=0;
  for(const e of list){if(e.currency!==cur)continue;if(e.type==='expense')out+=e.amount;else if(e.type==='income')inc+=e.amount}
  let h=`<div class="rsum"><span>${list.length} result${list.length===1?'':'s'}</span><span class="num">${out?'−'+fmt(out):''}${out&&inc?' · ':''}${inc?'<span class="inc">+'+fmt(inc)+'</span>':''}</span></div>`;
  h+=list.length?listHTML(list):`<div class="empty"><strong>No matches</strong>Try another word, or clear the filters.</div>`;
  return h}
function chipList(){const f=UI.filter,out=[];
  if(f.type!=='all')out.push({k:'type',l:TYPE_OPTS.find(o=>o[0]===f.type)[1]});
  if(f.range!=='all')out.push({k:'range',l:RANGE_OPTS.find(o=>o[0]===f.range)[1]});
  if(f.account!=='all')out.push({k:'account',l:ACCT_NAME[f.account]});
  for(const id of f.cats){const c=catById(id);if(c)out.push({k:'cat',v:id,l:c.name})}
  if(f.placeId)out.push({k:'place',l:placeById(f.placeId)?.name||'Place'});
  if(f.personId)out.push({k:'person',l:personById(f.personId)?.name||'Person'});
  return out}
function renderBar(){const b=$('#bar');const chips=UI.view==='home'?chipList():[];
  if(UI.view!=='home'||(!UI.searchOpen&&!chips.length)){b.hidden=true;b.innerHTML='';return}
  let h='';
  if(UI.searchOpen)h+=`<div class="sbox">${ICON.search}<input id="sq" type="search" placeholder="over 20 food last week" aria-label="Search entries" value="${esc(UI.search)}" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="x${filterActive()?' on':''}" data-act="sheet" data-v="filter" aria-label="Filter" title="Filter">${ICON.filter}</button><button class="x" data-act="searchx" aria-label="Close search">${ICON.x}</button></div><p class="sqhint" id="sqhint" hidden></p>`;
  if(chips.length)h+=`<div class="chips">${chips.map(c=>`<button class="chip" data-act="chipx" data-k="${esc(c.k)}" data-v="${esc(c.v||'')}" aria-label="Remove filter ${esc(c.l)}">${esc(c.l)} ×</button>`).join('')}<button class="chip clear" data-act="fclear">Clear</button></div>`;
  b.innerHTML=h;b.hidden=false;renderSqHint()}
function filterHTML(){const f=UI.filter;
  const segF=(key,opts)=>`<div class="seg">${opts.map(([v,l])=>`<button data-act="fset" data-key="${key}" data-val="${esc(v)}" class="${f[key]===v?'on':''}" aria-pressed="${f[key]===v}">${l}</button>`).join('')}</div>`;
  const types=TYPE_OPTS.filter(o=>o[0]!=='loan'||F().loans);
  const kinds=f.type==='income'?['income']:f.type==='expense'?['expense']:f.type==='loan'?[]:['expense','income'];
  const cats=S.categories.filter(c=>kinds.includes(c.kind));
  const n=sorted().filter(matches).length;
  return sheetWrap('Filter',`
  <div class="sgroup" style="border-top:0"><span class="flabel">Show</span>${segF('type',types)}</div>
  <div class="sgroup"><span class="flabel">Period</span>${segF('range',RANGE_OPTS)}</div>
  <div class="sgroup"><span class="flabel">Paid with</span>${segF('account',[['all','Any'],['bank','Bank'],['cash','Cash']])}</div>
  ${cats.length?`<div class="sgroup"><span class="flabel">Categories</span><div class="pills" style="max-height:none">${cats.map(c=>`<button class="pill ${f.cats.includes(c.id)?'on':''}" data-act="fcat" data-id="${esc(c.id)}" style="--h:${esc(c.hue)}" aria-pressed="${f.cats.includes(c.id)}"><i></i>${esc(c.name)}</button>`).join('')}</div></div>`:''}
  ${F().places&&f.type!=='loan'?`<div class="sgroup"><div class="field" style="margin:0"><label for="f_place">Place</label><select id="f_place"><option value="">Any place</option>${S.places.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<option value="${esc(p.id)}" ${p.id===f.placeId?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div></div>`:''}
  ${F().loans&&(f.type==='loan'||f.type==='all')?`<div class="sgroup"><div class="field" style="margin:0"><label for="f_person">Person</label><select id="f_person"><option value="">Anyone</option>${S.people.map(p=>`<option value="${esc(p.id)}" ${p.id===f.personId?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div></div>`:''}
  <div class="btns"><button class="btn pri grow" data-act="close">Show ${n} result${n===1?'':'s'}</button><button class="btn" data-act="fclear">Clear filters</button></div>`)}
function menuHTML(){
  const items=[['nav','summary','chart','Summary','spending by category and place'],...(F().loans?[['nav','people','people','People','who owes what']]:[]),['sheet','filter','filter','Filter','type, period, account, category'],['sheet','settings','sliders','Customise','look, totals, accounts, data'],['sheet','backup','save','Backup and restore','keep a copy of everything'],['sheet','help','help','How to type entries','examples you can tap']];
  return sheetWrap('Menu',`<div class="menu">${items.map(([a,v,i,l,s])=>`<button data-act="${a}" data-v="${esc(v)}">${ICON[i]}<span><b>${l}</b><small>${s}</small></span></button>`).join('')}</div>
  ${S.sample?`<div class="banner"><span>You're looking at sample data.</span><button data-act="clearsample">Start empty</button></div>`:''}`)}
// month calendar: days shaded by how much was spent, tap a day, then jump to it in the list
function calHTML(){const[y,m]=UI.calMonth,sel=new Date(UI.calSel),now=new Date();
  const days=new Date(y,m+1,0).getDate(),start=new Date(y,m,1).getDay();
  const spend={},list={};for(const e of S.entries){const d=new Date(e.ts);if(d.getFullYear()!==y||d.getMonth()!==m)continue;const k=d.getDate();(list[k]=list[k]||[]).push(e);
    if(e.currency!==S.design.currency)continue;if(e.type==='expense')spend[k]=(spend[k]||0)+e.amount;else if(e.type==='refund')spend[k]=(spend[k]||0)-e.amount}
  const max=Math.max(0,...Object.values(spend));let cells='';
  for(let i=0;i<start;i++)cells+='<span></span>';
  for(let k=1;k<=days;k++){const s=spend[k]||0,lv=s>0&&max>0?Math.max(1,Math.ceil(s/max*4)):0,has=!!list[k];
    const isSel=sel.getFullYear()===y&&sel.getMonth()===m&&sel.getDate()===k,isToday=now.getFullYear()===y&&now.getMonth()===m&&now.getDate()===k;
    cells+=`<button class="cd lv${lv}${has?' has':''}${isSel?' on':''}${isToday?' today':''}" data-act="calday" data-d="${k}" aria-label="${k} ${MONTHS_FULL[m]}${s>0?', spent '+fmt(s):''}" aria-pressed="${isSel}">${k}</button>`}
  const sk=sel.getFullYear()===y&&sel.getMonth()===m?sel.getDate():null,sl=sk&&list[sk]||[];
  const info=sk?`<div class="calinfo"><div><b>${dayLabel(new Date(y,m,sk).getTime())}</b><span>${sl.length?esc(dayInfo(sl)):'Nothing logged'}</span></div>${sl.length?'<button class="btn pri" data-act="caljump">Jump to this day</button>':''}</div>`:'<p class="note">Tap a day.</p>';
  return sheetWrap('Jump to a day',`<div class="calnav">${ib('calmon','-1','back','Previous month')}<strong>${MONTHS_FULL[m]} ${y}</strong>${ib('calmon','1','fwd','Next month')}</div>
  <div class="calgrid">${['S','M','T','W','T','F','S'].map(x=>`<span class="cw">${x}</span>`).join('')}${cells}</div>
  <div class="callegend"><span>less</span><i class="lv1"></i><i class="lv2"></i><i class="lv3"></i><i class="lv4"></i><span>more spent</span></div>${info}`)}
function refreshFiltered(){renderHdr();renderBar();renderMain();if(UI.sheet==='filter')renderOverlay();$('#main').scrollTop=0}

// spending (minus refunds) in a month up to and including a given day of that month
function spentUntil(key,day){let s=0;for(const e of S.entries){if(mk(e.ts)!==key||e.currency!==S.design.currency||new Date(e.ts).getDate()>day)continue;
  if(e.type==='expense')s+=e.amount;else if(e.type==='refund')s-=e.amount}return r3(s)}
// a few plain sentences about the month
function insightsHTML(key){const st=monthStats(key),prev=monthStats(key-1),now=new Date();
  const isCur=key===mk(now.getTime()),y=Math.floor(key/12),m=key%12,pm=MONTHS_FULL[(m+11)%12];
  const daysIn=new Date(y,m+1,0).getDate(),elapsed=isCur?now.getDate():daysIn;
  if(st.exp<=0)return'';const L=[];
  // vs last month: for the current month compare the same days (1st to today) so it's fair
  const cmp=isCur?spentUntil(key-1,now.getDate()):prev.exp;
  if(cmp>0){const pct=Math.round((st.exp-cmp)/cmp*100);
    L.push(pct===0?`Spent the same as ${isCur?pm+' 1–'+now.getDate():pm}`:`Spent <b class="${pct>0?'up':'down'}">${Math.abs(pct)}% ${pct>0?'more':'less'}</b> than ${isCur?pm+' 1–'+now.getDate():pm}`)}
  // category that changed most since last month
  if(prev.exp>0){let best=null;for(const k of new Set([...Object.keys(st.byCat),...Object.keys(prev.byCat)])){const d=r3((st.byCat[k]||0)-(prev.byCat[k]||0));if(!best||Math.abs(d)>Math.abs(best.d))best={k,d}}
    if(best&&Math.abs(best.d)>=1)L.push(`${esc(catById(best.k)?.name||'Other')} <b class="${best.d>0?'up':'down'}">${best.d>0?'up':'down'} ${fmt(Math.abs(best.d))}</b> vs ${pm}`)}
  const avg=r3(st.exp/elapsed);
  L.push(`Daily average <b>${fmt(avg)}</b>${isCur&&elapsed<daysIn?` · on pace for about <b>${fmt(Math.round(avg*daysIn))}</b> this month`:''}`);
  const wd=[0,0,0,0,0,0,0];for(const e of S.entries){if(mk(e.ts)===key&&e.type==='expense'&&e.currency===S.design.currency)wd[new Date(e.ts).getDay()]+=e.amount}
  const wi=wd.indexOf(Math.max(...wd));if(wd[wi]>0)L.push(`You spend most on <b>${['Sundays','Mondays','Tuesdays','Wednesdays','Thursdays','Fridays','Saturdays'][wi]}</b>`);
  const tp=Object.entries(st.byPlace).filter(([id])=>placeById(id)).sort((a,b)=>b[1].t-a[1].t)[0];
  if(tp&&tp[1].t>0)L.push(`Top place <b>${esc(placeById(tp[0]).name)}</b> · ${fmt(tp[1].t)} over ${tp[1].n} visit${tp[1].n===1?'':'s'}`);
  return`<div class="insights"><h2>At a glance</h2>${L.map(l=>`<p>${l}</p>`).join('')}</div>`}
function summaryHTML(){
  const now=new Date();const key=UI.month??mk(now.getTime());const y=Math.floor(key/12),mo=key%12;const st=monthStats(key);
  let h=`<div class="mnav">${ib('month','-1','back','Previous month')}<strong>${MONTHS_FULL[mo]} ${y}</strong>${ib('month','1','fwd','Next month')}</div>`;
  h+=`<div class="stats">${stat('Spent',st.exp)}${stat('Income',st.inc,'inc')}${stat('Net',st.inc-st.exp,st.inc-st.exp<0?'neg':'')}</div>`;
  h+=insightsHTML(key);
  const cats=Object.entries(st.byCat).filter(c=>c[1]>0.0005).sort((a,b)=>b[1]-a[1]);
  h+=`<div class="sec"><h2>Spending by category</h2>`;
  if(!cats.length)h+=`<p class="note">No spending this month.</p>`;
  const max=cats.length?cats[0][1]:1;
  for(const[cid,val]of cats){const c=catById(cid)||{name:'Uncategorised',hue:'#888'};const open=UI.openCat===cid;
    h+=`<button class="bar-row" data-act="catopen" data-id="${esc(cid)}" aria-expanded="${open}"><span class="bl"><span>${esc(c.name)}</span><span class="num">${fmt(val)}</span></span><span class="track"><span style="width:${Math.max(2,val/max*100).toFixed(1)}%;background:${esc(c.hue)}"></span></span></button>`;
    if(open){const list=S.entries.filter(e=>mk(e.ts)===key&&e.type==='expense'&&(e.categoryId||'other')===cid&&e.currency===S.design.currency).sort((a,b)=>b.ts-a.ts);h+=`<div class="sublist">${list.map(rowHTML).join('')}</div>`}
  }
  h+=`</div>`;
  if(F().places&&F().byPlace){const pl=Object.entries(st.byPlace).sort((a,b)=>b[1].t-a[1].t);
    if(pl.length){h+=`<div class="sec"><h2>By place</h2>`;for(const[pid,o]of pl){const p=placeById(pid);if(!p)continue;const c=catById(p.categoryId);
      h+=`<div class="row">${catTile(c)}<span class="rt"><span class="t1">${esc(p.name)}</span><span class="t2">${o.n} visit${o.n>1?'s':''} · ${esc(c?c.name:'')}</span></span><span class="amt">${fmt(o.t)}</span></div>`}h+=`</div>`}}
  const inc=Object.entries(st.incCat).sort((a,b)=>b[1]-a[1]);
  if(inc.length){h+=`<div class="sec"><h2>Income</h2>`;for(const[cid,val]of inc){const c=catById(cid);h+=`<div class="row">${catTile(c)}<span class="rt"><span class="t1">${esc(c?c.name:'Income')}</span></span><span class="amt inc">+${fmt(val)}</span></div>`}h+=`</div>`}
  if(st.other)h+=`<p class="note">${st.other} entr${st.other>1?'ies':'y'} in other currencies ${st.other>1?'are':'is'} listed on the home screen but not counted in these totals.</p>`;
  h+=`<div class="btns"><button class="btn" data-act="sheet" data-v="manage">${ICON.tag} Categories and places</button><button class="btn" data-act="sheet" data-v="csv">Export CSV</button></div>`;
  return h;
}
function peopleHTML(){
  const o=owedTotals();let h=`<div class="stats">${stat('Owed to you',o.toYou,'inc')}${stat('You owe',o.youOwe,'owe')}</div>`;
  const ppl=S.people.slice().sort((a,b)=>Math.abs(balance(b.id))-Math.abs(balance(a.id)));
  if(!ppl.length)h+=`<div class="empty"><strong>No one yet</strong>Type <code>lent 20 to ali</code> to start tracking a loan.</div>`;
  for(const p of ppl){const b=balance(p.id);
    h+=`<button class="row" data-act="person" data-id="${esc(p.id)}"><span class="tile av" aria-hidden="true">${esc(p.name.slice(0,2).toUpperCase())}</span><span class="rt"><span class="t1">${esc(p.name)}</span></span><span class="amt ${b>0?'inc':b<0?'owe':'loanamt'}">${b>0?'owes you '+fmt(b):b<0?'you owe '+fmt(-b):'settled'}</span></button>`}
  h+=`<p class="note">Loans don't count as spending or income.</p>`;
  return h;
}
function personHTML(){
  const p=personById(UI.personId);if(!p)return'';const b=balance(p.id);
  let h=`<div class="stat" style="margin-top:var(--s1)"><span class="lbl">${b>0?esc(p.name)+' owes you':b<0?'You owe '+esc(p.name):'All settled'}</span><span class="num big ${b>0?'inc':b<0?'owe':''}">${fmt(Math.abs(b))} ${esc(S.design.currency)}</span></div>`;
  if(b!==0)h+=`<div class="btns"><button class="btn grow" data-act="settle" data-id="${esc(p.id)}">Mark settled</button><button class="btn grow" data-act="part" data-id="${esc(p.id)}">Part payment</button></div>`;
  const hist=S.entries.filter(e=>e.personId===p.id).sort((a,b)=>b.ts-a.ts);
  h+=`<div class="sec"><h2>History</h2>${hist.length?listHTML(hist):'<p class="note">No loans yet.</p>'}</div>`;
  return h;
}
function renderPending(){
  const el=$('#pending');const P=UI.pending;
  if(!P){
    if(UI.toast&&UI.toast.deleted){const e=UI.toast.deleted;
      el.innerHTML=`<div class="card ok"><div class="chead"><div><div class="cline">Deleted · ${esc(entryLine(e))}</div><div class="csub">${esc(kindLabel(e))} · ${fmt(e.amount,e.currency)} ${esc(e.currency)} · ${dayLabel(e.ts)} ${hm(e.ts)}</div></div><button class="x" data-act="toastx" aria-label="Dismiss">${ICON.x}</button></div><div class="cact"><button class="link" data-act="undo">Undo</button></div></div>`;return}
    if(UI.toast&&!UI.toast.ids.length){el.innerHTML=`<div class="card ok"><div class="chead"><div>${UI.toast.learned.map(l=>`<div class="cline">${esc(l)}</div>`).join('')}</div><button class="x" data-act="toastx" aria-label="Dismiss">${ICON.x}</button></div></div>`;return}
    if(UI.toast&&UI.toast.ids.length>1){const es=UI.toast.ids.map(i=>S.entries.find(x=>x.id===i)).filter(Boolean);
      el.innerHTML=`<div class="card ok"><div class="chead"><div><div class="cline">Saved ${es.length} entries</div>${es.map(e=>`<div class="csub">${esc(entryLine(e))} · ${esc(kindLabel(e))} · ${fmt(e.amount,e.currency)} ${esc(e.currency)}</div>`).join('')}${UI.toast.learned.map(l=>`<div class="csub">${esc(l)}</div>`).join('')}</div><button class="x" data-act="toastx" aria-label="Dismiss">${ICON.x}</button></div><div class="cact"><button class="link" data-act="undo">Undo all</button></div></div>`;return}
    if(UI.toast){const e=S.entries.find(x=>x.id===UI.toast.ids[0]);if(!e){UI.toast=null;el.innerHTML='';return}
      el.innerHTML=`<div class="card ok"><div class="chead"><div><div class="cline">Saved · ${esc(entryLine(e))}</div><div class="csub">${esc(kindLabel(e))} · ${fmt(e.amount,e.currency)} ${esc(e.currency)} · ${dayLabel(e.ts)} ${hm(e.ts)}</div>${UI.toast.learned.map(l=>`<div class="csub">${esc(l)}</div>`).join('')}</div><button class="x" data-act="toastx" aria-label="Dismiss">${ICON.x}</button></div><div class="cact"><button class="link" data-act="undo">Undo</button><button class="link" data-act="edit" data-id="${esc(e.id)}">Edit</button></div></div>`;
    }else el.innerHTML='';
    return;
  }
  if(P.q==='batch'){const ds=UI.batch.done;
    el.innerHTML=`<div class="card"><div class="chead"><div><div class="cline">${ds.length} entries</div>${ds.map(d=>`<div class="csub">${esc(summaryLine(d))}${d.note?' · '+esc(d.note):''}</div>`).join('')}<div class="csub">${dayLabel(ds[0].ts)} ${hm(ds[0].ts)}</div></div><button class="x" data-act="pcancel" aria-label="Cancel entries">${ICON.x}</button></div><div class="cact"><button class="btn pri" data-act="batchok">Save all</button></div></div>`;return}
  const d=P.d;let body='';let cls='card';
  if(P.q==='which'){body=`<div class="cq">${esc(d.altsTitle)}</div><div class="alts">${d.alts.map((a,i)=>`<button class="alt" data-act="alt" data-i="${i}"><span>${esc(a.label)}</span><span>${esc(a.sub)}</span></button>`).join('')}</div>`}
  else if(P.q==='person'){body=`<div class="cq">New person</div><div class="field"><label for="np_name">Name</label><input id="np_name" value="${esc(d.newPersonName)}"></div><div class="cact"><button class="btn pri" data-act="personok">Save</button></div>`}
  else if(P.q==='category'){
    const pool=S.categories.filter(c=>c.kind===catKind(d.type));const freq={};for(const e of S.entries)if(e.categoryId)freq[e.categoryId]=(freq[e.categoryId]||0)+1;
    pool.sort((a,b)=>(freq[b.id]||0)-(freq[a.id]||0));
    let q='Pick a category';if(d.newPlace)q='New place. Which category?';else if(d.learn)q='Which category is "'+d.learn+'"?';
    body=`<div class="cq">${esc(q)}</div>`;
    if(d.newPlace)body+=`<div class="field"><label for="np_place">Save place as</label><input id="np_place" value="${esc(d.newPlace.name)}"></div>`;
    body+=`<div class="pills">${pool.map(c=>`<button class="pill" data-act="pickcat" data-id="${esc(c.id)}" style="--h:${esc(c.hue)}"><i></i>${esc(c.name)}</button>`).join('')}</div>`;
    if(d.learn)body+=`<label class="check"><input type="checkbox" id="np_learn" checked> Remember "${esc(d.learn)}" for next time</label>`;
  }
  else if(P.q==='overpay'){cls='card warn';const p=personById(d.personId),b=balance(p.id);const owed=d.type==='got_back'?b:-b;
    const diff=r3(d.amount-Math.max(0,owed));
    body=`<div class="cq">${d.type==='got_back'?esc(p.name)+' only owes you '+fmt(Math.max(0,owed))+'.':'You only owe '+esc(p.name)+' '+fmt(Math.max(0,owed))+'.'} Saving this means ${d.type==='got_back'?'you will owe '+esc(p.name):esc(p.name)+' will owe you'} ${fmt(diff)}.</div><div class="cact"><button class="btn pri" data-act="warnok">Save anyway</button></div>`}
  else if(P.q==='confirm'){body=`<div class="cact"><button class="btn pri" data-act="confirmok">Save</button></div>`}
  el.innerHTML=`<div class="${cls}"><div class="chead"><div><div class="cline">${esc(summaryLine(d))}</div><div class="csub">${esc(d.note?d.note+' · ':'')}${dayLabel(d.ts)} ${hm(d.ts)}${UI.batch?' · entry '+(UI.batch.done.length+1)+' of '+UI.batch.total:''}</div></div><button class="x" data-act="pcancel" aria-label="Cancel entry">${ICON.x}</button></div>${body}</div>`;
}

/* ---------- sheets ---------- */
function seg(key,opts){const cur=getD(key);return`<div class="seg" role="group">${opts.map(([v,l])=>`<button data-act="set" data-key="${key}" data-val="${esc(v)}" class="${String(cur)===String(v)?'on':''}" aria-pressed="${String(cur)===String(v)}">${l}</button>`).join('')}</div>`}
function getD(k){return k.split('.').reduce((o,p)=>o==null?o:o[p],S.design)}
function setD(k,v){const ps=k.split('.');let o=S.design;for(let i=0;i<ps.length-1;i++)o=o[ps[i]];o[ps[ps.length-1]]=v;persist()}
function tog(key,label,sub){return`<label class="tog"><span>${label}${sub?`<small>${sub}</small>`:''}</span><input type="checkbox" data-dset="${key}" ${getD(key)?'checked':''}></label>`}
const SWATCH=['#0f766e','#2563eb','#7c3aed','#c2410c','#be185d','#15803d','#334155','#a16207'];
function sheetWrap(ttl,body){return`<div class="scrim" data-act="close"></div><div class="sheet pad" role="dialog" aria-modal="true" aria-label="${esc(ttl)}"><div class="grab"></div><div class="shead"><h2>${esc(ttl)}</h2><button class="x" data-act="close" aria-label="Close">${ICON.x}</button></div>${body}</div>`}
function settingsHTML(){const d=S.design;
  return sheetWrap('Customise',`
  <div class="sgroup" style="border-top:0"><button class="btn" data-act="sheet" data-v="help">${ICON.help} How to type entries</button></div>
  <div class="sgroup"><div class="field" style="margin:0"><label for="s_name">App name</label><input id="s_name" data-dset="appName" value="${esc(d.appName)}"></div></div>
  <div class="sgroup"><span class="flabel">Theme</span>${seg('theme',[['system','System'],['light','Light'],['dark','Dark']])}</div>
  <div class="sgroup"><span class="flabel">Accent colour</span><div class="swatches">${SWATCH.map(c=>`<button class="sw ${d.accent.toLowerCase()===c?'on':''}" style="--c:${c}" data-act="set" data-key="accent" data-val="${c}" aria-label="Accent ${c}"></button>`).join('')}<input type="color" id="s_acc" data-dset="accent" value="${esc(d.accent)}" aria-label="Custom accent colour" style="width:2.4em;height:2em;border:1px solid var(--line-2);border-radius:8px;background:none;padding:2px"></div>
    <div class="colorrow"><label for="s_inc">Income colour</label><input type="color" id="s_inc" data-dset="income" value="${d.income}"></div>
    <div class="colorrow"><label for="s_exp">Warning and "you owe" colour</label><input type="color" id="s_exp" data-dset="expense" value="${d.expense}"></div></div>
  <div class="sgroup"><span class="flabel">Font</span>${seg('font',[['terminal','Terminal'],['plex','Plex Mono'],['space','Space Mono'],['modern','Modern']])}</div>
  <div class="sgroup"><span class="flabel">Category icons</span>${seg('iconStyle',[['icons','Icons'],['letters','Letters'],['tags','[tags]']])}</div>
  <div class="sgroup"><span class="flabel">Text size</span>${seg('fontSize',[['s','Small'],['m','Medium'],['l','Large'],['xl','Extra large']])}</div>
  <div class="sgroup"><span class="flabel">Corners</span>${seg('corners',[['square','Square'],['soft','Soft'],['round','Round']])}</div>
  <div class="sgroup"><span class="flabel">Spacing</span>${seg('density',[['compact','Compact'],['comfortable','Comfortable']])}</div>
  <div class="sgroup"><span class="flabel">Entry rows</span>${seg('rows',[['two','Detailed'],['one','One line']])}${tog('swipeLabels','Words on swipe buttons','"Delete" and "Duplicate" next to the icons')}${tog('haptics','Haptics','Small vibrations when you save, swipe, delete or scrub dates')}</div>
  <div class="sgroup"><span class="flabel">Text box position</span>${seg('inputPos',[['top','Top'],['bottom','Bottom']])}</div>
  <div class="sgroup"><span class="flabel">Widget pop-up opens at</span>${seg('popupPos',[['top','Top'],['middle','Middle'],['bottom','Bottom']])}</div>
  <div class="sgroup"><span class="flabel">Home screen totals</span>${tog('showCash','Cash in hand line','all the money you have right now')}${tog('showIn','In')}${tog('showOut','Out')}${tog('showLeft','Net cash','cash in hand + owed to you − you owe')}${tog('showLoan','Loans','+ owed to you, − you owe')}</div>
  <div class="sgroup"><span class="flabel">Features</span>
    ${tog('features.loans','Lending and borrowing','lent, borrowed, paid back, People screen')}
    ${tog('features.places','Places','safa becomes Al Safa Restaurant')}
    ${tog('features.byPlace','Spending by place','in Summary')}
    ${tog('features.shortcuts','@person and #place shortcuts')}
    ${tog('features.autofocus','Open the keyboard on start')}
    ${tog('kbSuggest','Keyboard suggestions','Your keyboard suggests words while you type. It may also autocorrect words like karak or knet')}
    ${tog('features.confirmAll','Confirm every entry','otherwise known entries save straight away')}</div>
  <div class="sgroup"><div class="field" style="margin:0"><label for="s_cur">Main currency</label><select id="s_cur" data-dset="currency">${CURRENCIES.map(c=>`<option ${c===d.currency?'selected':''}>${c}</option>`).join('')}</select></div></div>
  <div class="sgroup"><span class="flabel">Design</span><div class="btns" style="margin-top:0"><button class="btn" data-act="sheet" data-v="designjson">Export design</button><button class="btn" data-act="resetdesign">Reset design</button><button class="btn" data-act="sheet" data-v="setup">Run setup again</button></div></div>
  <div class="sgroup"><span class="flabel">Accounts</span>
    <span class="flabel" style="display:block;margin:var(--s1) 0 var(--s2);font-weight:600">Default when you don't say cash or card</span>${seg('defaultAccount',[['bank','Bank'],['cash','Cash']])}
    <div class="inrow" style="margin-top:var(--s2)"><div class="field" style="flex:1"><label for="s_open_bank">Bank starting balance</label><input id="s_open_bank" inputmode="decimal" value="${fmt(S.openings.bank).replace(/,/g,'')}"></div><div class="field" style="flex:1"><label for="s_open_cash">Cash starting balance</label><input id="s_open_cash" inputmode="decimal" value="${fmt(S.openings.cash).replace(/,/g,'')}"></div></div>
    <p class="note" style="margin-top:0">Or type <code>balance cash 40</code>, <code>balance bank 900</code> or <code>balance 940</code> in the entry box any time to match what's really there.</p></div>
  <div class="sgroup"><span class="flabel">Data in this browser</span><div class="btns" style="margin-top:0"><button class="btn" data-act="sheet" data-v="backup">Backup and restore</button><button class="btn" data-act="sheet" data-v="manage">Categories, places, people</button><button class="btn" data-act="sheet" data-v="csv">Export CSV</button><button class="btn" data-act="resetsample">Load sample data</button><button class="btn danger" data-act="clearall">Delete all entries</button></div></div>`)}
const EXAMPLES=[
 ['spend 10 at safa','known place'],['spent 10 kd on food at xyz restaurant','new place, category given'],['spent 7 at zzz cafe','new place, asks category'],
 ['coffee 1.250','category from a word'],['paid 3.5 for taxi yesterday','date word'],['500 fils parking','fils'],['25 usd amazon last friday','other currency'],
 ['got 650 kd salary','income'],['refund 12 kd noon','lowers Shopping spending'],['taxi 3 cash','paid in cash'],['lulu 20 knet','card / knet / visa = Bank'],['atm 50','Bank → Cash, not spending'],['deposited 100','Cash → Bank'],['balance cash 40','set what is in your wallet'],['balance 940','set total cash in hand'],['lent 20 to ali','loan'],['borrowed 50 from sara','loan'],
 ['ali paid back 20','repayment to you'],['paid sara back 50','you repay'],['paid 8 for ali lunch','paid on their behalf'],
 ['paid safa 10','person or place?'],['paid sara 20','repay or expense?'],['lent 15 to omar','new person'],['dinner 12 #safa','# forces a place'],['gave 5 to @hassan','@ forces a person']];
function helpHTML(){return sheetWrap('How to type entries',`<div class="help">
  <p>Write it the way you'd say it. Order doesn't matter. The app finds:</p>
  <p><b>Amount</b> the first number. <b>Currency</b> kd, usd, $, fils, or ${esc(S.design.currency)} if you leave it out. <b>Date</b> now, or today, yesterday, last friday, 15 nov, at 3pm.</p>
  <p><b>at</b> a place · <b>on</b> a category · <b>to / from</b> a person · <b>for</b> a category or a person.</p>
  <p><b>Swipe an entry</b> left to delete it (you can undo), or right to add it again today.</p>
  <p>Tap an example to put it in the box:</p></div>
  <div class="ex">${EXAMPLES.map(([t,s])=>`<button data-act="example" data-t="${esc(t)}"><code>${esc(t)}</code><span>${esc(s)}</span></button>`).join('')}</div>`)}
function toLocalInput(ts){const d=new Date(ts);const p=n=>String(n).padStart(2,'0');return`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`}
function entryHTML(id){const e=S.entries.find(x=>x.id===id);if(!e)return sheetWrap('Entry','<p class="note">This entry no longer exists.</p>');
  const types=[['expense','Expense'],['income','Income'],['refund','Refund']].concat(F().loans?[['lent','Lent'],['borrowed','Borrowed'],['got_back','Paid back to you'],['paid_back','You paid back']]:[]).concat([['transfer','Move between Bank and Cash']]);
  const tr=e.type==='transfer';
  const loan=isLoan(e.type);
  const catOpts=k=>S.categories.filter(c=>c.kind===k).map(c=>`<option value="${esc(c.id)}" ${c.id===e.categoryId?'selected':''}>${esc(c.name)}</option>`).join('');
  return sheetWrap('Edit entry',`
  <div class="field"><label for="e_type">Type</label><select id="e_type">${types.map(([v,l])=>`<option value="${esc(v)}" ${v===e.type?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="inrow"><div class="field" style="flex:2"><label for="e_amt">Amount</label><input id="e_amt" inputmode="decimal" value="${esc(e.amount)}"></div><div class="field" style="flex:1"><label for="e_cur">Currency</label><input id="e_cur" value="${esc(e.currency)}"></div></div>
  <div class="field"><label for="e_acct" id="l_acct">${tr?'From':'Paid with'}</label><select id="e_acct">${['bank','cash'].map(a=>`<option value="${a}" ${a===acctOf(e)?'selected':''}>${ACCT_NAME[a]}</option>`).join('')}</select></div>
  <div class="field" id="f_cat" ${loan||tr?'hidden':''}><label for="e_cat">Category</label><select id="e_cat"><optgroup label="Expense">${catOpts('expense')}</optgroup><optgroup label="Income">${catOpts('income')}</optgroup></select></div>
  <div class="field" id="f_place" ${loan||tr||!F().places?'hidden':''}><label for="e_place">Place</label><select id="e_place"><option value="">None</option>${S.places.map(p=>`<option value="${esc(p.id)}" ${p.id===e.placeId?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>
  <div class="field" id="f_person" ${loan?'':'hidden'}><label for="e_person">Person</label><select id="e_person">${S.people.map(p=>`<option value="${esc(p.id)}" ${p.id===e.personId?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>
  <div class="field"><label for="e_note">Note</label><input id="e_note" value="${esc(e.note)}"></div>
  <div class="field"><label for="e_dt">Date and time</label><input id="e_dt" type="datetime-local" value="${toLocalInput(e.ts)}"></div>
  <p class="err" id="e_err" hidden></p>
  <div class="btns"><button class="btn pri grow" data-act="esave" data-id="${esc(e.id)}">Save</button><button class="btn danger" data-act="edelete" data-id="${esc(e.id)}">Delete</button></div>`)}
function manageHTML(){const tab=UI.mtab;let list='';
  if(tab==='categories'){for(const k of ['expense','income']){list+=`<h3 class="day">${k==='expense'?'Expense':'Income'}</h3>`;for(const c of S.categories.filter(c=>c.kind===k))list+=`<button class="row" data-act="medit" data-kind="cat" data-id="${esc(c.id)}">${catTile(c)}<span class="rt"><span class="t1">${esc(c.name)}</span><span class="t2">${esc(c.synonyms.join(', '))}</span></span></button>`}}
  if(tab==='places'){for(const p of S.places.slice().sort((a,b)=>a.name.localeCompare(b.name))){const c=catById(p.categoryId);list+=`<button class="row" data-act="medit" data-kind="place" data-id="${esc(p.id)}">${catTile(c)}<span class="rt"><span class="t1">${esc(p.name)}</span><span class="t2">${esc((c?c.name:'')+' · '+p.aliases.join(', '))}</span></span></button>`}}
  if(tab==='people'){for(const p of S.people)list+=`<button class="row" data-act="medit" data-kind="person" data-id="${esc(p.id)}"><span class="tile av" aria-hidden="true">${esc(p.name.slice(0,2).toUpperCase())}</span><span class="rt"><span class="t1">${esc(p.name)}</span><span class="t2">${esc(balLabel(p)+(p.aliases.length?' · '+p.aliases.join(', '):''))}</span></span></button>`}
  const kind={categories:'cat',places:'place',people:'person'}[tab];
  return sheetWrap('Categories, places, people',`<div class="seg">${[['categories','Categories'],['places','Places'],['people','People']].map(([v,l])=>`<button data-act="mtab" data-v="${esc(v)}" class="${tab===v?'on':''}">${l}</button>`).join('')}</div>
   <div class="btns" style="margin-top:var(--s3)"><button class="btn" data-act="medit" data-kind="${kind}" data-id="new">Add ${kind==='cat'?'category':kind}</button></div>${dupHTML(kind)}<div class="mlist">${list}</div>`)}
function dupHTML(kind){if(kind==='cat')return'';const pairs=dupPairs(kind);if(!pairs.length)return'';
  return`<div class="dups"><span class="flabel">Possible duplicates</span>${pairs.map(([f,t])=>`<div class="duprow"><span><b>${esc(f.name)}</b> → <b>${esc(t.name)}</b><small>${useCount(kind,f.id)} + ${useCount(kind,t.id)} entries</small></span><button class="btn pri" data-act="mdup" data-kind="${kind}" data-from="${f.id}" data-to="${t.id}">Merge</button><button class="x" data-act="dupno" data-k="${f.id}|${t.id}" aria-label="Not a duplicate">${ICON.x}</button></div>`).join('')}</div>`}
/* ---------- merging duplicates ---------- */
const itemsOf=kind=>kind==='place'?S.places:kind==='person'?S.people:S.categories;
const itemById=(kind,id)=>itemsOf(kind).find(x=>x.id===id);
const namesOfKind=(kind,x)=>kind==='cat'?[x.name,...x.synonyms]:[x.name,...(x.aliases||[])];
const useCount=(kind,id)=>S.entries.filter(e=>(kind==='place'?e.placeId:kind==='person'?e.personId:e.categoryId)===id).length;
function mergeBlock(kind,id){const me=itemById(kind,id);
  const others=itemsOf(kind).filter(x=>x.id!==id&&(kind!=='cat'||x.kind===me.kind)).sort((a,b)=>a.name.localeCompare(b.name));
  if(!others.length)return'';const n=useCount(kind,id);
  return`<div class="sgroup" style="margin-top:var(--s4)"><span class="flabel">Merge into another ${kind==='cat'?'category':kind}</span>
    <p class="note" style="margin-top:0">Moves ${n} entr${n===1?'y':'ies'} and all short names from "${esc(me.name)}" into the one you pick, then removes "${esc(me.name)}".</p>
    <div class="inrow"><div class="field" style="flex:1;margin:0"><label for="m_into" class="sr-only">Merge into</label><select id="m_into">${others.map(o=>`<option value="${esc(o.id)}">${esc(o.name)}</option>`).join('')}</select></div>
    <button class="btn" data-act="mmerge" data-kind="${kind}" data-id="${esc(id)}">Merge</button></div></div>`}
function mergeItems(kind,from,to){if(from===to)return;const a=itemById(kind,from),b=itemById(kind,to);if(!a||!b)return;
  const key=kind==='place'?'placeId':kind==='person'?'personId':'categoryId';
  S.entries.forEach(e=>{if(e[key]===from)e[key]=to});
  if(kind==='cat'){S.places.forEach(p=>{if(p.categoryId===from)p.categoryId=to});
    b.synonyms=[...new Set([...b.synonyms,...a.synonyms,a.name.toLowerCase()])];S.categories=S.categories.filter(x=>x.id!==from)}
  else{b.aliases=[...new Set([...(b.aliases||[]),...(a.aliases||[]),a.name.toLowerCase()])].filter(x=>nn(x)!==nn(b.name));
    if(kind==='place')S.places=S.places.filter(x=>x.id!==from);else S.people=S.people.filter(x=>x.id!==from)}
  persist()}
// pairs that probably mean the same place or person: same name, one letter apart, or one name inside the other
function dupPairs(kind){const items=itemsOf(kind),out=[];
  for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){const A=items[i],B=items[j];
    const hit=namesOfKind(kind,A).some(x=>namesOfKind(kind,B).some(y=>{const a=nn(x),b=nn(y);if(!a||!b)return false;if(a===b)return true;
      // one-letter typos only count on longer names (so Sara / Safa aren't flagged); one name inside the other needs 4+ letters
      if(Math.min(a.length,b.length)>=6&&lev(a,b)<=1)return true;return Math.min(a.length,b.length)>=4&&(a.includes(b)||b.includes(a))}));
    if(hit){const ka=useCount(kind,A.id),kb=useCount(kind,B.id);out.push(kb>ka?[A,B]:[B,A])}} // [from,into]: keep the one used more
  return out.filter(([f,t])=>!(UI.dupIgnore||[]).includes(f.id+'|'+t.id))}
function mformHTML(kind,id){const isNew=id==='new';
  if(kind==='cat'){const c=isNew?{name:'',kind:'expense',synonyms:[]}:catById(id);
    return sheetWrap(isNew?'New category':'Edit category',`<div class="field"><label for="m_name">Name</label><input id="m_name" value="${esc(c.name)}"></div>
    ${isNew?`<div class="field"><label for="m_kind">Type</label><select id="m_kind"><option value="expense">Expense</option><option value="income">Income</option></select></div>`:''}
    <div class="field"><label for="m_syn">Words that mean this category (comma separated)</label><textarea id="m_syn">${esc(c.synonyms.join(', '))}</textarea></div>${(BUILTIN[c.id]||[]).length?`<p class="note">Also understood: ${esc(BUILTIN[c.id].join(', '))}</p>`:''}
    <p class="err" id="m_err" hidden></p><div class="btns"><button class="btn pri grow" data-act="msave" data-kind="cat" data-id="${esc(id)}">Save</button>${isNew||c.id==='other'||c.id==='otherin'?'':`<button class="btn danger" data-act="mdelete" data-kind="cat" data-id="${esc(id)}">Delete</button>`}</div>${isNew?'':'<p class="note">Deleting moves its entries to Other.</p>'}${isNew||c.id==='other'||c.id==='otherin'?'':mergeBlock('cat',id)}`)}
  if(kind==='place'){const p=isNew?{name:'',categoryId:'food',aliases:[]}:placeById(id);
    return sheetWrap(isNew?'New place':'Edit place',`<div class="field"><label for="m_name">Name</label><input id="m_name" value="${esc(p.name)}"></div>
    <div class="field"><label for="m_cat">Category</label><select id="m_cat">${S.categories.filter(c=>c.kind==='expense').map(c=>`<option value="${esc(c.id)}" ${c.id===p.categoryId?'selected':''}>${esc(c.name)}</option>`).join('')}</select></div>
    <div class="field"><label for="m_syn">Short names you might type (comma separated)</label><textarea id="m_syn">${esc(p.aliases.join(', '))}</textarea></div>
    <p class="err" id="m_err" hidden></p><div class="btns"><button class="btn pri grow" data-act="msave" data-kind="place" data-id="${esc(id)}">Save</button>${isNew?'':`<button class="btn danger" data-act="mdelete" data-kind="place" data-id="${esc(id)}">Delete</button>`}</div>${isNew?'':mergeBlock('place',id)}`)}
  const p=isNew?{name:'',aliases:[]}:personById(id);
  return sheetWrap(isNew?'New person':'Edit person',`<div class="field"><label for="m_name">Name</label><input id="m_name" value="${esc(p.name)}"></div>
    <div class="field"><label for="m_syn">Other names or spellings (comma separated)</label><textarea id="m_syn">${esc(p.aliases.join(', '))}</textarea></div>
    <p class="err" id="m_err" hidden></p><div class="btns"><button class="btn pri grow" data-act="msave" data-kind="person" data-id="${esc(id)}">Save</button>${isNew?'':`<button class="btn danger" data-act="mdelete" data-kind="person" data-id="${esc(id)}">Delete</button>`}</div>${isNew?'':mergeBlock('person',id)}`)}
function csvText(){const q=v=>{v=String(v??'');return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
  const rows=[['date','time','type','amount','currency','account','to_account','category','place','person','note']];
  for(const e of sorted()){const d=new Date(e.ts);rows.push([d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),hm(e.ts),e.type,e.amount.toFixed(dec(e.currency)),e.currency,acctOf(e),e.type==='transfer'?(e.toAccount||otherAcct(acctOf(e))):'',catById(e.categoryId)?.name||'',placeById(e.placeId)?.name||'',personById(e.personId)?.name||'',e.note])}
  return rows.map(r=>r.map(q).join(',')).join('\n')}
function outHTML(ttl,txt,hint){return sheetWrap(ttl,`<p class="note" style="margin-top:0">${hint}</p><textarea class="out" id="copysrc" readonly>${esc(txt)}</textarea><div class="btns"><button class="btn pri" data-act="copy">Copy</button></div>`)}
function renderOverlay(){
  const o=$('#overlay');const s=UI.sheet;if(!s){o.hidden=true;o.innerHTML='';return}
  let h='';
  if(s==='settings')h=settingsHTML();else if(s==='help')h=helpHTML();else if(s==='filter')h=filterHTML();else if(s==='menu')h=menuHTML();else if(s==='cal')h=calHTML();else if(s==='backup')h=backupHTML();else if(s==='entry')h=entryHTML(UI.arg);
  else if(s==='manage')h=manageHTML();else if(s==='mform')h=mformHTML(UI.arg.kind,UI.arg.id);else if(s==='setup')h=setupHTML();
  else if(s==='csv')h=outHTML('Export CSV',csvText(),'Copy this into a .csv file or paste it into Excel. The finished app will save the file directly.');
  else if(s==='designjson')h=outHTML('Export design',JSON.stringify(S.design,null,2),'Copy this and send it to Claude to build the real app with your exact design.');
  const keep=o.querySelector('.sheet')?.scrollTop||0;const same=o.dataset.s===s;
  o.innerHTML=h;o.hidden=false;o.dataset.s=s;if(same)o.querySelector('.sheet').scrollTop=keep;
}
function openSheet(s,arg){UI.sheet=s;UI.arg=arg??null;$('#overlay').dataset.s='';renderOverlay();const f=$('#overlay .sheet');if(f)f.focus?.()}
function closeSheet(){UI.sheet=null;renderOverlay()}

/* ---------- events ---------- */
function showErr(msg){const e=$('#err');e.textContent=msg||'';e.hidden=!msg}
$('#form').addEventListener('submit',ev=>{ev.preventDefault();const inp=$('#q');const v=inp.value.trim();if(!v){showErr('Type an entry first, like spend 10 at safa');return}
  // "balance 500" (total), "balance cash 40", "bank balance 900": set what's really there
  const lv=v.toLowerCase().replace(/,/g,'').trim();
  const bm=lv.match(/^(?:my\s+)?balance(?:\s+(cash|bank))?(?:\s+is)?\s+(-?\d+(?:\.\d+)?)\s*(?:kd|kwd)?\.?$/)||lv.match(/^(?:my\s+)?(cash|bank)\s+balance(?:\s+is)?\s+(-?\d+(?:\.\d+)?)\s*(?:kd|kwd)?\.?$/);
  if(bm){const which=bm[1]||null,target=r3(+bm[2]),b=balances();let msg;
    if(which){S.openings[which]=r3((S.openings[which]||0)+target-b[which]);msg=ACCT_NAME[which]+' set to '+fmt(target)+' '+S.design.currency+'.'}
    else{const a=S.design.defaultAccount||'bank';S.openings[a]=r3((S.openings[a]||0)+target-cashInHand());msg='Cash in hand set to '+fmt(target)+' '+S.design.currency+' (difference applied to '+ACCT_NAME[a]+').'}
    persist();inp.value='';showErr('');UI.pending=null;UI.batch=null;
    UI.toast={ids:[],learned:[msg]};render();clearTimeout(UI.tt);UI.tt=setTimeout(()=>{UI.toast=null;renderPending()},7000);return}
  const r=parseAll(v);if(r.error){showErr(r.error);return}showErr('');inp.value='';UI.batch=null;
  if(r.drafts.length>1)startBatch(r.drafts);else advance(r.drafts[0])});
$('#q').addEventListener('input',()=>{showErr('');renderSugg()});
$('#form').addEventListener('submit',()=>setTimeout(renderSugg,0));
$('#q').addEventListener('keydown',ev=>{if(ev.key==='Tab'&&UI.sugg&&UI.sugg.length){ev.preventDefault();$('#q').value=UI.sugg[0];renderSugg()}});
function armed(btn,label){if(btn.dataset.armed)return true;btn.dataset.armed='1';const old=btn.textContent;btn.textContent=label;setTimeout(()=>{if(btn.isConnected){delete btn.dataset.armed;btn.textContent=old}},3500);return false}
document.getElementById('app').addEventListener('click',ev=>{
  const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;const id=b.dataset.id;
  if(UI.swipedAt&&Date.now()-UI.swipedAt<400&&b.closest('.swp')&&a!=='swdel')return; // a swipe isn't a tap (the Delete tile is always a tap)
  switch(a){
  case'nav':UI.sheet=null;UI.view=b.dataset.v;UI.month=null;UI.openCat=null;render();$('#main').scrollTop=0;break;
  case'back':UI.view=UI.view==='person'?'people':'home';render();break;
  case'person':UI.view='person';UI.personId=id;render();$('#main').scrollTop=0;break;
  case'sheet':openSheet(b.dataset.v);break;
  case'close':closeSheet();break;
  case'search':{if(UI.searchOpen&&!UI.search){UI.searchOpen=false;renderBar()}else{UI.searchOpen=true;renderBar();$('#sq')?.focus()}break}
  case'searchx':UI.search='';UI.searchOpen=false;refreshFiltered();break;
  case'tile':{const v=b.dataset.v;
    if(v==='in'||v==='out'){UI.filter={...noFilter(),type:v==='in'?'income':'expense',range:'month'};UI.search='';UI.searchOpen=false;refreshFiltered()}
    else if(v==='left'){UI.view='summary';UI.month=null;UI.openCat=null;render();$('#main').scrollTop=0}
    else if(v==='owed'){UI.view='people';render();$('#main').scrollTop=0}
    break}
  case'day':{const k=b.dataset.k;if(UI.openDays.has(k))UI.openDays.delete(k);else UI.openDays.add(k);renderMain();break}
  case'moredays':UI.daysLimit+=14;renderMain();break;
  case'fset':{const k=b.dataset.key,v=b.dataset.val;UI.filter[k]=v;
    if(k==='type'){const kinds=v==='income'?['income']:v==='expense'?['expense']:v==='loan'?[]:['expense','income'];
      UI.filter.cats=UI.filter.cats.filter(id=>kinds.includes(catById(id)?.kind));if(v==='loan')UI.filter.placeId='';if(v==='expense'||v==='income')UI.filter.personId=''}
    refreshFiltered();break}
  case'fcat':{const c=UI.filter.cats;const i=c.indexOf(id);if(i>=0)c.splice(i,1);else c.push(id);refreshFiltered();break}
  case'cal':{const d=new Date(+b.dataset.ts);d.setHours(0,0,0,0);UI.calSel=d.getTime();UI.calMonth=[d.getFullYear(),d.getMonth()];openSheet('cal');break}
  case'calday':{const[y,m]=UI.calMonth;UI.calSel=new Date(y,m,+b.dataset.d).getTime();renderOverlay();break}
  case'calmon':{let[y,m]=UI.calMonth;m+=+b.dataset.v;if(m<0){m=11;y--}else if(m>11){m=0;y++}UI.calMonth=[y,m];renderOverlay();break}
  case'caljump':{const ts=UI.calSel;closeSheet();jumpToDay(ts+43200000);break}
  case'restore':doRestore(b);break;
  case'swdel':{swDelete(b.closest('.swp'),id);break}
  case'mmerge':{const to=$('#m_into').value;const tn=itemById(b.dataset.kind,to)?.name;if(!armed(b,'Tap again to merge'))break;
    const fn=itemById(b.dataset.kind,id)?.name;mergeItems(b.dataset.kind,id,to);UI.sheet='manage';renderOverlay();renderMain();
    UI.toast={ids:[],learned:['Merged "'+fn+'" into "'+tn+'".']};renderPending();clearTimeout(UI.tt);UI.tt=setTimeout(()=>{UI.toast=null;renderPending()},6000);break}
  case'mdup':{const k=b.dataset.kind,f=itemById(k,b.dataset.from),t=itemById(k,b.dataset.to);if(!f||!t)break;mergeItems(k,f.id,t.id);renderOverlay();renderMain();
    UI.toast={ids:[],learned:['Merged "'+f.name+'" into "'+t.name+'".']};renderPending();clearTimeout(UI.tt);UI.tt=setTimeout(()=>{UI.toast=null;renderPending()},6000);break}
  case'dupno':UI.dupIgnore=(UI.dupIgnore||[]).concat(b.dataset.k);renderOverlay();break;
  case'sugg':{const q=$('#q');q.value=UI.sugg[+b.dataset.i]||q.value;q.focus();renderSugg();break}
  case'totop':mainEl.scrollTo({top:0,behavior:'smooth'});break;
  case'cashsplit':UI.cashOpen=!UI.cashOpen;renderMain();break;
  case'acctfilter':UI.filter={...noFilter(),account:b.dataset.v};UI.search='';UI.searchOpen=false;refreshFiltered();break;
  case'chipx':{const k=b.dataset.k,f=UI.filter;if(k==='type')f.type='all';else if(k==='range')f.range='all';else if(k==='account')f.account='all';else if(k==='cat')f.cats=f.cats.filter(x=>x!==b.dataset.v);else if(k==='place')f.placeId='';else if(k==='person')f.personId='';refreshFiltered();break}
  case'fclear':UI.filter=noFilter();UI.search='';UI.searchOpen=false;refreshFiltered();break;
  case'month':{const cur=UI.month??mk(Date.now());UI.month=cur+(+b.dataset.v);UI.openCat=null;renderMain();break}
  case'catopen':UI.openCat=UI.openCat===id?null:id;renderMain();break;
  case'edit':openSheet('entry',id);break;
  case'clearsample':UI.sheet=null;S.entries=[];S.people=[];S.sample=false;persist();render();break;
  case'resetsample':{if(!armed(b,'Tap again to replace your entries'))break;const d=S.design;S=freshState();S.design=d;persist();closeSheet();render();break}
  case'clearall':{if(!armed(b,'Tap again to delete everything'))break;S.entries=[];S.sample=false;persist();closeSheet();render();break}
  case'setupstart':UI.setupStart=b.dataset.val;renderOverlay();break;
  case'setupskip':S.setupDone=true;persist();closeSheet();render();break;
  case'setupdone':{const ob=$('#s_open_bank'),oc=$('#s_open_cash');
    for(const [el,k] of [[ob,'bank'],[oc,'cash']]){const v=parseFloat(String(el&&el.value||'').replace(/,/g,''));if(!isNaN(v))S.openings[k]=r3(v)}
    if(S.sample&&(UI.setupStart||'empty')==='empty'){S.entries=[];S.people=[];S.sample=false}
    S.setupDone=true;persist();closeSheet();render();setTimeout(openKb,50);break}
  case'resetdesign':S.design=JSON.parse(JSON.stringify(DEFAULT_DESIGN));persist();render();break;
  case'set':{let v=b.dataset.val;setD(b.dataset.key,v);applyDesign();renderHdr();renderMain();renderOverlay();break}
  case'example':{closeSheet();const q=$('#q');q.value=b.dataset.t;q.focus();break}
  case'copy':{const ta=$('#copysrc');const txt=ta.value;
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(()=>{b.textContent='Copied'},()=>{ta.focus();ta.select();b.textContent='Text selected, press copy'})}else{ta.focus();ta.select();b.textContent='Text selected, press copy'}break}
  case'pcancel':UI.pending=null;UI.batch=null;renderPending();break;
  case'batchok':if(UI.batch)finish(UI.batch.done);break;
  case'toastx':UI.toast=null;renderPending();break;
  case'undo':{if(UI.toast&&UI.toast.deleted){S.entries.push(UI.toast.deleted);persist();UI.toast=null;render();break}
    if(UI.toast){const ids=UI.toast.ids;S.entries=S.entries.filter(e=>!ids.includes(e.id));persist();UI.toast=null;render()}break}
  case'alt':{const P=UI.pending;const alt=P.d.alts[+b.dataset.i];advance({...alt.d,alts:null});break}
  case'personok':{const P=UI.pending;const n=($('#np_name')?.value||'').trim();if(!n)break;const ex=best(S.people,personNames,n,true);
    if(ex.length){P.d.personId=ex[0].id;P.d.newPersonName=null}else{P.d.newPersonName=title(n)}P.d.personOk=true;advance(P.d);break}
  case'pickcat':{const P=UI.pending;const d=P.d;d.catId=id;if(d.newPlace){const n=($('#np_place')?.value||'').trim();if(n)d.newPlace.name=n}
    if(d.learn)d.learnOk=!!$('#np_learn')?.checked;advance(d);break}
  case'warnok':{UI.pending.d.warnOk=true;advance(UI.pending.d);break}
  case'confirmok':{UI.pending.d.confirmed=true;advance(UI.pending.d);break}
  case'settle':{const b2=balance(id);if(!b2)break;const d={amount:Math.abs(b2),currency:S.design.currency,ts:Date.now(),type:b2>0?'got_back':'paid_back',personId:id,note:'Marked settled',warnOk:true,confirmed:true};commit(d);break}
  case'part':{const p=personById(id);const b2=balance(id);const q=$('#q');q.value=b2>0?p.name.toLowerCase()+' paid back ':'paid '+p.name.toLowerCase()+' back ';q.focus();break}
  case'mtab':UI.mtab=b.dataset.v;renderOverlay();break;
  case'medit':openSheet('mform',{kind:b.dataset.kind,id});break;
  case'msave':saveManaged(b.dataset.kind,id);break;
  case'mdelete':{if(!armed(b,'Tap again to delete'))break;deleteManaged(b.dataset.kind,id);break}
  case'esave':saveEntry(id);break;
  case'edelete':{if(!armed(b,'Tap again to delete'))break;S.entries=S.entries.filter(e=>e.id!==id);persist();if(UI.toast&&UI.toast.ids.includes(id))UI.toast=null;closeSheet();render();break}
  }
});
const splitList=s=>s.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
function saveManaged(kind,id){const name=($('#m_name').value||'').trim();const syn=splitList($('#m_syn').value||'');const err=$('#m_err');
  if(!name){err.textContent='Enter a name.';err.hidden=false;return}
  if(kind==='cat'){if(id==='new'){const k=$('#m_kind').value;S.categories.push({id:'c_'+uid(),name,kind:k,abbr:name.replace(/[^A-Za-z]/g,'').slice(0,2).replace(/^./,c=>c.toUpperCase())||'??',hue:['#0e7490','#9d174d','#4d7c0f','#7e22ce','#b45309'][S.categories.length%5],synonyms:syn})}else{const c=catById(id);c.name=name;c.synonyms=syn}}
  else if(kind==='place'){const cat=$('#m_cat').value;if(id==='new')S.places.push({id:'p_'+uid(),name,categoryId:cat,aliases:syn});else{const p=placeById(id);p.name=name;p.categoryId=cat;p.aliases=syn}}
  else{if(id==='new')S.people.push({id:'u_'+uid(),name,aliases:syn});else{const p=personById(id);p.name=name;p.aliases=syn}}
  persist();UI.sheet='manage';renderOverlay();renderMain();renderHdr()}
function deleteManaged(kind,id){
  if(kind==='cat'){const c=catById(id);const to=c.kind==='income'?'otherin':'other';S.entries.forEach(e=>{if(e.categoryId===id)e.categoryId=to});S.places.forEach(p=>{if(p.categoryId===id)p.categoryId='other'});S.categories=S.categories.filter(x=>x.id!==id)}
  else if(kind==='place'){const p=placeById(id);S.entries.forEach(e=>{if(e.placeId===id){e.placeId=null;e.note=e.note?p.name+' · '+e.note:p.name}});S.places=S.places.filter(x=>x.id!==id)}
  else{if(S.entries.some(e=>e.personId===id)){const err=$('#m_err');err.textContent='This person has loan history, so they can\'t be deleted. Delete those entries first.';err.hidden=false;return}S.people=S.people.filter(x=>x.id!==id)}
  persist();UI.sheet='manage';renderOverlay();renderMain()}
function saveEntry(id){const e=S.entries.find(x=>x.id===id);if(!e)return;const err=$('#e_err');
  const amt=parseFloat($('#e_amt').value);if(!(amt>0)){err.textContent='Enter an amount above zero.';err.hidden=false;return}
  const type=$('#e_type').value;const cur=($('#e_cur').value||S.design.currency).trim().toUpperCase();
  e.type=type;e.amount=r3(amt);e.currency=cur;e.note=$('#e_note').value.trim();
  const dt=$('#e_dt').value;if(dt){const t=new Date(dt).getTime();if(!isNaN(t))e.ts=t}
  e.account=$('#e_acct').value||'bank';delete e.toAccount;
  if(type==='transfer'){e.toAccount=otherAcct(e.account);e.personId=null;e.categoryId=null;e.placeId=null}
  else if(isLoan(type)){e.personId=$('#e_person').value||null;e.categoryId=null;e.placeId=null}
  else{let c=$('#e_cat').value;const cat=catById(c);if(cat&&cat.kind!==catKind(type))c=type==='income'?'otherin':'other';e.categoryId=c;e.placeId=$('#e_place').value||null;e.personId=null}
  persist();closeSheet();render()}
document.getElementById('app').addEventListener('change',ev=>{
  const t=ev.target;
  if(t.id==='s_open_bank'||t.id==='s_open_cash'){const v=parseFloat(String(t.value).replace(/,/g,''));if(!isNaN(v)){S.openings[t.id==='s_open_bank'?'bank':'cash']=r3(v);persist();renderMain()}return}
  if(t.id==='r_file'&&t.files&&t.files[0]){const fr=new FileReader();fr.onload=()=>{$('#r_text').value=String(fr.result||'');$('#r_err').hidden=true};fr.readAsText(t.files[0]);return}
  if(t.id==='f_place'||t.id==='f_person'){UI.filter[t.id==='f_place'?'placeId':'personId']=t.value;refreshFiltered();return}
  if(t.id==='e_type'){const loan=isLoan(t.value),tr=t.value==='transfer';$('#f_cat').hidden=loan||tr;$('#f_place').hidden=loan||tr||!F().places;$('#f_person').hidden=!loan;$('#l_acct').textContent=tr?'From':'Paid with';return}
  if(t.dataset.dset){const k=t.dataset.dset;const v=t.type==='checkbox'?t.checked:t.value;setD(k,v);applyDesign();renderHdr();renderMain();renderPending();if(t.type==='color'||t.tagName==='SELECT'||t.type==='checkbox')renderOverlay()}
});
document.getElementById('app').addEventListener('input',ev=>{
  const t=ev.target;
  if(t.id==='sq'){UI.search=t.value;renderMain();renderHdr();renderSqHint();return}
  if(t.id==='s_open_bank'||t.id==='s_open_cash'){const v=parseFloat(String(t.value).replace(/,/g,''));S.openings[t.id==='s_open_bank'?'bank':'cash']=isNaN(v)?0:r3(v);persist();return} // keep while typing, so a redraw can't lose it
  if(!t.dataset.dset||t.type==='checkbox')return;
  setD(t.dataset.dset,t.value);applyDesign();renderHdr();
});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'){if(UI.sheet)closeSheet();else if(UI.pending){UI.pending=null;UI.batch=null;renderPending()}}});

/* ---------- date scrubber ---------- */
const mainEl=$('#main'),scrub=$('#scrub'),thumb=$('#sthumb'),bubble=$('#sbubble'),marks=$('#smarks');
// Snapping scrubber: every day gets an equal slot on the track (tick marks), dragging snaps day by day,
// the bubble shows date + count + total, and the chosen day lights up in the list.
const PADY=8;let hideT=null,dragging=false,grabOff=0,selIdx=-1,selT=null;
const heads=()=>[...mainEl.querySelectorAll('[data-ts]')];
// headers are sticky, so measure them by the element after them (which isn't)
const headTop=h=>{const n=h.nextElementSibling;return n&&!n.dataset.ts?n.offsetTop-h.offsetHeight:h.offsetTop};
function geom(pos){const max=mainEl.scrollHeight-mainEl.clientHeight;
  scrub.style.top=mainEl.offsetTop+'px';scrub.style.height=mainEl.clientHeight+'px';
  if(max<40){scrub.hidden=true;scrub.classList.remove('show');return null}
  scrub.hidden=false;const trackH=mainEl.clientHeight-PADY*2,th=38;
  if(pos==null)pos=scrollPos(max);
  const y=Math.max(0,Math.min(1,pos))*(trackH-th);thumb.style.height=th+'px';thumb.style.top=(PADY+y)+'px';
  return{max,trackH,th,y}}
// where the list is, as a position between the first day (0) and the last day (1)
function scrollPos(max){const H=heads(),n=H.length;if(n<2||mainEl.scrollTop>=max-1)return n<2?mainEl.scrollTop/max:1;
  const st=mainEl.scrollTop+4;let i=0;for(let k=0;k<n;k++){if(headTop(H[k])<=st)i=k;else break}
  const a=headTop(H[i]),b=i+1<n?headTop(H[i+1]):a+1;return(i+Math.max(0,Math.min(1,(st-a)/Math.max(1,b-a))))/(n-1)}
function buildTicks(){marks.innerHTML=''} // no tick marks: a plain thumb keeps the edge clean
function highlight(h){mainEl.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));if(!h)return;
  h.classList.add('sel');let n=h.nextElementSibling;while(n&&!n.dataset.ts){n.classList.add('sel');n=n.nextElementSibling}}
function flashScrub(){if(dragging)return;const g=geom();if(!g)return;scrub.classList.add('show');clearTimeout(hideT);hideT=setTimeout(()=>scrub.classList.remove('show'),1300)}
mainEl.addEventListener('scroll',flashScrub,{passive:true});
function selectDay(i,g){const H=heads(),n=H.length,h=H[i];if(!h)return;
  const pos=n<2?0:i/(n-1);const gg=geom(pos)||g;
  mainEl.scrollTop=Math.min(headTop(h),gg.max);geom(pos);
  bubble.innerHTML=`<b>${esc(h.dataset.label)}</b><span>${esc(h.dataset.info||'')}</span>`;bubble.style.top=(PADY+gg.y+gg.th/2)+'px';bubble.hidden=false;
  highlight(h);if(i!==selIdx){selIdx=i;buzz('tick')}}
// once the cash number scrolls away, the header's small line shows it instead
function updScrolled(){const q=mainEl.querySelector('.quick')||mainEl.querySelector('#hero');
  $('#app').classList.toggle('scrolled',UI.view==='home'&&!!q&&mainEl.scrollTop>q.offsetTop+q.offsetHeight-4);
  // floating "back to top" pill once you've scrolled about a screen down
  const tb=$('#totop'),show=mainEl.scrollTop>Math.max(300,mainEl.clientHeight*0.8);
  if(show){const comp=$('#composer');const bottom=S.design.inputPos==='top'?16:comp.offsetHeight+12;tb.style.bottom=bottom+'px';$('#totopl').textContent=UI.view==='home'&&!isFiltering()?'Today':'Top'}
  tb.hidden=!show}
mainEl.addEventListener('scroll',updScrolled,{passive:true});
function dragTo(clientY){const g=geom();if(!g)return;const n=heads().length;if(!n)return;const r=scrub.getBoundingClientRect();
  const y=Math.max(0,Math.min(g.trackH-g.th,clientY-r.top-PADY-grabOff));const i=n<2?0:Math.round(y/(g.trackH-g.th)*(n-1));selectDay(i,g)}
scrub.addEventListener('pointerdown',ev=>{const g=geom();if(!g)return;dragging=true;selIdx=-1;scrub.classList.add('drag','show');clearTimeout(hideT);buildTicks(g);
  const r=scrub.getBoundingClientRect(),top=r.top+PADY+g.y;grabOff=(ev.clientY>=top&&ev.clientY<=top+g.th)?ev.clientY-top:g.th/2;
  try{scrub.setPointerCapture(ev.pointerId)}catch(e){}dragTo(ev.clientY);ev.preventDefault()});
scrub.addEventListener('pointermove',ev=>{if(dragging)dragTo(ev.clientY)});
const endDrag=()=>{if(!dragging)return;dragging=false;scrub.classList.remove('drag');bubble.hidden=true;
  clearTimeout(selT);selT=setTimeout(()=>highlight(null),1400);hideT=setTimeout(()=>scrub.classList.remove('show'),1300)};
scrub.addEventListener('pointerup',endDrag);scrub.addEventListener('pointercancel',endDrag);
window.addEventListener('resize',()=>geom());
const _renderMain=renderMain;renderMain=function(){_renderMain();marks.innerHTML='';requestAnimationFrame(()=>{const g=geom();buildTicks(g);updScrolled()})};
/* ---------- swipe: left = delete (with undo), right = duplicate to today ---------- */
let sw=null,swOpen=null;
const swTh=w=>Math.max(70,Math.min(110,w.clientWidth*0.3)); // duplicate needs about a third of the row, never less than 70px
// swiping left only opens the Delete button; deleting needs a tap on it (a double check)
function closeOpen(){if(!swOpen)return;const w=swOpen;swOpen=null;w.querySelector('.row').style.transform='';setTimeout(()=>w.classList.remove('open','l','go'),300)}
mainEl.addEventListener('pointerdown',ev=>{
  if(swOpen&&!ev.target.closest('.sw-del')){const same=ev.target.closest('.swp')===swOpen;closeOpen();if(same){UI.swipedAt=Date.now();return}}
  const w=ev.target.closest('.swp');if(!w||ev.button>0||ev.target.closest('.sw-del'))return;sw={w,id:w.dataset.id,x:ev.clientX,y:ev.clientY,dx:0,on:false,pid:ev.pointerId}});
mainEl.addEventListener('scroll',()=>{if(!sw)closeOpen()},{passive:true});
mainEl.addEventListener('pointermove',ev=>{if(!sw||ev.pointerId!==sw.pid)return;const dx=ev.clientX-sw.x,dy=ev.clientY-sw.y;
  if(!sw.on){if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.5){sw.on=true;sw.w.classList.add('drag');try{sw.w.setPointerCapture(ev.pointerId)}catch(e){}}
    else{if(Math.abs(dy)>10)sw=null;return}}
  sw.dx=dx;const DELW=delW();const shown=dx<0?Math.max(dx,-DELW-40):dx;sw.w.querySelector('.row').style.transform=`translateX(${shown}px)`;
  sw.w.classList.toggle('l',dx<0);sw.w.classList.toggle('r',dx>0);
  const go=dx<0?dx<-DELW/2:dx>swTh(sw.w);if(go&&!sw.w.classList.contains('go'))buzz('edge');
  sw.w.classList.toggle('go',go)});
function swEnd(){if(!sw)return;const s=sw;sw=null;if(!s.on)return;UI.swipedAt=Date.now();
  const row=s.w.querySelector('.row'),th=swTh(s.w);s.w.classList.remove('drag');
  const DELW=delW();if(s.dx<-DELW/2){row.style.transform=`translateX(-${DELW}px)`;s.w.classList.add('open');s.w.classList.remove('go');swOpen=s.w}
  else if(s.dx>th){row.style.transform='';s.w.classList.remove('l','r','go');duplicateEntry(s.id)}
  else{row.style.transform='';setTimeout(()=>s.w.classList.remove('l','r','go'),300)}}
// Android back button (called from MainActivity): close the top layer; false = nothing left, let the app exit
window.filsBack=function(){
  if(swOpen){closeOpen();return true}
  if(UI.sheet==='setup'&&!S.setupDone)return false; // back on the first-launch page exits; it shows again next time
  if(UI.sheet){if(UI.sheet==='mform')openSheet('manage');else closeSheet();return true}
  if(UI.pending){UI.pending=null;UI.batch=null;renderPending();return true}
  if(UI.searchOpen||isFiltering()){UI.filter=noFilter();UI.search='';UI.searchOpen=false;refreshFiltered();return true}
  if(UI.view!=='home'){UI.view=UI.view==='person'?'people':'home';UI.month=null;UI.openCat=null;render();$('#main').scrollTop=0;return true}
  return false};
// Delete tile: act on finger-lift, so one tap is enough even when a touchscreen swallows the first click after a drag
function swDelete(w,id){if(!w||w.dataset.gone)return;w.dataset.gone='1';swOpen=null;w.querySelector('.row').style.transform='translateX(-110%)';setTimeout(()=>deleteEntry(id),170)}
mainEl.addEventListener('pointerup',ev=>{const d=ev.target.closest&&ev.target.closest('.sw-del');if(!d)return;const w=d.closest('.swp');if(w&&w.classList.contains('open'))swDelete(w,d.dataset.id)});
mainEl.addEventListener('pointerup',swEnd);mainEl.addEventListener('pointercancel',swEnd);
function deleteEntry(id){const i=S.entries.findIndex(e=>e.id===id);if(i<0)return;const[e]=S.entries.splice(i,1);buzz('heavy');persist();
  UI.pending=null;UI.toast={ids:[],learned:[],deleted:e};render();clearTimeout(UI.tt);UI.tt=setTimeout(()=>{UI.toast=null;renderPending()},7000)}
function duplicateEntry(id){const e=S.entries.find(x=>x.id===id);if(!e)return;const n={...e,id:uid(),ts:Date.now()};S.entries.push(n);buzz('ok');persist();
  UI.pending=null;UI.toast={ids:[n.id],learned:['Duplicated to today '+hm(n.ts)+'. Tap Edit to change the amount or date.']};render();clearTimeout(UI.tt);UI.tt=setTimeout(()=>{UI.toast=null;renderPending()},7000)}
// jump to a day in the list (from the calendar), lighting it up briefly
function jumpToDay(ts){let H=heads(),k=dayKey(ts);let h=H.find(x=>dayKey(+x.dataset.ts)===k);
  if(!h&&isFiltering()&&UI.view==='home'){UI.filter=noFilter();UI.search='';UI.searchOpen=false;renderHdr();renderBar();renderMain();H=heads();h=H.find(x=>dayKey(+x.dataset.ts)===k)}
  if(!h)h=H.find(x=>+x.dataset.ts<=ts)||H[H.length-1];if(!h)return;
  const max=mainEl.scrollHeight-mainEl.clientHeight;mainEl.scrollTo({top:Math.min(headTop(h),max),behavior:'smooth'});
  highlight(h);clearTimeout(selT);selT=setTimeout(()=>highlight(null),1800)}

// keyboard: focusing the box isn't enough inside the Android app, the native side must raise the keyboard
const isNative=()=>{const C=window.Capacitor;return!!(C&&C.isNativePlatform&&C.isNativePlatform()&&C.nativePromise)};
function openKb(force){if(force!==true&&(!F().autofocus||UI.sheet||UI.searchOpen||UI.pending||!S.setupDone))return;
  const q=$('#q');if(!q)return;q.focus();if(isNative())window.Capacitor.nativePromise('QuickAdd','keyboard',{}).catch(()=>{})}
// home-screen widget tap: back to home with the keyboard up
window.filsQuickAdd=function(){if(!S.setupDone)return;if(swOpen)closeOpen();if(UI.sheet)closeSheet();
  if(UI.searchOpen||isFiltering()){UI.filter=noFilter();UI.search='';UI.searchOpen=false}
  if(UI.view!=='home'){UI.view='home';UI.month=null;UI.openCat=null}render();setTimeout(()=>openKb(true),60)};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(openKb,150)});
// home-screen widget: today's spending (expenses minus refunds, main currency), sent to the native widget
let todayT=0,todaySent='';
function todaySpend(){const k=dayKey(Date.now()),c=S.design.currency;let s=0;
  for(const e of S.entries){if(e.currency!==c||dayKey(e.ts)!==k)continue;if(e.type==='expense')s+=e.amount;else if(e.type==='refund')s-=e.amount}return r3(Math.max(0,s))}
function pushToday(){clearTimeout(todayT);todayT=setTimeout(()=>{try{const C=window.Capacitor;if(!(C&&C.isNativePlatform&&C.isNativePlatform()&&C.nativePromise))return;
  const d=new Date(),c=S.design.currency,o={text:fmt(todaySpend())+' '+c,zero:fmt(0)+' '+c,day:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
  const sig=JSON.stringify(o);if(sig===todaySent)return;todaySent=sig;C.nativePromise('QuickAdd','setToday',o).catch(()=>{todaySent=''})}catch(e){}},300)}
// quick-add pop-up (opened from the widget): only the input card over the home screen
let POPUP=false;
function closePopup(){if(isNative())window.Capacitor.nativePromise('QuickAdd','close',{}).catch(()=>{})}
function popupAutoClose(){clearTimeout(UI.pc);UI.pc=setTimeout(closePopup,2200)}
$('#app').addEventListener('pointerdown',ev=>{if(POPUP&&ev.target===$('#app'))closePopup()});
$('#composer').addEventListener('pointerdown',()=>clearTimeout(UI.pc));
$('#q').addEventListener('input',()=>clearTimeout(UI.pc));
// the pop-up saves in its own window: when this one comes back, pick up those entries
document.addEventListener('visibilitychange',()=>{if(document.visibilityState!=='visible')return;let raw=null;try{raw=localStorage.getItem(KEY)}catch(e){}
  if(raw&&raw!==lastRaw){const s=load();if(s){S=s;render()}}pushToday()});
// phone browsers (iPhone Safari above all) scroll the whole page up to show the typing box and don't always scroll back
// when the keyboard closes, leaving a black gap; only .main scrolls in Fils, so put the page back at the top
function unshift(){const vv=window.visualViewport,open=vv&&vv.height<innerHeight*.85;
  if(!open&&(window.scrollY||document.documentElement.scrollTop||document.body.scrollTop))window.scrollTo(0,0)}
(window.visualViewport||window).addEventListener('resize',()=>setTimeout(unshift,60));
document.addEventListener('focusout',()=>setTimeout(()=>{if(!document.activeElement||!/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName))unshift()},120));
// open the pop-up card on top of the tapped widget; if the keyboard would cover it, lift it just enough
function anchorTo(w){const dpr=window.devicePixelRatio||1,c=$('#composer'),f=$('#form'),A=$('#app');
  const L=Math.max(8,w.left/dpr),R=Math.min(innerWidth-8,w.right/dpr),mid=(w.top+w.bottom)/2/dpr;if(!(R-L>120))return;
  A.classList.add('anchored');c.style.left=L+'px';c.style.width=(R-L)+'px';
  const place=()=>{const h=c.offsetHeight,vh=window.visualViewport?visualViewport.height:innerHeight;
    const t=mid-(f.offsetTop+f.offsetHeight/2);c.style.top=Math.round(Math.max(8,Math.min(t,vh-h-8)))+'px'};
  place();requestAnimationFrame(()=>A.classList.add('placed'));
  if(window.ResizeObserver)new ResizeObserver(place).observe(c);
  (window.visualViewport||window).addEventListener('resize',place)}
function boot(popup){
  if(popup){POPUP=true;document.documentElement.classList.add('popup');$('#app').classList.add('popup');render();{const d=window.devicePixelRatio||1,y={top:.22,middle:.5}[S.design.popupPos];
    // the launcher may not say where the widget is (Xiaomi doesn't): then use the position chosen in Customise
    const w=popup.widget||(y?{left:12*d,right:(innerWidth-12)*d,top:(innerHeight*y-28)*d,bottom:(innerHeight*y+28)*d}:null);if(w)anchorTo(w)}setTimeout(()=>openKb(true),60);return}
  render();
  if(!S.setupDone)openSheet('setup');
  else if(isNative())window.Capacitor.nativePromise('QuickAdd','pending',{}).then(r=>r&&r.v?window.filsQuickAdd():openKb()).catch(()=>openKb());
  else setTimeout(openKb,50);
  pushToday()}
if(isNative()){document.documentElement.style.visibility='hidden';
  window.Capacitor.nativePromise('QuickAdd','mode',{}).then(r=>r&&r.popup?r:false).catch(()=>false).then(p=>{document.documentElement.style.visibility='';boot(p)})}
else boot(false);
})();
