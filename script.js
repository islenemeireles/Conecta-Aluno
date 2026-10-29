document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{b.parentNode.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on')});
document.querySelectorAll('.like').forEach(b=>b.onclick=()=>{const on=b.classList.toggle('liked'),s=b.querySelector('span'),n=+b.dataset.n;s.textContent=on?n:n-1;b.dataset.n=on?n:n-1;if(on)b.dataset.n=n;});
const L=document.getElementById('login');
function nomeDe(v){let n=v.split('@')[0].trim();return n?n.charAt(0).toUpperCase()+n.slice(1):'Aluno'}
function detectar(email){
  const dom=(email.split('@')[1]||'').toLowerCase();
  for(const k in UNIS){if(dom.includes(k))return k}
  return 'uece'; // padrão da demonstração quando o domínio não é reconhecido
}
function aplicarUni(k){
  const u=UNIS[k];document.documentElement.dataset.uni=k;
  u.loginTitulo=u.slogan+'.';
  document.querySelectorAll('.sg').forEach(e=>e.textContent=u.sigla);
  document.querySelectorAll('.ia').forEach(e=>e.textContent=u.assistente);
  document.querySelectorAll('[data-k]').forEach(e=>{if(u[e.dataset.k]!==undefined)e.innerHTML=u[e.dataset.k]});
  const mr=document.getElementById('mapaReal'),me=document.getElementById('mapaEsq'),ml=document.getElementById('mapaLink');
  mr.hidden=!u.mapaEmbed;me.hidden=!!u.mapaEmbed;if(u.mapaEmbed){const f=mr.querySelector('iframe');if(f.getAttribute('src')!==u.mapaEmbed)f.src=u.mapaEmbed}ml.href=u.mapaLink||'#';
  document.getElementById('areas').innerHTML=u.areas.map(a=>'<div>'+a+'</div>').join('');
  document.getElementById('eventos').innerHTML=u.eventos.map(e=>'<div class="ev"><div class="date"><small>'+e.m+'</small>'+e.d+'</div><div><b>'+e.t+'</b><span>📍 '+e.l+'</span></div></div>').join('');
  renderPerfil(u);
  renderAjuda(u);
}
function entrar(v,k){aplicarUni(k);document.getElementById('pEmail').textContent=v;if(v.includes('@'))document.getElementById('sacEmail').value=v;mostrar('inicio');mostrarDica();document.title='Conecta Aluno – '+UNIS[k].sigla;document.querySelectorAll('.nome').forEach(e=>e.textContent=nomeDe(v));L.classList.add('hide');document.body.style.overflow=''}
function sair(){aplicarUni('uece');mostrar('inicio');abrirChat(false);document.title='Conecta Aluno';L.classList.remove('hide');document.body.style.overflow='hidden';document.getElementById('pw').value=''}
aplicarUni('uece');
try{const s=sessionStorage.getItem('ca_user'),k=sessionStorage.getItem('ca_uni');if(s&&UNIS[k])entrar(s,k);else document.body.style.overflow='hidden'}catch(e){document.body.style.overflow='hidden'}
document.getElementById('lf').addEventListener('submit',e=>{e.preventDefault();
  const em=document.getElementById('em').value,pw=document.getElementById('pw').value,err=document.getElementById('err');
  if(!em.trim()||!pw.trim()){err.textContent='Preencha e-mail e senha.';return}
  const k=detectar(em);
  err.textContent='';try{sessionStorage.setItem('ca_user',em);sessionStorage.setItem('ca_uni',k)}catch(x){}entrar(em,k)});
document.getElementById('out').onclick=()=>{try{sessionStorage.removeItem('ca_user');sessionStorage.removeItem('ca_uni')}catch(x){}sair()};

// Perfil e navegação entre telas
function mostrar(v){
  ['inicio','perfil','ajuda'].forEach(n=>{document.getElementById('view'+n.charAt(0).toUpperCase()+n.slice(1)).hidden=n!==v});
  document.querySelectorAll('nav [data-view]').forEach(a=>a.classList.toggle('on',a.dataset.view===v));
  window.scrollTo(0,0);
}
document.querySelectorAll('[data-view]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();mostrar(a.dataset.view)}));
function bioSalva(){try{return localStorage.getItem('ca_bio')}catch(e){return null}}
function renderPerfil(u){
  const p=u.perfil;if(!p)return;
  document.getElementById('pCurso').textContent=p.curso+' - '+u.sigla;
  document.getElementById('pDados').innerHTML=[['Instituição',p.universidade],['Curso',p.curso],['Semestre',p.semestre],['Matrícula',p.matricula],['Campus',p.campus]].map(d=>'<div><dt>'+d[0]+'</dt><dd>'+d[1]+'</dd></div>').join('');
  document.getElementById('pDisc').innerHTML=p.disciplinas.map(d=>'<li>'+d[0]+'<small>'+d[1]+'</small></li>').join('');
  document.getElementById('pInt').innerHTML=p.interesses.map(i=>'<span>'+i+'</span>').join('');
  document.getElementById('bioTxt').textContent=bioSalva()||p.bio;
}
const bioTxt=document.getElementById('bioTxt'),bioIn=document.getElementById('bioIn'),bioAc=document.getElementById('bioAcoes');
function editarBio(on){bioTxt.hidden=on;bioIn.hidden=!on;bioAc.hidden=!on;if(on){bioIn.value=bioTxt.textContent;bioIn.focus()}}
document.getElementById('editBio').onclick=()=>editarBio(bioIn.hidden);
document.getElementById('bioCancelar').onclick=()=>editarBio(false);
document.getElementById('bioSalvar').onclick=()=>{const t=bioIn.value.trim();if(t){bioTxt.textContent=t;try{localStorage.setItem('ca_bio',t)}catch(e){}}editarBio(false)};

// Ajuda, SAC e acessibilidade
function renderAjuda(u){
  const c=u.sac;if(!c)return;
  document.getElementById('sacCanais').innerHTML=[['E-mail',c.email],['Telefone',c.telefone],['Horário',c.horario],['Resposta',c.prazo]].map(d=>'<div><dt>'+d[0]+'</dt><dd>'+d[1]+'</dd></div>').join('');
}
// Observação: o formulário abaixo é uma demonstração, não envia a mensagem a ninguém (precisa de backend ou serviço de formulários).
document.getElementById('sacForm').addEventListener('submit',e=>{
  e.preventDefault();
  const em=document.getElementById('sacEmail').value.trim(),msg=document.getElementById('sacMsg').value.trim(),err=document.getElementById('sacErr'),ok=document.getElementById('sacOk');
  ok.hidden=true;
  if(!/\S+@\S+\.\S+/.test(em)){err.textContent='Informe um e-mail válido.';return}
  if(msg.length<10){err.textContent='Escreva sua mensagem (mínimo de 10 caracteres).';return}
  err.textContent='';
  const d=new Date(),proto='CA-'+d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+Math.floor(1000+Math.random()*9000);
  ok.textContent='Mensagem registrada! Seu protocolo é '+proto+'. Guarde esse número para acompanhar o atendimento.';
  ok.hidden=false;document.getElementById('sacMsg').value='';
});

// Chat flutuante (Typebot)
function abrirChat(on){
  const p=document.getElementById('chatPanel');
  if(on===undefined)on=p.hidden;
  p.hidden=!on;
  document.getElementById('fab').setAttribute('aria-expanded',String(on));
  document.getElementById('fabDica').hidden=true;
  if(!on)return;
  const u=UNIS[document.documentElement.dataset.uni]||UNIS.uece,url=u.chatUrl||'',f=document.getElementById('cpFrame');
  document.getElementById('cpVazio').hidden=!!url;f.hidden=!url;document.getElementById('cpNova').href=url||'#';
  if(url&&f.dataset.url!==url){f.src=url;f.dataset.url=url}
}
function mostrarDica(){const d=document.getElementById('fabDica');if(!document.getElementById('chatPanel').hidden)return;d.hidden=false;setTimeout(()=>{d.hidden=true},9000)}
document.getElementById('fab').onclick=()=>abrirChat();
document.getElementById('cpFechar').onclick=()=>{abrirChat(false);document.getElementById('fab').focus()};
document.querySelectorAll('[data-chat]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();abrirChat(true)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('chatPanel').hidden){abrirChat(false);document.getElementById('fab').focus()}});

// Acessibilidade
const ESCALAS=[0.9,1,1.15,1.3],AC={fonte:1,contraste:false,movimento:false,libras:false};
try{Object.assign(AC,JSON.parse(localStorage.getItem('ca_ac')||'{}'))}catch(e){}
function libras(on){
  let el=document.querySelector('[vw]');
  if(!on){if(el)el.style.display='none';return}
  if(el){el.style.display='';return}
  el=document.createElement('div');el.setAttribute('vw','');el.className='enabled';
  el.innerHTML='<div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>';
  document.body.appendChild(el);
  const sc=document.createElement('script');sc.src='https://vlibras.gov.br/app/vlibras-plugin.js';
  sc.onload=()=>{try{new window.VLibras.Widget('https://vlibras.gov.br/app')}catch(x){}};
  document.body.appendChild(sc);
}
function aplicarAc(){
  if(!(AC.fonte>=0&&AC.fonte<ESCALAS.length))AC.fonte=1;
  document.body.style.zoom=ESCALAS[AC.fonte];
  const r=document.documentElement;r.classList.toggle('contraste',!!AC.contraste);r.classList.toggle('reduz',!!AC.movimento);
  document.getElementById('acContraste').checked=!!AC.contraste;
  document.getElementById('acMovimento').checked=!!AC.movimento;
  document.getElementById('acLibras').checked=!!AC.libras;
  libras(!!AC.libras);
  try{localStorage.setItem('ca_ac',JSON.stringify(AC))}catch(e){}
}
document.querySelectorAll('[data-fonte]').forEach(b=>b.onclick=()=>{const d=+b.dataset.fonte;AC.fonte=d===0?1:Math.min(ESCALAS.length-1,Math.max(0,AC.fonte+d));aplicarAc()});
document.getElementById('acContraste').onchange=e=>{AC.contraste=e.target.checked;aplicarAc()};
document.getElementById('acMovimento').onchange=e=>{AC.movimento=e.target.checked;aplicarAc()};
document.getElementById('acLibras').onchange=e=>{AC.libras=e.target.checked;aplicarAc()};
document.getElementById('acReset').onclick=()=>{AC.fonte=1;AC.contraste=false;AC.movimento=false;AC.libras=false;aplicarAc()};
aplicarAc();

// Tema: claro ou escuro (na primeira visita, segue o aparelho)
const ICO={light:'☀️',dark:'🌙'},NOME={light:'claro',dark:'escuro'};
let tema=null;
try{tema=localStorage.getItem('ca_tema')}catch(e){}
if(tema!=='light'&&tema!=='dark')tema=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
function aplicarTema(){
  document.documentElement.dataset.theme=tema;
  document.querySelectorAll('.tema-btn').forEach(b=>{b.textContent=ICO[tema];b.title='Tema '+NOME[tema]+' (clique para mudar)';b.setAttribute('aria-label','Tema '+NOME[tema]+'. Clique para mudar')});
}
document.querySelectorAll('.tema-btn').forEach(b=>b.onclick=()=>{tema=tema==='dark'?'light':'dark';try{localStorage.setItem('ca_tema',tema)}catch(e){}aplicarTema()});
aplicarTema();