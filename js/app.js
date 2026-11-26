const $=id=>document.getElementById(id);
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const HISTORY_KEY="ai_interview_history";

const BANK={
 behavioral:[
  "Tell me about yourself and how your experience relates to this role.",
  "Describe a time you handled a difficult situation at work or in a project.",
  "Tell me about a time you received feedback and how you acted on it.",
  "Describe a time you had to meet a challenging deadline.",
  "Tell me about a time you worked with someone whose approach differed from yours."
 ],
 technical:[
  "Walk me through a project relevant to this role and the decisions you made.",
  "What technical skill is most important for this role, and how have you used it?",
  "How would you troubleshoot a problem you encountered in this role?",
  "Explain a relevant concept or tool to someone new to the field.",
  "How do you keep your skills and knowledge current in this field?"
 ],
 hr:[
  "Why are you interested in this role?",
  "What strengths would you bring to this position?",
  "What motivates you to work in this field?",
  "What kind of team and work environment helps you do your best work?",
  "What are your career goals, and how does this role fit them?"
 ]
};

// Role-aware question pools used when AI question generation is unavailable.
const ROLE_QUESTIONS={
 software:{technical:["How would you design a REST API for a feature in this role?","How do you debug a software issue that you cannot reproduce consistently?","Explain the difference between an array and a linked list, and when you might use each.","How do you test your code and decide which tests are important?","Describe how you would review a pull request for correctness and maintainability."],behavioral:["Describe a software project where you had to make a technical trade-off. Why did you choose that approach?","Tell me about a bug you introduced or found and how you handled it.","How have you collaborated with teammates during code reviews or development?","Describe a time requirements changed while you were developing a feature.","Tell me about a technical challenge you worked through independently."],hr:["Why do you want to work as a software developer?","Which area of software development would you like to grow in, and why?","What type of development team helps you learn and perform best?","What project or coding accomplishment are you most proud of?","How do you keep up with new languages, frameworks, and engineering practices?"]},
 data:{technical:["How would you use SQL to identify duplicate records in a dataset?","How do you handle missing, inconsistent, or outlier values before analysis?","Explain the difference between correlation and causation with an example.","How would you choose a chart to communicate a trend to non-technical stakeholders?","Describe how you would validate that your analysis is accurate."],behavioral:["Tell me about a time your analysis helped someone make a decision.","Describe a data problem where the information was incomplete or messy. How did you handle it?","How have you explained an analytical finding to a non-technical person?","Tell me about a time you had to prioritize multiple analysis requests.","Describe a time you discovered an insight that was different from your initial expectation."],hr:["Why are you interested in working as a data analyst?","What business questions do you enjoy answering with data?","Which analytical tools would you like to develop further?","How do you make sure your analysis is useful to decision-makers?","Tell me about a data project you are especially proud of."]},
 hrrole:{technical:["How would you structure an interview to evaluate a candidate fairly?","How would you handle a confidential employee concern?","Which recruitment metrics would you monitor and what might they indicate?","How would you respond if a hiring manager and candidate had conflicting expectations?","How would you help improve onboarding for a new employee?"],behavioral:["Tell me about a time you resolved a disagreement between people.","Describe how you handled sensitive information responsibly.","Tell me about a time you had to communicate an unpopular decision with empathy.","Describe a situation where you had to organize several people-related tasks at once.","How have you helped someone feel included or supported in a team?"],hr:["Why are you interested in a career in human resources?","Which area of HR interests you most: recruiting, employee relations, learning, or HR operations? Why?","How would you balance employee needs with organizational policies?","What does a positive employee experience mean to you?","How do you stay informed about workplace practices and HR trends?"]},
 cyber:{technical:["What steps would you take to triage a suspected phishing email?","Explain the difference between authentication and authorization.","How would you prioritize vulnerabilities when many are reported?","What is the purpose of network segmentation?","How would you investigate unusual activity in security logs?"],behavioral:["Tell me about a security issue you investigated or learned from.","Describe a time you had to explain a technical risk clearly to others.","How would you respond if a teammate ignored a security procedure?","Tell me about a time you worked carefully under pressure.","Describe how you would keep learning when security threats evolve quickly."],hr:["Why are you interested in cybersecurity?","Which cybersecurity area do you want to specialize in and why?","How do you stay aware of new security threats and practices?","What qualities are important for someone handling security incidents?","What would you like to learn during your first year in this role?"]},
 marketing:{technical:["How would you define a target audience for a new product?","Which metrics would you use to evaluate a digital campaign?","How would you improve a campaign with high clicks but low conversions?","How would you plan an SEO content strategy for a new website?","How would you run an experiment to compare two campaign messages?"],behavioral:["Tell me about a campaign or creative idea you contributed to.","Describe a time you used feedback to improve content or a campaign.","Tell me about a project where you had to understand an audience's needs.","Describe a time you balanced creativity with a tight deadline.","How have you used data or results to change your approach?"],hr:["Why do you want to work in marketing?","Which marketing channel or specialty interests you most and why?","How do you balance creativity with measurable business goals?","What brand or campaign inspires you, and what makes it effective?","What marketing skill would you like to strengthen in this role?"]},
 finance:{technical:["How would you explain the relationship between the income statement, balance sheet, and cash-flow statement?","How would you investigate an unexpected variance against budget?","What checks would you perform before submitting a financial report?","How would you evaluate whether a cost is recurring or one-time?","How do you maintain accuracy when working with financial data?"],behavioral:["Tell me about a time accuracy was especially important in your work.","Describe a time you found an error and how you corrected it.","Tell me about a time you had to explain a financial issue to a non-finance colleague.","How have you managed competing deadlines for reports or tasks?","Describe a time you handled confidential information responsibly."],hr:["Why are you interested in a finance role?","Which finance area would you like to build expertise in?","What does integrity mean when working with financial information?","How do you stay organized when handling detail-heavy work?","What skills do you want to develop in this position?"]},
 design:{technical:["How do you turn user research into design decisions?","How would you evaluate the usability of a design?","Describe your approach to creating and testing a prototype.","How do you design for accessibility?","How would you handle conflicting feedback from stakeholders?"],behavioral:["Tell me about a design project where user feedback changed your solution.","Describe a time you advocated for a user need.","Tell me about a design decision you had to defend with evidence.","How have you collaborated with developers to make a design feasible?","Describe a project where you had to work within constraints."],hr:["Why are you interested in this design role?","What design process do you typically follow?","Which design skill are you hoping to improve?","What product or experience do you think is especially well designed, and why?","How do you balance user needs and business constraints?"]},
 sales:{technical:["How would you qualify a new prospect?","How would you respond to a customer who says your product is too expensive?","How do you manage and prioritize a sales pipeline?","Which metrics would you use to evaluate your sales performance?","How would you prepare for a meeting with a potential customer?"],behavioral:["Tell me about a time you persuaded someone or built trust.","Describe how you handled rejection or a difficult customer interaction.","Tell me about a time you achieved a challenging goal.","Describe a time you had to adapt your communication to a customer.","How have you maintained a relationship after a problem or complaint?"],hr:["Why are you interested in sales?","What motivates you when targets are challenging?","How do you build trust with customers?","What makes you effective at understanding customer needs?","What sales skill do you want to develop further?"]},
 generic:{technical:["What tools, methods, or technical skills are commonly used in this role, and how have you applied them?","How would you approach a challenging task specific to this position?","Describe how you would check the quality of your work in this role.","How do you keep up with changes in this field?","Walk me through a relevant project or task and your contribution."],behavioral:["Tell me about a time you solved a problem related to this kind of work.","Describe a time you collaborated with others to complete a task relevant to this role.","Tell me about a time you adapted to a change in requirements or priorities.","Describe a time you took initiative in a project or responsibility.","Tell me about a challenge you faced while learning a skill for this field."],hr:["Why are you interested in becoming a ","What skills make you a good fit for this role?","What would you like to learn in this position?","What interests you about this field?","How does this position fit your career plans?"]}
};

