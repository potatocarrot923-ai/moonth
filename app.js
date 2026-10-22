(()=>{
'use strict';
const $=id=>document.getElementById(id);
const photos=['images/photo1.jpg','images/photo2.jpg','images/photo3.jpg'];
const captions=['That cute school-day smile I adore ♡','You with flowers — pure happiness ✨','Quiet night, soft lights, and you 💗'];
let toastTimer,photoIndex=0,questionIndex=0,dodgeCount=0;
let bgMusic=null,musicPlaying=false;
function initMusic(){
  if(bgMusic)return;
  bgMusic=document.createElement('audio');
  bgMusic.id='bgMusic';
  bgMusic.src='music.mp3';
  bgMusic.loop=true;
  bgMusic.preload='auto';
  bgMusic.volume=0.45;
  document.body.appendChild(bgMusic);
}
function playMusic(){
  initMusic();
  if(!musicPlaying){
    bgMusic.play().then(()=>{musicPlaying=true;updateMusicBtn()}).catch(()=>{/* autoplay blocked until interaction */});
  }
}
function toggleMusic(){
  initMusic();
  if(musicPlaying){
    bgMusic.pause();
    musicPlaying=false;
  }else{
    bgMusic.play().then(()=>{musicPlaying=true}).catch(()=>{});
  }
  updateMusicBtn();
}
function updateMusicBtn(){
  const btn=$('musicToggle');
  if(btn)btn.textContent=musicPlaying?'♪ Pause music':'♪ Play music';
}
const questions=[{
q:'Can I borrow a little moment of your time?',d:'I made something small for someone who means a lot to me.',y:'Of course, love 💗',n:'Not today 🙈',h:'A tiny adventure starts with one little yes.'
}
,{
q:'Do you know you make ordinary days feel special?',d:'Sometimes it is a message, a laugh, or just knowing you are there.',y:'I hope you know 🥹',n:'I doubt it 😝',h:'The No button is acting suspicious again…'
}
,{
q:'Can we keep collecting memories together?',d:'More photos, inside jokes, random talks, and stories only we understand.',y:'A million more 📸',n:'Maybe not 😂',h:'Catch it if you can!'
}
, {
q:'Will you let me keep finding little ways to make you smile?',d:'Not just on monthsaries. On random days, sleepy mornings, and normal Tuesdays too.',y:'Yes, please 🌷',n:'I’ll think about it',h:'The button is shy. Maybe I am too.'
}
,{
q:'One last thing, my Jeniesys…',d:'Will you accept this tiny digital hug and a whole lot of love from me?',y:'Biggest hug ever 🫂',n:'I’ll pass 🙃',h:'Final level! The No button has entered its dramatic era.'
}
];
function toast(msg){
const t=$('toast');
if(!t)return;
t.textContent=msg;
t.classList.add('show');
clearTimeout(toastTimer);
toastTimer=setTimeout(()=>t.classList.remove('show'),2400)
}
function burst(n=15){
for(let i=0;
i<n;
i++){
const e=document.createElement('span');
e.textContent=['♡','💗','✨','🌸','💕'][Math.floor(Math.random()*5)];
Object.assign(e.style,{
position:'fixed',left:(20+Math.random()*60)+'vw',top:(25+Math.random()*45)+'vh',zIndex:100,pointerEvents:'none',fontSize:(14+Math.random()*17)+'px',transition:'transform 1s ease,opacity 1s ease'
}
);
document.body.append(e);
requestAnimationFrame(()=>{
e.style.transform=`translate(${
(Math.random()-.5)*260
}
px,${
-70-Math.random()*180
}
px) rotate(${
Math.random()*150
}
deg)`;
e.style.opacity='0'
}
);
setTimeout(()=>e.remove(),1100)
}

}
let floatStarted=false,floatCount=0;
function floatPhotos(){
if(floatStarted)return;
floatStarted=true;
function spawn(){
floatCount++;
const s=48+Math.random()*30,isVideo=floatCount%5===0;
let el;
if(isVideo){
el=document.createElement('a');
el.href='video.html';
el.className='float-photo float-video';
el.setAttribute('aria-label','Open our floating video memory');
el.title='Tap to open our video ♡';
const v=document.createElement('video');
v.src='our-video.mp4';
v.muted=true;
v.autoplay=true;
v.loop=true;
v.playsInline=true;
v.preload='metadata';
v.setAttribute('aria-hidden','true');
v.addEventListener('error',()=>{
v.remove();
const fallback=document.createElement('span');
fallback.className='video-heart-fallback';
fallback.textContent='▶';
el.append(fallback)
}
);
el.append(v);
const play=document.createElement('span');
play.className='float-play';
play.textContent='▶';
play.setAttribute('aria-hidden','true');
el.append(play)
}
else{
el=document.createElement('div');
el.className='float-photo';
const im=document.createElement('img');
im.src='images/photo1.jpg'; // school uniform photo for floating hearts
im.alt='A floating photo heart';
im.onerror=()=>el.remove();
el.append(im)
}
el.style.width=s+'px';
el.style.height=s+'px';
el.style.left=Math.max(1,Math.random()*92)+'vw';
el.style.animationDuration=(10+Math.random()*7)+'s';
document.body.append(el);
setTimeout(()=>el.remove(),18000)
}
for(let i=0;
i<5;
i++)setTimeout(spawn,i*420);
setInterval(spawn,2200)
}
function unlocked(){
return localStorage.getItem('jeniesysQuestComplete')==='yes'
}
function updateLocks(){
document.querySelectorAll('[data-locked]').forEach(el=>{
const isLocked=!unlocked();
el.classList.toggle('hidden',isLocked);

}
);
document.querySelectorAll('[data-unlocked-panel]').forEach(el=>el.classList.toggle('hidden',unlocked()));
const badge=$('videoBadge');
if(badge)badge.textContent=unlocked()?'♡ A little memory, just for you':'Finish the love quest to unlock this memory';
const giftBadge=$('giftBadge');
if(giftBadge)giftBadge.textContent=unlocked()?'Your gift is ready ♡':'Finish the love quest to open your gift'
}
function showPhoto(i){
photoIndex=(i+photos.length)%photos.length;
const im=$('galleryPhoto');
if(im){
im.src=photos[photoIndex];
im.alt=`Memory ${
photoIndex+1
}
`;
im.onerror=()=>{
im.alt='Add images/photo1.jpg, photo2.jpg, and photo3.jpg to personalize your page'
}
;

}
const label=$('galleryLabel');
if(label)label.textContent=captions[photoIndex];
const count=$('galleryCount');
if(count)count.textContent=`0${
photoIndex+1
}
 / 03`;
document.querySelectorAll('.dot').forEach((d,n)=>d.classList.toggle('active',n===photoIndex))
}
function renderQuestion(){
const q=questions[questionIndex];
if(!$('question'))return;
$('question').textContent=q.q;
$('questionDetail').textContent=q.d;
$('yesButton').textContent=q.y;
$('noButton').textContent=q.n;
$('questHint').textContent=q.h;
$('questStep').textContent=`QUESTION 0${
questionIndex+1
}
 / 05`;
$('questPercent').textContent=`${
(questionIndex+1)*20
}
%`;
 $('progressFill').style.width=((questionIndex+1)*20)+'%';
const no=$('noButton');
no.style.position='relative';
no.style.left='0';
no.style.top='0';
no.style.transform='none'
}
function dodge(){
const no=$('noButton'),zone=$('answerArea');
if(!no||!zone)return;
dodgeCount++;
const z=zone.getBoundingClientRect(),b=no.getBoundingClientRect();
no.style.position='absolute';
no.style.left=Math.max(0,Math.random()*(z.width-b.width-6))+'px';
no.style.top=Math.max(0,Math.random()*(z.height-b.height-6))+'px';
$('questHint').textContent=['Hehe—almost caught it! 😜','The No button ran away to think about its choices. 💨','That was close! Your reflexes are cute. 😂','This button has absolutely zero chill. 💗'][dodgeCount%4]
}
function yes(){
questionIndex++;
burst(questionIndex===5?35:12);
if(questionIndex<questions.length){
renderQuestion();
$('questCard').animate([{
opacity:.55,transform:'translateY(8px)'
}
,{
opacity:1,transform:'none'
}
],{
duration:300
}
)
}
else{
localStorage.setItem('jeniesysQuestComplete','yes');
$('questCard').classList.add('hidden');
$('questSuccess').classList.remove('hidden');
updateLocks();
toast('You did it, my love! New surprises unlocked ♡')
}

}
const open=$('openWorld');
if(open)open.addEventListener('click',()=>{
localStorage.setItem('jeniesysOpened','yes');
const intro=$('intro');
if(intro)intro.classList.add('hidden');
floatPhotos();
playMusic();
burst(24);
toast('Welcome to our little universe, Jeniesys ♡')
}
);
if($('intro')&&localStorage.getItem('jeniesysOpened')==='yes')$('intro').classList.add('hidden');
if(localStorage.getItem('jeniesysOpened')==='yes'){
  floatPhotos();
  // try soft-start music after a short delay (may still need user gesture)
  setTimeout(playMusic,400);
}
// music toggle (present on every page)
if($('musicToggle'))$('musicToggle').addEventListener('click',toggleMusic);
// also start music on first meaningful click anywhere (helps with autoplay policies)
document.body.addEventListener('click',function once(){
  playMusic();
  document.body.removeEventListener('click',once);
},{once:true,passive:true});
if($('startQuest'))$('startQuest').addEventListener('click',()=>location.href='quest.html');
if($('prevPhoto'))$('prevPhoto').addEventListener('click',()=>showPhoto(photoIndex-1));
if($('nextPhoto'))$('nextPhoto').addEventListener('click',()=>showPhoto(photoIndex+1));
document.querySelectorAll('.dot').forEach((d,i)=>d.addEventListener('click',()=>showPhoto(i)));
let sx=0;
if($('galleryPhoto')){
$('galleryPhoto').addEventListener('touchstart',e=>sx=e.changedTouches[0].clientX,{
passive:true
}
);
$('galleryPhoto').addEventListener('touchend',e=>{
const dx=e.changedTouches[0].clientX-sx;
if(Math.abs(dx)>45)showPhoto(photoIndex+(dx<0?1:-1))
}
,{
passive:true
}
)
}
if($('yesButton'))$('yesButton').addEventListener('click',yes);
if($('noButton')){
$('noButton').addEventListener('pointerenter',e=>{
if(e.pointerType==='mouse')dodge()
}
);
$('noButton').addEventListener('click',e=>{
e.preventDefault();
dodge()
}
);
$('noButton').addEventListener('touchstart',e=>{
e.preventDefault();
dodge()
}
,{
passive:false
}
)
}
if($('revealNote'))$('revealNote').addEventListener('click',()=>{
$('secretMessage').classList.toggle('show');
$('revealNote').textContent=$('secretMessage').classList.contains('show')?'Hide the note ♡':'Open your secret note ♡';
burst(12)
}
);
function openGift(){
if(!unlocked()){
toast('Finish our little love quest first 💗');
location.href='quest.html';
return
}
if(!$('giftBox'))return;
$('giftBox').classList.add('open');
$('loveLetter').classList.remove('hidden');
burst(30);
setTimeout(()=>$('loveLetter').scrollIntoView({
behavior:'smooth',block:'center'
}
),250)
}
if($('giftBox')){
$('giftBox').addEventListener('click',openGift);
$('giftBox').addEventListener('keydown',e=>{
if(e.key==='Enter'||e.key===' '){
e.preventDefault();
openGift()
}

}
)
}
if($('replay'))$('replay').addEventListener('click',()=>{
localStorage.removeItem('jeniesysQuestComplete');
questionIndex=0;
dodgeCount=0;
$('questCard').classList.remove('hidden');
$('questSuccess').classList.add('hidden');
renderQuestion();
updateLocks();
location.href='quest.html'
}
);
const vid=$('ourVideo');
if(vid)vid.addEventListener('error',()=>{
const ph=$('videoPlaceholder');
if(ph)ph.classList.remove('hidden')
}
);
if(vid)vid.addEventListener('loadedmetadata',()=>{
const ph=$('videoPlaceholder');
if(ph)ph.classList.add('hidden')
}
);
if($('year'))$('year').textContent=new Date().getFullYear();
renderQuestion();
if($('questSuccess')&&unlocked()){
$('questCard').classList.add('hidden');
$('questSuccess').classList.remove('hidden')
}
showPhoto(0);
updateLocks()
}
)();