function roleCategory(role){
 const r=role.toLowerCase();
 if(/software|developer|programmer|web dev|frontend|front-end|backend|back-end|full.?stack|engineer|qa|test automation/.test(r))return "software";
 if(/data analyst|data science|business analyst|analytics|machine learning|ai engineer|data engineer/.test(r))return "data";
 if(/human resource|\bhr\b|recruit|talent acquisition|people ops/.test(r))return "hrrole";
 if(/cyber|security|soc analyst|penetration|information security/.test(r))return "cyber";
 if(/market|seo|content|social media|brand|digital marketing/.test(r))return "marketing";
 if(/finance|account|auditor|bank|financial/.test(r))return "finance";
 if(/ui.?ux|designer|graphic|product design/.test(r))return "design";
 if(/sales|business development|account executive/.test(r))return "sales";
 return "generic";
}
function roleFallback(role,type,n){
 const category=ROLE_QUESTIONS[roleCategory(role)]||ROLE_QUESTIONS.generic;
 let pool=[...(category[type]||BANK[type]||BANK.behavioral)];
 if(type==="hr"&&roleCategory(role)==="generic")pool[0]=`Why are you interested in becoming a ${role}?`;
 // Add role name context to broad fallback questions for less common job titles.
 if(roleCategory(role)==="generic")pool=pool.map(q=>q.replace("this role",role).replace("this position",role));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 return pool.slice(0,n);
}

const FILL=/\b(um+|uh+|erm|like|you know|basically|actually|literally|sort of|kind of)\b/gi;
const S={stream:null,qs:[],i:0,res:[],run:null,ac:null,an:null,role:"",type:""};
let fd=null;
try{
 if("FaceDetector" in window){
  fd=new FaceDetector({fastMode:true,maxDetectedFaces:1});
 }
}catch(error){fd=null;}

const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const words=t=>(t.trim().match(/\S+/g)||[]).length;
const fmt=s=>Math.floor(s/60)+":"+String(Math.floor(s%60)).padStart(2,"0");
const show=id=>["setup","load","live","report"].forEach(x=>$(x).classList.toggle("hide",x!==id));

/* Login protection */
if(sessionStorage.getItem("preppilot_logged_in")!=="true"){
 window.location.href="login.html";
}

$("th").onclick=()=>{
 const d=document.documentElement;
 const dark=d.dataset.theme==="dark";
 d.dataset.theme=dark?"light":"dark";
};

/* Interview history */
function getHistory(){
 try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]");}
 catch{return [];}
}

function saveHistory(record){
 const history=getHistory();
 history.push(record);
 localStorage.setItem(HISTORY_KEY,JSON.stringify(history));
 renderHistory();
}

function renderHistory(){
 const history=getHistory();
 const list=$("historyList");
 const compare=$("historyCompare");

 if(!history.length){
  compare.textContent="Complete your first interview to start tracking your progress.";
  list.innerHTML='<p class="note">No completed interviews yet.</p>';
  return;
 }

 const first=history[0];
 const latest=history[history.length-1];
 const difference=latest.score-first.score;
 let comparison="This is your first completed practice session.";

 if(history.length>1){
  comparison=difference>0
   ?"Your score improved by "+difference+" points since your first practice! 🎉"
   :difference<0
   ?"Your latest score is "+Math.abs(difference)+" points lower than your first practice. Keep practising!"
   :"Your score is unchanged since your first practice. Keep working on your answers!";
 }

 compare.innerHTML=
  "<b>Progress comparison</b><br>"+
  "First practice: <b>"+first.score+"/100</b> &nbsp;→&nbsp; Latest: <b>"+latest.score+"/100</b><br>"+
  esc(comparison);

 list.innerHTML=history.slice().reverse().map((item,index)=>{
  const date=new Date(item.date);
  return '<div class="history-item"><div class="history-top">'+
   '<div><b>'+esc(item.role)+'</b><div class="note">'+esc(item.type)+" interview · "+date.toLocaleString()+'</div></div>'+
   '<div class="history-score">'+item.score+'/100</div></div>'+
   '<div class="note">'+item.questions+' questions completed</div></div>';
 }).join("");
}

renderHistory();

/* Camera and microphone */
const has=k=>!!S.stream&&S.stream.getTracks().some(t=>t.kind===k&&t.readyState==="live");

async function toggle(k){
 try{
  if(has(k)){
   S.stream.getTracks().filter(t=>t.kind===k).forEach(t=>{
    t.stop();
    S.stream.removeTrack(t);
   });
  }else{
   const constraints=k==="video"?{video:{facingMode:"user"}}:{audio:true};
   const stream=await navigator.mediaDevices.getUserMedia(constraints);
   S.stream=S.stream||new MediaStream();
   stream.getTracks().forEach(t=>S.stream.addTrack(t));
  }
  $("perm").textContent="Your media stays in this browser. You can still type answers.";
 }catch(e){
  const what=k==="video"?"camera":"microphone";
  $("perm").textContent="Could not start the "+what+" ("+(e.name||"error")+"). Check browser permissions and try again. You can still type your answers.";
  $("perm1").textContent=$("perm").textContent;
 }
 sync();
}

/* Ask for microphone once before the interview starts */
async function ensureMicBeforeInterview(){
 if(has("audio"))return true;

 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
  $("perm").textContent="Microphone access is not supported in this browser. You can type your answers.";
  return false;
 }

 try{
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  S.stream=S.stream||new MediaStream();
  stream.getAudioTracks().forEach(track=>S.stream.addTrack(track));
  $("perm").textContent="✅ Microphone is ready. It will remain available during this interview.";
  sync();
  return true;
 }catch(e){
  $("perm").textContent="Microphone permission was not granted. You can still complete the interview by typing your answers.";
  $("perm1").textContent=$("perm").textContent;
  sync();
  return false;
 }
}

function sync(){
 const c=has("video"),m=has("audio");

 [["tc","tc1"],["tm","tm1"]].forEach(([a,b],i)=>{
  const on=i?m:c;
  const label=(i?"🎤 Mic: ":"📷 Camera: ")+(on?"on":"off");
  [a,b].forEach(id=>{
   $(id).classList.toggle("on",on);
   $(id).textContent=label;
  });
 });

 ["v0","v1"].forEach(id=>{
  const v=$(id);
  v.classList.toggle("hide",!c);
  v.srcObject=c?new MediaStream(S.stream.getVideoTracks()):null;
 });

 $("ph").classList.toggle("hide",c);
 $("ph1").classList.toggle("hide",c);

 S.an=null;
 if(m){
  try{
   S.ac=S.ac||new AudioContext();
   S.ac.resume();
   const src=S.ac.createMediaStreamSource(new MediaStream(S.stream.getAudioTracks()));
   S.an=S.ac.createAnalyser();
   S.an.fftSize=1024;
   src.connect(S.an);
  }catch{}
 }
}

["tc","tc1"].forEach(id=>$(id).onclick=()=>toggle("video"));
["tm","tm1"].forEach(id=>$(id).onclick=()=>toggle("audio"));

function level(){
 if(!S.an)return null;
 const b=new Uint8Array(S.an.fftSize);
 S.an.getByteTimeDomainData(b);
 let sum=0;
 for(const v of b){const x=(v-128)/128;sum+=x*x;}
 return Math.sqrt(sum/b.length);
}

setInterval(()=>{
 const l=level();
 if(l!=null){
  const width=Math.min(100,l*400)+"%";
  $("l0").style.width=width;
  $("l1").style.width=width;
  if(l>.03)$("perm").textContent=$("perm1").textContent="✅ Microphone is working.";
 }
},120);

/* AI helper */
async function ai(prompt){
 try{
  if(typeof claude==="undefined")return null;
  const session=await claude.use("sample");
  if(!session)return null;
  return await session.json(prompt);
 }catch{return null;}
}

/* Start interview */
$("go").onclick=async()=>{
 const role=$("role").value.trim()||"a role of your choice";
 const type=$("type").value;
 const n=+$("n").value;

 S.role=role;
 S.type=type;
 S.res=[];
 S.i=0;

 $("go").disabled=true;
 $("go").textContent="Preparing…";

 /* Microphone permission is requested here, not for every question */
 await ensureMicBeforeInterview();

 show("load");
 $("lt").textContent="Your interviewer is preparing questions…";

 let qs=await ai("Create "+n+" distinct, realistic interview questions for the exact job role: "+role+". Interview type: "+type+". For technical interviews, ask role-specific technical questions and practical scenarios, not generic soft-skill questions. For behavioral interviews, use realistic workplace situations relevant to this role. For HR & motivation, ask role-specific motivation, fit, strengths, and career questions. Avoid generic questions such as 'How do you approach a problem?' unless made specific to the role. Return ONLY a JSON array of strings, no numbering or explanations.");

 if(!Array.isArray(qs)||qs.length<n||qs.some(q=>typeof q!=="string"||!q.trim()))qs=roleFallback(role,type,n);
 S.qs=qs.slice(0,n).map(String);

 $("go").disabled=false;
 $("go").textContent="Start interview →";
 showQ();
};

function showQ(){
 show("live");
 $("qn").textContent="Question "+(S.i+1)+" of "+S.qs.length;
 $("q").textContent=S.qs[S.i];
 $("ans").value="";
 $("wpm").textContent="–";
 $("fil").textContent="0";
 $("eye").textContent="–";
 $("tm2").textContent="0:00";
 $("sa").classList.remove("hide");
 $("fa").classList.add("hide");
 $("rc").classList.add("hide");
 sync();
 speak();
}

function speak(){
 try{
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(S.qs[S.i]));
 }catch{}
}

$("hear").onclick=speak;
$("skip").onclick=()=>{
 if(S.run)stop(true);
 next(null);
};

/* Answer recording and speech recognition */
$("sa").onclick=()=>{
 try{speechSynthesis.cancel();}catch{}

 const r=S.run={
  t0:Date.now(),vol:[],face:0,faceN:0,n:0,
  on:true,final:""
 };

 $("sa").classList.add("hide");
 $("fa").classList.remove("hide");
 $("rc").classList.remove("hide");

 if(SR&&has("audio")){
  try{
   const rec=new SR();
   rec.continuous=true;
   rec.interimResults=true;
   rec.lang="en-US";

   rec.onresult=e=>{
    let finalText="",interimText="";
    for(let i=0;i<e.results.length;i++){
     const t=e.results[i][0].transcript;
     e.results[i].isFinal?finalText+=t+" ":interimText+=t;
    }
    r.final=finalText;
    $("ans").value=finalText+interimText;
   };

   rec.onend=()=>{
    if(r.on)try{rec.start();}catch{}
   };

   rec.start();
   r.rec=rec;
  }catch{}
 }else{
  $("perm1").textContent="Speech recognition is unavailable or the microphone is off. You can type your answer.";
 }

 r.iv=setInterval(tick,250);
};

async function tick(){
 const r=S.run;
 if(!r||!r.on)return;

 r.n++;
 const elapsed=(Date.now()-r.t0)/1000;
 $("tm2").textContent=fmt(elapsed);

 const l=level();
 if(l!=null)r.vol.push(l);

 const v=$("v1");
 if(fd&&has("video")&&r.n%2===0&&v.readyState>=2&&v.videoWidth){
  try{
   const faces=await fd.detect(v);
   r.faceN++;
   if(faces[0]){
    const b=faces[0].boundingBox;
    const cx=(b.x+b.width/2)/v.videoWidth;
    const cy=(b.y+b.height/2)/v.videoHeight;
    if(Math.abs(cx-.5)<.2&&cy>.2&&cy<.68&&b.width/v.videoWidth>.12)r.face++;
   }
   $("eye").textContent=Math.round(r.face/r.faceN*100)+"%";
  }catch{}
 }

 const t=$("ans").value;
 const w=words(t);
 $("fil").textContent=(t.match(FILL)||[]).length;
 if(elapsed>6&&w)$("wpm").textContent=Math.round(w/(elapsed/60));
}

$("fa").onclick=()=>stop(false);

function stop(skip){
 const r=S.run;
 if(!r)return;

 r.on=false;
 clearInterval(r.iv);
 try{r.rec&&r.rec.stop();}catch{}
 S.run=null;
 if(skip)return;

 const text=$("ans").value.trim();
 const dur=(Date.now()-r.t0)/1000;
 const wc=words(text);
 const fill=(text.match(FILL)||[]).length;
 const vol=r.vol.length?avg(r.vol):null;
 const cv=vol?Math.sqrt(avg(r.vol.map(x=>(x-vol)**2)))/vol:null;

 next({
  q:S.qs[S.i],text,dur,wc,fill,
  wpm:dur>5&&wc?Math.round(wc/(dur/60)):0,
  vol,cv,eye:r.faceN>3?r.face/r.faceN:null
 });
}

function next(m){
 if(m)S.res.push(m);
 S.i++;
 S.i<S.qs.length?showQ():finish();
}

/* Scoring */
function score(m){
 const pace=m.wpm?clamp(100-Math.max(0,Math.abs(m.wpm-140)-20)*1.1,35):45;
 const fr=m.wc?m.fill/m.wc*100:0;
 const fs=clamp(100-fr*10,30);
 const delivery=Math.round((pace+fs)/2);
 const voice=m.vol!=null?Math.round((clamp(35+m.vol*900,35,95)+clamp(40+(m.cv||0)*110,40,95))/2):null;
 const eye=m.eye!=null?Math.round(clamp(m.eye*100)):null;
 const kw=(m.text.match(/\b(because|result|resulted|learned|team|i (led|built|created|decided|improved|solved)|%|\d+)\b/gi)||[]).length;
 const content=Math.round(clamp((m.wc<20?m.wc*2:m.wc<60?40+m.wc*.6:m.wc<=220?80:80-(m.wc-220)*.15)+Math.min(15,kw*3),10,97));
 const cf=[delivery,voice,eye].filter(x=>x!=null);
 return{delivery,voice,eye,content,confidence:Math.round(avg(cf)*.85+Math.min(15,m.wc/10))};
}

function localNote(m,s){
 const good=[],improve=[];
 m.wc>=60?good.push("You gave a substantial answer."):improve.push("Expand a little: aim for 60–120 words with a clear example.");
 m.wpm&&m.wpm>=115&&m.wpm<=165?good.push("Your pace ("+m.wpm+" wpm) is easy to follow."):m.wpm>165?improve.push("You spoke fast ("+m.wpm+" wpm). Pause between points."):m.wpm?improve.push("Your pace was slow ("+m.wpm+" wpm). Add energy."):0;
 m.fill>m.wc*.05?improve.push("Cut filler words ("+m.fill+"). Replace them with a silent pause."):good.push("Very few filler words.");
 if(s.eye!=null)(s.eye>=65?good.push("Strong camera contact."):improve.push("Look at the lens more often ("+s.eye+"%)."));
 return{strengths:good.join(" ")||"You attempted the question.",improve:improve.join(" ")||"Keep refining with the STAR structure."};
}

/* Final report */
async function finish(){
 show("load");
 $("lt").textContent="Analyzing your answers…";

 if(!S.res.length){
  $("report").innerHTML='<div class="card"><h2>No answers recorded</h2><p>Try again and answer at least one question.</p><button class="pri" onclick="location.reload()">Start over</button></div>';
  show("report");
  return;
 }

 const sc=S.res.map(score);

 const fb=await ai(
  "You are a warm, expert interview coach. Role: "+S.role+". Interview type: "+S.type+
  ". Evaluate each answer for relevance, structure (e.g. STAR), specificity, and impact. Data: "+
  JSON.stringify(S.res.map(m=>({question:m.q,answer:m.text,wordsPerMinute:m.wpm,fillerWords:m.fill,eyeContactPct:m.eye!=null?Math.round(m.eye*100):null})))+
  '. Return ONLY JSON: {"summary":"2 encouraging sentences","tips":["3 specific improvement tips"],"answers":[{"score":0-100,"strengths":"1 sentence","improve":"1 sentence","stronger":"a short example of a better opening line"}]} with one answers entry per question in order.'
 );

 const ok=fb&&Array.isArray(fb.answers);
 if(ok)fb.answers.forEach((a,i)=>{if(sc[i]&&typeof a.score==="number")sc[i].content=Math.round(clamp(a.score));});

 const A=k=>{
  const values=sc.map(s=>s[k]).filter(x=>x!=null);
  return values.length?Math.round(avg(values)):null;
 };

 const tot={content:A("content"),delivery:A("delivery"),voice:A("voice"),eye:A("eye"),confidence:A("confidence")};
 const overall=Math.round(avg(Object.values(tot).filter(x=>x!=null)));

 /* Save this completed practice session */
 saveHistory({
  id:Date.now(),
  date:new Date().toISOString(),
  role:S.role,
  type:S.type,
  score:overall,
  questions:S.res.length
 });

 const ring=(label,value)=>
  '<div class="ringw"><div class="ring" style="--p:'+(value??0)+'"><b>'+(value??"–")+'</b></div>'+label+
  (value==null?'<br><small>turn on '+(label==="Eye contact"?"camera":"mic")+'</small>':"")+'</div>';

 const tips=ok&&Array.isArray(fb.tips)?fb.tips:[
  tot.delivery<75?"Slow down and replace filler words with deliberate pauses.":"Your delivery is steady. Keep that rhythm.",
  tot.content<75?"Use the STAR structure: Situation, Task, Action, Result, and add one measurable outcome.":"Your answers are well structured. Add numbers to make results memorable.",
  tot.eye!=null&&tot.eye<65?"Place a sticky dot near your camera lens and glance at it while making key points.":"Practice again with different question types to build range."
 ];

 $("report").innerHTML=
 '<div class="card"><span class="pill">Interview complete · '+esc(S.role)+'</span>'+
 '<h1 style="font-size:34px">Your score: '+overall+'<small style="color:var(--mute);font-size:18px">/100</small></h1>'+
 '<p class="sub" style="margin:0">'+esc(ok&&fb.summary?fb.summary:"Nice work finishing the session. Here’s where you shine and where to grow.")+'</p>'+
 '<div class="rings">'+ring("Answer quality",tot.content)+ring("Delivery",tot.delivery)+ring("Voice",tot.voice)+ring("Eye contact",tot.eye)+ring("Confidence",tot.confidence)+'</div>'+
 (fd?"":'<p class="note">Eye-contact tracking needs a supported Chromium browser with face detection enabled. Eye contact is estimated from how centred your face is toward the camera.</p>')+
 '<h2>Top improvements</h2><ul class="tips">'+tips.map(t=>"<li>"+esc(t)+"</li>").join("")+'</ul></div>'+

 S.res.map((m,i)=>{
  const a=ok&&fb.answers[i]||{};
  const note=localNote(m,sc[i]);
  return '<div class="card" style="margin-top:16px"><span class="pill">Question '+(i+1)+'</span>'+
   '<h2 style="margin-top:8px">'+esc(m.q)+'</h2>'+
   '<div class="stats"><span class="pill">'+m.wc+' words</span><span class="pill">'+(m.wpm||"–")+' wpm</span><span class="pill">'+m.fill+' fillers</span><span class="pill">'+fmt(m.dur)+'</span>'+
   (sc[i].eye!=null?'<span class="pill">eye '+sc[i].eye+'%</span>':"")+
   '<span class="pill">quality '+sc[i].content+'</span></div>'+
   (m.text?'<blockquote>'+esc(m.text.slice(0,500))+(m.text.length>500?"…":"")+'</blockquote>':'<p class="note">No answer captured.</p>')+
   '<p class="good">✓ '+esc(a.strengths||note.strengths)+'</p>'+
   '<p class="imp">↗ '+esc(a.improve||note.improve)+'</p>'+
   (a.stronger?'<p><b>Try opening with:</b> <i>'+esc(a.stronger)+'</i></p>':"")+
   '</div>';
 }).join("")+

 '<div class="row" style="margin-top:18px"><button class="pri" id="again">Practice again</button><button class="ghost" id="backHistory">View history</button></div>';

 $("again").onclick=()=>{
  S.res=[];S.qs=[];S.i=0;
  show("setup");
  renderHistory();
 };
 $("backHistory").onclick=()=>{
  show("setup");
  renderHistory();
  $("historyCompare").scrollIntoView({behavior:"smooth"});
 };
 show("report");
}

/* Keep media tracks available between questions and practice sessions.
   The browser may still manage speech-recognition permission separately. */
window.addEventListener("beforeunload",()=>{
 if(S.stream)S.stream.getTracks().forEach(track=>track.stop());
});
